/* ==========================================================================
   stay add. — Chemistry topic 3, Stoichiometry: the labs
   formula   pick a positive and a negative ion: the charges must cancel, giving
             the formula and its Mr
   mole      a mass of a substance → moles → particles, gas volume and concentration
   reacting  reacting masses in four steps, then percentage yield
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs } = window.StayAdd.kit;
  const AR = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 64 };
  const SUB = (n) => String(n).split("").map((d) => "₀₁₂₃₄₅₆₇₈₉"[d]).join("");
  const r2 = (n) => (Math.round(n * 100) / 100).toString();
  const sig = (n) => (n >= 0.01 ? r2(n) : n.toPrecision(2));

  /* ---------- ionic formulae ---------- */
  function formulaLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // symbol, charge, name, atoms in the ion
    const CAT = { Na: ["Na", 1, "sodium", { Na: 1 }], K: ["K", 1, "potassium", { K: 1 }], NH4: ["NH₄", 1, "ammonium", { N: 1, H: 4 }], Mg: ["Mg", 2, "magnesium", { Mg: 1 }], Ca: ["Ca", 2, "calcium", { Ca: 1 }], Cu: ["Cu", 2, "copper(II)", { Cu: 1 }], Fe: ["Fe", 3, "iron(III)", { Fe: 1 }], Al: ["Al", 3, "aluminium", { Al: 1 }] };
    const AN = { Cl: ["Cl", 1, "chloride", { Cl: 1 }], OH: ["OH", 1, "hydroxide", { O: 1, H: 1 }], NO3: ["NO₃", 1, "nitrate", { N: 1, O: 3 }], O: ["O", 2, "oxide", { O: 1 }], SO4: ["SO₄", 2, "sulfate", { S: 1, O: 4 }], CO3: ["CO₃", 2, "carbonate", { C: 1, O: 3 }] };
    let st = { c: "Ca", a: "OH" };
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    const part = ([sym, , , atoms], n) => (n === 1 ? sym : Object.keys(atoms).length > 1 ? `(${sym})${SUB(n)}` : `${sym}${SUB(n)}`);
    function draw() {
      const C = CAT[st.c], A = AN[st.a], l = (C[1] * A[1]) / gcd(C[1], A[1]), a = l / C[1], b = l / A[1], formula = part(C, a) + part(A, b);
      const counts = {}; for (const [ion, n] of [[C, a], [A, b]]) for (const [el, k] of Object.entries(ion[3])) counts[el] = (counts[el] || 0) + k * n;
      const Mr = Object.entries(counts).reduce((s, [el, k]) => s + AR[el] * k, 0), U = 44;
      let s = `<text x="40" y="40" class="k">positive charge</text><text x="40" y="150" class="k">negative charge</text>`;
      for (let i = 0; i < a; i++) s += `<rect class="f cr dk" x="${40 + i * C[1] * U}" y="52" width="${C[1] * U - 4}" height="54" rx="6"/><text x="${40 + i * C[1] * U + (C[1] * U - 4) / 2}" y="84" text-anchor="middle" class="k">${C[0]}${C[1] > 1 ? C[1] : ""}+</text>`;
      for (let i = 0; i < b; i++) s += `<rect class="f cb dk" x="${40 + i * A[1] * U}" y="162" width="${A[1] * U - 4}" height="54" rx="6"/><text x="${40 + i * A[1] * U + (A[1] * U - 4) / 2}" y="194" text-anchor="middle" class="k">${A[0]}${A[1] > 1 ? A[1] : ""}−</text>`;
      s += `<path class="guide" d="M${40 + l * U - 2} 40V230"/><text x="${40 + l * U + 6}" y="140">+${l} and −${l}: balanced</text>
        <text x="40" y="266" class="mono-b" style="font-size:24px">${formula}</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["ions", `${C[0]}${C[1] > 1 ? C[1] : ""}+ and ${A[0]}${A[1] > 1 ? A[1] : ""}−`], ["ratio", `${a} : ${b}`], ["formula", `${formula} — ${C[2]} ${A[2]}`], ["Mr", Object.entries(counts).map(([el, k]) => `${k} × ${AR[el]}`).join(" + ") + ` = ${Mr}`]]);
      exp.innerHTML = chips([[formula], [`Mr = ${Mr}`]]) + `<h3>Total positive charge = total negative charge</h3><p>An ionic compound has no overall charge, so add ions until the charges cancel: ${a} × ${C[1]}+ and ${b} × ${A[1]}−. ${Object.keys(C[3]).length > 1 && a > 1 || Object.keys(A[3]).length > 1 && b > 1 ? "A group ion such as NH₄⁺, OH⁻, NO₃⁻, SO₄²⁻ or CO₃²⁻ goes in <b>brackets</b> when you need more than one of it. " : ""}The <b>relative formula mass</b> Mr is the sum of the relative atomic masses of all the atoms in the formula.</p>` + flow(["find the charges", "balance them", "write the formula", "add up Ar values → Mr"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { c: "Ca", a: "OH" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- the mole ---------- */
  function moleLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // formula, Mr, name, gas at r.t.p.?, dissolves?
    const S = { H2O: ["H₂O", 18, "water", false, false], CO2: ["CO₂", 44, "carbon dioxide", true, false], NaCl: ["NaCl", 58.5, "sodium chloride", false, true], NaOH: ["NaOH", 40, "sodium hydroxide", false, true], CaCO3: ["CaCO₃", 100, "calcium carbonate", false, false], Mg: ["Mg", 24, "magnesium", false, false], O2: ["O₂", 32, "oxygen", true, false] };
    let st = { s: "NaCl", m: 11.7, V: 500 };
    function tri(x, y, top, l, r, vals, on) {
      return `<g opacity="${on ? 1 : 0.3}"><path class="l" style="--fc:var(--c-chem);--lw:2" d="M${x} ${y}L${x + 70} ${y + 120}H${x - 70}Z"/><path class="l" d="M${x - 46} ${y + 78}H${x + 46}M${x} ${y + 78}V${y + 120}"/>
        <text x="${x}" y="${y + 60}" text-anchor="middle" class="mono-b">${top}</text><text x="${x - 30}" y="${y + 106}" text-anchor="middle" class="mono-b">${l}</text><text x="${x + 30}" y="${y + 106}" text-anchor="middle" class="mono-b">${r}</text>
        <text x="${x}" y="${y + 146}" text-anchor="middle" style="font-size:11px">${vals}</text></g>`;
    }
    function draw() {
      const [f, Mr, name, gas, aq] = S[st.s], n = st.m / Mr, N = n * 6.02e23, Vg = n * 24, c = n / (st.V / 1000);
      svg.innerHTML = tri(110, 40, "m", "n", "Mr", `${st.m} g = ${sig(n)} mol × ${Mr}`, true) + tri(320, 40, "V", "n", "24", gas ? `${r2(Vg)} dm³ = ${sig(n)} × 24` : "only for gases", gas) + tri(530, 40, "n", "c", "V", aq ? `${sig(n)} mol = ${r2(c)} mol/dm³ × ${st.V / 1000} dm³` : "only for a solution", aq) +
        `<text x="110" y="24" text-anchor="middle" class="k">mass</text><text x="320" y="24" text-anchor="middle" class="k">gas volume (r.t.p.)</text><text x="530" y="24" text-anchor="middle" class="k">concentration</text>`;
      res.innerHTML = rows([["substance", `${f} (Mr ${Mr})`], ["moles n = m ÷ Mr", `${sig(n)} mol`], ["particles = n × 6.02 × 10²³", N.toExponential(2).replace("e+", " × 10^")], ...(gas ? [["volume at r.t.p. = n × 24", `${r2(Vg)} dm³`]] : []), ...(aq ? [[`concentration in ${st.V} cm³`, `${r2(c)} mol/dm³ = ${r2(st.m / (st.V / 1000))} g/dm³`]] : [])]);
      exp.innerHTML = chips([[`${sig(n)} mol`], [name]]) + `<h3>One mole = 6.02 × 10²³ particles</h3><p>The <b>mole</b> is the amount of substance containing 6.02 × 10²³ particles (the <b>Avogadro constant</b>). One mole has a mass equal to Mr in grams, so <b>n = m ÷ Mr</b>. ${gas ? "One mole of <b>any gas</b> occupies <b>24 dm³</b> at room temperature and pressure." : ""} ${aq ? "For a solution, <b>concentration = moles ÷ volume in dm³</b> (divide cm³ by 1000)." : ""} Cover the quantity you want in the triangle: what is left shows how to work it out.</p>` + flow(["mass in g", "÷ Mr", "moles", "× 6.02 × 10²³ / × 24 / ÷ V"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { s: "NaCl", m: 11.7, V: 500 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- reacting masses and yield ---------- */
  function reactingLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // equation, reactant [formula, Mr, coefficient], product [formula, Mr, coefficient]
    const R = {
      lime: ["CaCO₃ → CaO + CO₂", ["CaCO₃", 100, 1], ["CaO", 56, 1]],
      mgo: ["2Mg + O₂ → 2MgO", ["Mg", 24, 2], ["MgO", 40, 2]],
      iron: ["Fe₂O₃ + 3CO → 2Fe + 3CO₂", ["Fe₂O₃", 160, 1], ["Fe", 56, 2]],
      water: ["2H₂ + O₂ → 2H₂O", ["H₂", 2, 2], ["H₂O", 18, 2]]
    };
    let st = { r: "lime", m: 50, y: 80 };
    function draw() {
      const [eq, [fa, Ma, ca], [fb, Mb, cb]] = R[st.r], na = st.m / Ma, nb = (na * cb) / ca, mb = nb * Mb, act = (mb * st.y) / 100;
      const box = (x, top, val) => `<rect class="f lt" x="${x}" y="70" width="120" height="64" rx="8"/><text x="${x + 60}" y="94" text-anchor="middle">${top}</text><text x="${x + 60}" y="120" text-anchor="middle" class="mono-b">${val}</text>`;
      const arr = (x, t) => `<path class="ar" d="M${x} 102h34"/><path class="ar-h" d="M${x + 34} 102l-8 -5v10z"/><text x="${x + 17}" y="62" text-anchor="middle" style="font-size:11px">${t}</text>`;
      const W = 480, full = Math.max(mb, 1e-9);
      svg.innerHTML = `<text x="320" y="34" text-anchor="middle" class="mono-b">${eq}</text>` +
        box(6, `mass of ${fa}`, `${st.m} g`) + arr(128, `÷ ${Ma}`) + box(166, `moles of ${fa}`, `${sig(na)}`) + arr(288, `× ${cb}/${ca}`) + box(326, `moles of ${fb}`, `${sig(nb)}`) + arr(448, `× ${Mb}`) + box(486, `mass of ${fb}`, `${r2(mb)} g`) +
        `<text x="20" y="186">theoretical</text><rect class="f ca dk" x="120" y="172" width="${W}" height="20" rx="4"/>
         <text x="20" y="226">actual</text><rect class="f cg dk" x="120" y="212" width="${(W * act) / full}" height="20" rx="4"/>
         <text x="${120 + W}" y="260" text-anchor="end">percentage yield = ${r2(act)} ÷ ${r2(mb)} × 100 = ${st.y}%</text>`;
      res.innerHTML = rows([["moles of reactant", `${st.m} ÷ ${Ma} = ${sig(na)} mol`], ["mole ratio from the equation", `${ca} ${fa} : ${cb} ${fb}`], ["theoretical yield", `${r2(mb)} g of ${fb}`], ["actual yield", `${r2(act)} g`], ["percentage yield", `${st.y}%`]]);
      exp.innerHTML = chips([[`${r2(mb)} g ${fb}`], [`${st.y}% yield`, st.y >= 90 ? "up" : ""]]) + `<h3>Masses go through moles</h3><p>You cannot compare masses directly because the particles have different masses. Convert the mass you know into <b>moles</b>, use the <b>ratio of the numbers in front</b> in the balanced equation, then convert back to a <b>mass</b>. The answer is the <b>theoretical yield</b>. The <b>actual yield</b> is usually less — some product is lost when it is separated, the reaction may not go to completion, or side reactions happen. <b>Percentage yield = actual ÷ theoretical × 100</b>. (Percentage purity works the same way: mass of pure product ÷ mass of the sample × 100.)</p>` + flow(["mass", "÷ Mr → moles", "× mole ratio", "× Mr → mass"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { r: "lime", m: 50, y: 80 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ formula: formulaLab, mole: moleLab, reacting: reactingLab });
})();
