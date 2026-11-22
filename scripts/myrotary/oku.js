/*
 * My Rotary toplantı bilgisi okuyucu — tarayıcıda, my.rotary.org sekmesinde çalıştırılır
 * (giriş yapılmış oturum gerekir). Şifre ya da üye bilgisi okumaz; yalnızca kulüp
 * detay sayfasındaki "When / Where" toplantı bölümünü alır.
 *
 * Kullanım: scripts/myrotary/kulupler.json içeriğini `window.KULUPLER = {...};` olarak
 * bu kodun başına ekleyip sayfada çalıştırın. window.__myrBitti true olunca:
 *   window.__myrDegisen  -> yalnızca My Rotary'de değişmiş (ya da ilk kez okunan) kulüpler
 *   window.__myrHatalar  -> okunamayan kulüpler
 *   window.__myrSonuc    -> hepsi
 * Çıktıyı uygula.mjs'e vermek için JSON.stringify(window.__myrDegisen) yeterlidir.
 */
(() => {
  // Kısa parmak izi (FNV-1a); uygula.mjs ile aynı
  const iz = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };
  const oku = (url, bekle = 15000) => new Promise((res) => {
    const f = document.createElement("iframe");
    f.style.cssText = "position:fixed;left:-9999px;width:1200px;height:900px";
    f.src = url; document.body.appendChild(f);
    const t0 = Date.now();
    const kontrol = () => {
      let txt = ""; try { txt = f.contentDocument.body.innerText; } catch (e) {}
      const hazir = /Club ID/.test(txt) && /My Rotary\nContact Us/.test(txt) && Date.now() - t0 > 3000;
      if (hazir || Date.now() - t0 > bekle) { f.remove(); res(txt); } else setTimeout(kontrol, 500);
    };
    setTimeout(kontrol, 1500);
  });
  const ayikla = (txt) => {
    if (!/Club ID/.test(txt)) return { hata: "sayfa açılmadı (oturum kapalı olabilir)" };
    const son = txt.indexOf("My Rotary\nContact Us");
    const w = txt.lastIndexOf("\nWhen");
    if (w < 0) return { toplanti: null };
    const blok = txt.slice(Math.max(0, w - 400), son > 0 ? son : undefined);
    const when = (blok.match(/When\s*\n+([^\n]+)/) || [])[1] || "";
    const yerler = [...blok.matchAll(/Where \(([^)]+)\)\s*\n+([\s\S]*?)(?=\nWhere \(|$)/g)]
      .map((m) => ({ bicim: m[1], satirlar: m[2].split("\n").map((s) => s.trim()).filter(Boolean) }));
    return { when, yerler };
  };
  window.__myrSonuc = {}; window.__myrDegisen = {}; window.__myrHatalar = {}; window.__myrBitti = false;
  (async () => {
    for (const [id, k] of Object.entries(KULUPLER)) {
      if (!k.guid) { window.__myrHatalar[id] = "My Rotary kimliği yok"; continue; }
      const txt = await oku(`https://my.rotary.org/en/domui/club/${k.guid}/details`);
      const r = ayikla(txt);
      window.__myrSonuc[id] = r;
      if (r.hata) { window.__myrHatalar[id] = r.hata; continue; }
      if (!r.when) continue; // My Rotary'de toplantı bilgisi yok
      if (iz(JSON.stringify({ when: r.when, yerler: r.yerler })) !== k.iz) window.__myrDegisen[id] = r;
    }
    window.__myrBitti = true;
  })();
})();
