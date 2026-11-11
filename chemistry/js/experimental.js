/* ==========================================================================
   stay add. — Chemistry topic 12, Experimental techniques & chemical analysis
   titration  add sodium hydroxide from a burette to hydrochloric acid: pH curve,
              indicator colour, end point and the concentration calculation
   chroma     run a paper chromatogram of an unknown and three references; Rf values
   separate   pick a mixture: the separation method and its apparatus
   ions       an unknown salt on the bench: run the cation and anion tests
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs } = window.StayAdd.kit;
  const r2 = (n) => n.toFixed(2);

  /* ---------- acid–base titration ---------- */
  function titrationLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const cB = 0.1, vA = 25, cA = 0.088, Veq = (cA * vA) / cB;   // end point 22.0 cm³
    let st = { V: 10, ind: "methyl" };
    function pH(V) {
      const nA = cA * vA / 1000, nB = cB * V / 1000, tot = (vA + V) / 1000;
      if (Math.abs(nA - nB) < 1e-7) return 7;
      return nA > nB ? -Math.log10((nA - nB) / tot) : 14 + Math.log10((nB - nA) / tot);
    }
    const colour = (p) => st.ind === "methyl" ? (p < 3.1 ? ["#c4302b", "red"] : p > 4.4 ? ["#f2c42c", "yellow"] : ["#ef8f2a", "orange"]) : p < 9.4 ? ["transparent", "colourless"] : ["#2c6fc0", "blue"];
    function draw() {
      const p = pH(st.V), [col, cname] = colour(p), X = (v) => 330 + (v / 40) * 280, Y = (q) => 250 - (q / 14) * 220;
      const curve = Array.from({ length: 81 }, (_, i) => { const v = i / 2; return `${i ? "L" : "M"}${X(v).toFixed(1)} ${Y(pH(v)).toFixed(1)}`; }).join("");
      svg.innerHTML = `<rect class="glass" x="104" y="10" width="16" height="150"/><rect class="liq" style="--lc:var(--blue)" x="106" y="${12 + (st.V / 50) * 146}" width="12" height="${146 - (st.V / 50) * 146}"/>
        ${[0, 10, 20, 30, 40, 50].map((v) => `<path class="l" d="M120 ${12 + (v / 50) * 146}h6"/><text x="130" y="${16 + (v / 50) * 146}" style="font-size:9px">${v}</text>`).join("")}
        <path class="glass" d="M112 160V176"/><path class="glass" d="M86 196V218L60 268H164L138 218V196"/><path d="M68 256L86 222H138L156 256Z" fill="${col}" opacity="${col === "transparent" ? 0 : 0.7}"/><path class="l" d="M64 262H160"/>
        <text x="112" y="288" text-anchor="middle">${cname}</text>
        <path class="ax" d="M330 30V250H614"/><path class="plot" d="${curve}"/><path class="guide" d="M${X(Veq)} 30V250"/><circle class="pt" cx="${X(st.V)}" cy="${Y(p)}" r="5"/>
        <text x="330" y="24">pH</text><text x="614" y="270" text-anchor="end">volume of NaOH added / cm³</text><text x="${X(Veq) + 4}" y="44" style="font-size:10px">end point ${Veq.toFixed(1)} cm³</text>
        <g text-anchor="end"><text x="324" y="${Y(0) + 4}">0</text><text x="324" y="${Y(7) + 4}">7</text><text x="324" y="${Y(14) + 4}">14</text></g>`;
      const past = st.V >= Veq;
      res.innerHTML = rows([["NaOH added", `${st.V.toFixed(1)} cm³ of 0.100 mol/dm³`], ["pH of the flask", r2(p)], ["indicator", `${st.ind === "methyl" ? "methyl orange" : "thymolphthalein"}: ${cname}`], ["moles of NaOH at the end point", `0.100 × ${Veq.toFixed(1)} ÷ 1000 = ${(cB * Veq / 1000).toFixed(5)} mol`], ["concentration of HCl", past ? `${(cB * Veq / 1000).toFixed(5)} ÷ 0.0250 = ${cA.toFixed(3)} mol/dm³` : "reach the end point first"]]);
      exp.innerHTML = chips([[past ? "End point passed" : "Still acidic", past ? "up" : ""], [`pH ${r2(p)}`]]) + `<h3>Find the exact volume that neutralises the acid</h3><p>A <b>pipette</b> measures 25.0 cm³ of acid into a conical flask; a few drops of <b>indicator</b> are added; the alkali is run in from a <b>burette</b>, swirling, until the indicator just changes colour — the <b>end point</b>. Repeat until two titres agree within 0.10 cm³ (<b>concordant</b> results) and use their mean. Near the end point the pH jumps sharply, so one drop changes the colour. ${st.ind === "methyl" ? "Methyl orange changes from red to yellow." : "Thymolphthalein changes from colourless to blue."}</p><p>Calculation: moles of alkali = concentration × volume ÷ 1000; use the equation NaOH + HCl → NaCl + H₂O (1 : 1); concentration of acid = moles ÷ its volume in dm³.</p>` + flow(["pipette acid + indicator", "burette alkali in", "colour change: end point", "moles → concentration"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { V: 10, ind: "methyl" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- paper chromatography ---------- */
  function chromaLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // sample → spots [Rf, colour, colourless?]
    const SET = {
      dyes: { X: [[0.25, "#c4302b"], [0.62, "#2c6fc0"]], A: [[0.25, "#c4302b"]], B: [[0.45, "#3fae5a"]], C: [[0.62, "#2c6fc0"]] },
      amino: { X: [[0.3, "#7a4c9a", 1], [0.55, "#7a4c9a", 1]], A: [[0.3, "#7a4c9a", 1]], B: [[0.42, "#7a4c9a", 1]], C: [[0.55, "#7a4c9a", 1]] }
    };
    let st = { set: "dyes", run: 100, loc: false };
    function draw() {
      const S = SET[st.set], top = 40, base = 240, front = base - (st.run / 100) * (base - top - 20), d = base - front;
      let s = `<rect class="f lt" x="140" y="${top}" width="300" height="230"/><rect class="liq" style="--lc:var(--blue)" x="120" y="252" width="340" height="30" opacity=".6"/><path class="l dash" d="M140 ${base}H440"/><text x="450" y="${base + 4}" style="font-size:10px">pencil base line</text>
        ${st.run ? `<path class="l" style="--fc:var(--blue)" d="M140 ${front}H440"/><text x="450" y="${front + 4}" style="font-size:10px">solvent front</text>` : ""}`;
      Object.entries(S).forEach(([k, spots], i) => {
        const x = 190 + i * 66;
        s += `<text x="${x}" y="${base + 26}" text-anchor="middle" class="k">${k}</text>`;
        spots.forEach(([rf, c, colourless]) => { const y = base - rf * d, show = !colourless || st.loc; s += `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${c}" opacity="${show ? 0.8 : 0}"/>${show ? "" : `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="none" stroke="var(--line-2)" stroke-dasharray="2 2"/>`}`; });
      });
      if (st.run === 100) s += `<path class="l" style="--fc:var(--c-chem)" d="M470 ${base}V${front}"/><text x="476" y="${(base + front) / 2}" style="font-size:10px">solvent distance</text>`;
      svg.innerHTML = s;
      const ref = Object.entries(S).filter(([k]) => k !== "X"), match = S.X.map(([rf]) => ref.find(([, sp]) => sp.some(([r]) => r === rf))?.[0] || "?");
      res.innerHTML = rows([["unknown X", `${S.X.length} spots`], ["Rf values of X", st.run === 100 ? S.X.map(([r]) => r.toFixed(2)).join(" and ") : "let the solvent run to the top first"], ["X contains", st.run === 100 && (!S.X[0][2] || st.loc) ? match.join(" and ") : "—"], ["locating agent", st.set === "amino" ? (st.loc ? "sprayed: spots visible" : "needed: spots are colourless") : "not needed"]]);
      exp.innerHTML = chips([[`${S.X.length} substances in X`], [st.set === "amino" && !st.loc ? "spots invisible" : "spots visible"]]) + `<h3>Separate a mixture of soluble substances</h3><p>Spots of the samples go on a <b>pencil</b> base line (ink would run) <b>above the solvent level</b> (so they don’t dissolve into the solvent). The solvent moves up the paper; each substance moves a different distance depending on its solubility. A <b>pure</b> substance gives <b>one spot</b>; a mixture gives several. Matching spots (same height, same Rf) mean the same substance. ${st.set === "amino" ? "Colourless substances such as amino acids are made visible by spraying a <b>locating agent</b>." : ""}</p><p class="formula">Rf = distance moved by the substance ÷ distance moved by the solvent</p>` + flow(["spot on pencil line", "solvent rises", "substances separate", "compare Rf values"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { set: "dyes", run: 100, loc: false }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- separation and purification ---------- */
  function separateLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const M = {
      sand: ["sand and water", "filtration", "the insoluble sand stays on the filter paper (residue); water passes through (filtrate)"],
      salt: ["salt from salt solution", "crystallisation", "heat to the crystallisation point, leave to cool, filter off the crystals and dry them"],
      water: ["pure water from salt solution", "simple distillation", "the water boils off, condenses in the condenser and is collected; the salt stays behind"],
      ethanol: ["ethanol and water", "fractional distillation", "ethanol (bp 78 °C) reaches the top of the fractionating column first and is collected; water (100 °C) condenses and runs back"],
      ink: ["the dyes in ink", "chromatography", "the dyes travel different distances up the paper in the solvent"],
      sandsalt: ["salt from rock salt (salt + sand)", "dissolve, filter, crystallise", "add water and stir to dissolve the salt, filter off the sand, then crystallise the salt from the filtrate"]
    };
    const funnel = `<path class="glass" d="M240 60L300 140V170M360 60L300 140"/><path class="l dash" d="M250 66L300 132L350 66"/><path class="glass" d="M262 190V260H338V190"/><rect class="liq" style="--lc:var(--blue)" x="264" y="226" width="72" height="32"/><rect class="f ca" x="270" y="104" width="60" height="10" rx="3"/>`;
    const basin = `<path class="glass" d="M240 120Q300 175 360 120"/><rect class="liq" style="--lc:var(--blue)" x="254" y="124" width="92" height="10"/><path class="l" style="--fc:var(--amber)" d="M294 230q6 -26 6 -40q6 14 6 40"/><path class="glass" d="M250 186H350"/>${[0, 1, 2].map((i) => `<rect class="f cb dk" x="${280 + i * 14}" y="136" width="9" height="9" transform="rotate(45 ${284 + i * 14} 140)"/>`).join("")}`;
    const still = (frac) => `<path class="glass" d="M150 140a46 46 0 1 0 92 0a46 46 0 1 0 -92 0"/><rect class="liq" style="--lc:var(--blue)" x="160" y="150" width="72" height="30"/><path class="l" style="--fc:var(--amber)" d="M190 250q6 -24 6 -40q6 14 6 40"/>
      ${frac ? `<rect class="glass" x="186" y="20" width="20" height="74"/>${[30, 45, 60, 75].map((y) => `<circle class="shell" cx="196" cy="${y}" r="5"/>`).join("")}` : `<path class="glass" d="M188 94V60H206V94"/>`}
      <path class="glass" d="M206 ${frac ? 30 : 66}L420 140"/><path class="glass" d="M220 ${frac ? 20 : 56}L430 120M210 ${frac ? 44 : 80}L420 160"/><text x="320" y="${frac ? 54 : 84}" text-anchor="middle" style="font-size:10px">condenser (cold water)</text>
      <path class="glass" d="M410 170V250H470V170"/><rect class="liq" style="--lc:var(--teal)" x="412" y="224" width="56" height="24"/><text x="440" y="270" text-anchor="middle" style="font-size:10px">distillate</text>`;
    const paper = `<rect class="f lt" x="250" y="40" width="100" height="210"/><rect class="liq" style="--lc:var(--blue)" x="230" y="240" width="140" height="24"/>${[["#c4302b", 190], ["#3fae5a", 130], ["#2c6fc0", 80]].map(([c, y]) => `<ellipse cx="300" cy="${y}" rx="9" ry="6" fill="${c}" opacity=".8"/>`).join("")}`;
    const PIC = { sand: funnel, salt: basin, water: still(false), ethanol: still(true), ink: paper, sandsalt: funnel + "" };
    let st = { mix: "sand" };
    function draw() {
      const [name, how, what] = M[st.mix];
      svg.innerHTML = PIC[st.mix] + `<text x="20" y="30" class="k">${how}</text><text x="20" y="50" style="font-size:11px">${name}</text>`;
      res.innerHTML = rows([["mixture", name], ["method", how], ["how it works", what]]);
      exp.innerHTML = chips([[how]]) + `<h3>Choose the method from the properties</h3><p><b>Filtration</b> separates an insoluble solid from a liquid. <b>Crystallisation</b> gets a soluble solid from its solution. <b>Simple distillation</b> gets a solvent from a solution. <b>Fractional distillation</b> separates miscible liquids with different boiling points (also used for crude oil). <b>Chromatography</b> separates dissolved substances such as dyes. A <b>pure</b> substance has a sharp, fixed melting and boiling point; impurities lower the melting point and raise the boiling point. Purity matters for food and drugs.</p>` + flow(["insoluble solid? → filter", "dissolved solid? → crystallise", "liquid from solution? → distil", "liquids? → fractional distillation"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.mix = "sand"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- tests for ions ---------- */
  function ionsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // cation results: NaOH, NH3, flame [text, colour of precipitate or flame or null]
    const CAT = {
      "Al³⁺": [["white precipitate, dissolves in excess to a colourless solution", "#f4f4f0"], ["white precipitate, insoluble in excess", "#f4f4f0"], ["no colour", null]],
      "NH₄⁺": [["no precipitate; on warming, ammonia gas turns damp red litmus blue", null], ["—", null], ["no colour", null]],
      "Ca²⁺": [["white precipitate, insoluble in excess", "#f4f4f0"], ["no precipitate or a very slight white precipitate", null], ["orange-red", "#e0602a"]],
      "Cr³⁺": [["green precipitate, dissolves in excess", "#3f8a4a"], ["green precipitate, insoluble in excess", "#3f8a4a"], ["no colour", null]],
      "Cu²⁺": [["light blue precipitate, insoluble in excess", "#6aa8e0"], ["light blue precipitate, dissolves in excess to a dark blue solution", "#6aa8e0"], ["blue-green", "#3aa8a0"]],
      "Fe²⁺": [["green precipitate, insoluble in excess", "#5a7a3a"], ["green precipitate, insoluble in excess", "#5a7a3a"], ["no colour", null]],
      "Fe³⁺": [["red-brown precipitate, insoluble in excess", "#a0522d"], ["red-brown precipitate, insoluble in excess", "#a0522d"], ["no colour", null]],
      "Zn²⁺": [["white precipitate, dissolves in excess to a colourless solution", "#f4f4f0"], ["white precipitate, dissolves in excess to a colourless solution", "#f4f4f0"], ["no colour", null]],
      "Na⁺": [["no precipitate", null], ["no precipitate", null], ["yellow", "#f2c42c"]],
      "K⁺": [["no precipitate", null], ["no precipitate", null], ["lilac", "#b07ad8"]],
      "Li⁺": [["no precipitate", null], ["no precipitate", null], ["red", "#c4302b"]]
    };
    // anion results: acid + limewater, AgNO3, Ba(NO3)2, NaOH + Al, acidified KMnO4
    const AN = {
      "CO₃²⁻": [["fizzes; the gas turns limewater milky (CO₂)", 1], ["—", 0], ["—", 0], ["—", 0], ["—", 0]],
      "Cl⁻": [["no reaction", 0], ["white precipitate", "#f4f4f0"], ["no precipitate", 0], ["no ammonia", 0], ["—", 0]],
      "Br⁻": [["no reaction", 0], ["cream precipitate", "#efe2b8"], ["no precipitate", 0], ["no ammonia", 0], ["—", 0]],
      "I⁻": [["no reaction", 0], ["yellow precipitate", "#f2d84a"], ["no precipitate", 0], ["no ammonia", 0], ["—", 0]],
      "SO₄²⁻": [["no reaction", 0], ["no precipitate", 0], ["white precipitate", "#f4f4f0"], ["no ammonia", 0], ["stays purple", 0]],
      "SO₃²⁻": [["—", 0], ["no precipitate", 0], ["—", 0], ["no ammonia", 0], ["purple → colourless", 1]],
      "NO₃⁻": [["no reaction", 0], ["no precipitate", 0], ["no precipitate", 0], ["on warming, ammonia turns damp red litmus blue", 1], ["stays purple", 0]]
    };
    const SAMPLES = { A: ["Cu²⁺", "SO₄²⁻", "copper(II) sulfate"], B: ["Fe³⁺", "Cl⁻", "iron(III) chloride"], C: ["NH₄⁺", "Cl⁻", "ammonium chloride"], D: ["Zn²⁺", "I⁻", "zinc iodide"], E: ["Na⁺", "CO₃²⁻", "sodium carbonate"], F: ["Ca²⁺", "NO₃⁻", "calcium nitrate"], G: ["Al³⁺", "SO₄²⁻", "aluminium sulfate"], H: ["K⁺", "Br⁻", "potassium bromide"], I: ["Fe²⁺", "SO₄²⁻", "iron(II) sulfate"], J: ["Cr³⁺", "Cl⁻", "chromium(III) chloride"] };
    const TESTS = { naoh: ["aqueous sodium hydroxide (then excess)", "c", 0], nh3: ["aqueous ammonia (then excess)", "c", 1], flame: ["flame test", "c", 2], acid: ["dilute acid (gas into limewater)", "a", 0], agno3: ["acidify with HNO₃, add AgNO₃(aq)", "a", 1], ba: ["acidify with HNO₃, add Ba(NO₃)₂(aq)", "a", 2], al: ["NaOH(aq) + aluminium foil, warm", "a", 3], kmno4: ["acidified KMnO₄(aq)", "a", 4] };
    let st = { u: "A", test: "naoh" }, log = {}, shown = false;
    function draw() {
      const [cat, an, name] = SAMPLES[st.u], [label, kind, k] = TESTS[st.test], [txt, c] = kind === "c" ? CAT[cat][k] : AN[an][k];
      let s = "";
      if (st.test === "flame") s += `<rect class="f dk" x="290" y="210" width="40" height="70" rx="3"/><path d="M296 210Q310 ${c ? 70 : 130} 324 210Z" fill="${c || "#2c6fc0"}" opacity="${c ? 0.85 : 0.35}"/><path class="l w3" d="M200 120L300 150"/><circle class="f dk" cx="302" cy="151" r="4"/><text x="200" y="110">nichrome wire with the sample</text>`;
      else {
        s += `<path class="glass" d="M270 40V220a40 40 0 0 0 80 0V40"/><rect class="liq" style="--lc:${cat === "Cu²⁺" ? "var(--blue)" : cat === "Fe³⁺" ? "var(--amber)" : cat === "Fe²⁺" || cat === "Cr³⁺" ? "var(--green)" : "var(--line-2)"}" x="272" y="110" width="76" height="148"/>`;
        if (typeof c === "string") s += Array.from({ length: 26 }, (_, i) => `<circle cx="${280 + (i * 23) % 60}" cy="${200 + ((i * 37) % 50)}" r="${3 + (i % 3)}" fill="${c}" stroke="var(--ink-3)" stroke-width=".5"/>`).join("");
        if (c === 1) s += st.test === "kmno4" ? "" : Array.from({ length: 10 }, (_, i) => `<circle class="shell" cx="${285 + (i * 17) % 50}" cy="${120 + (i * 29) % 90}" r="3"/>`).join("");
        if (st.test === "kmno4") s = s.replace(/--lc:[^"]*"/, `--lc:${c === 1 ? "var(--line-2)" : "var(--violet)"}"`);
      }
      s += `<text x="40" y="40" class="mono-b" style="font-size:22px">sample ${st.u}</text><text x="40" y="64">${shown ? name : "unknown salt"}</text>
        <text x="400" y="80" class="k">${label}</text><foreignObject x="400" y="90" width="230" height="120"><div xmlns="http://www.w3.org/1999/xhtml" style="font:13px/1.45 var(--font-sans);color:var(--ink)">${txt}</div></foreignObject>`;
      svg.innerHTML = s;
      log[st.u] = log[st.u] || {}; log[st.u][st.test] = txt;
      const done = Object.entries(log[st.u]).map(([t, r]) => [TESTS[t][0], r]);
      res.innerHTML = rows([["sample", `${st.u}${shown ? ` = ${name} (${cat}, ${an})` : ""}`], ...done]);
      exp.innerHTML = chips([[`${Object.keys(log[st.u]).length} of 8 tests run`], [shown ? `${cat} + ${an}` : "identity hidden", shown ? "up" : ""]]) + `<h3>Identify the positive and the negative ion</h3><p>Use <b>sodium hydroxide</b> and <b>ammonia</b> solutions (colour of the precipitate, and whether it dissolves in excess) and the <b>flame test</b> for the cation. For the anion: <b>acid</b> (carbonates fizz, CO₂ turns limewater milky), <b>silver nitrate</b> after nitric acid (chloride white, bromide cream, iodide yellow), <b>barium nitrate</b> after nitric acid (sulfate white), <b>NaOH and aluminium</b> on warming (nitrate gives ammonia) and acidified <b>potassium manganate(VII)</b> (sulfite decolourises it). Press <b>Reveal</b> to check your answer.</p>` + flow(["cation: NaOH / NH₃ / flame", "anion: acid / AgNO₃ / Ba²⁺ / Al / KMnO₄", "combine", "name the salt"]);
    }
    $("[data-go]", lab).addEventListener("click", () => { shown = !shown; draw(); });
    const paint = controls(lab, st, (k) => { if (k === "u") shown = false; paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { u: "A", test: "naoh" }); log = {}; shown = false; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ titration: titrationLab, chroma: chromaLab, separate: separateLab, ions: ionsLab });
})();
