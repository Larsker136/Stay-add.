/* ==========================================================================
   stay add. — Chemistry topic 7, Acids, bases & salts: the labs
   ph      seven solutions with four indicators: colour, pH and the ions present,
           including strong and weak acids
   oxides  test an oxide with acid and with alkali: basic, acidic, amphoteric, neutral
   salts   choose a salt: the method (excess solid, titration or precipitation)
           drawn as steps, with the equation
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs } = window.StayAdd.kit;
  const UI = ["#c4302b", "#d8452b", "#e8662a", "#ef8f2a", "#f2b92c", "#d8d23a", "#8cc63f", "#3fae5a", "#2f9e8a", "#2a8fb0", "#2c6fc0", "#3a52c0", "#4a3cb0", "#5a2ca0", "#6a1f90"];

  /* ---------- pH and indicators ---------- */
  function phLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // name, pH, kind, strong/weak note
    const S = { hcl: ["hydrochloric acid (0.1 mol/dm³)", 1, "acid", "strong"], ethanoic: ["ethanoic acid (0.1 mol/dm³)", 3, "acid", "weak"], water: ["pure water", 7, "neutral", ""], nacl: ["sodium chloride solution", 7, "neutral", ""], nahco3: ["sodium hydrogencarbonate solution", 8, "alkali", "weak"], ammonia: ["ammonia solution", 11, "alkali", "weak"], naoh: ["sodium hydroxide (0.1 mol/dm³)", 13, "alkali", "strong"] };
    // indicator colour for a pH: [css colour, name]
    const IND = {
      universal: (p) => [UI[Math.round(p)], ["red", "red", "orange-red", "orange", "yellow", "yellow", "yellow-green", "green", "blue-green", "blue-green", "blue", "blue", "indigo", "violet", "violet"][Math.round(p)]],
      litmus: (p) => (p < 5 ? ["#c4302b", "red"] : p > 8 ? ["#2c6fc0", "blue"] : ["#7a4c9a", "purple"]),
      methyl: (p) => (p < 3.1 ? ["#c4302b", "red"] : p > 4.4 ? ["#f2c42c", "yellow"] : ["#ef8f2a", "orange"]),
      thymol: (p) => (p < 9.4 ? ["transparent", "colourless"] : ["#2c6fc0", "blue"])
    };
    const INAME = { universal: "universal indicator", litmus: "litmus", methyl: "methyl orange", thymol: "thymolphthalein" };
    let st = { s: "hcl", ind: "universal" };
    function draw() {
      const [name, pH, kind, sw] = S[st.s], [col, cname] = IND[st.ind](pH);
      let s = `<path class="glass" d="M70 40V230a30 30 0 0 0 60 0V40"/><path d="M72 120V230a28 28 0 0 0 56 0V120Z" fill="${col}" opacity="${col === "transparent" ? 0 : 0.75}"/><path class="l" d="M72 120H128"/>
        <text x="100" y="286" text-anchor="middle">${cname}</text>`;
      UI.forEach((c, i) => { s += `<rect x="${180 + i * 30}" y="40" width="30" height="26" fill="${c}"/><text x="${195 + i * 30}" y="84" text-anchor="middle" style="font-size:10px">${i}</text>`; });
      s += `<path class="mk" d="M${195 + pH * 30} 36l-7 -12h14z"/><text x="${195 + pH * 30}" y="18" text-anchor="middle" class="k">pH ${pH}</text>
        <text x="180" y="104" style="font-size:10px">← more acidic</text><text x="630" y="104" text-anchor="end" style="font-size:10px">more alkaline →</text>`;
      // particle view: H⁺ vs OH⁻ and, for weak acids, molecules that have not ionised
      const nH = kind === "acid" ? (sw === "strong" ? 10 : 3) : kind === "neutral" ? 1 : 0, nOH = kind === "alkali" ? (sw === "strong" ? 10 : 3) : kind === "neutral" ? 1 : 0, nU = sw === "weak" ? 7 : 0;
      s += `<rect class="f lt" x="200" y="130" width="400" height="140" rx="8"/><text x="210" y="148" style="font-size:10px">in the solution</text>`;
      const pts = []; for (let i = 0; i < nH; i++) pts.push(["H⁺", "cr"]); for (let i = 0; i < nOH; i++) pts.push(["OH⁻", "cb"]); for (let i = 0; i < nU; i++) pts.push([kind === "acid" ? "CH₃COOH" : st.s === "ammonia" ? "NH₃" : "HCO₃⁻", ""]);
      pts.forEach(([t, c], i) => { const x = 240 + (i % 6) * 62, y = 172 + Math.floor(i / 6) * 34; s += `<rect class="f ${c} ${c ? "dk" : "lt"}" x="${x - 26}" y="${y - 12}" width="52" height="22" rx="11"/><text x="${x}" y="${y + 3}" text-anchor="middle" style="font-size:10px">${t}</text>`; });
      svg.innerHTML = s;
      res.innerHTML = rows([["solution", name], ["pH", pH], ["type", kind === "neutral" ? "neutral" : `${sw} ${kind}`], [INAME[st.ind], cname]]);
      exp.innerHTML = chips([[`pH ${pH}`], [kind === "neutral" ? "neutral" : `${sw} ${kind}`]]) + `<h3>${kind === "acid" ? "Acids make H⁺ ions in water" : kind === "alkali" ? "Alkalis make OH⁻ ions in water" : "Neutral: pH 7"}</h3><p>The <b>pH scale</b> runs from 0 to 14: below 7 is acidic, 7 is neutral, above 7 is alkaline. ${kind === "acid" ? "Acids release <b>hydrogen ions, H⁺</b>, in water; the lower the pH, the higher the H⁺ concentration." : kind === "alkali" ? "Alkalis are soluble bases; they release <b>hydroxide ions, OH⁻</b>, in water." : "Equal (tiny) amounts of H⁺ and OH⁻."} ${sw === "strong" ? "<span class='tag-s'>Supp.</span> A <b>strong</b> acid or alkali is <b>completely</b> ionised in water." : sw === "weak" ? "<span class='tag-s'>Supp.</span> A <b>weak</b> acid or alkali is only <b>partially</b> ionised, so at the same concentration its pH is closer to 7." : ""} ${INAME[st.ind].charAt(0).toUpperCase() + INAME[st.ind].slice(1)} is ${cname} here.</p><p><span class="tag-s">Supp.</span> Acids are <b>proton (H⁺) donors</b>; bases are <b>proton acceptors</b>. Neutralisation: <b>H⁺(aq) + OH⁻(aq) → H₂O(l)</b>.</p>` + flow(["acid: H⁺", "alkali: OH⁻", "neutralisation", "salt + water"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { s: "hcl", ind: "universal" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- classifying oxides ---------- */
  function oxidesLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // formula, name, type, reacts with acid?, with alkali?, acid equation, alkali equation, in water
    const O = {
      MgO: ["magnesium oxide", "basic", true, false, "MgO + 2HCl → MgCl₂ + H₂O", "", "slightly alkaline"],
      CuO: ["copper(II) oxide", "basic", true, false, "CuO + H₂SO₄ → CuSO₄ + H₂O", "", "insoluble"],
      Na2O: ["sodium oxide", "basic", true, false, "Na₂O + 2HCl → 2NaCl + H₂O", "", "dissolves to make NaOH (pH 14)"],
      SO2: ["sulfur dioxide", "acidic", false, true, "", "SO₂ + 2NaOH → Na₂SO₃ + H₂O", "dissolves: acidic (acid rain)"],
      CO2: ["carbon dioxide", "acidic", false, true, "", "CO₂ + 2NaOH → Na₂CO₃ + H₂O", "dissolves: weakly acidic"],
      Al2O3: ["aluminium oxide", "amphoteric", true, true, "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O", "Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O", "insoluble"],
      ZnO: ["zinc oxide", "amphoteric", true, true, "ZnO + 2HCl → ZnCl₂ + H₂O", "ZnO + 2NaOH → Na₂ZnO₂ + H₂O", "insoluble"],
      CO: ["carbon monoxide", "neutral", false, false, "", "", "insoluble"]
    };
    let st = { ox: "MgO" };
    function draw() {
      const [name, type, wa, wb, ea, eb, water] = O[st.ox], f = st.ox.replace(/(\d)/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);
      const tube = (x, label, yes, c) => `<path class="glass" d="M${x - 30} 70V210a30 30 0 0 0 60 0V70"/><rect class="liq" style="--lc:${c}" x="${x - 28}" y="130" width="56" height="${yes ? 108 : 108}"/>${yes ? "" : `<rect class="f dk" x="${x - 14}" y="222" width="28" height="12" rx="3"/>`}
        <text x="${x}" y="56" text-anchor="middle" class="k">${label}</text><text x="${x}" y="${270}" text-anchor="middle" class="tc" style="--fc:${yes ? "var(--green)" : "var(--ink-3)"}">${yes ? "✓ reacts: salt + water" : "✗ no reaction"}</text>`;
      svg.innerHTML = tube(150, "+ dilute acid", wa, "var(--red)") + tube(330, "+ sodium hydroxide", wb, "var(--blue)") +
        `<text x="480" y="90" class="mono-b" style="font-size:30px">${f}</text><text x="480" y="114">${name}</text><text x="480" y="150" class="k">${type} oxide</text><text x="480" y="174" style="font-size:11px">${["MgO", "CuO", "Na2O", "Al2O3", "ZnO"].includes(st.ox) ? "oxide of a metal" : "oxide of a non-metal"}</text>`;
      res.innerHTML = rows([["oxide", `${f}, ${name}`], ["type", type], ["with acid", wa ? ea : "no reaction"], ["with alkali", wb ? eb : "no reaction"], ["in water", water]]);
      const txt = { basic: "Most <b>metal oxides are basic</b>: they react with acids to make a salt and water.", acidic: "Most <b>non-metal oxides are acidic</b>: they react with alkalis to make a salt and water, and many dissolve in water to make acidic solutions.", amphoteric: "<span class='tag-s'>Supp.</span> An <b>amphoteric</b> oxide reacts with <b>both</b> acids and bases to make a salt and water — aluminium oxide and zinc oxide.", neutral: "A few non-metal oxides, such as carbon monoxide, are <b>neutral</b>: they react with neither acids nor alkalis." }[type];
      exp.innerHTML = chips([[`${type} oxide`]]) + `<h3>Classify oxides by what they react with</h3><p>${txt} A <b>base</b> is a substance that neutralises an acid; an alkali is a base that dissolves in water.</p>` + flow(["metal oxide → basic", "non-metal oxide → acidic", "Al₂O₃, ZnO → amphoteric (Supp.)"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.ox = "MgO"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- preparing salts ---------- */
  function saltsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // name, method, equation, soluble?
    const S = {
      cuso4: ["copper(II) sulfate", "excess", "CuO(s) + H₂SO₄(aq) → CuSO₄(aq) + H₂O(l)", "copper(II) oxide"],
      mgso4: ["magnesium sulfate", "excess", "MgCO₃(s) + H₂SO₄(aq) → MgSO₄(aq) + H₂O(l) + CO₂(g)", "magnesium carbonate"],
      zncl2: ["zinc chloride", "excess", "Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)", "zinc"],
      nacl: ["sodium chloride", "titration", "NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(l)", ""],
      kno3: ["potassium nitrate", "titration", "KOH(aq) + HNO₃(aq) → KNO₃(aq) + H₂O(l)", ""],
      nh4so4: ["ammonium sulfate", "titration", "2NH₃(aq) + H₂SO₄(aq) → (NH₄)₂SO₄(aq)", ""],
      baso4: ["barium sulfate", "precipitation", "BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s) + 2NaCl(aq)", ""],
      agcl: ["silver chloride", "precipitation", "AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)", ""]
    };
    const beaker = (x, c, solid) => `<path class="glass" d="M${x - 30} 100V170H${x + 30}V100"/><rect class="liq" style="--lc:${c}" x="${x - 28}" y="125" width="56" height="43"/>${solid ? `<path class="f dk" d="M${x - 20} 168h40l-6 -8h-28z"/>` : ""}`;
    const funnel = (x) => `<path class="glass" d="M${x - 34} 100L${x} 140V160"/><path class="glass" d="M${x + 34} 100L${x} 140"/><path class="l dash" d="M${x - 28} 104L${x} 136L${x + 28} 104"/><path class="glass" d="M${x - 24} 175V215H${x + 24}V175"/><rect class="liq" style="--lc:var(--blue)" x="${x - 22}" y="195" width="44" height="18"/>`;
    const basin = (x) => `<path class="glass" d="M${x - 36} 130Q${x} 175 ${x + 36} 130"/><rect class="liq" style="--lc:var(--blue)" x="${x - 28}" y="134" width="56" height="10"/><path class="l" style="--fc:var(--amber)" d="M${x - 6} 210q6 -18 6 -26q6 10 6 26"/><path class="glass" d="M${x - 30} 186H${x + 30}"/>`;
    const crystals = (x) => `${[[-16, 0], [0, -6], [14, 2], [-4, 10], [10, 14]].map(([dx, dy]) => `<rect class="f cb dk" x="${x + dx - 6}" y="${150 + dy}" width="12" height="12" transform="rotate(45 ${x + dx} ${156 + dy})"/>`).join("")}<path class="glass" d="M${x - 34} 180H${x + 34}"/>`;
    const burette = (x) => `<rect class="glass" x="${x - 6}" y="40" width="12" height="110"/><rect class="liq" style="--lc:var(--blue)" x="${x - 5}" y="70" width="10" height="78"/><path class="glass" d="M${x} 150V160"/><path class="glass" d="M${x - 24} 200L${x - 10} 170V164H${x + 10}V170L${x + 24} 200Z"/>`;
    const STEPS = {
      excess: [["add the solid to warm acid until no more reacts (excess)", (x) => beaker(x, "var(--blue)", true)], ["filter to remove the excess solid", funnel], ["heat the filtrate to the crystallisation point", basin], ["cool, filter off the crystals and dry them", crystals]],
      titration: [["titrate acid with alkali using an indicator to find the volumes", burette], ["repeat with the same volumes but no indicator", (x) => beaker(x, "var(--line-2)", false)], ["heat the solution to the crystallisation point", basin], ["cool, filter off the crystals and dry them", crystals]],
      precipitation: [["mix two solutions that contain the ions of the salt", (x) => beaker(x, "var(--line-2)", true)], ["filter off the insoluble salt (the precipitate)", funnel], ["wash the solid with distilled water", (x) => beaker(x, "var(--blue)", true)], ["leave the solid to dry", (x) => `<path class="f dk" d="M${x - 26} 168h52l-8 -14h-36z"/><path class="glass" d="M${x - 34} 170H${x + 34}"/>`]]
    };
    let st = { salt: "cuso4" };
    function draw() {
      const [name, m, eq, solid] = S[st.salt];
      svg.innerHTML = STEPS[m].map(([t, pic], i) => { const x = 80 + i * 160; return `<text x="${x}" y="28" text-anchor="middle" class="k">${i + 1}</text>${pic(x)}${i < 3 ? `<path class="ar" d="M${x + 50} 150H${x + 106}"/><path class="ar-h" d="M${x + 106} 150l-8 -5v10z"/>` : ""}<foreignObject x="${x - 72}" y="230" width="144" height="60"><div xmlns="http://www.w3.org/1999/xhtml" style="font:11px/1.3 var(--font-sans);color:var(--ink-2);text-align:center">${t}</div></foreignObject>`; }).join("");
      const methodName = { excess: `react an acid with an excess of an insoluble solid (${solid})`, titration: "titration: a soluble base (alkali) or carbonate with an acid", precipitation: "precipitation: mix two soluble salts" }[m];
      res.innerHTML = rows([["salt", name], ["soluble in water?", m === "precipitation" ? "no" : "yes"], ["method", methodName], ["equation", eq]]);
      exp.innerHTML = chips([[m === "precipitation" ? "Insoluble salt" : "Soluble salt"], [m]]) + `<h3>${m === "excess" ? "Excess solid, filter, crystallise" : m === "titration" ? "Titration, then crystallise" : "Precipitate, filter, wash, dry"}</h3><p>${m === "excess" ? "Adding the solid <b>in excess</b> makes sure all the acid is used up; the leftover solid is easy to filter off. Heating to the <b>crystallisation point</b> and cooling gives crystals of the <b>hydrated</b> salt." : m === "titration" ? "Both reactants are soluble, so an excess could not be filtered off. A titration finds the exact volumes that neutralise each other; repeating without the indicator gives a pure salt solution." : "The salt is <b>insoluble</b>, so it forms as a solid when solutions of its two ions are mixed. Filter it off, wash away the other soluble salt with distilled water, and dry it."}</p><p>Solubility rules: all <b>sodium, potassium and ammonium</b> salts and all <b>nitrates</b> are soluble; <b>chlorides</b> are soluble except silver and lead; <b>sulfates</b> are soluble except barium, calcium and lead; <b>carbonates</b> are insoluble except sodium, potassium and ammonium.</p>` + flow(["is the salt soluble?", "no → precipitation", "yes, from an insoluble solid → excess", "yes, from soluble reactants → titration"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.salt = "cuso4"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ ph: phLab, oxides: oxidesLab, salts: saltsLab });
})();
