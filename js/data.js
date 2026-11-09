/* ==========================================================================
   ROTARACT BÖLGE 2430 — SİTE VERİLERİ
   --------------------------------------------------------------------------
   Sitedeki tüm içerik bu dosyadan gelir.
   Kaynaklar: 2026-2027 Başkanlar Listesi, 2026-2027 Bölge Görevlileri Listesi,
   My Rotary Club Finder (toplantı yeri / gün / saat) — Kasım 2026.

   Gizlilik: başkan e-postaları bölgenin onayıyla yayında; telefon numaraları
   ve doğum günleri bilerek EKLENMEDİ.
   ========================================================================== */

window.SITE = {
  donem: "2026–2027",
  donemTemasi: "Kalıcı Etki Yarat",

  iletisim: {
    eposta: "2430brt@gmail.com",
    instagram: "https://www.instagram.com/2430rotaract/",
    instagramKullanici: "@2430rotaract",
    youtube: "https://www.youtube.com/@rotaractb%C3%B6lge2430"
  },

  linkler: {
    rotaryInternational: "https://www.rotary.org/tr",
    rotary2430: "https://www.rotary2430.org.tr",
    interact2430: "",          // TODO: Interact 2430 web adresi bekleniyor
    myRotary: "https://my.rotary.org/",
    clubFinder: "https://my.rotary.org/en/search/club-finder"
  }
};

/* --------------------------------------------------------------------------
   İLLER — Rotaract kulübü bulunan iller ve coğrafi bölgeleri
   -------------------------------------------------------------------------- */
window.ILLER = [
  { il: "Ankara",    bolge: "İç Anadolu" },
  { il: "Eskişehir", bolge: "İç Anadolu" },
  { il: "Konya",     bolge: "İç Anadolu" },
  { il: "Kayseri",   bolge: "İç Anadolu" },
  { il: "Antalya",   bolge: "Akdeniz" },
  { il: "Mersin",    bolge: "Akdeniz" },
  { il: "Adana",     bolge: "Akdeniz" },
  { il: "Hatay",     bolge: "Akdeniz" },
  { il: "Samsun",    bolge: "Karadeniz" },
  { il: "Trabzon",   bolge: "Karadeniz" },
  { il: "Amasya",    bolge: "Karadeniz" },
  { il: "Gaziantep", bolge: "Güneydoğu Anadolu" },
  { il: "Bakü",      bolge: "Azerbaycan" }
];

