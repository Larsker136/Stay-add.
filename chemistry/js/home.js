/* ==========================================================================
   stay add. chemistry — home page
   1. Hero instrument: energy distribution of particles, with Eₐ and a catalyst.
   2. Powers of ten: a sticky section; scrolling zooms the framed figure from a
      beaker of acid down to one collision. Motion stays inside the figure.
   3. Topic cards: the 12 topic lessons in four strands, each with a small figure.
   (The labs list and the syllabus map are shared: assets/js/subject-home.js.)
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
     3. Topic cards: twelve topics in four strands, each with a small figure
     ======================================================================= */
  function initTopics() {
    const el = $("[data-strands]");
    if (!el || !SA.catalog) return;
    const subject = SA.subject("chemistry"), progress = SA.progress ? SA.progress.all() : {};
    const STRANDS = [["Particles and bonding", "How matter is built, and how to count it", [1, 2, 3]], ["Reactions and energy", "What happens when substances react, how fast, and with what energy", [4, 5, 6, 7]], ["Elements and the Earth", "The Periodic Table, metals, and chemistry in air and water", [8, 9, 10]], ["Carbon and the laboratory", "Organic compounds, and the techniques that identify substances", [11, 12]]];
    const LAYOUT = { 2: [[3, 2], [3, 2]], 3: [[3, 2], [3, 1], [3, 1]], 4: [[4, 2], [2, 1], [2, 1], [6, 1]] };
    const UI = ["#c4302b", "#e8662a", "#f2b92c", "#d8d23a", "#8cc63f", "#3fae5a", "#2f9e8a", "#2a8fb0", "#2c6fc0", "#3a52c0", "#4a3cb0", "#5a2ca0"];
    const MINI = {
      1: () => [[20, "cb", [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]].map(([c, r]) => [c * 14, r * 14])], [110, "ct", [[0, 20], [12, 14], [26, 22], [8, 4], [22, 2], [34, 12]]], [196, "cr", [[0, 0], [40, 18], [14, 40], [50, 44], [30, 4]]]].map(([x, c, pts]) => `<rect class="f lt" x="${x - 6}" y="30" width="72" height="70" rx="6"/>${pts.map(([dx, dy]) => `<circle class="f ${c} dk" cx="${x + 10 + dx}" cy="${52 + dy}" r="6"/>`).join("")}`).join("") + `<g text-anchor="middle"><text x="50" y="118">solid</text><text x="136" y="118">liquid</text><text x="226" y="118">gas</text></g>`,
      2: () => `<circle class="f cr dk" cx="70" cy="66" r="8"/><circle class="shell" cx="70" cy="66" r="24"/><circle class="shell" cx="70" cy="66" r="44"/>${[0, 1].map((k) => `<circle class="e" cx="${70 + 24 * Math.cos(k * Math.PI)}" cy="66" r="3.5"/>`).join("")}${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<circle class="e" cx="${70 + 44 * Math.cos(k * Math.PI / 4)}" cy="${66 + 44 * Math.sin(k * Math.PI / 4)}" r="3.5"/>`).join("")}<circle class="shell" cx="180" cy="66" r="26"/><circle class="shell" cx="222" cy="66" r="26"/><circle class="e" cx="201" cy="60" r="3.5"/><circle class="e" cx="201" cy="72" r="3.5"/><text x="180" y="70" text-anchor="middle" class="k">H</text><text x="222" y="70" text-anchor="middle" class="k">H</text><text x="200" y="118" text-anchor="middle">shared pair</text>`,
      3: () => `<path class="l ca" style="--lw:2" d="M140 14L200 112H80Z"/><path class="l" d="M104 76H176M140 76V112"/><text x="140" y="62" text-anchor="middle" class="big">m</text><text x="114" y="104" text-anchor="middle" class="big">n</text><text x="166" y="104" text-anchor="middle" class="big">Mr</text><text x="40" y="60" text-anchor="middle">n = m ÷ Mr</text><text x="240" y="60" text-anchor="middle">6.02 × 10²³</text>`,
      4: () => `<path class="glass" d="M60 40V116H220V40"/><rect class="liq" style="--lc:var(--blue)" x="62" y="62" width="156" height="52"/><rect class="f dk" x="90" y="30" width="12" height="70"/><rect class="f dk" x="178" y="30" width="12" height="70"/><path class="l" d="M96 30V14H184V30"/><circle class="f cr dk" cx="120" cy="88" r="5"/><circle class="f cb dk" cx="160" cy="80" r="5"/><text x="96" y="128" text-anchor="middle">−</text><text x="184" y="128" text-anchor="middle">+</text>`,
      5: () => `<path class="l" d="M30 14V116H260"/><path class="l ca" style="--lw:2" d="M34 60H90C120 60 124 22 146 22S172 96 200 96H250"/><path class="l cr" d="M230 60V96"/><path class="mk cr" d="M230 96l-4 -8h8z"/><text x="236" y="82">ΔH</text><text x="150" y="16">Eₐ</text>`,
      6: () => `<path class="l" d="M30 14V116H260"/><path class="l ca" style="--lw:2" d="M32 114C60 40 100 26 256 22"/><path class="l" style="stroke-dasharray:4 4" d="M32 114C80 66 140 40 256 32"/><text x="200" y="60">faster</text>`,
      7: () => UI.map((c, i) => `<rect x="${20 + i * 20}" y="44" width="20" height="30" fill="${c}"/>`).join("") + `<text x="20" y="92">0</text><text x="260" y="92" text-anchor="end">14</text><text x="140" y="30" text-anchor="middle">acid · neutral · alkali</text>`,
      8: () => Array.from({ length: 4 }, (_, r) => Array.from({ length: 18 }, (_, c) => (r === 0 && c > 0 && c < 17) || (r < 3 && c > 1 && c < 12) ? "" : `<rect class="f ${c === 0 && r ? "cb dk" : c === 16 ? "ca dk" : c === 17 ? "cv dk" : "lt"}" x="${14 + c * 14}" y="${24 + r * 18}" width="12" height="16" rx="2"/>`).join("")).join("") + `<text x="14" y="112">Group I</text><text x="266" y="112" text-anchor="end">VII · VIII</text>`,
      9: () => ["K", "Na", "Ca", "Mg", "Al", "Zn", "Fe", "Cu", "Ag"].map((m, i) => `<rect class="f ${i === 6 ? "ca dk" : "lt"}" x="${18 + i * 28}" y="40" width="24" height="40" rx="4"/><text x="${30 + i * 28}" y="64" text-anchor="middle" class="${i === 6 ? "k" : ""}">${m}</text>`).join("") + `<text x="18" y="100">more reactive</text><text x="266" y="100" text-anchor="end">less →</text>`,
      10: () => `<circle class="f cg" cx="100" cy="76" r="40"/><circle cx="34" cy="28" r="14" fill="var(--amber)"/><path class="l cr" style="stroke-dasharray:3 3" d="M100 36V12M124 42l14 -20"/><text x="170" y="56">CO₂ · CH₄</text><text x="170" y="74">infrared trapped</text>`,
      11: () => `${[0, 1, 2].map((i) => `<text x="${80 + i * 50}" y="70" text-anchor="middle" class="k">C</text><text x="${80 + i * 50}" y="34" text-anchor="middle">H</text><text x="${80 + i * 50}" y="108" text-anchor="middle">H</text><path class="bond" d="M${80 + i * 50} 56V40M${80 + i * 50} 76V96"/>`).join("")}<text x="40" y="70" text-anchor="middle">H</text><text x="220" y="70" text-anchor="middle">H</text><path class="bond" d="M48 66H72M88 66H122M138 66H172M188 66H212"/><text x="250" y="70" text-anchor="middle">propane</text>`,
      12: () => `<rect class="f lt" x="60" y="10" width="160" height="112"/><path class="l" style="stroke-dasharray:4 3" d="M60 104H220"/><path class="l cb" d="M60 24H220"/>${[["#c4302b", 90, 80], ["#2c6fc0", 90, 40], ["#3fae5a", 140, 60], ["#c4302b", 190, 80]].map(([c, x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="${c}" opacity=".8"/>`).join("")}<text x="240" y="66">Rf</text>`
    };
    const shapeOf = ([c, r]) => (r > 1 ? "tall" : c >= 4 ? "wide" : "small");
    function card(t, size) {
      const num = String(t.num).padStart(2, "0"), shape = shapeOf(size), l = t.lessons[0], more = t.lessons.slice(1), opened = progress[l.id]?.visited;
      return `<article class="b-topic ${shape}" style="--c:${size[0]};--r:${size[1]}">
        <svg class="fig b-fig" viewBox="0 0 280 132" aria-hidden="true">${MINI[t.num]()}</svg>
        <div class="b-copy">
          <div class="t-meta"><span class="t-num">${num}</span><span class="status" style="--sc:var(--c-chem)">${opened ? "In progress" : "Live"}</span></div>
          <h4><a class="b-link" href="${SA.url(l.href)}">${t.title}</a></h4><p>${t.blurb}</p>
          ${shape === "small" ? "" : `<p class="b-lesson">${l.blurb}</p>`}
          ${more.length ? `<p class="b-also">Also: ${more.map((m) => m.title).join(", ")}</p>` : ""}
          <span class="b-go" aria-hidden="true">${opened ? "Continue" : "Open"} →</span>
        </div>
      </article>`;
    }
    el.innerHTML = STRANDS.map(([title, sub, nums], k) => {
      const ts = nums.map((n) => subject.topics.find((t) => t.num === n)), sizes = LAYOUT[ts.length];
      return `<section class="strand" aria-labelledby="strand-${k}">
        <header class="strand-h"><span class="num">topics ${nums[0]}–${nums.at(-1)}</span><h3 id="strand-${k}">${title}</h3><p>${sub}</p></header>
        <div class="strand-grid">${ts.map((t, i) => card(t, sizes[i])).join("")}</div>
      </section>`;
    }).join("");
  }

  initHero();
  initZoom();
  initTopics();
})();
