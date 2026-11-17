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
    // Sağda Bakü için yer bırak (Azerbaycan'daki kulüp)
    const BAKU = (window.TR_HARITA_EK || []).find((x) => x.ad === "Bakü");
    const bakuVar = !!BAKU && KULUPLER.some((k) => k.il === "Bakü");
    svg.setAttribute("viewBox", `0 0 ${bakuVar ? BAKU.genislik : M.w} ${M.h}`);
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

    // Bakü: Türkiye illeriyle aynı ölçekte kendi sınırıyla, haritanın sağında (mesafe kısaltıldı)
    if (bakuVar) {
      const n = sayi["Bakü"], [x, y] = BAKU.c;
      const g = document.createElementNS(ns, "path");
      g.setAttribute("d", BAKU.d);
      g.setAttribute("class", "il b2430 has-club il-baku");
      g.dataset.il = ilText("Bakü");
      g.dataset.ilKey = "Bakü";
      g.dataset.info = `${etiket["2430"]} · ${L("Azerbaycan", "Azerbaijan")} · ${KULUPLER.filter((k) => k.il === "Bakü").map((k) => clubName(k.ad)).join(", ")}`;
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", `${ilText("Bakü")}, ${L("Azerbaycan", "Azerbaijan")}, ${etiket["2430"]}, ${plural(n, "Rotaract kulübü", "Rotaract club", "Rotaract clubs")}. ${L("Kulüpleri listele", "List clubs")}`);
      // Kesikli çizgi (uzakta olduğunu anlatır) + il gibi sayı etiketi + ad
      const ek = document.createElementNS(ns, "g");
      ek.setAttribute("class", "baku-ek");
      ek.setAttribute("aria-hidden", "true");
      ek.innerHTML = `<line class="baku-yol" x1="${M.w - 8}" y1="${y}" x2="${BAKU.sol - 6}" y2="${y}"/>
        <text class="baku-ad" x="${x}" y="${y + 52}">${esc(ilText("Bakü"))}</text>
        <text class="baku-ulke" x="${x}" y="${y + 70}">${esc(L("Azerbaycan", "Azerbaijan"))}</text>`;
      gIl.appendChild(g);
      svg.insertBefore(ek, gIl);
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", x); t.setAttribute("y", y);
      t.textContent = n;
      gLbl.appendChild(t);
    }

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
    svg.addEventListener("click", (e) => { const p = e.target.closest(".il.has-club"); if (p) showClubsOf(p.dataset.ilKey || p.dataset.il); });
    svg.addEventListener("keydown", (e) => {
      const p = e.target.closest(".il.has-club");
      if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); showClubsOf(p.dataset.ilKey || p.dataset.il); }
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

  /* ---------- Yakında: bölge takviminden yaklaşan organizasyonlar ---------- */
  // Veri: data/etkinlikler.json (GitHub Actions günde birkaç kez Google Takvim'den üretir)
  // Solda "sıradaki" kart + canlı geri sayım, sağda ay ay gruplanmış zaman çizelgesi.
  (async () => {
    const list = $("#evList"), next = $("#evNext"), Ek = window.Etkinlik;
    if (!list || !Ek) return;
    const TUR = {
      parti: { ad: L("Parti", "Party"), ikon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20 9 7l8 8z"/><path d="M13 3.5 14 2M19.5 9 22 8M17 5l2.5-2.5M15.5 10.5 21 5"/><circle cx="20" cy="13" r=".6" fill="currentColor"/><circle cx="11" cy="3" r=".6" fill="currentColor"/></svg>' },
      etkinlik: { ad: L("Etkinlik", "Event"), ikon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"/></svg>' },
      proje: { ad: L("Proje", "Project"), ikon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4A5 5 0 0 1 12 6.4a5 5 0 0 1 9.3 4.7c-1.8 4.8-9.3 9.4-9.3 9.4z"/></svg>' }
    };
    const TUM_IKON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
    const EKLE_IKON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg>';
    const ADIM = 8;
    let tumu = [], filtre = "", gosterilen = ADIM, sayac = null;

    // Saatli etkinliklerde günü İstanbul saatine göre al (00:00–03:00 arası UTC'de önceki güne düşer)
    const trGun = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" });
    const ymd = (s) => (s.length > 10 ? trGun.format(new Date(s)) : s);
    let bugun = trGun.format(new Date());
    const gunFarki = (s) => Math.round((Date.parse(`${ymd(s)}T00:00:00Z`) - Date.parse(`${bugun}T00:00:00Z`)) / 864e5);
    const ne = (n) => n < 0 ? L("Devam ediyor", "Happening now") : n === 0 ? L("Bugün", "Today")
      : n === 1 ? L("Yarın", "Tomorrow") : L(`${n} gün sonra`, `In ${n} days`);
    const gun = (s, o) => new Date(`${ymd(s)}T12:00:00Z`).toLocaleDateString(LOC, { timeZone: "UTC", ...o });
    const saat = (s) => new Date(s).toLocaleTimeString(LOC, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" });
    const baslangicAni = (e) => Date.parse(e.tumGun ? `${e.baslangic}T00:00:00+03:00` : e.baslangic);
    const bitisAni = (e) => e.tumGun ? Date.parse(`${e.bitis}T23:59:59+03:00`) : Date.parse(e.bitis);

    // "Ankara X Rotaract Kulübü-Etkinlik adı" -> düzenleyen + etkinlik adı
    const parcala = (baslik) => {
      const b = Ek.baslikTemizle(baslik);
      const m = b.match(/^(.*Kul[uü]b[uü])\s*-\s*(.+)$/i);
      return m ? { duzenleyen: m[1].trim(), ad: m[2].trim() } : { duzenleyen: "", ad: b };
    };
    const tarihMetni = (e) => {
      const cokGun = ymd(e.bitis) !== ymd(e.baslangic);
      return cokGun
        ? `${gun(e.baslangic, { day: "numeric", month: "short" })} – ${gun(e.bitis, { day: "numeric", month: "short" })}`
        : gun(e.baslangic, { day: "numeric", month: "long", weekday: "long" }) + (e.tumGun ? "" : `, ${saat(e.baslangic)}`);
    };
    // Google Takvim'e ekleme bağlantısı
    const takvimLink = (e, ad) => {
      const d = (s) => s.replace(/-/g, "");
      const z = (s) => new Date(s).toISOString().replace(/[-:]|\.\d{3}/g, "");
      const ertesi = (s) => { const t = new Date(`${s}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + 1); return t.toISOString().slice(0, 10); };
      const tarih = e.tumGun ? `${d(e.baslangic)}/${d(ertesi(e.bitis))}` : `${z(e.baslangic)}/${z(e.bitis)}`;
      const q = new URLSearchParams({ action: "TEMPLATE", text: ad, dates: tarih, details: L("Rotaract Bölge 2430 takvimi", "Rotaract District 2430 calendar"), ctz: "Europe/Istanbul" });
      if (e.yer) q.set("location", e.yer);
      return `https://calendar.google.com/calendar/render?${q}`;
    };
    // Düzenleyen: kulüp düğmeleri, grup sorumlusu ya da düz metin
    const kimHtml = (e, duzenleyen) => {
      const kulupler = Ek.kulupBul(e.baslik, KULUPLER);
      if (kulupler.length) return kulupler.map((k) => `<button type="button" class="ev-club" data-club="${esc(k.id)}">${esc(shortName(k.ad))}</button>`).join("");
      const grup = Ek.grupBul(e.baslik, KULUPLER);
      const sorumlu = grup != null ? GOREVLILER.findIndex((g) => (g.grupNo || []).includes(grup)) : -1;
      if (sorumlu >= 0) return `<button type="button" class="ev-club" data-person="${sorumlu}">${esc(grupText(grup))}</button>`;
      return `<span class="ev-org">${esc(duzenleyen || L("Rotary Bölge 2430", "Rotary District 2430"))}</span>`;
    };

    // ---- Sıradaki organizasyon kartı + geri sayım ----
    const kutu = (id, etiket) => `<div class="cd-box" aria-hidden="true"><span class="cd-n" data-cd="${id}">00</span><span class="cd-l">${etiket}</span></div>`;
    const sayacGuncelle = (e) => {
      const kalan = baslangicAni(e) - Date.now();
      const alan = $(".ev-countdown", next);
      if (!alan) return;
      if (kalan <= 0) {
        alan.innerHTML = `<p class="cd-now">${L("Şu an devam ediyor!", "Happening right now!")}</p>`;
        clearInterval(sayac);
        // Bitince listeden düşür ve sıradakine geç
        sayac = setTimeout(() => { tumu = tumu.filter((x) => bitisAni(x) >= Date.now()); filtreCiz(); ciz(); },
          Math.min(Math.max(bitisAni(e) - Date.now(), 0) + 1000, 2 ** 31 - 1));
        return;
      }
      const s = Math.floor(kalan / 1000);
      const parca = { g: Math.floor(s / 86400), s: Math.floor((s % 86400) / 3600), d: Math.floor((s % 3600) / 60), sn: s % 60 };
      const sr = $(".cd-sr", alan);
      const cumle = L(`Başlamasına ${parca.g} gün ${parca.s} saat ${parca.d} dakika var`, `Starts in ${parca.g} days ${parca.s} hours ${parca.d} minutes`);
      if (sr && sr.textContent !== cumle) sr.textContent = cumle;
      for (const [k, v] of Object.entries(parca)) {
        const el = $(`[data-cd="${k}"]`, alan);
        const yeni = String(v).padStart(2, "0");
        if (el && el.textContent !== yeni) { el.textContent = yeni; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); }
      }
    };
    const sirdakiCiz = (e) => {
      clearInterval(sayac); clearTimeout(sayac); sayac = null;
      next.setAttribute("aria-busy", "false");
      if (!e) { next.hidden = true; return; }
      next.hidden = false;
      const tur = Ek.turBul(e.baslik), { duzenleyen, ad } = parcala(e.baslik);
      next.className = `ev-next ev-${tur}`;
      next.innerHTML = `
        <p class="ev-next-label">${L("Sıradaki organizasyon", "Next up")}</p>
        <p class="ev-badge">${TUR[tur].ikon}${esc(TUR[tur].ad)}</p>
        <h3 class="ev-next-title">${esc(ad)}</h3>
        <p class="ev-next-date"><time datetime="${esc(e.baslangic)}">${esc(tarihMetni(e))}</time></p>
        ${e.yer ? `<p class="ev-place">${esc(e.yer)}</p>` : ""}
        <div class="ev-who">${kimHtml(e, duzenleyen)}</div>
        <div class="ev-countdown"><span class="sr-only cd-sr"></span>
          ${kutu("g", L("gün", "days"))}${kutu("s", L("saat", "hrs"))}${kutu("d", L("dakika", "min"))}${kutu("sn", L("saniye", "sec"))}
        </div>
        <a class="btn btn-light btn-sm ev-add" href="${esc(takvimLink(e, ad))}" target="_blank" rel="noopener">${EKLE_IKON}${L("Takvimime ekle", "Add to my calendar")}</a>`;
      sayacGuncelle(e);
      if (baslangicAni(e) > Date.now()) sayac = setInterval(() => sayacGuncelle(e), 1000);
    };

    // ---- Zaman çizelgesi (ay ay) ----
    const satir = (e, i, eski) => {
      const tur = Ek.turBul(e.baslik), { duzenleyen, ad } = parcala(e.baslik);
      const n = gunFarki(e.baslangic);
      return `<li class="ev ev-${tur}${n <= 7 ? " ev-soon" : ""}${i < eski ? " ev-eski" : ""}" style="--i:${Math.min(Math.max(i - eski, 0), 8)}">
        <div class="ev-date" aria-hidden="true">
          <span class="ev-day">${esc(gun(e.baslangic, { day: "numeric" }))}</span>
          <span class="ev-wd">${esc(gun(e.baslangic, { weekday: "short" }))}</span>
        </div>
        <span class="ev-dot" aria-hidden="true">${TUR[tur].ikon}</span>
        <div class="ev-body">
          <p class="ev-top"><span class="ev-type">${esc(TUR[tur].ad)}</span><span class="ev-rel">${esc(ne(n))}</span></p>
          <h4 class="ev-title">${esc(ad)}</h4>
          <p class="ev-when"><time datetime="${esc(e.baslangic)}">${esc(tarihMetni(e))}</time>${e.yer ? ` · ${esc(e.yer)}` : ""}</p>
          <div class="ev-who">${kimHtml(e, duzenleyen)}</div>
        </div>
        <a class="ev-add-sm" href="${esc(takvimLink(e, ad))}" target="_blank" rel="noopener" aria-label="${esc(ad)}: ${L("takvimime ekle", "add to my calendar")}" title="${L("Takvimime ekle", "Add to my calendar")}">${EKLE_IKON}</a>
      </li>`;
    };

    const filtreCiz = () => {
      const say = (t) => tumu.filter((e) => !t || Ek.turBul(e.baslik) === t).length;
      $("#evFilters").innerHTML = [["", L("Tümü", "All"), TUM_IKON], ...Object.entries(TUR).map(([k, v]) => [k, v.ad, v.ikon])]
        .map(([k, ad, ikon]) => `<button type="button" class="ev-chip${k ? ` ev-chip-${k}` : ""}" data-tur="${k}" aria-pressed="${k === filtre}" aria-label="${ad} (${say(k)})">${ikon}<span>${ad}</span><span class="n">${say(k)}</span></button>`)
        .join("");
    };

    let onceki = 0;
    const ciz = (dahaFazla) => {
      bugun = trGun.format(new Date());
      const eski = dahaFazla ? onceki : 0;
      const liste = tumu.filter((e) => !filtre || Ek.turBul(e.baslik) === filtre);
      sirdakiCiz(liste[0]);
      const kalan = liste.slice(1), gorunen = kalan.slice(0, gosterilen);
      const aylar = [];
      gorunen.forEach((e) => {
        const anahtar = ymd(e.baslangic).slice(0, 7);
        let ay = aylar.find((a) => a.anahtar === anahtar);
        if (!ay) aylar.push(ay = { anahtar, liste: [] });
        ay.liste.push(e);
      });
      let i = 0;
      list.innerHTML = aylar.map((a) => {
        const toplam = kalan.filter((e) => ymd(e.baslangic).startsWith(a.anahtar)).length;
        const baslik = new Date(`${a.anahtar}-15T12:00:00Z`).toLocaleDateString(LOC, { month: "long", year: "numeric", timeZone: "UTC" });
        return `<section class="ev-month"><h3 class="ev-month-title">${esc(baslik)} <span>${plural(toplam, "organizasyon", "event", "events")}</span></h3>
          <ol class="ev-list">${a.liste.map((e) => satir(e, i++, eski)).join("")}</ol></section>`;
      }).join("");
      $("#evEmpty").hidden = liste.length > 0;
      $("#evEmpty").textContent = filtre
        ? L(`Yakında bu türde organizasyon yok. "Tümü"ne bakın.`, `Nothing of this type coming up. Try "All".`)
        : L("Takvimde yaklaşan organizasyon yok.", "No upcoming events in the calendar.");
      $("#evMore").hidden = kalan.length <= gosterilen;
      onceki = gorunen.length;
      const durum = $("#evStatus");
      if (durum) durum.textContent = L(`${liste.length} organizasyon gösteriliyor`, `Showing ${liste.length} events`);
      $$(".ev-chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tur === filtre));
    };

    $("#evFilters").addEventListener("click", (e) => {
      const b = e.target.closest(".ev-chip"); if (!b) return;
      filtre = b.dataset.tur; gosterilen = ADIM; ciz();
    });
    $("#evMore").addEventListener("click", () => { gosterilen += ADIM; ciz(true); });
    $("#yakinda").addEventListener("click", (e) => {
      const c = e.target.closest("[data-club]"); if (c) return openClub(c.dataset.club);
      const p = e.target.closest("[data-person]"); if (p) openPerson(+p.dataset.person);
    });

    next.innerHTML = '<div class="ev-skel"></div>';
    try {
      const res = await fetch(`${BASE}data/etkinlikler.json`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.status);
      const veri = await res.json();
      tumu = Ek.yaklasanlar(veri.etkinlikler || [], new Date());
      if (veri.guncelleme) {
        $("#evUpdated").textContent = L("Takvimdeki son değişiklik:", "Last calendar change:") + " " +
          new Date(veri.guncelleme).toLocaleString(LOC, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }) + ".";
      }
    } catch (err) {
      console.warn("Takvim verisi alınamadı:", err);
      tumu = [];
    }
    filtreCiz();
    ciz();
  })();

  /* ---------- Bölge organizasyonları: üst şerit + asamble/konferans sayfaları ---------- */
  // Veri: data/organizasyonlar.json (GitHub Actions organizasyon sitelerinden günde 4 kez üretir)
  (async () => {
    const serit = $("#orgBar"), sayfa = $("#orgPage");
    if (!serit && !sayfa) return;
    let veri = {};
    try {
      const res = await fetch(`${BASE}data/organizasyonlar.json`, { cache: "no-cache" });
      if (res.ok) veri = await res.json();
    } catch (err) { console.warn("Organizasyon verisi alınamadı:", err); }
    const orgs = veri.organizasyonlar || {};
    const ayar = Object.fromEntries((window.ORGANIZASYONLAR || []).map((o) => [o.id, o]));
    const tarihMetni = (t) => {
      if (!t?.baslangic) return "";
      if (!EN) return t.metin;
      const g = (s, o) => new Date(`${s}T12:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", ...o });
      return `${g(t.baslangic, { day: "numeric" })}–${g(t.bitis, { day: "numeric", month: "long", year: "numeric" })}`;
    };

    // Şerit: tarihleri veriden güncelle
    $$("[data-org-pill]").forEach((a) => {
      const o = orgs[a.dataset.orgPill];
      const yer = $("[data-org-tarih]", a);
      if (o?.durum === "aktif" && o.tarih) yer.textContent = tarihMetni(o.tarih);
      else if (o?.durum === "yakinda") yer.textContent = L("Yakında", "Coming soon");
    });
    if (!sayfa) return;

    const id = document.body.dataset.org, o = orgs[id] || {}, a = ayar[id] || {};
    const tur = EN ? a.turEn || o.tur : a.tur || o.tur;
    const instagram = a.instagram || o.instagram || "";
    const ikon = {
      site: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',
      ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>'
    };
    const butonlar = (koyu) => `
      <div class="org-actions">
        ${o.site ? `<a class="btn ${koyu ? "btn-light" : "btn-primary"}" href="${esc(o.site)}" target="_blank" rel="noopener">${ikon.site}${L("Organizasyon sitesine git", "Visit the event website")}</a>` : ""}
        ${instagram ? `<a class="btn ${koyu ? "btn-ghost-light" : "btn-outline"}" href="${esc(instagram)}" target="_blank" rel="noopener">${ikon.ig}Instagram</a>` : ""}
        ${o.kayit ? `<a class="btn ${koyu ? "btn-ghost-light" : "btn-outline"}" href="${esc(o.kayit)}" target="_blank" rel="noopener">${L("Kayıt ol", "Register")}</a>` : ""}
      </div>`;

    if (o.durum !== "aktif") {
      document.title = `${tur} · ${L("Rotaract Bölge 2430", "Rotaract District 2430")}`;
      sayfa.innerHTML = `
        <section class="org-hero org-hero-bos"><div class="container">
          <p class="org-tur">${esc(tur)}</p>
          <h1>${L(`${esc(tur)} henüz duyurulmadı`, `The ${esc(tur.toLowerCase())} has not been announced yet`)}</h1>
          <p class="org-slogan">${L("Tarih, yer ve web sitesi açıklandığında bu sayfa kendiliğinden güncellenecek. O zamana kadar bölgenin yaklaşan organizasyonlarına göz atın.",
            "This page will update automatically once the date, venue and website are announced. Meanwhile, see what's coming up in the district.")}</p>
          <div class="org-actions"><a class="btn btn-light" href="index.html#yakinda">${L("Yaklaşan organizasyonlar", "Upcoming events")}</a>
          ${instagram ? `<a class="btn btn-ghost-light" href="${esc(instagram)}" target="_blank" rel="noopener">${ikon.ig}Instagram</a>` : ""}</div>
        </div></section>`;
      return;
    }

    document.title = `${o.ad} · ${L("Rotaract Bölge 2430", "Rotaract District 2430")}`;
    const p = (dizi) => (dizi || []).map((s) => `<p>${esc(s)}</p>`).join("");
    const kalan = o.tarih ? Math.ceil((Date.parse(`${o.tarih.baslangic}T00:00:00+03:00`) - Date.now()) / 864e5) : null;
    const harita = o.yer ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.yer)}` : "";
    const kaynak = new URL(o.site).hostname;
    sayfa.innerHTML = `
      <section class="org-hero"${o.gorsel ? ` style="--org-img:url('${esc(o.gorsel)}')"` : ""}>
        <div class="container org-hero-inner">
          <p class="org-tur">${esc(tur)}${o.altBaslik ? ` · ${esc(o.altBaslik)}` : ""}</p>
          <h1>${esc(o.ad)}</h1>
          ${o.slogan ? `<p class="org-slogan">${esc(o.slogan)}</p>` : ""}
          <p class="org-when">
            ${o.tarih ? `<span><strong>${esc(tarihMetni(o.tarih))}</strong>${kalan > 0 ? ` · ${L(`${kalan} gün kaldı`, `${kalan} days to go`)}` : ""}</span>` : ""}
            ${o.yer ? `<span>${esc(o.yer)}</span>` : ""}
          </p>
          ${butonlar(true)}
        </div>
      </section>

      <div class="container org-grid">
        ${o.amac?.aciklama?.length ? `<section class="org-card org-card-wide">
          <h2>${L("Ne amaçla yapılıyor?", "What is it for?")}</h2>
          ${o.amac.alt ? `<p class="org-lead">${esc(o.amac.alt)}</p>` : ""}
          ${p(o.amac.aciklama)}
          ${o.odaklar?.length ? `<ul class="org-tags">${o.odaklar.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        </section>` : ""}

        ${o.tema?.alt || o.slogan ? `<section class="org-card">
          <h2>${L("Tema", "Theme")}</h2>
          <p class="org-lead">${esc(o.ad)}${o.slogan ? `: ${esc(o.slogan)}` : ""}</p>
          ${o.tema?.alt ? `<p><em>${esc(o.tema.alt)}</em></p>` : ""}
          ${p(o.tema?.aciklama)}
          ${o.tema?.degerler?.length ? `<ul class="org-tags">${o.tema.degerler.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        </section>` : ""}

        ${o.duzenleyen || o.kisiler?.length ? `<section class="org-card">
          <h2>${L("Kim düzenliyor?", "Who organises it?")}</h2>
          ${o.duzenleyen ? `<p class="org-lead">${esc(o.duzenleyen)}</p>` : ""}
          ${o.hakkinda?.[0] ? `<p>${esc(o.hakkinda[0])}</p>` : ""}
          ${o.kisiler?.length ? `<ul class="org-people">${o.kisiler.map((k) => `<li><strong>${esc(k.ad)}</strong><span>${esc(k.gorev)}</span></li>`).join("")}</ul>` : ""}
          ${o.ekipSayisi ? `<p class="org-note">${L(`Organizasyon ekibinde ${o.ekipSayisi} kişi var.`, `The organising team has ${o.ekipSayisi} members.`)}</p>` : ""}
        </section>` : ""}

        <section class="org-card">
          <h2>${L("Tarih ve yer", "Date and venue")}</h2>
          <dl class="org-facts">
            ${o.tarih ? `<div><dt>${L("Tarih", "Date")}</dt><dd>${esc(tarihMetni(o.tarih))}</dd></div>` : ""}
            ${o.yer ? `<div><dt>${L("Yer", "Venue")}</dt><dd>${esc(o.yer)}</dd></div>` : ""}
            ${o.eposta ? `<div><dt>${L("E-posta", "Email")}</dt><dd><a href="mailto:${esc(o.eposta)}">${esc(o.eposta)}</a></dd></div>` : ""}
          </dl>
          ${harita ? `<a class="btn btn-outline btn-sm" href="${esc(harita)}" target="_blank" rel="noopener">${L("Haritada aç", "Open in Maps")}</a>` : ""}
        </section>
      </div>

      <section class="org-cta"><div class="container org-cta-inner">
        <h2>${esc(o.ad)}</h2>
        ${butonlar(true)}
      </div></section>

      <p class="container org-source">${L(
        `Bu sayfadaki bilgiler ${esc(kaynak)} adresinden otomatik alınır ve günde 4 kez kontrol edilir.${EN ? "" : ""}`,
        `Details on this page are taken automatically from ${esc(kaynak)} (in Turkish) and checked 4 times a day.`)}
        ${veri.guncelleme ? L(" Son değişiklik: ", " Last change: ") + esc(new Date(veri.guncelleme).toLocaleString(LOC, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" })) + "." : ""}</p>`;
  })();

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
