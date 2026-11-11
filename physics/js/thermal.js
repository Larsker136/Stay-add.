/* ==========================================================================
   stay add. — Physics topic 2, Thermal physics: the labs
   particles  solid, liquid or gas; for a gas, temperature and volume change
              how fast the particles move and how often they hit the walls
   heating    a heating curve for ice → water → steam, with E = mcΔθ
   cooling    two cans of hot water with different surfaces cool by radiation
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  /* ---------- particle model ---------- */
  function particlesLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { state: "gas", T: 300, V: 100 }, ps = [], hits = [], frame = 0;
    const N = 40, R = 6;
    function box() { const w = 120 + st.V * 3.4; return { x0: 40, y0: 30, x1: 40 + w, y1: 260 }; }
    function seed() {
      const b = box(); ps = [];
      for (let i = 0; i < N; i++) {
        if (st.state === "solid") { const c = i % 8, r = Math.floor(i / 8); ps.push({ hx: 120 + c * 15, hy: 130 + r * 15, x: 120 + c * 15, y: 130 + r * 15, vx: 0, vy: 0 }); }
        else ps.push({ x: b.x0 + R + Math.random() * (b.x1 - b.x0 - 2 * R), y: st.state === "liquid" ? b.y1 - R - Math.random() * 90 : b.y0 + R + Math.random() * (b.y1 - b.y0 - 2 * R), vx: Math.random() - 0.5, vy: Math.random() - 0.5 });
      }
      hits = [];
    }
    function tick() {
      frame++;
      const b = box(), sp = Math.sqrt(st.T / 300) * 2.2;
      for (const p of ps) {
        if (st.state === "solid") { p.x = p.hx + (Math.random() - 0.5) * sp * 1.4; p.y = p.hy + (Math.random() - 0.5) * sp * 1.4; continue; }
        const mag = Math.hypot(p.vx, p.vy) || 1; p.vx = (p.vx / mag) * sp; p.vy = (p.vy / mag) * sp;
        if (st.state === "liquid") { p.vx += (Math.random() - 0.5) * 0.6; p.vy += (Math.random() - 0.5) * 0.6 + 0.08; }
        p.x += p.vx; p.y += p.vy;
        const top = st.state === "liquid" ? b.y1 - 100 : b.y0;
        if (p.x < b.x0 + R || p.x > b.x1 - R) { p.vx = -p.vx; p.x = Math.max(b.x0 + R, Math.min(b.x1 - R, p.x)); hits.push(frame); }
        if (p.y < top + R || p.y > b.y1 - R) { p.vy = -p.vy; p.y = Math.max(top + R, Math.min(b.y1 - R, p.y)); hits.push(frame); }
      }
      while (hits.length && hits[0] < frame - 120) hits.shift();
      draw();
    }
    function draw() {
      const b = box(), area = 2 * (b.x1 - b.x0 + b.y1 - b.y0);
      svg.innerHTML = `<rect class="f lt" x="${b.x0}" y="${b.y0}" width="${b.x1 - b.x0}" height="${b.y1 - b.y0}"/>
        ${st.state === "gas" ? `<rect class="f dk" x="${b.x1}" y="${b.y0 - 10}" width="12" height="${b.y1 - b.y0 + 20}"/><path class="l w5" d="M${b.x1 + 12} 145H640"/>` : ""}
        ${ps.map((p) => `<circle class="f cr dk" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${R}"/>`).join("")}`;
      if (frame % 15 === 0 || frame < 2) {
        const P = st.state === "gas" ? (hits.length / area) * 1000 : 0;
        res.innerHTML = rows([["state", st.state], ["temperature", `${st.T} K = ${st.T - 273} °C`], ...(st.state === "gas" ? [["volume", `${st.V} units`], ["wall hits per second (pressure)", f1(P)]] : [["particles", st.state === "solid" ? "vibrate about fixed positions" : "slide past each other"]])]);
      }
    }
    function explain() {
      const T = {
        solid: "<h3>Solid: fixed positions, vibrating</h3><p>Particles are <b>close together</b> in a regular pattern, held by strong forces. They only <b>vibrate</b> about fixed positions — so a solid has a fixed shape and volume. Heating makes them vibrate more.</p>",
        liquid: "<h3>Liquid: close together, moving past each other</h3><p>Particles are still <b>close together</b> but have no fixed pattern; they <b>slide past each other</b>. A liquid has a fixed volume but takes the shape of its container.</p>",
        gas: `<h3>Gas: far apart, fast and random</h3><p>Particles are <b>far apart</b> and move <b>randomly at high speed</b>. Each collision with the wall exerts a force; the force per unit area is the gas <b>pressure</b>. ${st.T > 400 ? "At this higher temperature they move faster and hit the walls harder and more often, so the pressure rises." : ""} ${st.V < 60 ? "In a smaller volume they hit the walls more often: pressure rises (Boyle’s law, pV = constant at constant temperature)." : ""}</p>`
      }[st.state];
      exp.innerHTML = chips([[st.state.charAt(0).toUpperCase() + st.state.slice(1)], [`${st.T} K`]]) + T + flow(st.state === "gas" ? ["higher temperature", "faster particles", "more frequent, harder collisions", "higher pressure"] : ["heat", "more kinetic energy", "melting / boiling", "change of state"]);
    }
    const paint = controls(lab, st, (k) => { paint(); if (k === "state") seed(); explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { state: "gas", T: 300, V: 100 }); paint(); seed(); explain(); });
    lab.applyState = (s) => { const re = s.state && s.state !== st.state; Object.assign(st, s); paint(); if (re) seed(); explain(); };
    paint(); seed(); explain(); draw();
    loop(lab, tick, 25);
  }

  /* ---------- heating curve ---------- */
  function heatingLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { P: 500, m: 0.5 };
    const C_ICE = 2100, C_W = 4200, C_S = 2000, LF = 334000, LV = 2260000;
    function curve() {
      // time stamps for each stage, starting from ice at −20 °C, ending as steam at 120 °C
      const e1 = st.m * C_ICE * 20, e2 = st.m * LF, e3 = st.m * C_W * 100, e4 = st.m * LV, e5 = st.m * C_S * 20, E = [e1, e2, e3, e4, e5];
      const t = []; let acc = 0; for (const e of E) { acc += e / st.P; t.push(acc); }
      return { t, E };
    }
    function draw() {
      const { t, E } = curve(), T = t[4], X = (s) => 60 + (s / T) * 540, Y = (c) => 230 - ((c + 20) / 140) * 200;
      const pts = [[0, -20], [t[0], 0], [t[1], 0], [t[2], 100], [t[3], 100], [t[4], 120]];
      const d = pts.map(([s, c], i) => `${i ? "L" : "M"}${X(s).toFixed(1)} ${Y(c).toFixed(1)}`).join("");
      svg.innerHTML = `<path class="gl" d="M60 ${Y(0)}H600M60 ${Y(100)}H600"/><path class="ax" d="M60 20V230H604"/><path class="plot" style="stroke:var(--c-phys)" d="${d}"/>
        <g text-anchor="end"><text x="54" y="${Y(-20) + 4}">−20</text><text x="54" y="${Y(0) + 4}">0</text><text x="54" y="${Y(100) + 4}">100</text></g>
        <text x="${(X(t[0]) + X(t[1])) / 2}" y="${Y(0) + 18}" text-anchor="middle" class="tc cb">melting</text><text x="${(X(t[2]) + X(t[3])) / 2}" y="${Y(100) - 8}" text-anchor="middle" class="tc cr">boiling</text>
        <text x="${(X(t[1]) + X(t[2])) / 2 - 20}" y="${Y(50)}" text-anchor="end">water warms</text>
        <text x="60" y="14" class="k">temperature / °C</text><text x="600" y="250" text-anchor="end">time / s (total ${Math.round(T)} s)</text>`;
      res.innerHTML = rows([["warm ice to 0 °C (mcΔθ)", `${Math.round(E[0] / 1000)} kJ`], ["melt at 0 °C", `${Math.round(E[1] / 1000)} kJ`], ["warm water 0 → 100 °C", `${Math.round(E[2] / 1000)} kJ`], ["boil at 100 °C", `${Math.round(E[3] / 1000)} kJ`], ["time to boil away", `${Math.round(t[3])} s`]]);
      exp.innerHTML = chips([["Heating curve"], [`${st.P} W, ${st.m} kg`]]) + `<h3>Flat parts: energy changes the state, not the temperature</h3><p>While ice melts and water boils, the temperature stays constant — the energy supplied breaks the forces between particles instead of making them move faster. On the sloping parts, ΔE = m c Δθ: water’s <b>specific heat capacity</b> c = 4200 J/(kg °C), so it takes 4200 J to warm 1 kg by 1 °C. Boiling takes far longer than melting.</p>` + flow(["energy in", "sloping: temperature rises (ΔE = mcΔθ)", "flat: change of state", "melting point · boiling point"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { P: 500, m: 0.5 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- cooling by radiation ---------- */
  function coolingLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const SURF = { "matt black": 0.95, "dull white": 0.6, "shiny silver": 0.1 };
    let st = { a: "matt black", b: "shiny silver", room: 20 };
    function draw() {
      const X = (t) => 60 + (t / 30) * 540, Y = (c) => 230 - (c / 90) * 200;
      const line = (e) => { let d = ""; for (let t = 0; t <= 30; t += 0.5) { const c = st.room + (80 - st.room) * Math.exp(-0.02 * (0.4 + e) * t * 2); d += `${t ? "L" : "M"}${X(t).toFixed(1)} ${Y(c).toFixed(1)}`; } return d; };
      const end = (e) => st.room + (80 - st.room) * Math.exp(-0.02 * (0.4 + e) * 30 * 2);
      svg.innerHTML = `<path class="gl" d="M60 ${Y(st.room)}H600"/><path class="ax" d="M60 20V230H604"/>
        <path class="l w3" style="--fc:var(--ink)" d="${line(SURF[st.a])}"/><path class="l w3 dash" style="--fc:var(--c-phys)" d="${line(SURF[st.b])}"/>
        <text x="600" y="${Y(end(SURF[st.a])) - 6}" text-anchor="end" class="k">can A: ${st.a}</text><text x="600" y="${Y(end(SURF[st.b])) - 6}" text-anchor="end" class="tc cb">can B: ${st.b}</text>
        <text x="60" y="14" class="k">temperature / °C</text><text x="600" y="250" text-anchor="end">time / min</text><text x="66" y="${Y(st.room) - 4}">room ${st.room} °C</text>`;
      res.innerHTML = rows([["can A after 30 min", `${f1(end(SURF[st.a]))} °C`], ["can B after 30 min", `${f1(end(SURF[st.b]))} °C`], ["faster cooler", SURF[st.a] > SURF[st.b] ? "A" : SURF[st.a] < SURF[st.b] ? "B" : "equal"]]);
      exp.innerHTML = chips([["Infrared radiation"]]) + `<h3>Dull black surfaces are the best emitters</h3><p>Every object emits <b>infrared radiation</b>; hotter objects emit more. <b>Dull, black</b> surfaces are good emitters and good absorbers; <b>shiny, silver/white</b> surfaces are poor emitters and good reflectors. So the black can cools fastest. Radiation needs no medium — it can travel through a vacuum. A fair test keeps the same volume, starting temperature and room.</p>` + flow(["hot surface", "emits infrared", "dull black: emits more", "cools faster"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { a: "matt black", b: "shiny silver", room: 20 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ particles: particlesLab, heating: heatingLab, cooling: coolingLab });
})();