/* --------------------------------------------------------------------------
   KULÜPLER
   Alanlar: id, ad, il, ilce, grup, baskan,
            toplanti {gun, saat, yer, adres, siklik, dil, format},
            instagram (isteğe bağlı)
   Boş bırakılan alanlar sitede "Bilgi bekleniyor" olarak görünür.
   -------------------------------------------------------------------------- */
{ // yardımcı fonksiyon yalnızca bu blokta geçerli
const T = (gun, saat, yer = "", siklik = "", extra = {}) => ({ gun, saat, yer, siklik, ...extra });

window.KULUPLER = [
  /* ---- 1. GRUP ---- */
  { id: "ankara-incek", ad: "Ankara İncek Rotaract Kulübü", il: "Ankara", ilce: "", grup: "1", baskan: "Furkan Ceran", baskanFoto: "assets/foto/furkan-ceran.jpg", eposta: "frknceran@gmail.com",
    toplanti: T("Perşembe", "19:30", "Workinton Next Level") },
  { id: "ankara-anittepe", ad: "Ankara Anıttepe Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "1", baskan: "Simay Oğuzkurt", baskanFoto: "assets/foto/simay-oguzkurt.jpg", eposta: "simayoguz@gmail.com",
    toplanti: T("Perşembe", "19:30", "HYBRIDHUB", "", { adres: "Kızılırmak, Yücel Seçkiner Cd. No:24 D:E, 06530 Çankaya/Ankara", dil: "Türkçe" }) },
  { id: "ankara-ulus", ad: "Ankara Ulus Rotaract Kulübü", il: "Ankara", ilce: "", grup: "1", baskan: "Furkan Cepeci", baskanFoto: "assets/foto/furkan-cepeci.jpg", eposta: "isfc.98@gmail.com",
    toplanti: T("Perşembe", "19:30", "Workinton", "", { dil: "Türkçe" }) },
  { id: "ankara-kavaklidere", ad: "Ankara Kavaklıdere Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "1", baskan: "Esra Solhan", baskanFoto: "assets/foto/esra-solhan.jpg", eposta: "solhanesra2@gmail.com",
    toplanti: T("Cuma", "19:30", "Midi Otel", "Ayın 1. ve 3. Cuması") },
  { id: "ankara", ad: "Ankara Rotaract Kulübü", il: "Ankara", ilce: "", grup: "1", baskan: "Zeynep Sude Zarif", baskanFoto: "assets/foto/zeynep-sude-zarif.jpg", eposta: "zeynepszarif@gmail.com",
    toplanti: T("Perşembe", "19:30", "Suit Ofis", "Ayın 2. ve 4. Perşembesi", { dil: "Türkçe" }) },
  { id: "cankaya", ad: "Çankaya Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "1", baskan: "Fatih Acemoğlu", baskanFoto: "assets/foto/fatih-acemoglu.jpg", eposta: "fatihacemoglu1@gmail.com",
    toplanti: T("Perşembe", "19:30", "", "", { dil: "Türkçe" }) },
  { id: "anadolu-evrensel", ad: "Anadolu Evrensel Rotaract Kulübü", il: "Eskişehir", ilce: "", grup: "1", baskan: "Zeynep Su Öncel", eposta: "zeynepsuoncel@gmail.com",
    toplanti: T("Pazar", "20:30"), instagram: "evrenselrotaract" },

  /* ---- 2. GRUP ---- */
  { id: "ankara-kizilay", ad: "Ankara Kızılay Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "2", baskan: "Gözde Bal", baskanFoto: "assets/foto/gozde-bal.jpg", eposta: "gozdebal@hotmail.com",
    toplanti: T("Pazartesi", "19:30", "Loophole", "Ayın 2. ve 4. Pazartesisi", { dil: "Türkçe" }) },
  { id: "ankara-cayyolu", ad: "Ankara Çayyolu Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "2", baskan: "Damla Kıvılcım Demir", baskanFoto: "assets/foto/damla-kivilcim-demir.jpg", eposta: "damlademir22.02@gmail.com",
    toplanti: T("", "") },
  { id: "ankara-gaziosmanpasa", ad: "Ankara Gaziosmanpaşa Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "2", baskan: "İsmail Eser", baskanFoto: "assets/foto/ismail-eser.jpg", eposta: "eserismail65@gmail.com",
    toplanti: T("Salı", "19:30", "Workinton Next Level", "Ayın 2. ve 4. Salısı", { dil: "Türkçe" }) },
  { id: "ankara-beysukent", ad: "Ankara Beysukent Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "2", baskan: "Mücahit Çekici", baskanFoto: "assets/foto/mucahit-cekici.jpg", eposta: "mucahit.cekici@icloud.com",
    toplanti: T("Pazartesi", "19:30", "", "", { dil: "Türkçe" }) },
  { id: "ankara-international", ad: "Ankara International Rotaract Kulübü", il: "Ankara", ilce: "", grup: "2", baskan: "Mehmet Ali Özkavacıklı", baskanFoto: "assets/foto/mehmet-ali-ozkavacikli.jpg", eposta: "mehmetaliozkavacikli@gmail.com",
    toplanti: T("Pazartesi", "19:00", "", "", { dil: "İngilizce" }) },
  { id: "gazi", ad: "Gazi Rotaract Kulübü", il: "Ankara", ilce: "", grup: "2", baskan: "Ahmet Furkan Ardıç", baskanFoto: "assets/foto/ahmet-furkan-ardic.jpg", eposta: "ahmetfurkanardic@gmail.com",
    toplanti: T("", "") },
  { id: "konya-meram", ad: "Konya Meram Rotaract Kulübü", il: "Konya", ilce: "Meram", grup: "2", baskan: "Necati Erdem Esen", baskanFoto: "assets/foto/necati-erdem-esen.jpg", eposta: "necatierdem.esen@gmail.com",
    toplanti: T("Perşembe", "20:00", "", "", { format: "Yüz yüze ve çevrim içi (Zoom)" }) },

  /* ---- 3. GRUP ---- */
  { id: "ankara-kocatepe", ad: "Ankara Kocatepe Rotaract Kulübü", il: "Ankara", ilce: "", grup: "3", baskan: "Müge Acar", baskanFoto: "assets/foto/muge-acar.jpg", eposta: "muge.gulenn@gmail.com",
    toplanti: T("Cuma", "19:30", "Yıldırım Kule Toplantı Odası", "Ayın 2. ve 4. Cuması", { dil: "Türkçe" }) },
  { id: "ankara-tandogan", ad: "Ankara Tandoğan Rotaract Kulübü", il: "Ankara", ilce: "", grup: "3", baskan: "Ahmet Kağan Kaya", baskanFoto: "assets/foto/ahmet-kagan-kaya.jpg", eposta: "akagankaya60@gmail.com",
    toplanti: T("Perşembe", "19:30", "Workinton Next Level", "Ayın 2. ve 4. Perşembesi") },
  { id: "ankara-baskent", ad: "Ankara Başkent Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "3", baskan: "Batuhan Çay", baskanFoto: "assets/foto/batuhan-cay.jpg", eposta: "caybatuhan@yahoo.com",
    toplanti: T("Cuma", "19:30", "Workinton Next Level", "Ayın 1. ve 3. Cuması", { dil: "Türkçe" }) },
  { id: "ankara-maltepe", ad: "Ankara Maltepe Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "3", baskan: "Berke Süzen", baskanFoto: "assets/foto/berke-suzen.jpg", eposta: "berkesuzen1996@gmail.com",
    toplanti: T("Salı", "19:30", "Workinton Next Level") },
  { id: "ankara-koru", ad: "Ankara Koru Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "3", baskan: "Nazlım İlke Süngü", baskanFoto: "assets/foto/nazlim-ilke-sungu.jpg", eposta: "ilkesungu03@gmail.com",
    toplanti: T("Çarşamba", "19:30", "Workinton Söğütözü", "Ayın 1. ve 3. Çarşambası", { dil: "Türkçe" }) },
  { id: "ankara-bahcelievler", ad: "Ankara Bahçelievler Rotaract Kulübü", il: "Ankara", ilce: "Çankaya", grup: "3", baskan: "İdil Gökçek", baskanFoto: "assets/foto/idil-gokcek.jpg", eposta: "idilgokcek123@gmail.com",
    toplanti: T("Pazar", "16:30", "Workinton Next Level", "Ayın 1. ve 3. Pazarı", { dil: "Türkçe" }) },

  /* ---- 4. GRUP ---- */
  { id: "mersin-kizkalesi", ad: "Mersin Kızkalesi Rotaract Kulübü", il: "Mersin", ilce: "Erdemli", grup: "4", baskan: "Hazal Pırıl Demirkol", baskanFoto: "assets/foto/hazal-piril-demirkol.jpg", eposta: "hazlp7@gmail.com",
    toplanti: T("Çarşamba", "19:30", "Rotary Evi", "Ayın 1. ve 3. Çarşambası", { dil: "Türkçe" }) },
  { id: "mersin", ad: "Mersin Rotaract Kulübü", il: "Mersin", ilce: "", grup: "4", baskan: "Simay Ünlü", baskanFoto: "assets/foto/simay-unlu.jpg", eposta: "av.simaykurtoglu@gmail.com",
    toplanti: T("Perşembe", "19:30", "", "", { dil: "Türkçe" }) },
  { id: "akdeniz", ad: "Akdeniz Rotaract Kulübü", il: "Mersin", ilce: "Akdeniz", grup: "4", baskan: "Tuğçe Derkuş", baskanFoto: "assets/foto/tugce-derkus.jpg", eposta: "psk.tugcederkus@gmail.com",
    toplanti: T("Salı", "19:15", "Mersin Divan Otel", "", { dil: "İngilizce" }) },
  { id: "mersin-toros", ad: "Mersin Toros Rotaract Kulübü", il: "Mersin", ilce: "", grup: "4", baskan: "Mehmet Babaoğlu", baskanFoto: "assets/foto/mehmet-babaoglu.jpg", eposta: "babaoglu.mehmet@hotmail.com",
    toplanti: T("Salı", "19:30", "", "Ayın 2. ve 4. Salısı", { dil: "Türkçe" }) },
  { id: "tarsus", ad: "Tarsus Rotaract Kulübü", il: "Mersin", ilce: "Tarsus", grup: "4", baskan: "Mehmet Yarkın Yılmaz", baskanFoto: "assets/foto/mehmet-yarkin-yilmaz.jpg", eposta: "myarkinyilmaz@gmail.com",
    toplanti: T("Çarşamba", "19:30", "", "", { dil: "Türkçe" }) },

  /* ---- 5-6. GRUP ---- */
  { id: "samsun", ad: "Samsun Rotaract Kulübü", il: "Samsun", ilce: "", grup: "5-6", baskan: "Polen Su Uzdil", baskanFoto: "assets/foto/polen-su-uzdil.jpg", eposta: "polensuzdil@gmail.com",
    toplanti: T("", "") },
  { id: "samsun-atakum", ad: "Samsun Atakum Rotaract Kulübü", il: "Samsun", ilce: "Atakum", grup: "5-6", baskan: "Hale Unutmaz", baskanFoto: "assets/foto/hale-unutmaz.jpg", eposta: "hale.unutmaz96@gmail.com",
    toplanti: T("Perşembe", "19:30", "Dedeman Elina Otel", "Ayın 2. ve 4. Perşembesi", { dil: "Türkçe" }) },
  { id: "samsun-canik", ad: "Samsun Canik Rotaract Kulübü", il: "Samsun", ilce: "Canik", grup: "5-6", baskan: "Hanedan Bilevci", baskanFoto: "assets/foto/hanedan-bilevci.jpg", eposta: "bilevcihanedan@gmail.com",
    toplanti: T("Salı", "19:00"), instagram: "canikrotaract" },
  { id: "ilkadim-1919", ad: "İlkadım 1919 Rotaract Kulübü", il: "Samsun", ilce: "İlkadım", grup: "5-6", baskan: "Veli Can Erdoğan", baskanFoto: "assets/foto/veli-can-erdogan.jpg", eposta: "veli.c0709@gmail.com",
    toplanti: T("Perşembe", "19:00") },
  { id: "trabzon-ortahisar", ad: "Trabzon Ortahisar Rotaract Kulübü", il: "Trabzon", ilce: "Ortahisar", grup: "5-6", baskan: "Hamza İrtem", eposta: "irtembusiness@gmail.com",
    toplanti: T("Salı", "18:30") },
  { id: "amasya-yesilirmak", ad: "Amasya Yeşilırmak Rotaract Kulübü", il: "Amasya", ilce: "Merkez", grup: "5-6", baskan: "Simge Kılınç", baskanFoto: "assets/foto/simge-kilinc.jpg", eposta: "simgekilinc21@gmail.com",
    toplanti: T("Pazar", "20:00", "", "", { format: "Yüz yüze ve çevrim içi (Zoom)" }) },

  /* ---- 7. GRUP ---- */
  { id: "alanya", ad: "Alanya Rotaract Kulübü", il: "Antalya", ilce: "Alanya", grup: "7", baskan: "Türkan Nil Bakalım", baskanFoto: "assets/foto/turkan-nil-bakalim.jpg", eposta: "nilbakalim@gmail.com",
    toplanti: T("Perşembe", "19:00", "İskele Kaptan Otel", "Ayın 1. ve 3. haftası") },
  { id: "antalya", ad: "Antalya Rotaract Kulübü", il: "Antalya", ilce: "", grup: "7", baskan: "Gamze Akdemir", baskanFoto: "assets/foto/gamze-akdemir.jpg", eposta: "gamzeakdemirr@gmail.com",
    toplanti: T("Cumartesi", "20:00", "Lara Balık Evi", "", { dil: "Türkçe", format: "Yüz yüze ve çevrim içi (Zoom)" }) },
  { id: "antalya-aspendos", ad: "Antalya Aspendos Rotaract Kulübü", il: "Antalya", ilce: "", grup: "7", baskan: "Nuriye Ceren Acar", baskanFoto: "assets/foto/nuriye-ceren-acar.jpg", eposta: "ncerenacar@gmail.com",
    toplanti: T("Perşembe", "20:00", "", "", { dil: "Türkçe" }) },
  { id: "antalya-falez", ad: "Antalya Falez Rotaract Kulübü", il: "Antalya", ilce: "", grup: "7", baskan: "Barış Can Kalkay", baskanFoto: "assets/foto/baris-can-kalkay.jpg", eposta: "kalkaybariscan@gmail.com",
    toplanti: T("", "") },
  { id: "antalya-kaleici", ad: "Antalya Kaleiçi Rotaract Kulübü", il: "Antalya", ilce: "Muratpaşa", grup: "7", baskan: "Nurol Arlıoğlu",
    toplanti: T("Salı", "20:00", "Lara Balık Evi", "Ayın 2. ve 4. Salısı") },
  { id: "antalya-perge", ad: "Antalya Perge Rotaract Kulübü", il: "Antalya", ilce: "", grup: "7", baskan: "Niyazi Şen", baskanFoto: "assets/foto/niyazi-sen.jpg", eposta: "av.niyazisen@gmail.com",
    toplanti: T("Çarşamba", "19:30", "", "Ayın 1. ve 3. haftası", { dil: "Türkçe" }) },

  /* ---- 8. GRUP ---- */
  { id: "baku-khazar", ad: "Bakü Khazar Rotaract Kulübü", il: "Bakü", ilce: "", grup: "8", baskan: "Nihad Ahmadli", eposta: "nihad.ahmadli.03@gmail.com",
    toplanti: T("Cuma", "19:00") },

  /* ---- 9. GRUP ---- */
  { id: "gaziantep-alleben", ad: "Gaziantep Alleben Rotaract Kulübü", il: "Gaziantep", ilce: "", grup: "9", baskan: "İlayda Kıroğlu", baskanFoto: "assets/foto/ilayda-kiroglu.jpg", eposta: "ilayda.krogluu@gmail.com",
    toplanti: T("Salı", "19:00", "Teymur Continental Hotel") },
  { id: "gaziantep-ipekyolu", ad: "Gaziantep İpekyolu Rotaract Kulübü", il: "Gaziantep", ilce: "", grup: "9", baskan: "Yonca Fıstık", baskanFoto: "assets/foto/yonca-fistik.jpg", eposta: "yoncafistik99@gmail.com",
    toplanti: T("Perşembe", "20:00", "Teymur Continental Hotel") },
  { id: "gaziantep-kavaklik", ad: "Gaziantep Kavaklık Rotaract Kulübü", il: "Gaziantep", ilce: "", grup: "9", baskan: "M. Ali Boztoprak", baskanFoto: "assets/foto/m-ali-boztoprak.jpg", eposta: "mboztoprak27@icloud.com",
    toplanti: T("Salı", "19:30", "Teymur Continental Hotel", "Ayın 1. ve 3. haftası") },
  { id: "gaziantep-yesemek", ad: "Gaziantep Yesemek Rotaract Kulübü", il: "Gaziantep", ilce: "", grup: "9", baskan: "Onur Özönel", baskanFoto: "assets/foto/onur-ozonel.jpg", eposta: "onurozonel@hotmail.com",
    toplanti: T("Perşembe", "19:30", "Grand Hotel Gaziantep", "", { dil: "Türkçe" }) },

  /* ---- 10. GRUP ---- */
  { id: "adana", ad: "Adana Rotaract Kulübü", il: "Adana", ilce: "", grup: "10", baskan: "Esra Göbelek", baskanFoto: "assets/foto/esra-gobelek.jpg", eposta: "esragobelek@gmail.com",
    toplanti: T("Perşembe", "19:00", "Dedeman Hotel Adana", "", { dil: "Türkçe" }) },
  { id: "adana-5-ocak", ad: "Adana 5 Ocak Rotaract Kulübü", il: "Adana", ilce: "Seyhan", grup: "10", baskan: "Berzan Bozkurt", baskanFoto: "assets/foto/berzan-bozkurt.jpg", eposta: "berzz.nn011@gmail.com",
    toplanti: T("Pazar", "14:30") },
  { id: "adana-cukurova", ad: "Adana Çukurova Rotaract Kulübü", il: "Adana", ilce: "Çukurova", grup: "10", baskan: "Nil Yüzereroğlu", eposta: "nil@yuzereroglu.com",
    toplanti: T("Salı", "19:30", "", "", { dil: "Türkçe" }) },
  { id: "adana-guney", ad: "Adana Güney Rotaract Kulübü", il: "Adana", ilce: "", grup: "10", baskan: "Ayşe Büşra Şimşek", baskanFoto: "assets/foto/ayse-busra-simsek.jpg", eposta: "aysebusrasimsek@gmail.com",
    toplanti: T("Çarşamba", "19:30", "DoubleTree by Hilton", "Ayın 2. ve 4. Çarşambası", { dil: "Türkçe" }) },
  { id: "adana-seyhan", ad: "Adana Seyhan Rotaract Kulübü", il: "Adana", ilce: "Seyhan", grup: "10", baskan: "Zeynep Afşar", baskanFoto: "assets/foto/zeynep-afsar.jpg", eposta: "zeynepafsar01@hotmail.com",
    toplanti: T("Perşembe", "19:30", "Adana Divan Otel", "Ayın 2. ve 4. Perşembesi") },
  { id: "antakya", ad: "Antakya Rotaract Kulübü", il: "Hatay", ilce: "Antakya", grup: "10", baskan: "Hakan Ayabaktı", baskanFoto: "assets/foto/hakan-ayabakti.jpg", eposta: "hakanayabakti@hotmail.com",
    toplanti: T("Perşembe", "19:00", "Antakya Şehir Kulübü") },
  { id: "kayseri", ad: "Kayseri Rotaract Kulübü", il: "Kayseri", ilce: "Kocasinan", grup: "10", baskan: "Osman Yoka", baskanFoto: "assets/foto/osman-yoka.jpg", eposta: "osmanyoka@gmail.com",
    toplanti: T("Salı", "19:30", "", "", { dil: "Türkçe" }) },

  /* ---- 11. GRUP ---- */
  { id: "eskisehir-yazilikaya", ad: "Eskişehir Yazılıkaya Rotaract Kulübü", il: "Eskişehir", ilce: "", grup: "11", baskan: "Ezgi Göcen", baskanFoto: "assets/foto/ezgi-gocen.jpg", eposta: "ezgocen@gmail.com",
    toplanti: T("Perşembe", "20:00", "", "", { dil: "Türkçe" }) },
  { id: "eskisehir-yunus-emre", ad: "Eskişehir Yunus Emre Rotaract Kulübü", il: "Eskişehir", ilce: "", grup: "11", baskan: "Kaan Kabak", baskanFoto: "assets/foto/kaan-kabak.jpg", eposta: "kaann.kbk@gmail.com",
    toplanti: T("", "") },
  { id: "eskisehir", ad: "Eskişehir Rotaract Kulübü", il: "Eskişehir", ilce: "", grup: "11", baskan: "Anıl Koşar", baskanFoto: "assets/foto/anil-kosar.jpg", eposta: "anilkosar913@gmail.com",
    toplanti: T("Perşembe", "20:00", "Leto City Hotel", "Ayın 2. ve 4. Perşembesi", { dil: "İngilizce" }) },
  { id: "eskisehir-gordion", ad: "Eskişehir Gordion Rotaract Kulübü", il: "Eskişehir", ilce: "", grup: "11", baskan: "Ecem Su Yılman", baskanFoto: "assets/foto/ecem-su-yilman.jpg", eposta: "ecemsuyilman@gmail.com",
    toplanti: T("", "") },
  { id: "eskisehir-anadolu", ad: "Eskişehir Anadolu Rotaract Kulübü", il: "Eskişehir", ilce: "", grup: "11", baskan: "Furkan Kenar",
    toplanti: T("Çarşamba", "19:00"), instagram: "anadolurotaract" }
];
}

