/* ==========================================================================
   stay add. — Chemistry topic 6, Chemical reactions: the labs
   rate         marble chips and hydrochloric acid: volume of CO₂ against time for
                concentration, temperature and particle size, against a dashed control
   equilibrium  the Haber process: temperature, pressure and a catalyst change the
                yield of ammonia and the rate
   redox        six redox reactions with oxidation numbers, what is oxidised and
                reduced, and the oxidising and reducing agents
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  /* ---------- rate of reaction ---------- */
  function rateLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const SIZE = { large: [1, "large chips"], small: [2.2, "small chips"], powder: [6, "powder"] }, VMAX = 96, TAU = 60;
    let st = { conc: 1, T: 25, size: "large" }, clock = 0;
    const k = (s) => s.conc * Math.pow(2, (s.T - 25) / 10) * SIZE[s.size][0];
    const V = (s, t) => VMAX * (1 - Math.exp((-k(s) * t) / TAU));
    const X = (t) => 50 + (t / 300) * 370, Y = (v) => 250 - (v / 110) * 225;
    const path = (s) => Array.from({ length: 61 }, (_, i) => `${i ? "L" : "M"}${X(i * 5).toFixed(1)} ${Y(V(s, i * 5)).toFixed(1)}`).join("");
    function draw() {
      const t = clock % 300, v = V(st, t), r0 = (VMAX * k(st)) / TAU, tan = Math.min(300, 60 / Math.max(r0, 0.01) * 1.5);
      svg.innerHTML = `<path class="gl" d="M50 ${Y(25)}H420M50 ${Y(50)}H420M50 ${Y(75)}H420M50 ${Y(100)}H420"/><path class="ax" d="M50 20V250H424"/>
        <g text-anchor="end"><text x="44" y="${Y(0) + 4}">0</text><text x="44" y="${Y(50) + 4}">50</text><text x="44" y="${Y(100) + 4}">100</text></g>
        <g text-anchor="middle"><text x="${X(0)}" y="266">0</text><text x="${X(100)}" y="266">100</text><text x="${X(200)}" y="266">200</text><text x="${X(300)}" y="266">300</text></g>
        <text x="50" y="14">volume of CO₂ / cm³</text><text x="424" y="284" text-anchor="end">time / s</text>
        <path class="plot" style="stroke:var(--ink-3);stroke-dasharray:5 4" d="${path({ conc: 1, T: 25, size: "large" })}"/><path class="plot" d="${path(st)}"/>
        <path class="guide" d="M${X(0)} ${Y(0)}L${X(tan)} ${Y(r0 * tan)}"/><circle class="pt" cx="${X(t)}" cy="${Y(v)}" r="5"/>
        <text x="${X(300)}" y="${Y(VMAX) - 8}" text-anchor="end">same final volume: the marble runs out</text>
        <rect class="glass" x="460" y="60" width="150" height="34" rx="4"/><rect class="liq" style="--lc:var(--c-chem)" x="462" y="62" width="${(v / VMAX) * 120}" height="30"/><rect class="f dk" x="${462 + (v / VMAX) * 120}" y="58" width="6" height="38"/><path class="l w3" d="M${468 + (v / VMAX) * 120} 77H${560 + (v / VMAX) * 40}"/>
        <text x="535" y="50" text-anchor="middle">gas syringe: ${Math.round(v)} cm³</text>
        <path class="glass" d="M500 150V250H580V150"/><rect class="liq" style="--lc:var(--blue)" x="502" y="190" width="76" height="58"/><path class="wire" d="M460 77H444V128H540V152"/>
        ${st.size === "powder" ? Array.from({ length: 40 }, (_, i) => `<circle class="f dk" cx="${508 + (i * 13) % 64}" cy="${236 + (i % 4) * 3}" r="1.6"/>`).join("") : Array.from({ length: st.size === "small" ? 9 : 4 }, (_, i) => `<rect class="f dk" x="${510 + i * (st.size === "small" ? 7 : 16)}" y="${st.size === "small" ? 236 : 228}" width="${st.size === "small" ? 6 : 13}" height="${st.size === "small" ? 6 : 13}" rx="2"/>`).join("")}
        ${v < VMAX - 1 ? Array.from({ length: 6 }, (_, i) => `<circle class="shell" cx="${515 + i * 11}" cy="${225 - ((clock * 3 * k(st) + i * 17) % 34)}" r="2.5"/>`).join("") : ""}
        <text x="540" y="270" text-anchor="middle">marble + HCl</text>`;
    }
    function explain() {
      const r0 = (VMAX * k(st)) / TAU, done = (3 * TAU) / k(st), rel = k(st);
      res.innerHTML = rows([["acid concentration", `${st.conc} mol/dm³`], ["temperature", `${st.T} °C`], ["marble", SIZE[st.size][1]], ["initial rate (gradient)", `${f1(r0)} cm³/s`], ["reaction about finished after", `${Math.round(done)} s`], ["rate compared with the dashed control", `× ${f1(rel)}`]]);
      const why = [];
      if (st.conc !== 1) why.push(st.conc > 1 ? "<b>Higher concentration</b>: more acid particles in the same volume, so <b>more frequent collisions</b>." : "<b>Lower concentration</b>: fewer acid particles per volume, so collisions are less frequent.");
      if (st.T !== 25) why.push(st.T > 25 ? "<b>Higher temperature</b>: particles move faster, so they collide more often, and <b>more collisions have energy ≥ the activation energy</b>." : "<b>Lower temperature</b>: slower particles, fewer collisions with enough energy.");
      if (st.size !== "large") why.push("<b>Smaller pieces</b>: a larger <b>surface area</b> for the same mass, so more particles are exposed to the acid and collisions are more frequent.");
      exp.innerHTML = chips([[rel > 1.05 ? "Faster" : rel < 0.95 ? "Slower" : "Control"], [`${f1(r0)} cm³/s at the start`]]) + `<h3>Steeper curve = faster reaction</h3><p>The rate is fastest at the start, when there are most reacting particles, and falls to zero when the marble is used up. The <b>gradient</b> of the curve is the rate. ${why.join(" ") || "Change a condition to compare with the dashed control: 1 mol/dm³ acid, 25 °C, large chips."} The final volume is the same, because the same mass of marble reacts in excess acid.</p>` + flow(["more particles / faster / more surface", "more frequent collisions", "more successful collisions per second", "faster rate"]);
    }
    const paint = controls(lab, st, () => { paint(); clock = 0; explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { conc: 1, T: 25, size: "large" }); clock = 0; paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); clock = 0; paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { clock += 2; draw(); }, 40);
  }

  /* ---------- the Haber process ---------- */
  function equilibriumLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { T: 450, P: 200, cat: true };
    const yld = (T, P) => 100 / (1 + Math.exp((T - (330 + 70 * Math.log2(P / 100))) / 55));
    const rate = () => Math.pow(2, (st.T - 450) / 50) * (st.P / 200) * (st.cat ? 1 : 0.08);
    function draw() {
      const X = (T) => 50 + ((T - 300) / 250) * 330, Y = (y) => 250 - y * 2.2;
      const curve = (P) => Array.from({ length: 26 }, (_, i) => { const T = 300 + i * 10; return `${i ? "L" : "M"}${X(T).toFixed(1)} ${Y(yld(T, P)).toFixed(1)}`; }).join("");
      const y = yld(st.T, st.P), r = rate();
      svg.innerHTML = `<path class="ax" d="M50 20V250H384"/><text x="50" y="14">% ammonia at equilibrium</text><text x="384" y="282" text-anchor="end">temperature / °C</text>
        <g text-anchor="end"><text x="44" y="${Y(0) + 4}">0</text><text x="44" y="${Y(50) + 4}">50</text><text x="44" y="${Y(100) + 4}">100</text></g>
        <g text-anchor="middle"><text x="${X(300)}" y="266">300</text><text x="${X(400)}" y="266">400</text><text x="${X(500)}" y="266">500</text></g>
        ${[100, 200, 300].map((P) => `<path class="plot" style="stroke:${P === st.P ? "var(--c-chem)" : "var(--ink-4)"}" d="${curve(P)}"/><text x="${X(550) + 4}" y="${Y(yld(550, P)) + 4}" style="font-size:10px">${P} atm</text>`).join("")}
        <rect x="${X(430)}" y="20" width="${X(470) - X(430)}" height="230" fill="var(--c-chem)" opacity=".08"/><text x="${X(450)}" y="34" text-anchor="middle" style="font-size:10px">used</text>
        <circle class="pt" cx="${X(st.T)}" cy="${Y(y)}" r="6"/>
        <text x="440" y="60" class="k">yield of NH₃</text><rect class="f lt" x="440" y="70" width="170" height="18" rx="4"/><rect class="f cg dk" x="440" y="70" width="${1.7 * y}" height="18" rx="4"/><text x="614" y="84" text-anchor="end" class="k">${Math.round(y)}%</text>
        <text x="440" y="130" class="k">rate</text><rect class="f lt" x="440" y="140" width="170" height="18" rx="4"/><rect class="f ca dk" x="440" y="140" width="${Math.min(170, 170 * r / 3)}" height="18" rx="4"/><text x="614" y="154" text-anchor="end" class="k">× ${f1(r)}</text>
        <text x="440" y="210" class="mono-b">N₂ + 3H₂ ⇌ 2NH₃</text><text x="440" y="230" style="font-size:11px">forward reaction exothermic</text>`;
      res.innerHTML = rows([["temperature", `${st.T} °C`], ["pressure", `${st.P} atm`], ["iron catalyst", st.cat ? "yes" : "no"], ["ammonia at equilibrium", `${Math.round(y)}%`], ["rate compared with 450 °C, 200 atm", `× ${f1(r)}`]]);
      const notes = [];
      if (st.T < 430) notes.push("A <b>lower temperature</b> gives a higher yield (the forward reaction is exothermic), but the rate is too slow.");
      if (st.T > 470) notes.push("A <b>higher temperature</b> is faster, but the equilibrium shifts left and the yield falls.");
      if (st.P > 200) notes.push("A <b>higher pressure</b> shifts the equilibrium to the side with fewer gas molecules (4 → 2), raising the yield, but the plant is more expensive and dangerous.");
      if (st.P < 200) notes.push("A <b>lower pressure</b> favours the side with more gas molecules, so less ammonia.");
      if (!st.cat) notes.push("Without the <b>iron catalyst</b> equilibrium is reached far more slowly; a catalyst does not change the yield.");
      exp.innerHTML = chips([[`${Math.round(y)}% NH₃`], [st.T >= 430 && st.T <= 470 && st.P === 200 && st.cat ? "industrial compromise" : "try 450 °C, 200 atm", st.T >= 430 && st.T <= 470 && st.P === 200 && st.cat ? "up" : ""]]) + `<h3>A compromise between yield and rate</h3><p>The Haber process makes ammonia from <b>nitrogen</b> (from the air) and <b>hydrogen</b> (from methane). It is <b>reversible</b> and reaches <b>dynamic equilibrium</b>: the forward and reverse reactions go at the same rate, so the concentrations stay constant. ${notes.join(" ") || "Industry uses about 450 °C, 200 atm and an iron catalyst: a fast enough rate with a reasonable yield, and unreacted gases are recycled."}</p>` + flow(["change a condition", "equilibrium shifts to oppose it", "yield changes", "balance against rate and cost"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { T: 450, P: 200, cat: true }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- redox ---------- */
  function redoxLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // species [formula, oxidation number of the element that changes, side], oxidised [from, to], reduced [from, to], names, observation
    const R = {
      mgcu: [[["Mg", "0"], ["Cu²⁺", "+2"], ["Mg²⁺", "+2"], ["Cu", "0"]], [0, 2], [1, 3], "magnesium", "copper(II) ions", "the blue solution fades and brown copper forms on the magnesium"],
      zncu: [[["Zn", "0"], ["Cu²⁺", "+2"], ["Zn²⁺", "+2"], ["Cu", "0"]], [0, 2], [1, 3], "zinc", "copper(II) ions", "the blue colour fades; brown copper coats the zinc; the mixture warms up"],
      clki: [[["Cl₂", "0"], ["2I⁻", "−1"], ["2Cl⁻", "−1"], ["I₂", "0"]], [1, 3], [0, 2], "iodide ions", "chlorine", "the colourless solution turns brown as iodine forms"],
      fecl: [[["2Fe²⁺", "+2"], ["Cl₂", "0"], ["2Fe³⁺", "+3"], ["2Cl⁻", "−1"]], [0, 2], [1, 3], "iron(II) ions", "chlorine", "pale green iron(II) turns yellow-brown iron(III)"],
      cuo: [[["CuO", "+2"], ["H₂", "0"], ["Cu", "0"], ["H₂O", "+1"]], [1, 3], [0, 2], "hydrogen", "copper(II) oxide", "black copper(II) oxide turns pink-brown copper; water forms"],
      iron: [[["Fe₂O₃", "+3"], ["3CO", "+2"], ["2Fe", "0"], ["3CO₂", "+4"]], [1, 3], [0, 2], "carbon monoxide", "iron(III) oxide", "the blast furnace: iron(III) oxide loses oxygen and becomes iron"]
    };
    let st = { r: "mgcu" };
    function draw() {
      const [sp, [o1, o2], [r1, r2], redAgent, oxAgent, seen] = R[st.r], xs = [80, 210, 430, 560];
      let s = sp.map(([f, n], i) => `<rect class="f ${i === o1 || i === o2 ? "cr" : "cb"} lt" x="${xs[i] - 52}" y="120" width="104" height="44" rx="8"/><text x="${xs[i]}" y="148" text-anchor="middle" class="mono-b">${f}</text><text x="${xs[i]}" y="${i === o1 || i === o2 ? 112 : 182}" text-anchor="middle" class="tc" style="--fc:${i === o1 || i === o2 ? "var(--red)" : "var(--blue)"}">${n}</text>`).join("");
      s += `<text x="145" y="148" text-anchor="middle" class="mono-b">+</text><text x="320" y="148" text-anchor="middle" class="mono-b">→</text><text x="495" y="148" text-anchor="middle" class="mono-b">+</text>`;
      s += `<path class="l w3" style="--fc:var(--red)" d="M${xs[o1]} 96C${xs[o1]} 40 ${xs[o2]} 40 ${xs[o2]} 92"/><path class="mk" style="--fc:var(--red)" d="M${xs[o2]} 96l-6 -10h12z"/><text x="${(xs[o1] + xs[o2]) / 2}" y="40" text-anchor="middle" class="tc" style="--fc:var(--red)">oxidised: loses electrons, oxidation number rises</text>`;
      s += `<path class="l w3" style="--fc:var(--blue)" d="M${xs[r1]} 194C${xs[r1]} 250 ${xs[r2]} 250 ${xs[r2]} 198"/><path class="mk" style="--fc:var(--blue)" d="M${xs[r2]} 194l-6 10h12z"/><text x="${(xs[r1] + xs[r2]) / 2}" y="262" text-anchor="middle" class="tc" style="--fc:var(--blue)">reduced: gains electrons, oxidation number falls</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["oxidised", `${sp[o1][0]} → ${sp[o2][0]} (${sp[o1][1]} → ${sp[o2][1]})`], ["reduced", `${sp[r1][0]} → ${sp[r2][0]} (${sp[r1][1]} → ${sp[r2][1]})`], ["reducing agent", redAgent], ["oxidising agent", oxAgent], ["observation", seen]]);
      exp.innerHTML = chips([["Redox"], [`${redAgent} is the reducing agent`]]) + `<h3>Oxidation and reduction happen together</h3><p><b>Oxidation</b> is gain of oxygen, <b>loss of electrons</b>, or an increase in oxidation number; <b>reduction</b> is loss of oxygen, <b>gain of electrons</b>, or a decrease in oxidation number (<b>OIL RIG</b>). Here ${sp[o1][0]} is oxidised and ${sp[r1][0]} is reduced. The <b>reducing agent</b> (${redAgent}) is the substance that reduces something else — it is itself oxidised; the <b>oxidising agent</b> (${oxAgent}) is itself reduced.</p><p>Tests: acidified <b>potassium manganate(VII)</b> turns from purple to colourless with a reducing agent; <b>potassium iodide</b> turns from colourless to brown with an oxidising agent.</p>` + flow(["electrons leave the reducing agent", "it is oxidised", "the oxidising agent takes them", "it is reduced"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.r = "mgcu"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ rate: rateLab, equilibrium: equilibriumLab, redox: redoxLab });
})();
