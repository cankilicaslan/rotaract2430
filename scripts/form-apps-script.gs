/**
 * Rotaract Bölge 2430 — "Bölgeye yaz" formu
 * 2430rotaract.org'daki formdan gelen mesajı bölge e-postasına iletir ve
 * formu dolduran kişiye Türkçe bir alındı e-postası gönderir.
 *
 * Kurulum: script.google.com'da (bölge Google hesabıyla) yeni proje açın,
 * bu kodu Code.gs'e yapıştırın, Dağıt > Yeni dağıtım > Web uygulaması
 * (Yürütme: Ben, Erişim: Herkes) ile yayınlayın ve verilen URL'yi
 * js/data.js içindeki SITE.iletisim.formUrl alanına yazın.
 */

const BOLGE_EPOSTA = "2430brt@gmail.com";
const SITE_ADRESI = "https://2430rotaract.org";
const GUNLUK_SINIR = 40;          // Gmail kotasını korumak için günlük en fazla form
const AYNI_ADRES_BEKLEME = 600;   // Aynı e-postadan iki gönderim arası (saniye)
const KONULAR = ["Kulübe katılmak", "Yeni kulüp kurmak", "Gönüllülük / proje", "İş birliği / sponsorluk", "Diğer"];
// İngilizce sayfadan gelen konular Türkçeye çevrilir
const KONU_CEVIR = {
  "Join a club": "Kulübe katılmak", "Start a new club": "Yeni kulüp kurmak",
  "Volunteering / project": "Gönüllülük / proje", "Partnership / sponsorship": "İş birliği / sponsorluk", "Other": "Diğer",
};

function doGet() {
  return yanit({ ok: true, durum: "çalışıyor" });
}

