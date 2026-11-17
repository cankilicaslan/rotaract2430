// Organizasyon (asamble/konferans) sitelerinden bilgi ayıklayan saf fonksiyonlar.
// scripts/organizasyon.mjs kullanır; test/organizasyon.test.mjs test eder.

const AYLAR = { ocak: 1, şubat: 2, mart: 3, nisan: 4, mayıs: 5, haziran: 6, temmuz: 7, ağustos: 8, eylül: 9, ekim: 10, kasım: 11, aralık: 12 };
const KISALTMA = new Set(["PR", "BRT", "DRR", "RYLA", "UR", "RI"]);

const kucuk = (s) => s.toLocaleLowerCase("tr");
const buyukMu = (s) => /\p{L}/u.test(s) && s === s.toLocaleUpperCase("tr");
// "LİDERLİK GELİŞİMİ" -> "Liderlik gelişimi" (PR gibi kısaltmalar korunur)
const cumle = (s) => {
  const k = s.split(/\s+/).map((w) => (KISALTMA.has(w) ? w : kucuk(w))).join(" ");
  return k.charAt(0).toLocaleUpperCase("tr") + k.slice(1);
};
const iki = (n) => String(n).padStart(2, "0");
const satirlar = (metin) => String(metin || "").split(/\n/).map((s) => s.trim()).filter(Boolean);
const htmlCoz = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/** <head> içindeki başlık ve açıklama etiketleri (site JavaScript ile çizilse de bunlar düz HTML'dedir) */
export function metaOku(html, taban) {
  const meta = (ad) => {
    const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${ad}["'][^>]*content=["']([^"']*)["']`, "i"));
    return m ? htmlCoz(m[1]).trim() : "";
  };
  const baslik = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
  const gorsel = meta("og:image");
  return {
    baslik: htmlCoz(baslik).trim(),
    aciklama: meta("description"),
    ogBaslik: meta("og:title"),
    ogAciklama: meta("og:description"),
    gorsel: gorsel ? new URL(gorsel, taban).href : ""
  };
}

/** "5–7 MART 2027 ..." -> { baslangic, bitis, metin } */
export function tarihCoz(metin) {
  const m = String(metin || "").match(/(\d{1,2})\s*[–-]\s*(\d{1,2})\s+(\p{L}+)\s+(\d{4})/u);
  if (!m) return null;
  const ay = AYLAR[kucuk(m[3])];
  if (!ay) return null;
  return {
    baslangic: `${m[4]}-${iki(ay)}-${iki(m[1])}`,
    bitis: `${m[4]}-${iki(ay)}-${iki(m[2])}`,
    metin: `${+m[1]}–${+m[2]} ${cumle(m[3])} ${m[4]}`
  };
}

// Büyük harfli başlığın altındaki bölüm: alt başlık, paragraflar ve ardından gelen büyük harfli etiketler
function bolum(sat, baslikRe) {
  const i = sat.findIndex((s) => buyukMu(s) && baslikRe.test(s));
  if (i < 0) return null;
  const sonra = sat.slice(i + 1);
  const alt = sonra[0] && !buyukMu(sonra[0]) ? sonra[0] : "";
  const metinler = [], etiketler = [];
  for (let j = alt ? 1 : 0; j < sonra.length; j++) {
    const s = sonra[j];
    if (!buyukMu(s)) { if (etiketler.length) break; metinler.push(s); continue; }
    // Bir büyük harfli satırın ardından düz metin geliyorsa o satır sonraki bölümün başlığıdır
    if (sonra[j + 1] && !buyukMu(sonra[j + 1])) break;
    etiketler.push(s);
  }
  return { alt, metinler, etiketler };
}

/** Ana sayfanın görünen metninden: düzenleyen, hakkında, tema, amaç, odaklar, tarih */
export function anaSayfaAyikla(metin) {
  const sat = satirlar(metin);
  const hak = bolum(sat, /HAKKIMIZDA|HAKKINDA/);
  const tema = bolum(sat, /ANLAMI|TEMA/);
  const amac = bolum(sat, /NEDİR|AMAÇ/);
  const tarihSatiri = sat.find((s) => tarihCoz(s));
  return {
    altBaslik: sat.find((s) => /^\d+\.\s.*(Asamble|Konferans)/i.test(s)) || "",
    tarih: tarihSatiri ? tarihCoz(tarihSatiri) : null,
    duzenleyen: hak?.alt || "",
    hakkinda: hak?.metinler || [],
    tema: { alt: tema?.alt || "", aciklama: tema?.metinler || [], degerler: (tema?.etiketler || []).map(cumle) },
    amac: { alt: amac?.alt || "", aciklama: amac?.metinler || [] },
    odaklar: (amac?.etiketler || []).map(cumle)
  };
}

/** Ekip sayfası: isim / görev satırları sırayla gelir */
export function ekipAyikla(metin) {
  const sat = satirlar(metin), kisiler = [];
  for (let i = 0; i + 1 < sat.length; i += 2) kisiler.push({ ad: sat[i], gorev: sat[i + 1] });
  return kisiler;
}

/** İletişim sayfası: yalnızca konum ve e-posta (telefon bilerek alınmaz) */
export function iletisimAyikla(metin) {
  const sat = satirlar(metin);
  const sonraki = (re) => { const i = sat.findIndex((s) => re.test(s)); return i >= 0 ? sat[i + 1] || "" : ""; };
  return { yer: sonraki(/^KONUM$/), eposta: sonraki(/^E-?POSTA$/) };
}

const bosMu = (v) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

/** Yeni ayıklanan veriyi eskisiyle birleştirir; boş gelen alanlarda eski değer kalır */
export function birlestir(eski, yeni) {
  if (bosMu(yeni)) return eski;
  if (typeof yeni !== "object" || Array.isArray(yeni) || typeof eski !== "object" || eski == null || Array.isArray(eski)) return yeni;
  const sonuc = { ...eski };
  for (const k of Object.keys(yeni)) sonuc[k] = birlestir(eski[k], yeni[k]);
  return sonuc;
}
