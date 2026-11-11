/* ==========================================================================
   stay add. — Chemistry topic 11, Organic chemistry: the labs
   series     build the first members of four homologous series: displayed,
              structural and molecular formulae
   fractions  fractional distillation of crude oil: each fraction's chain length,
              boiling range, properties and use
   addition   ethane or ethene with bromine, hydrogen or steam: addition reactions
              and the bromine-water test
   polymer    addition polymers from their monomers, and condensation polymers
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs } = window.StayAdd.kit;
  const SUB = (s) => s.replace(/(\d+)/g, (d) => d.split("").map((c) => "₀₁₂₃₄₅₆₇₈₉"[c]).join(""));
  const STEM = ["", "meth", "eth", "prop", "but"];

  // a displayed formula: atoms [symbol, x, y], bonds [i, j, order]
  function mol(atoms, bonds, cls = "") {
    let s = bonds.map(([i, j, n]) => {
      const [, x1, y1] = atoms[i], [, x2, y2] = atoms[j], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, px = -uy * 3.5, py = ux * 3.5;
      const a = [x1 + ux * 11, y1 + uy * 11], b = [x2 - ux * 11, y2 - uy * 11];
      return n === 2 ? `<path class="bond" style="stroke-width:1.75" d="M${a[0] + px} ${a[1] + py}L${b[0] + px} ${b[1] + py}M${a[0] - px} ${a[1] - py}L${b[0] - px} ${b[1] - py}"/>` : `<path class="bond" style="stroke-width:1.75" d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}"/>`;
    }).join("");
    s += atoms.map(([el, x, y]) => `<text x="${x}" y="${y + 5}" text-anchor="middle" class="${el === "H" ? "" : "k"} ${cls}" style="font-size:${el === "H" ? 13 : 15}px">${el}</text>`).join("");
    return s;
  }

  /* ---------- homologous series ---------- */
  function seriesLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const INFO = {
      alkane: ["alkanes", "CₙH₂ₙ₊₂", "none (C–C single bonds only)", "saturated; burn; substitution with chlorine in UV light (Supp.)"],
      alkene: ["alkenes", "CₙH₂ₙ", "C=C double bond", "unsaturated; addition reactions; decolourise bromine water"],
      alcohol: ["alcohols", "CₙH₂ₙ₊₁OH", "–OH hydroxyl group", "burn; ethanol made by fermentation or from ethene and steam"],
      acid: ["carboxylic acids", "CₙH₂ₙ₊₁COOH", "–COOH carboxyl group", "weak acids; react with alcohols to make esters (Supp.)"]
    };
    let st = { s: "alkane", n: 2 };
    function build() {
      const n = st.s === "alkene" ? Math.max(2, st.n) : st.n, A = [], B = [], X = (i) => 170 + i * 70, Y = 145;
      for (let i = 0; i < n; i++) A.push(["C", X(i), Y]);
      for (let i = 1; i < n; i++) B.push([i - 1, i, st.s === "alkene" && i === 1 ? 2 : 1]);
      const H = (x, y, c) => { A.push(["H", x, y]); B.push([c, A.length - 1, 1]); };
      for (let i = 0; i < n; i++) {
        const last = i === n - 1, x = X(i);
        if (st.s === "alkene" && i === 0) { H(x - 46, Y - 40, i); H(x - 46, Y + 40, i); continue; }
        if (st.s === "alkene" && i === 1) { if (last) { H(x + 46, Y - 40, i); H(x + 46, Y + 40, i); } else H(x, Y - 56, i); continue; }
        if (st.s === "acid" && last) { A.push(["O", x, Y - 60]); B.push([i, A.length - 1, 2]); A.push(["O", x + 60, Y]); B.push([i, A.length - 1, 1]); H(x + 110, Y, A.length - 1); if (n === 1) H(x - 60, Y, i); continue; }
        H(x, Y - 56, i); H(x, Y + 56, i);
        if (i === 0) H(x - 60, Y, i);
        if (last) { if (st.s === "alcohol") { A.push(["O", x + 60, Y]); B.push([i, A.length - 1, 1]); H(x + 110, Y, A.length - 1); } else H(x + 60, Y, i); }
      }
      return [n, A, B];
    }
    function names(n) {
      const s = st.s, mid = "CH2".repeat(Math.max(0, n - 2));
      if (s === "alkane") return [`${STEM[n]}ane`, `C${n}H${2 * n + 2}`, n === 1 ? "CH4" : `CH3${mid}CH3`];
      if (s === "alkene") return [n === 4 ? "but-1-ene" : `${STEM[n]}ene`, `C${n}H${2 * n}`, n === 2 ? "CH2=CH2" : `CH2=CH${"CH2".repeat(n - 3)}CH3`];
      if (s === "alcohol") return [n <= 2 ? `${STEM[n]}anol` : `${STEM[n]}an-1-ol`, `C${n}H${2 * n + 1}OH`, n === 1 ? "CH3OH" : `CH3${"CH2".repeat(n - 1)}OH`];
      return [`${STEM[n]}anoic acid`, n === 1 ? "HCOOH" : `C${n - 1}H${2 * n - 1}COOH`, n === 1 ? "HCOOH" : `CH3${mid}COOH`];
    }
    function draw() {
      const [n, A, B] = build(), [name, molf, structf] = names(n), [series, gen, fg, chem] = INFO[st.s];
      svg.innerHTML = mol(A, B) + `<text x="20" y="34" class="mono-b" style="font-size:20px">${name}</text><text x="20" y="56">${series}, general formula ${gen}</text>
        <text x="20" y="268">displayed formula: every atom and every bond</text>`;
      res.innerHTML = rows([["name", name], ["molecular formula", SUB(molf)], ["structural formula", SUB(structf)], ["functional group", fg], ["general formula", gen]]);
      exp.innerHTML = chips([[series], [st.s === "alkane" ? "saturated" : st.s === "alkene" ? "unsaturated" : fg.split(" ")[0]]]) + `<h3>A homologous series: same functional group, same general formula</h3><p>Members of a <b>homologous series</b> have the same <b>general formula</b> and the same <b>functional group</b>, so they have <b>similar chemical properties</b>; each differs from the next by <b>CH₂</b>, and physical properties such as boiling point change gradually. ${chem.charAt(0).toUpperCase() + chem.slice(1)}. The name tells you the number of carbons (meth 1, eth 2, prop 3, but 4) and the series (‑ane, ‑ene, ‑ol, ‑oic acid). <b>Saturated</b> compounds have only single C–C bonds; <b>unsaturated</b> compounds have a C=C double bond.</p>` + flow(["stem: number of carbons", "ending: functional group", "general formula", "similar reactions"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { s: "alkane", n: 2 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- crude oil fractions ---------- */
  function fractionsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // name, carbons, boiling range, use
    const F = [["refinery gas", "C1–C4", "below 40 °C", "gas for heating and cooking"], ["gasoline / petrol", "C5–C10", "40–100 °C", "fuel for cars"], ["naphtha", "C8–C12", "100–150 °C", "feedstock for making chemicals"], ["kerosene / paraffin", "C10–C16", "150–250 °C", "jet fuel"], ["diesel oil / gas oil", "C14–C20", "250–300 °C", "fuel for diesel engines"], ["fuel oil", "C20–C40", "300–350 °C", "fuel for ships and home heating"], ["lubricating oil", "C30–C50", "350–400 °C", "lubricants, waxes and polishes"], ["bitumen", "over C50", "above 400 °C", "making roads"]];
    let st = { f: 3 };
    function draw() {
      const k = st.f;
      let s = `<rect class="f lt" x="220" y="20" width="110" height="256" rx="6"/><rect x="222" y="22" width="106" height="252" fill="url(#heat)" opacity=".25"/><defs><linearGradient id="heat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--blue)"/><stop offset="1" stop-color="var(--red)"/></linearGradient></defs>
        <path class="ar" d="M120 262H218"/><text x="20" y="258" style="font-size:11px">heated crude oil</text><text x="20" y="272" style="font-size:11px">(vapour) in</text><text x="275" y="14" text-anchor="middle" style="font-size:10px">cooler at the top</text>`;
      F.forEach(([n], i) => { const y = 34 + i * 30, on = i === k; s += `<path class="l ${on ? "w3" : ""}" style="--fc:${on ? "var(--c-chem)" : "var(--ink-3)"}" d="M330 ${y}H372"/><text x="380" y="${y + 4}" class="${on ? "k" : ""}" style="font-size:12px">${n}</text>`; });
      const len = [3, 8, 10, 13, 17, 30, 40, 55][k];
      s += `<text x="20" y="40" class="k">chain length</text>` + Array.from({ length: Math.min(len, 20) }, (_, i) => `<circle class="f dk" cx="${26 + i * 9}" cy="58" r="4"/>`).join("") + (len > 20 ? `<text x="210" y="62" text-anchor="end">…</text>` : "");
      const bar = (y, label, v, c) => `<text x="20" y="${y}" style="font-size:11px">${label}</text><rect class="f lt" x="20" y="${y + 6}" width="180" height="10" rx="3"/><rect class="f ${c} dk" x="20" y="${y + 6}" width="${180 * v}" height="10" rx="3"/>`;
      s += bar(100, "boiling point", (k + 1) / 8, "cr") + bar(140, "viscosity (thickness)", (k + 1) / 8, "ca") + bar(180, "volatility and flammability", 1 - k / 8, "cb");
      svg.innerHTML = s;
      const [n, c, bp, use] = F[k];
      res.innerHTML = rows([["fraction", n], ["carbon atoms", c], ["boiling range", bp], ["use", use]]);
      exp.innerHTML = chips([[n], [c]]) + `<h3>Separating crude oil by boiling point</h3><p><b>Crude oil</b> is a mixture of hydrocarbons. In <b>fractional distillation</b> it is heated until it vaporises; the vapour rises up a column that is <b>hot at the bottom and cooler at the top</b>. Each fraction condenses at the level where the temperature falls below its boiling point. Going <b>down</b> the column, the molecules get <b>longer</b>: higher boiling point, more viscous, less volatile and less flammable. Coal, natural gas (mainly methane) and petroleum are <b>fossil fuels</b>.</p>` + flow(["longer chains", "stronger forces between molecules", "higher boiling point", "condense lower down"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.f = 3; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- addition reactions of ethene ---------- */
  function additionLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const R = { bromine: ["bromine water", "Br", "Br", "1,2-dibromoethane", "room temperature", "C₂H₄ + Br₂ → C₂H₄Br₂"], hydrogen: ["hydrogen", "H", "H", "ethane", "nickel catalyst, about 150 °C", "C₂H₄ + H₂ → C₂H₆"], steam: ["steam", "H", "OH", "ethanol", "phosphoric acid catalyst, 300 °C, 60 atm", "C₂H₄ + H₂O → C₂H₅OH"] };
    let st = { hc: "ethene", r: "bromine" };
    function draw() {
      const [rn, a, b, prod, cond, eq] = R[st.r], alkene = st.hc === "ethene";
      const ethene = [[["C", 90, 140], ["C", 150, 140], ["H", 50, 105], ["H", 50, 175], ["H", 190, 105], ["H", 190, 175]], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]];
      const ethane = [[["C", 90, 140], ["C", 150, 140], ["H", 90, 90], ["H", 90, 190], ["H", 40, 140], ["H", 150, 90], ["H", 150, 190], ["H", 200, 140]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1], [1, 7, 1]]];
      const product = [[["C", 360, 140], ["C", 420, 140], ["H", 360, 90], ["H", 360, 190], [a, 310, 140], ["H", 420, 90], ["H", 420, 190], [b, b === "OH" ? 474 : 470, 140]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1], [1, 7, 1]]];
      let s = mol(...(alkene ? ethene : ethane)) + `<text x="120" y="230" text-anchor="middle">${st.hc}</text><text x="240" y="146" text-anchor="middle" class="mono-b">+ ${st.r === "steam" ? "H₂O" : st.r === "bromine" ? "Br₂" : "H₂"}</text>`;
      s += alkene ? `<path class="ar" d="M262 140H292"/><path class="ar-h" d="M292 140l-8 -5v10z"/>${mol(...product)}<text x="390" y="230" text-anchor="middle">${prod}</text>` : `<text x="380" y="146" text-anchor="middle" class="k">no addition reaction</text>`;
      if (st.r === "bromine") s += `<path class="glass" d="M540 50V210a30 30 0 0 0 60 0V50"/><path d="M542 110V210a28 28 0 0 0 56 0V110Z" fill="${alkene ? "transparent" : "#e08a30"}" opacity=".8"/><path class="l" d="M542 110H598"/><text x="570" y="268" text-anchor="middle">${alkene ? "decolourised" : "stays orange"}</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["hydrocarbon", `${st.hc} (${alkene ? "unsaturated" : "saturated"})`], ["added", rn], ["product", alkene ? prod : "none"], ["conditions", alkene ? cond : "—"], ["equation", alkene ? eq : "—"]]);
      exp.innerHTML = chips([[alkene ? "Addition" : "No reaction", alkene ? "up" : ""], [alkene ? prod : "saturated"]]) + `<h3>${alkene ? "The C=C double bond opens up" : "Alkanes have no double bond to add across"}</h3><p>In an <b>addition reaction</b> two molecules join to make one product: one of the bonds in the C=C double bond breaks and each carbon forms a new bond. ${st.r === "bromine" ? "<b>Bromine water</b> is the test for unsaturation: it turns from <b>orange to colourless</b> with an alkene and stays orange with an alkane." : st.r === "steam" ? "Ethene + steam → ethanol is one way to make ethanol: fast and continuous, but uses non-renewable crude oil. The other is <b>fermentation</b> of glucose with yeast (renewable, but slow and batch)." : "Adding hydrogen (hydrogenation) turns an alkene into an alkane — used to harden vegetable oils."} Alkenes are made by <b>cracking</b> long-chain alkanes (high temperature and a catalyst), which also gives shorter, more useful fuel molecules and hydrogen.</p>` + flow(["C=C double bond", "one bond breaks", "atoms add to each carbon", "saturated product"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { hc: "ethene", r: "bromine" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- polymers ---------- */
  function polymerLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // monomer name, substituents on the 4 positions [top-left, bottom-left, top-right, bottom-right], polymer, use
    const P = { ethene: ["ethene", ["H", "H", "H", "H"], "poly(ethene)", "plastic bags and bottles"], propene: ["propene", ["H", "H", "H", "CH₃"], "poly(propene)", "crates, ropes"], chloroethene: ["chloroethene", ["H", "H", "H", "Cl"], "poly(chloroethene), PVC", "pipes, window frames"], nylon: ["a dicarboxylic acid and a diamine", null, "nylon (a polyamide)", "clothing, ropes"], pet: ["a dicarboxylic acid and a diol", null, "PET (a polyester)", "drinks bottles, fibres for clothing"] };
    let st = { m: "ethene" };
    function draw() {
      const [mn, sub, pn, use] = P[st.m];
      let s = "";
      if (sub) {
        const [tl, bl, tr, br] = sub;
        s += mol([["C", 90, 140], ["C", 150, 140], [tl, 90, 86], [bl, 90, 194], [tr, 150, 86], [br, 150, 194]], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]) + `<text x="120" y="240" text-anchor="middle">n × ${mn}</text><path class="ar" d="M210 140H260"/><path class="ar-h" d="M260 140l-8 -5v10z"/>`;
        const A = [], B = [];
        for (let u = 0; u < 3; u++) { const x = 320 + u * 104; A.push(["C", x, 140], ["C", x + 52, 140], [tl, x, 86], [bl, x, 194], [tr, x + 52, 86], [br, x + 52, 194]); const b = u * 6; B.push([b, b + 1, 1], [b, b + 2, 1], [b, b + 3, 1], [b + 1, b + 4, 1], [b + 1, b + 5, 1]); if (u) B.push([b - 5, b, 1]); }
        s += mol(A, B) + `<path class="bond" d="M296 140H309M${320 + 2 * 104 + 63} 140H${320 + 2 * 104 + 76}"/><text x="${320 + 2 * 104 + 80}" y="145">…</text><text x="460" y="240" text-anchor="middle">${pn}: the C=C opens and the monomers join</text>`;
      } else {
        const blk = (x, c, t) => `<rect class="f ${c} dk" x="${x}" y="122" width="56" height="36" rx="${c === "cb" ? 18 : 4}"/><text x="${x + 28}" y="145" text-anchor="middle" style="font-size:10px">${t}</text>`;
        s += blk(40, "ca", "acid") + `<text x="110" y="146" class="mono-b">+</text>` + blk(126, "cb", st.m === "nylon" ? "amine" : "diol") + `<path class="ar" d="M196 140H236"/><path class="ar-h" d="M236 140l-8 -5v10z"/>`;
        for (let u = 0; u < 4; u++) s += blk(250 + u * 92, u % 2 ? "cb" : "ca", u % 2 ? (st.m === "nylon" ? "amine" : "diol") : "acid") + (u < 3 ? `<path class="bond" d="M${306 + u * 92} 140H${342 + u * 92}"/><text x="${324 + u * 92}" y="128" text-anchor="middle" style="font-size:9px">${st.m === "nylon" ? "amide" : "ester"}</text>` : "");
        s += `<text x="420" y="210" text-anchor="middle">${pn} + water molecules given off at each link</text>`;
      }
      svg.innerHTML = s;
      res.innerHTML = rows([["monomer(s)", mn], ["polymer", pn], ["type", sub ? "addition polymer" : "condensation polymer (Supp.)"], ["by-product", sub ? "none" : "water"], ["use", use]]);
      exp.innerHTML = chips([[sub ? "Addition polymerisation" : "Condensation polymerisation"], [pn]]) + `<h3>${sub ? "Many small unsaturated monomers join into one long chain" : "Two different monomers join, giving off water"}</h3><p><b>Polymers</b> are large molecules built from many small units called <b>monomers</b>. ${sub ? "In <b>addition polymerisation</b>, alkene monomers open their C=C double bonds and join with no other product. To draw the repeat unit, change the double bond to a single bond, add bonds sticking out of the brackets on each side, and write n." : "<span class='tag-s'>Supp.</span> In <b>condensation polymerisation</b>, two different monomers each with two functional groups join, and a small molecule (<b>water</b>) is given off at each link: nylon has <b>amide</b> links, PET has <b>ester</b> links. <b>Proteins</b> are natural polyamides made from amino acids."}</p><p>Plastics are made from polymers. Most are <b>non-biodegradable</b>: in landfill they take up space and last for centuries; in the oceans they harm wildlife; burning them releases toxic gases. PET can be converted back into monomers and re-polymerised.</p>` + flow(sub ? ["monomer with C=C", "double bond opens", "monomers join", "polymer, no by-product"] : ["two monomers, two groups each", "react at both ends", "water given off", "amide or ester links"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.m = "ethene"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ series: seriesLab, fractions: fractionsLab, addition: additionLab, polymer: polymerLab });
})();
