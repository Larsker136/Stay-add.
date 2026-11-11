/* ==========================================================================
   stay add. — Chemistry topic 1, States of matter: the labs
   states     supply energy to a solid: particles and the heating curve side by
              side, with flat parts while it melts and boils
   gas        a gas in a cylinder: temperature and pressure change its volume
   diffusion  ammonia meets an acid gas in a tube; the lighter gas travels further
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  /* ---------- heating a substance: particles + heating curve ---------- */
  function statesLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // name, melting point, boiling point (°C)
    const SUB = { water: ["water", 0, 100], ethanol: ["ethanol", -114, 78], oxygen: ["oxygen", -218, -183] };
    let st = { sub: "water", E: 10 }, ps = [];
    const N = 36;
    for (let i = 0; i < N; i++) { const c = i % 6, r = Math.floor(i / 6); ps.push({ hx: 138 + c * 15, hy: 172 + r * 15, x: 138 + c * 15, y: 172 + r * 15, vx: Math.random() - 0.5, vy: Math.random() - 0.5 }); }
    // energy 0–100: warm solid · melt · warm liquid · boil · warm gas
    function temp(E) {
      const [, mp, bp] = SUB[st.sub];
      if (E < 20) return mp - 40 + (E / 20) * 40;
      if (E < 40) return mp;
      if (E < 60) return mp + ((E - 40) / 20) * (bp - mp);
      if (E < 80) return bp;
      return bp + ((E - 80) / 20) * 40;
    }
    const phase = (E) => (E < 20 ? "solid" : E < 40 ? "melting" : E < 60 ? "liquid" : E < 80 ? "boiling" : "gas");
    // which state particle i is in (during melting / boiling, a growing share has changed)
    function modeOf(i) {
      const E = st.E, f = ((E % 20) / 20) * N;
      if (E < 20) return "s";
      if (E < 40) return i < f ? "l" : "s";
      if (E < 60) return "l";
      if (E < 80) return i < f ? "g" : "l";
      return "g";
    }
    function tick() {
      const heat = 0.6 + st.E / 40;
      ps.forEach((p, i) => {
        const m = modeOf(i);
        if (m === "s") { p.x = p.hx + (Math.random() - 0.5) * heat * 1.6; p.y = p.hy + (Math.random() - 0.5) * heat * 1.6; return; }
        if (m === "l") {
          p.vx += (Math.random() - 0.5) * 0.8; p.vy += (Math.random() - 0.5) * 0.8 + 0.05;
          const s = Math.hypot(p.vx, p.vy) || 1, v = Math.min(s, 1.6); p.vx = (p.vx / s) * v; p.vy = (p.vy / s) * v;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 40 || p.x > 330) p.vx = -p.vx; if (p.y < 176 || p.y > 252) p.vy = -p.vy;
          p.x = Math.max(40, Math.min(330, p.x)); p.y = Math.max(176, Math.min(252, p.y));
          return;
        }
        const s = Math.hypot(p.vx, p.vy) || 1, v = 2.4 + st.E / 30; p.vx = (p.vx / s) * v; p.vy = (p.vy / s) * v;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 38 || p.x > 332) p.vx = -p.vx; if (p.y < 38 || p.y > 254) p.vy = -p.vy;
        p.x = Math.max(38, Math.min(332, p.x)); p.y = Math.max(38, Math.min(254, p.y));
      });
      draw();
    }
    function draw() {
      const [, mp, bp] = SUB[st.sub], lo = mp - 40, hi = bp + 40;
      const X = (E) => 400 + E * 2.2, Y = (T) => 250 - ((T - lo) / (hi - lo)) * 210;
      const curve = [0, 20, 40, 60, 80, 100].map((E, k) => `${k ? "L" : "M"}${X(E)} ${Y(temp(E === 100 ? 100 : E))}`).join("");
      svg.innerHTML = `<rect class="f lt" x="30" y="30" width="310" height="232" rx="6"/>
        ${ps.map((p, i) => `<circle class="f ${modeOf(i) === "s" ? "cb" : modeOf(i) === "l" ? "ct" : "cr"} dk" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="6"/>`).join("")}
        <path class="ax" d="M400 30V250H624"/><path class="plot" d="${curve}"/>
        <path class="guide" d="M400 ${Y(mp)}H${X(40)}M400 ${Y(bp)}H${X(80)}"/>
        <text x="394" y="${Y(mp) + 4}" text-anchor="end">${mp}</text><text x="394" y="${Y(bp) + 4}" text-anchor="end">${bp}</text>
        <text x="${X(30)}" y="${Y(mp) - 8}" text-anchor="middle" class="k">melting</text><text x="${X(70)}" y="${Y(bp) - 8}" text-anchor="middle" class="k">boiling</text>
        <circle class="pt" cx="${X(st.E)}" cy="${Y(temp(st.E))}" r="5"/>
        <text x="400" y="22">temperature / °C</text><text x="624" y="272" text-anchor="end">energy supplied →</text>`;
    }
    function explain() {
      const [name, mp, bp] = SUB[st.sub], ph = phase(st.E), T = temp(st.E);
      res.innerHTML = rows([["substance", name], ["temperature", `${f1(T)} °C`], ["melting point", `${mp} °C`], ["boiling point", `${bp} °C`], ["now", ph]]);
      const txt = {
        solid: "<h3>Solid: particles vibrate in fixed positions</h3><p>The particles are <b>close together in a regular arrangement</b> and only vibrate. Supplying energy makes them vibrate faster, so the temperature rises.</p>",
        melting: `<h3>Melting at ${mp} °C: the temperature stays the same</h3><p>The energy supplied is used to <b>overcome the forces of attraction</b> between the particles, not to make them move faster — so the line on the heating curve is <b>flat</b>. Particles break out of the regular arrangement and start sliding past each other.</p>`,
        liquid: "<h3>Liquid: close together, moving around each other</h3><p>The particles are still <b>close together</b> but randomly arranged and <b>move around each other</b>. A liquid has a fixed volume but no fixed shape.</p>",
        boiling: `<h3>Boiling at ${bp} °C: flat again</h3><p>Energy is used to overcome the remaining forces, so particles escape and move far apart. Boiling happens throughout the liquid at the boiling point; <b>evaporation</b> happens only at the surface, at any temperature.</p>`,
        gas: "<h3>Gas: far apart, fast and random</h3><p>The particles are <b>far apart</b>, randomly arranged and move quickly in all directions, so a gas fills its container and is easy to compress.</p>"
      }[ph];
      exp.innerHTML = chips([[ph.charAt(0).toUpperCase() + ph.slice(1)], [`${f1(T)} °C`]]) + txt + `<p>Cooling runs the curve backwards: <b>condensing</b> at the boiling point and <b>freezing</b> at the melting point, with flat parts again as energy is given out.</p>` + flow(["solid", "melting", "liquid", "boiling", "gas"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { sub: "water", E: 10 }); paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, tick, 33);
  }

  /* ---------- a gas in a cylinder ---------- */
  function gasLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { T: 25, P: 100 }, ps = [], hits = 0, shown = 0, frame = 0;
    for (let i = 0; i < 26; i++) ps.push({ x: 80 + Math.random() * 100, y: 80 + Math.random() * 130, vx: Math.random() - 0.5, vy: Math.random() - 0.5 });
    const vol = () => 24 * ((st.T + 273) / 298) * (100 / st.P);   // dm³ for one mole
    function tick() {
      frame++;
      const right = 60 + Math.min(500, 40 + vol() * 6.2), v = 2.2 * Math.sqrt((st.T + 273) / 298);
      for (const p of ps) {
        const s = Math.hypot(p.vx, p.vy) || 1; p.vx = (p.vx / s) * v; p.vy = (p.vy / s) * v;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 66) { p.vx = Math.abs(p.vx); hits++; } if (p.x > right - 6) { p.vx = -Math.abs(p.vx); p.x = Math.min(p.x, right - 6); hits++; }
        if (p.y < 66 || p.y > 224) { p.vy = -p.vy; p.y = Math.max(66, Math.min(224, p.y)); hits++; }
      }
      if (frame % 30 === 0) { shown = hits; hits = 0; explain(); }
      draw(right);
    }
    function draw(right) {
      right = right || 60 + Math.min(500, 40 + vol() * 6.2);
      svg.innerHTML = `<path class="glass" d="M60 60H590M60 230H590M60 60V230"/>
        <rect class="f dk" x="${right}" y="62" width="14" height="166"/><path class="l w5" d="M${right + 14} 145H620"/>
        ${Array.from({ length: Math.round(st.P / 50) }, (_, k) => `<path class="l w3" style="--fc:var(--c-press)" d="M${right + 58} ${96 + k * 18}h-30l7 -5m-7 5l7 5"/>`).join("")}
        ${ps.map((p) => `<circle class="f cv dk" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5"/>`).join("")}
        <text x="60" y="50">1 mole of gas</text><text x="${right + 40}" y="250" text-anchor="middle">piston (outside pressure ${st.P} kPa)</text>`;
    }
    function explain() {
      const V = vol();
      res.innerHTML = rows([["temperature", `${st.T} °C = ${st.T + 273} K`], ["outside pressure", `${st.P} kPa`], ["volume of gas", `${f1(V)} dm³`], ["collisions with the walls", `${shown} per second`]]);
      const hotter = st.T > 25, squeezed = st.P > 100;
      exp.innerHTML = chips([[`${f1(V)} dm³`], [hotter ? "hotter" : st.T < 25 ? "colder" : "room temperature"]]) + `<h3>${hotter ? "Heating a gas makes it expand" : squeezed ? "Higher pressure squeezes the gas" : "A gas fills its container"}</h3><p>Gas particles move randomly and hit the walls; each collision pushes on the wall. <b>Increasing the temperature</b> gives the particles more kinetic energy, so they move faster and hit the walls harder and more often — at the same outside pressure the gas <b>expands</b>. <b>Increasing the pressure</b> pushes the particles closer together, so the volume <b>decreases</b>.</p>` + flow(["higher temperature", "faster particles", "more frequent, harder collisions", "gas expands"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { T: 25, P: 100 }); paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, tick, 33);
  }

  /* ---------- diffusion in a tube ---------- */
  function diffusionLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // acid gas: formula, Mr, product
    const ACID = { hcl: ["HCl", 36.5, "ammonium chloride, NH₄Cl"], hbr: ["HBr", 81, "ammonium bromide, NH₄Br"] };
    let st = { acid: "hcl", T: 20 }, t = 0, running = true;
    const dots = Array.from({ length: 70 }, () => [Math.random(), Math.random()]);
    const speeds = () => { const k = Math.sqrt((st.T + 273) / 293); return [k / Math.sqrt(17), k / Math.sqrt(ACID[st.acid][1])]; };
    const meetAt = () => { const [a, b] = speeds(); return a / (a + b); };
    function draw() {
      const L = 480, x0 = 80, [a, b] = speeds(), fa = Math.min(meetAt(), t * a), fb = Math.min(1 - meetAt(), t * b), met = fa >= meetAt() - 1e-6;
      svg.innerHTML = `<rect class="glass" x="${x0}" y="120" width="${L}" height="44" rx="6"/>
        <rect class="f ct" x="${x0 - 30}" y="116" width="34" height="52" rx="8"/><rect class="f cr" x="${x0 + L - 4}" y="116" width="34" height="52" rx="8"/>
        ${dots.map(([u, v], i) => i % 2 ? `<circle class="f ct dk" cx="${x0 + 6 + u * u * fa * L}" cy="${126 + v * 32}" r="3.5"/>` : `<circle class="f cr dk" cx="${x0 + L - 6 - u * u * fb * L}" cy="${126 + v * 32}" r="3.5"/>`).join("")}
        ${met ? `<rect x="${x0 + meetAt() * L - 7}" y="121" width="14" height="42" fill="var(--ink)" opacity=".85"/><text x="${x0 + meetAt() * L}" y="196" text-anchor="middle" class="k">white ring</text>` : ""}
        <text x="${x0 - 13}" y="100" text-anchor="middle">NH₃ (Mr 17)</text><text x="${x0 + L + 13}" y="100" text-anchor="middle">${ACID[st.acid][0]} (Mr ${ACID[st.acid][1]})</text>
        <text x="${x0 - 13}" y="190" text-anchor="middle">cotton wool</text>
        <path class="guide" d="M${x0} 226H${x0 + L}"/><text x="${x0}" y="246">0 cm</text><text x="${x0 + L}" y="246" text-anchor="end">50 cm</text>`;
      if (met && running) { running = false; explain(); }
    }
    function explain() {
      const [name, M, prod] = ACID[st.acid], d = meetAt() * 50;
      res.innerHTML = rows([["ammonia, NH₃", "Mr 17"], [name, `Mr ${M}`], ["ring forms", running ? "…" : `${f1(d)} cm from the ammonia end`], ["speed of NH₃ : speed of " + name, `${(Math.sqrt(M / 17)).toFixed(2)} : 1`]]);
      exp.innerHTML = chips([[running ? "Diffusing…" : "Ring formed"], ["lighter gas travels further"]]) + `<h3>Lower Mr, faster diffusion</h3><p><b>Diffusion</b> is the net movement of particles from a higher to a lower concentration, caused by their random motion. Both gases spread along the tube; where they meet they react to make a white solid, <b>${prod}</b>. The ring forms <b>nearer the ${name} end</b> because ammonia has the <b>lower relative molecular mass</b>, so its molecules move faster and travel further in the same time. A higher temperature makes both diffuse faster, but the ring forms in the same place.</p>` + flow(["lower Mr", "particles move faster", "diffuses faster", "travels further before they meet"]);
    }
    function restart() { t = 0; running = true; explain(); }
    $("[data-go]", lab).addEventListener("click", restart);
    const paint = controls(lab, st, () => { paint(); restart(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { acid: "hcl", T: 20 }); paint(); restart(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); restart(); };
    paint(); explain();
    loop(lab, () => { if (running) t += 0.006; draw(); }, 33);
  }

  labs({ states: statesLab, gas: gasLab, diffusion: diffusionLab });
})();
