// Asamble/konferans sitelerinden bilgileri çekip data/organizasyonlar.json dosyasına yazar.
// Çalıştır: node scripts/organizasyon.mjs
// Siteler JavaScript ile çizildiği için Playwright (Chromium) kullanılır; GitHub Actions kurar.
// Playwright yoksa yalnızca <head> bilgileri (başlık, açıklama, görsel) güncellenir.
// Bir alan bulunamazsa önceki değer korunur (site tasarımı değişse bile sayfa boş kalmaz).
import fs from "node:fs";
import { metaOku, anaSayfaAyikla, ekipAyikla, iletisimAyikla, tarihCoz, birlestir } from "./lib/organizasyon.mjs";

const kok = new URL("../", import.meta.url);
const w = {};
new Function("window", fs.readFileSync(new URL("js/data.js", kok), "utf8"))(w);
const CIKTI = new URL("data/organizasyonlar.json", kok);

let eski = { organizasyonlar: {} };
try { eski = JSON.parse(fs.readFileSync(CIKTI, "utf8")); } catch {}

let tarayici = null;
try {
  // GitHub Actions'ta "playwright" (kendi Chromium'u), yerelde "playwright-core" + kurulu Chrome
  const { chromium } = await import("playwright").catch(() => import("playwright-core"));
  tarayici = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
} catch (e) {
  console.warn("Playwright yok; yalnızca sayfa başlık bilgileri güncellenecek.", e.message);
}

async function gorunenMetin(url) {
  const sayfa = await tarayici.newPage();
  try {
    await sayfa.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    const metin = await sayfa.evaluate(() => (document.querySelector("main") || document.body).innerText);
    const linkler = await sayfa.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => ({ t: a.textContent.trim(), h: a.href })));
    return { metin, linkler };
  } finally {
    await sayfa.close();
  }
}

// Önemli görevler sırayla (kartta öne çıkarılır)
const ONEMLI = [/Bölge Rotaract Temsilcisi/i, /Dönem Başkanı/i, /Ana Komite Başkanı/i, /Konferans Başkanı|Komite Başkanı$/i];

async function cek(org) {
  const res = await fetch(org.site);
  if (!res.ok) throw new Error(`${org.site}: HTTP ${res.status}`);
  const meta = metaOku(await res.text(), org.site);
  const [adKismi] = (meta.ogBaslik || meta.baslik).split("·").map((s) => s.trim());
  const veri = {
    tur: org.tur,
    ad: adKismi || "",
    slogan: (meta.ogAciklama.split(/(?<=\.)\s/)[0] || "").replace(/\.$/, ""),
    aciklama: meta.aciklama,
    tarih: tarihCoz(meta.baslik) || tarihCoz(meta.aciklama),
    gorsel: meta.gorsel,
    site: org.site,
    instagram: org.instagram || ""
  };
  if (!tarayici) return veri;

  const ana = await gorunenMetin(org.site);
  const a = anaSayfaAyikla(ana.metin);
  const bul = (re) => ana.linkler.find((l) => re.test(l.t))?.h || "";
  Object.assign(veri, {
    altBaslik: a.altBaslik,
    tarih: a.tarih || veri.tarih,
    duzenleyen: a.duzenleyen, hakkinda: a.hakkinda,
    tema: a.tema, amac: a.amac, odaklar: a.odaklar,
    kayit: bul(/kay[ıi]t ol|register|booking/i),
    instagram: org.instagram || ana.linkler.find((l) => /instagram\.com\//.test(l.h))?.h || ""
  });
  const ekipUrl = bul(/^ek[iİ]p$|team/i), iletisimUrl = bul(/^[iİ]let[iİ][sş][iİ]m$|contact/i);
  if (ekipUrl) {
    const kisiler = ekipAyikla((await gorunenMetin(ekipUrl)).metin);
    veri.ekipSayisi = kisiler.length;
    veri.kisiler = [...new Set(ONEMLI.map((re) => kisiler.find((k) => re.test(k.gorev))).filter(Boolean))];
  }
  if (iletisimUrl) Object.assign(veri, iletisimAyikla((await gorunenMetin(iletisimUrl)).metin));
  return veri;
}

const yeni = {};
for (const org of w.ORGANIZASYONLAR || []) {
  const onceki = eski.organizasyonlar?.[org.id] || {};
  if (!org.site) { yeni[org.id] = { tur: org.tur, durum: "yakinda", instagram: org.instagram || "" }; continue; }
  try {
    yeni[org.id] = { ...birlestir(onceki, await cek(org)), durum: "aktif" };
    console.log(`${org.id}: tamam (${yeni[org.id].ad})`);
  } catch (e) {
    console.warn(`${org.id}: çekilemedi, önceki bilgiler korunuyor.`, e.message);
    yeni[org.id] = onceki.ad ? onceki : { tur: org.tur, durum: "yakinda", site: org.site };
  }
}
await tarayici?.close();

if (JSON.stringify(eski.organizasyonlar) === JSON.stringify(yeni)) {
  console.log("Değişiklik yok.");
} else {
  fs.mkdirSync(new URL("data/", kok), { recursive: true });
  fs.writeFileSync(CIKTI, JSON.stringify({ guncelleme: new Date().toISOString(), organizasyonlar: yeni }, null, 2) + "\n");
  console.log("data/organizasyonlar.json güncellendi.");
}
