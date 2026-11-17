// Çalıştır: node --test test/
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const E = require("../js/etkinlik.js");

// data.js tarayıcı için yazıldı; kulüp listesini buradan okuyoruz
const data = fs.readFileSync(new URL("../js/data.js", import.meta.url), "utf8");
const win = {};
new Function("window", data)(win);
const KULUPLER = win.KULUPLER;
const ids = (baslik) => E.kulupBul(baslik, KULUPLER).map((k) => k.id);

test("ICS: katlanmış satırlar birleşir, tüm gün ve saatli etkinlik okunur", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "BEGIN:VEVENT",
    "DTSTART;VALUE=DATE:20261120",
    "DTEND;VALUE=DATE:20261121",
    "UID:a1@google.com",
    "STATUS:CONFIRMED",
    "SUMMARY:Ankara Tandoğan Rotaract Kulübü-Stant Açılımı (Kadın Emeği Ürünleri",
    " )",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "DTSTART:20261205T170000Z",
    "DTEND:20261205T200000Z",
    "UID:a2@google.com",
    "SUMMARY:Zone 21-B Summit\\, Ankara",
    "LOCATION:Ankara",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "DTSTART;VALUE=DATE:20261210",
    "DTEND;VALUE=DATE:20261211",
    "UID:a3@google.com",
    "STATUS:CANCELLED",
    "SUMMARY:İptal",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const ev = E.icsOku(ics);
  assert.equal(ev.length, 2, "iptal edilen etkinlik atlanır");
  assert.deepEqual(ev[0], {
    id: "a1@google.com",
    baslik: "Ankara Tandoğan Rotaract Kulübü-Stant Açılımı (Kadın Emeği Ürünleri)",
    baslangic: "2026-11-20",
    bitis: "2026-11-20",
    tumGun: true,
    yer: ""
  });
  assert.equal(ev[1].baslik, "Zone 21-B Summit, Ankara");
  assert.equal(ev[1].baslangic, "2026-12-05T17:00:00Z");
  assert.equal(ev[1].tumGun, false);
  assert.equal(ev[1].yer, "Ankara");
});

test("ICS: çok günlük tüm gün etkinliğin bitişi son gündür", () => {
  const ics = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20270326\nDTEND;VALUE=DATE:20270329\nUID:x\nSUMMARY:Asamble\nEND:VEVENT";
  const [e] = E.icsOku(ics);
  assert.equal(e.baslangic, "2027-03-26");
  assert.equal(e.bitis, "2027-03-28");
});

test("tür: parti", () => {
  for (const b of [
    "Ankara Kızılay Rotaract Kulübü-Maskeli Parti",
    "Ankara GOP Rotaract Kulübü-Manifest Party",
    "Ankara Kocatepe Rotaract Kulübü-Geleneksel Kokteyl Gecesi",
    " Adana Rotaract Kulübü-40.Yıl Balosu",
    "Ankara Bahçelievler Rotaract Kulübü-Geleneksel Halloween Parti",
    "Ankara Kavaklıdere Rotaract Kulübü-Argentina Night",
    "Ankara İncek Rotaract Kulübü- Octoberfest",
    "8.Interact Asamblesi-Asamble Masquerade"
  ]) assert.equal(E.turBul(b), "parti", b);
});

test("tür: proje", () => {
  for (const b of [
    "Ankara Gazi Rotaract Kulübü-Her Kan Bir Can",
    "Ankara Çayyolu Rotaract Kulübü-Pideler Mamalar Etkinliği",
    "Ankara Tandoğan Rotaract Kulübü-Stant Açılımı (Kadın Emeği Ürünleri)",
    "Ankara Kızılay Rotaract Kulübü-Meme Kanseri ve Kadın Hastalıkları",
    "Ankara GOP & Ankara Çayyolu Rotaract Kulübü-Koca Çınarlar Gençlerle"
  ]) assert.equal(E.turBul(b), "proje", b);
});

test("tür: etkinlik (varsayılan)", () => {
  for (const b of [
    "Ankara Rotaract Kulübü-Dart Turnuvası",
    "Ankara Çankaya Rotaract Kulübü-Bowling Etkinliği",
    "3.Grup Kulüpleri BRT Ziyareti",
    "Rotary Bölge 2430 Asamble",
    "Ankara International Rotaract Kulübü-Geleneksel Board Game",
    "Ankara İncek Rotaract Kulübü-Game Night"
  ]) assert.equal(E.turBul(b), "etkinlik", b);
});

test("tür: başlıktaki #etiket her şeyi ezer ve başlıktan silinir", () => {
  assert.equal(E.turBul("Ankara Koru Rotaract Kulübü-Piknik #proje"), "proje");
  assert.equal(E.turBul("X Gecesi #etkinlik"), "etkinlik");
  assert.equal(E.baslikTemizle("Ankara Koru Rotaract Kulübü-Piknik #proje"), "Ankara Koru Rotaract Kulübü-Piknik");
});

