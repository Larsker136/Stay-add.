/* ==========================================================================
   stay add. — Physics topic 4, Electricity and magnetism: the labs
   magnet     field lines traced around one bar magnet or two (attracting or
              repelling)
   iv         the current through a resistor, a filament lamp or a diode as the
              p.d. changes, with its I–V graph
   circuit    two resistors in series or in parallel, or a thermistor in a
              potential divider; meter readings drawn on the circuit
   fuse       choose the right fuse for an appliance
   induction  a magnet pushed into a coil: speed, direction and coil turns
   transformer  turns ratio, step-up or step-down, and power in = power out
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString(), f2 = (n) => (Math.round(n * 100) / 100).toString(), f3 = (n) => (Math.round(n * 1000) / 1000).toString();

  /* ---------- magnetic field lines ---------- */
  function magnetLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { setup: "one" };
    function poles() {
      // each bar magnet = a north pole (+) and a south pole (−)
      if (st.setup === "one") return { bars: [[220, 420, "NS"]], p: [[220, 150, 1], [420, 150, -1]] };
      if (st.setup === "attract") return { bars: [[60, 240, "NS"], [400, 580, "NS"]], p: [[60, 150, 1], [240, 150, -1], [400, 150, 1], [580, 150, -1]] };
      return { bars: [[60, 240, "SN"], [400, 580, "NS"]], p: [[60, 150, -1], [240, 150, 1], [400, 150, 1], [580, 150, -1]] };
    }
    function field(x, y, P) { let bx = 0, by = 0; for (const [px, py, q] of P) { const dx = x - px, dy = y - py, r2 = dx * dx + dy * dy + 30, r3 = r2 * Math.sqrt(r2); bx += (q * dx) / r3; by += (q * dy) / r3; } return [bx, by]; }
    function draw() {
      const { bars, p } = poles(); let lines = "";
      for (const [nx, ny, q] of p) {
        if (q < 0) continue;
        for (let k = 0; k < 14; k++) {
          const a = (k / 14) * Math.PI * 2; let x = nx + Math.cos(a) * 10, y = ny + Math.sin(a) * 10, d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
          for (let s = 0; s < 500; s++) {
            const [bx, by] = field(x, y, p), m = Math.hypot(bx, by) || 1; x += (bx / m) * 3; y += (by / m) * 3;
            d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
            if (x < -20 || x > 660 || y < -20 || y > 320 || p.some(([sx, sy, sq]) => sq < 0 && Math.hypot(x - sx, y - sy) < 9)) break;
          }
          lines += `<path class="l" style="--fc:var(--violet);--lw:1.3" d="${d}"/>`;
        }
      }
      const bar = ([x0, x1, o]) => `<rect class="f ${o[0] === "N" ? "cr" : "cb"} dk" x="${x0 - 10}" y="136" width="${(x1 - x0) / 2 + 10}" height="28"/><rect class="f ${o[0] === "N" ? "cb" : "cr"} dk" x="${(x0 + x1) / 2}" y="136" width="${(x1 - x0) / 2 + 10}" height="28"/><text x="${x0 + 6}" y="155" class="k">${o[0]}</text><text x="${x1 - 6}" y="155" text-anchor="end" class="k">${o[1]}</text>`;
      svg.innerHTML = lines + bars.map(bar).join("");
      res.innerHTML = rows([["arrangement", { one: "one bar magnet", attract: "N facing S", repel: "N facing N" }[st.setup]], ["force between them", st.setup === "one" ? "—" : st.setup === "attract" ? "attraction" : "repulsion"]]);
      exp.innerHTML = chips([[st.setup === "repel" ? "Like poles repel" : st.setup === "attract" ? "Unlike poles attract" : "Field of a bar magnet"]]) + `<h3>${st.setup === "one" ? "Field lines run from north to south" : st.setup === "attract" ? "Lines link the facing N and S poles" : "Lines push apart between two N poles — a neutral point in the middle"}</h3><p>A <b>magnetic field</b> is a region where a magnetic pole feels a force. Field lines show its direction (from <b>N to S</b>, the way a compass needle points) and their spacing shows its strength — strongest where they are closest, at the poles. Plot them with a compass or iron filings.</p>` + flow(["like poles repel", "unlike poles attract", "field lines N → S", "closer lines = stronger field"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.setup = "one"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- I–V characteristics ---------- */
  function ivLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { comp: "resistor", V: 6 };
    const I = (c, V) => c === "resistor" ? V / 20 : c === "lamp" ? Math.sign(V) * 0.12 * Math.sqrt(Math.abs(V)) : V > 0.6 ? (V - 0.6) * 0.25 : 0;
    function draw() {
      const X = (v) => 320 + v * 25, Y = (i) => 150 - i * 300;
      let d = ""; for (let v = -12; v <= 12; v += 0.2) d += `${v === -12 ? "M" : "L"}${X(v).toFixed(1)} ${Y(Math.min(0.42, I(st.comp, v))).toFixed(1)}`;
      const i = I(st.comp, st.V);
      svg.innerHTML = `<path class="ax" d="M20 150H620M320 14V286"/><path class="plot" style="stroke:var(--c-phys)" d="${d}"/>
        <circle class="pt" cx="${X(st.V)}" cy="${Y(Math.min(0.42, i))}" r="5"/><text x="616" y="142" text-anchor="end">V / V</text><text x="326" y="22">I / A</text>`;
      const R = i ? st.V / i : Infinity;
      res.innerHTML = rows([["p.d. V", `${st.V} V`], ["current I", `${f3(i)} A`], ["resistance R = V / I", isFinite(R) ? `${f1(R)} Ω` : "very large"]]);
      const T = {
        resistor: "<h3>A straight line through the origin</h3><p>For a <b>resistor</b> at constant temperature (an <b>ohmic</b> conductor) current is proportional to p.d.: the resistance is constant. R = V / I.</p>",
        lamp: "<h3>A curve that flattens</h3><p>In a <b>filament lamp</b> a bigger current heats the filament; the metal ions vibrate more, so the <b>resistance increases</b> and the current rises more slowly.</p>",
        diode: "<h3>Current only one way</h3><p>A <b>diode</b> lets current flow in one direction only (above about 0.6 V); in reverse its resistance is very high and almost no current flows. Used to convert a.c. to d.c. (rectification).</p>"
      }[st.comp];
      exp.innerHTML = chips([[st.comp]]) + T + flow(["set the p.d.", "measure the current", "R = V / I", "plot I against V"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { comp: "resistor", V: 6 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- series, parallel, potential divider ---------- */
  function circuitLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { kind: "series", V: 12, R1: 4, R2: 8, temp: 25 };
    const meter = (x, y, l, v) => `<circle class="comp" cx="${x}" cy="${y}" r="14"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="k">${l}</text><text x="${x}" y="${y + 30}" text-anchor="middle" class="tc cb">${v}</text>`;
    const cell = (x, y) => `<path class="wire" d="M${x - 10} ${y}H${x - 4}M${x + 4} ${y}H${x + 10}"/><path class="l w3" style="--fc:var(--ink)" d="M${x - 4} ${y - 16}V${y + 16}"/><path class="l w5" style="--fc:var(--ink)" d="M${x + 4} ${y - 8}V${y + 8}"/>`;
    function draw() {
      let R2 = st.R2;
      if (st.kind === "divider") R2 = 8 * Math.exp(-(st.temp - 25) / 25);   // thermistor: resistance falls as it warms
      if (st.kind === "parallel") {
        const I1 = st.V / st.R1, I2 = st.V / R2, I = I1 + I2, Rt = 1 / (1 / st.R1 + 1 / R2);
        svg.innerHTML = `<path class="wire" d="M60 60H580V240H60ZM200 60V120M200 180V240M440 60V120M440 180V240"/>${cell(320, 240)}
          <path class="wire" d="M200 120V126M200 174V180M440 120V126M440 174V180"/><rect class="comp" x="188" y="126" width="24" height="48" rx="2"/><text x="222" y="154" class="k">R₁ ${st.R1} Ω</text>
          <rect class="comp" x="428" y="126" width="24" height="48" rx="2"/><text x="462" y="154" class="k">R₂ ${f1(R2)} Ω</text>
          ${meter(110, 60, "A", f2(I) + " A")}${meter(200, 100, "A", f2(I1) + " A")}${meter(440, 100, "A", f2(I2) + " A")}
          <text x="320" y="275" text-anchor="middle">supply ${st.V} V</text>`;
        res.innerHTML = rows([["current in R₁", `${f2(I1)} A`], ["current in R₂", `${f2(I2)} A`], ["total current", `${f2(I)} A`], ["p.d. across each", `${st.V} V`], ["combined resistance", `${f2(Rt)} Ω (less than either)`]]);
        exp.innerHTML = chips([["Parallel"]]) + `<h3>The current splits; the p.d. is the same</h3><p>In <b>parallel</b>, each branch has the full supply p.d., and the currents in the branches <b>add up</b> to the current from the supply. The combined resistance is <b>less than the smallest</b> resistor <span class="tag-s">Supp.</span>: 1/R = 1/R₁ + 1/R₂. Lights in a house are wired in parallel so each can be switched on its own and gets the full voltage.</p>` + flow(["same p.d. across each branch", "I = V / R in each", "currents add", "lower total resistance"]);
      } else {
        const Rt = st.R1 + R2, I = st.V / Rt, V1 = I * st.R1, V2 = I * R2;
        svg.innerHTML = `<path class="wire" d="M60 80H580V240H60Z"/>${cell(320, 240)}
          <rect class="comp" x="170" y="68" width="70" height="24" rx="2"/><text x="205" y="60" text-anchor="middle" class="k">R₁ ${st.R1} Ω</text>
          <rect class="comp" x="390" y="68" width="70" height="24" rx="2"/><text x="425" y="60" text-anchor="middle" class="k">${st.kind === "divider" ? "thermistor" : "R₂"} ${f1(R2)} Ω</text>
          ${st.kind === "divider" ? `<path class="l" d="M396 92L454 68"/>` : ""}
          ${meter(110, 80, "A", f2(I) + " A")}
          <path class="wire" d="M170 80V130H240V80"/>${meter(205, 140, "V", f2(V1) + " V")}
          <path class="wire" d="M390 80V130H460V80"/>${meter(425, 140, "V", f2(V2) + " V")}
          <text x="320" y="275" text-anchor="middle">supply ${st.V} V${st.kind === "divider" ? ` · thermistor at ${st.temp} °C` : ""}</text>`;
        res.innerHTML = rows([["total resistance R₁ + R₂", `${f2(Rt)} Ω`], ["current (same everywhere)", `${f2(I)} A`], ["p.d. across R₁", `${f2(V1)} V`], [`p.d. across ${st.kind === "divider" ? "thermistor" : "R₂"}`, `${f2(V2)} V`]]);
        exp.innerHTML = st.kind === "divider"
          ? chips([["Potential divider"], [`${st.temp} °C`]]) + `<h3>Warmer thermistor → smaller share of the p.d.</h3><p>A <b>thermistor</b>’s resistance <b>falls</b> as its temperature rises. In a <b>potential divider</b> the supply p.d. is shared in the ratio of the resistances (V₁/V₂ = R₁/R₂), so as it warms the p.d. across it drops and the p.d. across R₁ rises — used to switch on a fan or a heater automatically <span class="tag-s">Supp.</span>. An LDR does the same with light.</p>` + flow(["temperature rises", "thermistor resistance falls", "its share of the p.d. falls", "output changes"])
          : chips([["Series"]]) + `<h3>One current; the p.d. is shared</h3><p>In <b>series</b> the same current flows through every component. The total resistance is R₁ + R₂, and the supply p.d. is <b>shared</b>: the bigger resistor gets the bigger share (V = IR). If one component breaks, everything stops.</p>` + flow(["R total = R₁ + R₂", "I = V / R total", "same current everywhere", "p.d.s add up to the supply"]);
      }
      $$("[data-for]", lab).forEach((g) => (g.hidden = g.dataset.for === "fixed" ? st.kind === "divider" : st.kind !== "divider"));
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { kind: "series", V: 12, R1: 4, R2: 8, temp: 25 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- fuses ---------- */
  function fuseLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), svg = $("[data-svg]", lab);
    const APP = { lamp: 60, laptop: 90, television: 200, "hair dryer": 1200, kettle: 2800, "washing machine": 2000 };
    let st = { app: "kettle", fuse: 13, V: 230 };
    function draw() {
      const P = APP[st.app], I = P / st.V, ok = st.fuse >= I, best = [3, 5, 13].find((f) => f >= I) || "none";
      svg.innerHTML = `<rect class="f lt" x="60" y="60" width="200" height="140" rx="14"/><text x="160" y="140" text-anchor="middle" class="k big">${st.app}</text><text x="160" y="160" text-anchor="middle">${P} W</text>
        <path class="wire" d="M260 110H340M260 150H600"/><rect class="f ${ok ? (st.fuse - I > 8 ? "ca" : "cg") : "cr"} dk" x="340" y="98" width="80" height="24" rx="12"/><text x="380" y="114" text-anchor="middle" class="k">${st.fuse} A fuse</text><path class="wire" d="M420 110H600"/>
        <text x="610" y="114">live</text><text x="610" y="154">neutral</text><path class="l cg dash" d="M160 200V240H600"/><text x="610" y="244">earth</text>
        ${ok ? "" : `<path class="l cr w3" d="M350 92L410 128M410 92L350 128"/>`}`;
      res.innerHTML = rows([["power P", `${P} W`], ["current I = P / V", `${f2(I)} A`], ["fuse chosen", `${st.fuse} A`], ["best fuse", `${best} A`]]);
      const verdict = !ok ? "The fuse melts" : st.fuse === best ? "The right fuse" : "Works, but too high to protect it";
      exp.innerHTML = chips([[verdict, !ok ? "down" : st.fuse === best ? "up" : "warn"]]) + `<h3>${verdict}</h3><p>Normal current is ${f2(I)} A. A <b>fuse</b> melts and breaks the circuit if the current gets too big, protecting the wiring from overheating and fire. Choose the rating <b>just above</b> the normal current. ${ok && st.fuse !== best ? "A much higher fuse would let a dangerous fault current flow without melting." : ""} The <b>earth wire</b> connects a metal case to earth: if the live wire touches the case, a large current flows to earth and the fuse melts, so the case can’t give a shock.</p>` + flow(["I = P / V", "pick the fuse just above I", "fault → large current", "fuse melts, circuit broken"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { app: "kettle", fuse: 13, V: 230 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- electromagnetic induction ---------- */
  function inductionLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { speed: 2, turns: 20, pole: "N" }, x = 0, dir = 1, emf = 0;
    function tick() {
      const vx = dir * st.speed * 1.6; x += vx; if (x > 200 || x < 0) { dir = -dir; x = Math.max(0, Math.min(200, x)); }
      const inCoil = x > 60 && x < 200 ? 1 : x > 20 ? 0.5 : 0.1;
      emf = (st.pole === "N" ? 1 : -1) * -vx * st.turns * 0.012 * inCoil; draw();
    }
    function draw() {
      const mx = 40 + x;
      svg.innerHTML = `<rect class="f cr dk" x="${mx}" y="130" width="60" height="30"/><rect class="f cb dk" x="${mx - 60}" y="130" width="60" height="30"/><text x="${mx + 50}" y="150" class="k" text-anchor="end">${st.pole}</text><text x="${mx - 50}" y="150" class="k">${st.pole === "N" ? "S" : "N"}</text>
        ${Array.from({ length: Math.min(24, Math.round(st.turns / 2)) }, (_, k) => `<ellipse class="l" style="--fc:var(--amber);--lw:2" cx="${300 + k * 9}" cy="145" rx="5" ry="34"/>`).join("")}
        <path class="wire" d="M300 111V60H600V200M${300 + Math.min(24, Math.round(st.turns / 2)) * 9} 179V240H600V230"/>
        <circle class="comp" cx="600" cy="215" r="24"/><path class="l w3" style="--fc:var(--red)" d="M600 225L${600 + Math.max(-1, Math.min(1, emf / 3)) * 18} 200"/><text x="600" y="258" text-anchor="middle">${f1(emf)} (meter)</text>`;
      res.innerHTML = rows([["magnet speed", st.speed], ["turns on coil", st.turns], ["induced e.m.f.", f1(emf) + " (arbitrary units)"]]);
    }
    function explain() {
      exp.innerHTML = chips([["Induction"]]) + `<h3>A changing magnetic field induces an e.m.f.</h3><p>Moving a magnet into or out of a coil changes the magnetic field through it and <b>induces an e.m.f.</b> (and a current if the circuit is complete). The e.m.f. is bigger with a <b>faster</b> movement, <b>more turns</b> and a <b>stronger</b> magnet. Reverse the movement or the pole and the meter swings the <b>other way</b>; with no movement there is no e.m.f. <span class="tag-s">Supp.</span> The induced current makes a field that <b>opposes</b> the change that caused it.</p>` + flow(["magnet moves relative to coil", "field through coil changes", "e.m.f. induced", "faster, more turns, stronger → bigger"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { speed: 2, turns: 20, pole: "N" }); paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, tick, 30);
  }

  /* ---------- transformer ---------- */
  function transformerLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { Vp: 230, Np: 1000, Ns: 50, Ip: 0.1 };
    function draw() {
      const Vs = (st.Vp * st.Ns) / st.Np, Is = (st.Vp * st.Ip) / Vs, up = st.Ns > st.Np;
      const coil = (x, n) => Array.from({ length: Math.max(2, Math.min(16, Math.round(n / 80))) }, (_, k) => `<path class="l" style="--fc:var(--amber);--lw:2.5" d="M${x - 20} ${80 + k * 9}H${x + 20}"/>`).join("");
      svg.innerHTML = `<path class="f lt" d="M200 50H440V250H200ZM240 90V210H400V90Z" style="fill-rule:evenodd"/><text x="320" y="44" text-anchor="middle">soft-iron core</text>
        ${coil(220, st.Np)}${coil(420, st.Ns)}
        <path class="wire" d="M200 80H80V220H200"/><path class="wire" d="M440 80H560V220H440"/>
        <text x="80" y="150" text-anchor="middle" class="k">${st.Vp} V a.c.</text><text x="560" y="150" text-anchor="middle" class="k">${f1(Vs)} V</text>
        <text x="220" y="272" text-anchor="middle">primary · ${st.Np} turns</text><text x="420" y="272" text-anchor="middle">secondary · ${st.Ns} turns</text>`;
      res.innerHTML = rows([["Vs = Vp × Ns / Np", `${f1(Vs)} V`], ["type", up ? "step-up" : st.Ns === st.Np ? "1 : 1" : "step-down"], ["power in = Vp Ip", `${f1(st.Vp * st.Ip)} W`], ["Is (100 % efficient)", `${f2(Is)} A`]]);
      exp.innerHTML = chips([[up ? "Step-up" : "Step-down"]]) + `<h3>The voltage ratio equals the turns ratio</h3><p>An <b>alternating</b> current in the primary coil makes a changing magnetic field in the iron core, which induces an alternating e.m.f. in the secondary coil. Vp / Vs = Np / Ns. <span class="tag-s">Supp.</span> For a 100 % efficient transformer, power in = power out: Vp Ip = Vs Is — so stepping the voltage up steps the current down. Power stations step up to very high voltage for transmission because a <b>smaller current</b> wastes less energy heating the cables (P = I²R).</p>` + flow(["a.c. in primary", "changing field in the core", "e.m.f. induced in secondary", "Vs / Vp = Ns / Np"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { Vp: 230, Np: 1000, Ns: 50, Ip: 0.1 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ magnet: magnetLab, iv: ivLab, circuit: circuitLab, fuse: fuseLab, induction: inductionLab, transformer: transformerLab });
})();