/* --------------------------------------------------------------------------
   HABERLER — Akışta toplantı takviminin yanında gösterilir.
   Örnek: { kulupId: "mersin", tarih: "2026-11-02", kategori: "Toplum Hizmeti",
            baslik: "...", ozet: "...", gorsel: "assets/haber/xyz.jpg" }
   kategori: "Toplum Hizmeti" | "Mesleki Gelişim" | "Uluslararası" | "Kulüp Hizmeti" | "Etkinlik"
   -------------------------------------------------------------------------- */
window.AKIS = [];

/* --------------------------------------------------------------------------
   BÖLGE GÖREVLİLERİ 2026–2027
   ekip: "yonetim" | "komite" | "grup"
   grupNo: grup sorumluları için ilgili grup(lar); kartta grubun kulüpleri listelenir
   kulup: görevlinin üyesi olduğu Rotaract kulübü (boşsa kartta gösterilmez)
   aciklama: kişi kartında görünen "bu görev ne işe yarar" metni
   -------------------------------------------------------------------------- */
window.GOREVLILER = [
  {ekip: "yonetim", unvan: "Bölge Rotaract Temsilcisi (BRT)", ad: "Alper Abacıgil", foto: "assets/foto/alper-abacigil.jpg", eposta: "alperabacigil@gmail.com", kulup: "", vurgu: true, aciklama: "Bölgedeki tüm Rotaract kulüplerini temsil eder. Bölge ekibini yönetir, kulüplerin gelişimini destekler; Rotary 2430, Uluslararası Rotary ve diğer bölgelerle ilişkileri yürütür."},
  {ekip: "yonetim", unvan: "Kulüplerden Sorumlu Bölge Sekreteri", ad: "Ekin Çoşkun", foto: "assets/foto/ekin-coskun.jpg", eposta: "ekin.coskun7@gmail.com", kulup: "", aciklama: "Kulüplerle bölge arasındaki iletişimi yürütür. Kulüp raporlarını, yönetim ve üye bilgilerini takip eder; kulüplerin bölgeden beklediği desteği ilgili kişilere ulaştırır."},
  {ekip: "yonetim", unvan: "Komitelerden Sorumlu Bölge Sekreteri", ad: "Mutluhan Özdemir", foto: "assets/foto/mutluhan-ozdemir.jpg", eposta: "mutluhanozdemir@hotmail.com", kulup: "", aciklama: "Bölge komitelerinin çalışmalarını koordine eder. Komitelerin dönem planlarını, takvimlerini ve raporlarını izler; komiteler arasında iş birliği kurar."},
  {ekip: "yonetim", unvan: "Bölge İdari Sekreteri", ad: "Neslihan Doğan", foto: "assets/foto/neslihan-dogan.jpg", eposta: "neslihanndogan@icloud.com", kulup: "", aciklama: "Bölgenin resmi yazışmalarını, toplantı tutanaklarını ve arşivini yürütür. Duyuruların zamanında ve doğru kişilere ulaşmasını sağlar."},
  {ekip: "yonetim", unvan: "Toplantı ve Organizasyondan Sorumlu Bölge Sekreteri", ad: "Mithat Şakar", foto: "assets/foto/mithat-sakar.jpg", eposta: "mito936@gmail.com", kulup: "", aciklama: "Bölge toplantıları, eğitimler ve konferanslar gibi etkinliklerin planlamasını ve organizasyonunu üstlenir: mekân, program, kayıt ve lojistik."},
  {ekip: "yonetim", unvan: "Bölge Saymanı", ad: "Emre Kaan Kocaman", foto: "assets/foto/emre-kaan-kocaman.jpg", eposta: "emrekaankocaman@gmail.com", kulup: "", aciklama: "Bölge bütçesini hazırlar ve yönetir. Kulüp aidatlarını, gelir ve giderleri kayıt altına alır; dönem sonunda mali raporu sunar."},
  {ekip: "komite", unvan: "Hizmet Projeleri", ad: "Göksu Çetintaş", foto: "assets/foto/goksu-cetintas.jpg", eposta: "goksucetintas@gmail.com", kulup: "", aciklama: "Topluma fayda sağlayan hizmet projelerini planlar. Bölge çapında ortak projeler başlatır, kulüplerin projelerine fikir, kaynak ve iş birliği desteği verir."},
  {ekip: "komite", unvan: "Üyelik ve Üyeliği Geliştirme", ad: "Ataberk Atikoğlu", foto: "assets/foto/ataberk-atikoglu.jpg", eposta: "ataberkatikoglu@gmail.com", kulup: "", aciklama: "Kulüplerin yeni üye kazanmasına ve mevcut üyelerini tutmasına yardımcı olur. Rotaract'ı tanıtım çalışmaları yapar, yeni kulüp kurulmasını destekler."},
  {ekip: "komite", unvan: "Uluslararası Hizmetler", ad: "Yusuf Ufuk Altınöz", foto: "assets/foto/yusuf-ufuk-altinoz.jpg", eposta: "yusuf.ufuk@gmail.com", kulup: "", aciklama: "Yurt dışındaki Rotaract kulüpleri ve bölgelerle bağ kurar. Kardeş kulüp ilişkileri, uluslararası ortak projeler, değişim programları ve uluslararası etkinliklere katılım için yol gösterir."},
  {ekip: "komite", unvan: "Halkla İlişkiler ve Tanıtım", ad: "Can Kılıçaslan", foto: "assets/foto/can-kilicaslan.jpg", eposta: "dtcankilicaslan@gmail.com", kulup: "", aciklama: "Bölgenin sesini duyurur. Web sitesi, sosyal medya ve basın ilişkilerini yürütür; kulüplere tanıtım ve görsel kimlik konusunda destek verir."},
  {ekip: "komite", unvan: "Kulüp Hizmetleri · Hobi", ad: "Batuhan Sönmez", foto: "assets/foto/batuhan-sonmez.jpg", eposta: "bthnsnmz26@gmail.com", kulup: "", aciklama: "Kulüp Hizmetleri: kulüplerin iç işleyişini güçlendirir; yönetim, toplantı düzeni ve üye eğitimi konularında destek verir. Hobi: üyeler arasında dostluğu artıran, ortak ilgi alanlarına dayalı etkinlikler düzenler."},
  {ekip: "komite", unvan: "Afet", ad: "Uygar Eren Kandemir", foto: "assets/foto/uygar-eren-kandemir.jpg", eposta: "uygarerenkandemir@gmail.com", kulup: "", aciklama: "Afetlere hazırlık konusunda farkındalık çalışmaları yapar. Afet anında bölge kulüplerinin yardım çalışmalarını koordine eder ve ilgili kurumlarla iletişim kurar."},
  {ekip: "komite", unvan: "Meslek Hizmetleri", ad: "Alper Durucu", foto: "assets/foto/alper-durucu.jpg", eposta: "alperdurucu97@gmail.com", kulup: "", aciklama: "Üyelerin mesleki gelişimini destekler. Kariyer söyleşileri, mentorluk ve iş dünyasıyla buluşmalar düzenler; mesleki etiği 4'lü Özdenetim ışığında öne çıkarır."},
  {ekip: "komite", unvan: "Interact", ad: "Dilasu Tamgül", foto: "assets/foto/dilasu-tamgul.jpg", eposta: "tamguldilasu@gmail.com", kulup: "", aciklama: "Bölgedeki Interact kulüpleriyle (12–18 yaş) bağı kurar. Interactörlere rehberlik eder, Rotaract–Interact ortak projelerini ve Interact'tan Rotaract'a geçişi destekler."},
  {ekip: "grup", unvan: "1. Grup", ad: "Mert Toktaş", foto: "assets/foto/mert-toktas.jpg", eposta: "mert.toktas7@gmail.com", kulup: "", grupNo: ["1"]},
  {ekip: "grup", unvan: "2. Grup", ad: "Asya Büyükerk", foto: "assets/foto/asya-buyukerk.jpg", eposta: "asyabuyukerk@gmail.com", kulup: "", grupNo: ["2"]},
  {ekip: "grup", unvan: "3. ve 8. Grup", ad: "Pınar Tektaş", foto: "assets/foto/pinar-tektas.jpg", eposta: "pinaartektas@gmail.com", kulup: "", grupNo: ["3","8"]},
  {ekip: "grup", unvan: "4. Grup", ad: "Elif Kurt Ersoy", foto: "assets/foto/elif-kurt-ersoy.jpg", eposta: "avelifkurt1@gmail.com", kulup: "", grupNo: ["4"]},
  {ekip: "grup", unvan: "5. ve 6. Grup", ad: "Özgü İzel Özcan", foto: "assets/foto/ozgu-izel-ozcan.jpg", eposta: "ozguizel@gmail.com", kulup: "", grupNo: ["5-6"]},
  {ekip: "grup", unvan: "7. Grup", ad: "Eda Gönlüm Karahanlı", foto: "assets/foto/eda-gonlum-karahanli.jpg", eposta: "edagonlum98@gmail.com", kulup: "", grupNo: ["7"]},
  {ekip: "grup", unvan: "9. Grup", ad: "Mehmet Murat Elbeyli", foto: "assets/foto/mehmet-murat-elbeyli.jpg", eposta: "elbeylimurat@gmail.com", kulup: "", grupNo: ["9"]},
  {ekip: "grup", unvan: "10. Grup", ad: "Mert Üstek", foto: "assets/foto/mert-ustek.jpg", eposta: "mertustek@gmail.com", kulup: "", grupNo: ["10"]},
  {ekip: "grup", unvan: "11. Grup", ad: "Serenay Karakoç", foto: "assets/foto/serenay-karakoc.jpg", eposta: "serenay2303@gmail.com", kulup: "", grupNo: ["11"]}
];

/* --------------------------------------------------------------------------
   TÜRKİYE'DEKİ ROTARY BÖLGELERİ — haritada gösterilir
   Listede olmayan tüm iller Bölge 2430 sayılır.
   Kaynaklar: rotary2430.org.tr "Türkiye'de Rotary" (2420: İstanbul ve Marmara
   çevresi, 2430: Orta ve Doğu Anadolu, 2440: Ege); 2440 il listesi Rotaract/Rotary
   kulüp sayfalarından.
   "dogrulanacak": hangi bölgeye bağlı olduğu kaynaklarda net olmayan iller.
   Doğrulandıkça ilgili listeye taşıyın.
   -------------------------------------------------------------------------- */
window.ROTARY_BOLGELER = {
  "2420": ["İstanbul", "Edirne", "Kırklareli", "Tekirdağ"],
  "2440": ["Çanakkale", "Balıkesir", "Bursa", "Manisa", "İzmir", "Aydın", "Muğla", "Denizli"],
  dogrulanacak: ["Kocaeli", "Sakarya", "Yalova", "Bilecik", "Bolu", "Düzce", "Zonguldak", "Bartın",
                 "Karabük", "Kütahya", "Afyonkarahisar", "Uşak", "Isparta", "Burdur"]
};
