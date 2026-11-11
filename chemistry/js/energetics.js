/* ==========================================================================
   stay add. — Chemistry topic 5, Chemical energetics: the labs
   profile  reaction pathway diagrams for exothermic and endothermic reactions:
            activation energy, ΔH, a catalyst, and the thermometer
   bonds    bond energies: energy in to break bonds, energy out to make them, ΔH
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs } = window.StayAdd.kit;

  /* ---------- reaction pathway diagram ---------- */
  function profileLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // equation, ΔH kJ/mol, Ea (schematic px), temperature change seen, example
    const R = {
      methane: ["CH₄ + 2O₂ → CO₂ + 2H₂O", -890, 70, "+ (flame)", "combustion of a fuel"],
      neutral: ["HCl + NaOH → NaCl + H₂O", -57, 30, "+6 °C", "neutralisation"],
      caco3: ["CaCO₃ → CaO + CO₂", 178, 60, "needs continuous heating", "thermal decomposition"],
      nh4no3: ["NH₄NO₃(s) → NH₄NO₃(aq)", 26, 25, "−6 °C", "dissolving ammonium nitrate (used in cold packs)"]
    };
    let st = { r: "methane", cat: false };
    function draw() {
      const [eq, dH, Ea, dT, what] = R[st.r], exo = dH < 0, yR = exo ? 140 : 210, yP = exo ? 230 : 120, pk = Math.min(yR, yP) - Ea - 10, pkC = pk + (Math.min(yR, yP) - pk) * 0.55;
      const curve = (p) => `M60 ${yR}H150C210 ${yR} 220 ${p} 270 ${p}S330 ${yP} 390 ${yP}H460`;
      svg.innerHTML = `<path class="ax" d="M50 20V262H470"/><text x="50" y="14">energy</text><text x="470" y="280" text-anchor="end">progress of reaction →</text>
        <path class="plot" d="${curve(pk)}"/>${st.cat ? `<path class="plot" style="stroke:var(--c-cat);stroke-dasharray:6 4" d="${curve(pkC)}"/><text x="270" y="${pkC - 8}" text-anchor="middle" class="tc" style="--fc:var(--c-cat)">with catalyst</text>` : ""}
        <text x="70" y="${yR - 8}">reactants</text><text x="450" y="${yP - 8}" text-anchor="end">products</text>
        <path class="l" style="--fc:var(--c-energy)" d="M120 ${yR}V${pk}"/><path class="mk" style="--fc:var(--c-energy)" d="M120 ${pk}l-5 9h10z"/><text x="114" y="${(yR + pk) / 2}" text-anchor="end" class="tc" style="--fc:var(--c-energy)">Eₐ</text>
        <path class="guide" d="M120 ${pk}H270M360 ${yR}H420"/><path class="l" d="M420 ${yR}V${yP}"/><path class="mk" d="M420 ${yP}l-5 ${exo ? -9 : 9}h10z"/><text x="428" y="${(yR + yP) / 2 + 4}" class="k">ΔH ${dH > 0 ? "+" : "−"}</text>
        <rect class="f lt" x="540" y="40" width="22" height="200" rx="11"/><rect class="liq" style="--lc:var(--red)" x="545" y="${exo ? 90 : 170}" width="12" height="${exo ? 145 : 65}" rx="6"/><circle class="f cr dk" cx="551" cy="246" r="16"/>
        <text x="551" y="30" text-anchor="middle" class="k">${exo ? "gets hotter" : "gets colder"}</text>`;
      res.innerHTML = rows([["reaction", eq], ["type", what], ["ΔH", `${dH > 0 ? "+" : "−"}${Math.abs(dH)} kJ/mol (${exo ? "exothermic" : "endothermic"})`], ["temperature of surroundings", dT], ["catalyst", st.cat ? "lower Eₐ, same ΔH" : "none"]]);
      exp.innerHTML = chips([[exo ? "Exothermic" : "Endothermic", exo ? "warn" : "up"], [`ΔH ${dH > 0 ? "+" : "−"}${Math.abs(dH)} kJ/mol`]]) + `<h3>${exo ? "Energy is given out to the surroundings" : "Energy is taken in from the surroundings"}</h3><p>An <b>${exo ? "exothermic" : "endothermic"}</b> reaction ${exo ? "transfers thermal energy <b>to</b> the surroundings, so their temperature <b>rises</b>; the products have less energy than the reactants and ΔH is <b>negative</b>" : "takes in thermal energy <b>from</b> the surroundings, so their temperature <b>falls</b>; the products have more energy than the reactants and ΔH is <b>positive</b>"}. The <b>activation energy Eₐ</b> is the minimum energy colliding particles need to react — the hump on the diagram. ${st.cat ? "A <b>catalyst</b> provides a different pathway with a lower activation energy; ΔH does not change." : ""}</p>` + flow(exo ? ["reactants", "over the Eₐ hump", "products lower down", "energy released, ΔH < 0"] : ["reactants", "over the Eₐ hump", "products higher up", "energy absorbed, ΔH > 0"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { r: "methane", cat: false }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- bond energies ---------- */
  function bondsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // equation, bonds broken [bond, number, kJ/mol], bonds made
    const R = {
      hcl: ["H₂ + Cl₂ → 2HCl", [["H–H", 1, 436], ["Cl–Cl", 1, 242]], [["H–Cl", 2, 431]]],
      water: ["2H₂ + O₂ → 2H₂O", [["H–H", 2, 436], ["O=O", 1, 498]], [["O–H", 4, 464]]],
      methane: ["CH₄ + 2O₂ → CO₂ + 2H₂O", [["C–H", 4, 413], ["O=O", 2, 498]], [["C=O", 2, 805], ["O–H", 4, 464]]],
      haber: ["N₂ + 3H₂ → 2NH₃", [["N≡N", 1, 945], ["H–H", 3, 436]], [["N–H", 6, 391]]],
      hbr: ["2HBr → H₂ + Br₂", [["H–Br", 2, 366]], [["H–H", 1, 436], ["Br–Br", 1, 193]]]
    };
    let st = { rx: "methane" };
    function draw() {
      const [eq, brk, mk] = R[st.rx], sum = (l) => l.reduce((a, [, n, e]) => a + n * e, 0), IN = sum(brk), OUT = sum(mk), dH = IN - OUT;
      const k = 190 / Math.max(IN, OUT), y0 = 250, yA = y0 - IN * k, yP = yA + OUT * k;
      svg.innerHTML = `<path class="l w3" d="M60 ${y0}H170"/><text x="115" y="${y0 + 18}" text-anchor="middle">reactants</text>
        <path class="l w3" d="M250 ${yA}H390"/><text x="320" y="${yA - 8}" text-anchor="middle">separate atoms</text>
        <path class="l w3" d="M470 ${yP}H580"/><text x="525" y="${yP + 18}" text-anchor="middle">products</text>
        <path class="l w3" style="--fc:var(--c-temp)" d="M210 ${y0}V${yA + 6}"/><path class="mk" style="--fc:var(--c-temp)" d="M210 ${yA}l-6 10h12z"/><text x="204" y="${(y0 + yA) / 2}" text-anchor="end" class="tc" style="--fc:var(--c-temp)">+${IN}</text><text x="204" y="${(y0 + yA) / 2 + 14}" text-anchor="end" style="font-size:10px">break bonds</text>
        <path class="l w3" style="--fc:var(--c-press)" d="M430 ${yA}V${yP - 6}"/><path class="mk" style="--fc:var(--c-press)" d="M430 ${yP}l-6 -10h12z"/><text x="436" y="${(yA + yP) / 2}" class="tc" style="--fc:var(--c-press)">−${OUT}</text><text x="436" y="${(yA + yP) / 2 + 14}" style="font-size:10px">make bonds</text>
        <path class="guide" d="M170 ${y0}H600"/><path class="l" d="M600 ${y0}V${yP}"/><text x="596" y="${(y0 + yP) / 2}" text-anchor="end" class="k">ΔH = ${dH > 0 ? "+" : ""}${dH}</text>
        <text x="320" y="22" text-anchor="middle" class="mono-b">${eq}</text>`;
      const line = (l) => l.map(([b, n, e]) => `${n} × ${b} (${e})`).join(" + ");
      res.innerHTML = rows([["bonds broken (energy in)", `${line(brk)} = ${IN} kJ`], ["bonds made (energy out)", `${line(mk)} = ${OUT} kJ`], ["ΔH = in − out", `${IN} − ${OUT} = ${dH > 0 ? "+" : ""}${dH} kJ/mol`], ["type", dH < 0 ? "exothermic" : "endothermic"]]);
      exp.innerHTML = chips([[dH < 0 ? "Exothermic" : "Endothermic", dH < 0 ? "warn" : "up"], [`ΔH = ${dH > 0 ? "+" : ""}${dH} kJ/mol`]]) + `<h3>${dH < 0 ? "More energy out than in" : "More energy in than out"}</h3><p><b>Breaking bonds is endothermic</b> — energy must be taken in. <b>Making bonds is exothermic</b> — energy is given out. ΔH = energy needed to break the bonds in the reactants − energy released making the bonds in the products. Here ${dH < 0 ? "making the new bonds releases more energy than breaking the old ones needs, so ΔH is negative" : "breaking the old bonds needs more energy than making the new ones releases, so ΔH is positive"}.</p>` + flow(["count bonds broken", "count bonds made", "in − out", dH < 0 ? "negative: exothermic" : "positive: endothermic"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.rx = "methane"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ profile: profileLab, bonds: bondsLab });
})();
