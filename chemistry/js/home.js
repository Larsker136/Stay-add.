/* ==========================================================================
   stay add. chemistry — home page
   1. Hero instrument: energy distribution of particles, with Eₐ and a catalyst.
   2. Powers of ten: a sticky section; scrolling zooms the framed figure from a
      beaker of acid down to one collision. Motion stays inside the figure.
   3. Syllabus map: the 12 topics and how they build on each other, filled in
      by this browser's progress (SA.progress).
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;
  const MONO = "500 11px 'IBM Plex Mono', ui-monospace, monospace";

  function fitCanvas(c, w, h) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  function readColors() {
    const v = (n) => SA.cssVar(n);
    return { a: v("--c-a"), b: v("--c-b"), energy: v("--c-energy"), ink: v("--ink"), ink3: v("--ink-3"), ink4: v("--ink-4"), line: v("--line-2"), surface: v("--surface") };
  }

  /* =======================================================================
     1. Hero instrument
     ======================================================================= */
  function initHero() {
    const fig = $("[data-hero]");
    if (!fig) return;
    const svg = $("[data-hero-svg]", fig), temp = $("[data-hero-temp]", fig), cat = $("[data-hero-cat]", fig), status = $("[data-hero-status]", fig);
    const X0 = 60, X1 = 616, Y0 = 286, Y1 = 22, EMAX = 8, EA = 4.2, EA_CAT = 2.3;
    const kT = (c) => (c + 273.15) / 298.15;
    const f = (E, k) => Math.sqrt(E) * Math.exp(-E / k) / Math.pow(k, 1.5);
    const YMAX = f(kT(0) / 2, kT(0)) * 1.1;
    const sx = (E) => X0 + (E / EMAX) * (X1 - X0), sy = (v) => Y0 - (v / YMAX) * (Y0 - Y1);
    const curve = (k, from = 0, to = EMAX) => {
      let d = "";
      for (let i = 0; i <= 140; i++) { const E = from + ((to - from) * i) / 140; d += `${i ? "L" : "M"}${sx(E).toFixed(1)} ${sy(f(E, k)).toFixed(1)}`; }
      return d;
    };
    const frac = (Ea, k) => { let all = 0, up = 0; for (let i = 0; i < 600; i++) { const E = ((i + 0.5) / 600) * 40, v = f(E, k); all += v; if (E >= Ea) up += v; } return up / all; };
    const base = frac(EA, kT(25));

    let grid = "", ticks = "";
    for (let i = 1; i <= 4; i++) grid += `M${X0} ${(Y0 - (i * (Y0 - Y1)) / 4).toFixed(1)}H${X1}`;
    for (let E = 0; E <= EMAX; E++) ticks += `M${sx(E).toFixed(1)} ${Y0}v5`;
    svg.innerHTML = `
      <path class="gl" d="${grid}"/>
      <path class="mb-shade" data-h="shade"/>
      <path class="mb-base" d="${curve(kT(25))}"/>
      <path class="mb" data-h="curve"/>
      <line class="ea" data-h="ea" x1="${sx(EA)}" x2="${sx(EA)}" y1="${Y1 + 6}" y2="${Y0}"/>
      <text class="t-ea" data-h="eat" x="${sx(EA) + 7}" y="${Y1 + 16}">Eₐ</text>
      <line class="ea-cat" data-h="eac" x1="${sx(EA_CAT)}" x2="${sx(EA_CAT)}" y1="${Y1 + 6}" y2="${Y0}"/>
      <text class="t-cat" data-h="eact" x="${sx(EA_CAT) + 7}" y="${Y1 + 16}">Eₐ with catalyst</text>
      <path class="ax" d="M${X0} ${Y1 - 8}V${Y0}H${X1 + 6}"/>
      <path class="tk" d="${ticks}"/>
      <text x="${X0}" y="${Y1 - 12}">number of particles</text>
      <text x="${X1 + 6}" y="${Y0 + 26}" text-anchor="end">energy of a particle →</text>
      <text x="${sx(1.1)}" y="${sy(f(0.6, kT(25))) - 12}" class="lbl-ink">25 °C</text>
      <text x="${sx(5.6)}" y="${sy(0.05) - 40}" class="ser" data-h="note">shaded: can react</text>`;
    const h = Object.fromEntries($$("[data-h]", svg).map((el) => [el.dataset.h, el]));
    const R = Object.fromEntries($$("[data-hero-r]", fig).map((el) => [el.dataset.heroR, el]));

    let auto = !still, catalyst = false, t0 = performance.now(), visible = true;
    function update(c) {
      const k = kT(c), ea = catalyst ? EA_CAT : EA, fr = frac(ea, k);
      h.curve.setAttribute("d", curve(k));
      h.shade.setAttribute("d", `${curve(k, ea)}L${sx(EMAX)} ${Y0}L${sx(ea)} ${Y0}Z`);
      h.ea.classList.toggle("is-off", catalyst); h.eat.classList.toggle("is-off", catalyst);
      h.eac.style.display = h.eact.style.display = catalyst ? "" : "none";
      temp.value = c;
      temp.style.setProperty("--pct", `${(c / 200) * 100}%`);
      $("[data-hero-temp-out]", fig).textContent = Math.round(c);
      R.t.textContent = Math.round(c + 273);
      R.frac.textContent = (fr * 100).toFixed(1);
      R.rate.textContent = `×${(Math.sqrt(k / kT(25)) * fr / base).toFixed(2)}`;
      R.path.textContent = catalyst ? "catalysed" : "uncatalysed";
      $("[data-hero-eq]", fig).textContent = `×${(Math.sqrt(k / kT(25))).toFixed(2)} collisions · ×${(fr / base).toFixed(2)} share above Eₐ`;
    }
    const manual = () => { auto = false; status.textContent = "Manual"; status.classList.add("paused"); };
    temp.addEventListener("input", () => { manual(); update(+temp.value); });
    cat.addEventListener("click", () => { catalyst = !catalyst; cat.setAttribute("aria-checked", catalyst); update(+temp.value); });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(fig);
    (function sweep(now) {
      if (auto && visible) update(25 + 87.5 * (1 - Math.cos(((now - t0) / 1000) * TAU / 14)));
      if (auto) requestAnimationFrame(sweep);
    })(t0);
    if (!auto) { status.textContent = "Manual"; status.classList.add("paused"); }
    update(25);
  }

  /* =======================================================================
     2. Powers of ten
     ======================================================================= */
  function initZoom() {
    const sec = $("[data-zoom]");
    if (!sec) return;
    const sticky = $(".zoom-sticky", sec), body = $("[data-zoom-body]", sec);
    const beaker = $("[data-zoom-beaker]", sec), beakerSvg = $("svg", beaker);
    const cSol = $('[data-zoom-layer="solution"]', sec), cPar = $('[data-zoom-layer="particles"]', sec), cCol = $('[data-zoom-layer="collision"]', sec);
    const meter = $("[data-zoom-meter]", sec), meterFill = $("[data-zoom-meter-fill]", sec), meterText = $("[data-zoom-meter-text]", sec);
    const fovEl = $("[data-zoom-fov]", sec), bar = $("[data-zoom-bar]", sec);
    const cards = $$("[data-zoom-card]", sec), index = $$(".zoom-index button", sec);
    const STEPS = [0, 0.2, 0.4, 0.62, 0.82];
    const FOCUS = { x: 236, y: 404 }, HOME = { x: 200, y: 250 }, FRAME_H = 560;   // SVG units

    let W = 0, H = 0, diag = 0, ctxSol, ctxPar, ctxCol, col = readColors();
    let target = 0, p = 0, step = -1, active = false;

    // solution: a dense field of solvent particles with a few acid particles
    const sol = Array.from({ length: 900 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, r: 0.8 + Math.random() * 1.1, acid: Math.random() < 0.08, ph: Math.random() * TAU }));

    // particles: acid particles striking a metal surface
    let acid = [], lattice = [], sparks = [], surfY = 0;
    function seedParticles() {
      surfY = H * 0.72;
      lattice = [];
      for (let row = 0; row < 3; row++)
        for (let x = (row % 2) * 13 + 13; x < W + 20; x += 26)
          lattice.push({ x, y: surfY + 13 + row * 23, r: 11, ph: Math.random() * TAU, gone: 0 });
      acid = Array.from({ length: Math.max(10, Math.round(W / 34)) }, () => newAcid(Math.random() * surfY * 0.9));
    }
    function newAcid(y = 14) {
      const a = Math.random() * TAU, s = 120 + Math.random() * 140;
      return { x: 14 + Math.random() * (W - 28), y: Math.max(10, y), vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 7.5 };
    }
    function stepParticles(dt) {
      for (const a of acid) {
        a.x += a.vx * dt; a.y += a.vy * dt;
        if (a.x < a.r) { a.x = a.r; a.vx = Math.abs(a.vx); }
        if (a.x > W - a.r) { a.x = W - a.r; a.vx = -Math.abs(a.vx); }
        if (a.y < a.r) { a.y = a.r; a.vy = Math.abs(a.vy); }
        if (a.y > surfY - a.r && a.vy > 0) {
          const ok = a.vy > 200 && Math.random() < 0.6;          // only hard hits react
          sparks.push({ x: a.x, y: surfY, age: 0, ok });
          if (ok) {
            const near = lattice.filter((l) => !l.gone && l.y < surfY + 16).sort((m, n) => Math.abs(m.x - a.x) - Math.abs(n.x - a.x))[0];
            if (near) near.gone = 0.001;
            Object.assign(a, newAcid(12));
            if (p > 0.38 && p < 0.6) SA.sound?.play("hit", 0.6);
          } else { a.y = surfY - a.r; a.vy = -Math.abs(a.vy); }
        }
      }
      for (let i = 0; i < acid.length; i++) for (let j = i + 1; j < acid.length; j++) {
        const a = acid[i], b = acid[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, rs = a.r + b.r;
        if (d2 >= rs * rs || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vn >= 0) continue;
        a.vx += vn * nx; a.vy += vn * ny; b.vx -= vn * nx; b.vy -= vn * ny;
      }
      for (const l of lattice) if (l.gone) { l.gone += dt; if (l.gone > 2.4) l.gone = 0; }
      sparks = sparks.filter((s) => (s.age += dt) < 0.6);
    }

    const disc = (ctx, x, y, r, c, a = 1) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; };

    // the scripted close-up: a failed bounce, then a successful collision
    function drawCollision(t) {
      const ctx = ctxCol, cx = W / 2, cy = H * 0.5, R = Math.min(W, H) * 0.11, D = Math.min(W * 0.34, 300);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke(); ctx.setLineDash([]);
      let energy = 0, label = "", over = false;
      if (t < 0.48) {
        const u = t / 0.48, meet = 0.5;
        const gap = u < meet ? lerp(D, 0, easeIO(u / meet)) : lerp(0, D * 0.9, ease((u - meet) / (1 - meet)));
        disc(ctx, cx - R - gap, cy, R, col.a); disc(ctx, cx + R + gap, cy, R, col.b);
        if (u > meet && u < meet + 0.2) {
          const k = (u - meet) / 0.2;
          ctx.globalAlpha = 1 - k; ctx.strokeStyle = col.ink4; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, R * 0.3 + k * R * 1.4, 0, TAU); ctx.stroke(); ctx.globalAlpha = 1;
        }
        energy = 0.42 * ease(clamp(u / meet));
        label = u > meet ? "below Eₐ — they bounce apart" : "approaching";
      } else {
        const u = clamp((t - 0.52) / 0.48), meet = 0.38;
        if (u < meet) {
          const gap = lerp(D * 1.1, 0, Math.pow(u / meet, 1.6));
          for (let k = 3; k >= 1; k--) { const g = gap + k * R * 0.4; disc(ctx, cx - R - g, cy, R, col.a, 0.12); disc(ctx, cx + R + g, cy, R, col.b, 0.12); }
          disc(ctx, cx - R - gap, cy, R, col.a); disc(ctx, cx + R + gap, cy, R, col.b);
          energy = 0.92 * clamp(u / meet);
          label = "approaching fast";
        } else {
          const k = (u - meet) / (1 - meet);
          if (k < 0.5) {
            const b = k / 0.5;
            ctx.globalAlpha = 1 - b; ctx.strokeStyle = col.energy; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(cx, cy, R * (0.9 + ease(b) * 1.6), 0, TAU); ctx.stroke();
            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * TAU, r1 = R * (1.3 + b * 1.2), r2 = r1 + R * 0.3;
              ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); ctx.stroke();
            }
            ctx.globalAlpha = 1;
          }
          const ang = k * 1.2, off = R * 0.62;
          disc(ctx, cx - Math.cos(ang) * off, cy - Math.sin(ang) * off, R * 0.9, col.a);
          disc(ctx, cx + Math.cos(ang) * off, cy + Math.sin(ang) * off, R * 0.9, col.b);
          energy = 0.92; over = true;
          label = "≥ Eₐ — bonds break, product forms";
        }
      }
      meterFill.style.width = `${energy * 100}%`;
      meter.classList.toggle("is-over", over || energy >= 0.7);
      meterText.textContent = label;
    }

    function resize() {
      const r = body.getBoundingClientRect();
      W = r.width; H = r.height; diag = Math.hypot(W, H);
      if (!W) return;
      ctxSol = fitCanvas(cSol, W, H); ctxPar = fitCanvas(cPar, W, H); ctxCol = fitCanvas(cCol, W, H);
      seedParticles();
      render(0);
    }
    function readScroll() {
      const r = sec.getBoundingClientRect(), top = parseFloat(getComputedStyle(sticky).top) || 0;
      target = clamp((top - r.top) / (r.height - sticky.offsetHeight));
    }
    function setStep(i) {
      if (i === step) return;
      step = i;
      cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
      index.forEach((b, k) => b.classList.toggle("is-on", k === i));
    }
    function fov(m) {
      const n = (v) => +v.toPrecision(2);
      if (m >= 0.01) return `${n(m * 100)} cm`;
      if (m >= 1e-3) return `${n(m * 1e3)} mm`;
      if (m >= 1e-6) return `${n(m * 1e6)} µm`;
      return `${n(m * 1e9)} nm`;
    }

    function render(dt) {
      // beaker: zoom the SVG viewBox towards the ribbon (vector-sharp, viewport-sized)
      const bz = ease(clamp(p / 0.27));
      const bo = 1 - clamp((p - 0.15) / 0.1);
      beaker.style.opacity = bo;
      beaker.style.visibility = bo > 0 ? "visible" : "hidden";
      if (bo > 0 && W) {
        const vh = FRAME_H / (1 + Math.pow(bz, 2.4) * 46), vw = vh * (W / H);
        const cx = lerp(HOME.x, FOCUS.x, bz), cy = lerp(HOME.y, FOCUS.y, bz);
        beakerSvg.setAttribute("viewBox", `${(cx - vw / 2).toFixed(2)} ${(cy - vh / 2).toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}`);
      }

      // solution field, revealed as a widening circle
      const sr = ease(clamp((p - 0.13) / 0.14)) * diag * 0.6;
      const so = 1 - clamp((p - 0.36) / 0.07);
      cSol.style.opacity = sr > 0 ? so : 0;
      if (sr > 0 && so > 0) {
        const z = 1 + clamp((p - 0.13) / 0.3) * 3.2, base = diag * 0.5, now = performance.now() / 1000, ctx = ctxSol;
        ctx.clearRect(0, 0, W, H);
        ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, sr, 0, TAU); ctx.clip();
        for (const d of sol) {
          const x = W / 2 + (d.x + Math.sin(now * 1.7 + d.ph) * 0.004) * base * z, y = H / 2 + (d.y + Math.cos(now * 1.3 + d.ph) * 0.004) * base * z;
          if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
          disc(ctx, x, y, d.r * (d.acid ? 2.2 : 1) * Math.pow(z, 0.8), d.acid ? col.a : col.ink4, d.acid ? 1 : 0.6);
        }
        ctx.restore();
        ctx.strokeStyle = col.line; ctx.lineWidth = 1;
        if (sr < diag * 0.5) { ctx.beginPath(); ctx.arc(W / 2, H / 2, sr, 0, TAU); ctx.stroke(); }
      }

      // particles striking the metal
      const pr = ease(clamp((p - 0.33) / 0.12)) * diag * 0.6;
      const po = 1 - clamp((p - 0.58) / 0.05);
      cPar.style.opacity = pr > 0 ? po : 0;
      if (pr > 0 && po > 0) {
        if (dt) stepParticles(dt);
        const ctx = ctxPar, now = performance.now() / 1000;
        ctx.clearRect(0, 0, W, H);
        ctx.save(); ctx.beginPath(); ctx.arc(W / 2, H / 2, pr, 0, TAU); ctx.clip();
        ctx.fillStyle = col.surface; ctx.fillRect(0, 0, W, H);
        for (const l of lattice) {
          if (l.gone) disc(ctx, l.x, l.y, l.r, l.gone < 0.45 ? col.energy : col.b, l.gone < 0.45 ? 1 : Math.max(0.08, (l.gone / 2.4) ** 2));
          else disc(ctx, l.x + Math.sin(now * 6 + l.ph) * 1, l.y, l.r, col.b);
        }
        for (const a of acid) disc(ctx, a.x, a.y, a.r, col.a);
        for (const s of sparks) {
          const q = s.age / 0.6;
          ctx.globalAlpha = 1 - q; ctx.strokeStyle = s.ok ? col.energy : col.ink4; ctx.lineWidth = s.ok ? 1.5 : 1;
          ctx.beginPath(); ctx.arc(s.x, s.y, (s.ok ? 8 : 3) + ease(q) * (s.ok ? 22 : 10), 0, TAU); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.font = MONO; ctx.fillStyle = col.ink3;
        ctx.fillText("metal surface (Mg)", 12, surfY - 10);
        ctx.restore();
        if (pr < diag * 0.5) { ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(W / 2, H / 2, pr, 0, TAU); ctx.stroke(); }
      }

      // the single collision
      const co = clamp((p - 0.58) / 0.05);
      cCol.style.opacity = co;
      meter.classList.toggle("is-idle", p < 0.6);
      if (co > 0) drawCollision(clamp((p - 0.62) / 0.34));
      else { meterFill.style.width = "0%"; meterText.textContent = "—"; meter.classList.remove("is-over"); }

      setStep(STEPS.reduce((acc, s, k) => (p >= s - 0.001 ? k : acc), 0));
      fovEl.textContent = fov(0.1 * Math.pow(10, -9 * p));
      bar.style.transform = `scaleX(${p})`;
    }

    let lastT = performance.now();
    function frame(now) {
      const dt = Math.min(0.04, (now - lastT) / 1000);
      lastT = now;
      if (active) {
        readScroll();
        p = still ? target : p + (target - p) * Math.min(1, dt * 7);
        if (Math.abs(target - p) < 0.0004) p = target;
        render(dt);
      }
      requestAnimationFrame(frame);
    }

    index.forEach((b, i) => b.addEventListener("click", () => {
      const top = sec.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(sticky).top) || 0);
      scrollTo({ top: top + (STEPS[i] + 0.04) * (sec.offsetHeight - sticky.offsetHeight), behavior: still ? "auto" : "smooth" });
    }));
    document.addEventListener("sa:themechange", () => { col = readColors(); render(0); });
    new IntersectionObserver(([en]) => { active = en.isIntersecting; lastT = performance.now(); }, { rootMargin: "200px 0px" }).observe(sec);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(body); else addEventListener("resize", resize);
    resize(); readScroll(); p = target; render(0);
    requestAnimationFrame(frame);
  }

  /* =======================================================================
     3. Syllabus map + the live topic's lesson list
     ======================================================================= */
  function initMap() {
    const el = $("[data-universe]");
    if (!el || !SA.catalog) return;
    const subject = SA.subject("chemistry");
    const progress = SA.progress ? SA.progress.all() : {};

    // positions on a 1000 × 600 plane, and which topics build on which
    const POS = { 1: [110, 150], 2: [250, 300], 3: [190, 480], 4: [420, 440], 5: [500, 220], 6: [640, 350], 7: [370, 110], 8: [770, 130], 9: [860, 300], 10: [740, 500], 11: [560, 540], 12: [880, 450] };
    const LINKS = [[1, 2], [2, 3], [2, 7], [3, 4], [3, 5], [5, 6], [3, 6], [7, 8], [2, 8], [8, 9], [4, 9], [9, 10], [6, 11], [11, 10], [3, 12], [7, 6]];

    const nodes = subject.topics.map((t) => {
      const live = t.lessons.filter((l) => l.status === "live");
      const done = live.filter((l) => progress[l.id]?.visited);
      const mastered = live.filter((l) => progress[l.id]?.quiz);
      const state = !live.length ? "soon" : mastered.length === live.length ? "mastered" : done.length ? "explored" : "ready";
      return { ...t, live, state, x: POS[t.num][0], y: POS[t.num][1] };
    });
    const byNum = Object.fromEntries(nodes.map((n) => [n.num, n]));
    const lit = (n) => n.state === "explored" || n.state === "mastered";

    let grid = "";
    for (let x = 50; x < 1000; x += 50) grid += `M${x} 0V600`;
    for (let y = 50; y < 600; y += 50) grid += `M0 ${y}H1000`;
    el.innerHTML = `
      <svg class="fig sky-map" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of IGCSE Chemistry topics and how they connect">
        <path class="gl" d="${grid}"/>
        ${LINKS.map(([a, b]) => {
          const A = byNum[a], B = byNum[b], cls = lit(A) && lit(B) ? "lit" : lit(A) || lit(B) ? "path" : "";
          return `<line class="sky-link ${cls}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`;
        }).join("")}
        ${nodes.map((n) => {
          const href = n.live[0] ? SA.url(n.live[0].href) : null;
          const right = n.x > 800;
          const open = href ? `<a href="${href}"` : `<g tabindex="0"`, close = href ? "</a>" : "</g>";
          return `${open} class="sky-star is-${n.state}" data-num="${n.num}" transform="translate(${n.x} ${n.y})" aria-label="Topic ${n.num}: ${n.title} — ${n.state}">
              <circle class="hit" r="26"/>
              ${n.state === "ready" ? '<circle class="ring" r="15"/>' : ""}
              ${n.state === "mastered" ? '<circle class="orbit" r="14"/>' : ""}
              <circle class="core" r="${n.state === "soon" ? 6 : 8}"/>
              <text x="${right ? -16 : 16}" y="5" text-anchor="${right ? "end" : "start"}">${n.title}</text>
            ${close}`;
        }).join("")}
      </svg>
      <div class="sky-tip" role="tooltip" hidden></div>`;

    const tip = $(".sky-tip", el);
    const STATE = { soon: "Coming soon", ready: "Ready to explore", explored: "Explored", mastered: "Mastered" };
    function showTip(node) {
      const n = byNum[node.dataset.num];
      const box = el.getBoundingClientRect(), r = node.querySelector(".core").getBoundingClientRect();
      tip.innerHTML = `
        <span class="tip-num">Topic ${String(n.num).padStart(2, "0")} · <span class="tip-state is-${n.state}">${STATE[n.state]}</span></span>
        <b>${n.title}</b>
        <p>${n.blurb}</p>
        ${n.live.map((l) => `<span class="tip-lesson">${SA.icon ? SA.icon(progress[l.id]?.visited ? "check" : "arrowRight") : ""}${l.title}${progress[l.id]?.quiz ? ` · quiz ${progress[l.id].quiz}` : ""}</span>`).join("")}`;
      tip.hidden = false;
      const x = r.left + r.width / 2 - box.left, y = r.top - box.top;
      tip.style.left = `${clamp(x, 128, box.width - 128)}px`;
      tip.style.top = `${y}px`;
      tip.classList.toggle("is-below", y < 170);
    }
    $$(".sky-star", el).forEach((n) => {
      n.addEventListener("pointerenter", () => showTip(n));
      n.addEventListener("focus", () => showTip(n));
      n.addEventListener("pointerleave", () => (tip.hidden = true));
      n.addEventListener("blur", () => (tip.hidden = true));
    });

    // side panel
    const litCount = nodes.filter(lit).length;
    $("[data-uni-lit]").textContent = litCount;
    $("[data-uni-total]").textContent = nodes.length;
    $("[data-uni-bar]").innerHTML = nodes.map((n) => `<i class="${lit(n) ? "done" : n.state === "ready" ? "now" : ""}"></i>`).join("");
    const pairs = nodes.flatMap((n) => n.live.map((l) => ({ l, n })));
    const next = pairs.find(({ l }) => !progress[l.id]?.visited) || pairs.find(({ l }) => !progress[l.id]?.quiz);
    $("[data-uni-next]").innerHTML = next
      ? `<p class="eyebrow">Next</p><b>${next.l.title}</b><p>Topic ${next.n.num} · ${next.n.title}. ${progress[next.l.id]?.visited ? "Finish the quick check to master it." : "Open the lab to fill in this topic."}</p>
         <a class="btn btn-primary btn-sm" href="${SA.url(next.l.href)}">${progress[next.l.id]?.visited ? "Finish the quick check" : "Open the lesson"} <span class="arr" aria-hidden="true">→</span></a>`
      : `<p class="eyebrow">Up to date</p><b>Every live lesson done</b><p>New topics fill in here as lessons launch.</p>`;
    const reset = $("[data-uni-reset]");
    reset.hidden = !litCount;
    reset.addEventListener("click", () => { SA.progress.reset(); location.reload(); });

    // the live topic card: lesson states and progress ticks
    const items = $$("[data-lessons] li");
    let doneCount = 0;
    items.forEach((li) => {
      const pr = li.dataset.lesson && progress[li.dataset.lesson];
      if (!pr) return;
      doneCount++;
      li.classList.add("is-done");
      li.querySelector("[data-lesson-state]").textContent = pr.quiz ? `Quiz ${pr.quiz}` : "Explored";
    });
    $$("[data-topic-steps] i").forEach((i, k) => i.classList.toggle("done", k < doneCount));
    const cnt = $("[data-topic-count]");
    if (cnt) cnt.textContent = `${doneCount} / ${items.length} lessons`;
  }

  initHero();
  initZoom();
  initMap();
})();