function doPost(e) {
  try {
    const v = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Bot önlemleri: gizli alan doluysa ya da form 3 saniyeden kısa sürede gönderildiyse sessizce geç
    if (v._honey) return yanit({ ok: true });
    if (v.t && Date.now() - Number(v.t) < 3000) return yanit({ ok: true });

    const ad = temizle(v.ad, 80);
    const eposta = temizle(v.email, 120).toLowerCase();
    let konu = temizle(v.konu, 60);
    konu = KONU_CEVIR[konu] || (KONULAR.indexOf(konu) >= 0 ? konu : "Diğer");
    const sehir = temizle(v.sehir, 80);
    const mesaj = temizle(v.mesaj, 3000, true);
    const sayfa = temizle(v.sayfa, 200);

    if (!ad || !mesaj) return yanit({ ok: false, hata: "eksik" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(eposta)) return yanit({ ok: false, hata: "eposta" });

    // Kötüye kullanım sınırları
    const onbellek = CacheService.getScriptCache();
    const adresAnahtari = "adres:" + eposta;
    if (onbellek.get(adresAnahtari)) return yanit({ ok: false, hata: "sik" });
    const gunAnahtari = "gun:" + Utilities.formatDate(new Date(), "Europe/Istanbul", "yyyyMMdd");
    const bugun = Number(onbellek.get(gunAnahtari) || 0);
    if (bugun >= GUNLUK_SINIR || MailApp.getRemainingDailyQuota() < 2) return yanit({ ok: false, hata: "kota" });

    const zaman = Utilities.formatDate(new Date(), "Europe/Istanbul", "d.MM.yyyy HH:mm");

    // 1) Bölgeye: formdaki tüm bilgiler
    MailApp.sendEmail({
      to: BOLGE_EPOSTA,
      replyTo: eposta,
      name: "Rotaract Bölge 2430 Web Sitesi",
      subject: "[Site] " + konu + " · " + ad,
      body: [
        "Web sitesindeki iletişim formundan yeni bir mesaj geldi.",
        "",
        "Ad soyad: " + ad,
        "E-posta: " + eposta,
        "Konu: " + konu,
        "Şehir / kulüp: " + (sehir || "-"),
        "Gönderim zamanı: " + zaman,
        "",
        "Mesaj:",
        mesaj,
        "",
        "Bu e-postayı yanıtladığınızda cevabınız doğrudan " + ad + " adlı kişiye gider.",
      ].join("\n"),
      htmlBody: sablon(
        "Web sitesinden yeni mesaj",
        "İletişim formundan yeni bir mesaj geldi. Bu e-postayı <strong>Yanıtla</strong> ile cevaplarsanız yanıtınız doğrudan formu dolduran kişiye gider.",
        satirlar([
          ["Ad soyad", ad],
          ["E-posta", '<a href="mailto:' + html(eposta) + '">' + html(eposta) + "</a>", true],
          ["Konu", konu],
          ["Şehir / kulüp", sehir || "-"],
          ["Gönderim zamanı", zaman],
        ]) + '<p style="margin:22px 0 6px;font-weight:700;color:#1D1A22">Mesaj</p>' +
          '<div style="white-space:pre-wrap;background:#FBF7F9;border-radius:12px;padding:14px 16px;color:#1D1A22;line-height:1.55">' + html(mesaj) + "</div>" +
          (sayfa ? '<p style="margin:16px 0 0;font-size:12px;color:#6E6876">Gönderildiği sayfa: ' + html(sayfa) + "</p>" : "")
      ),
    });

    // 2) Formu dolduran kişiye: Türkçe alındı e-postası (mesaj metni tekrar edilmez)
    MailApp.sendEmail({
      to: eposta,
      replyTo: BOLGE_EPOSTA,
      name: "Rotaract Bölge 2430",
      subject: "Mesajınızı aldık · Rotaract Bölge 2430",
      body: [
        "Merhaba " + ad + ",",
        "",
        "Rotaract Bölge 2430'a yazdığınız için teşekkür ederiz. Mesajınız bölge ekibine ulaştı; en kısa sürede bu adres üzerinden size dönüş yapacağız.",
        "",
        "Konu: " + konu,
        "Gönderim zamanı: " + zaman,
        "",
        "Bu arada kulüplerimizi ve yaklaşan organizasyonları " + SITE_ADRESI + " adresinde inceleyebilirsiniz.",
        "",
        "Sevgilerimizle,",
        "Rotaract Bölge 2430",
        "",
        "Bu formu siz doldurmadıysanız bu e-postayı dikkate almayın.",
      ].join("\n"),
      htmlBody: sablon(
        "Mesajınızı aldık",
        "Merhaba <strong>" + html(ad) + "</strong>,<br><br>Rotaract Bölge 2430'a yazdığınız için teşekkür ederiz. Mesajınız bölge ekibine ulaştı; en kısa sürede bu e-posta adresi üzerinden size dönüş yapacağız.",
        satirlar([["Konu", konu], ["Gönderim zamanı", zaman]]) +
          '<p style="margin:24px 0 0"><a href="' + SITE_ADRESI + '" style="display:inline-block;background:#D41367;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">Kulüpleri ve organizasyonları incele</a></p>' +
          '<p style="margin:24px 0 0;color:#1D1A22">Sevgilerimizle,<br><strong>Rotaract Bölge 2430</strong></p>' +
          '<p style="margin:20px 0 0;font-size:12px;color:#6E6876">Bu formu siz doldurmadıysanız bu e-postayı dikkate almayın.</p>'
      ),
    });

    onbellek.put(adresAnahtari, "1", AYNI_ADRES_BEKLEME);
    onbellek.put(gunAnahtari, String(bugun + 1), 60 * 60 * 26);
    return yanit({ ok: true });
  } catch (hata) {
    console.error(hata);
    return yanit({ ok: false, hata: "sunucu" });
  }
}

/* ---------- yardımcılar ---------- */
function yanit(nesne) {
  return ContentService.createTextOutput(JSON.stringify(nesne)).setMimeType(ContentService.MimeType.JSON);
}

function temizle(deger, enFazla, cokSatir) {
  let s = String(deger == null ? "" : deger).trim();
  s = cokSatir ? s.replace(/\r\n?/g, "\n").replace(/\n{4,}/g, "\n\n\n") : s.replace(/\s+/g, " ");
  return s.slice(0, enFazla);
}

function html(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function satirlar(liste) {
  return '<table role="presentation" style="width:100%;border-collapse:collapse;margin-top:18px">' +
    liste.map(function (r) {
      return '<tr><td style="padding:9px 0;border-bottom:1px solid #ECE6EC;color:#6E6876;width:38%;font-size:14px">' + html(r[0]) +
        '</td><td style="padding:9px 0;border-bottom:1px solid #ECE6EC;color:#1D1A22;font-weight:600;font-size:14px">' + (r[2] ? r[1] : html(r[1])) + "</td></tr>";
    }).join("") + "</table>";
}

function sablon(baslik, giris, icerik) {
  return '<div style="background:#F4EEF1;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">' +
    '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden">' +
    '<div style="background:linear-gradient(120deg,#D41367,#7E0A3D);background-color:#D41367;padding:22px 26px;color:#fff">' +
    '<div style="font-size:13px;font-weight:700;opacity:.9">Rotaract Bölge 2430</div>' +
    '<div style="font-size:22px;font-weight:800;margin-top:4px">' + html(baslik) + "</div></div>" +
    '<div style="padding:24px 26px 28px;font-size:15px;line-height:1.55;color:#4A4552">' + giris + icerik + "</div></div>" +
    '<p style="text-align:center;font-size:12px;color:#6E6876;margin:14px 0 0">' +
    '<a href="' + SITE_ADRESI + '" style="color:#D41367;text-decoration:none">2430rotaract.org</a></p></div>';
}
