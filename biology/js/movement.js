/* ==========================================================================
   stay add. — Movement into and out of cells: the labs
   (Topics, the step rail and the Interpret chains are the shared lesson form
   in assets/js/lesson.js.)
   Three particle models, each a random walk drawn in SVG:
     diffusion — particles cross a membrane through pores; temperature,
                 gradient, surface area (pores) and distance (thickness)
     osmosis   — water crosses, solute cannot; water is less free to leave
                 the side with more solute, and a higher level pushes back
     active    — ions are carried into a root hair cell against the gradient,
                 one per carrier per packet of energy from respiration
   Each lab exposes lab.applyState(state).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = (list) => list.map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  const chips = (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`;
  const flow = (list) => `<p class="flow">${list.map((t) => `<span>${t}</span>`).join("")}</p>`;
  const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const dot = (cls, r) => { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", r); c.setAttribute("class", cls); return c; };

  // sliders: <input data-k="name"> with an <output data-out="name">; seg buttons: [data-k][data-v]
  function controls(lab, st, onChange) {
    $$("input[data-k]", lab).forEach((inp) => inp.addEventListener("input", () => { st[inp.dataset.k] = +inp.value; onChange(inp.dataset.k); }));
    $$(".seg[data-k] button", lab).forEach((b) => b.addEventListener("click", () => { st[b.parentElement.dataset.k] = +b.dataset.v; onChange(b.parentElement.dataset.k); }));
    $$("[data-toggle]", lab).forEach((b) => b.addEventListener("click", () => { st[b.dataset.toggle] = !st[b.dataset.toggle]; onChange(b.dataset.toggle); }));
    return function paint() {
      $$("input[data-k]", lab).forEach((inp) => {
        inp.value = st[inp.dataset.k];
        inp.style.setProperty("--pct", `${((st[inp.dataset.k] - inp.min) / (inp.max - inp.min)) * 100}%`);
        const out = $(`[data-out="${inp.dataset.k}"]`, lab); if (out) out.textContent = st[inp.dataset.k];
      });
      $$(".seg[data-k] button", lab).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.v === st[b.parentElement.dataset.k])));
      $$("[data-toggle]", lab).forEach((b) => b.setAttribute("aria-pressed", String(!!st[b.dataset.toggle])));
    };
  }

  // a running loop that only ticks while the lab's topic is on screen
  function loop(lab, step, draw) {
    let playing = !still, raf = 0;
    const btn = $("[data-play]", lab);
    const label = () => btn && (btn.textContent = playing ? "Pause" : "Play");
    function frame() {
      raf = 0;
      if (!playing) return;
      if (!lab.closest(".topic").hidden) { step(); draw(); }
      raf = requestAnimationFrame(frame);
    }
    btn?.addEventListener("click", () => { playing = !playing; label(); if (playing && !raf) raf = requestAnimationFrame(frame); });
    label();
    return {
      start() { if (still) { for (let i = 0; i < 900; i++) step(); draw(); return; } if (playing && !raf) raf = requestAnimationFrame(frame); }
    };
  }

  // net crossings in the last few seconds (frames ≈ 60 per second)
  function rateMeter(windowFrames = 180) {
    let log = [], t = 0;
    return {
      tick() { t++; while (log.length && log[0][0] < t - windowFrames) log.shift(); },
      add(sign) { log.push([t, sign]); },
      net() { return log.reduce((n, e) => n + e[1], 0); },
      perSec() { return (log.reduce((n, e) => n + e[1], 0) / windowFrames) * 60; },
      reset() { log = []; t = 0; }
    };
  }

  /* =======================================================================
     Lab: diffusion across a membrane
     ======================================================================= */
  function diffusionLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const L = 30, R = 610, T = 40, B = 286, MX = 320, PR = 4;
    let st = { temp: 25, conc: 70, pores: 5, thick: 16 };
    let ps = [], meter = rateMeter(), frames = 0, crossed = 0;
    const pores = () => Array.from({ length: st.pores }, (_, i) => T + ((i + 0.5) * (B - T)) / st.pores);
    let PH = 26;   // pore height (narrower when there are many, so they never merge)

    svg.innerHTML = `
      <rect class="f lt" x="${L}" y="${T}" width="${R - L}" height="${B - T}" rx="8"/>
      <g data-mem></g><g data-dots></g>
      <text x="${(L + MX) / 2}" y="28" text-anchor="middle" class="k" data-lc></text><text x="${(MX + R) / 2}" y="28" text-anchor="middle" class="k" data-rc></text>
      <text x="${MX}" y="${B + 22}" text-anchor="middle">partially permeable membrane · pores = surface area · thickness = distance</text>`;
    const mem = $("[data-mem]", svg), dots = $("[data-dots]", svg);

    function drawMembrane() {
      PH = Math.min(26, ((B - T) / st.pores) * 0.7);
      const hw = st.thick / 2, ys = pores();
      let d = "", y0 = T;
      ys.forEach((y) => { d += `<rect class="f dk" x="${MX - hw}" y="${y0}" width="${st.thick}" height="${Math.max(0, y - PH / 2 - y0)}"/>`; y0 = y + PH / 2; });
      d += `<rect class="f dk" x="${MX - hw}" y="${y0}" width="${st.thick}" height="${B - y0}"/>`;
      mem.innerHTML = d;
    }
    function reset() {
      dots.innerHTML = ""; ps = []; meter.reset(); frames = 0; crossed = 0;
      const add = (n, x0, x1) => { for (let i = 0; i < n; i++) { const p = { x: x0 + Math.random() * (x1 - x0), y: T + PR + Math.random() * (B - T - 2 * PR), vx: 0, vy: 0, el: dot("f cv dk", PR) }; p.side = p.x < MX ? -1 : 1; dots.appendChild(p.el); ps.push(p); } };
      add(st.conc, L + PR, MX - st.thick / 2 - PR);
      add(4, MX + st.thick / 2 + PR, R - PR);
      drawMembrane(); draw(); explain();
    }
    function step() {
      frames++; meter.tick();
      const sp = 1 + st.temp / 12, hw = st.thick / 2, ys = pores();
      const inPore = (y) => ys.some((py) => Math.abs(y - py) <= PH / 2 - PR);
      for (const p of ps) {
        p.vx = p.vx * 0.82 + gauss() * sp; p.vy = p.vy * 0.82 + gauss() * sp;
        let nx = p.x + p.vx, ny = p.y + p.vy;
        if (nx < L + PR || nx > R - PR) { p.vx = -p.vx; nx = clamp(nx, L + PR, R - PR); }
        if (ny < T + PR || ny > B - PR) { p.vy = -p.vy; ny = clamp(ny, T + PR, B - PR); }
        const wasIn = Math.abs(p.x - MX) < hw + PR, willIn = Math.abs(nx - MX) < hw + PR;
        if (willIn) {
          if (!wasIn && !inPore(ny)) { p.vx = -p.vx; nx = p.x; }                       // hit the membrane wall
          else if (wasIn) { const py = ys.reduce((a, b) => (Math.abs(b - p.y) < Math.abs(a - p.y) ? b : a)); ny = clamp(ny, py - PH / 2 + PR, py + PH / 2 - PR); }
        }
        p.x = nx; p.y = ny;
        const side = p.x < MX ? -1 : 1;
        if (side !== p.side && Math.abs(p.x - MX) > hw) { meter.add(side); crossed += side; p.side = side; }
      }
    }
    function counts() { let l = 0; for (const p of ps) if (p.x < MX) l++; return [l, ps.length - l]; }
    function draw() {
      for (const p of ps) { p.el.setAttribute("cx", p.x.toFixed(1)); p.el.setAttribute("cy", p.y.toFixed(1)); }
      const [l, r] = counts();
      $("[data-lc]", svg).textContent = `left: ${l}`; $("[data-rc]", svg).textContent = `right: ${r}`;
      if (frames % 20 === 0) explain();
    }
    function explain() {
      const [l, r] = counts(), even = Math.abs(l - r) <= Math.max(3, ps.length * 0.12), rate = meter.perSec();
      res.innerHTML = rows([["net movement, particles / s", rate.toFixed(1)], ["left : right", `${l} : ${r}`], ["moved across so far (net)", crossed], ["time", `${(frames / 60).toFixed(0)} s`]]);
      const fast = [], slow = [];
      (st.temp >= 40 ? fast : st.temp <= 12 ? slow : []).push(st.temp >= 40 ? "high temperature" : "low temperature");
      (st.pores >= 10 ? fast : st.pores <= 2 ? slow : []).push(st.pores >= 10 ? "large surface area" : "small surface area");
      (st.thick <= 8 ? fast : st.thick >= 40 ? slow : []).push(st.thick <= 8 ? "thin membrane" : "thick membrane");
      const head = even ? chips([["Equilibrium"], ["No net movement"]]) : chips([["Diffusing", "up"], [`${rate.toFixed(1)} / s`]]);
      const text = even
        ? `<h3>Spread out evenly</h3><p>The particles still move randomly and still cross both ways — but now as many go left as right, so there is <b>no net movement</b>. Press Restart to try other settings.</p>`
        : `<h3>Net movement from left to right</h3><p>More particles are on the left, so by chance more hit a pore from that side. ${fast.length ? `<b>${fast.join(", ")}</b> speed${fast.length === 1 ? "s" : ""} it up. ` : ""}${slow.length ? `<b>${slow.join(", ")}</b> slow${slow.length === 1 ? "s" : ""} it down. ` : ""}The bigger the difference between the sides, the faster the net movement — watch it slow as the sides even out.</p>`;
      exp.innerHTML = head + text + flow(["higher concentration", "random movement", "more cross one way", "net diffusion down the gradient"]);
    }
    const paint = controls(lab, st, (k) => { paint(); if (k === "temp") { explain(); return; } reset(); });
    $("[data-reset]", lab).addEventListener("click", () => { st = Object.assign(st, { temp: 25, conc: 70, pores: 5, thick: 16 }); paint(); reset(); });
    $("[data-restart]", lab).addEventListener("click", reset);
    lab.applyState = (s) => { Object.assign(st, s); paint(); reset(); };
    paint(); reset(); loop(lab, step, draw).start();
  }

  /* =======================================================================
     Lab: osmosis across a partially permeable membrane
     ======================================================================= */
  function osmosisLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const L = 30, R = 610, T = 30, B = 286, MX = 320, WR = 2.6, SR = 7, NW = 170;
    let st = { left: 0, right: 8, temp: 25 };
    let water = [], solute = [], meter = rateMeter(), frames = 0, moved = 0;
    svg.innerHTML = `
      <rect class="f lt" x="${L}" y="${T}" width="${R - L}" height="${B - T}" rx="8"/>
      <rect class="f cb lt no-s" data-ll x="${L + 1}" width="${MX - L - 3}"/><rect class="f cb lt no-s" data-rl x="${MX + 2}" width="${R - MX - 3}"/>
      <path class="l cb" data-ls/><path class="l cb" data-rs/>
      <g data-dots></g>
      <path class="l w3 dash" d="M${MX} ${T}V${B}"/>
      <text x="${(L + MX) / 2}" y="${B + 20}" text-anchor="middle" class="k" data-lc></text><text x="${(MX + R) / 2}" y="${B + 20}" text-anchor="middle" class="k" data-rc></text>`;
    const dots = $("[data-dots]", svg);
    const level = (n) => B - (n / (NW / 2)) * ((B - T) * 0.5);   // surface y for n water particles on a side
    function reset() {
      dots.innerHTML = ""; water = []; solute = []; meter.reset(); frames = 0; moved = 0;
      for (let i = 0; i < NW; i++) { const left = i < NW / 2; const w = { x: left ? L + 6 + Math.random() * (MX - L - 12) : MX + 6 + Math.random() * (R - MX - 12), y: level(NW / 2) + 4 + Math.random() * (B - level(NW / 2) - 8), vx: 0, vy: 0, el: dot("f cb dk no-s", WR) }; w.side = left ? -1 : 1; dots.appendChild(w.el); water.push(w); }
      const addS = (n, x0, x1) => { for (let i = 0; i < n; i++) { const s = { x: x0 + Math.random() * (x1 - x0), y: B - 12 - Math.random() * 100, vx: 0, vy: 0, el: dot("f ca dk", SR) }; dots.appendChild(s.el); solute.push(s); } };
      addS(st.left, L + SR + 2, MX - SR - 4); addS(st.right, MX + SR + 4, R - SR - 2);
      draw(); explain();
    }
    function counts() { let l = 0; for (const w of water) if (w.x < MX) l++; return [l, water.length - l]; }
    function step() {
      frames++; meter.tick();
      const sp = 0.7 + st.temp / 18, [nl, nr] = counts(), yl = level(nl), yr = level(nr);
      const sL = solute.filter((s) => s.x < MX).length, sR = solute.length - sL;
      for (const w of water) {
        w.vx = w.vx * 0.8 + gauss() * sp; w.vy = w.vy * 0.8 + gauss() * sp;
        let nx = w.x + w.vx, ny = w.y + w.vy;
        const top = (nx < MX ? yl : yr) + WR;
        if (nx < L + WR || nx > R - WR) { w.vx = -w.vx; nx = clamp(nx, L + WR, R - WR); }
        if (ny < top) { w.vy = Math.abs(w.vy); ny = top; }
        if (ny > B - WR) { w.vy = -w.vy; ny = B - WR; }
        if ((w.x < MX) !== (nx < MX)) {
          // leaving a side: less likely the more solute there is on it (lower water potential),
          // more likely the higher its own level is (pressure)
          const fromL = w.x < MX, sol = fromL ? sL : sR, head = (fromL ? yr - yl : yl - yr) / (B - T);
          const p = clamp(0.55 * (1 - sol / 18) * (1 + head * 2.2), 0.03, 1);
          if (Math.random() > p || ny < (fromL ? yr : yl) + WR) { w.vx = -w.vx; nx = w.x; }
        }
        w.x = nx; w.y = ny;
        const side = w.x < MX ? -1 : 1;
        if (side !== w.side) { meter.add(side); moved += side; w.side = side; }
      }
      for (const s of solute) {
        s.vx = s.vx * 0.85 + gauss() * sp * 0.4; s.vy = s.vy * 0.85 + gauss() * sp * 0.4;
        const left = s.x < MX, x0 = left ? L + SR : MX + SR + 2, x1 = left ? MX - SR - 2 : R - SR, top = (left ? yl : yr) + SR;
        s.x = clamp(s.x + s.vx, x0, x1); s.y = clamp(s.y + s.vy, Math.min(top, B - SR), B - SR);
        if (s.x === x0 || s.x === x1) s.vx = -s.vx;
      }
    }
    function draw() {
      for (const w of water) { w.el.setAttribute("cx", w.x.toFixed(1)); w.el.setAttribute("cy", w.y.toFixed(1)); }
      for (const s of solute) { s.el.setAttribute("cx", s.x.toFixed(1)); s.el.setAttribute("cy", s.y.toFixed(1)); }
      const [nl, nr] = counts(), yl = level(nl), yr = level(nr);
      $("[data-ll]", svg).setAttribute("y", yl); $("[data-ll]", svg).setAttribute("height", Math.max(0, B - yl - 1));
      $("[data-rl]", svg).setAttribute("y", yr); $("[data-rl]", svg).setAttribute("height", Math.max(0, B - yr - 1));
      $("[data-ls]", svg).setAttribute("d", `M${L} ${yl}H${MX}`); $("[data-rs]", svg).setAttribute("d", `M${MX} ${yr}H${R}`);
      $("[data-lc]", svg).textContent = `left · solute ${st.left}`; $("[data-rc]", svg).textContent = `right · solute ${st.right}`;
      if (frames % 20 === 0) explain();
    }
    function explain() {
      const [nl, nr] = counts(), rate = meter.perSec();
      res.innerHTML = rows([["net water flow, molecules / s", Math.abs(rate).toFixed(1) + (Math.abs(rate) < 0.3 ? "" : rate > 0 ? " → right" : " ← left")], ["water left : right", `${nl} : ${nr}`], ["higher water potential", st.left === st.right ? "equal" : st.left < st.right ? "left (more dilute)" : "right (more dilute)"], ["time", `${(frames / 60).toFixed(0)} s`]]);
      const diff = st.right - st.left, toward = diff > 0 ? "right" : "left";
      const text = diff === 0
        ? `<h3>Equal solutions: no net movement</h3><p>Both sides have the same concentration, so water molecules cross the membrane equally in both directions. Add solute to one side.</p>`
        : `<h3>Water moves to the ${toward}, the more concentrated side</h3><p>The solute particles are too big to pass the membrane, but water is not. Water on the ${toward} side is held by more solute — it has a <b>lower water potential</b> — so fewer water molecules leave it. Net movement is into the ${toward} side and its level rises, until the extra height pushes back as hard as osmosis pulls.${st.temp >= 40 ? " At this high temperature the molecules move faster, so the level changes sooner." : ""}</p>`;
      exp.innerHTML = (diff === 0 ? chips([["Balanced"]]) : chips([["Osmosis", "up"], [`toward ${toward}`]])) + text + flow(["dilute side: higher water potential", "water crosses partially permeable membrane", "concentrated side: lower water potential"]);
    }
    const paint = controls(lab, st, (k) => { paint(); if (k === "temp") { explain(); return; } reset(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { left: 0, right: 8, temp: 25 }); paint(); reset(); });
    $("[data-restart]", lab).addEventListener("click", reset);
    lab.applyState = (s) => { Object.assign(st, s); paint(); reset(); };
    paint(); reset(); loop(lab, step, draw).start();
  }

  /* =======================================================================
     Lab: active transport into a root hair cell
     ======================================================================= */
  function activeLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const L = 30, R = 610, T = 40, B = 286, MX = 320, IR = 4.5;
    let st = { oxygen: 80, temp: 25, carriers: 4, poison: false };
    let ions = [], carriers = [], energy = 0, meter = rateMeter(300), frames = 0, taken = 0;
    svg.innerHTML = `
      <rect class="f ca lt" x="${L}" y="${T}" width="${MX - L - 6}" height="${B - T}" rx="8"/>
      <rect class="f cg lt" x="${MX + 6}" y="${T}" width="${R - MX - 6}" height="${B - T}" rx="8"/>
      <path class="l w5" d="M${MX} ${T}V${B}"/>
      <g data-car></g>
      <g data-mito><ellipse class="f ca" cx="520" cy="250" rx="30" ry="14"/><path class="l ca" d="M496 250c8-8 12 8 20 0s12 8 20 0"/><ellipse class="f ca" cx="430" cy="262" rx="22" ry="10"/></g>
      <g data-dots></g>
      <rect class="f lt" x="${MX + 26}" y="${B - 24}" width="120" height="12" rx="6"/><rect class="f ca dk no-s" data-en x="${MX + 26}" y="${B - 24}" height="12" rx="6"/>
      <text x="${MX + 26}" y="${B - 30}">energy from respiration</text>
      <text x="${(L + MX) / 2}" y="28" text-anchor="middle" class="k" data-oc></text><text x="${(MX + R) / 2}" y="28" text-anchor="middle" class="k" data-ic></text>`;
    const dots = $("[data-dots]", svg), carG = $("[data-car]", svg);
    function reset() {
      dots.innerHTML = ""; ions = []; energy = 0; meter.reset(); frames = 0; taken = 0;
      const add = (n, inside) => { for (let i = 0; i < n; i++) { const p = { x: inside ? MX + 14 + Math.random() * (R - MX - 24) : L + 8 + Math.random() * (MX - L - 24), y: T + 8 + Math.random() * (B - T - 50), vx: 0, vy: 0, inside, ride: null, el: dot("f cv dk", IR) }; dots.appendChild(p.el); ions.push(p); } };
      add(18, false); add(36, true);
      carriers = Array.from({ length: st.carriers }, (_, i) => ({ y: T + ((i + 0.5) * (B - T - 40)) / st.carriers, busy: 0, ion: null }));
      carG.innerHTML = carriers.map((c, i) => `<rect class="f ct" data-c="${i}" x="${MX - 11}" y="${c.y - 12}" width="22" height="24" rx="6"/>`).join("");
      draw(); explain();
    }
    const resp = () => (st.poison ? 0 : (st.oxygen / 100) * Math.max(0, 1 - ((st.temp - 35) / 22) ** 2));   // respiration rate, 0–1
    function step() {
      frames++; meter.tick();
      energy = Math.min(6, energy + resp() * 0.05);
      const sp = 0.6 + st.temp / 20;
      for (const p of ions) {
        if (p.ride) continue;
        p.vx = p.vx * 0.82 + gauss() * sp; p.vy = p.vy * 0.82 + gauss() * sp;
        const x0 = p.inside ? MX + 6 + IR : L + IR, x1 = p.inside ? R - IR : MX - 6 - IR;
        let nx = p.x + p.vx, ny = p.y + p.vy;
        if (nx < x0 || nx > x1) {
          // a little leaks out of the cell by diffusion, down the gradient
          if (p.inside && nx < x0 && Math.random() < 0.004 * sp) { p.inside = false; nx = MX - 10; meter.add(-1); taken--; }
          else { p.vx = -p.vx; nx = clamp(nx, x0, x1); }
        }
        if (ny < T + IR || ny > B - IR - (p.inside ? 36 : 0)) { p.vy = -p.vy; ny = clamp(ny, T + IR, B - IR - (p.inside ? 36 : 0)); }
        p.x = nx; p.y = ny;
      }
      for (const c of carriers) {
        if (c.busy > 0) {
          c.busy--; const t = 1 - c.busy / 40;
          c.ion.x = MX - 16 + t * 34; c.ion.y = c.y;
          if (c.busy === 0) { c.ion.inside = true; c.ion.ride = null; c.ion.x = MX + 18; c.ion = null; meter.add(1); taken++; }
          continue;
        }
        if (energy < 1) continue;
        const near = ions.find((p) => !p.inside && !p.ride && Math.abs(p.x - (MX - 14)) < 14 && Math.abs(p.y - c.y) < 16);
        if (near) { energy -= 1; c.busy = 40; c.ion = near; near.ride = c; }
      }
    }
    function counts() { let i = 0; for (const p of ions) if (p.inside) i++; return [ions.length - i, i]; }
    function draw() {
      for (const p of ions) { p.el.setAttribute("cx", p.x.toFixed(1)); p.el.setAttribute("cy", p.y.toFixed(1)); }
      carriers.forEach((c, i) => $(`[data-c="${i}"]`, carG).classList.toggle("dk", c.busy > 0));
      $("[data-en]", svg).setAttribute("width", ((energy / 6) * 120).toFixed(1));
      $("[data-mito]", svg).style.opacity = (0.3 + resp() * 0.7).toFixed(2);
      const [o, i] = counts();
      $("[data-oc]", svg).textContent = `soil water: ${o} ions (low)`; $("[data-ic]", svg).textContent = `root hair cell: ${i} ions (high)`;
      if (frames % 20 === 0) explain();
    }
    function explain() {
      const [o, i] = counts(), rate = meter.perSec() * 60, r = resp();
      res.innerHTML = rows([["uptake, ions / minute", Math.max(0, rate).toFixed(0)], ["outside : inside", `${o} : ${i}`], ["respiration rate", `${Math.round(r * 100)} %`], ["carrier proteins", st.carriers]]);
      let head, text;
      if (r < 0.05) {
        head = chips([["Stopped", "down"]]);
        text = `<h3>No energy, no active transport</h3><p>${st.poison ? "The poison stops respiration" : st.oxygen < 10 ? "Without oxygen there is almost no aerobic respiration" : "At this temperature the enzymes of respiration barely work"}, so the carriers cannot change shape. A few ions even <b>leak out</b> by diffusion, down their gradient.</p>`;
      } else {
        head = chips([["Active transport", "up"], [`${Math.max(0, rate).toFixed(0)} / min`]]);
        text = `<h3>Ions pumped in, against the gradient</h3><p>There are more ions inside the cell than outside, so diffusion would carry them <b>out</b>. Each carrier protein binds an ion and uses energy from respiration to move it <b>in</b>. More oxygen, a temperature near the enzymes’ optimum, and <b>more carriers</b> all raise the rate.</p>`;
      }
      exp.innerHTML = head + text + flow(["respiration releases energy", "carrier protein changes shape", "ion moved in", "against the concentration gradient"]);
    }
    const paint = controls(lab, st, (k) => { paint(); if (k === "carriers") reset(); else explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { oxygen: 80, temp: 25, carriers: 4, poison: false }); paint(); reset(); });
    $("[data-restart]", lab).addEventListener("click", reset);
    lab.applyState = (s) => { const rebuild = s.carriers !== undefined && s.carriers !== st.carriers; Object.assign(st, s); paint(); if (rebuild || s.restart) reset(); else explain(); };
    paint(); reset(); loop(lab, step, draw).start();
  }

  const LABS = { diffusion: diffusionLab, osmosis: osmosisLab, active: activeLab };
  $$("[data-lab]").forEach((lab) => LABS[lab.dataset.mode]?.(lab));
})();
