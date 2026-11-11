/* ==========================================================================
   stay add. — Physics topic 1, Motion, forces and energy: the labs
   vectors   two forces at an angle and their resultant
   motion    a three-part journey drawn as distance–time and speed–time graphs
   weight    the same mass on different planets
   density   objects of different materials dropped into different liquids
   spring    loads on a spring: extension, the limit of proportionality
   moments   a balanced (or not) beam
   momentum  two trolleys collide; momentum before = after
   energy    a ball released on a track: GPE ↔ KE, with or without friction
   pressure  p = F / A for a block, and p = ρgh in a liquid
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString(), f2 = (n) => (Math.round(n * 100) / 100).toString();
  const arrow = (id, cls = "mk") => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1L10 5L0 9z" class="${cls}"/></marker>`;

  /* ---------- vectors ---------- */
  function vectorsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { a: 30, b: 40, angle: 90 };
    function draw() {
      const S = 3.2, ox = 120, oy = 250, th = (st.angle * Math.PI) / 180;
      const ax = st.a * S, bx = st.b * S * Math.cos(th), by = -st.b * S * Math.sin(th);
      const rx = st.a + st.b * Math.cos(th), ry = st.b * Math.sin(th), R = Math.hypot(rx, ry), dir = (Math.atan2(ry, rx) * 180) / Math.PI;
      svg.innerHTML = `<defs>${arrow("vA", "mk cb")}${arrow("vB", "mk cv")}${arrow("vR", "mk cr")}</defs>
        <path class="gl" d="M20 250H620M120 20V280"/>
        <path class="l cb dash" d="M${ox + bx} ${oy + by}l${ax} 0"/><path class="l cv dash" d="M${ox + ax} ${oy}l${bx} ${by}"/>
        <path class="vec cb" style="--fc:var(--blue)" d="M${ox} ${oy}l${ax} 0" marker-end="url(#vA)"/>
        <path class="vec cv" style="--fc:var(--violet)" d="M${ox} ${oy}l${bx} ${by}" marker-end="url(#vB)"/>
        <path class="vec" style="--fc:var(--red);stroke-width:3.5" d="M${ox} ${oy}L${ox + ax + bx} ${oy + by}" marker-end="url(#vR)"/>
        <text x="${ox + ax / 2}" y="${oy + 18}" text-anchor="middle" class="tc cb">F₁ = ${st.a} N</text>
        <text x="${ox + bx / 2 - 10}" y="${oy + by / 2}" text-anchor="end" class="tc cv">F₂ = ${st.b} N</text>
        <text x="${ox + (ax + bx) / 2 + 12}" y="${oy + by / 2 - 8}" class="tc cr">R = ${f1(R)} N</text>
        <text x="600" y="30" text-anchor="end" class="ser">parallelogram rule</text>`;
      res.innerHTML = rows([["F₁", `${st.a} N`], ["F₂", `${st.b} N at ${st.angle}° to F₁`], ["resultant R", `${f1(R)} N`], ["direction of R", `${f1(dir)}° to F₁`]]);
      exp.innerHTML = chips([["Resultant"], [`${f1(R)} N`, "up"]]) + `<h3>${st.angle === 0 ? "Same direction: just add" : st.angle === 180 ? "Opposite directions: subtract" : st.angle === 90 ? "At right angles: use Pythagoras" : "At an angle: draw to scale"}</h3><p>Forces are <b>vectors</b> — they have size <i>and</i> direction — so they can’t simply be added like numbers. Place them tip-to-tail (or draw the parallelogram); the <b>resultant</b> runs from the start of the first to the end of the second.${st.angle === 90 ? ` Here R = √(${st.a}² + ${st.b}²) = ${f1(R)} N.` : ""}</p>` + flow(["vector: size + direction", "draw tip to tail, to scale", "measure the resultant", "R and its angle"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { a: 30, b: 40, angle: 90 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- motion graphs ---------- */
  function motionLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { a: 2, cruise: 6, d: 2, show: "vt" }, t = 0;
    function journey() {
      const vmax = st.a * 4, t1 = 4, t2 = t1 + st.cruise, t3 = t2 + vmax / st.d;
      const v = (x) => (x < t1 ? st.a * x : x < t2 ? vmax : x < t3 ? vmax - st.d * (x - t2) : 0);
      const s = (x) => (x < t1 ? 0.5 * st.a * x * x : x < t2 ? 8 * st.a + vmax * (x - t1) : x < t3 ? 8 * st.a + vmax * st.cruise + vmax * (x - t2) - 0.5 * st.d * (x - t2) ** 2 : 8 * st.a + vmax * st.cruise + (vmax * vmax) / (2 * st.d));
      return { vmax, t1, t2, t3, v, s, total: s(t3 + 1) };
    }
    function draw() {
      const J = journey(), T = J.t3 + 2, X = (x) => 60 + (x / T) * 540, vt = st.show === "vt";
      const top = vt ? J.vmax * 1.15 : J.total * 1.1, Y = (y) => 230 - (y / top) * 200;
      let d = ""; for (let i = 0; i <= 200; i++) { const x = (i / 200) * T; d += `${i ? "L" : "M"}${X(x).toFixed(1)} ${Y(vt ? J.v(x) : J.s(x)).toFixed(1)}`; }
      const now = Math.min(t, T);
      svg.innerHTML = `<path class="gl" d="M60 ${Y(top / 2)}H600"/><path class="ax" d="M60 20V230H604"/>
        ${vt ? `<path class="area" d="${d}L${X(T)} 230H60Z"/>` : ""}<path class="plot" style="stroke:var(--c-phys)" d="${d}"/>
        <path class="guide" d="M${X(J.t1)} 20V230M${X(J.t2)} 20V230M${X(J.t3)} 20V230"/>
        <text x="${(X(0) + X(J.t1)) / 2}" y="36" text-anchor="middle">accelerating</text><text x="${(X(J.t1) + X(J.t2)) / 2}" y="36" text-anchor="middle">constant speed</text><text x="${(X(J.t2) + X(J.t3)) / 2}" y="36" text-anchor="middle">decelerating</text>
        <text x="60" y="12" class="k">${vt ? "speed / m/s" : "distance / m"}</text><text x="600" y="248" text-anchor="end">time / s</text>
        <circle class="pt" cx="${X(now)}" cy="${Y(vt ? J.v(now) : J.s(now))}" r="5"/>
        <path class="ground" d="M60 282H600"/><rect class="f cb dk" x="${60 + (J.s(now) / J.total) * 500}" y="262" width="40" height="18" rx="5"/>`;
      res.innerHTML = rows([["top speed", `${J.vmax} m/s`], ["acceleration", `${st.a} m/s²`], ["deceleration", `${st.d} m/s²`], ["total distance", `${f1(J.total)} m`], ["total time", `${f1(J.t3)} s`]]);
      exp.innerHTML = chips([[vt ? "Speed–time" : "Distance–time"]]) + (vt
        ? `<h3>Gradient = acceleration · area = distance</h3><p>On a <b>speed–time</b> graph a straight sloping line means constant acceleration; its <b>gradient</b> is the acceleration (here ${st.a} m/s² going up, −${st.d} m/s² coming down). A horizontal line is constant speed. The <b>area under the line</b> is the distance travelled: ${f1(J.total)} m.</p>`
        : `<h3>Gradient = speed</h3><p>On a <b>distance–time</b> graph the <b>gradient</b> is the speed. A straight line means constant speed; a curve getting steeper means accelerating; getting flatter, decelerating; a flat line means stopped.</p>`) + flow(["a = Δv / Δt", "v = s / t", "area under v–t = distance"]);
    }
    const paint = controls(lab, st, () => { paint(); t = 0; draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { a: 2, cruise: 6, d: 2, show: "vt" }); t = 0; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); t = 0; paint(); draw(); };
    paint(); draw();
    loop(lab, () => { const J = journey(); t = t > J.t3 + 1.5 ? 0 : t + 0.08; draw(); }, 40);
  }

  /* ---------- weight on planets ---------- */
  function weightLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const G = { Moon: 1.6, Mars: 3.7, Earth: 9.8, Jupiter: 24.8 };
    let st = { m: 60, place: "Earth" };
    function draw() {
      const g = G[st.place], W = st.m * g, comp = Math.min(150, W / 10);
      svg.innerHTML = `<rect class="f lt" x="200" y="230" width="240" height="20" rx="4"/><rect class="f" x="260" y="${210 - 0}" width="120" height="20" rx="4"/>
        <path class="l w3" d="M270 210V${200 - comp * 0.3}M370 210V${200 - comp * 0.3}"/><rect class="f cb" x="280" y="${120 - comp * 0.3}" width="80" height="${80}" rx="8"/>
        <text x="320" y="${170 - comp * 0.3}" text-anchor="middle" class="tc cb big">${st.m} kg</text>
        <defs>${arrow("wW", "mk cr")}</defs><path class="vec" style="--fc:var(--red)" d="M420 120v${Math.max(20, comp)}" marker-end="url(#wW)"/>
        <text x="432" y="${130 + Math.max(20, comp) / 2}" class="tc cr">W = ${f1(W)} N</text>
        <text x="320" y="40" text-anchor="middle" class="ser">on ${st.place} · g = ${g} N/kg</text>`;
      res.innerHTML = rows([["mass", `${st.m} kg (same everywhere)`], ["g on " + st.place, `${g} N/kg`], ["weight W = mg", `${f1(W)} N`]]);
      exp.innerHTML = chips([[st.place], [`W = ${f1(W)} N`]]) + `<h3>Mass stays the same, weight changes</h3><p><b>Mass</b> is the amount of matter in an object (kg) — it is the same on Earth or the Moon. <b>Weight</b> is the gravitational force on it (N), W = mg, where g is the gravitational field strength. ${st.place === "Moon" ? "On the Moon g is about one-sixth of Earth’s, so you weigh about a sixth as much." : ""}</p>` + flow(["mass m (kg)", "× field strength g (N/kg)", "weight W (N)"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { m: 60, place: "Earth" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- density and floating ---------- */
  function densityLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const MAT = { cork: 0.24, wood: 0.7, ice: 0.92, plastic: 1.2, aluminium: 2.7, iron: 7.9 }, LIQ = { oil: 0.9, water: 1.0, "salt water": 1.2, mercury: 13.6 };
    let st = { mat: "wood", vol: 200, liq: "water" };
    function draw() {
      const rho = MAT[st.mat], m = rho * st.vol, L = LIQ[st.liq], floats = rho < L, side = Math.cbrt(st.vol) * 9;
      const sub = floats ? rho / L : 1, surface = 120, bottom = 270, top = floats ? surface - side * (1 - sub) : bottom - side;
      svg.innerHTML = `<rect class="water" x="160" y="${surface}" width="320" height="${bottom - surface}" style="fill:color-mix(in srgb, ${st.liq === "mercury" ? "var(--ink-3)" : st.liq === "oil" ? "var(--amber)" : "var(--blue)"} 18%, var(--surface))"/>
        <path class="l w3" d="M160 60V${bottom}H480V60"/>
        <rect class="f ${st.mat === "iron" || st.mat === "aluminium" ? "" : "ca"} dk" x="${320 - side / 2}" y="${top}" width="${side}" height="${side}" rx="3"/>
        <text x="320" y="${top + side / 2 + 4}" text-anchor="middle" class="k">${st.mat}</text>
        <text x="490" y="${surface + 4}">${st.liq} · ${L} g/cm³</text>`;
      res.innerHTML = rows([["mass", `${f1(m)} g`], ["volume", `${st.vol} cm³`], ["density ρ = m / V", `${rho} g/cm³`], ["liquid density", `${L} g/cm³`], ["result", floats ? "floats" : "sinks"]]);
      exp.innerHTML = chips([[floats ? "Floats" : "Sinks", floats ? "up" : "down"]]) + `<h3>${st.mat} (${rho} g/cm³) ${floats ? "is less dense than" : "is denser than"} ${st.liq} (${L} g/cm³)</h3><p><b>Density</b> is mass per unit volume, ρ = m / V. Changing the size of the block changes its mass and volume together, but <b>not its density</b> — so it doesn’t change whether it floats. An object floats in a liquid if it is <b>less dense</b> than the liquid.</p>` + flow(["measure mass (balance)", "measure volume (ruler, or displacement)", "ρ = m / V", "compare with the liquid"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { mat: "wood", vol: 200, liq: "water" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- spring (Hooke's law) ---------- */
  function springLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const k = 20, LOP = 6;   // N/m-ish in cm: 1 N → 5 cm until the limit of proportionality at 6 N
    let st = { n: 3 }, history = new Set([0, 3]);
    const ext = (F) => (F <= LOP ? F * 5 : LOP * 5 + (F - LOP) * 5 + (F - LOP) ** 2 * 2.2);
    function draw() {
      const F = st.n, x = ext(F), L0 = 60, len = L0 + x * 2, coils = 14;
      let d = `M140 30V40`; for (let i = 0; i < coils; i++) { const y = 40 + (len / coils) * i; d += `L${i % 2 ? 125 : 155} ${y + len / coils / 2}`; } d += `L140 ${40 + len}V${50 + len}`;
      const masses = Array.from({ length: F }, (_, i) => `<rect class="f cb" x="120" y="${52 + len + i * 12}" width="40" height="11" rx="2"/>`).join("");
      history.add(F);
      const X = (f) => 300 + f * 30, Y = (e) => 260 - e * 3.2;
      const pts = [...history].sort((a, b) => a - b).map((f) => `<circle class="pt" cx="${X(f)}" cy="${Y(ext(f))}" r="4"/>`).join("");
      let curve = ""; for (let f = 0; f <= 10; f += 0.25) curve += `${f ? "L" : "M"}${X(f)} ${Y(ext(f))}`;
      svg.innerHTML = `<path class="ground" d="M100 30H180"/><path class="l w3" style="--fc:var(--ink-2)" d="${d}"/>${masses}
        <path class="guide" d="M190 ${40 + L0}H215M190 ${40 + len}H215"/><path class="l cr" d="M205 ${40 + L0}V${40 + len}"/><text x="212" y="${40 + (L0 + len) / 2}" class="tc cr">x = ${f1(x)} cm</text>
        <path class="ax" d="M300 20V260H610"/><path class="l dash" style="--fc:var(--ink-4)" d="${curve}"/>
        <path class="guide" d="M${X(LOP)} 20V260"/><text x="${X(LOP) + 4}" y="32">limit of proportionality</text>
        ${pts}<text x="300" y="14" class="k">extension / cm</text><text x="610" y="278" text-anchor="end">load / N</text>`;
      res.innerHTML = rows([["load F", `${F} N`], ["extension x", `${f1(x)} cm`], ["k = F / x", F && F <= LOP ? `${f2(F / (x / 100))} N/m` : F ? "not proportional" : "—"], ["region", F <= LOP ? "obeys Hooke’s law" : "beyond the limit"]]);
      exp.innerHTML = chips([[F <= LOP ? "Proportional" : "Past the limit", F <= LOP ? "up" : "warn"]]) + `<h3>${F <= LOP ? "Extension is proportional to load" : "Beyond the limit of proportionality"}</h3><p>Up to the <b>limit of proportionality</b>, doubling the force doubles the extension: F = kx, where k is the <b>spring constant</b>. The load–extension graph is a straight line through the origin. Past the limit the line curves — the spring stretches more for each newton and may not return to its original length.</p>` + flow(["add a load", "measure the new length", "extension = new − original length", "plot load against extension"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.n = 3; history = new Set([0, 3]); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- moments ---------- */
  function momentsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { w1: 4, d1: 3, w2: 6, d2: 2 };
    function draw() {
      const cw = st.w2 * st.d2, acw = st.w1 * st.d1, net = cw - acw, tilt = Math.max(-12, Math.min(12, net * 1.2));
      const U = 50, cx = 320, cy = 160;
      svg.innerHTML = `<path class="f" d="M300 230L320 170L340 230Z"/>
        <g transform="rotate(${tilt} ${cx} ${cy + 8})">
          <rect class="f cb lt" x="70" y="${cy}" width="500" height="10" rx="3"/>
          ${Array.from({ length: 11 }, (_, i) => `<path class="tk" d="M${70 + i * 50} ${cy + 10}v6"/>`).join("")}
          <rect class="f cr" x="${cx - st.d1 * U - 18}" y="${cy - 10 - st.w1 * 6}" width="36" height="${10 + st.w1 * 6}" rx="3"/><text x="${cx - st.d1 * U}" y="${cy - 16 - st.w1 * 6}" text-anchor="middle" class="tc cr">${st.w1} N</text>
          <rect class="f cv" x="${cx + st.d2 * U - 18}" y="${cy - 10 - st.w2 * 6}" width="36" height="${10 + st.w2 * 6}" rx="3"/><text x="${cx + st.d2 * U}" y="${cy - 16 - st.w2 * 6}" text-anchor="middle" class="tc cv">${st.w2} N</text>
        </g>
        <text x="320" y="260" text-anchor="middle">pivot · each mark = 1 m</text>`;
      res.innerHTML = rows([["anticlockwise moment", `${st.w1} × ${st.d1} = ${acw} N m`], ["clockwise moment", `${st.w2} × ${st.d2} = ${cw} N m`], ["result", net === 0 ? "balanced" : net > 0 ? "turns clockwise" : "turns anticlockwise"]]);
      exp.innerHTML = chips([[net === 0 ? "In equilibrium" : "Not balanced", net === 0 ? "up" : "warn"]]) + `<h3>${net === 0 ? "Clockwise moments = anticlockwise moments" : `The ${net > 0 ? "clockwise" : "anticlockwise"} moment is bigger`}</h3><p>The <b>moment</b> of a force is its turning effect: moment = force × <b>perpendicular distance</b> from the pivot. The beam balances when the sum of clockwise moments equals the sum of anticlockwise moments (the <b>principle of moments</b>). A small force far from the pivot can balance a large force close to it.</p>` + flow(["moment = F × d", "add clockwise moments", "add anticlockwise moments", "equal → balanced"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { w1: 4, d1: 3, w2: 6, d2: 2 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- momentum ---------- */
  function momentumLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { m1: 2, u1: 3, m2: 1, u2: 0, kind: "stick" }, t = 0, done = false;
    const after = () => {
      if (st.kind === "stick") { const v = (st.m1 * st.u1 + st.m2 * st.u2) / (st.m1 + st.m2); return [v, v]; }
      const M = st.m1 + st.m2; return [((st.m1 - st.m2) * st.u1 + 2 * st.m2 * st.u2) / M, ((st.m2 - st.m1) * st.u2 + 2 * st.m1 * st.u1) / M];
    };
    function draw() {
      const [v1, v2] = after(), tc = 1.5, w1 = 30 + st.m1 * 10, w2 = 30 + st.m2 * 10;
      let x1, x2;
      // a closing speed of zero means they never meet: just let them coast
      const close = st.u1 - st.u2, meet = close > 0 ? (300 - w1 - 120) / (close * 40) : Infinity;
      if (t < Math.min(meet, 6)) { x1 = 120 + st.u1 * 40 * t; x2 = 300 + st.u2 * 40 * t; }
      else { const tm = meet, dt = t - tm; x1 = 120 + st.u1 * 40 * tm + v1 * 40 * dt; x2 = 300 + st.u2 * 40 * tm + v2 * 40 * dt; }
      svg.innerHTML = `<path class="ground" d="M10 200H630"/>
        <rect class="f cb" x="${x1}" y="${170 - st.m1 * 6}" width="${w1}" height="${30 + st.m1 * 6}" rx="5"/><text x="${x1 + w1 / 2}" y="${190}" text-anchor="middle" class="k">${st.m1} kg</text>
        <rect class="f cr" x="${x2}" y="${170 - st.m2 * 6}" width="${w2}" height="${30 + st.m2 * 6}" rx="5"/><text x="${x2 + w2 / 2}" y="${190}" text-anchor="middle" class="k">${st.m2} kg</text>
        <text x="20" y="240" class="k">before: p = ${st.m1}×${st.u1} + ${st.m2}×${st.u2} = ${f2(st.m1 * st.u1 + st.m2 * st.u2)} kg m/s</text>
        <text x="20" y="262" class="k">after: p = ${st.m1}×${f2(v1)} + ${st.m2}×${f2(v2)} = ${f2(st.m1 * v1 + st.m2 * v2)} kg m/s</text>`;
    }
    function explain() {
      const [v1, v2] = after(), p = st.m1 * st.u1 + st.m2 * st.u2;
      res.innerHTML = rows([["momentum before", `${f2(p)} kg m/s`], ["velocities after", `${f2(v1)} and ${f2(v2)} m/s`], ["momentum after", `${f2(st.m1 * v1 + st.m2 * v2)} kg m/s`], ["impulse on trolley 2", `${f2(st.m2 * (v2 - st.u2))} N s`]]);
      exp.innerHTML = chips([["Conserved", "up"], [`p = ${f2(p)} kg m/s`]]) + `<h3>Total momentum before = total momentum after</h3><p><b>Momentum</b> p = mv (kg m/s), a vector — direction matters, so a velocity to the left is negative. In any collision with no external force, the total momentum is <b>conserved</b>. ${st.kind === "stick" ? "Here the trolleys stick together, so they share one final velocity: v = total momentum ÷ total mass." : "Here they bounce apart."} The <b>impulse</b> on a trolley, FΔt, equals its change in momentum.</p>` + flow(["p = m v for each", "add them (signs!)", "same total after", "impulse = F Δt = Δp"]);
    }
    const paint = controls(lab, st, () => { paint(); t = 0; explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { m1: 2, u1: 3, m2: 1, u2: 0, kind: "stick" }); t = 0; paint(); explain(); });
    $("[data-go]", lab).addEventListener("click", () => { t = 0; });
    lab.applyState = (s) => { Object.assign(st, s); t = 0; paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { t += 0.03; if (t > 5) t = 0; draw(); }, 30);
  }

  /* ---------- energy on a track ---------- */
  function energyLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { h: 5, m: 2, friction: false }, x = 0, dir = 1, lost = 0;
    const g = 9.8, track = (u) => 200 - 150 * (0.5 + 0.5 * Math.cos(u * Math.PI * 2));   // u in 0..1, a valley
    function tick() {
      const top = st.h, E0 = st.m * g * top;
      lost = st.friction ? Math.min(E0, lost + E0 * 0.0025) : 0;
      x += dir * 0.006;
      const yn = (200 - track(x)) / 150 * top, Ek = E0 - lost - st.m * g * yn;
      if (Ek <= 0 && x > 0.05) { dir = -dir; x += dir * 0.006; }
      if (x <= 0 || x >= 1) { dir = -dir; x = Math.max(0, Math.min(1, x)); }
      draw();
    }
    function draw() {
      const top = st.h, E0 = st.m * g * top, hNow = ((200 - track(x)) / 150) * top, Ep = st.m * g * hNow, Ek = Math.max(0, E0 - lost - Ep), v = Math.sqrt((2 * Ek) / st.m);
      let d = ""; for (let i = 0; i <= 100; i++) d += `${i ? "L" : "M"}${40 + i * 3.6} ${track(i / 100)}`;
      const bx = 40 + x * 360, by = track(x) - 10, sc = 160 / E0;
      svg.innerHTML = `<path class="l w3" style="--fc:var(--ink-3)" d="${d}"/><circle class="f cr dk" cx="${bx}" cy="${by}" r="10"/>
        <path class="ax" d="M450 30V200H620"/>
        <rect class="f cb dk" x="465" y="${200 - Ep * sc}" width="36" height="${Ep * sc}"/><rect class="f cr dk" x="515" y="${200 - Ek * sc}" width="36" height="${Ek * sc}"/><rect class="f ca dk" x="565" y="${200 - lost * sc}" width="36" height="${lost * sc}"/>
        <g text-anchor="middle"><text x="483" y="218">GPE</text><text x="533" y="218">KE</text><text x="583" y="218">thermal</text></g>
        <text x="450" y="22" class="k">energy store / J</text><text x="40" y="250">h = ${f1(hNow)} m · v = ${f1(v)} m/s</text>`;
      res.innerHTML = rows([["GPE = mgh", `${f1(Ep)} J`], ["KE = ½mv²", `${f1(Ek)} J`], ["dissipated (thermal)", `${f1(lost)} J`], ["total", `${f1(E0)} J`], ["max speed (no friction)", `${f1(Math.sqrt(2 * g * top))} m/s`]]);
    }
    function explain() {
      exp.innerHTML = chips([["Conservation of energy"], [st.friction ? "with friction" : "no friction", st.friction ? "warn" : "up"]]) + `<h3>${st.friction ? "Some energy is dissipated as thermal energy" : "GPE and KE swap, the total stays the same"}</h3><p>At the top the ball’s energy is in the <b>gravitational potential</b> store (mgh). As it falls it transfers to the <b>kinetic</b> store (½mv²). Energy is never created or destroyed. ${st.friction ? "With friction, some is transferred to the <b>thermal</b> store of the ball and track each swing, so it never climbs as high again — that energy is <b>dissipated</b> (wasted)." : "With no friction it rises back to the same height for ever. Its top speed is √(2gh)."}</p>` + flow(["GPE = mgh", "falls → KE = ½mv²", "total energy conserved", "friction → thermal (wasted)"]);
    }
    const paint = controls(lab, st, () => { paint(); x = 0; dir = 1; lost = 0; explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { h: 5, m: 2, friction: false }); x = 0; dir = 1; lost = 0; paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); x = 0; dir = 1; lost = 0; paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, tick, 25);
  }

  /* ---------- pressure ---------- */
  function pressureLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const RHO = { water: 1000, "sea water": 1030, oil: 800, mercury: 13600 };
    let st = { kind: "solid", F: 600, A: 0.02, depth: 5, liq: "water" };
    function draw() {
      $$("[data-for]", lab).forEach((g) => (g.hidden = g.dataset.for !== st.kind));
      if (st.kind === "solid") {
        const p = st.F / st.A, w = Math.sqrt(st.A) * 900;
        svg.innerHTML = `<path class="ground" d="M40 220H600"/><rect class="f ca lt" x="${320 - w / 2}" y="${220 - 14}" width="${w}" height="14"/><rect class="f cb" x="${320 - Math.min(w, 220) / 2}" y="100" width="${Math.min(w, 220)}" height="106" rx="4"/><text x="320" y="160" text-anchor="middle" class="tc cb">F = ${st.F} N</text>
          <text x="320" y="250" text-anchor="middle">contact area A = ${st.A} m² · p = ${Math.round(p).toLocaleString()} Pa</text>`;
        res.innerHTML = rows([["force", `${st.F} N`], ["area", `${st.A} m²`], ["pressure p = F / A", `${Math.round(p).toLocaleString()} Pa`]]);
        exp.innerHTML = chips([["p = F / A"]]) + `<h3>The same force on a smaller area gives more pressure</h3><p><b>Pressure</b> is force per unit area, measured in pascals (1 Pa = 1 N/m²). That is why a knife with a thin edge cuts easily, and why snowshoes and wide tractor tyres spread the weight over a large area to reduce the pressure.</p>` + flow(["same force", "smaller area", "greater pressure"]);
      } else {
        const rho = RHO[st.liq], dp = rho * 9.8 * st.depth, yD = 60 + st.depth * 16;
        svg.innerHTML = `<rect class="water" x="160" y="60" width="320" height="200"/><path class="l w3" d="M160 40V260H480V40"/>
          <circle class="f cr dk" cx="320" cy="${yD}" r="8"/><path class="guide" d="M480 60H520M480 ${yD}H520"/><path class="l cr" d="M510 60V${yD}"/><text x="518" y="${(60 + yD) / 2}" class="tc cr">h = ${st.depth} m</text>
          <defs>${arrow("pA", "mk cr")}</defs>${[0, 90, 180, 270].map((a) => `<path class="vec" style="--fc:var(--red)" d="M${320 + Math.cos((a * Math.PI) / 180) * 34} ${yD + Math.sin((a * Math.PI) / 180) * 34}L${320 + Math.cos((a * Math.PI) / 180) * 14} ${yD + Math.sin((a * Math.PI) / 180) * 14}" marker-end="url(#pA)"/>`).join("")}
          <text x="170" y="54">${st.liq} · ρ = ${rho} kg/m³</text>`;
        res.innerHTML = rows([["depth h", `${st.depth} m`], ["density ρ", `${rho} kg/m³`], ["Δp = ρgh", `${Math.round(dp).toLocaleString()} Pa`]]);
        exp.innerHTML = chips([["Δp = ρgΔh"]]) + `<h3>Deeper, and denser, means more pressure</h3><p>The pressure in a liquid increases with <b>depth</b> and with the liquid’s <b>density</b>, and acts <b>equally in all directions</b> at a given depth. The extra pressure is Δp = ρgΔh. That’s why dams are thicker at the bottom and divers feel more pressure the deeper they go.</p>` + flow(["deeper", "more liquid above pushing down", "greater pressure", "Δp = ρ g Δh"]);
      }
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { kind: "solid", F: 600, A: 0.02, depth: 5, liq: "water" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ vectors: vectorsLab, motion: motionLab, weight: weightLab, density: densityLab, spring: springLab, moments: momentsLab, momentum: momentumLab, energy: energyLab, pressure: pressureLab });
})();
