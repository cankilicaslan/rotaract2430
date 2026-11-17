// Bölge takvimini (Google Takvim, herkese açık iCal) indirip data/etkinlikler.json dosyasına yazar.
// Çalıştır: node scripts/takvim.mjs
// GitHub Actions bunu günde birkaç kez çalıştırır (.github/workflows/takvim.yml).
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { icsOku } = require("../js/etkinlik.js");

// "UR 2430 BÖLGE 2026-27 DÖNEMİ TAKVİMİ" — dönem değişince TAKVIM_ICS ile ya da burada güncelleyin
const ICS_URL = process.env.TAKVIM_ICS ||
  "https://calendar.google.com/calendar/ical/4ac81012596c6ed97410d0d7dd0fbdb896f464ecaa55b26d8ead80ca5c4f2ba6%40group.calendar.google.com/public/basic.ics";
const CIKTI = new URL("../data/etkinlikler.json", import.meta.url);

const res = await fetch(ICS_URL);
if (!res.ok) throw new Error(`Takvim indirilemedi: HTTP ${res.status}`);
const metin = await res.text();
if (!metin.includes("BEGIN:VCALENDAR")) throw new Error("Takvim yanıtı iCal değil");

// Tekrarlayan etkinlikler (RRULE) açılmıyor; yalnızca ilk tekrarı alınır. Varsa uyar.
const tekrar = (metin.match(/^RRULE:/gm) || []).length;
if (tekrar) console.warn(`Uyarı: ${tekrar} tekrarlayan etkinlik var; yalnızca ilk tarihleri alındı.`);

// Dünden itibaren bir yıl içindeki etkinlikler
const dun = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
const birYil = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);
const etkinlikler = icsOku(metin)
  .filter((e) => e.bitis.slice(0, 10) >= dun && e.baslangic.slice(0, 10) <= birYil)
  .sort((a, b) => a.baslangic.localeCompare(b.baslangic) || a.baslik.localeCompare(b.baslik, "tr"));

// Etkinlikler değişmediyse dosyaya dokunma (gereksiz commit olmasın)
let eski = null;
try { eski = JSON.parse(fs.readFileSync(CIKTI, "utf8")); } catch {}
if (eski && JSON.stringify(eski.etkinlikler) === JSON.stringify(etkinlikler)) {
  console.log(`Değişiklik yok (${etkinlikler.length} etkinlik).`);
} else {
  fs.mkdirSync(new URL("../data/", import.meta.url), { recursive: true });
  fs.writeFileSync(CIKTI, JSON.stringify({ guncelleme: new Date().toISOString(), etkinlikler }, null, 2) + "\n");
  console.log(`data/etkinlikler.json güncellendi (${etkinlikler.length} etkinlik).`);
}
