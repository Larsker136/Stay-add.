/* ==========================================================================
   stay add. Chemistry — exam practice: Calculate it (with Read the graph) and Plan it
   StayAdd.drills[lesson][topic] = [question types], StayAdd.plans[lesson][topic] = practical
   Drawn by assets/js/practice.js, which explains every field. Molar gas volume 24 dm³ at r.t.p.
   ========================================================================== */
(function () {
  "use strict";
  const SA = (window.StayAdd = window.StayAdd || {});
  SA.drills = SA.drills || {};
  SA.plans = SA.plans || {};
  const F = (n, sf) => SA.fmt(n, sf);

  // compounds as [formula, name, [[symbol, Ar, count]…]]
  const AR = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35.5, Ca: 40, Cu: 64, Fe: 56, Zn: 65, K: 39 };
  const C = (formula, name, parts) => ({ formula, name, parts: parts.map(([s, n]) => [s, AR[s], n]) });
  const COMPOUNDS = [
    C("CaCO₃", "calcium carbonate", [["Ca", 1], ["C", 1], ["O", 3]]),
    C("H₂SO₄", "sulfuric acid", [["H", 2], ["S", 1], ["O", 4]]),
    C("NaOH", "sodium hydroxide", [["Na", 1], ["O", 1], ["H", 1]]),
    C("Ca(OH)₂", "calcium hydroxide", [["Ca", 1], ["O", 2], ["H", 2]]),
    C("(NH₄)₂SO₄", "ammonium sulfate", [["N", 2], ["H", 8], ["S", 1], ["O", 4]]),
    C("MgCl₂", "magnesium chloride", [["Mg", 1], ["Cl", 2]]),
    C("CuSO₄", "copper(II) sulfate", [["Cu", 1], ["S", 1], ["O", 4]]),
    C("Al₂O₃", "aluminium oxide", [["Al", 2], ["O", 3]]),
    C("NH₄NO₃", "ammonium nitrate", [["N", 2], ["H", 4], ["O", 3]]),
    C("CO₂", "carbon dioxide", [["C", 1], ["O", 2]]),
    C("C₆H₁₂O₆", "glucose", [["C", 6], ["H", 12], ["O", 6]]),
    C("Fe₂O₃", "iron(III) oxide", [["Fe", 2], ["O", 3]]),
    C("KNO₃", "potassium nitrate", [["K", 1], ["N", 1], ["O", 3]])
  ];
  const mr = (c) => c.parts.reduce((s, [, ar, n]) => s + ar * n, 0);
  const arList = (c) => c.parts.map(([s, ar]) => `${s} = ${ar}`).join(", ");
  const mrSum = (c) => c.parts.map(([s, ar, n]) => (n > 1 ? `${n} × ${ar}` : `${ar}`)).join(" + ");

  Object.assign(SA.drills, {
    "ch-atoms-elements-compounds": {
      "atomic-structure": [
        { id: "ar", title: "Relative atomic mass from isotopes",
          v: ({ r, p }) => ({ e: p([["chlorine", 35, 37], ["copper", 63, 65], ["boron", 10, 11], ["bromine", 79, 81], ["lithium", 6, 7], ["gallium", 69, 71]]), p1: r(20, 80) }),
          q: ({ e, p1 }) => `A sample of ${e[0]} is ${p1}% ${e[0]}-${e[1]} and ${100 - p1}% ${e[0]}-${e[2]}. Calculate the relative atomic mass of ${e[0]}.`,
          a: ({ e, p1 }) => (e[1] * p1 + e[2] * (100 - p1)) / 100, unit: "", tol: 0.002,
          steps: ({ e, p1 }) => [`Ar = (mass × % of each isotope, added) ÷ 100`, `= (${e[1]} × ${p1} + ${e[2]} × ${100 - p1}) ÷ 100`, `= (${e[1] * p1} + ${e[2] * (100 - p1)}) ÷ 100`],
          traps: ({ e }) => [[(e[1] + e[2]) / 2, "You took a simple average. Weight each isotope by how common it is."]] },
        { id: "particles", title: "Protons, neutrons and electrons",
          v: ({ p }) => ({ n: p([["sodium-23", 23, 11], ["potassium-39", 39, 19], ["calcium-40", 40, 20], ["aluminium-27", 27, 13], ["iron-56", 56, 26], ["chlorine-37", 37, 17]]) }),
          q: ({ n }) => `How many neutrons are in an atom of ${n[0]}? (proton number ${n[2]})`,
          a: ({ n }) => n[1] - n[2], unit: "", tol: 0,
          steps: ({ n }) => [`neutrons = mass number − proton number = ${n[1]} − ${n[2]}`],
          traps: ({ n }) => [[n[2], "That is the number of protons (and electrons). Subtract it from the mass number."]] }
      ]
    },

    "ch-stoichiometry": {
      "formulae": [
        { id: "mr", title: "Relative formula mass",
          v: ({ p }) => ({ c: p(COMPOUNDS) }),
          q: ({ c }) => `Calculate the relative formula mass, Mr, of ${c.name}, ${c.formula}. (Ar: ${arList(c)})`,
          a: ({ c }) => mr(c), unit: "", tol: 0.001,
          steps: ({ c }) => [`Add the Ar of every atom in ${c.formula}`, `Mr = ${mrSum(c)}`],
          traps: ({ c }) => [[c.parts.reduce((s, [, ar]) => s + ar, 0), "Multiply each Ar by the number of those atoms in the formula (remember the numbers after brackets)."]] },
        { id: "percent", title: "Percentage by mass",
          v: ({ p }) => { const c = p(COMPOUNDS.filter((x) => x.parts.length > 1)); return { c, e: p(c.parts) }; },
          q: ({ c, e }) => `Calculate the percentage by mass of ${e[0]} in ${c.name}, ${c.formula}. (Ar: ${arList(c)})`,
          a: ({ c, e }) => ((e[1] * e[2]) / mr(c)) * 100, unit: "%",
          steps: ({ c, e }) => [`Mr of ${c.formula} = ${mrSum(c)} = ${mr(c)}`, `mass of ${e[0]} in the formula = ${e[2] > 1 ? `${e[2]} × ${e[1]} = ` : ""}${e[1] * e[2]}`, `% = ${e[1] * e[2]} ÷ ${mr(c)} × 100`],
          traps: ({ c, e }) => e[2] > 1 ? [[(e[1] / mr(c)) * 100, `There are ${e[2]} atoms of ${e[0]} in the formula: multiply its Ar by ${e[2]}.`]] : [] }
      ],
      "the-mole": [
        { id: "moles", title: "Moles from mass",
          v: ({ r, p }) => ({ c: p(COMPOUNDS), m: r(2, 200) }),
          q: ({ c, m }) => `How many moles are in ${m} g of ${c.name}, ${c.formula}? (Mr = ${mr(c)})`,
          a: ({ c, m }) => m / mr(c), unit: "mol",
          steps: ({ c, m }) => [`moles = mass ÷ Mr`, `= ${m} ÷ ${mr(c)}`],
          traps: ({ c, m }) => [[m * mr(c), "You multiplied. Moles = mass ÷ Mr."], [mr(c) / m, "You divided the wrong way round: mass ÷ Mr."]] },
        { id: "mass", title: "Mass from moles",
          v: ({ r, p }) => ({ c: p(COMPOUNDS), n: r(0.05, 3, 0.05) }),
          q: ({ c, n }) => `Calculate the mass of ${n} mol of ${c.name}, ${c.formula}. (Mr = ${mr(c)})`,
          a: ({ c, n }) => n * mr(c), unit: "g",
          steps: ({ c, n }) => [`mass = moles × Mr`, `= ${n} × ${mr(c)}`],
          traps: ({ c, n }) => [[n / mr(c), "You divided. Mass = moles × Mr."]] },
        { id: "gas", title: "Moles of gas from volume",
          v: ({ r }) => ({ V: r(60, 1200, 60) }),
          q: ({ V }) => `How many moles of gas are in ${V} cm³ at room temperature and pressure? (one mole of gas occupies 24 dm³)`,
          a: ({ V }) => V / 24000, unit: "mol",
          steps: ({ V }) => [`${V} cm³ = ${V} ÷ 1000 = ${F(V / 1000)} dm³`, `moles = volume ÷ 24 = ${F(V / 1000)} ÷ 24`],
          traps: ({ V }) => [[V / 24, "The volume is in cm³. Convert to dm³ (÷ 1000) or divide by 24 000."], [V * 24, "You multiplied. Moles = volume ÷ 24 dm³."]] },
        { id: "conc", title: "Concentration",
          v: ({ r }) => ({ n: r(0.01, 0.5, 0.01), V: r(50, 500, 25) }),
          q: ({ n, V }) => `${n} mol of a solute is dissolved to make ${V} cm³ of solution. Calculate the concentration in mol/dm³.`,
          a: ({ n, V }) => n / (V / 1000), unit: "mol/dm³",
          steps: ({ n, V }) => [`${V} cm³ = ${F(V / 1000)} dm³`, `concentration = moles ÷ volume = ${n} ÷ ${F(V / 1000)}`],
          traps: ({ n, V }) => [[n / V, "The volume must be in dm³: divide cm³ by 1000."]] },
        { id: "titration", title: "Titration",
          v: ({ r, p }) => ({ t: r(15, 28, 0.05), c: p([0.05, 0.1, 0.2]) }),
          q: ({ t, c }) => `25.0 cm³ of sodium hydroxide is neutralised by ${t.toFixed(2)} cm³ of ${c} mol/dm³ hydrochloric acid. NaOH + HCl → NaCl + H₂O. Calculate the concentration of the sodium hydroxide.`,
          a: ({ t, c }) => (c * t) / 25, unit: "mol/dm³",
          steps: ({ t, c }) => [`moles of HCl = ${c} × ${t.toFixed(2)} ÷ 1000 = ${F((c * t) / 1000)} mol`, `1 : 1, so moles of NaOH = ${F((c * t) / 1000)} mol`, `concentration = ${F((c * t) / 1000)} ÷ 0.0250`],
          traps: ({ t, c }) => [[(c * 25) / t, "You put the volumes the wrong way round: moles of acid ÷ volume of alkali."]] },
        { id: "reacting", title: "Reacting masses",
          v: ({ r, p }) => ({ x: p([["CaCO₃ → CaO + CO₂", "calcium carbonate", 100, "carbon dioxide", 44], ["2Mg + O₂ → 2MgO", "magnesium", 24, "magnesium oxide", 40], ["Zn + 2HCl → ZnCl₂ + H₂", "zinc", 65, "hydrogen", 2], ["CuCO₃ → CuO + CO₂", "copper(II) carbonate", 124, "copper(II) oxide", 80]]), m: r(2, 100) }),
          q: ({ x, m }) => `${x[0]}. Calculate the mass of ${x[3]} made from ${m} g of ${x[1]}. (Mr: ${x[1]} = ${x[2]}, ${x[3]} = ${x[4]})`,
          a: ({ x, m }) => (m / x[2]) * x[4], unit: "g",
          steps: ({ x, m }) => [`moles of ${x[1]} = ${m} ÷ ${x[2]} = ${F(m / x[2])} mol`, `the ratio in the equation is 1 : 1, so moles of ${x[3]} = ${F(m / x[2])} mol`, `mass = ${F(m / x[2])} × ${x[4]}`],
          traps: ({ x, m }) => [[m, "Mass is not conserved product by product: go through moles."], [(m / x[4]) * x[2], "You swapped the Mr values."]] },
        { id: "yield", title: "Percentage yield",
          v: ({ r }) => { const th = r(10, 80); return { th, act: +(th * r(0.5, 0.95, 0.01)).toFixed(1) }; },
          q: ({ th, act }) => `The theoretical yield of a reaction is ${th} g but only ${act} g of product is collected. Calculate the percentage yield.`,
          a: ({ th, act }) => (act / th) * 100, unit: "%",
          steps: ({ th, act }) => [`% yield = actual ÷ theoretical × 100`, `= ${act} ÷ ${th} × 100`],
          traps: ({ th, act }) => [[act / th, "Multiply by 100 for a percentage."], [(th / act) * 100, "You divided the wrong way round. A yield can't be over 100%."]] },
        { id: "empirical", title: "Empirical formula",
          v: ({ r, p }) => ({ e: p([["CH₃", [["C", 12, 1], ["H", 1, 3]]], ["CH₂", [["C", 12, 1], ["H", 1, 2]]], ["MgO", [["Mg", 24, 1], ["O", 16, 1]]], ["Fe₂O₃", [["Fe", 56, 2], ["O", 16, 3]]], ["NO₂", [["N", 14, 1], ["O", 16, 2]]], ["CO₂", [["C", 12, 1], ["O", 16, 2]]]]), s: r(0.1, 0.8, 0.1) }),
          q: ({ e, s }) => `A compound contains ${e[1].map(([el, ar, n]) => `${F(s * ar * n)} g of ${el}`).join(" and ")}. Find its empirical formula. (Ar: ${e[1].map(([el, ar]) => `${el} = ${ar}`).join(", ")})`,
          a: ({ e }) => e[0],
          check: (typed, { e }) => typed.replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080)).replace(/\s+/g, "").toLowerCase() === e[0].replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080)).toLowerCase() || "Divide each mass by its Ar, then divide by the smallest number of moles.",
          steps: ({ e, s }) => [`moles: ${e[1].map(([el, ar, n]) => `${el} = ${F(s * ar * n)} ÷ ${ar} = ${F(s * n)}`).join("; ")}`, `divide by the smallest: ${e[1].map(([el, , n]) => `${el} ${n / Math.min(...e[1].map((x) => x[2]))}`).join(", ")}`, `whole-number ratio → ${e[0]}`] }
      ]
    },

    "ch-energetics": {
      "exo-endo": [
        { id: "bonds", title: "Enthalpy change from bond energies",
          v: ({ p }) => ({ x: p([
            ["H₂ + Cl₂ → 2HCl", [["H–H", 436, 1], ["Cl–Cl", 242, 1]], [["H–Cl", 431, 2]]],
            ["H₂ + Br₂ → 2HBr", [["H–H", 436, 1], ["Br–Br", 193, 1]], [["H–Br", 366, 2]]],
            ["N₂ + 3H₂ → 2NH₃", [["N≡N", 945, 1], ["H–H", 436, 3]], [["N–H", 391, 6]]],
            ["2H₂ + O₂ → 2H₂O", [["H–H", 436, 2], ["O=O", 496, 1]], [["O–H", 463, 4]]],
            ["CH₄ + 2O₂ → CO₂ + 2H₂O", [["C–H", 412, 4], ["O=O", 496, 2]], [["C=O", 743, 2], ["O–H", 463, 4]]]
          ]) }),
          q: ({ x }) => `${x[0]}. Using the bond energies (kJ/mol) ${[...x[1], ...x[2]].map(([b, e]) => `${b} ${e}`).join(", ")}, calculate the enthalpy change, ΔH, in kJ/mol. Include the sign.`,
          a: ({ x }) => x[1].reduce((s, [, e, n]) => s + e * n, 0) - x[2].reduce((s, [, e, n]) => s + e * n, 0), unit: "kJ/mol", tol: 0.001,
          steps: ({ x }) => { const br = x[1].reduce((s, [, e, n]) => s + e * n, 0), mk = x[2].reduce((s, [, e, n]) => s + e * n, 0); return [`Energy to break bonds = ${x[1].map(([b, e, n]) => `${n} × ${e}`).join(" + ")} = ${br}`, `Energy released making bonds = ${x[2].map(([b, e, n]) => `${n} × ${e}`).join(" + ")} = ${mk}`, `ΔH = broken − made = ${br} − ${mk}`]; },
          traps: ({ x }) => { const d = x[1].reduce((s, [, e, n]) => s + e * n, 0) - x[2].reduce((s, [, e, n]) => s + e * n, 0); return [[-d, "Right size, wrong sign: ΔH = energy to break bonds − energy released making them. More released means negative (exothermic)."]]; } }
      ]
    },

    "ch-chemical-reactions": {
      "rate": [
        { id: "avg-rate", title: "Average rate",
          v: ({ r }) => ({ V: r(20, 90), t: r(10, 120, 5) }),
          q: ({ V, t }) => `A reaction gives off ${V} cm³ of gas in ${t} s. Calculate the average rate of reaction.`,
          a: ({ V, t }) => V / t, unit: "cm³/s",
          steps: ({ V, t }) => [`average rate = volume of gas ÷ time = ${V} ÷ ${t}`],
          traps: ({ V, t }) => [[t / V, "You divided the wrong way round: volume ÷ time."]] },
        { id: "gas-total", title: "Total gas from a rate graph",
          v: ({ r, p }) => ({ Vm: p([40, 48, 56, 60, 72, 80]), tau: r(8, 16) }),
          q: () => `Marble chips react with hydrochloric acid. The graph shows the volume of carbon dioxide collected. What total volume of gas was produced?`,
          a: ({ Vm }) => Vm, unit: "cm³", tol: 0.03,
          graph: ({ Vm, tau }) => { const pts = []; for (let t = 0; t <= 120; t += 2) pts.push([t, Vm * (1 - Math.exp(-t / tau))]); return { x: { label: "time / s", max: 120, step: 20 }, y: { label: "volume of gas / cm³", max: Math.ceil((Vm + 8) / 10) * 10, step: 10 }, lines: [{ pts, tc: "var(--c-energy)" }] }; },
          show: ({ Vm }) => ({ read: [[110, Vm]] }),
          steps: ({ Vm }) => [`When the reaction stops the line goes flat`, `Read across from the flat part to the volume axis: ${Vm} cm³`] },
        { id: "gas-at", title: "Volume at a given time",
          v: ({ r, p }) => ({ Vm: p([40, 48, 60, 72, 80]), tau: r(8, 16), t: p([10, 20, 30]) }),
          q: ({ t }) => `The graph shows the volume of gas collected in a reaction. What volume of gas had been collected after ${t} s?`,
          a: ({ Vm, tau, t }) => Vm * (1 - Math.exp(-t / tau)), unit: "cm³", tol: 0.06,
          graph: ({ Vm, tau }) => { const pts = []; for (let t = 0; t <= 120; t += 2) pts.push([t, Vm * (1 - Math.exp(-t / tau))]); return { x: { label: "time / s", max: 120, step: 20, minor: 10 }, y: { label: "volume of gas / cm³", max: Math.ceil((Vm + 8) / 10) * 10, step: 10, minor: 5 }, lines: [{ pts, tc: "var(--c-energy)" }] }; },
          show: ({ Vm, tau, t }) => ({ read: [[t, Vm * (1 - Math.exp(-t / tau))]] }),
          steps: ({ Vm, tau, t }) => [`Go up from ${t} s to the curve, then across to the volume axis`, `It reads about ${F(Vm * (1 - Math.exp(-t / tau)), 2)} cm³ (anything within half a small square is fine)`] }
      ]
    },

    "ch-acids-bases-salts": {
      "salts": [
        { id: "water-x", title: "Water of crystallisation",
          v: ({ r, p }) => { const s = p([["CuSO₄", "copper(II) sulfate", 160, 5], ["MgSO₄", "magnesium sulfate", 120, 7], ["Na₂CO₃", "sodium carbonate", 106, 10]]); const anh = r(1, 5, 0.1); return { s, anh, hyd: +(anh + (anh / s[2]) * s[3] * 18).toFixed(2) }; },
          q: ({ s, anh, hyd }) => `Heating ${hyd} g of hydrated ${s[1]}, ${s[0]}·xH₂O, leaves ${anh} g of the anhydrous salt. Find x. (Mr: ${s[0]} = ${s[2]}, H₂O = 18)`,
          a: ({ s }) => s[3], unit: "", tol: 0.04,
          steps: ({ s, anh, hyd }) => [`mass of water = ${hyd} − ${anh} = ${F(hyd - anh)} g`, `moles of ${s[0]} = ${anh} ÷ ${s[2]} = ${F(anh / s[2])}; moles of water = ${F(hyd - anh)} ÷ 18 = ${F((hyd - anh) / 18)}`, `x = ${F((hyd - anh) / 18)} ÷ ${F(anh / s[2])}`],
          traps: ({ s, anh, hyd }) => [[(hyd - anh) / 18, "That is the moles of water. Divide by the moles of the anhydrous salt."]] }
      ]
    },

    "ch-experimental": {
      "techniques": [
        { id: "mean-titre", title: "Mean titre",
          v: ({ r, p }) => { const b = r(20, 28, 0.05); return { b, rough: +(b + r(0.4, 1.2, 0.05)).toFixed(2), t3: +(b + p([0.05, 0.1])).toFixed(2), t4: +(b + r(0.35, 0.6, 0.05)).toFixed(2) }; },
          q: ({ b, rough, t3, t4 }) => `A student's titres are: rough ${rough.toFixed(2)}, then ${t4.toFixed(2)}, ${b.toFixed(2)} and ${t3.toFixed(2)} cm³. Calculate the mean titre using only the concordant results.`,
          a: ({ b, t3 }) => (b + t3) / 2, unit: "cm³", sf: 4, tol: 0.0005,
          steps: ({ b, t3 }) => [`Concordant = within 0.10 cm³ of each other: ${b.toFixed(2)} and ${t3.toFixed(2)}`, `Leave out the rough titre and the one that doesn't agree`, `mean = (${b.toFixed(2)} + ${t3.toFixed(2)}) ÷ 2`],
          traps: ({ b, rough, t3, t4 }) => [[(b + t3 + t4) / 3, "Only use the concordant titres — the ones within 0.10 cm³ of each other."], [(rough + b + t3 + t4) / 4, "Leave out the rough titre and any that don't agree."]] }
      ],
      "separation": [
        { id: "rf", title: "Rf value",
          v: ({ r }) => { const sol = r(6, 10, 0.1); return { sol, spot: +(sol * r(0.15, 0.9, 0.01)).toFixed(1) }; },
          q: ({ sol, spot }) => `On a chromatogram the solvent front moved ${sol} cm from the base line and a spot moved ${spot} cm. Calculate the Rf value of the spot.`,
          a: ({ sol, spot }) => spot / sol, unit: "", sf: 2, tol: 0.01,
          steps: ({ sol, spot }) => [`Rf = distance moved by the spot ÷ distance moved by the solvent`, `= ${spot} ÷ ${sol}`],
          traps: ({ sol, spot }) => [[sol / spot, "You divided the wrong way round. Rf is always less than 1."]] }
      ]
    }
  });

  Object.assign(SA.plans, {
    "ch-chemical-reactions": {
      "rate": {
        title: "Marble chips and acid", setup: "You measure how quickly carbon dioxide is given off when marble chips react with hydrochloric acid of different concentrations.",
        iv: { a: "the concentration of the acid", x: ["the volume of gas collected", "the time on the stopwatch"], why: "You choose which concentration to use each time." },
        dv: { a: "the volume of carbon dioxide collected in a set time", x: ["the concentration of the acid", "the mass of the conical flask"], why: "You read it from the gas syringe; it depends on the concentration." },
        cv: { a: ["the mass and size of the marble chips", "the volume and temperature of the acid"], x: ["the concentration of the acid", "the volume of gas collected"], why: "Surface area, amount and temperature all change the rate, so they must stay the same." },
        more: [{ q: "Why collect the gas in a gas syringe rather than over water?", a: "Carbon dioxide dissolves slightly in water, so some would not be measured", x: ["A gas syringe is quicker to set up", "Water would react with the marble", "The syringe stops the reaction getting hot"], why: "Gas dissolving in the water would make the measured volume too small." }]
      }
    },
    "ch-energetics": {
      "exo-endo": {
        title: "Temperature change of a displacement reaction", setup: "You add different metal powders to copper(II) sulfate solution in a polystyrene cup and record the temperature rise.",
        iv: { a: "the metal added", x: ["the temperature rise", "the volume of solution"], why: "That is what you change between experiments." },
        dv: { a: "the temperature rise", x: ["the metal added", "the starting temperature"], why: "You read it on the thermometer: highest temperature − starting temperature." },
        cv: { a: ["the volume and concentration of the copper(II) sulfate", "the mass of metal powder"], x: ["the metal added", "the temperature rise"], why: "More solution or more metal would change the temperature rise whatever the metal." },
        more: [{ q: "Why use a polystyrene cup with a lid?", a: "To reduce energy lost to the surroundings", x: ["To make the reaction go faster", "Because glass reacts with copper(II) sulfate", "To stop the metal floating"], why: "Polystyrene is a good insulator; less energy lost means a more accurate temperature rise." }]
      }
    },
    "ch-metals": {
      "reactivity": {
        title: "What does rusting need?", setup: "You set up iron nails in tubes with different conditions and look at them after a week.",
        iv: { a: "the conditions in each tube (air, water, or both)", x: ["the amount of rust", "the size of the nail"], why: "You choose what each nail is exposed to." },
        dv: { a: "how much rust forms after a week", x: ["the conditions in each tube", "the length of the tube"], why: "You observe it at the end." },
        cv: { a: ["the same kind and size of nail", "the same length of time"], x: ["the conditions in each tube", "the amount of rust"], why: "Different nails or times could change how much rust forms." },
        more: [{ q: "In the 'no air' tube, why is the water boiled and covered with a layer of oil?", a: "Boiling removes dissolved air, and the oil stops air dissolving back in", x: ["To kill bacteria on the nail", "To make the water hotter so it rusts faster", "Oil stops the nail touching the water"], why: "Then the nail has water but no oxygen, so you can tell whether oxygen is needed." }]
      }
    }
  });
})();
