// My Rotary'den okunan toplantı bilgilerini js/data.js'e uygular.
// Yalnızca My Rotary'de DEĞİŞEN kulüpleri günceller; elle düzeltilmiş kayıtlar
// My Rotary aynı kaldıkça korunur.
//
// Kullanım (site kökünde): node scripts/myrotary/uygula.mjs <sonuc.json>
// Çıkış kodu: 0 = tamam, 2 = okuma hatası (ör. My Rotary oturumu kapalı)
import fs from "node:fs";

const sonucYolu = process.argv[2];
if (!sonucYolu) { console.error("kullanım: node scripts/myrotary/uygula.mjs <sonuc.json>"); process.exit(1); }
const sonuc = JSON.parse(fs.readFileSync(sonucYolu, "utf8"));
const kayitYolu = "scripts/myrotary/kulupler.json";
const kayit = JSON.parse(fs.readFileSync(kayitYolu, "utf8"));
let data = fs.readFileSync("js/data.js", "utf8");

const GUN = { Monday: "Pazartesi", Tuesday: "Salı", Wednesday: "Çarşamba", Thursday: "Perşembe", Friday: "Cuma", Saturday: "Cumartesi", Sunday: "Pazar" };
const HIBRIT = "Yüz yüze ve çevrim içi (Zoom)", ONLINE = "Çevrim içi (Zoom)";
// Kısa parmak izi (FNV-1a); oku.js ile aynı
const iz = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
const T = (gun, saat, yer = "", siklik = "", extra = {}) => ({ gun, saat, yer, siklik, ...extra });

// data.js içindeki "toplanti: T(...)" çağrısını bul (tırnak içindeki parantezleri sayma)
function tBul(id) {
  const bas = data.indexOf(`{ id: "${id}",`);
  if (bas < 0) return null;
  const tBas = data.indexOf("toplanti: T(", bas);
  let i = tBas + "toplanti: T(".length, d = 1, q = null;
  for (; i < data.length && d; i++) {
    const c = data[i];
    if (q) { if (c === q && data[i - 1] !== "\\") q = null; continue; }
    if (c === '"' || c === "'") q = c; else if (c === "(") d++; else if (c === ")") d--;
  }
  const metin = data.slice(tBas, i);
  return { tBas, son: i, t: Function("T", "return " + metin.replace(/^toplanti: /, ""))(T) };
}
function tYaz(id, t) {
  const b = tBul(id);
  const { gun, saat, yer, siklik, ...ek } = t;
  const q = (v) => JSON.stringify(v ?? "");
  const ekStr = Object.keys(ek).length ? ", { " + Object.entries(ek).map(([k, v]) => `${k}: ${q(v)}`).join(", ") + " }" : "";
  data = data.slice(0, b.tBas) + `toplanti: T(${[q(gun), q(saat), q(yer), q(siklik)].join(", ")}${ekStr})` + data.slice(b.son);
}

const degisen = [], hatali = [], bilgisiz = [];
for (const [id, r] of Object.entries(sonuc)) {
  if (!kayit[id]) continue;
  if (r.hata) { hatali.push(`${id}: ${r.hata}`); continue; }
  if (!r.when) { bilgisiz.push(id); continue; }
  const ham = iz(JSON.stringify({ when: r.when, yerler: r.yerler }));
  if (kayit[id].iz === undefined) { kayit[id].iz = ham; continue; } // ilk çalıştırma: yalnızca referans al
  if (kayit[id].iz === ham) continue;

  const b = tBul(id);
  if (!b) { hatali.push(`${id}: data.js'te bulunamadı`); continue; }
  const eski = { ...b.t };
  const t = { ...b.t };
  const m = r.when.match(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\D*(\d{1,2}:\d{2})/);
  if (m) { t.gun = GUN[m[1]]; t.saat = m[2]; }
  const yuz = r.yerler.find((y) => /In-Person/i.test(y.bicim));
  const cevrim = r.yerler.find((y) => /Online/i.test(y.bicim));
  if (yuz) {
    t.yer = yuz.satirlar[0] || t.yer;
    const adres = yuz.satirlar.slice(1).join(", ").replace(/,\s*(Turkey|Türkiye)$/i, "");
    if (adres) t.adres = adres; else delete t.adres;
    if (cevrim) t.format = HIBRIT; else if (t.format === HIBRIT || t.format === ONLINE) delete t.format;
  } else if (cevrim) {
    t.yer = ONLINE; t.format = ONLINE; delete t.adres;
  }
  tYaz(id, t);
  kayit[id].iz = ham;
  degisen.push(`${id}: ${eski.gun || "-"} ${eski.saat || ""} · ${eski.yer || "-"}  →  ${t.gun} ${t.saat} · ${t.yer}`);
}

fs.writeFileSync("js/data.js", data);
fs.writeFileSync(kayitYolu, JSON.stringify(kayit, null, 1) + "\n");
console.log(`Değişen kulüp: ${degisen.length}`);
degisen.forEach((s) => console.log("  ~ " + s));
if (bilgisiz.length) console.log(`My Rotary'de toplantı bilgisi olmayan: ${bilgisiz.join(", ")}`);
if (hatali.length) { console.log("Okunamayan:"); hatali.forEach((s) => console.log("  ! " + s)); }
process.exit(hatali.length > Object.keys(sonuc).length / 2 ? 2 : 0);
