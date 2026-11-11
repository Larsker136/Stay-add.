/* ==========================================================================
   stay add. — Chemistry topic 2, Atoms, elements & compounds: the labs
   atom      build an atom or ion from protons, neutrons and electrons:
             nuclide symbol, electronic configuration, isotopes
   ionic     a metal gives electrons to a non-metal: dot-and-cross ions and formula
   covalent  dot-and-cross diagrams of simple molecules: shared pairs and lone pairs
   giant     giant ionic, simple molecular, diamond, graphite, silicon(IV) oxide and
             metallic structures, each with its properties
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, rows, chips, flow, controls, labs, loop, still } = window.StayAdd.kit;

  // the first 20 elements: symbol, name, Ar, common nucleon numbers
  const EL = [null, ["H", "hydrogen", 1, [1, 2, 3]], ["He", "helium", 4, [4]], ["Li", "lithium", 7, [7, 6]], ["Be", "beryllium", 9, [9]], ["B", "boron", 11, [11, 10]], ["C", "carbon", 12, [12, 13, 14]], ["N", "nitrogen", 14, [14, 15]], ["O", "oxygen", 16, [16, 17, 18]], ["F", "fluorine", 19, [19]], ["Ne", "neon", 20, [20, 22]], ["Na", "sodium", 23, [23]], ["Mg", "magnesium", 24, [24, 25, 26]], ["Al", "aluminium", 27, [27]], ["Si", "silicon", 28, [28]], ["P", "phosphorus", 31, [31]], ["S", "sulfur", 32, [32]], ["Cl", "chlorine", 35.5, [35, 37]], ["Ar", "argon", 40, [40]], ["K", "potassium", 39, [39, 41]], ["Ca", "calcium", 40, [40]]];
  const config = (e) => { const out = []; for (const cap of [2, 8, 8, 2]) { if (e <= 0) break; out.push(Math.min(cap, e)); e -= cap; } return out; };
  const sup = (q) => (q === 0 ? "" : `${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "−"}`);
  const SUB = { 2: "₂", 3: "₃", 4: "₄" };
  const cross = (x, y, cls = "") => `<path class="l ${cls}" style="--lw:1.6" d="M${x - 3} ${y - 3}l6 6m0 -6l-6 6"/>`;
  const dot = (x, y, cls = "") => `<circle class="e ${cls}" cx="${x}" cy="${y}" r="3"/>`;

  // shells around (cx, cy); the last `marked` electrons use the other marker
  function shells(cx, cy, cfg, r0, dr, mark, marked = 0) {
    let s = "", total = cfg.reduce((a, b) => a + b, 0), k = 0;
    cfg.forEach((n, i) => {
      const r = r0 + i * dr; s += `<circle class="shell" cx="${cx}" cy="${cy}" r="${r}"/>`;
      for (let j = 0; j < n; j++, k++) {
        const a = -Math.PI / 2 + (j / n) * 2 * Math.PI + (n === 2 ? 0 : Math.PI / n), x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        s += (k >= total - marked) !== (mark === "x") ? cross(x, y) : dot(x, y);
      }
    });
    return s;
  }

  /* ---------- build an atom ---------- */
  function atomLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { Z: 6, N: 6, q: 0 };
    function draw() {
      if (st.Z - st.q < 0) st.q = st.Z;
      const [sym, name, Ar, iso] = EL[st.Z], A = st.Z + st.N, e = st.Z - st.q, cfg = config(e);
      svg.innerHTML = `<circle class="f cr dk" cx="180" cy="145" r="18"/><text x="180" y="142" text-anchor="middle" class="k" style="font-size:9px">${st.Z}p</text><text x="180" y="153" text-anchor="middle" style="font-size:9px">${st.N}n</text>
        ${shells(180, 145, cfg, 38, 28, "o")}
        <text x="430" y="120" text-anchor="end" class="mono-b" style="font-size:22px">${A}</text><text x="430" y="182" text-anchor="end" class="mono-b" style="font-size:22px">${st.Z}</text>
        <text x="438" y="174" class="mono-b" style="font-size:64px">${sym}</text><text x="${448 + sym.length * 38}" y="124" class="mono-b" style="font-size:24px">${sup(st.q)}</text>
        <text x="440" y="216">nucleon number A = ${A}</text><text x="440" y="234">proton number Z = ${st.Z}</text><text x="440" y="252">electrons: ${cfg.join(",")}</text>`;
      const isIon = st.q !== 0, common = iso.includes(A);
      res.innerHTML = rows([["element", `${name} (${sym})`], ["protons · neutrons · electrons", `${st.Z} · ${st.N} · ${e}`], ["electronic configuration", cfg.join(",") || "—"], ["particle", isIon ? `${st.q > 0 ? "positive" : "negative"} ion, ${sym}${sup(st.q)}` : "neutral atom"], ["isotope", common ? `${name}-${A}` : "not a common isotope"]]);
      const outer = cfg[cfg.length - 1] || 0, full = [2, 10, 18].includes(e);
      exp.innerHTML = chips([[`${sym}${sup(st.q)}`], [full ? "full outer shell" : `${outer} outer electron${outer === 1 ? "" : "s"}`, full ? "up" : ""]]) +
        `<h3>${isIon ? `An ion: ${st.Z} protons but ${e} electrons` : `A ${name} atom`}</h3><p>The <b>proton number</b> (${st.Z}) fixes the element. The <b>nucleon number</b> is protons + neutrons (${A}); neutrons = ${A} − ${st.Z} = ${st.N}. ${isIon ? `Losing or gaining electrons makes an <b>ion</b>: ${st.q > 0 ? "fewer electrons than protons, so it is positive" : "more electrons than protons, so it is negative"}.` : "In an atom the number of electrons equals the number of protons, so it is neutral."} Electrons fill shells 2, 8, 8: ${cfg.join(",")}. ${isIon ? "" : `The number of shells gives the <b>period</b> (${cfg.length}) and the outer electrons give the <b>group</b> (${outer === 8 || (st.Z === 2) ? "VIII / 0" : ["", "I", "II", "III", "IV", "V", "VI", "VII"][outer]}).`}</p>` +
        `<p>${common ? `${name.charAt(0).toUpperCase() + name.slice(1)} atoms with a different number of neutrons are <b>isotopes</b> (${iso.map((a) => `${name}-${a}`).join(", ")}): same proton number, different nucleon number, same chemical properties because they have the same electronic configuration.` : "This nucleon number is not one that occurs naturally for this element."} Relative atomic mass Ar = ${Ar}.</p>` +
        flow(["protons → element", "protons + neutrons → mass", "electrons → configuration", "outer electrons → reactions"]);
    }
    const paint = controls(lab, st, (k) => { if (k === "Z") st.N = EL[st.Z][3][0] - st.Z; paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { Z: 6, N: 6, q: 0 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- ionic bonding ---------- */
  function ionicLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const M = { Li: [3, 1], Na: [11, 1], K: [19, 1], Mg: [12, 2], Ca: [20, 2], Al: [13, 3] };
    const X = { F: [9, 1, "fluoride"], Cl: [17, 1, "chloride"], O: [8, 2, "oxide"], S: [16, 2, "sulfide"], N: [7, 3, "nitride"] };
    let st = { m: "Na", x: "Cl" };
    const gcd = (a, b) => (b ? gcd(b, a % b) : a);
    function draw() {
      const [zm, qm] = M[st.m], [zx, qx, ide] = X[st.x], l = (qm * qx) / gcd(qm, qx), a = l / qm, b = l / qx;
      const formula = `${st.m}${a > 1 ? SUB[a] : ""}${st.x}${b > 1 ? SUB[b] : ""}`;
      svg.innerHTML = `<text x="20" y="22" class="k">atoms</text><text x="20" y="168" class="k">ions</text>
        ${shells(110, 82, config(zm), 14, 13, "o")}<text x="110" y="86" text-anchor="middle" class="k">${st.m}</text>
        ${shells(310, 82, config(zx), 14, 13, "x")}<text x="310" y="86" text-anchor="middle" class="k">${st.x}</text>
        <path class="ar" d="M${110 + 14 + (config(zm).length - 1) * 13} 70Q210 30 ${310 - 14 - (config(zx).length - 1) * 13} 70"/><path class="ar-h" d="M${310 - 14 - (config(zx).length - 1) * 13} 70l-9 -6l1 9z"/>
        <text x="210" y="40" text-anchor="middle">${qm} electron${qm > 1 ? "s" : ""} each</text>
        <path class="l" d="M60 165v100h4M60 165h4M160 165v100h-4M160 165h-4"/>${shells(110, 215, config(zm - qm), 14, 13, "o")}<text x="110" y="219" text-anchor="middle" class="k">${st.m}</text><text x="166" y="170" class="mono-b">${sup(qm)}</text>
        <path class="l" d="M248 158v114h4M248 158h4M372 158v114h-4M372 158h-4"/>${shells(310, 215, config(zx + qx), 14, 13, "x", qx)}<text x="310" y="219" text-anchor="middle" class="k">${st.x}</text><text x="378" y="163" class="mono-b">${sup(-qx)}</text>
        ${a > 1 ? `<text x="30" y="219" class="mono-b">${a} ×</text>` : ""}${b > 1 ? `<text x="222" y="219" class="mono-b" text-anchor="end">${b} ×</text>` : ""}
        <text x="430" y="120" class="mono-b" style="font-size:30px">${formula}</text><text x="430" y="150">${a} × (${sup(qm) || "+"}) + ${b} × (${sup(-qx)}) = 0</text>
        <text x="430" y="200" style="font-size:11px">· ${st.m} electrons</text><text x="430" y="218" style="font-size:11px">× ${st.x} electrons</text>`;
      const names = { Li: "lithium", Na: "sodium", K: "potassium", Mg: "magnesium", Ca: "calcium", Al: "aluminium" };
      res.innerHTML = rows([["metal ion", `${st.m}${sup(qm)} (${config(zm - qm).join(",")})`], ["non-metal ion", `${st.x}${sup(-qx)} (${config(zx + qx).join(",")})`], ["ratio", `${a} : ${b}`], ["formula", `${formula}, ${names[st.m]} ${ide}`]]);
      exp.innerHTML = chips([[formula], [`${l} electron${l > 1 ? "s" : ""} transferred`]]) + `<h3>Electrons move from the metal to the non-metal</h3><p>Each ${names[st.m]} atom <b>loses ${qm} electron${qm > 1 ? "s" : ""}</b> to become a positive ion; each ${st.x} atom <b>gains ${qx}</b> to become a negative ion. Both ions now have a <b>full outer shell</b> (the configuration of a noble gas). The oppositely charged ions attract: this strong <b>electrostatic attraction</b> is the ionic bond. The charges must cancel, so the formula is <b>${formula}</b>.</p>` + flow([`metal loses ${qm} e⁻`, `non-metal gains ${qx} e⁻`, "full outer shells", "opposite charges attract"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { m: "Na", x: "Cl" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- covalent molecules ---------- */
  function covalentLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const V = { H: 1, C: 4, N: 5, O: 6, Cl: 7 };
    // atoms [symbol, x, y] · bonds [i, j, order]; bonded shells overlap, so the shared pairs sit in the overlap
    const MOL = {
      H2: ["hydrogen", [["H", 274, 145], ["H", 306, 145]], [[0, 1, 1]]],
      Cl2: ["chlorine", [["Cl", 267, 145], ["Cl", 313, 145]], [[0, 1, 1]]],
      O2: ["oxygen", [["O", 267, 145], ["O", 313, 145]], [[0, 1, 2]]],
      N2: ["nitrogen", [["N", 267, 145], ["N", 313, 145]], [[0, 1, 3]]],
      HCl: ["hydrogen chloride", [["Cl", 310, 145], ["H", 268, 145]], [[0, 1, 1]]],
      H2O: ["water", [["O", 292, 130], ["H", 259, 156], ["H", 325, 156]], [[0, 1, 1], [0, 2, 1]]],
      NH3: ["ammonia", [["N", 292, 128], ["H", 254, 146], ["H", 330, 146], ["H", 292, 170]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]],
      CH4: ["methane", [["C", 292, 145], ["H", 292, 103], ["H", 334, 145], ["H", 292, 187], ["H", 250, 145]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]],
      CO2: ["carbon dioxide", [["C", 292, 145], ["O", 246, 145], ["O", 338, 145]], [[0, 1, 2], [0, 2, 2]]],
      C2H4: ["ethene", [["C", 270, 145], ["C", 316, 145], ["H", 234, 124], ["H", 234, 166], ["H", 352, 124], ["H", 352, 166]], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]],
      CH3OH: ["methanol", [["C", 266, 145], ["O", 312, 145], ["H", 266, 103], ["H", 266, 187], ["H", 224, 145], ["H", 339, 177]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1]]]
    };
    const COL = { H: "var(--amber)", C: "var(--blue)", N: "var(--violet)", O: "var(--red)", Cl: "var(--green)" };
    const R = (el) => (el === "H" ? 22 : 30);
    let st = { mol: "H2O" };
    function draw() {
      const [name, atoms, bonds] = MOL[st.mol];
      // atom 0's electrons are crosses, every other atom's are dots; each in its element's colour
      const mk = (i, x, y) => { const c = COL[atoms[i][0]]; return i === 0 ? `<path class="l" style="--fc:${c};--lw:1.8" d="M${x - 3.2} ${y - 3.2}l6.4 6.4m0 -6.4l-6.4 6.4"/>` : `<circle cx="${x}" cy="${y}" r="3.2" fill="${c}"/>`; };
      let defs = "", lens = "", shells = "", es = "", shared = 0, lone = 0;
      atoms.forEach(([el, x, y], i) => { shells += `<circle class="l" style="--fc:color-mix(in srgb, ${COL[el]} 55%, var(--line-2));--lw:1.3" cx="${x}" cy="${y}" r="${R(el)}"/>`; });
      bonds.forEach(([i, j, n], b) => {
        const [ei, x1, y1] = atoms[i], [ej, x2, y2] = atoms[j], d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d;
        defs += `<clipPath id="cv-${st.mol}-${b}"><circle cx="${x2}" cy="${y2}" r="${R(ej)}"/></clipPath>`;
        lens += `<circle cx="${x1}" cy="${y1}" r="${R(ei)}" fill="var(--c-chem)" opacity=".16" clip-path="url(#cv-${st.mol}-${b})"/>`;
        // the middle of the overlap, then 2n electrons in a column across the bond: one from each atom per pair
        const c = (d - R(ej) + R(ei)) / 2, mx = x1 + ux * c, my = y1 + uy * c;
        for (let k = 0; k < 2 * n; k++) { const o = (k - (2 * n - 1) / 2) * 7.5; es += mk(k % 2 ? j : i, mx - uy * o, my + ux * o); }
        shared += n;
      });
      atoms.forEach(([el, x, y], i) => {
        const used = bonds.reduce((a, [p, q, n]) => a + (p === i || q === i ? n : 0), 0), pairs = (V[el] - used) / 2;
        // lone pairs sit on the shell, pointing away from the bonds
        let vx = 0, vy = 0;
        bonds.filter(([p, q]) => p === i || q === i).forEach(([p, q]) => { const o = atoms[p === i ? q : p], d = Math.hypot(o[1] - x, o[2] - y); vx += (o[1] - x) / d; vy += (o[2] - y) / d; });
        const base = Math.atan2(-vy, -vx), spread = [[0], [-0.75, 0.75], [-1.25, 0, 1.25]][pairs - 1] || [];
        for (let k = 0; k < pairs; k++) {
          const g = base + spread[k], cx = x + R(el) * Math.cos(g), cy = y + R(el) * Math.sin(g), px = -Math.sin(g) * 4, py = Math.cos(g) * 4;
          es += mk(i, cx + px, cy + py) + mk(i, cx - px, cy - py); lone++;
        }
        es += `<text x="${x}" y="${y + 4}" text-anchor="middle" class="k">${el}</text>`;
      });
      const els = [...new Set(atoms.map((a) => a[0]))], count = els.map((el) => { const i = atoms.findIndex((a) => a[0] === el), own = V[el], got = bonds.reduce((a, [p, q, n]) => a + (p === i || q === i ? n : 0), 0); return `${el} ${own + got}`; });
      const legend = [`× from ${atoms[0][0]}${atoms.filter((a) => a[0] === atoms[0][0]).length > 1 ? " (left atom)" : ""}`, ...els.filter((el) => el !== atoms[0][0]).map((el) => `● from ${el}`), ...(atoms.filter((a) => a[0] === atoms[0][0]).length > 1 ? [`● from the other ${atoms[0][0]}`] : [])];
      const legCol = [COL[atoms[0][0]], ...els.filter((el) => el !== atoms[0][0]).map((el) => COL[el]), COL[atoms[0][0]]];
      svg.innerHTML = `<defs>${defs}</defs><g transform="translate(230 140) scale(1.6) translate(-292 -145)">${lens}${shells}${es}</g>
        <text x="450" y="96" class="mono-b" style="font-size:26px">${st.mol.replace(/(\d)/g, (m) => SUB[m] || m)}</text><text x="450" y="120">${name}</text>
        ${legend.map((t, k) => `<text x="450" y="${160 + k * 18}" style="font-size:11px;fill:${legCol[k]}">${t}</text>`).join("")}
        <rect x="20" y="262" width="14" height="10" rx="3" fill="var(--c-chem)" opacity=".35"/><text x="40" y="271" style="font-size:11px">shaded overlap = the shared pair(s) of electrons: the covalent bond</text>`;
      const single = bonds.filter((x) => x[2] === 1).length, dbl = bonds.filter((x) => x[2] === 2).length, tri = bonds.filter((x) => x[2] === 3).length;
      res.innerHTML = rows([["molecule", `${name}`], ["covalent bonds", [single && `${single} single`, dbl && `${dbl} double`, tri && `${tri} triple`].filter(Boolean).join(" · ")], ["shared pairs", shared], ["lone pairs", lone], ["outer electrons after sharing", count.join(" · ")]]);
      exp.innerHTML = chips([[`${shared} shared pair${shared > 1 ? "s" : ""}`], ["simple molecule"]]) + `<h3>Atoms share pairs of electrons</h3><p>A <b>covalent bond</b> is a pair of electrons shared between two atoms; ${dbl || tri ? `a double bond is two shared pairs, a triple bond three. ` : ""}By sharing, every atom gets a <b>full outer shell</b> — 2 for hydrogen, 8 for the others. Pairs not used in bonding are <b>lone pairs</b>. Simple molecular substances have <b>low melting and boiling points</b> because only <b>weak forces between molecules</b> must be overcome (the covalent bonds do not break), and they <b>do not conduct electricity</b> — there are no ions or free electrons.</p>` + flow(["non-metal atoms", "share electron pairs", "full outer shells", "weak forces between molecules"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.mol = "H2O"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- giant structures ---------- */
  function giantLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // title, melting point, conducts?, hardness / feature, why, use
    const T = {
      ionic: ["Giant ionic lattice (sodium chloride)", "high (801 °C)", "only when molten or dissolved", "hard but brittle", "Strong electrostatic attraction between oppositely charged ions in all directions takes a lot of energy to overcome. Solid ions cannot move; molten or dissolved, the ions are free to move and carry charge.", "table salt, electrolysis to make sodium and chlorine"],
      molecular: ["Simple molecular (iodine)", "low (114 °C)", "no", "soft", "Strong covalent bonds inside each molecule, but only weak forces between molecules — little energy is needed to separate the molecules. No ions or free electrons, so no conduction.", "antiseptic (iodine), most gases and liquids"],
      diamond: ["Diamond (carbon)", "very high (about 3500 °C)", "no", "very hard", "Every carbon atom forms 4 strong covalent bonds in a rigid tetrahedral network. Melting means breaking very many covalent bonds. All outer electrons are used in bonds, so none are free to carry charge.", "cutting tools, drill tips"],
      graphite: ["Graphite (carbon)", "very high (about 3600 °C)", "yes", "soft and slippery", "Each carbon forms 3 covalent bonds in flat layers of hexagons. The fourth electron of each atom is delocalised and can move along the layers, so graphite conducts. The forces between layers are weak, so layers slide over each other.", "electrodes, lubricant, pencils"],
      silica: ["Silicon(IV) oxide (silicon dioxide, SiO₂)", "high (about 1700 °C)", "no", "hard", "Like diamond: a giant covalent network. Each silicon atom bonds to 4 oxygen atoms and each oxygen to 2 silicon atoms, so many strong bonds must break to melt it.", "sand, glass making"],
      metal: ["Metallic bonding (copper)", "usually high (1085 °C)", "yes, solid and molten", "malleable and ductile", "A lattice of positive ions in a sea of delocalised electrons; the bond is the attraction between them. The delocalised electrons move and carry charge. Layers of ions can slide without breaking the bonding, so metals bend and stretch.", "wires, cookware, structures"]
    };
    let st = { s: "ionic" };
    // 3D models: points [x, y, z, colour, radius] and bonds [i, j, dashed?] in model units, centred on 0
    function diamondSites() {
      const N = 1.5, pts = [], key = new Set();
      const add = (x, y, z) => { if ([x, y, z].some((v) => v < -1e-6 || v > N + 1e-6)) return; const k = [x, y, z].map((v) => v.toFixed(2)).join(); if (!key.has(k)) { key.add(k); pts.push([x, y, z]); } };
      for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) for (let k = 0; k <= N; k++)
        for (const [a, b, c] of [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]) { add(i + a, j + b, k + c); add(i + a + 0.25, j + b + 0.25, k + c + 0.25); }
      let bonds = [];
      pts.forEach((p, i) => pts.forEach((q, j) => { if (j > i && Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) - 0.433) < 0.01) bonds.push([i, j]); }));
      // drop atoms left hanging by one bond at the edges of the block
      const deg = pts.map((_, i) => bonds.filter(([a, b]) => a === i || b === i).length), keep = pts.map((_, i) => deg[i] >= 2), idx = [];
      const kept = pts.filter((_, i) => keep[i] && idx.push(i)).map(([x, y, z]) => [x - N / 2, y - N / 2, z - N / 2]);
      bonds = bonds.filter(([a, b]) => keep[a] && keep[b]).map(([a, b]) => [idx.indexOf(a), idx.indexOf(b)]);
      return [kept, bonds];
    }
    const MODEL = {
      ionic: () => {
        const pts = [], bonds = [];
        for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) { const na = (i + j + k + 3) % 2 === 0; pts.push([i, j, k, na ? "cr" : "cb", na ? 7 : 12]); }
        pts.forEach((p, i) => pts.forEach((q, j) => { if (j > i && Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) === 1) bonds.push([i, j, true]); }));
        return [pts, bonds, 78, "small: Na⁺ · large: Cl⁻ · lines: the lattice, not bonds"];
      },
      diamond: () => { const [p, b] = diamondSites(), mid = p.reduce((m, q, i) => (Math.hypot(...q) < Math.hypot(...p[m]) ? i : m), 0); return [p.map((q, i) => [...q, i === mid ? "ca" : "", 9]), b, 122, "highlighted: one carbon and its 4 bonds (a tetrahedron)"]; },
      silica: () => {
        const [p, b] = diamondSites(), pts = p.map((q) => [...q, "ca", 9]), bonds = [];
        b.forEach(([i, j]) => { const o = pts.length; pts.push([(p[i][0] + p[j][0]) / 2, (p[i][1] + p[j][1]) / 2, (p[i][2] + p[j][2]) / 2, "cr", 5]); bonds.push([i, o], [o, j]); });
        return [pts, bonds, 122, "large: Si (4 bonds) · small: O (2 bonds)"];
      },
      graphite: () => {
        const pts = [], bonds = [], L = 2.2;
        for (const [layer, shift] of [[-1, 0], [0, 1], [1, 0]]) {
          const start = pts.length;
          for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) for (const d of [0, 1]) {
            const x = i * Math.sqrt(3) + j * Math.sqrt(3) / 2, z = j * 1.5 + d + shift;
            if (Math.hypot(x, z - 0.5) < 2.75) pts.push([x, layer * L, z, "", 4.5]);
          }
          for (let a = start; a < pts.length; a++) for (let c = a + 1; c < pts.length; c++) if (Math.abs(Math.hypot(pts[a][0] - pts[c][0], pts[a][2] - pts[c][2]) - 1) < 0.01) bonds.push([a, c]);
        }
        pts.forEach((p, a) => pts.forEach((q, c) => { if (c > a && Math.abs(q[1] - p[1] - L) < 0.01 && Math.hypot(p[0] - q[0], p[2] - q[2]) < 0.01 && Math.hypot(p[0], p[2]) < 1.8) bonds.push([a, c, true]); }));
        return [pts, bonds, 48, "dashed: weak forces between layers"];
      }
    };
    let view = { th: 0.6, ph: 0.42, drag: null };
    const built = {};   // each model is built once, then only rotated
    function model3d() {
      const [pts, bonds, sc, note] = (built[st.s] ||= MODEL[st.s]()), ct = Math.cos(view.th), stt = Math.sin(view.th), cp = Math.cos(view.ph), sp = Math.sin(view.ph);
      const P = pts.map(([x, y, z, c, r]) => { const x1 = x * ct + z * stt, z1 = -x * stt + z * ct, y1 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = 1 + z2 * 0.07; return { X: 320 + x1 * sc * f, Y: 142 + y1 * sc * f, z: z2, c, r: r * f }; });
      const zs = P.map((p) => p.z), lo = Math.min(...zs), hi = Math.max(...zs), fade = (z) => (0.35 + 0.65 * (z - lo) / (hi - lo || 1)).toFixed(2);
      const items = bonds.map(([i, j, dash]) => [(P[i].z + P[j].z) / 2 - 0.01, `<path class="${dash ? "l dash" : "bond"}" style="opacity:${fade((P[i].z + P[j].z) / 2)}${dash ? ";--lw:1.2" : ""}" d="M${P[i].X.toFixed(1)} ${P[i].Y.toFixed(1)}L${P[j].X.toFixed(1)} ${P[j].Y.toFixed(1)}"/>`])
        .concat(P.map((p) => [p.z, `<circle class="f ${p.c} dk" style="opacity:${fade(p.z)}" cx="${p.X.toFixed(1)}" cy="${p.Y.toFixed(1)}" r="${p.r.toFixed(1)}"/>`]));
      return items.sort((a, b) => a[0] - b[0]).map((x) => x[1]).join("") + `<text x="16" y="270" style="font-size:11px">${note}</text><text x="16" y="286" style="font-size:10px">3D model — drag to turn it</text>`;
    }
    svg.style.touchAction = "pan-y";
    svg.addEventListener("pointerdown", (e) => { if (MODEL[st.s]) view.drag = [e.clientX, e.clientY, view.th, view.ph]; });
    addEventListener("pointermove", (e) => { if (!view.drag) return; const [x, y, th, ph] = view.drag; view.th = th + (e.clientX - x) * 0.01; view.ph = Math.max(-1.2, Math.min(1.2, ph + (e.clientY - y) * 0.01)); draw(); });
    addEventListener("pointerup", () => (view.drag = null));
    function picture() {
      const s = st.s; let g = "";
      if (MODEL[s]) return model3d();
      if (s === "molecular") [[70, 60], [170, 50], [270, 70], [90, 150], [200, 140], [300, 170], [120, 235], [240, 235]].forEach(([x, y], k) => { const a = k * 0.7; g += `<circle class="f cv dk" cx="${x}" cy="${y}" r="13"/><circle class="f cv dk" cx="${x + 22 * Math.cos(a)}" cy="${y + 22 * Math.sin(a)}" r="13"/><path class="bond" d="M${x} ${y}L${x + 22 * Math.cos(a)} ${y + 22 * Math.sin(a)}"/>`; });
      if (s === "molecular") g += `<path class="l dash" d="M100 75L160 62M200 150L272 82M118 160L200 148M150 228L222 232"/><text x="320" y="260" text-anchor="end">dashed: weak forces between molecules</text>`;
      if (s === "metal") {
        for (let i = 0; i < 7; i++) for (let j = 0; j < 5; j++) { const x = 70 + i * 40, y = 50 + j * 46; g += `<circle class="f cr" cx="${x}" cy="${y}" r="15"/><text x="${x}" y="${y + 4}" text-anchor="middle" style="font-size:11px">+</text>`; }
        for (let k = 0; k < 34; k++) g += `<circle class="e" cx="${70 + ((k * 73) % 250) + 20}" cy="${50 + ((k * 41) % 190) + 22}" r="3"/>`;
        g += `<text x="330" y="282" text-anchor="end">dots: delocalised electrons</text>`;
      }
      return `<g transform="translate(130 0)">${g}</g>`;   // the flat pictures, centred
    }
    function draw() {
      const [title, mp, cond, hard, why, use] = T[st.s];
      svg.innerHTML = picture();
      res.innerHTML = rows([["melting point", mp], ["conducts electricity", cond], ["hardness", hard], ["used for", use]]);
      exp.innerHTML = chips([[st.s === "molecular" ? "Simple" : "Giant"], [cond === "no" ? "does not conduct" : "conducts", cond === "no" ? "" : "up"]]) + `<h3>${title}</h3><p>${why}</p>` + flow(st.s === "molecular" ? ["weak forces between molecules", "little energy to separate", "low melting point"] : ["strong bonds throughout", "lots of energy to break", "high melting point"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.s = "ionic"; paint(); draw(); });
    if (!still) loop(lab, () => { if (MODEL[st.s] && !view.drag) { view.th += 0.008; svg.innerHTML = picture(); } }, 50);
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ atom: atomLab, ionic: ionicLab, covalent: covalentLab, giant: giantLab });
})();
