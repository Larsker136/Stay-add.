/* ==========================================================================
   stay add. — Chemistry topic 9, Metals: the labs
   alloy       push on a pure metal and on an alloy: layers slide in one, not the other
   reactivity  test metals with cold water, steam, dilute acid and copper(II) sulfate
   rust        iron nails in different conditions, with ways of protecting them
   extract     how iron, aluminium and zinc are extracted, from the reactivity series
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs } = window.StayAdd.kit;
  const SERIES = ["K", "Na", "Ca", "Mg", "Al", "C", "Zn", "Fe", "H", "Cu", "Ag", "Au"];
  const ladder = (x, hi, extra = {}) => SERIES.map((m, i) => `<rect class="f ${m === hi ? "ca dk" : m === "C" || m === "H" ? "lt" : ""}" x="${x}" y="${20 + i * 21}" width="64" height="18" rx="4"/><text x="${x + 32}" y="${33 + i * 21}" text-anchor="middle" style="font-size:11px" class="${m === hi ? "k" : ""}">${m === "C" || m === "H" ? `(${m})` : m}</text>${extra[m] || ""}`).join("") + `<text x="${x + 32}" y="${290}" text-anchor="middle" style="font-size:10px">less reactive ↓</text>`;

  /* ---------- pure metal vs alloy ---------- */
  function alloyLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const A = { pure: ["pure iron", "", "soft, layers slide easily"], steel: ["steel (iron + carbon)", "C", "hard and strong"], brass: ["brass (copper + zinc)", "Zn", "harder than copper, does not corrode"], stainless: ["stainless steel (iron + chromium + nickel)", "Cr", "hard and resists rusting"] };
    let st = { a: "pure", F: 0 };
    function draw() {
      const alloy = st.a !== "pure", slip = alloy ? Math.min(6, st.F * 0.06) : st.F * 0.9, odd = [[2, 3], [4, 6], [1, 8]];
      let s = "";
      for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
        const big = alloy && odd.some(([rr, cc]) => rr === r && cc === c), shift = r < 2 ? slip : 0, x = 110 + c * 44 + shift, y = 60 + r * 44 + (big ? 0 : 0);
        s += `<circle class="f ${big ? "cr dk" : "cb"}" cx="${x}" cy="${y}" r="${big ? (st.a === "steel" ? 12 : 26) : 21}"/>`;
      }
      s += `<path class="l w3" style="--fc:var(--c-temp)" d="M20 82H${70 + Math.min(40, st.F / 2)}"/><path class="mk" style="--fc:var(--c-temp)" d="M${78 + Math.min(40, st.F / 2)} 82l-10 -6v12z"/><text x="20" y="66">force</text>
        <path class="guide" d="M90 104H560"/><text x="560" y="98" text-anchor="end" style="font-size:10px">${alloy ? "different-sized atoms block sliding" : st.F ? "layers slide" : "layers of identical atoms"}</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["metal", A[st.a][0]], ["force", `${st.F}%`], ["layers moved", alloy ? "hardly at all" : `${Math.round(slip)} px`], ["property", A[st.a][2]]]);
      exp.innerHTML = chips([[alloy ? "Alloy" : "Pure metal"], [alloy ? "harder, stronger" : "malleable", alloy ? "up" : ""]]) + `<h3>${alloy ? "Different-sized atoms stop the layers sliding" : "Identical atoms in regular layers slide"}</h3><p>An <b>alloy</b> is a mixture of a metal with other elements. ${alloy ? "The atoms of the added element are a different size, so they <b>distort the regular layers</b>; it is much harder for the layers to slide over each other, so the alloy is <b>harder and stronger</b> than the pure metal." : "In a pure metal all the atoms are the same size and arranged in regular layers, so the layers <b>slide over each other</b> easily: pure metals are soft and malleable."} Alloys can also resist corrosion (stainless steel) and look attractive (brass).</p>` + flow(["add atoms of another size", "layers distorted", "harder to slide", "harder, stronger metal"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { a: "pure", F: 0 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- reactivity series tests ---------- */
  function reactivityLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // per metal: [cold water, steam, dilute acid] as [intensity 0–5, observation, equation]
    const R = {
      K: [[5, "violent: floats, lilac flame", "2K + 2H₂O → 2KOH + H₂"], [5, "explosive — never done", ""], [5, "explosive — never done", ""]],
      Na: [[4, "floats, melts, fizzes, moves around", "2Na + 2H₂O → 2NaOH + H₂"], [5, "explosive — never done", ""], [5, "explosive — never done", ""]],
      Ca: [[3, "sinks, fizzes steadily, goes cloudy", "Ca + 2H₂O → Ca(OH)₂ + H₂"], [4, "vigorous", ""], [4, "very vigorous fizzing", "Ca + 2HCl → CaCl₂ + H₂"]],
      Mg: [[1, "a few bubbles very slowly", "Mg + 2H₂O → Mg(OH)₂ + H₂"], [4, "burns with a bright white light", "Mg + H₂O → MgO + H₂"], [3, "rapid fizzing", "Mg + 2HCl → MgCl₂ + H₂"]],
      Zn: [[0, "no visible reaction", ""], [2, "reacts when heated", "Zn + H₂O → ZnO + H₂"], [2, "steady fizzing", "Zn + 2HCl → ZnCl₂ + H₂"]],
      Fe: [[0, "no visible reaction (rusts slowly)", ""], [1, "reacts slowly when red hot", "3Fe + 4H₂O → Fe₃O₄ + 4H₂"], [1, "slow fizzing", "Fe + 2HCl → FeCl₂ + H₂"]],
      Cu: [[0, "no reaction", ""], [0, "no reaction", ""], [0, "no reaction", ""]],
      Ag: [[0, "no reaction", ""], [0, "no reaction", ""], [0, "no reaction", ""]]
    };
    const TEST = { water: 0, steam: 1, acid: 2 };
    let st = { m: "Mg", test: "acid" }, t = 0;
    function draw() {
      const disp = st.test === "cuso4", above = SERIES.indexOf(st.m) < SERIES.indexOf("Cu");
      const [n, seen] = disp ? [above ? 2 : 0, above ? "brown copper forms, blue colour fades" : "no reaction"] : R[st.m][TEST[st.test]];
      let s = ladder(30, st.m) + `<path class="glass" d="M250 60V220a40 40 0 0 0 80 0V60"/><rect class="liq" style="--lc:${disp ? "var(--blue)" : st.test === "acid" ? "var(--red)" : "var(--teal)"}" x="252" y="110" width="76" height="${disp && above ? 150 : 150}"/>
        <rect class="f ${disp && above ? "ca" : ""} dk" x="278" y="200" width="24" height="44" rx="3"/>`;
      if (st.test === "steam") s = ladder(30, st.m) + `<rect class="glass" x="220" y="120" width="220" height="40" rx="18"/><rect class="f dk" x="300" y="128" width="40" height="24" rx="4"/><path class="l" style="--fc:var(--amber)" d="M310 200q10 -24 10 -34q10 14 10 34"/><text x="230" y="110">steam →</text>${n >= 4 ? `<circle cx="320" cy="140" r="22" fill="#fff" opacity=".6"/>` : ""}`;
      else for (let k = 0; k < n * 4; k++) s += `<circle class="shell" cx="${280 + ((k * 13) % 24)}" cy="${195 - ((t * (1 + n) + k * 19) % 80)}" r="${2 + (k % 3)}"/>`;
      s += `<text x="470" y="80" class="k">${{ water: "cold water", steam: "steam", acid: "dilute hydrochloric acid", cuso4: "copper(II) sulfate solution" }[st.test]}</text><text x="470" y="104" style="font-size:11px">${seen}</text>`;
      svg.innerHTML = s;
      const eq = disp ? (above ? `${st.m} + CuSO₄ → ${st.m}SO₄ + Cu` : "") : R[st.m][TEST[st.test]][2];
      res.innerHTML = rows([["metal", st.m], ["test", { water: "cold water", steam: "steam", acid: "dilute hydrochloric acid", cuso4: "copper(II) sulfate solution" }[st.test]], ["observation", seen], ["equation", eq || "—"]]);
      exp.innerHTML = chips([[n ? "Reacts" : "No reaction", n ? "up" : ""], [`${st.m} in the series`]]) + `<h3>The reactivity series from experiments</h3><p>Metals are put in order of reactivity by how vigorously they react: K, Na, Ca, Mg, Al, (C), Zn, Fe, (H), Cu, Ag, Au. With <b>water</b> a metal gives a <b>hydroxide</b> and hydrogen; with <b>steam</b>, an <b>oxide</b> and hydrogen; with <b>dilute acid</b>, a salt and hydrogen. Metals below hydrogen do not react with acids. <span class="tag-s">Supp.</span> A more reactive metal <b>displaces</b> a less reactive one from a solution of its salt, because it loses electrons more easily to form a positive ion. Aluminium seems unreactive because of its protective oxide layer.</p>` + flow(["higher in the series", "loses electrons more easily", "reacts more vigorously", "displaces metals below it"]);
    }
    const paint = controls(lab, st, () => { paint(); t = 0; draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { m: "Mg", test: "acid" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
    window.StayAdd.kit.loop(lab, () => { t++; draw(); }, 60);
  }

  /* ---------- rusting ---------- */
  function rustLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const P = { none: ["no protection", ""], paint: ["painted (barrier)", "cb"], grease: ["greased (barrier)", "ca"], galv: ["galvanised: zinc coating", "ct"], sac: ["sacrificial magnesium block", "cv"] };
    let st = { water: true, air: true, salt: false, prot: "none", days: 7 };
    function draw() {
      const barrier = st.prot === "paint" || st.prot === "grease", sacr = st.prot === "galv" || st.prot === "sac";
      const rusts = st.water && st.air && !barrier && !sacr, amt = rusts ? Math.min(1, (st.days / 14) * (st.salt ? 1.8 : 1)) : 0;
      let s = `<path class="glass" d="M240 30V230a40 40 0 0 0 80 0V30"/>${st.water ? `<rect class="liq" style="--lc:${st.salt ? "var(--teal)" : "var(--blue)"}" x="242" y="140" width="76" height="128"/>` : ""}${!st.air ? `<rect class="f dk" x="242" y="30" width="76" height="16"/><text x="340" y="42" style="font-size:11px">oil layer / boiled water: no air</text>` : ""}
        <rect class="f ${P[st.prot][1] || ""} ${st.prot === "none" ? "" : "dk"}" x="${st.prot === "none" ? 274 : 270}" y="60" width="${st.prot === "none" ? 12 : 20}" height="190" rx="3"/><rect class="f dk" x="264" y="52" width="32" height="10" rx="2"/>
        ${st.prot === "sac" ? `<rect class="f cv dk" x="288" y="200" width="22" height="30" rx="3"/><text x="340" y="220" style="font-size:11px">Mg block corrodes instead</text>` : ""}`;
      for (let k = 0; k < Math.round(amt * 14); k++) s += `<circle cx="${276 + ((k * 7) % 10)}" cy="${80 + ((k * 37) % 160)}" r="${3 + (k % 3)}" fill="#a0522d" opacity=".85"/>`;
      s += `<text x="80" y="70" class="k">water</text><text x="80" y="90">${st.water ? "✓" : "✗"}</text><text x="80" y="130" class="k">oxygen (air)</text><text x="80" y="150">${st.air ? "✓" : "✗"}</text><text x="80" y="190" class="k">salt</text><text x="80" y="210">${st.salt ? "✓" : "✗"}</text>
        <text x="420" y="90" class="k">${rusts ? "rusting" : "no rust"}</text><text x="420" y="112" style="font-size:11px">after ${st.days} days</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["conditions", [st.water && "water", st.air && "oxygen", st.salt && "salt"].filter(Boolean).join(" + ") || "dry, no air"], ["protection", P[st.prot][0]], ["result", rusts ? (amt > 0.7 ? "badly rusted" : "some rust") : "no rust"], ["rust", "hydrated iron(III) oxide"]]);
      exp.innerHTML = chips([[rusts ? "Rusts" : "Protected", rusts ? "warn" : "up"]]) + `<h3>Iron needs both water and oxygen to rust</h3><p><b>Rust</b> is hydrated iron(III) oxide. Iron rusts only when <b>both water and oxygen</b> are present; salt water speeds it up. <b>Barrier methods</b> (paint, grease, plastic coating) keep water and oxygen away, but fail once scratched. <span class="tag-s">Supp.</span> <b>Galvanising</b> (coating with zinc) and <b>sacrificial protection</b> (attaching a more reactive metal such as magnesium or zinc) work even when scratched: the more reactive metal loses electrons and corrodes <b>instead of</b> the iron.</p>` + flow(["iron + water + oxygen", "rust", "barrier keeps them away", "or a more reactive metal corrodes first"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { water: true, air: true, salt: false, prot: "none", days: 7 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- extraction ---------- */
  function extractLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const X = {
      Fe: ["iron", "hematite, Fe₂O₃", "reduction with carbon (blast furnace)", ["C + O₂ → CO₂ (burning coke heats the furnace)", "CO₂ + C → 2CO", "Fe₂O₃ + 3CO → 2Fe + 3CO₂", "CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ (slag)"]],
      Al: ["aluminium", "bauxite, Al₂O₃", "electrolysis of molten aluminium oxide in cryolite", ["cathode: Al³⁺ + 3e⁻ → Al", "anode: 2O²⁻ → O₂ + 4e⁻", "the carbon anodes burn away in the oxygen: C + O₂ → CO₂", "cryolite lowers the operating temperature, saving energy"]],
      Zn: ["zinc", "zinc blende, ZnS", "roast, then reduce with carbon", ["2ZnS + 3O₂ → 2ZnO + 2SO₂ (roasting)", "ZnO + C → Zn + CO", "the zinc is distilled off as a vapour"]]
    };
    let st = { m: "Fe" };
    function draw() {
      const [name, ore, how] = X[st.m];
      let s = ladder(20, st.m, { C: `<path class="guide" d="M88 ${20 + 5 * 21 + 9}H150"/><text x="152" y="${20 + 5 * 21 + 13}" style="font-size:10px">above carbon: electrolysis</text>` });
      if (st.m === "Fe") s += `<path class="glass" d="M330 30H410L440 230H300Z"/><path class="f ca lt" d="M318 120H422L432 190H308Z"/><rect class="f cr dk" x="304" y="210" width="132" height="18"/><rect class="f lt" x="306" y="194" width="128" height="14"/>
        <text x="370" y="22" text-anchor="middle" style="font-size:11px">coke, hematite, limestone in</text><path class="ar" d="M280 205H300"/><text x="276" y="200" text-anchor="end" style="font-size:11px">hot air</text>
        <text x="450" y="206" style="font-size:11px">slag</text><text x="450" y="224" style="font-size:11px">molten iron</text><text x="370" y="160" text-anchor="middle" style="font-size:11px">CO reduces Fe₂O₃</text>`;
      if (st.m === "Al") s += `<rect class="f lt" x="290" y="120" width="190" height="120" rx="4"/><rect class="liq" style="--lc:var(--amber)" x="296" y="150" width="178" height="70"/><rect class="f cr dk" x="296" y="220" width="178" height="14"/>
        <rect class="f dk" x="320" y="70" width="24" height="110"/><rect class="f dk" x="372" y="70" width="24" height="110"/><rect class="f dk" x="424" y="70" width="24" height="110"/>
        <text x="385" y="60" text-anchor="middle" style="font-size:11px">carbon anodes (+)</text><text x="385" y="262" text-anchor="middle" style="font-size:11px">carbon lining = cathode (−), molten Al collects</text><text x="300" y="196" style="font-size:10px">Al₂O₃ in molten cryolite</text>`;
      if (st.m === "Zn") s += `<rect class="f lt" x="290" y="80" width="90" height="60" rx="6"/><text x="335" y="114" text-anchor="middle">ZnS</text><path class="ar" d="M384 110H420"/><text x="402" y="100" text-anchor="middle" style="font-size:10px">roast</text>
        <rect class="f lt" x="424" y="80" width="90" height="60" rx="6"/><text x="469" y="114" text-anchor="middle">ZnO</text><path class="ar" d="M469 144V180"/><text x="476" y="166" style="font-size:10px">+ carbon, heat</text>
        <rect class="f ct dk" x="424" y="184" width="90" height="60" rx="6"/><text x="469" y="218" text-anchor="middle" class="k">Zn</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["metal", name], ["ore", ore], ["method", how], ...X[st.m][3].map((e, i) => [i ? "" : "equations", e])]);
      exp.innerHTML = chips([[how.split(" ")[0] === "electrolysis" ? "Electrolysis" : "Carbon reduction"], [ore]]) + `<h3>Where the metal sits decides the method</h3><p>Metals <b>above carbon</b> in the reactivity series (like aluminium) must be extracted by <b>electrolysis</b>, which needs a lot of electricity. Metals <b>below carbon</b> (zinc, iron) can be extracted by heating their oxide with <b>carbon</b> (or carbon monoxide), which removes the oxygen — a reduction. Very unreactive metals such as gold are found as the element. ${st.m === "Fe" ? "<span class='tag-s'>Supp.</span> In the blast furnace, limestone decomposes to calcium oxide, which removes acidic silicon dioxide impurities as slag." : st.m === "Al" ? "<span class='tag-s'>Supp.</span> Aluminium oxide is dissolved in molten <b>cryolite</b> to lower its melting point; the oxygen made at the anode burns the carbon anodes, which must be replaced." : ""}</p>` + flow(["ore (metal compound)", "remove oxygen or reduce ions", "metal", "method set by reactivity"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.m = "Fe"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ alloy: alloyLab, reactivity: reactivityLab, rust: rustLab, extract: extractLab });
})();
