/* ==========================================================================
   stay add. — Chemistry topic 4, Electrochemistry: the labs
   cell      electrolysis of six electrolytes: ions drift to the electrodes,
             products appear, with half-equations
   plate     electroplating an object: the object is the cathode, the plating
             metal the anode
   fuelcell  a hydrogen–oxygen fuel cell lighting a lamp
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  // the power supply drawn as a battery of two cells between x = 300 and 340: a long plate is the positive terminal,
  // a short one the negative; plusLeft puts + on the left end (wired to the left electrode)
  const supply = (plusLeft) => `<path class="l w3" style="--fc:var(--ink)" d="${plusLeft ? "M300 28V52M312 34V46M328 28V52M340 34V46" : "M300 34V46M312 28V52M328 34V46M340 28V52"}"/><text x="292" y="62" text-anchor="middle" class="k">${plusLeft ? "+" : "−"}</text><text x="348" y="62" text-anchor="middle" class="k">${plusLeft ? "−" : "+"}</text>`;

  /* ---------- electrolysis cell ---------- */
  function cellLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // name, cations, anions, cathode [product, half-equation, gas?], anode [...], what is left / seen, electrode note, liquid colour
    const E = {
      pbbr2: ["molten lead(II) bromide", "Pb²⁺", "Br⁻", ["lead", "Pb²⁺ + 2e⁻ → Pb", false], ["bromine", "2Br⁻ → Br₂ + 2e⁻", true], "silvery liquid lead at the cathode; red-brown bromine vapour at the anode", "inert", "var(--amber)"],
      concnacl: ["concentrated aqueous sodium chloride", "Na⁺, H⁺", "Cl⁻, OH⁻", ["hydrogen", "2H⁺ + 2e⁻ → H₂", true], ["chlorine", "2Cl⁻ → Cl₂ + 2e⁻", true], "bubbles at both electrodes; the solution left becomes sodium hydroxide", "inert", "var(--line-2)"],
      dilnacl: ["dilute aqueous sodium chloride", "Na⁺, H⁺", "Cl⁻, OH⁻", ["hydrogen", "2H⁺ + 2e⁻ → H₂", true], ["oxygen", "4OH⁻ → O₂ + 2H₂O + 4e⁻", true], "bubbles at both electrodes — with chloride ions so dilute, oxygen forms instead of chlorine", "inert", "var(--line-2)"],
      h2so4: ["dilute sulfuric acid", "H⁺", "SO₄²⁻, OH⁻", ["hydrogen", "2H⁺ + 2e⁻ → H₂", true], ["oxygen", "4OH⁻ → O₂ + 2H₂O + 4e⁻", true], "twice as much hydrogen as oxygen by volume; water is used up", "inert", "var(--line-2)"],
      cuso4: ["aqueous copper(II) sulfate, carbon electrodes", "Cu²⁺, H⁺", "SO₄²⁻, OH⁻", ["copper", "Cu²⁺ + 2e⁻ → Cu", false], ["oxygen", "4OH⁻ → O₂ + 2H₂O + 4e⁻", true], "pink-brown copper coats the cathode; bubbles at the anode; the blue colour fades and the solution becomes acidic", "inert", "var(--blue)"],
      cuso4cu: ["aqueous copper(II) sulfate, copper electrodes", "Cu²⁺, H⁺", "SO₄²⁻, OH⁻", ["copper", "Cu²⁺ + 2e⁻ → Cu", false], ["copper ions (the anode dissolves)", "Cu → Cu²⁺ + 2e⁻", false], "the cathode gains copper and the anode loses the same mass; the blue colour stays the same — used to purify copper", "copper", "var(--blue)"]
    };
    let st = { e: "concnacl" }, t = 0, ions = [];
    // 16 ions, each labelled; the compound's own ions outnumber the H⁺ / OH⁻ from water three to one
    function seedIons() {
      const [, cat, an] = E[st.e], C = cat.split(", "), A = an.split(", ");
      ions = Array.from({ length: 16 }, (_, i) => { const pos = i % 2 === 0, list = pos ? C : A, k = Math.floor(i / 2); return { pos, f: list[k % 4 === 3 && list[1] ? 1 : 0], x: 240 + Math.random() * 160, y: 145 + Math.random() * 100 }; });
    }
    seedIons();
    function draw() {
      const [, cat, an, [cp, , cg], [ap, , ag], , el, col] = E[st.e], grow = Math.min(1, t / 300);
      let s = `<path class="glass" d="M150 100V262H490V100"/><rect class="liq" style="--lc:${col}" x="152" y="130" width="336" height="130"/>
        <path class="wire" d="M215 110V40H300M340 40H425V110"/>${supply(true)}<text x="320" y="20" text-anchor="middle">power supply</text>
        <rect class="f ${el === "copper" ? "ca" : ""} dk" x="${205 + grow * (st.e === "cuso4cu" ? 4 : 0)}" y="110" width="${20 - grow * (st.e === "cuso4cu" ? 8 : 0)}" height="130" rx="2"/><rect class="f ${el === "copper" ? "ca" : ""} dk" x="415" y="110" width="20" height="130" rx="2"/>
        <text x="215" y="282" text-anchor="middle" class="k">anode (+)</text><text x="425" y="282" text-anchor="middle" class="k">cathode (−)</text>`;
      if (!cg) s += `<rect class="f ${cp === "lead" ? "" : "ca"} dk" x="${411 - grow * 6}" y="150" width="${4 + grow * 6}" height="90"/>`;
      ions.forEach((p) => { s += `<circle class="f ${p.pos ? "cr" : "cb"}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="12"/><text x="${p.x.toFixed(1)}" y="${(p.y + 3).toFixed(1)}" text-anchor="middle" class="k" style="font-size:${p.f.length > 3 ? 7.5 : 9}px">${p.f}</text>`; });
      // electrons in the wires, left to right: out of the anode to the + terminal, and from the − terminal into the cathode
      const along = (pts, u) => { const L = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1])), T = L.reduce((x, y) => x + y); let d = u * T, i = 0; while (d > L[i]) d -= L[i++]; const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; return [x0 + (x1 - x0) * d / L[i], y0 + (y1 - y0) * d / L[i]]; };
      for (const path of [[[215, 110], [215, 40], [300, 40]], [[340, 40], [425, 40], [425, 110]]]) for (let k = 0; k < 3; k++) {
        const [x, y] = along(path, (t * 0.008 + k / 3) % 1);
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="var(--c-electron)"/><text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle" style="font-size:7.5px;fill:var(--bg)">e⁻</text>`;
      }
      s += `<path class="mk" style="--fc:var(--c-electron)" d="M252 34l10 6l-10 6zM376 34l10 6l-10 6zM209 82l6 -10l6 10zM419 78l6 10l6 -10z"/>
        <text x="320" y="94" text-anchor="middle" style="font-size:10px">e⁻: anode → supply → cathode</text>`;
      const bubbles = (x, n) => Array.from({ length: n }, (_, k) => `<circle class="shell" cx="${x + ((k * 7) % 14) - 7}" cy="${240 - ((t * 2 + k * 23) % 110)}" r="${2.5 + (k % 3)}"/>`).join("");
      if (cg) s += bubbles(425, 7); if (ag) s += bubbles(215, st.e === "h2so4" ? 4 : 7);
      s += `<text x="70" y="160" text-anchor="middle" class="tc" style="--fc:var(--c-anion)">${an}</text><text x="70" y="176" text-anchor="middle">← to the anode</text>
        <text x="570" y="160" text-anchor="middle" class="tc" style="--fc:var(--c-cation)">${cat}</text><text x="570" y="176" text-anchor="middle">to the cathode →</text>
        <text x="70" y="214" text-anchor="middle" class="k">${ap.split(" (")[0]}</text><text x="570" y="214" text-anchor="middle" class="k">${cp}</text>`;
      svg.innerHTML = s;
    }
    function tick() {
      t++;
      ions.forEach((p) => {
        p.x += (p.pos ? 0.6 : -0.6) + (Math.random() - 0.5) * 0.8; p.y += (Math.random() - 0.5) * 1.2;
        if (p.x < 240 || p.x > 400) p.x = 250 + Math.random() * 140; p.y = Math.max(144, Math.min(246, p.y));
      });
      // keep the labelled ions from piling on top of each other
      ions.forEach((p, i) => ions.slice(i + 1).forEach((q) => { const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1; if (d < 25) { const k = (25 - d) / 2 / d; p.x -= dx * k; p.y -= dy * k; q.x += dx * k; q.y += dy * k; } }));
      draw();
    }
    function explain() {
      const [name, cat, an, [cp, ce], [ap, ae], seen, el] = E[st.e];
      res.innerHTML = rows([["electrolyte", name], ["electrodes", el === "copper" ? "copper (active)" : "inert (graphite or platinum)"], ["at the cathode (−)", cp], ["at the anode (+)", ap], ["observations", seen]]);
      const water = cat.includes("H⁺");
      exp.innerHTML = chips([[`cathode: ${cp}`], [`anode: ${ap.split(" (")[0]}`]]) + `<h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3><p><b>Electrolysis</b> is the decomposition of an ionic compound, <b>molten or in aqueous solution</b>, by passing an electric current. Positive ions move to the <b>cathode</b> and gain electrons (<b>reduction</b>); negative ions move to the <b>anode</b> and lose electrons (<b>oxidation</b>). ${water ? `In a solution, water also provides H⁺ and OH⁻ ions. At the cathode, <b>hydrogen</b> forms unless the metal is <b>less reactive than hydrogen</b> (like copper). At the anode, a <b>halogen</b> forms from a <b>concentrated</b> halide; otherwise <b>oxygen</b> forms.` : "A molten binary compound simply splits into its two elements: the metal at the cathode and the non-metal at the anode."} ${el === "copper" ? "A copper anode is <b>not inert</b>: it dissolves instead of releasing oxygen." : ""}</p><p class="eq"><small>cathode</small> ${ce} &nbsp; <small>anode</small> ${ae}</p>` + flow(["ions free to move", "cations → cathode: gain e⁻", "anions → anode: lose e⁻", "electrons flow in the wires"]);
    }
    const paint = controls(lab, st, () => { paint(); t = 0; seedIons(); explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.e = "concnacl"; t = 0; seedIons(); paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); t = 0; seedIons(); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, tick, 40);
  }

  /* ---------- electroplating ---------- */
  function plateLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // metal: electrolyte, ion, colour class, why
    const M = { copper: ["copper(II) sulfate", "Cu²⁺", "ca", "to improve electrical contact and appearance"], silver: ["silver nitrate", "Ag⁺", "", "for an attractive, shiny finish on cutlery and jewellery"], nickel: ["nickel(II) sulfate", "Ni²⁺", "ct", "to resist corrosion, often under chromium plating"] };
    let st = { metal: "silver", min: 10 };
    function draw() {
      const [sol, ion, c] = M[st.metal], th = Math.min(10, st.min / 6);
      svg.innerHTML = `<path class="glass" d="M150 100V262H490V100"/><rect class="liq" style="--lc:${st.metal === "copper" ? "var(--blue)" : st.metal === "nickel" ? "var(--green)" : "var(--line-2)"}" x="152" y="130" width="336" height="130"/>
        <path class="wire" d="M230 120V40H300M340 40H430V110"/>${supply(false)}
        <path class="f ${c} dk" d="M${222 - th} 150a${18 + th} ${26 + th} 0 1 0 ${36 + th * 2} 0a${18 + th} ${26 + th} 0 1 0 ${-36 - th * 2} 0Z"/><path class="f dk" d="M222 150a18 26 0 1 0 36 0a18 26 0 1 0 -36 0Z"/><rect class="f dk" x="236" y="118" width="8" height="8"/>
        <rect class="f ${c} dk" x="${420 + th / 2}" y="110" width="${22 - th / 2}" height="130" rx="2"/>
        <text x="240" y="230" text-anchor="middle" class="k">object (cathode −)</text><text x="431" y="282" text-anchor="middle" class="k">${st.metal} (anode +)</text>
        <text x="320" y="120" text-anchor="middle">${ion} ions in ${sol}</text><path class="ar" d="M400 180H280"/><path class="ar-h" d="M280 180l9 -5v10z"/>`;
      res.innerHTML = rows([["object", "cathode (−)"], ["anode", `pure ${st.metal}`], ["electrolyte", `${sol} solution (contains ${ion})`], ["time", `${st.min} minutes`], ["coating", th > 0.5 ? `${st.metal}, getting thicker` : "very thin"]]);
      exp.innerHTML = chips([[`${st.metal} plating`], [`${st.min} min`]]) + `<h3>Coat an object with a thin layer of metal</h3><p>In <b>electroplating</b> the object to be plated is the <b>cathode</b>, the plating metal is the <b>anode</b>, and the electrolyte contains ions of the plating metal. At the cathode the metal ions gain electrons and coat the object; at the anode the metal dissolves, replacing the ions used up. The longer the current flows, the thicker the coating. Objects are plated ${M[st.metal][3]}.</p>` + flow(["metal ions in solution", "move to the object (cathode)", "gain electrons", "metal coats the object"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { metal: "silver", min: 10 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- hydrogen–oxygen fuel cell ---------- */
  function fuelLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { h2: 50 }, t = 0;
    function draw() {
      const on = st.h2 > 0, I = st.h2 / 100, glow = 0.15 + I * 0.85;
      const es = on ? Array.from({ length: 8 }, (_, k) => { const d = ((t * I * 0.02 + k / 8) % 1) * 380, [x, y] = d < 70 ? [200, 110 - d] : d < 310 ? [200 + (d - 70), 40] : [440, 40 + (d - 310)]; return `<circle class="e" cx="${x}" cy="${y}" r="4"/>`; }).join("") : "";
      svg.innerHTML = `<rect class="f lt" x="160" y="110" width="320" height="150" rx="8"/><rect class="f cb" x="190" y="120" width="20" height="130"/><rect class="f cr" x="430" y="120" width="20" height="130"/><rect class="liq" style="--lc:var(--teal)" x="214" y="120" width="212" height="130"/>
        <text x="320" y="190" text-anchor="middle">electrolyte</text>
        <path class="ar" d="M80 160H186"/><path class="ar-h" d="M186 160l-9 -5v10z"/><text x="80" y="150">hydrogen in</text>
        <path class="ar" d="M560 160H454"/><path class="ar-h" d="M454 160l9 -5v10z"/><text x="560" y="150" text-anchor="end">oxygen in (air)</text>
        <path class="ar" d="M440 255V284H520"/><text x="526" y="288">water out</text>
        <path class="wire" d="M200 110V40H440V110"/><circle cx="320" cy="40" r="15" fill="var(--amber)" opacity="${on ? glow : 0.08}"/><circle class="comp" cx="320" cy="40" r="15" style="fill:none"/><path class="l" d="M309 29l22 22M331 29l-22 22"/>
        ${es}<text x="320" y="78" text-anchor="middle">electrons flow through the lamp</text>`;
      res.innerHTML = rows([["hydrogen supply", `${st.h2}%`], ["lamp", on ? (I > 0.6 ? "bright" : "dim") : "off"], ["overall reaction", "2H₂ + O₂ → 2H₂O"], ["waste product", "water only"]]);
    }
    function explain() {
      exp.innerHTML = chips([[st.h2 ? "Electricity from a reaction" : "No fuel"], ["only water made", "up"]]) + `<h3>A fuel cell turns chemical energy into electrical energy</h3><p>In a <b>hydrogen–oxygen fuel cell</b>, hydrogen and oxygen react to make water and produce electricity directly — no burning. The overall equation is <b>2H₂ + O₂ → 2H₂O</b>. As long as the fuels are supplied, the cell keeps working.</p><p><b>Advantages</b> over a petrol engine: the only product is water (no CO₂ or other pollutants at the point of use), and it is more efficient. <b>Disadvantages</b>: hydrogen is a flammable gas that is hard to store, it is often made from fossil fuels or by electrolysis using electricity from fossil fuels, and fuel cells are expensive.</p>` + flow(["hydrogen + oxygen", "react in the cell", "electrons flow in the circuit", "water out"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.h2 = 50; paint(); explain(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); draw(); };
    paint(); explain(); draw();
    loop(lab, () => { t += 1; draw(); }, 40);
  }

  labs({ cell: cellLab, plate: plateLab, fuelcell: fuelLab });
})();
