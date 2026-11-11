/* ==========================================================================
   stay add. — Chemistry topic 10, Chemistry of the environment: the labs
   water       river water through the treatment stages: what each one removes
   fertiliser  NPK fertilisers: which nutrients each compound supplies, and % N
   greenhouse  more greenhouse gas: more infrared absorbed, higher temperature
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  /* ---------- water treatment ---------- */
  function waterLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const STAGES = [["river water", "everything is still in it"], ["sedimentation", "large insoluble particles settle to the bottom"], ["filtration", "a layer of sand and gravel removes smaller insoluble particles"], ["carbon", "activated carbon removes tastes and smells"], ["chlorination", "chlorine kills harmful microbes"]];
    // impurity, removed at stage
    const IMP = [["soil and grit", 1, "ca"], ["fine insoluble particles", 2, "cr"], ["tastes and smells", 3, "cv"], ["microbes", 4, "cg"], ["dissolved salts and oxygen", 99, "cb"]];
    let st = { stage: 0 }, t = 0;
    function draw() {
      let s = "";
      STAGES.forEach(([n], i) => { const x = 20 + i * 124; s += `<rect class="f ${i <= st.stage ? "cb" : ""} ${i === st.stage ? "dk" : "lt"}" x="${x}" y="40" width="104" height="60" rx="8"/><text x="${x + 52}" y="75" text-anchor="middle" style="font-size:11px" class="${i === st.stage ? "k" : ""}">${n}</text>${i < 4 ? `<path class="ar" d="M${x + 106} 70h14"/>` : ""}`; });
      IMP.forEach(([n, at, c], i) => { const left = at > st.stage, y = 130 + i * 30; s += `<text x="20" y="${y + 14}" class="${left ? "k" : ""}" style="${left ? "" : "text-decoration:line-through;opacity:.5"}">${n}</text>`; for (let k = 0; k < (left ? 12 : 0); k++) s += `<circle class="f ${c} dk" cx="${260 + k * 26 + Math.sin(t / 10 + k) * 4}" cy="${y + 10 + Math.cos(t / 12 + k) * 3}" r="${i === 0 ? 6 : i === 1 ? 3 : 4}"/>`; });
      svg.innerHTML = s;
    }
    function explain() {
      const [n, what] = STAGES[st.stage], left = IMP.filter(([, at]) => at > st.stage).map(([x]) => x);
      res.innerHTML = rows([["stage", n], ["what it does", what], ["still in the water", left.join(", ")]]);
      exp.innerHTML = chips([[n], [st.stage === 4 ? "safe to drink" : "not yet safe", st.stage === 4 ? "up" : "warn"]]) + `<h3>From river to tap</h3><p>Water from natural sources contains substances that are <b>useful</b> (dissolved oxygen for aquatic life, minerals for health) and some that are <b>harmful</b>: insoluble solids, microbes, and pollutants such as nitrates and phosphates from fertilisers, metal compounds and plastics. Domestic water is treated by <b>sedimentation and filtration</b> (insoluble solids), <b>carbon</b> (tastes and odours) and <b>chlorination</b> (microbes). Treated tap water is not pure — it still contains dissolved substances.</p><p>Tests: water turns anhydrous <b>copper(II) sulfate</b> from white to <b>blue</b> and anhydrous <b>cobalt(II) chloride</b> from blue to <b>pink</b>. Pure water melts at exactly 0 °C and boils at exactly 100 °C. Distilled water is used in practical work because it has no dissolved impurities.</p>` + flow(STAGES.slice(1).map((x) => x[0]));
    }
    const paint = controls(lab, st, () => { paint(); explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.stage = 0; paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { t++; draw(); }, 60);
  }

  /* ---------- fertilisers ---------- */
  function fertLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // formula, name, Mr, N atoms, supplies [N, P, K]
    const F = { nh4no3: ["NH₄NO₃", "ammonium nitrate", 80, 2, [1, 0, 0]], nh4so4: ["(NH₄)₂SO₄", "ammonium sulfate", 132, 2, [1, 0, 0]], kno3: ["KNO₃", "potassium nitrate", 101, 1, [1, 0, 1]], nh4po4: ["(NH₄)₃PO₄", "ammonium phosphate", 149, 3, [1, 1, 0]], kcl: ["KCl", "potassium chloride", 74.5, 0, [0, 0, 1]] };
    let st = { f: "nh4no3" };
    function draw() {
      const [fm, name, Mr, nN, sup] = F[st.f], pN = (nN * 14 * 100) / Mr;
      const plant = (x, label, ok, c) => `<path class="l w3" style="--fc:var(--green)" d="M${x} 250V${ok ? 120 : 190}"/>${ok ? `<path class="f cg dk" d="M${x} 170q-34 -10 -40 -34q30 0 40 24z"/><path class="f cg dk" d="M${x} 150q34 -10 40 -34q-30 0 -40 24z"/>` : `<path class="f cg lt" d="M${x} 210q-20 -6 -24 -20q18 0 24 14z"/>`}${c === "P" && ok ? `<path class="l" style="--fc:var(--amber)" d="M${x} 250l-18 22M${x} 250l18 22M${x} 250v26"/>` : ""}${c === "K" && ok ? `<circle class="f cp dk" cx="${x}" cy="112" r="9"/>` : ""}
        <text x="${x}" y="40" text-anchor="middle" class="k">${label}</text><text x="${x}" y="58" text-anchor="middle" class="tc" style="--fc:${ok ? "var(--green)" : "var(--ink-3)"}">${ok ? "supplied" : "not supplied"}</text>`;
      svg.innerHTML = plant(110, "N — growth", sup[0], "N") + plant(250, "P — roots", sup[1], "P") + plant(390, "K — flowers, fruit", sup[2], "K") + `<path class="guide" d="M40 250H460"/>
        <text x="500" y="110" class="mono-b" style="font-size:20px">${fm}</text><text x="500" y="134">${name}</text><text x="500" y="170" class="k">% N = ${f1(pN)}%</text><text x="500" y="190" style="font-size:11px">${nN} × 14 ÷ ${Mr} × 100</text>`;
      res.innerHTML = rows([["fertiliser", `${fm}, ${name}`], ["supplies", ["N", "P", "K"].filter((_, i) => sup[i]).join(", ")], ["Mr", Mr], ["percentage of nitrogen by mass", `${f1(pN)}%`]]);
      exp.innerHTML = chips([[["N", "P", "K"].filter((_, i) => sup[i]).join(" + ")], [`${f1(pN)}% N`]]) + `<h3>Fertilisers replace the elements plants take from the soil</h3><p>Plants need <b>nitrogen</b> (for proteins and growth), <b>phosphorus</b> (for roots) and <b>potassium</b> (for flowers and fruit). <b>NPK fertilisers</b> contain all three, as soluble salts — <b>ammonium salts and nitrates</b> provide nitrogen. Many ammonium salts are made from ammonia from the Haber process. Too much fertiliser washed into rivers causes <b>eutrophication</b>: algae grow, die and decompose, and the bacteria use up the dissolved oxygen, so fish die.</p>` + flow(["fertiliser in soil", "N, P, K for the plant", "excess washes into rivers", "algae, low oxygen"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.f = "nh4no3"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- the greenhouse effect ---------- */
  function greenhouseLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { co2: 420 }, t = 0;
    const temp = () => 14 + 3 * Math.log2(st.co2 / 280) - 3 * Math.log2(420 / 280) + 1.2;
    function draw() {
      const frac = Math.min(0.9, 0.35 + (st.co2 - 280) / 1200), n = 8;
      let s = `<rect x="0" y="230" width="640" height="60" fill="color-mix(in srgb, var(--green) 18%, var(--surface))"/><path class="l" style="--fc:var(--green)" d="M0 230H640"/>
        <rect x="0" y="70" width="640" height="70" fill="var(--c-chem)" opacity="${0.04 + frac * 0.16}"/><text x="630" y="88" text-anchor="end" style="font-size:11px">greenhouse gases (CO₂, CH₄)</text>
        <circle cx="50" cy="30" r="20" fill="var(--amber)"/>`;
      for (let k = 0; k < 3; k++) { const x = 90 + k * 60; s += `<path class="l w3" style="--fc:var(--amber)" d="M${x} 20L${x + 80} 226"/><path class="mk" style="--fc:var(--amber)" d="M${x + 80} 228l-9 -3l5 -8z"/>`; }
      for (let k = 0; k < n; k++) {
        const x = 300 + k * 40, back = k / n < frac, u = ((t / 80 + k / n) % 1);
        if (back) { const y = u < 0.5 ? 228 - u * 2 * 128 : 100 + (u - 0.5) * 2 * 128; s += `<path class="l" style="--fc:var(--red)" d="M${x} 228L${x} 100L${x + 16} 228" stroke-dasharray="4 4"/><circle cx="${x + (u < 0.5 ? 0 : (u - 0.5) * 32)}" cy="${y}" r="4" fill="var(--red)"/>`; }
        else s += `<path class="l" style="--fc:var(--red)" d="M${x} 228V20" stroke-dasharray="4 4"/><circle cx="${x}" cy="${228 - u * 208}" r="4" fill="var(--red)"/>`;
      }
      s += `<text x="20" y="260" class="k">Earth’s surface</text><text x="300" y="260">infrared: some escapes, some is absorbed and sent back</text>`;
      svg.innerHTML = s;
    }
    function explain() {
      const T = temp();
      res.innerHTML = rows([["carbon dioxide", `${st.co2} ppm`], ["pre-industrial level", "about 280 ppm"], ["model average temperature", `${f1(T)} °C`], ["infrared sent back", st.co2 > 420 ? "more than today" : st.co2 < 420 ? "less than today" : "today’s level"]]);
      exp.innerHTML = chips([[`${st.co2} ppm CO₂`], [`${f1(T)} °C`, T > 15.5 ? "warn" : ""]]) + `<h3>Greenhouse gases trap thermal energy</h3><p>Sunlight passes through the atmosphere and warms the Earth’s surface, which gives out <b>infrared radiation</b>. <b>Carbon dioxide</b> and <b>methane</b> absorb some of this infrared and re-emit it, some back towards the Earth, keeping it warmer. More greenhouse gas means more energy is trapped: <b>global warming</b> and <b>climate change</b> (rising sea levels, extreme weather, changes to habitats and farming). Carbon dioxide comes from burning fossil fuels; methane from cattle, rice fields and decomposing waste. Ways to reduce them: plant trees, use renewable energy and hydrogen fuel, eat less meat, and reduce waste.</p>` + flow(["more CO₂ and CH₄", "more infrared absorbed and re-emitted", "less escapes to space", "Earth warms"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.co2 = 420; paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { t++; draw(); }, 40);
  }

  labs({ water: waterLab, fertiliser: fertLab, greenhouse: greenhouseLab });
})();
