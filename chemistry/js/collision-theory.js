/* ==========================================================================
   stay add. — Collision theory lab
   A + B → AB in a 2D box. Particles move with a temperature-dependent
   (Maxwell–Boltzmann) speed distribution. An A–B collision is successful
   only when the energy along the line of impact is ≥ the activation energy.

   Physics notes
   · Velocities are Gaussian with σ² ∝ T, so for colliding pairs
     P(success) = exp(−Eₐ / kT) — the same Arrhenius trend as real reactions.
   · A gentle thermostat keeps the temperature at the slider value.
   · Pressure moves a piston (smaller volume, same particles).
   · Concentration sets how many A particles there are (B is fixed).
   · The catalyst lowers Eₐ; it does not change particle speeds.
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const host = document.querySelector('[data-sim="collision-theory"]');
  if (!host) return;

  /* ---------- Model constants ---------- */
  const W = 720, H = 440;                 // world size (px)
  const T_REF = 298.15;                    // 25 °C — the "start conditions"
  const SIGMA = 105;                       // thermal speed scale at T_REF (px/s)
  const EA = 2.0, EA_CAT = 0.85;           // activation energy in units of k·T_REF
  const R_REACTANT = 8, R_PRODUCT = 11;
  const A_PER_UNIT = 40;                   // A particles per 1.0 mol/dm³
  const N_B = 40;
  const GRAPH_SECONDS = 60, SAMPLE_EVERY = 0.25;
  const BASELINE = { temp: 25, conc: 1, pressure: 1, catalyst: false };
  const PIN_COLORS = ["var(--blue)", "var(--rose)", "var(--ink-3)"];

  const A = 0, B = 1, P = 2;

  const state = { ...BASELINE, speed: 1, playing: true, fx: true };

  let particles = [], effects = [], events = [], series = [], pinned = [];
  let t = 0, sampleClock = 0, products = 0, maxProduct = 0;
  let boxW = W, boxTarget = W;
  let seg = { c: 0, s: 0 };               // collisions since temperature/catalyst last changed

  /* ---------- Helpers ---------- */
  const $ = (sel) => host.querySelector(sel);
  const $$ = (sel) => [...host.querySelectorAll(sel)];
  const kT = (tempC) => (tempC + 273.15) / T_REF;
  const sigma2 = (tempC) => SIGMA * SIGMA * kT(tempC);
  const eaNow = () => (state.catalyst ? EA_CAT : EA);
  const successChance = (s = state) => Math.exp(-(s.catalyst ? EA_CAT : EA) / kT(s.temp));
  function gauss() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  /* ---------- Setup ---------- */
  function spawn(type) {
    const r = R_REACTANT, s = Math.sqrt(sigma2(state.temp));
    let x, y;
    for (let tries = 0; tries < 80; tries++) {
      x = r + Math.random() * (boxW - 2 * r);
      y = r + Math.random() * (H - 2 * r);
      if (!particles.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < (p.r + r + 2) ** 2)) break;
    }
    particles.push({ x, y, vx: gauss() * s, vy: gauss() * s, r, m: 1, type, angle: 0, spin: 0 });
  }

  function restart() {
    particles = []; effects = []; events = [];
    t = 0; sampleClock = 0; products = 0;
    series = [{ t: 0, v: 0 }];
    seg = { c: 0, s: 0 };
    boxW = boxTarget = W / state.pressure;
    const nA = Math.round(A_PER_UNIT * state.conc);
    for (let i = 0; i < nA; i++) spawn(A);
    for (let i = 0; i < N_B; i++) spawn(B);
    maxProduct = Math.min(nA, N_B);
    updateStats(); drawRateChart();
  }

  /* ---------- Physics step ---------- */
  function step(dt) {
    // Piston glides to its target position
    const prevW = boxW;
    boxW += (boxTarget - boxW) * Math.min(1, dt * 5);
    if (Math.abs(boxTarget - boxW) < 0.05) boxW = boxTarget;
    const pistonV = (boxW - prevW) / dt;

    for (const p of particles) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.angle += p.spin * dt;
      if (p.x < p.r) { p.x = p.r; p.vx = Math.abs(p.vx); }
      if (p.x > boxW - p.r) { p.x = boxW - p.r; if (p.vx > pistonV) p.vx = 2 * pistonV - p.vx; }
      if (p.y < p.r) { p.y = p.r; p.vy = Math.abs(p.vy); }
      if (p.y > H - p.r) { p.y = H - p.r; p.vy = -Math.abs(p.vy); }
    }

    const ea = eaNow() * SIGMA * SIGMA;
    const born = [];
    const n = particles.length;
    for (let i = 0; i < n; i++) {
      const a = particles[i];
      if (a.dead) continue;
      for (let j = i + 1; j < n; j++) {
        const b = particles[j];
        if (b.dead) continue;
        const rs = a.r + b.r;
        const dx = b.x - a.x;
        if (dx > rs || dx < -rs) continue;
        const dy = b.y - a.y;
        if (dy > rs || dy < -rs) continue;
        const d2 = dx * dx + dy * dy;
        if (d2 >= rs * rs || d2 === 0) continue;

        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
        const tm = a.m + b.m, overlap = rs - d;
        a.x -= nx * overlap * (b.m / tm); a.y -= ny * overlap * (b.m / tm);
        b.x += nx * overlap * (a.m / tm); b.y += ny * overlap * (a.m / tm);

        const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (vn >= 0) continue; // already moving apart

        if (a.type + b.type === 1) {
          // A meets B: does the collision carry enough energy?
          const mu = (a.m * b.m) / tm;
          const ok = 0.5 * mu * vn * vn >= ea;
          events.push({ t, ok }); seg.c++; if (ok) seg.s++;
          if (ok) {
            SA.sound?.play("hit", Math.min(1, (0.5 * mu * vn * vn) / (ea * 3)));
            a.dead = b.dead = true;
            const angle = Math.atan2(ny, nx) + (a.type === B ? Math.PI : 0);
            born.push({
              x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
              vx: (a.vx + b.vx) / 2, vy: (a.vy + b.vy) / 2,
              r: R_PRODUCT, m: 2, type: P, angle, spin: (Math.random() - 0.5) * 4
            });
            products++;
            effects.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, kind: "hit", age: 0, life: 0.6, rot: Math.random() * Math.PI });
            break;
          }
          effects.push({ x: a.x + nx * a.r, y: a.y + ny * a.r, kind: "miss", age: 0, life: 0.4 });
        }

        const jImp = (-2 * vn) / (1 / a.m + 1 / b.m);
        a.vx -= (jImp * nx) / a.m; a.vy -= (jImp * ny) / a.m;
        b.vx += (jImp * nx) / b.m; b.vy += (jImp * ny) / b.m;
      }
    }
    if (born.length) particles = particles.filter((p) => !p.dead).concat(born);

    // Thermostat: hold the mean kinetic energy at the set temperature
    let ke = 0;
    for (const p of particles) ke += 0.5 * p.m * (p.vx * p.vx + p.vy * p.vy);
    const mean = ke / particles.length;
    if (mean > 0) {
      const lambda = Math.min(1.08, Math.max(0.92, Math.sqrt(1 + (dt / 0.4) * (sigma2(state.temp) / mean - 1))));
      for (const p of particles) { p.vx *= lambda; p.vy *= lambda; }
    }

    for (const e of effects) e.age += dt;
    effects = effects.filter((e) => e.age < e.life);

    t += dt;
    if (t <= GRAPH_SECONDS) {
      sampleClock += dt;
      if (sampleClock >= SAMPLE_EVERY) { sampleClock -= SAMPLE_EVERY; series.push({ t, v: products }); }
    }
  }

  /* ---------- Rendering ---------- */
  const canvas = $("[data-stage]");
  const ctx = canvas.getContext("2d");
  let scale = 1, dpr = 1, sprites = {}, colors = {};

  function readColors() {
    colors = {
      bg: SA.cssVar("--surface"), grid: SA.cssVar("--grid"), wall: SA.cssVar("--line-2"),
      chamber: SA.cssVar("--bg-2"), piston: SA.cssVar("--ink-3"), energy: SA.cssVar("--c-energy"),
      miss: SA.cssVar("--ink-4"), a: SA.cssVar("--c-a"), b: SA.cssVar("--c-b"), ink: SA.cssVar("--ink")
    };
  }

  // Flat, meaning-coloured particles (no gradients or glow): A, B, and AB as the two fused.
  function dot(x, y, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
  function buildSprites() {}

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = rect.width / W;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.width * (H / W) * dpr);
    buildSprites();
    render();
  }

  function render() {
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    ctx.fillStyle = colors.bg; ctx.fillRect(0, 0, W, H);

    // 40 px grid, like graph paper
    ctx.strokeStyle = colors.grid; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 40; x < W; x += 40) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); }
    for (let y = 40; y < H; y += 40) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); }
    ctx.stroke();

    // piston: the space it has taken, its rod and its plate
    const px = Math.min(boxW, W - 4);
    if (boxW < W - 0.5) {
      ctx.fillStyle = colors.chamber; ctx.fillRect(px, 0, W - px, H);
      ctx.fillStyle = colors.piston; ctx.fillRect(px + 4, H / 2 - 3, W - px, 6);
    }
    ctx.fillStyle = colors.piston; ctx.fillRect(px, 0, 4, H);

    // particles
    for (const p of particles) {
      if (p.type === P) {
        const ox = Math.cos(p.angle) * 5.2, oy = Math.sin(p.angle) * 5.2;
        dot(p.x - ox, p.y - oy, 7, colors.a);
        dot(p.x + ox, p.y + oy, 7, colors.b);
      } else dot(p.x, p.y, p.r, p.type === A ? colors.a : colors.b);
    }

    // collisions: a ring that opens and fades — amber when it reacted, grey when it bounced
    if (state.fx) {
      for (const e of effects) {
        const k = e.age / e.life, ease = 1 - (1 - k) ** 3;
        ctx.globalAlpha = (e.kind === "hit" ? 1 : 0.7) * (1 - k);
        ctx.strokeStyle = e.kind === "hit" ? colors.energy : colors.miss;
        ctx.lineWidth = e.kind === "hit" ? 2 : 1;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.kind === "hit" ? 9 + ease * 22 : 3 + ease * 10, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // walls
    ctx.strokeStyle = colors.wall; ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
  }

  /* ---------- Loop ---------- */
  let last = performance.now(), visible = true, uiClock = 0;
  function frame(now) {
    const realDt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible && !document.hidden) {
      if (state.playing) {
        const simDt = realDt * state.speed;
        const steps = Math.max(1, Math.ceil(simDt / (1 / 120)));
        for (let i = 0; i < steps; i++) step(simDt / steps);
      }
      render();
      uiClock += realDt;
      if (uiClock > 0.2) { uiClock = 0; updateStats(); drawRateChart(); }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Live stats ---------- */
  const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d) : "—");
  function setStat(name, value) { const el = $(`[data-stat="${name}"]`); if (el) el.textContent = value; }
  function updateStats() {
    const win = Math.min(3, Math.max(t, 0.001));
    events = events.filter((e) => e.t > t - 3);
    const coll = events.length / win;
    const succ = events.filter((e) => e.ok).length / win;
    setStat("collisions", t > 0.3 ? fmt(coll) : "—");
    setStat("success", t > 0.3 ? fmt(succ) : "—");
    setStat("fraction", seg.c >= 10 ? `${Math.round((seg.s / seg.c) * 100)}%` : "…");
    setStat("products", `${products}`);
    setStat("max", `${maxProduct}`);
    const bar = $("[data-stat-bar]");
    if (bar) bar.style.width = `${maxProduct ? (products / maxProduct) * 100 : 0}%`;
    const clock = $("[data-clock]");
    if (clock) clock.textContent = t.toFixed(1);
  }

  /* ---------- Charts (SVG) ---------- */
  const svgNS = 'xmlns="http://www.w3.org/2000/svg"';
  const RC = { w: 640, h: 290, l: 50, r: 18, t: 18, b: 44, yMax: 40 };
  const rx = (time) => RC.l + (time / GRAPH_SECONDS) * (RC.w - RC.l - RC.r);
  const ry = (v) => RC.h - RC.b - (v / RC.yMax) * (RC.h - RC.b - RC.t);
  const pathOf = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${rx(p.t).toFixed(1)} ${ry(p.v).toFixed(1)}`).join("");

  function initRateChart() {
    const svg = $('[data-chart="rate"]');
    let grid = "";
    for (let s = 0; s <= GRAPH_SECONDS; s += 10)
      grid += `<line class="gl" x1="${rx(s)}" x2="${rx(s)}" y1="${RC.t}" y2="${RC.h - RC.b}"/><text class="tick" x="${rx(s)}" y="${RC.h - RC.b + 18}" text-anchor="middle">${s}</text>`;
    for (let v = 0; v <= RC.yMax; v += 10)
      grid += `<line class="gl" x1="${RC.l}" x2="${RC.w - RC.r}" y1="${ry(v)}" y2="${ry(v)}"/><text class="tick" x="${RC.l - 10}" y="${ry(v) + 4}" text-anchor="end">${v}</text>`;
    svg.innerHTML = `
      ${grid}
      <line class="axis" x1="${RC.l}" x2="${RC.w - RC.r}" y1="${RC.h - RC.b}" y2="${RC.h - RC.b}"/>
      <line class="axis" x1="${RC.l}" x2="${RC.l}" y1="${RC.t}" y2="${RC.h - RC.b}"/>
      <text class="axis-label" x="${(RC.l + RC.w - RC.r) / 2}" y="${RC.h - 6}" text-anchor="middle">Time / s</text>
      <text class="axis-label" transform="translate(14 ${(RC.t + RC.h - RC.b) / 2}) rotate(-90)" text-anchor="middle">Product formed (particles)</text>
      <g data-pins></g>
      <path class="rc-area" data-area/>
      <path class="rc-line" data-line/>
      <circle class="rc-head" r="5" data-head/>`;
  }

  function drawRateChart() {
    const svg = $('[data-chart="rate"]');
    if (!svg || !series.length) return;
    const pts = series.concat(t <= GRAPH_SECONDS ? [{ t, v: products }] : []);
    const line = pathOf(pts);
    const lastPt = pts[pts.length - 1];
    svg.querySelector("[data-line]").setAttribute("d", line);
    svg.querySelector("[data-area]").setAttribute("d", `${line}L${rx(lastPt.t)} ${ry(0)}L${rx(0)} ${ry(0)}Z`);
    const head = svg.querySelector("[data-head]");
    head.setAttribute("cx", rx(lastPt.t)); head.setAttribute("cy", ry(lastPt.v));
    const done = $("[data-rate-done]");
    if (done) done.hidden = t <= GRAPH_SECONDS;
  }

  function drawPins() {
    const svg = $('[data-chart="rate"]');
    svg.querySelector("[data-pins]").innerHTML = pinned
      .map((p, i) => `<path class="rc-pin" style="stroke:${PIN_COLORS[i]}" d="${pathOf(p.points)}"/>`).join("");
    const legend = $("[data-pin-legend]");
    legend.innerHTML =
      `<span class="pin-chip is-current"><i></i>Current run</span>` +
      pinned.map((p, i) => `<span class="pin-chip" style="--c:${PIN_COLORS[i]}"><i></i>${p.label}</span>`).join("");
    $('[data-action="clear-pins"]').hidden = !pinned.length;
  }

  // Energy distribution — the textbook (3D Maxwell–Boltzmann) shape for teaching
  const EC = { w: 640, h: 290, l: 36, r: 18, t: 22, b: 44, xMax: 8 };
  const EA_SHOW = 4.2, EA_CAT_SHOW = 2.3;
  const mb = (E, k) => Math.sqrt(E) * Math.exp(-E / k) / Math.pow(k, 1.5);
  const EC_YMAX = mb(kT(0) / 2, kT(0)) * 1.12;
  const ex = (E) => EC.l + (E / EC.xMax) * (EC.w - EC.l - EC.r);
  const ey = (f) => EC.h - EC.b - (f / EC_YMAX) * (EC.h - EC.b - EC.t);
  function curve(k, from = 0, to = EC.xMax) {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const E = from + ((to - from) * i) / 120;
      d += `${i ? "L" : "M"}${ex(E).toFixed(1)} ${ey(mb(E, k)).toFixed(1)}`;
    }
    return d;
  }
  function fractionAbove(Ea, k) {
    const f = (E) => mb(E, k), N = 400, top = 40;
    let total = 0, above = 0;
    for (let i = 0; i < N; i++) {
      const E = ((i + 0.5) / N) * top, v = f(E);
      total += v; if (E >= Ea) above += v;
    }
    return above / total;
  }

  function drawEnergy() {
    const svg = $('[data-chart="energy"]');
    if (!svg) return;
    const k = kT(state.temp), kBase = kT(BASELINE.temp);
    const ea = state.catalyst ? EA_CAT_SHOW : EA_SHOW;
    const shade = `${curve(k, ea)}L${ex(EC.xMax)} ${ey(0)}L${ex(ea)} ${ey(0)}Z`;
    const pct = Math.round(fractionAbove(ea, k) * 100);
    svg.innerHTML = `
      <line class="axis" x1="${EC.l}" x2="${EC.w - EC.r}" y1="${ey(0)}" y2="${ey(0)}"/>
      <line class="axis" x1="${EC.l}" x2="${EC.l}" y1="${EC.t}" y2="${ey(0)}"/>
      <text class="axis-label" x="${(EC.l + EC.w - EC.r) / 2}" y="${EC.h - 6}" text-anchor="middle">Energy of particles</text>
      <text class="axis-label" transform="translate(16 ${(EC.t + ey(0)) / 2}) rotate(-90)" text-anchor="middle">Number of particles</text>
      <path class="ed-shade" d="${shade}"/>
      ${Math.abs(k - kBase) > 0.001 ? `<path class="ed-base" d="${curve(kBase)}"/>` : ""}
      <path class="ed-curve" d="${curve(k)}"/>
      <line class="ea-line ${state.catalyst ? "is-dim" : ""}" x1="${ex(EA_SHOW)}" x2="${ex(EA_SHOW)}" y1="${EC.t + 10}" y2="${ey(0)}"/>
      <text class="ea-text ${state.catalyst ? "is-dim" : ""}" x="${ex(EA_SHOW) + 8}" y="${EC.t + 22}">Eₐ</text>
      ${state.catalyst ? `<line class="ea-line is-cat" x1="${ex(EA_CAT_SHOW)}" x2="${ex(EA_CAT_SHOW)}" y1="${EC.t + 10}" y2="${ey(0)}"/>
      <text class="ea-text is-cat" x="${ex(EA_CAT_SHOW) + 8}" y="${EC.t + 22}">Eₐ with catalyst</text>` : ""}
      <g class="ed-note" transform="translate(${EC.w - EC.r - 196} ${EC.t + 44})">
        <rect width="196" height="${Math.abs(k - kBase) > 0.001 ? 62 : 40}" rx="10"/>
        <circle cx="16" cy="20" r="5" class="sw-shade"/>
        <text x="28" y="24"><tspan class="strong">${pct}%</tspan> have E ≥ Eₐ</text>
        ${Math.abs(k - kBase) > 0.001 ? `<line x1="10" x2="22" y1="44" y2="44" class="ed-base"/><text x="28" y="48">25 °C for comparison</text>` : ""}
      </g>`;
  }

  // Energy profile — static diagram, catalyst path highlighted
  function drawProfile() {
    const svg = $('[data-chart="profile"]');
    if (!svg) return;
    svg.classList.toggle("has-cat", state.catalyst);
  }

  /* ---------- Explanations ---------- */
  const EXPLAIN = {
    intro: {
      tag: "How to use the lab", icon: "bulb",
      title: "Collide — with enough energy",
      steps: [
        "Particles of A and B react to make AB when they collide.",
        "Only collisions with energy ≥ the activation energy (Eₐ) succeed.",
        "Amber rings are successful collisions. Grey rings are bounces.",
        "Change one factor at a time and watch the numbers."
      ],
      phrase: "Rate depends on the frequency of successful collisions."
    },
    "temp-up": {
      tag: "Temperature ↑", icon: "thermometer",
      title: "Hotter particles move faster — and hit harder",
      steps: [
        "Particles gain kinetic energy and move faster.",
        "They collide more often (higher collision frequency).",
        "A greater proportion of collisions have energy ≥ Eₐ.",
        "More successful collisions per second → faster rate."
      ],
      phrase: "Particles have more kinetic energy, so more collisions have energy greater than or equal to the activation energy.",
      note: "Watch Success %: it rises. This — not just “more collisions” — is the main reason heating speeds up a reaction."
    },
    "temp-down": {
      tag: "Temperature ↓", icon: "thermometer",
      title: "Cooler particles: slower and gentler",
      steps: [
        "Particles have less kinetic energy and move more slowly.",
        "They collide less often.",
        "A smaller proportion of collisions have energy ≥ Eₐ.",
        "Fewer successful collisions per second → slower rate."
      ],
      phrase: "Fewer particles have energy greater than or equal to the activation energy, so there are fewer successful collisions per unit time.",
      note: "This is why food lasts longer in the fridge."
    },
    "conc-up": {
      tag: "Concentration ↑", icon: "dots",
      title: "More particles in the same space",
      steps: [
        "More particles of A per unit volume.",
        "Particles are closer together, so they collide more often.",
        "The fraction of collisions that succeed stays the same.",
        "More successful collisions per second → faster rate."
      ],
      phrase: "More particles per unit volume, so collisions are more frequent — more successful collisions per unit time.",
      note: "Success % hardly changes — only collision frequency rises. (Changing concentration starts a fresh mixture.)"
    },
    "conc-down": {
      tag: "Concentration ↓", icon: "dots",
      title: "Fewer particles, fewer meetings",
      steps: [
        "Fewer particles of A per unit volume.",
        "Particles are further apart, so they collide less often.",
        "The fraction of collisions that succeed stays the same.",
        "Fewer successful collisions per second → slower rate."
      ],
      phrase: "Fewer particles per unit volume, so collisions are less frequent.",
      note: "Below 1.0 mol/dm³, A is the limiting reactant — it runs out first, so less product forms overall."
    },
    "pressure-up": {
      tag: "Pressure ↑", icon: "gauge",
      title: "Squeeze the gas into a smaller space",
      steps: [
        "The same particles are pushed into a smaller volume.",
        "More particles per unit volume — just like higher concentration.",
        "Particles collide more often.",
        "More successful collisions per second → faster rate."
      ],
      phrase: "Higher pressure means gas particles are closer together, so collisions are more frequent.",
      note: "Pressure only affects reactions involving gases."
    },
    "pressure-down": {
      tag: "Pressure ↓", icon: "gauge",
      title: "More room, fewer collisions",
      steps: [
        "The same particles spread out into a bigger volume.",
        "Fewer particles per unit volume.",
        "Particles collide less often.",
        "Fewer successful collisions per second → slower rate."
      ],
      phrase: "Lower pressure means gas particles are further apart, so collisions are less frequent.",
      note: "Pressure only affects reactions involving gases."
    },
    "catalyst-on": {
      tag: "Catalyst added", icon: "spark",
      title: "A shortcut over the energy hill",
      steps: [
        "The catalyst provides an alternative pathway with a lower Eₐ.",
        "Particles move at exactly the same speed as before.",
        "A greater proportion of collisions now have energy ≥ Eₐ.",
        "More successful collisions per second → faster rate."
      ],
      phrase: "A catalyst provides an alternative reaction pathway with a lower activation energy.",
      note: "A catalyst is not used up and does not give particles more energy. Open the Energy profile tab."
    },
    "catalyst-off": {
      tag: "Catalyst removed", icon: "spark",
      title: "Back to the original pathway",
      steps: [
        "Without the catalyst, the reaction uses the higher-Eₐ pathway.",
        "Particle speeds don’t change.",
        "A smaller proportion of collisions have energy ≥ Eₐ.",
        "Fewer successful collisions per second → slower rate."
      ],
      phrase: "Without a catalyst, the activation energy is higher, so fewer collisions are successful."
    }
  };

  function explain(key) {
    const e = EXPLAIN[key] || EXPLAIN.intro;
    const box = $("[data-explain]");
    box.innerHTML = `
      <div class="explain-tag">${SA.icon(e.icon)}${e.tag}</div>
      <h3>${e.title}</h3>
      <ol class="chain">${e.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <div class="phrase"><span>Exam phrase</span>“${e.phrase}”</div>
      ${e.note ? `<p class="explain-note">${SA.icon("alert")}${e.note}</p>` : ""}`;
    box.classList.remove("is-fresh"); void box.offsetWidth; box.classList.add("is-fresh");
  }

  /* ---------- Comparison with start conditions ---------- */
  function updateCompare() {
    const base = BASELINE;
    const freq = state.conc * state.pressure * Math.sqrt(kT(state.temp) / kT(base.temp));
    const frac = successChance(state) / successChance(base);
    const rows = [
      { label: "Collision frequency", v: freq },
      { label: "Fraction with E ≥ Eₐ", v: frac },
      { label: "Rate of reaction", v: freq * frac, main: true }
    ];
    const bar = (v) => Math.max(3, Math.min(100, (Math.log2(v) + 3) / 7 * 100));
    $("[data-compare-rows]").innerHTML = rows.map((r) => `
      <div class="cmp-row${r.main ? " is-main" : ""}">
        <span class="cmp-label">${r.label}</span>
        <span class="cmp-val mono ${r.v > 1.01 ? "up" : r.v < 0.99 ? "down" : ""}">×${r.v < 10 ? r.v.toFixed(2) : r.v.toFixed(1)}</span>
        <span class="cmp-bar"><i style="width:${bar(r.v)}%"></i><b style="left:${bar(1)}%"></b></span>
      </div>`).join("");
  }

  /* ---------- Controls ---------- */
  const FORMAT = {
    temp: (v) => `${v} °C`,
    conc: (v) => `${v.toFixed(2)} mol/dm³`,
    pressure: (v) => `${v.toFixed(2)} atm`
  };

  function syncControls() {
    $$('input[type="range"][data-control]').forEach((inp) => {
      const key = inp.dataset.control;
      inp.value = state[key];
      const pct = ((state[key] - inp.min) / (inp.max - inp.min)) * 100;
      inp.style.setProperty("--pct", `${pct}%`);
      const out = $(`[data-out="${key}"]`);
      if (out) out.textContent = FORMAT[key](state[key]);
    });
    const cat = $('[data-control="catalyst"]');
    cat.setAttribute("aria-checked", state.catalyst);
    $("[data-cat-badge]").hidden = !state.catalyst;
    $('[data-control="fx"]').setAttribute("aria-checked", state.fx);
    const snd = $('[data-control="sound"]');
    if (snd) snd.setAttribute("aria-checked", !!SA.sound?.enabled);
    $$("[data-speed]").forEach((b) => b.classList.toggle("is-active", +b.dataset.speed === state.speed));
    const play = $('[data-action="play"]');
    play.innerHTML = SA.icon(state.playing ? "pause" : "play");
    play.setAttribute("aria-label", state.playing ? "Pause" : "Play");
  }

  function flashRow(key) {
    const row = $(`[data-factor="${key}"]`);
    if (!row) return;
    row.classList.remove("is-flash"); void row.offsetWidth; row.classList.add("is-flash");
  }

  function setParam(key, value) {
    const old = state[key];
    if (old === value) return;
    state[key] = value;
    if (key === "temp") {
      const f = Math.sqrt(kT(value) / kT(old));
      for (const p of particles) { p.vx *= f; p.vy *= f; }
      seg = { c: 0, s: 0 };
    }
    if (key === "pressure") boxTarget = W / value;
    if (key === "catalyst") seg = { c: 0, s: 0 };
    if (key === "conc") restart();
    const dir = typeof value === "boolean" ? (value ? "on" : "off") : value > old ? "up" : "down";
    explain(`${key}-${dir}`);
    flashRow(key);
    syncControls(); updateCompare(); drawEnergy(); drawProfile();
  }

  function applyPreset(preset) {
    Object.assign(state, BASELINE, preset);
    boxTarget = W / state.pressure;
    restart();
    const key = Object.keys(preset)[0];
    if (key) {
      const v = preset[key];
      explain(`${key}-${typeof v === "boolean" ? (v ? "on" : "off") : v > BASELINE[key] ? "up" : "down"}`);
      flashRow(key);
    } else explain("intro");
    state.playing = true;
    syncControls(); updateCompare(); drawEnergy(); drawProfile();
  }

  function bind() {
    $$('input[type="range"][data-control]').forEach((inp) =>
      inp.addEventListener("input", () => setParam(inp.dataset.control, parseFloat(inp.value)))
    );
    $('[data-control="catalyst"]').addEventListener("click", () => setParam("catalyst", !state.catalyst));
    $('[data-control="fx"]').addEventListener("click", () => { state.fx = !state.fx; syncControls(); });
    $('[data-control="sound"]')?.addEventListener("click", () => { SA.sound?.set(!SA.sound.enabled); syncControls(); });
    $$("[data-speed]").forEach((b) => b.addEventListener("click", () => { state.speed = +b.dataset.speed; syncControls(); }));
    $('[data-action="play"]').addEventListener("click", () => { state.playing = !state.playing; syncControls(); });
    $('[data-action="restart"]').addEventListener("click", () => { restart(); state.playing = true; syncControls(); });
    $('[data-action="reset"]').addEventListener("click", () => applyPreset({}));
    $('[data-action="pin"]').addEventListener("click", () => {
      if (series.length < 4) return;
      const label = `${state.temp}°C · ${state.conc.toFixed(2)} M · ${state.pressure.toFixed(1)} atm${state.catalyst ? " · cat." : ""}`;
      pinned.push({ label, points: series.slice() });
      if (pinned.length > PIN_COLORS.length) pinned.shift();
      drawPins();
      restart();
    });
    $('[data-action="clear-pins"]').addEventListener("click", () => { pinned = []; drawPins(); });

    // Tabs
    $$("[data-tab]").forEach((tab) =>
      tab.addEventListener("click", () => {
        $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === tab));
        $$("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
      })
    );

    // "Try it in the lab" buttons anywhere on the page
    document.querySelectorAll("[data-try]").forEach((btn) =>
      btn.addEventListener("click", () => {
        applyPreset(JSON.parse(btn.dataset.try || "{}"));
        host.scrollIntoView({ behavior: "smooth", block: "start" });
      })
    );

    // Pause work while the lab is off-screen
    if ("IntersectionObserver" in window)
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); }).observe(canvas);
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener("resize", resize);

    document.addEventListener("sa:themechange", () => { readColors(); buildSprites(); });
  }

  /* ---------- Boot ---------- */
  readColors();
  initRateChart();
  bind();
  restart();
  resize();
  explain("intro");
  syncControls(); updateCompare(); drawEnergy(); drawProfile(); drawPins();
  requestAnimationFrame(frame);
})();
