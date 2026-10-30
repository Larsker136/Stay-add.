/* ==========================================================================
   stay add. — Inheritance: the labs
   (Topics, the step rail and the Interpret chains are the shared lesson form
   in assets/js/lesson.js.)
   Labs: code (a 12-base gene read into amino acids), divide (mitosis or
   meiosis, set by data-kind), cross (Punnett squares for one gene).
   Each exposes lab.applyState(state).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = (list) => list.map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  const chips = (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`;
  const press = (nodes, test) => nodes.forEach((b) => b.setAttribute("aria-pressed", test(b)));
  const flow = (list) => `<p class="flow">${list.map((t) => `<span>${t}</span>`).join("")}</p>`;

  /* =======================================================================
     Lab: from bases to a protein
     The standard genetic code, read from the gene's coding strand (the mRNA
     has the same sequence with U for T).
     ======================================================================= */
  const CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";   // order T C A G
  const AA = {
    F: ["Phe", "phenylalanine"], L: ["Leu", "leucine"], S: ["Ser", "serine"], Y: ["Tyr", "tyrosine"], C: ["Cys", "cysteine"], W: ["Trp", "tryptophan"],
    P: ["Pro", "proline"], H: ["His", "histidine"], Q: ["Gln", "glutamine"], R: ["Arg", "arginine"], I: ["Ile", "isoleucine"], M: ["Met", "methionine"],
    T: ["Thr", "threonine"], N: ["Asn", "asparagine"], K: ["Lys", "lysine"], V: ["Val", "valine"], A: ["Ala", "alanine"], D: ["Asp", "aspartic acid"],
    E: ["Glu", "glutamic acid"], G: ["Gly", "glycine"], "*": ["stop", "stop"]
  };
  const PAIR = { A: "T", T: "A", C: "G", G: "C" };
  const ORIGINAL = "ATGTGGGAGCTT";
  const translate = (seq) => {
    const out = [];
    for (let t = 0; t < seq.length; t += 3) {
      const i = [...seq.slice(t, t + 3)].reduce((n, b) => n * 4 + "TCAG".indexOf(b), 0);
      out.push(CODE[i]);
    }
    return out;
  };
  const hue = (a) => (a === "*" ? "stop" : `aa${"MWELVAGKRSTDFYCHIPQN".indexOf(a) % 6}`);

  function codeLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let seq = ORIGINAL, last = null;
    const bx = (i) => 66 + Math.floor(i / 3) * 140 + (i % 3) * 38;

    function draw() {
      const aas = translate(seq), stopAt = aas.indexOf("*");
      let h = `<text x="10" y="44" class="side-l">DNA</text><text x="10" y="58" class="side-l">gene</text><text x="10" y="104" class="side-l">other</text><text x="10" y="118" class="side-l">strand</text>
        <text x="10" y="166" class="side-l">mRNA</text><text x="10" y="180" class="side-l">copy</text><text x="10" y="246" class="side-l">protein</text>`;
      for (let t = 0; t < 4; t++) {
        const x0 = bx(t * 3) - 6;
        h += `<rect class="trip${stopAt >= 0 && t > stopAt ? " off" : ""}" x="${x0}" y="22" width="${3 * 38 + 4}" height="176" rx="8"/>`;
      }
      [...seq].forEach((b, i) => {
        const x = bx(i), changed = b !== ORIGINAL[i];
        h += `<g class="base-g" data-i="${i}"><rect class="base b${b}${changed ? " changed" : ""}" x="${x}" y="34" width="32" height="30" rx="5"/><text x="${x + 16}" y="54" text-anchor="middle" class="base-t">${b}</text></g>
          <path class="hbond" d="M${x + 16} 66V84"/>
          <rect class="base b${PAIR[b]} dim" x="${x}" y="86" width="32" height="30" rx="5"/><text x="${x + 16}" y="106" text-anchor="middle" class="base-t">${PAIR[b]}</text>
          <path class="copy" d="M${x + 16} 120V148"/>
          <rect class="base rna" x="${x}" y="152" width="32" height="30" rx="5"/><text x="${x + 16}" y="172" text-anchor="middle" class="base-t">${b === "T" ? "U" : b}</text>`;
      });
      // the amino-acid chain
      let px = null;
      aas.forEach((a, t) => {
        if (stopAt >= 0 && t > stopAt) return;
        const cx = bx(t * 3) + 54, cy = 240;
        if (px !== null && a !== "*") h += `<path class="pep" d="M${px + 30} ${cy}H${cx - 30}"/>`;
        h += a === "*"
          ? `<rect class="aa stop" x="${cx - 30}" y="${cy - 18}" width="60" height="36" rx="6"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" class="aa-t">STOP</text>`
          : `<circle class="aa ${hue(a)}" cx="${cx}" cy="${cy}" r="24"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" class="aa-t">${AA[a][0]}</text>`;
        px = cx;
      });
      h += `<text x="604" y="290" text-anchor="end" class="muted">joined at a ribosome, in this order</text>`;
      svg.innerHTML = h;
      $$(".base-g", svg).forEach((g) => g.addEventListener("click", () => {
        const i = +g.dataset.i, order = "ATCG";
        set(i, order[(order.indexOf(seq[i]) + 1) % 4]);
      }));
    }
    function set(i, b) {
      seq = seq.slice(0, i) + b + seq.slice(i + 1);
      last = i;
      render();
    }
    function render() {
      draw();
      const now = translate(seq), was = translate(ORIGINAL);
      const changes = [...seq].filter((b, i) => b !== ORIGINAL[i]).length;
      const stop = now.indexOf("*");
      const made = stop >= 0 ? stop : now.length;
      const diff = now.map((a, t) => (a !== was[t] ? t : -1)).filter((t) => t >= 0);
      const verdict = !changes ? "the original" : stop >= 0 ? "shorter — stopped early" : diff.length ? `${diff.length} amino acid${diff.length > 1 ? "s" : ""} different` : "the same";
      res.innerHTML = rows([["Amino acids", made], ["Bases", `${seq.length} (${seq.length / 3} triplets)`], ["Bases changed", changes], ["Protein", verdict]]);
      const name = (a) => `${AA[a][1]} (${AA[a][0]})`;
      if (!changes) {
        exp.innerHTML = chips([["The gene"]]) + `<h3>${now.map((a) => AA[a][0]).join(" – ")}</h3><p>The top strand is the gene. Its bases are read in groups of <b>three</b>, and each triplet stands for one amino acid. A copy of the gene, <b>mRNA</b>, carries the sequence to a <b>ribosome</b>, which joins the amino acids in that order. Click any base to change it.</p>` +
          flow(["base sequence", "triplets", "amino acid sequence", "protein shape"]);
        return;
      }
      const t = Math.floor((last ?? 0) / 3), from = was[t], to = now[t];
      let head, text;
      if (stop >= 0 && stop < was.length && was[stop] !== "*") {
        head = chips([["Stop", "down"]]);
        text = `<h3>The protein stops early</h3><p>Triplet ${stop + 1} now reads <b>stop</b>, so the ribosome ends the chain there: the protein has only ${made} amino acid${made === 1 ? "" : "s"}. A protein that short will not fold into the right shape, so it cannot do its job.</p>`;
      } else if (diff.length) {
        const sickle = seq.slice(6, 9) === "GTG" && ORIGINAL.slice(6, 9) === "GAG";
        head = chips([["Different amino acid", "warn"]]);
        text = `<h3>${name(from)} → ${name(to)}</h3><p>One base changed one triplet, so one amino acid in the chain is different. The protein may fold into a different shape and work less well, or not at all.${sickle ? " This exact change — glutamic acid to valine — is the one in the haemoglobin gene that causes <b>sickle-cell anaemia</b>." : ""}</p>`;
      } else {
        head = chips([["Same protein", "up"]]);
        text = `<h3>Still ${name(to)}</h3><p>The base changed, but the new triplet codes for the <b>same</b> amino acid — several triplets can stand for one amino acid. The protein is unchanged.</p>`;
      }
      exp.innerHTML = head + text + flow(["base changed", "triplet changed", stop >= 0 ? "stop" : diff.length ? "different amino acid" : "same amino acid", stop >= 0 ? "short protein" : diff.length ? "protein may change shape" : "same protein"]);
    }
    $("[data-random]", lab).addEventListener("click", () => {
      const i = 3 + Math.floor(Math.random() * 9), others = "ATCG".replace(seq[i], "");   // keep the first triplet (the start)
      set(i, others[Math.floor(Math.random() * 3)]);
    });
    $$("[data-edit]", lab).forEach((b) => b.addEventListener("click", () => { const [i, base] = b.dataset.edit.split(","); seq = ORIGINAL; set(+i, base); }));
    $("[data-reset]", lab).addEventListener("click", () => { seq = ORIGINAL; last = null; render(); });
    lab.applyState = (s) => { seq = ORIGINAL; last = null; if (s.edit) set(s.edit[0], s.edit[1]); else render(); };
    render();
  }

  /* =======================================================================
     Lab: mitosis / meiosis
     Four chromosomes (two pairs): A long, B short; 1 from the mother, 2 from
     the father. Each has two chromatids, drawn on top of each other until the
     chromosome is copied. Positions are CSS transforms, so moving between
     steps animates by itself.
     ======================================================================= */
  const CHR = [
    { id: "A1", pair: "A", p: 1, len: 54 }, { id: "A2", pair: "A", p: 2, len: 54 },
    { id: "B1", pair: "B", p: 1, len: 32 }, { id: "B2", pair: "B", p: 2, len: 32 }
  ];
  const SCATTER = { A1: [262, 118, -20], A2: [372, 176, 25], B1: [298, 194, 60], B2: [368, 108, -45] };
  const STEPS = {
    mitosis: [["Start", "One diploid cell"], ["Copy", "Every chromosome is copied"], ["Line up", "Chromosomes line up in the middle"], ["Separate", "The copies are pulled apart"], ["Two cells", "Two identical cells"]],
    meiosis: [["Start", "One diploid cell"], ["Copy", "Every chromosome is copied"], ["Pairs", "Pairs line up side by side"], ["Division 1", "The pairs separate"], ["Division 2", "The copies separate: four gametes"]]
  };
  function layout(kind, step, orient) {
    const main = { x: 320, y: 150, rx: 150, ry: 106 };
    let cells = [main, main, main, main].map((c) => ({ ...c, show: false }));
    cells[0].show = true;
    const pos = {};   // id → [[x, y, r] for chromatid 0, chromatid 1]
    const pair = (x, y, r, gap) => { const a = (r * Math.PI) / 180, dx = Math.cos(a) * gap, dy = Math.sin(a) * gap; return [[x - dx, y - dy, r], [x + dx, y + dy, r]]; };
    if (step <= 1) CHR.forEach((c) => { const [x, y, r] = SCATTER[c.id]; pos[c.id] = pair(x, y, r, step ? 5.5 : 0); });
    if (kind === "mitosis") {
      const ys = { A1: 80, B1: 128, A2: 176, B2: 222 };
      if (step === 2) CHR.forEach((c) => (pos[c.id] = pair(320, ys[c.id], 0, 5.5)));
      if (step === 3) { cells[0] = { x: 320, y: 150, rx: 182, ry: 98, show: true }; CHR.forEach((c) => (pos[c.id] = [[226, ys[c.id], 0], [414, ys[c.id], 0]])); }
      if (step === 4) {
        const L = { x: 172, y: 150, rx: 122, ry: 92, show: true }, R = { x: 468, y: 150, rx: 122, ry: 92, show: true };
        cells = [L, R, { ...L, show: false }, { ...R, show: false }];
        CHR.forEach((c) => {
          const [x, y, r] = SCATTER[c.id], ox = (x - 320) * 0.72, oy = (y - 150) * 0.72;
          pos[c.id] = [[L.x + ox, L.y + oy, r], [R.x + ox, R.y + oy, r]];
        });
      }
    } else {
      // orient.A / orient.B: 0 → the mother's copy faces left, 1 → the father's
      const left = (c) => (orient[c.pair] === 0) === (c.p === 1);
      const rowY = { A: 104, B: 200 };
      if (step === 2) CHR.forEach((c) => (pos[c.id] = pair(left(c) ? 298 : 342, rowY[c.pair], 0, 5.5)));
      const L = { x: 172, y: 150, rx: 122, ry: 92, show: true }, R = { x: 468, y: 150, rx: 122, ry: 92, show: true };
      if (step === 3) {
        cells = [L, R, { ...L, show: false }, { ...R, show: false }];
        CHR.forEach((c) => { const cx = (left(c) ? L : R).x; pos[c.id] = pair(cx + (c.pair === "A" ? -16 : 18), c.pair === "A" ? 136 : 168, 0, 5.5); });
      }
      if (step === 4) {
        const xs = [88, 392, 248, 552];   // cells 0 and 2 come from the left cell, 1 and 3 from the right
        cells = xs.map((x) => ({ x, y: 150, rx: 66, ry: 62, show: true }));
        CHR.forEach((c) => {
          const k = left(c) ? 0 : 1, y = c.pair === "A" ? 136 : 166, dx = c.pair === "A" ? -10 : 12;
          pos[c.id] = [[xs[k] + dx, y, 0], [xs[k + 2] + dx, y, 0]];
        });
      }
    }
    return { cells, pos };
  }
  function divideLab(lab) {
    const kind = lab.dataset.kind, svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), stepsEl = $("[data-steps]", lab);
    const steps = STEPS[kind], play = $("[data-play]", lab), shuffleBtn = $("[data-shuffle]", lab);
    let step = 0, orient = { A: 0, B: 0 }, seen = new Set(), timer = 0;

    stepsEl.innerHTML = steps.map(([s], i) => `<button type="button" data-step="${i}">${i + 1}<small>${s}</small></button>`).join("");
    svg.innerHTML = `<g data-cells>${[0, 1, 2, 3].map((i) => `<ellipse class="cellv" data-cell="${i}" rx="1" ry="1"/>`).join("")}</g>
      <g data-chr>${CHR.map((c) => [0, 1].map((k) => `<g class="cv" data-c="${c.id}${k}"><rect class="chr p${c.p}" x="-5" y="${-c.len / 2}" width="10" height="${c.len}" rx="5"/></g>`).join("")).join("")}</g>
      <text x="320" y="292" text-anchor="middle" class="lbl-ink" data-cap></text>
      <g data-tags></g>`;

    function gametes() {
      // the chromosomes in each of the four gametes, as "A1 B2" etc.
      const left = (c) => (orient[c.pair] === 0) === (c.p === 1);
      const l = CHR.filter(left).map((c) => c.id).sort().join(" "), r = CHR.filter((c) => !left(c)).map((c) => c.id).sort().join(" ");
      return [l, r];
    }
    function render() {
      press($$("[data-step]", stepsEl), (b) => +b.dataset.step === step);
      const { cells, pos } = layout(kind, step, orient);
      $$("[data-cell]", svg).forEach((e, i) => {
        const c = cells[i];
        e.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.rx}, ${c.ry})`;
        e.style.opacity = c.show ? 1 : 0;
      });
      CHR.forEach((c) => [0, 1].forEach((k) => {
        const [x, y, r] = pos[c.id][k];
        $(`[data-c="${c.id}${k}"]`, svg).style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r}deg)`;
      }));
      $("[data-cap]", svg).textContent = `${step + 1} · ${steps[step][1]}`;
      // number of chromosomes under each finished cell
      const tags = step === 4 ? cells.filter((c) => c.show).map((c) => `<text x="${c.x}" y="${c.y + c.ry + 18}" text-anchor="middle" class="muted">${kind === "mitosis" ? "4 · diploid" : "2 · haploid"}</text>`).join("") : "";
      $("[data-tags]", svg).innerHTML = tags;

      if (kind === "meiosis" && step === 4) gametes().forEach((g) => seen.add(g));
      const cellsN = cells.filter((c) => c.show).length;
      const perCell = kind === "mitosis" ? 4 : step >= 3 ? 2 : 4;
      res.innerHTML = rows([
        ["Cells", cellsN],
        ["Chromosomes per cell", step >= 3 && kind === "meiosis" ? `${perCell} (haploid)` : step === 4 ? "4 (diploid)" : step === 3 && kind === "mitosis" ? "4 + 4 (separating)" : "4 (diploid)"],
        ["Each chromosome", step === 0 ? "one copy" : (kind === "mitosis" ? step >= 3 : step === 4) ? "one copy again" : "two copies, joined"],
        kind === "mitosis" ? ["Same as the parent cell?", step === 4 ? "yes — identical" : "—"] : ["Kinds of gamete seen", `${seen.size} of 4`]
      ]);

      const T = {
        mitosis: [
          ["Start", "One diploid cell", "This cell has two pairs of chromosomes — 4 in all, so it is <b>diploid</b> (humans have 23 pairs). In each pair, one came from the mother (blue) and one from the father (pink).", ["diploid cell", "2 pairs", "4 chromosomes"]],
          ["Copy", "Every chromosome is copied", "Before the nucleus divides, each chromosome makes an <b>exact copy</b> of itself. The two copies stay joined, so each chromosome now looks double.", ["DNA copied", "each chromosome doubled", "copies joined"]],
          ["Line up", "Chromosomes line up in the middle", "The chromosomes line up across the middle of the cell, one behind another. Each one has a copy on the left and a copy on the right.", ["chromosomes line up", "one copy facing each side"]],
          ["Separate", "The copies are pulled apart", "The two copies of every chromosome are pulled to opposite ends of the cell. Each end gets <b>one copy of every chromosome</b> — the same set.", ["copies separate", "one of each to each end", "same set both sides"]],
          ["Two cells", "Two genetically identical cells", "Two new nuclei form and the cell divides. Each new cell has <b>4 chromosomes</b>, exactly the same as the parent cell: they are <b>genetically identical</b>.", ["two nuclei", "same number", "same genes", "identical cells"]]
        ],
        meiosis: [
          ["Start", "One diploid cell", "This cell has two pairs of chromosomes: 4, so it is <b>diploid</b>. One of each pair came from the mother (blue), one from the father (pink).", ["diploid cell", "2 pairs"]],
          ["Copy", "Every chromosome is copied", "As in mitosis, every chromosome is copied first, so each one is double.", ["DNA copied", "each chromosome doubled"]],
          ["Pairs", "Pairs line up side by side", `Now the two members of each pair line up <b>next to each other</b>. Which one faces left is <b>random</b> — here the long pair has the ${orient.A === 0 ? "mother’s" : "father’s"} on the left and the short pair the ${orient.B === 0 ? "mother’s" : "father’s"}. Press <b>Shuffle the line-up</b> to try another.`, ["pairs side by side", "random way round"]],
          ["Division 1", "The pairs separate", "The first division pulls the <b>pairs apart</b>: each new cell gets <b>one of each pair</b> — 2 chromosomes, not 4. The number has been halved: the cells are <b>haploid</b>.", ["pairs separate", "one of each pair per cell", "number halved"]],
          ["Division 2", "Four haploid gametes", `The second division separates the copies, giving <b>four haploid cells</b>. They are not all the same: two carry <b>${gametes()[0]}</b> and two carry <b>${gametes()[1]}</b>. A different line-up gives different gametes.`, ["copies separate", "4 haploid cells", "genetically different", "gametes"]]
        ]
      }[kind][step];
      exp.innerHTML = chips([[`Step ${step + 1} of 5`], ...(step === 4 ? [[kind === "mitosis" ? "Identical" : "Different", kind === "mitosis" ? "up" : "warn"]] : [])]) + `<h3>${T[1]}</h3><p>${T[2]}</p>` + flow(T[3]);
    }
    const stop = () => { clearInterval(timer); timer = 0; play.textContent = "Play all"; };
    const go = (s) => { step = Math.max(0, Math.min(4, s)); render(); };
    $$("[data-step]", stepsEl).forEach((b) => b.addEventListener("click", () => { stop(); go(+b.dataset.step); }));
    $("[data-next-step]", lab).addEventListener("click", () => { stop(); go(step === 4 ? 0 : step + 1); });
    play.addEventListener("click", () => {
      if (timer) return stop();
      if (still) return go(4);
      go(0); play.textContent = "Pause";
      timer = setInterval(() => { if (step >= 4) return stop(); go(step + 1); }, 1400);
    });
    const shuffle = () => {
      const was = `${orient.A}${orient.B}`;
      do orient = { A: Math.round(Math.random()), B: Math.round(Math.random()) }; while (`${orient.A}${orient.B}` === was);
    };
    shuffleBtn?.addEventListener("click", () => { stop(); shuffle(); go(Math.max(step, 2)); });
    $("[data-reset]", lab).addEventListener("click", () => { stop(); orient = { A: 0, B: 0 }; seen = new Set(); go(0); });
    lab.applyState = (s) => { stop(); if (s.shuffle) { shuffle(); go(4); } else go(s.step ?? 0); };
    render();
    requestAnimationFrame(() => svg.classList.add("ready"));   // animate moves only after the first layout
  }

  /* =======================================================================
     Lab: genetic crosses — a Punnett square for one gene
     Three kinds: dominant/recessive (pea height), codominant (ABO blood
     groups) and sex-linked (red–green colour vision on the X chromosome).
     ======================================================================= */
  const sup = (base, s, svg) => (svg ? `${base}<tspan class="sup" dy="-6">${s}</tspan><tspan dy="6">​</tspan>` : `${base}<sup>${s}</sup>`);
  const CROSS = {
    dom: {
      h: ["Parent 1", "Parent 2"],
      opts: [["TT", "Tt", "tt"], ["TT", "Tt", "tt"]],
      start: ["Tt", "Tt"],
      gametes: (g) => [g[0], g[1]],
      allele: (a) => a,
      join: (a, b) => (a === "T" || b !== "T" ? a + b : b + a),
      show: (g) => g,
      phen: (g) => (g.includes("T") ? "tall" : "short"),
      phens: ["tall", "short"],
      col: { tall: "var(--c-bio)", short: "var(--amber)" },
      name: (g) => `${g} (${g.includes("T") ? "tall" : "short"})`
    },
    blood: {
      h: ["Parent 1", "Parent 2"],
      opts: [["AA", "AO", "BB", "BO", "AB", "OO"], ["AA", "AO", "BB", "BO", "AB", "OO"]],
      start: ["AO", "BO"],
      gametes: (g) => [g[0], g[1]],
      allele: (a, svg) => sup("I", a, svg),
      join: (a, b) => [a, b].sort().join(""),
      show: (g, svg) => sup("I", g[0], svg) + sup("I", g[1], svg),
      phen: (g) => (g.includes("A") && g.includes("B") ? "AB" : g.includes("A") ? "A" : g.includes("B") ? "B" : "O"),
      phens: ["A", "B", "AB", "O"],
      col: { A: "var(--rose)", B: "var(--blue)", AB: "var(--violet)", O: "var(--amber)" },
      name: (g, svg) => `${sup("I", g[0], svg)}${sup("I", g[1], svg)} (group ${CROSS.blood.phen(g)})`
    },
    sex: {
      h: ["Mother", "Father"],
      opts: [["BB", "Bb", "bb"], ["B", "b"]],
      start: ["Bb", "B"],
      gametes: (g, k) => (k === 0 ? [g[0], g[1]] : [g, "Y"]),
      allele: (a, svg) => (a === "Y" ? "Y" : sup("X", a, svg)),
      // mother's gamete first, then father's
      join: (m, f) => (f === "Y" ? m + "Y" : [m, f].sort().join("")),
      show: (g, svg) => (g.endsWith("Y") ? sup("X", g[0], svg) + "Y" : sup("X", g[0], svg) + sup("X", g[1], svg)),
      phen: (g) => (g.endsWith("Y") ? (g[0] === "B" ? "boy, normal" : "boy, colour-blind") : g === "BB" ? "girl, normal" : g === "Bb" ? "girl, carrier" : "girl, colour-blind"),
      phens: ["girl, normal", "girl, carrier", "girl, colour-blind", "boy, normal", "boy, colour-blind"],
      col: { "girl, normal": "var(--c-bio)", "girl, carrier": "var(--teal)", "girl, colour-blind": "var(--rose)", "boy, normal": "var(--blue)", "boy, colour-blind": "var(--c-denat)" },
      name: (g, svg, k) => (k === 1 ? `${sup("X", g, svg)}Y (${g === "B" ? "normal" : "colour-blind"})` : `${sup("X", g[0], svg)}${sup("X", g[1], svg)} (${g === "BB" ? "normal" : g === "Bb" ? "carrier" : "colour-blind"})`)
    }
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const ratio = (counts) => { const v = Object.values(counts), d = v.reduce(gcd); return Object.entries(counts).map(([k, n]) => [k, n / d]); };

  function crossLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), keyEl = $("[data-key-list]", lab);
    let st = { type: "dom", p: [...CROSS.dom.start], sample: null };

    function square() {
      const T = CROSS[st.type];
      const cols = T.gametes(st.p[0], 0), side = T.gametes(st.p[1], 1);
      const cells = side.map((r) => cols.map((c) => T.join(c, r)));
      return { T, cols, side, cells, flat: cells.flat() };
    }
    function render() {
      const { T, cols, side, cells, flat } = square();
      press($$("[data-type]", lab), (b) => b.dataset.type === st.type);
      [0, 1].forEach((k) => {
        $(`[data-p${k + 1}-h]`, lab).textContent = T.h[k];
        const box = $(`[data-p${k + 1}]`, lab);
        box.innerHTML = T.opts[k].map((o) => `<button class="sc" type="button" data-pick="${k}" data-g="${o}" aria-pressed="${st.p[k] === o}">${T.name(o, false, k)}</button>`).join("");
      });
      $$("[data-pick]", lab).forEach((b) => b.addEventListener("click", () => { st.p[+b.dataset.pick] = b.dataset.g; st.sample = null; render(); }));
      // counts
      const gCount = {}, pCount = {};
      flat.forEach((g) => (gCount[g] = (gCount[g] || 0) + 1));
      T.phens.forEach((p) => { const n = flat.filter((g) => T.phen(g) === p).length; if (n) pCount[p] = n; });   // in the usual order
      const phens = T.phens.filter((p) => pCount[p]);
      keyEl.innerHTML = phens.map((p) => `<span><i style="background:${T.col[p]}"></i>${p}</span>`).join("");

      // the Punnett square
      const X0 = 150, Y0 = 70, CW = 96, CH = 70;
      let h = `<text x="${X0 + CW}" y="20" text-anchor="middle" class="pq-h">${T.h[0]} ${T.name(st.p[0], true, 0)}</text>
        <text x="${X0 + CW}" y="42" text-anchor="middle" class="muted">gametes</text>
        <text x="58" y="${Y0 + CH - 14}" text-anchor="middle" class="pq-h">${T.h[1]}</text>
        <text x="58" y="${Y0 + CH + 6}" text-anchor="middle" class="pq-h">${T.show(st.type === "sex" ? st.p[1] + "Y" : st.p[1], true)}</text>`;
      cols.forEach((c, i) => (h += `<circle class="gam-c" cx="${X0 + CW * i + CW / 2}" cy="${Y0 - 14}" r="15"/><text x="${X0 + CW * i + CW / 2}" y="${Y0 - 9}" text-anchor="middle" class="pq-a">${T.allele(c, true)}</text>`));
      side.forEach((r, j) => (h += `<circle class="gam-c" cx="${X0 - 22}" cy="${Y0 + CH * j + CH / 2}" r="15"/><text x="${X0 - 22}" y="${Y0 + CH * j + CH / 2 + 5}" text-anchor="middle" class="pq-a">${T.allele(r, true)}</text>`));
      cells.forEach((row, j) => row.forEach((g, i) => {
        const p = T.phen(g), x = X0 + CW * i, y = Y0 + CH * j;
        h += `<rect class="pq-cell" x="${x}" y="${y}" width="${CW}" height="${CH}" style="--pc:${T.col[p]}"/>
          <text x="${x + CW / 2}" y="${y + 32}" text-anchor="middle" class="pq-g">${T.show(g, true)}</text>
          <text x="${x + CW / 2}" y="${y + 52}" text-anchor="middle" class="pq-p">${st.type === "sex" ? p.split(", ")[1] : p}</text>`;
      }));
      // expected and sampled proportions
      const BX = 400, BW = 150;
      h += `<text x="${BX}" y="20" class="pq-h">expected</text>${st.sample ? `<text x="${BX + BW + 70}" y="20" text-anchor="end" class="muted">in 20</text>` : ""}`;
      phens.forEach((p, k) => {
        const y = 44 + k * (st.type === "sex" ? 42 : 58), f = pCount[p] / 4, s = st.sample ? (st.sample[p] || 0) : null;
        h += `<text x="${BX}" y="${y}" class="pq-l">${p}</text>
          <rect class="pq-bar-bg" x="${BX}" y="${y + 6}" width="${BW}" height="10" rx="2"/><rect x="${BX}" y="${y + 6}" width="${(BW * f).toFixed(1)}" height="10" rx="2" style="fill:${T.col[p]}"/>
          <text x="${BX + BW + 8}" y="${y + 15}" class="pq-n">${Math.round(f * 100)} %</text>`;
        if (s !== null) h += `<rect x="${BX}" y="${y + 19}" width="${((BW * s) / 20).toFixed(1)}" height="5" rx="1" style="fill:${T.col[p]};opacity:.55"/><text x="${BX + BW + 70}" y="${y + 15}" text-anchor="end" class="pq-n">${s}</text>`;
      });
      svg.innerHTML = h;

      const gRatio = ratio(gCount).map(([g, n]) => `${n} ${T.show(g)}`).join(" : ");
      const pRatio = ratio(pCount).map(([p, n]) => `${n} ${p}`).join(" : ");
      const recessive = st.type === "dom" ? "short" : st.type === "blood" ? "O" : "boy, colour-blind";
      res.innerHTML = rows([
        ["Phenotypes", pRatio],
        ["Genotypes", gRatio],
        [`Chance: ${recessive}`, `${Math.round(((pCount[recessive] || 0) / 4) * 100)} %`],
        ["In 20 offspring", st.sample ? phens.map((p) => `${st.sample[p] || 0} ${p}`).join(", ") : "—"]
      ]);

      // what just happened
      const g1 = T.gametes(st.p[0], 0), g2 = T.gametes(st.p[1], 1);
      const gamTxt = (g, k) => (g[0] === g[1] ? `only ${T.allele(g[0])} gametes` : `${T.allele(g[0])} and ${T.allele(g[1])} gametes, half of each`);
      let note = "";
      if (st.type === "dom") {
        const [a, b] = st.p;
        if ((a === "TT" && b === "tt") || (a === "tt" && b === "TT")) note = "Both parents are <b>pure-breeding</b> (homozygous), so every offspring is Tt — tall, but carrying the hidden t allele.";
        else if (a === "Tt" && b === "Tt") note = "Each parent hides a t allele. A quarter of the offspring receive t from both, so the recessive phenotype reappears: <b>3 tall : 1 short</b>.";
        else if ((a === "tt" && b !== "tt") || (b === "tt" && a !== "tt")) note = `This is a <b>test cross</b>: one parent shows the recessive phenotype. ${[a, b].includes("Tt") ? "Short offspring appear, which proves the tall parent is <b>Tt</b>." : "All offspring are tall, which shows the tall parent is <b>TT</b>."}`;
        else if (a === b) note = "Both parents are homozygous for the same allele, so they are pure-breeding: every offspring is like them.";
        else note = "One parent is TT, so every offspring gets at least one T: all tall.";
      } else if (st.type === "blood") {
        note = pCount.AB ? "Where I<sup>A</sup> and I<sup>B</sup> meet, <b>both</b> are expressed: group AB. That is <b>codominance</b>. " : "";
        note += pCount.O ? "Group O needs I<sup>O</sup> from <b>both</b> parents, because I<sup>O</sup> is recessive to I<sup>A</sup> and I<sup>B</sup>." : "No child can be group O here: at least one parent cannot give an I<sup>O</sup> allele.";
      } else {
        note = "Sons get their only X from their <b>mother</b> and a Y from their father, so the father’s allele never reaches his sons. ";
        note += pCount["boy, colour-blind"] ? `${pCount["boy, colour-blind"] === 2 ? "All" : "Half"} of the sons are expected to be colour-blind${pCount["girl, carrier"] ? ", and half of the daughters are carriers" : ""}.` : "No son can be colour-blind, because the mother has no X<sup>b</sup>.";
        if (pCount["girl, colour-blind"]) note += " A daughter can only be colour-blind if she gets X<sup>b</sup> from <b>both</b> parents.";
      }
      const sampleTxt = st.sample ? `<p>In your sample of 20 offspring: ${phens.map((p) => `<b>${st.sample[p] || 0}</b> ${p}`).join(", ")}. The expected numbers were ${phens.map((p) => `${(pCount[p] / 4) * 20}`).join(", ")}. Small samples rarely match the ratio exactly — each offspring is a separate chance.</p>` : "";
      exp.innerHTML = chips([[{ dom: "Dominant / recessive", blood: "Codominance", sex: "Sex-linked" }[st.type]], [pRatio, "up"]]) +
        `<h3>${T.name(st.p[0], false, 0)} × ${T.name(st.p[1], false, 1)}</h3>
         <p>${T.h[0]} makes ${gamTxt(g1, 0)}; ${T.h[1].toLowerCase()} makes ${gamTxt(g2, 1)}. Each box is one equally likely combination. ${note}</p>${sampleTxt}` +
        flow(["parental genotypes", "gametes", "Punnett square", `genotypes ${gRatio}`, `phenotypes ${pRatio}`]);
    }
    function sample() {
      const { T, flat } = square(), out = {};
      for (let i = 0; i < 20; i++) { const p = T.phen(flat[Math.floor(Math.random() * 4)]); out[p] = (out[p] || 0) + 1; }
      st.sample = out; render();
    }
    $$("[data-type]", lab).forEach((b) => b.addEventListener("click", () => { st = { type: b.dataset.type, p: [...CROSS[b.dataset.type].start], sample: null }; render(); }));
    $("[data-sample]", lab).addEventListener("click", sample);
    $("[data-reset]", lab).addEventListener("click", () => { st = { type: "dom", p: [...CROSS.dom.start], sample: null }; render(); });
    lab.applyState = (s) => { const t = s.type || st.type; st = { type: t, p: [s.p1 || CROSS[t].start[0], s.p2 || CROSS[t].start[1]], sample: null }; render(); };
    render();
  }

  const LABS = { code: codeLab, divide: divideLab, cross: crossLab };
  $$("[data-lab]").forEach((lab) => LABS[lab.dataset.mode]?.(lab));
})();
