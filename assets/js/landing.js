/* ==========================================================================
   stay add. — the STEM home (index.html at the root only)
   1. Facts: counted from the catalog.
   2. Subject cards: one per subject in the catalog, with a small real graph
      from that subject (ART) — a new subject appears here by itself.
   3. Fig. 0: particles in a box. Temperature sets their speed (physics:
      average kinetic energy ∝ T); the hard hits flash amber (chemistry: only
      collisions with enough energy react). Motion stays inside the frame.
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const $ = (s, r = document) => r.querySelector(s);
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const live = (s) => s.topics.flatMap((t) => t.lessons.filter((l) => l.status === "live").map((l) => ({ ...l, t })));

  /* ---------- 1. Facts ---------- */
  const facts = { subjects: SA.subjects().length, lessons: SA.subjects().reduce((n, s) => n + live(s).length, 0), topics: SA.subjects().reduce((n, s) => n + s.topics.length, 0) };
  document.querySelectorAll("[data-fact]").forEach((el) => (el.textContent = facts[el.dataset.fact]));

  /* ---------- 2. Subject cards ---------- */
  // a small graph from each subject, drawn with the shared figure classes (they follow the theme)
  const ART = {
    chemistry: `
      <svg class="fig st-art" viewBox="0 0 300 140" role="img" aria-label="Product against time at two temperatures: the hotter reaction is faster">
        <path class="gl" d="M36 30H290M36 60H290M36 90H290"/>
        <path class="plot-2" d="M36 118C90 82 140 52 200 38S270 28 290 27"/>
        <path class="plot" style="--tc:var(--c-energy)" d="M36 118C62 64 96 40 140 31S240 26 290 25"/>
        <path class="ax" d="M36 10V118H294"/>
        <text x="36" y="7">product</text><text x="294" y="134" text-anchor="end">time →</text>
        <text x="112" y="28" class="lbl-ink">50 °C</text><text x="214" y="56" class="lbl-ink">25 °C</text>
        <text x="236" y="100" class="ser" text-anchor="middle">steeper = faster</text>
      </svg>`,
    physics: `
      <svg class="fig st-art" viewBox="0 0 300 140" role="img" aria-label="A ball launched horizontally from a cliff follows a curved path">
        <defs><pattern id="stHatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--line-2)"/></pattern></defs>
        <rect x="36" y="30" width="34" height="88" fill="url(#stHatch)"/>
        <path class="ax" d="M36 30H70V118"/><path class="ax" d="M36 8V118H294"/>
        <path class="plot" style="--tc:var(--c-mech)" d="M70 30Q170 32 250 118"/>
        <circle cx="70" cy="30" r="3.5" class="pt" style="--tc:var(--c-mech)"/><circle cx="125" cy="38" r="3.5" class="pt" style="--tc:var(--c-mech)"/><circle cx="174" cy="58" r="3.5" class="pt" style="--tc:var(--c-mech)"/><circle cx="216" cy="88" r="3.5" class="pt" style="--tc:var(--c-mech)"/>
        <path d="M174 58H204" style="stroke:var(--c-vx);stroke-width:1.75"/><path d="M174 58V88" style="stroke:var(--c-vy);stroke-width:1.75"/>
        <text x="208" y="61" style="fill:var(--c-vx)">vₓ</text><text x="178" y="96" style="fill:var(--c-vy)">v<tspan baseline-shift="sub" font-size="8">y</tspan></text>
        <text x="36" y="6">h</text><text x="294" y="134" text-anchor="end">x →</text>
      </svg>`,
    biology: `
      <svg class="fig st-art" viewBox="0 0 300 140" role="img" aria-label="Enzyme activity against temperature: it rises to an optimum at 37 °C, then falls as the enzyme denatures">
        <rect x="206" y="14" width="88" height="104" style="fill:color-mix(in srgb, var(--c-denat) 8%, transparent)"/>
        <path class="gl" d="M36 30H294M36 74H294"/>
        <path class="plot" style="--tc:var(--c-bio)" d="M36 106C80 98 130 78 166 44C176 34 188 26 196 30C210 38 222 80 240 112L294 118"/>
        <path class="guide" d="M194 20V118"/>
        <path class="ax" d="M36 10V118H294"/>
        <text x="36" y="7">rate</text><text x="294" y="134" text-anchor="end">temperature →</text>
        <text x="188" y="20" text-anchor="end" class="lbl-ink">37 °C</text>
        <text x="250" y="30" text-anchor="middle" style="fill:var(--c-denat)">denatured</text>
        <text x="96" y="62" class="ser">more collisions</text>
      </svg>`
  };
  const cards = $("[data-subjects]");
  if (cards) {
    const progress = SA.progress.all();
    cards.innerHTML = SA.subjects().map((s, i) => {
      const lessons = live(s), opened = lessons.filter((l) => progress[l.id]?.visited).length;
      return `
        <article class="subject">
          <div class="subject-top"><span class="num">${String(i + 1).padStart(2, "0")}</span><span class="eyebrow">${s.syllabus}</span><span class="status">${lessons.length} live</span></div>
          <h3 class="display"><a href="${SA.url(s.home)}">${s.name}</a></h3>
          <p class="subject-hint">${s.hint}. ${s.topics.length} syllabus topics.</p>
          ${ART[s.id] ? `<div class="subject-art">${ART[s.id]}</div>` : ""}
          <ul class="subject-lessons">${lessons.map((l) => `<li><a href="${SA.url(l.href)}"><span class="num">${l.t.num}</span><span><b>${l.title}</b><small>${l.t.title}</small></span><i aria-hidden="true">${progress[l.id]?.visited ? "opened" : "→"}</i></a></li>`).join("")}</ul>
          <div class="subject-foot">
            <div class="subject-prog"><div class="steps">${lessons.map((l) => `<i class="${progress[l.id]?.visited ? "done" : ""}"></i>`).join("")}</div><span class="num">${opened} / ${lessons.length} opened</span></div>
            <a class="btn btn-primary btn-sm" href="${SA.url(s.home)}">Open ${s.name} <span class="arr" aria-hidden="true">→</span></a>
          </div>
        </article>`;
    }).join("");
  }

  /* ---------- 3. Fig. 0 — particles in a box ---------- */
  const fig = $("[data-kinetic]");
  if (!fig) return;
  const canvas = $("[data-k-canvas]", fig), temp = $("[data-k-temp]", fig), status = $("[data-k-status]", fig);
  const N = 34, R = 4.5, V300 = 70, HARD = 1.7 * V300;
  let W = 0, H = 0, ctx, ps = [], rings = [], hits = [], T = 300, auto = !still, visible = false, last = performance.now(), t0 = last, col = {};
  const readColors = () => { const v = (n) => SA.cssVar(n); col = { ink: v("--ink-2"), line: v("--line-2"), ink3: v("--ink-3"), energy: v("--c-energy"), temp: v("--c-temp") }; };

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx = canvas.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const box = boxOf();
    if (!ps.length) ps = Array.from({ length: N }, (_, i) => {
      const a = (i * 2.399) % (Math.PI * 2);
      return { x: box.x + 12 + ((i * 37) % 100) / 100 * (box.w - 24), y: box.y + 12 + ((i * 61) % 100) / 100 * (box.h - 24), vx: Math.cos(a), vy: Math.sin(a) };
    });
    draw(0);
  }
  const boxOf = () => ({ x: 18, y: 18, w: W - 92, h: H - 36 });

  function step(dt) {
    const box = boxOf(), speed = V300 * Math.sqrt(T / 300);
    for (const p of ps) {
      const m = Math.hypot(p.vx, p.vy) || 1;                 // keep each particle at the speed T sets
      p.vx = (p.vx / m) * speed; p.vy = (p.vy / m) * speed;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < box.x + R) { p.x = box.x + R; p.vx = Math.abs(p.vx); }
      if (p.x > box.x + box.w - R) { p.x = box.x + box.w - R; p.vx = -Math.abs(p.vx); }
      if (p.y < box.y + R) { p.y = box.y + R; p.vy = Math.abs(p.vy); }
      if (p.y > box.y + box.h - R) { p.y = box.y + box.h - R; p.vy = -Math.abs(p.vy); }
    }
    const now = performance.now() / 1000;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = ps[i], b = ps[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
      if (d2 > 4 * R * R || d2 === 0) continue;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vn >= 0) continue;
      a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny;
      if (-vn > HARD) { rings.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, age: 0 }); hits.push(now); }
    }
    rings = rings.filter((r) => (r.age += dt) < 0.5);
    hits = hits.filter((h) => now - h < 2);
  }

  function draw() {
    if (!ctx) return;
    const box = boxOf();
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
    ctx.fillStyle = col.ink;
    for (const p of ps) { ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill(); }
    for (const r of rings) {
      ctx.globalAlpha = 1 - r.age / 0.5; ctx.strokeStyle = col.energy; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(r.x, r.y, 6 + (r.age / 0.5) * 14, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // thermometer, 200–600 K
    const tx = W - 46, top = box.y + 10, bot = box.y + box.h - 10, frac = (T - 200) / 400;
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(tx, top); ctx.lineTo(tx, bot); ctx.stroke();
    ctx.strokeStyle = col.temp; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(tx, bot); ctx.lineTo(tx, bot - frac * (bot - top)); ctx.stroke();
    ctx.lineWidth = 1; ctx.font = "11px 'IBM Plex Mono', ui-monospace, monospace"; ctx.fillStyle = col.ink3; ctx.textBaseline = "middle";
    for (let k = 200; k <= 600; k += 100) {
      const y = bot - ((k - 200) / 400) * (bot - top);
      ctx.strokeStyle = col.ink3; ctx.beginPath(); ctx.moveTo(tx + 4, y); ctx.lineTo(tx + 8, y); ctx.stroke();
      ctx.fillText(k, tx + 12, y);
    }
  }

  function readout() {
    temp.value = T; temp.style.setProperty("--pct", `${((T - 200) / 400) * 100}%`);
    $("[data-k-tout]", fig).textContent = Math.round(T);
    $("[data-k-t]", fig).textContent = Math.round(T);
    $("[data-k-v]", fig).textContent = Math.sqrt(T / 300).toFixed(2);
    $("[data-k-hits]", fig).textContent = (hits.length / 2).toFixed(1);
  }

  let uiClock = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (visible) {
      if (auto) T = 400 - 150 * Math.cos(((now - t0) / 1000) * (Math.PI * 2) / 16);
      step(dt); draw();
      if ((uiClock += dt) > 0.15) { uiClock = 0; readout(); }
    }
    requestAnimationFrame(frame);
  }

  temp.addEventListener("input", () => { auto = false; T = +temp.value; status.textContent = "Manual"; status.classList.add("paused"); readout(); });
  document.addEventListener("sa:themechange", () => { readColors(); draw(); });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); }).observe(fig);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas); else addEventListener("resize", resize);
  readColors(); resize(); readout();
  if (still) { status.textContent = "Still"; status.classList.add("paused"); step(0.016); draw(); }
  else requestAnimationFrame(frame);
})();
