/* ==========================================================================
   Bölge takvimi yardımcıları — hem tarayıcıda (window.Etkinlik) hem de
   Node'da (scripts/takvim.mjs, testler) kullanılır.
   - icsOku:      Google Takvim iCal metnini etkinlik listesine çevirir
   - turBul:      başlıktan tür çıkarır: "parti" | "proje" | "etkinlik"
                  Başlığa #parti / #proje / #etkinlik yazılırsa o kullanılır.
   - kulupBul:    başlıkta adı geçen Rotaract kulüplerini bulur
   - yaklasanlar: bitmemiş etkinlikleri başlangıca göre sıralar
   ========================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Etkinlik = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Türkçe harfleri sadeleştirir: "Çayyolu" -> "cayyolu"
  const sade = (s) => String(s || "").toLocaleLowerCase("tr").replace(/ı/g, "i")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");

  /* ---------- iCal ---------- */
  // param: "TZID=Europe/Istanbul" gibi; Türkiye 2016'dan beri yaz saati uygulamıyor (sabit +03:00)
  const tarih = (deger, tumGun, param = "") => {
    const d = deger.trim();
    if (tumGun || /^\d{8}$/.test(d)) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
    const m = d.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
    if (!m) return d;
    const bolge = m[7] || (/TZID=Europe\/Istanbul/i.test(param) ? "+03:00" : "");
    return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${bolge}`;
  };
  const birGunOnce = (ymd) => {
    const d = new Date(`${ymd}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  };
  const metin = (s) => s.replace(/\\n/gi, " ").replace(/\\([,;\\])/g, "$1").trim();

  function icsOku(ics) {
    const satirlar = String(ics).replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "").split("\n");
    const sonuc = [];
    let e = null, altBlok = 0;
    for (const satir of satirlar) {
      if (satir === "BEGIN:VEVENT") { e = {}; altBlok = 0; continue; }
      // VALARM gibi iç bloklardaki alanlar etkinliğin alanlarını ezmesin
      if (e && satir.startsWith("BEGIN:")) { altBlok++; continue; }
      if (e && altBlok && satir.startsWith("END:")) { altBlok--; continue; }
      if (altBlok) continue;
      if (satir === "END:VEVENT") {
        // İptal edilenler ve "XXX" gibi yer tutucu başlıklar atlanır
        if (e && e.STATUS !== "CANCELLED" && e.DTSTART && !/^\s*x+\s*$/i.test(e.SUMMARY || "")) {
          const tumGun = /VALUE=DATE(?!-)/.test(e.DTSTART_P || "") || /^\d{8}$/.test(e.DTSTART);
          const baslangic = tarih(e.DTSTART, tumGun, e.DTSTART_P);
          let bitis = e.DTEND ? tarih(e.DTEND, tumGun, e.DTEND_P) : baslangic;
          if (tumGun && e.DTEND) bitis = birGunOnce(bitis); // iCal'de tüm gün bitişi hariçtir
          if (bitis < baslangic) bitis = baslangic;
          sonuc.push({
            id: e.UID || `${baslangic}-${sonuc.length}`,
            baslik: metin(e.SUMMARY || ""),
            baslangic, bitis, tumGun,
            yer: metin(e.LOCATION || "")
          });
        }
        e = null;
        continue;
      }
      if (!e) continue;
      const i = satir.indexOf(":");
      if (i < 0) continue;
      const [ad, ...param] = satir.slice(0, i).split(";");
      e[ad] = satir.slice(i + 1);
      if (param.length) e[`${ad}_P`] = param.join(";");
    }
    return sonuc;
  }

  /* ---------- Tür ---------- */
  const ETIKET = /#(parti|proje|etkinlik)\b/i;
  const OYUN = /\b(game|oyun|turnuva\w*|bowling|dart)\b/;
  const PROJE = /\b(kan|kanser\w*|mama\w*|stant\w*|kadin emegi|bagis\w*|yardim\w*|farkindalik\w*|cinar\w*|fidan\w*|agac\w*|temizli\w*|burs\w*|kitap\w*|saglik\w*|engelli\w*|hayvan\w*|paws|proje\w*|kampanya\w*|sosyal sorumluluk)\b/;
  const PARTI = /\b(parti\w*|party|gece\w*|balo\w*|night|kokteyl\w*|halloween|maskeli|masquerade|o[ck]toberfest|flashback|kutlama\w*|dans\w*)\b/;

  function turBul(baslik) {
    const etiket = String(baslik || "").match(ETIKET);
    if (etiket) return etiket[1].toLowerCase();
    const s = sade(baslik);
    if (PROJE.test(s)) return "proje";
    if (OYUN.test(s)) return "etkinlik";
    if (PARTI.test(s)) return "parti";
    return "etkinlik";
  }
  const baslikTemizle = (baslik) => String(baslik || "").replace(/\s*#(parti|proje|etkinlik)\b/gi, "").trim();

  /* ---------- Kulüp eşleşmesi ---------- */
  // Takvimde kullanılan kısaltmalar (kulüp id -> ek adlar)
  const EK_AD = { "ankara-gaziosmanpasa": ["gop"] };
  const kacis = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function kulupBul(baslik, kulupler) {
    const s = " " + sade(baslik).replace(/&/g, " & ").replace(/\s+/g, " ") + " ";
    return (kulupler || []).filter((k) => {
      const kisa = sade(k.ad.replace(/ Rotaract Kulübü$/, ""));
      const adlar = new Set([kisa, ...(EK_AD[k.id] || [])]);
      if (kisa.startsWith("ankara ")) adlar.add(kisa.slice(7));
      else if (k.il === "Ankara") adlar.add(`ankara ${kisa}`);
      // Ad, ardından "Rotaract" gelirse eşleşir. "X & Y Rotaract" / "X ve Y Rotaract" gibi
      // ortak etkinliklerde de, aynı başlık parçasında ("-" öncesi) "rotaract" geçmesi şartıyla
      return [...adlar].some((ad) =>
        new RegExp(`[^a-z]${kacis(ad)} (?:(?:rotary ve )?rotaract|(?:& |ve )[^-]*?rotaract)`).test(s));
    });
  }

  // "3.Grup Kulüpleri ..." / "5-6. Grup ..." -> "3" / "5-6" (yalnızca var olan gruplar)
  function grupBul(baslik, kulupler) {
    const m = String(baslik || "").match(/(?:^|[^\d.])(\d+(?:-\d+)?)\.\s*grup\b/i);
    if (!m) return null;
    return (kulupler || []).some((k) => k.grup === m[1]) ? m[1] : null;
  }

  /* ---------- Yaklaşanlar ---------- */
  const bugunTR = (now) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(now);

  function yaklasanlar(etkinlikler, now = new Date()) {
    const bugun = bugunTR(now);
    return (etkinlikler || [])
      .filter((e) => (e.tumGun ? e.bitis >= bugun : new Date(e.bitis) >= now))
      .sort((a, b) => a.baslangic.localeCompare(b.baslangic) || a.baslik?.localeCompare?.(b.baslik || "") || 0);
  }

  return { icsOku, turBul, baslikTemizle, kulupBul, grupBul, yaklasanlar, sade };
});
