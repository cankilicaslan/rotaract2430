/* Rotaract Bölge 2430 — Etkileşim */
(() => {
  const { SITE, ILLER, KULUPLER, AKIS, GOREVLILER } = window;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
  const initials = (name) => name.replace(/Rotaract|Kulübü/gi, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toLocaleUpperCase("tr");
  const shortName = (ad) => {
    const s = ad.replace(/ Rotaract Kulübü$/, "");
    return document.documentElement.lang === "en" ? s.replace(/^Bakü /, "Baku ") : s;
  };
  const kulupById = Object.fromEntries(KULUPLER.map((k) => [k.id, k]));
  const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  // ---- Dil desteği: <html lang="en" data-base="../"> İngilizce sayfalar içindir ----
  const EN = document.documentElement.lang === "en";
  const BASE = document.documentElement.dataset.base || "";
  const L = (tr, en) => (EN ? en : tr);
  const LOC = EN ? "en-GB" : "tr-TR";
  const asset = (p) => (p && !/^(https?:|data:)/.test(p) ? BASE + p : p);
  const GUN_EN = { Pazartesi: "Monday", Salı: "Tuesday", Çarşamba: "Wednesday", Perşembe: "Thursday", Cuma: "Friday", Cumartesi: "Saturday", Pazar: "Sunday" };
  const dayName = (g) => (EN ? GUN_EN[g] || g : g);
  const ORD = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th" };
  const siklikText = (s) => {
    if (!s || !EN) return s || "";
    const m = s.match(/(\d)\.\s*ve\s*(\d)\.\s*(\S+)/);
    if (!m) return s;
    const tail = /hafta/i.test(m[3]) ? "week of the month" : (Object.entries(GUN_EN).sort((x, y) => y[0].length - x[0].length).find(([tr]) => m[3].startsWith(tr))?.[1] || "") + " of the month";
    return `${ORD[m[1]]} & ${ORD[m[2]]} ${tail}`.replace(/\s+/g, " ");
  };
  const TERIM_EN = { "Türkçe": "Turkish", "İngilizce": "English", "Yüz yüze ve çevrim içi (Zoom)": "In person and online (Zoom)" };
  const term = (s) => (EN ? TERIM_EN[s] || s : s);
  const BOLGE_EN = { "İç Anadolu": "Central Anatolia", "Akdeniz": "Mediterranean", "Karadeniz": "Black Sea", "Güneydoğu Anadolu": "Southeastern Anatolia", "Azerbaycan": "Azerbaijan" };
  const regionText = (r) => (EN ? BOLGE_EN[r] || r : r);
  const ilText = (il) => (EN && il === "Bakü" ? "Baku" : il);
  const clubName = (ad) => (EN ? ad.replace(/ Rotaract Kulübü$/, " Rotaract Club").replace(/^Bakü /, "Baku ") : ad);
  const grupText = (g) => L(`${g}. grup`, `Group ${g}`);
  const plural = (n, tr, en1, enN) => (EN ? `${n} ${n === 1 ? en1 : enN}` : `${n} ${tr}`);
  const BEKLENIYOR = L("Bilgi bekleniyor", "Not provided yet");

  const REGION_COLORS = {
    "İç Anadolu": "#D41367",
    "Akdeniz": "#0067C8",
    "Karadeniz": "#00718A",
    "Güneydoğu Anadolu": "#B85400",
    "Azerbaycan": "#17458F"
  };
  const CATS = {
    "Toplum Hizmeti": "linear-gradient(135deg,#D41367,#7E0A3D)",
    "Mesleki Gelişim": "linear-gradient(135deg,#17458F,#0067C8)",
    "Uluslararası": "linear-gradient(135deg,#00A2E0,#0067C8)",
    "Kulüp Hizmeti": "linear-gradient(135deg,#F7A81B,#FF7600)",
    "Etkinlik": "linear-gradient(135deg,#7E0A3D,#D41367)"
  };

  // Grup -> sorumlu BRT yardımcısı
  const grupSorumlu = {};
  GOREVLILER.filter((g) => g.ekip === "grup").forEach((g) => (g.grupNo || []).forEach((n) => (grupSorumlu[n] = g.ad)));

  /* ---------- Genel ---------- */
  $$(".donem").forEach((el) => (el.textContent = SITE.donem));
  $("#year").textContent = new Date().getFullYear();
  $$("[data-link]").forEach((a) => {
    const url = SITE.linkler[a.dataset.link];
    if (url) a.href = url;
    else { a.removeAttribute("href"); a.removeAttribute("target"); a.classList.add("is-pending"); }
  });
  if (!SITE.linkler.interact2430) $$("[data-interact-label]").forEach((s) => (s.textContent = L("Bağlantı yakında eklenecek", "Link coming soon")));
  $$("[data-social]").forEach((a) => {
    const url = SITE.iletisim[a.dataset.social];
    if (url) a.href = url; else a.remove();
  });
  const mail = `mailto:${SITE.iletisim.eposta}`;
  if ($("#ctaMail")) $("#ctaMail").href = mail;
  if ($("#footerMail")) { $("#footerMail").href = mail; $("#footerMail").textContent = SITE.iletisim.eposta; }
  if ($("#instaBand")) { $("#instaBand").href = SITE.iletisim.instagram; $("#instaHandle").textContent = SITE.iletisim.instagramKullanici; }

  // Şehir adı <-> adres çubuğu etiketi (kulupler.html#eskisehir)
  const slug = (s) => String(s).replace(/[çÇ]/g, "c").replace(/[ğĞ]/g, "g").replace(/[ıİ]/g, "i").replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s").replace(/[üÜ]/g, "u").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ilBySlug = Object.fromEntries(KULUPLER.map((k) => [slug(k.il), k.il]));

  // Eksik logo dosyaları için metin yedeği
  $$(".fam-logo img").forEach((img) => {
    const fail = () => { const p = img.parentElement; if (!p) return; p.classList.add("fallback"); img.remove(); };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---------- Header ---------- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = $("#navToggle"), nav = $("#mainNav");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? L("Menüyü kapat", "Close menu") : L("Menüyü aç", "Open menu"));
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); toggle.focus(); } });

  const navLinks = $$('.main-nav a[href^="#"]:not(.btn)');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navLinks.forEach((a) => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });

  /* ---------- Sayılar ---------- */
  const gruplar = new Set(KULUPLER.flatMap((k) => String(k.grup).split("-")));
  const counts = {
    kulup: KULUPLER.length,
    il: new Set(KULUPLER.map((k) => k.il)).size,
    ilTR: new Set(KULUPLER.filter((k) => k.il !== "Bakü").map((k) => k.il)).size,
    grup: gruplar.size,
    ulke: KULUPLER.some((k) => k.il === "Bakü") ? 2 : 1
  };
  $$("[data-count]").forEach((el) => {
    const target = counts[el.dataset.count] || 0;
    if (!el.closest(".stats")) { el.textContent = target; return; }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.textContent = target; return; }
    const dur = 1400, t0 = performance.now() + 500;
    const step = (t) => {
      const p = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ---------- Ticker ---------- */
  const tickerItems = KULUPLER.map((k) => shortName(k.ad));
  if ($("#tickerTrack")) $("#tickerTrack").innerHTML = [...tickerItems, ...tickerItems].map((t) => `<span>${esc(t)}</span>`).join("");

  /* ---------- Bölge / Şehirler ---------- */
  const byRegion = {};
  ILLER.forEach((p) => (byRegion[p.bolge] ||= []).push(p.il));
  if ($("#provinceBoard")) $("#provinceBoard").innerHTML = Object.entries(byRegion).map(([region, provs]) => `
    <div class="prov-group">
      <h4><i style="background:${REGION_COLORS[region] || "#D41367"}"></i>${esc(regionText(region))}</h4>
      <div class="prov-tiles">
        ${provs.map((il) => {
          const n = KULUPLER.filter((k) => k.il === il).length;
          return `<button class="prov" style="--c:${REGION_COLORS[region]}" data-il="${esc(il)}" aria-label="${esc(ilText(il))}: ${plural(n, "kulüp", "club", "clubs")}">
            ${esc(ilText(il))}<span class="n">${n}</span></button>`;
        }).join("")}
      </div>
    </div>`).join("");
  $$(".prov").forEach((b) => b.addEventListener("click", () => showClubsOf(b.dataset.il)));

  /* ---------- Türkiye haritası: Rotary bölgeleri ---------- */
  // Kulüp bulucu ayrı sayfada: bu sayfada yoksa oraya şehir seçili olarak git
  const showClubsOf = (il) => {
    if (!$("#clubGrid")) { location.href = `kulupler.html#${slug(il)}`; return; }
    search.value = ""; grupSelect.value = ""; gunSelect.value = "";
    ilSelect.value = il;
    renderClubs();
    ilSelect.focus({ preventScroll: true });
  };
  (() => {
    const M = window.TR_HARITA, RB = window.ROTARY_BOLGELER;
    const svg = $("#trMapSvg");
    if (!M || !RB || !svg) { $("#trMap")?.remove(); return; }
    const bolgeOf = (il) => RB["2420"].includes(il) ? "2420" : RB["2440"].includes(il) ? "2440" : RB.dogrulanacak.includes(il) ? "unk" : "2430";
    const B = L("Bölge", "District");
    const etiket = { "2420": `${B} 2420`, "2430": `${B} 2430`, "2440": `${B} 2440`, unk: L("Bölgesi doğrulanacak", "District to be confirmed") };
    const sayi = {};
    KULUPLER.forEach((k) => (sayi[k.il] = (sayi[k.il] || 0) + 1));
    svg.setAttribute("viewBox", `0 0 ${M.w} ${M.h}`);
    const ns = "http://www.w3.org/2000/svg";
    svg.innerHTML = `<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" class="hatch-bg"/><line x1="0" y1="0" x2="0" y2="6" class="hatch-line"/></pattern></defs>`;
    const gIl = document.createElementNS(ns, "g"), gLbl = document.createElementNS(ns, "g");
    gLbl.setAttribute("class", "map-labels"); gLbl.setAttribute("aria-hidden", "true");
    M.iller.forEach((p) => {
      const b = bolgeOf(p.ad), n = sayi[p.ad] || 0;
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", p.d);
      path.setAttribute("class", `il b${b}${n ? " has-club" : ""}`);
      path.dataset.il = p.ad;
      path.dataset.info = `${etiket[b]}${n ? ` · ${plural(n, "Rotaract kulübü", "Rotaract club", "Rotaract clubs")}` : ""}`;
      if (n) {
        path.setAttribute("tabindex", "0");
        path.setAttribute("role", "button");
        path.setAttribute("aria-label", `${p.ad}, ${etiket[b]}, ${plural(n, "Rotaract kulübü", "Rotaract club", "Rotaract clubs")}. ${L("Kulüpleri listele", "List clubs")}`);
        const t = document.createElementNS(ns, "text");
        t.setAttribute("x", p.c[0]); t.setAttribute("y", p.c[1]);
        t.textContent = n;
        gLbl.appendChild(t);
      } else {
        path.setAttribute("aria-label", `${p.ad}, ${etiket[b]}`);
        path.setAttribute("role", "img");
      }
      gIl.appendChild(path);
    });
    svg.append(gIl, gLbl);

    // Etiket ilin dışına düşerse (girintili kıyılar), il içindeki en yakın noktaya taşı
    const labels = [...gLbl.children];
    M.iller.filter((p) => sayi[p.ad]).forEach((p, i) => {
      const path = svg.querySelector(`.il[data-il="${p.ad}"]`), t = labels[i];
      if (!path?.isPointInFill || !t) return;
      const inside = (x, y) => { try { return path.isPointInFill(new DOMPoint(x, y)); } catch { return true; } };
      const [cx, cy] = p.c;
      if (inside(cx, cy)) return;
      for (let r = 4; r < 120; r += 4) {
        for (let a = 0; a < 360; a += 20) {
          const x = cx + r * Math.cos(a * Math.PI / 180), y = cy + r * Math.sin(a * Math.PI / 180);
          if (inside(x, y) && inside(x + 8, y) && inside(x - 8, y) && inside(x, y + 8) && inside(x, y - 8)) {
            t.setAttribute("x", x.toFixed(1)); t.setAttribute("y", y.toFixed(1)); return;
          }
        }
      }
    });

    const tip = $("#mapTip"), canvas = $(".tr-map-canvas");
    const showTip = (path, x, y) => {
      tip.innerHTML = `<strong>${esc(path.dataset.il)}</strong><span>${esc(path.dataset.info)}</span>`;
      tip.hidden = false;
      const r = canvas.getBoundingClientRect();
      const left = Math.min(Math.max(x - r.left, 70), r.width - 70);
      tip.style.left = `${left}px`;
      tip.style.top = `${y - r.top}px`;
    };
    svg.addEventListener("pointermove", (e) => {
      const p = e.target.closest(".il");
      if (p) showTip(p, e.clientX, e.clientY); else tip.hidden = true;
    });
    svg.addEventListener("pointerleave", () => (tip.hidden = true));
    svg.addEventListener("focusin", (e) => {
      const p = e.target.closest(".il"); if (!p) return;
      const b = p.getBoundingClientRect();
      showTip(p, b.left + b.width / 2, b.top + b.height / 2);
    });
    svg.addEventListener("focusout", () => (tip.hidden = true));
    svg.addEventListener("click", (e) => { const p = e.target.closest(".il.has-club"); if (p) showClubsOf(p.dataset.il); });
    svg.addEventListener("keydown", (e) => {
      const p = e.target.closest(".il.has-club");
      if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showClubsOf(p.dataset.il); }
    });
  })();

  /* ---------- Kulüp Bulucu (kulupler.html) ---------- */
  const ilSelect = $("#finderIl"), grupSelect = $("#finderGrup"), gunSelect = $("#finderGun"), search = $("#finderSearch");
  const hasFinder = !!$("#clubGrid");
  if (hasFinder) [...new Set(KULUPLER.map((k) => k.il))].sort((a, b) => a.localeCompare(b, "tr")).forEach((il) => {
    const n = KULUPLER.filter((k) => k.il === il).length;
    ilSelect.insertAdjacentHTML("beforeend", `<option value="${esc(il)}">${esc(ilText(il))} (${n})</option>`);
  });
  if (hasFinder) [...new Set(KULUPLER.map((k) => k.grup))].forEach((g) => {
    grupSelect.insertAdjacentHTML("beforeend", `<option value="${esc(g)}">${esc(grupText(g))}</option>`);
  });

  const meetLine = (t) => (t?.gun ? `${dayName(t.gun)} ${t.saat}` : L("Toplantı günü: bilgi bekleniyor", "Meeting day: not provided yet"));
  const clubCard = (k) => `
    <button class="club-card" data-club="${esc(k.id)}" aria-label="${esc(clubName(k.ad))}, ${esc(ilText(k.il))}: ${L("ayrıntıları aç", "open details")}">
      <span class="club-top">
        ${k.baskanFoto
          ? `<img class="club-badge club-photo" src="${esc(asset(k.baskanFoto))}" alt="" loading="lazy" width="44" height="44">`
          : `<span class="club-badge" aria-hidden="true">${esc(initials(k.ad))}</span>`}
        <span><span class="club-name">${esc(shortName(k.ad))}</span><span class="club-loc">${esc(k.ilce ? `${k.ilce}, ${ilText(k.il)}` : ilText(k.il))}</span></span>
      </span>
      <span class="club-rows">
        <span><span class="k">${L("Başkan", "President")}</span><span class="v">${esc(k.baskan)}</span></span>
        <span><span class="k">${L("Toplantı", "Meeting")}</span><span class="v">${esc(meetLine(k.toplanti))}</span></span>
        <span><span class="k">${L("Yer", "Venue")}</span><span class="v">${esc(k.toplanti?.yer || L("Kulüple iletişime geçin", "Contact the club"))}</span></span>
      </span>
      <span class="club-group">${esc(grupText(k.grup))}</span>
    </button>`;

  function renderClubs() {
    const q = norm(search.value.trim()), il = ilSelect.value, grup = grupSelect.value, gun = gunSelect.value;
    const list = KULUPLER.filter((k) =>
      (!il || k.il === il) &&
      (!grup || k.grup === grup) &&
      (!gun || k.toplanti?.gun === gun) &&
      (!q || norm([k.ad, k.il, k.ilce, k.baskan, k.eposta, k.toplanti?.yer].join(" ")).includes(q))
    ).sort((a, b) => a.il.localeCompare(b.il, "tr") || a.ad.localeCompare(b.ad, "tr"));

    $("#clubGrid").innerHTML = list.map(clubCard).join("");
    $("#clubEmpty").hidden = list.length > 0;
    $("#finderCount").textContent = plural(list.length, "kulüp", "club", "clubs");
    $("#finderReset").hidden = !(q || il || grup || gun);
  }
  if (hasFinder) {
    // Adres çubuğundaki şehir (#eskisehir) seçili gelsin
    const applyHash = () => {
      const il = ilBySlug[decodeURIComponent(location.hash.slice(1))];
      if (il) { search.value = ""; grupSelect.value = ""; gunSelect.value = ""; ilSelect.value = il; }
      renderClubs();
    };
    [search, ilSelect, grupSelect, gunSelect].forEach((el) => el.addEventListener("input", renderClubs));
    $("#finderReset").addEventListener("click", () => { search.value = ""; ilSelect.value = ""; grupSelect.value = ""; gunSelect.value = ""; renderClubs(); });
    $("#clubGrid").addEventListener("click", (e) => { const c = e.target.closest("[data-club]"); if (c) openClub(c.dataset.club); });
    addEventListener("hashchange", applyHash);
    applyHash();
  }

  /* ---------- Modal ---------- */
  const modal = $("#clubModal");
  let lastFocus = null;
  function openClub(id) {
    const k = kulupById[id];
    if (!k) return;
    const t = k.toplanti || {};
    const mapsQuery = t.yer ? `${t.yer} ${t.adres || ""} ${k.ilce || ""} ${k.il}` : "";
    const maps = mapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}` : "";
    const ig = k.instagram ? `https://www.instagram.com/${k.instagram.replace(/^@/, "")}/` : "";
    const subject = encodeURIComponent(L(`${k.ad} hakkında bilgi`, `About ${clubName(k.ad)}`));
    const sorumlu = grupSorumlu[k.grup];
    $("#modalBody").innerHTML = `
      <div class="m-head">
        ${k.baskanFoto
          ? `<img class="m-photo" src="${esc(asset(k.baskanFoto))}" alt="${esc(k.baskan)}, ${L("kulüp başkanı", "club president")}" width="84" height="84">`
          : `<div class="club-badge">${esc(initials(k.ad))}</div>`}
        <h3 id="modalTitle">${esc(clubName(k.ad))}</h3>
        <p>${esc(k.ilce ? `${k.ilce}, ${ilText(k.il)}` : ilText(k.il))} · ${esc(grupText(k.grup))}</p>
      </div>
      <div class="m-body">
        <div class="m-grid">
          <div class="m-item"><small>${L("Kulüp başkanı", "Club president")} (${esc(SITE.donem)})</small><strong>${esc(k.baskan)}</strong>${k.eposta ? `<a class="m-mail" href="mailto:${esc(k.eposta)}?subject=${subject}">${esc(k.eposta)}</a>` : ""}</div>
          <div class="m-item"><small>${L("Toplantı", "Meeting")}</small><strong>${t.gun ? `${esc(dayName(t.gun))}, ${esc(t.saat)}` : BEKLENIYOR}</strong>${t.siklik ? `<span>${esc(siklikText(t.siklik))}</span>` : ""}</div>
          <div class="m-item wide"><small>${L("Toplantı yeri", "Venue")}</small><strong>${esc(t.yer || BEKLENIYOR)}</strong>${t.adres ? `<span>${esc(t.adres)}</span>` : ""}</div>
          ${t.dil || t.format ? `<div class="m-item wide"><small>${L("Toplantı biçimi", "Format")}</small><strong>${esc([t.format, t.dil].filter(Boolean).map(term).join(" · "))}</strong></div>` : ""}
          ${sorumlu ? `<div class="m-item wide"><small>${L("Grup sorumlusu (BRT yardımcısı)", "Group coordinator (Assistant DRR)")}</small><strong>${esc(sorumlu)}</strong></div>` : ""}
        </div>
        <div class="m-actions">
          <a class="btn btn-primary btn-sm" href="mailto:${esc(k.eposta || SITE.iletisim.eposta)}?subject=${subject}">${k.eposta ? L("Başkana e-posta gönder", "Email the president") : L("Bölgeye e-posta gönder", "Email the district")}</a>
          ${ig ? `<a class="btn btn-outline btn-sm" href="${esc(ig)}" target="_blank" rel="noopener">Instagram</a>` : ""}
          ${maps ? `<a class="btn btn-outline btn-sm" href="${esc(maps)}" target="_blank" rel="noopener">${L("Haritada aç", "Open in Maps")}</a>` : ""}
        </div>
        <p class="m-note">${L("Toplantı bilgileri My Rotary kayıtlarından alınmıştır. Ziyaret etmeden önce kulüple iletişime geçmenizi öneririz.", "Meeting details come from My Rotary records. Please contact the club before visiting.")}</p>
      </div>`;
    showModal();
  }
  function showModal() {
    if (modal.hidden) lastFocus = document.activeElement;
    modal.hidden = false;
    $(".modal-panel", modal).scrollTop = 0;
    document.body.style.overflow = "hidden";
    $$("body > header, body > main, body > footer").forEach((el) => (el.inert = true));
    $(".modal-close", modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    $$("body > header, body > main, body > footer").forEach((el) => (el.inert = false));
    lastFocus?.focus();
  }
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
  addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") { // odak tuzağı
      const f = $$("a[href],button", modal);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- Bu hafta: toplantı takvimi ---------- */
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d; });
  // "Ayın 2. ve 4. Perşembesi" / "Ayın 1. ve 3. haftası" → [2,4] / [1,3]; sıklık yoksa her hafta
  const haftalar = (siklik) => {
    const m = String(siklik || "").match(/(\d)\.\s*ve\s*(\d)\./);
    return m ? [+m[1], +m[2]] : null;
  };
  const meetsOn = (k, d) => {
    if (k.toplanti?.gun !== GUNLER[d.getDay()]) return false;
    const w = haftalar(k.toplanti.siklik);
    return !w || w.includes(Math.ceil(d.getDate() / 7));
  };
  const meetingsOn = (d) => KULUPLER.filter((k) => meetsOn(k, d));

  let activeDay = 0;
  const tabs = $("#weekTabs");
  if (tabs) tabs.innerHTML = days.map((d, i) => {
    const gun = GUNLER[d.getDay()];
    const n = meetingsOn(d).length;
    const label = i === 0 ? L("Bugün", "Today") : i === 1 ? L("Yarın", "Tomorrow") : dayName(gun);
    return `<button role="tab" class="day" id="day-${i}" data-i="${i}" aria-selected="${i === 0}" aria-controls="agendaPanel" tabindex="${i === 0 ? 0 : -1}">
      <span class="day-name">${label}</span>
      <span class="day-date">${d.toLocaleDateString(LOC, { day: "numeric", month: "short" })}</span>
      <span class="day-n">${plural(n, "toplantı", "meeting", "meetings")}</span></button>`;
  }).join("");
  const selectDay = (i, focus = false) => {
    activeDay = i;
    $$(".day", tabs).forEach((x, j) => { x.setAttribute("aria-selected", j === i); x.tabIndex = j === i ? 0 : -1; });
    $("#agendaPanel").setAttribute("aria-labelledby", `day-${i}`);
    if (focus) $(`#day-${i}`).focus();
    renderAgenda();
  };
  if (tabs) tabs.addEventListener("click", (e) => { const b = e.target.closest(".day"); if (b) selectDay(+b.dataset.i); });
  if (tabs) tabs.addEventListener("keydown", (e) => {
    const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (e.key in map) { e.preventDefault(); selectDay((activeDay + map[e.key] + 7) % 7, true); }
    else if (e.key === "Home") { e.preventDefault(); selectDay(0, true); }
    else if (e.key === "End") { e.preventDefault(); selectDay(6, true); }
  });
  function renderAgenda() {
    const gun = GUNLER[days[activeDay].getDay()];
    const list = meetingsOn(days[activeDay]).sort((a, b) => a.toplanti.saat.localeCompare(b.toplanti.saat) || a.il.localeCompare(b.il, "tr"));
    if (!list.length) {
      $("#agenda").innerHTML = `<li class="agenda-empty">${L(`Bu ${esc(gun.toLocaleLowerCase("tr"))} kayıtlı kulüp toplantısı yok. Başka bir güne bakın.`, `No club meetings on record for this ${esc(dayName(gun))}. Try another day.`)}</li>`;
      return;
    }
    $("#agenda").innerHTML = list.map((k) => `
      <li>
        <time>${esc(k.toplanti.saat)}</time>
        <button class="agenda-club" data-club="${esc(k.id)}">
          <strong>${esc(shortName(k.ad))}</strong>
          <span>${esc(k.toplanti.yer || L("Yer bilgisi için kulüple iletişime geçin", "Contact the club for the venue"))}${k.toplanti.siklik ? ` — ${esc(EN ? siklikText(k.toplanti.siklik) : k.toplanti.siklik.toLocaleLowerCase("tr"))}` : ""}</span>
        </button>
        <span class="agenda-city">${esc(ilText(k.il))}</span>
      </li>`).join("");
  }
  if (tabs) {
    $("#agenda").addEventListener("click", (e) => { const b = e.target.closest("[data-club]"); if (b) openClub(b.dataset.club); });
    renderAgenda();
  }

  /* ---------- Haberler (AKIS boş değilse) ---------- */
  if (AKIS.length && $("#newsWrap")) {
    $("#newsWrap").hidden = false;
    const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString(LOC, { day: "numeric", month: "long", year: "numeric" });
    $("#feed").innerHTML = [...AKIS].sort((a, b) => b.tarih.localeCompare(a.tarih)).map((p) => {
      const k = kulupById[p.kulupId] || { ad: "Bölge 2430", id: "" };
      const media = p.gorsel ? `<img src="${esc(p.gorsel)}" alt="">` : "";
      return `<article class="post">
        <div class="post-media" style="background:${CATS[p.kategori] || CATS["Etkinlik"]}">${media}<span class="cat">${esc(p.kategori)}</span></div>
        <div class="post-body">
          <p class="post-meta">${k.id ? `<button data-club="${esc(k.id)}">${esc(shortName(k.ad))}</button>` : esc(k.ad)}, ${fmtDate(p.tarih)}</p>
          <h3>${esc(p.baslik)}</h3>
          <p>${esc(p.ozet)}</p>
        </div>
      </article>`;
    }).join("");
    $("#feed").addEventListener("click", (e) => { const b = e.target.closest("[data-club]"); if (b) openClub(b.dataset.club); });
  }

  /* ---------- Görevliler ---------- */
  const lead = GOREVLILER.find((g) => g.vurgu);
  // İngilizce unvan/açıklama js/data-en.js içinden gelir (unvanEn, aciklamaEn)
  const unvanOf = (g) => (EN && g.unvanEn) || (EN && g.ekip === "grup" ? g.unvan.replace(/(\d+(?:-\d+)?)\. ve (\d+)\. Grup/, "Groups $1 & $2").replace(/^(\d+)\. Grup$/, "Group $1") : g.unvan);
  const person = (g, extra = "") => `
    <li class="member ${extra}">
      <button class="member-btn" data-person="${GOREVLILER.indexOf(g)}" aria-haspopup="dialog" aria-label="${esc(g.ad)}, ${esc(unvanOf(g))}: ${L("ayrıntıları aç", "open details")}">
        <span class="avatar">${g.foto ? `<img src="${esc(asset(g.foto))}" alt="" loading="lazy">` : `<span>${esc(initials(g.ad))}</span>`}</span>
        <span class="member-text"><span class="member-name">${esc(g.ad)}</span><span class="role">${esc(unvanOf(g))}</span></span>
      </button>
    </li>`;

  // Görevli kartı: e-posta, kulüp, komite ve görevin ne işe yaradığı
  const gorevAdi = (g) =>
    EN ? (g.ekip === "komite" ? `Assistant DRR for ${unvanOf(g).split(" · ").join(" and ")}`
        : g.ekip === "grup" ? `Assistant DRR for ${unvanOf(g)} clubs` : unvanOf(g))
    : g.ekip === "komite" ? `${g.unvan.split(" · ").join(" ve ")} ${g.unvan.includes(" · ") ? "komitelerinden" : "komitesinden"} sorumlu BRT yardımcısı`
    : g.ekip === "grup" ? `${g.unvan} kulüplerinden sorumlu BRT yardımcısı`
    : g.unvan;
  function openPerson(i) {
    const g = GOREVLILER[i];
    if (!g) return;
    const subject = encodeURIComponent(L("Rotaract Bölge 2430", "Rotaract District 2430"));
    const grupKulupleri = g.ekip === "grup"
      ? KULUPLER.filter((k) => (g.grupNo || []).includes(k.grup)).sort((a, b) => a.ad.localeCompare(b.ad, "tr"))
      : [];
    const aciklama = (EN ? g.aciklamaEn : g.aciklama) || (g.ekip === "grup"
      ? L(`Grubundaki ${grupKulupleri.length} kulübün bölgeyle ilk iletişim noktasıdır. Kulüpleri ziyaret eder, toplantılarına katılır; kulüplerin ihtiyaçlarını ve sorularını bölge ekibine taşır, bölge duyurularını kulüplere ulaştırır.`,
          `The first point of contact between the district and the ${grupKulupleri.length} clubs in this group. Visits the clubs and joins their meetings, brings their needs and questions to the district team, and passes district announcements on to them.`)
      : "");
    const komite = g.ekip === "komite" ? unvanOf(g).split(" · ") : [];
    $("#modalBody").innerHTML = `
      <div class="m-head">
        ${g.foto
          ? `<img class="m-photo" src="${esc(asset(g.foto))}" alt="${esc(g.ad)}" width="84" height="84">`
          : `<div class="club-badge">${esc(initials(g.ad))}</div>`}
        <h3 id="modalTitle">${esc(g.ad)}</h3>
        <p>${esc(gorevAdi(g))} · ${esc(SITE.donem)}</p>
      </div>
      <div class="m-body">
        <div class="m-grid">
          ${g.eposta ? `<div class="m-item wide"><small>${L("E-posta", "Email")}</small><a class="m-mail m-mail-lg" href="mailto:${esc(g.eposta)}?subject=${subject}">${esc(g.eposta)}</a></div>` : ""}
          ${g.kulup ? `<div class="m-item wide"><small>${L("Kulübü", "Club")}</small><strong>${esc(g.kulup)}</strong></div>` : ""}
          ${komite.length ? `<div class="m-item wide"><small>${komite.length > 1 ? L("Komiteleri", "Committees") : L("Komitesi", "Committee")}</small><strong>${komite.map(esc).join(", ")}</strong></div>` : ""}
          ${g.ekip === "grup" ? `<div class="m-item wide"><small>${L("Sorumlu olduğu grup", "Responsible for")}</small><strong>${esc(unvanOf(g))}</strong></div>` : ""}
        </div>
        ${aciklama ? `<h4 class="m-subtitle">${g.ekip === "komite" ? L("Komite ne yapar?", "What does the committee do?") : L("Bu görev ne yapar?", "What does this role do?")}</h4><p class="m-desc">${esc(aciklama)}</p>` : ""}
        ${grupKulupleri.length ? `<h4 class="m-subtitle">${L("Gruptaki kulüpler", "Clubs in this group")}</h4>
          <div class="m-clubs">${grupKulupleri.map((k) => `<button class="m-club" data-club="${esc(k.id)}">${esc(shortName(k.ad))}<span>${esc(ilText(k.il))}</span></button>`).join("")}</div>` : ""}
        ${g.eposta ? `<div class="m-actions"><a class="btn btn-primary btn-sm" href="mailto:${esc(g.eposta)}?subject=${subject}">${L("E-posta gönder", "Send email")}</a></div>` : ""}
      </div>`;
    showModal();
  }
  modal.addEventListener("click", (e) => { const c = e.target.closest(".m-club"); if (c) openClub(c.dataset.club); });
  if ($("#team")) $("#team").addEventListener("click", (e) => { const b = e.target.closest("[data-person]"); if (b) openPerson(+b.dataset.person); });
  const block = (title, sub, items) => `
    <div class="team-block">
      <div class="team-block-head"><h3>${title}</h3><p>${sub}</p></div>
      <ul class="team-list">${items.map((g) => person(g)).join("")}</ul>
    </div>`;
  if ($("#team")) $("#team").innerHTML = `
    ${lead ? `<ul class="team-lead">${person(lead, "lead")}</ul>` : ""}
    ${block(L("Bölge yönetimi", "District leadership"), L("Sekreterya ve saymanlık", "Secretariat and treasury"), GOREVLILER.filter((g) => g.ekip === "yonetim" && !g.vurgu))}
    ${block(L("Komite sorumluları", "Committee chairs"), L("BRT yardımcıları, komite bazında", "Assistant DRRs, by committee"), GOREVLILER.filter((g) => g.ekip === "komite"))}
    ${block(L("Grup sorumluları", "Group coordinators"), L("Kulüplerin ilk iletişim noktası olan BRT yardımcıları", "Assistant DRRs who are each club's first point of contact"), GOREVLILER.filter((g) => g.ekip === "grup"))}`;
})();
