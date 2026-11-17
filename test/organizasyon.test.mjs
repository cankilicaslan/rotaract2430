// Çalıştır: node --test test/organizasyon.test.mjs
// Örnek metinler asambleinfinity.ankararotaract.org sitesinden (17 Kasım 2026) alınmıştır.
import { test } from "node:test";
import assert from "node:assert/strict";
import { metaOku, anaSayfaAyikla, ekipAyikla, iletisimAyikla, tarihCoz, birlestir } from "../scripts/lib/organizasyon.mjs";

const HTML = `<!DOCTYPE html><html><head>
<title>Asamble Infinity · 39. Rotaract Asamblesi · 5–7 Mart 2027 Antalya</title>
<meta name="description" content="UR Bölge 2430 39. Rotaract Asamblesi — Asamble Infinity. Geçmişten geleceğe sınırsız etki. 5–7 Mart 2027, Antalya." />
<meta property="og:title" content="Asamble Infinity · 39. Rotaract Asamblesi" />
<meta property="og:description" content="Geçmişten geleceğe sınırsız etki. 5–7 Mart 2027, Antalya." />
<meta property="og:image" content="/og-image.jpg" />
</head><body><div id="root"></div></body></html>`;

const ANA = `GEÇMİŞTEN GELECEĞE SINIRSIZ ETKİ

ASAMBLE
INFINITY

39. Rotaract Asamblesi

5–7 MART 2027 · PINE BEACH BELEK

107
Gün
KAYIT OL
KEŞFET

HAKKIMIZDA

Ankara Rotaract Kulübü & Asamble Infinity Ekibi

Ankara Rotaract Kulübü, farklı yetkinliklere ve bakış açılarına sahip genç bireyleri bir araya getiren; dostluğu, dayanışmayı ve hizmet bilincini benimseyen bir topluluktur.

Asamble Infinity ekibi olarak, sürecin her aşamasını özen ve profesyonellikle yönetirken ekip ruhumuzu ve işimize duyduğumuz heyecanı da koruyoruz.

SONSUZLUĞUN ANLAMI

Bir insanda başlayan hizmet, başka hayatlarda devam eder

Infinity burada yalnızca sonsuzluk değil; devredilen cesareti, taşınan dostluğu ve büyüyen etkiyi temsil eder.

İNSAN

BAĞ

EYLEM

SÜREKLİLİK

BÖLGE ASAMBLESİ NEDİR?

Yeni dönemin ilk adımı

Bölge Asamblesi, Rotaract yılının en önemli hazırlık etkinliğidir. Her yıl temmuzda başlayacak yeni döneme yönelik olarak mart ayında düzenlenir.

Aynı zamanda kulüpler arası bağı güçlendiren sosyal deneyimler ve networking fırsatları sunar.

LİDERLİK GELİŞİMİ

PROJE YÖNETİMİ

İLETİŞİM VE PR

38. ASAMBLE'DEN

Mirası devralıyoruz`;

const EKIP = `Mert Keleş

UR Bölge 2430 Bölge Rotaract Temsilcisi

Zeynep Sude Zarif

UR Bölge 2430 Ankara Rotaract Kulübü 2026-2027 Dönem Başkanı

Irmak Seren Serdar

Asamble Infinity Ana Komite Başkanı

Kayra Yüksek

Asamble Infinity Sekreteri`;

const ILETISIM = `KONUM

Pine Beach Belek, Antalya

TELEFON

+90 (552) 008 08 08

E-POSTA

asambleinfinity.rotaract@gmail.com`;

test("meta: başlık, açıklama ve mutlak görsel adresi okunur", () => {
  const m = metaOku(HTML, "https://asambleinfinity.ankararotaract.org/");
  assert.equal(m.baslik, "Asamble Infinity · 39. Rotaract Asamblesi · 5–7 Mart 2027 Antalya");
  assert.equal(m.ogBaslik, "Asamble Infinity · 39. Rotaract Asamblesi");
  assert.equal(m.ogAciklama, "Geçmişten geleceğe sınırsız etki. 5–7 Mart 2027, Antalya.");
  assert.equal(m.gorsel, "https://asambleinfinity.ankararotaract.org/og-image.jpg");
});

test("tarih: '5–7 Mart 2027' çözülür", () => {
  assert.deepEqual(tarihCoz("5–7 MART 2027 · PINE BEACH BELEK"), { baslangic: "2027-03-05", bitis: "2027-03-07", metin: "5–7 Mart 2027" });
  assert.deepEqual(tarihCoz("13-15 Mart 2026"), { baslangic: "2026-03-13", bitis: "2026-03-15", metin: "13–15 Mart 2026" });
  assert.equal(tarihCoz("Program yakında"), null);
});

test("ana sayfa: düzenleyen, tema, amaç ve odaklar ayıklanır", () => {
  const a = anaSayfaAyikla(ANA);
  assert.equal(a.duzenleyen, "Ankara Rotaract Kulübü & Asamble Infinity Ekibi");
  assert.equal(a.hakkinda.length, 2);
  assert.match(a.hakkinda[0], /^Ankara Rotaract Kulübü, farklı/);
  assert.equal(a.tema.alt, "Bir insanda başlayan hizmet, başka hayatlarda devam eder");
  assert.match(a.tema.aciklama[0], /^Infinity burada/);
  assert.deepEqual(a.tema.degerler, ["İnsan", "Bağ", "Eylem", "Süreklilik"]);
  assert.equal(a.amac.alt, "Yeni dönemin ilk adımı");
  assert.equal(a.amac.aciklama.length, 2);
  assert.deepEqual(a.odaklar, ["Liderlik gelişimi", "Proje yönetimi", "İletişim ve PR"]);
  assert.equal(a.tarih.baslangic, "2027-03-05");
  assert.equal(a.altBaslik, "39. Rotaract Asamblesi");
});

test("ekip: isim-görev çiftleri okunur", () => {
  const e = ekipAyikla(EKIP);
  assert.equal(e.length, 4);
  assert.deepEqual(e[0], { ad: "Mert Keleş", gorev: "UR Bölge 2430 Bölge Rotaract Temsilcisi" });
});

test("iletişim: konum ve e-posta okunur, telefon alınmaz", () => {
  assert.deepEqual(iletisimAyikla(ILETISIM), { yer: "Pine Beach Belek, Antalya", eposta: "asambleinfinity.rotaract@gmail.com" });
});

test("birleştir: yeni değer boşsa eski değer korunur", () => {
  const eski = { ad: "A", tema: { alt: "x", aciklama: ["p"] }, odaklar: ["a"] };
  const yeni = { ad: "", tema: { alt: "y", aciklama: [] }, odaklar: [] };
  assert.deepEqual(birlestir(eski, yeni), { ad: "A", tema: { alt: "y", aciklama: ["p"] }, odaklar: ["a"] });
});