test("kulüp eşleşmesi: tek kulüp", () => {
  assert.deepEqual(ids("Ankara Kocatepe Rotaract Kulübü-Geleneksel Kokteyl Gecesi"), ["ankara-kocatepe"]);
  assert.deepEqual(ids("Anıttepe Rotaract Kulübü-Geleneksel Bordo Gecesi"), ["ankara-anittepe"]);
  assert.deepEqual(ids("Ankara Gazi Rotaract Kulübü-Her Kan Bir Can"), ["gazi"]);
  assert.deepEqual(ids("Ankara Gaziosmanpaşa Rotaract Kulübü-GOP PANAYIRI"), ["ankara-gaziosmanpasa"]);
  assert.deepEqual(ids("Ankara GOP Rotaract Kulübü-Manifest Party"), ["ankara-gaziosmanpasa"]);
  assert.deepEqual(ids("Ankara Çankaya Rotaract Kulübü-Bowling Etkinliği"), ["cankaya"]);
  assert.deepEqual(ids("Ankara Rotaract Kulübü-Dart Turnuvası"), ["ankara"]);
  assert.deepEqual(ids(" Adana Rotaract Kulübü-40.Yıl Balosu"), ["adana"]);
});

test("kulüp eşleşmesi: birden fazla kulüp", () => {
  assert.deepEqual(ids("Ankara Çayyolu & GOP Rotaract Kulübü-Yoga ve Mangal").sort(), ["ankara-cayyolu", "ankara-gaziosmanpasa"]);
  assert.deepEqual(ids("Ankara GOP & Ankara Çayyolu Rotaract Kulübü-Koca Çınarlar Gençlerle").sort(), ["ankara-cayyolu", "ankara-gaziosmanpasa"]);
  assert.deepEqual(ids("Ankara Rotaract Kulübü-Ankara Kocatepe Rotaract Kulübü-Paws&Talks E").sort(), ["ankara", "ankara-kocatepe"]);
  assert.deepEqual(ids("Ankara Çayyolu Rotary ve Rotaract Kulübü-Yeni Yıla Merhaba Partisi"), ["ankara-cayyolu"]);
});

test("kulüp eşleşmesi: Rotary, Interact ve grup etkinliklerinde Rotaract kulübü yok", () => {
  assert.deepEqual(ids("Anadolu Arkeoloji Rotary Kulübü-RYLA"), []);
  assert.deepEqual(ids("Adana Koza Rotary Kulübü-RYLA"), []);
  assert.deepEqual(ids("Ankara GOP Interact Kulübü Charter Töreni"), []);
  assert.deepEqual(ids("3.Grup Kulüpleri BRT Ziyareti"), []);
  assert.deepEqual(ids("Rotary Bölge 2430 Asamble"), []);
});

test("ICS: TZID=Europe/Istanbul saatine +03:00 eklenir, VALARM başlığı ezmez", () => {
  const ics = [
    "BEGIN:VEVENT",
    "DTSTART;TZID=Europe/Istanbul:20261205T190000",
    "DTEND;TZID=Europe/Istanbul:20261205T230000",
    "UID:t1",
    "SUMMARY:Gala",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "SUMMARY:Alarm",
    "END:VALARM",
    "END:VEVENT"
  ].join("\n");
  const [e] = E.icsOku(ics);
  assert.equal(e.baslik, "Gala");
  assert.equal(e.baslangic, "2026-12-05T19:00:00+03:00");
  assert.equal(new Date(e.baslangic).toISOString(), "2026-12-05T16:00:00.000Z");
});

test("kulüp eşleşmesi: 've'/'&' ile geçen şehir adları kulüp sayılmaz", () => {
  assert.deepEqual(ids("Ankara ve Eskişehir kulüpleri ortak toplantı"), []);
  assert.deepEqual(ids("Adana ve Mersin bölge toplantısı"), []);
  assert.deepEqual(ids("Samsun & Trabzon gezisi"), []);
});

test("grup: 'N.Grup Kulüpleri' başlığından grup bulunur", () => {
  const g = (b) => E.grupBul(b, KULUPLER);
  assert.equal(g("3.Grup Kulüpleri BRT Ziyareti"), "3");
  assert.equal(g(" 5-6.Grup Kulüpleri BRT Ziyareti"), "5-6");
  assert.equal(g("11. Grup Kulüpleri Yaz Ortak Toplantısı"), "11");
  assert.equal(g("1.2.3 Grup Kulüpleri Yaz Ortak Toplantısı"), null);
  assert.equal(g("Ankara Rotaract Kulübü-Dart Turnuvası"), null);
});

test("ICS: yalnızca X'lerden oluşan yer tutucu başlıklar atlanır", () => {
  const ics = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20261029\nUID:p\nSUMMARY:XXX\nEND:VEVENT";
  assert.equal(E.icsOku(ics).length, 0);
});

test("yaklaşanlar: bitmiş olanlar elenir, tarihe göre sıralanır", () => {
  const ev = [
    { id: "c", baslangic: "2026-12-01", bitis: "2026-12-01", tumGun: true },
    { id: "a", baslangic: "2026-11-10", bitis: "2026-11-10", tumGun: true },
    { id: "b", baslangic: "2026-11-15", bitis: "2026-11-18", tumGun: true },
    { id: "d", baslangic: "2026-11-17T18:00:00Z", bitis: "2026-11-17T21:00:00Z", tumGun: false }
  ];
  const now = new Date("2026-11-17T12:00:00+03:00");
  assert.deepEqual(E.yaklasanlar(ev, now).map((e) => e.id), ["b", "d", "c"]);
});
