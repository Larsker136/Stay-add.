/* ==========================================================================
   stay add. — Reproduction: the labs
   (Topics, the step rail and the Interpret chains are the shared lesson form
   in assets/js/lesson.js. The asexual and human topics have figures only.)
   Labs: mix (gametes → zygote, or a clone), flower (parts, insect vs wind),
   cycle (the menstrual cycle, day by day). Each exposes lab.applyState(state).
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
  const ORD = ["first", "second", "third"];

  /* =======================================================================
     Lab: two parents, a new mix
     A model organism with 3 pairs of chromosomes. Each parent's pair has a
     dark and a light copy (the two it got from its own parents).
     ======================================================================= */
  function mixLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const LEN = [40, 30, 20], W = 7;
    let st = { org: "model", last: null, g1: [0, 0, 0], g2: [0, 0, 0], kids: [] };
    const rand = () => [0, 1, 2].map(() => (Math.random() < 0.5 ? 0 : 1));
    const bar = (x, y, k, p, light, s = 1) => `<rect class="chr p${p}${light ? " lt" : ""}" x="${(x - (W * s) / 2).toFixed(1)}" y="${(y - (LEN[k] * s) / 2).toFixed(1)}" width="${(W * s).toFixed(1)}" height="${(LEN[k] * s).toFixed(1)}" rx="${((W * s) / 2).toFixed(1)}"/>`;
    // a parent: three pairs, dark + light copy of each
    const parent = (cx, cy, p) => [0, 1, 2].map((k) => bar(cx - 30 + k * 26, cy, k, p, false) + bar(cx - 21 + k * 26, cy, k, p, true)).join("");
    const gamete = (cx, cy, p, g) => [0, 1, 2].map((k) => bar(cx - 13 + k * 13, cy, k, p, g[k] === 1)).join("");
    // a zygote: for each pair, parent 1's copy then parent 2's (or both of parent 1's for a clone)
    const zygote = (cx, cy, kid, s = 1) => [0, 1, 2].map((k) => {
      const x = cx + (-30 + k * 26) * s;
      return kid.mode === "clone" ? bar(x, cy, k, 1, false, s) + bar(x + 9 * s, cy, k, 1, true, s) : bar(x, cy, k, 1, kid.g1[k] === 1, s) + bar(x + 9 * s, cy, k, 2, kid.g2[k] === 1, s);
    }).join("");
    const key = (kid) => (kid.mode === "clone" ? "clone" : kid.g1.join("") + kid.g2.join(""));

    function draw() {
      const kid = st.kids.at(-1), clone = kid?.mode === "clone";
      let h = `
        <defs><marker id="arM" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1L10 5L0 9z" class="ar-h"/></marker></defs>
        <circle class="cell" cx="92" cy="74" r="50"/>${parent(92, 74, 1)}<text x="92" y="16" text-anchor="middle">parent 1 · 2n</text>
        <circle class="cell" cx="92" cy="190" r="50"/>${parent(92, 190, 2)}<text x="92" y="258" text-anchor="middle">parent 2 · 2n</text>`;
      if (!kid) {
        h += `<text x="420" y="136" text-anchor="middle" class="lbl-ink">make an offspring →</text>`;
      } else if (clone) {
        h += `<path class="ar dash" d="M146 86C260 86 340 102 398 120" marker-end="url(#arM)"/><text x="270" y="78" text-anchor="middle">mitosis: an exact copy</text>
          <text x="262" y="194" text-anchor="middle" class="muted">no gametes</text>`;
      } else {
        h += `<path class="ar" d="M146 74H222" marker-end="url(#arM)"/><path class="ar" d="M146 190H222" marker-end="url(#arM)"/>
          <g class="pop"><circle class="cell gam" cx="262" cy="74" r="32"/>${gamete(262, 74, 1, kid.g1)}<circle class="cell gam" cx="262" cy="190" r="32"/>${gamete(262, 190, 2, kid.g2)}</g>
          <text x="262" y="30" text-anchor="middle">gamete · n</text><text x="262" y="240" text-anchor="middle">gamete · n</text>
          <path class="ar" d="M296 86L396 120" marker-end="url(#arM)"/><path class="ar" d="M296 178L396 146" marker-end="url(#arM)"/>
          <text x="344" y="138" text-anchor="middle" class="muted">fertilisation</text>`;
      }
      if (kid) h += `<g class="pop"><circle class="cell zyg" cx="470" cy="132" r="64"/>${zygote(470, 132, kid)}</g><text x="470" y="218" text-anchor="middle" class="lbl-ink">${clone ? "offspring · identical to parent 1" : "zygote · 2n"}</text>`;
      // offspring so far
      h += `<path class="gl" d="M10 272H630"/><text x="10" y="294">offspring so far</text>`;
      const seen = [];
      st.kids.slice(-8).forEach((k, i) => {
        const x = 150 + i * 62, dup = seen.includes(key(k)) && k.mode !== "clone";
        seen.push(key(k));
        h += `<circle class="cell${k.mode === "clone" ? "" : " zyg"}" cx="${x}" cy="314" r="22"/>${zygote(x, 314, k, 0.42)}${k.mode === "clone" ? `<text x="${x}" y="352" text-anchor="middle" class="muted">clone</text>` : dup ? `<text x="${x}" y="352" text-anchor="middle" class="muted">repeat</text>` : ""}`;
      });
      svg.innerHTML = h;
    }
    function render() {
      press($$("[data-org]", lab), (b) => b.dataset.org === st.org);
      draw();
      const sexKids = st.kids.filter((k) => k.mode !== "clone"), kinds = new Set(sexKids.map(key)).size;
      const human = st.org === "human";
      res.innerHTML = rows([
        ["Chromosomes in a gamete", human ? "23 (n)" : "3 (n)"],
        ["In a body cell / zygote", human ? "46 (2n)" : "6 (2n)"],
        ["Kinds of gamete per parent", human ? "2²³ ≈ 8.4 million" : "2³ = 8"],
        ["Possible zygotes", human ? "≈ 70 million million" : "8 × 8 = 64"],
        ["Offspring made", st.kids.length],
        ["All different?", sexKids.length ? `${kinds} kinds in ${sexKids.length}` : "—"]
      ]);
      const kid = st.kids.at(-1);
      if (!kid) {
        exp.innerHTML = chips([["Ready"]]) + `<h3>Two parents, three pairs each</h3><p>Each parent cell is <b>diploid</b>: three pairs of chromosomes. In every pair, one copy (dark) came from that parent’s mother and the other (light) from its father. Make an offspring sexually, then asexually, and compare them in the row below.</p>`;
        return;
      }
      if (kid.mode === "clone") {
        exp.innerHTML = chips([["Asexual"], ["Identical", "warn"]]) + `<h3>A clone of parent 1</h3><p>No gametes and no fertilisation: the cell divided by <b>mitosis</b>, so the offspring has <b>exactly</b> the same six chromosomes as parent 1 — and so does every other clone you make.</p>` +
          flow(["one parent", "mitosis", "same chromosomes", "genetically identical"]);
        return;
      }
      const pick = (g) => g.map((v, k) => `${v ? "light" : "dark"} ${ORD[k]}`).join(", ");
      const n = sexKids.length, newOne = sexKids.filter((k) => key(k) === key(kid)).length === 1;
      exp.innerHTML = chips([["Sexual"], [newOne ? "New combination" : "Repeat", newOne ? "up" : "warn"]]) +
        `<h3>${newOne ? "A new combination" : "This mix has turned up before"}</h3>
         <p>Parent 1’s gamete took the <b>${pick(kid.g1)}</b> chromosome; parent 2’s took the <b>${pick(kid.g2)}</b>. Each gamete has <b>one from each pair</b> — 3 chromosomes, haploid. At fertilisation the two nuclei fuse, so the zygote has 3 <b>pairs</b> again, one of each pair from each parent.</p>
         ${n > 1 ? `<p>${new Set(sexKids.map(key)).size} different offspring from ${n} tries, with only 3 pairs. Humans have 23 pairs, so two children of the same parents are almost never alike (apart from identical twins).</p>` : ""}` +
        flow(["gametes, one chromosome from each pair", "random which one", "nuclei fuse", "new combination", "variation"]);
    }
    function make(mode, times = 1) {
      for (let i = 0; i < times; i++) {
        const kid = mode === "clone" ? { mode } : { mode, g1: rand(), g2: rand() };
        st.kids.push(kid);
      }
      st.kids = st.kids.slice(-8);
      render();
    }
    $("[data-sex]", lab).addEventListener("click", () => make("sex"));
    $("[data-clone]", lab).addEventListener("click", () => make("clone"));
    $$("[data-org]", lab).forEach((b) => b.addEventListener("click", () => { st.org = b.dataset.org; render(); }));
    $("[data-reset]", lab).addEventListener("click", () => { st = { org: "model", kids: [] }; render(); });
    lab.applyState = (s) => {
      if (s.org) st.org = s.org;
      if (s.make) { if (s.times) st.kids = []; make(s.make, s.times || 1); } else render();
    };
    render();
  }

  /* =======================================================================
     Lab: inside a flower — half a flower, cut lengthways
     ======================================================================= */
  const PARTS = {
    stigma: { name: "stigma", sex: "female", job: "catches pollen grains: this is where pollination ends", insect: "inside the flower, small and sticky", wind: "large and feathery, hanging outside — a big surface to trap pollen from the air", after: "withers" },
    style: { name: "style", sex: "female", job: "holds the stigma up; the pollen tube grows down through it to the ovule", insect: "holds the stigma inside the flower", wind: "short", after: "withers" },
    ovary: { name: "ovary", sex: "female", job: "holds the ovules and protects them", insect: "at the base of the flower", wind: "at the base of the flower", after: "becomes the fruit" },
    ovule: { name: "ovule", sex: "female", job: "contains the female gamete; its nucleus fuses with a male nucleus from the pollen", insect: "inside the ovary", wind: "inside the ovary", after: "becomes the seed" },
    anther: { name: "anther", sex: "male", job: "makes pollen grains, which carry the male gametes", insect: "inside the flower, where insects brush past; pollen is larger and sticky or spiky so it clings to them", wind: "hangs outside the flower; makes huge numbers of small, light, smooth pollen grains", after: "withers" },
    filament: { name: "filament", sex: "male", job: "holds the anther in position", insect: "short and stiff, inside the flower", wind: "long and flexible, so the anther dangles in the wind", after: "withers" },
    petal: { name: "petal", sex: "—", job: "attracts insects to the flower", insect: "large, brightly coloured and scented", wind: "small and dull, or missing — there are no insects to attract", after: "falls off" },
    nectary: { name: "nectary", sex: "—", job: "makes sugary nectar, a reward that brings insects to the flower", insect: "at the base of the petals", wind: "none — no insects to reward", after: "falls off" },
    sepal: { name: "sepal", sex: "—", job: "protects the flower while it is still a bud", insect: "green, below the petals", wind: "small", after: "may stay or fall off" }
  };
  const ORDER = ["stigma", "style", "ovary", "ovule", "anther", "filament", "petal", "nectary", "sepal"];
  function flowerLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), partsEl = $("[data-parts]", lab);
    let st = { type: "insect", part: "stigma" };
    partsEl.innerHTML = ORDER.map((p) => `<button class="sc" type="button" data-part="${p}">${p}</button>`).join("");
    const LABEL_Y = { stigma: 34, anther: 70, filament: 104, style: 138, petal: 172, nectary: 206, ovary: 240, ovule: 272, sepal: 304 };

    function shapes(t) {
      const insect = t === "insect";
      const s = {
        sepal: insect ? ["M214 258C196 262 176 272 160 292C186 290 206 278 222 264Z", "M246 258C264 262 284 272 300 292C274 290 254 278 238 264Z"] : ["M216 258C204 262 194 270 186 282C202 282 212 274 222 264Z", "M244 258C256 262 266 270 274 282C258 282 248 274 238 264Z"],
        petal: insect ? ["M212 252C172 248 120 200 108 118C150 130 196 182 216 240Z", "M248 252C288 248 340 200 352 118C310 130 264 182 244 240Z"] : ["M214 250C200 246 188 234 184 218C198 224 208 234 216 244Z", "M246 250C260 246 272 234 276 218C262 224 252 234 244 244Z"],
        filament: insect ? ["M216 246C202 210 188 172 180 144", "M244 246C258 210 272 172 280 144"] : ["M218 246C192 228 152 222 124 246", "M242 246C268 228 308 222 336 246"],
        style: insect ? ["M230 210V122"] : ["M230 214V176"],
        ovary: ["M230 208C250 208 258 222 258 234C258 248 246 256 230 256C214 256 202 248 202 234C202 222 210 208 230 208Z"],
        stem: ["M230 316V256"]
      };
      return s;
    }
    function draw() {
      const insect = st.type === "insect", s = shapes(st.type);
      const on = (p) => (st.part === p ? " on" : "");
      const grp = (p, inner) => `<g class="pt-g${on(p)}" data-p="${p}">${inner}</g>`;
      const anthers = insect ? [[178, 132, -15], [282, 132, 15]] : [[122, 260, 10], [338, 260, -10]];
      const anchor = insect
        ? { stigma: [242, 112], anther: [292, 130], filament: [272, 190], style: [232, 160], petal: [334, 150], nectary: [248, 248], ovary: [258, 228], ovule: [238, 238], sepal: [290, 284] }
        : { stigma: [266, 128], anther: [348, 262], filament: [300, 228], style: [232, 196], petal: [272, 224], nectary: null, ovary: [258, 228], ovule: [238, 238], sepal: [270, 278] };
      let h = `<path class="stem" d="${s.stem[0]}"/>`;
      h += grp("sepal", s.sepal.map((d) => `<path class="sepal" d="${d}"/>`).join(""));
      h += grp("petal", s.petal.map((d) => `<path class="petal${insect ? "" : " dull"}" d="${d}"/>`).join(""));
      if (insect) h += grp("nectary", `<ellipse class="nectar" cx="214" cy="248" rx="7" ry="4"/><ellipse class="nectar" cx="246" cy="248" rx="7" ry="4"/>`);
      h += grp("filament", s.filament.map((d) => `<path class="fil" d="${d}"/><path class="hit" d="${d}"/>`).join(""));
      h += grp("anther", anthers.map(([x, y, r]) => `<ellipse class="anther" cx="${x}" cy="${y}" rx="8" ry="14" transform="rotate(${r} ${x} ${y})"/>`).join("") +
        (insect ? "" : `<g class="pollen-air"><circle cx="96" cy="292" r="2"/><circle cx="108" cy="304" r="2"/><circle cx="84" cy="306" r="2"/><circle cx="362" cy="292" r="2"/><circle cx="374" cy="306" r="2"/></g>`));
      h += grp("ovary", `<path class="ovary" d="${s.ovary[0]}"/>`);
      h += grp("ovule", `<ellipse class="ovule" cx="222" cy="230" rx="6" ry="7"/><ellipse class="ovule" cx="238" cy="240" rx="6" ry="7"/><ellipse class="ovule" cx="224" cy="246" rx="5" ry="6"/>`);
      h += grp("style", `<path class="style" d="${s.style[0]}"/><path class="hit" d="${s.style[0]}"/>`);
      h += grp("stigma", insect ? `<ellipse class="stigma" cx="230" cy="116" rx="13" ry="8"/>`
        : `<path class="stigma feather" d="M230 178C218 160 210 140 204 110M230 178C242 160 250 140 256 110M230 178V100M222 164l-10-6M216 146l-10-6M210 128l-10-6M238 164l10-6M244 146l10-6M250 128l10-6M230 150l-8-6M230 130l8-6M230 114l-8-6"/><path class="hit" d="M230 178C218 160 210 140 204 110M230 178C242 160 250 140 256 110M230 178V100"/>`);
      // a pollen tube once the ovule or style is chosen
      if (st.part === "ovule" || st.part === "style") {
        const top = insect ? 110 : 104;
        h += `<circle class="pollen" cx="236" cy="${top}" r="5"/><path class="tube" d="M236 ${top + 4}C234 ${top + 40} 232 170 232 206C232 220 228 226 224 232"/><text x="196" y="${insect ? 92 : 88}" text-anchor="end" class="lbl-ink">pollen tube</text>`;
      }
      // labels
      ORDER.forEach((p) => {
        const a = anchor[p];
        if (!a) return;
        const y = LABEL_Y[p], sex = PARTS[p].sex;
        h += `<path class="lead${on(p)}" d="M${a[0]} ${a[1]}L404 ${y}H418"/><text x="424" y="${y + 4}" class="pl${on(p)}${sex === "male" ? " male" : sex === "female" ? " female" : ""}" data-p="${p}">${p}</text>`;
      });
      svg.innerHTML = h;
      $$("[data-p]", svg).forEach((g) => g.addEventListener("click", () => { st.part = g.dataset.p; render(); }));
    }
    function render() {
      if (st.type === "wind" && st.part === "nectary") st.part = "petal";
      press($$("[data-type]", lab), (b) => b.dataset.type === st.type);
      press($$("[data-part]", lab), (b) => b.dataset.part === st.part);
      $$("[data-part]", lab).forEach((b) => (b.disabled = st.type === "wind" && b.dataset.part === "nectary"));
      draw();
      const P = PARTS[st.part], other = st.type === "insect" ? "wind" : "insect";
      res.innerHTML = rows([["Part", P.name], ["Male or female", P.sex], ["After fertilisation", P.after]]);
      exp.innerHTML = chips([[st.type === "insect" ? "Insect-pollinated" : "Wind-pollinated"], ...(P.sex !== "—" ? [[P.sex === "male" ? "Stamen" : "Carpel"]] : [])]) +
        `<h3>The ${P.name}</h3><p><b>Job:</b> ${P.job}.</p><p><b>In this flower:</b> ${P[st.type]}. <span class="muted-t">In a ${other}-pollinated flower: ${P[other]}.</span></p>` +
        (st.part === "ovule" ? flow(["pollen lands on the stigma", "pollen tube grows down the style", "male nucleus reaches the ovule", "nuclei fuse", "ovule → seed"]) : "");
    }
    $$("[data-type]", lab).forEach((b) => b.addEventListener("click", () => { st.type = b.dataset.type; render(); }));
    $$("[data-part]", lab).forEach((b) => b.addEventListener("click", () => { st.part = b.dataset.part; render(); }));
    $("[data-reset]", lab).addEventListener("click", () => { st = { type: "insect", part: "stigma" }; render(); });
    lab.applyState = (s) => { st = { ...st, ...s }; render(); };
    render();
  }

  /* =======================================================================
     Lab: the menstrual cycle, day by day
     Hormone levels are relative (0–1), shaped like a textbook graph.
     ======================================================================= */
  const g = (d, m, s) => Math.exp(-0.5 * Math.pow((d - m) / s, 2));
  const LEVEL = {
    fsh: (d) => 0.2 + 0.22 * g(d, 3, 2.5) + 0.42 * g(d, 13.5, 1.3),
    lh: (d) => 0.12 + 0.86 * g(d, 14, 0.9),
    oes: (d, p) => 0.12 + 0.62 * g(d, 12.5, 2.4) + 0.32 * (p && d > 21 ? 1 : g(d, 21, 3.4)),
    prog: (d, p) => 0.06 + 0.86 * (p && d > 21 ? 1 : g(d, 21, 3.4))
  };
  const HNAME = { fsh: "FSH", lh: "LH", oes: "oestrogen", prog: "progesterone" };
  const lining = (d, p) => (d <= 5 ? 0.45 - 0.35 * ((d - 1) / 4) : d <= 14 ? 0.1 + 0.55 * ((d - 5) / 9) : d <= 22 ? 0.65 + 0.3 * ((d - 14) / 8) : p ? 0.95 + 0.03 * (d - 22) / 6 : 0.95 - Math.max(0, d - 25) * 0.1);
  function cycleLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), slider = $("[data-day]", lab), play = $("[data-play]", lab), pregBtn = $("[data-preg]", lab);
    const X = (d) => 70 + ((d - 1) / 27) * 540, Y = (v) => 168 - v * 148;
    let st = { day: 1, preg: false }, timer = 0;

    function curve(fn) { let p = ""; for (let d = 1; d <= 28.001; d += 0.25) p += (p ? "L" : "M") + X(d).toFixed(1) + " " + Y(fn(d, st.preg)).toFixed(1); return p; }
    function ovaryIcon(d, x, y, now) {
      const cls = now ? "ov now" : "ov";
      if (d < 14) { const r = 5 + (d / 13) * 9; return `<circle class="${cls} fol" cx="${x}" cy="${y}" r="${r.toFixed(1)}"/><circle class="${cls} eggd" cx="${x}" cy="${y}" r="3"/>`; }
      if (d === 14) return `<circle class="${cls} fol" cx="${x}" cy="${y}" r="14" stroke-dasharray="4 3"/><circle class="${cls} eggd" cx="${x + 14}" cy="${y - 14}" r="3.5"/>`;
      const r = st.preg ? 12 : Math.max(4, 12 - Math.max(0, d - 22) * 1.4);
      return `<circle class="${cls} cl" cx="${x}" cy="${y}" r="${r.toFixed(1)}"/>`;
    }
    function draw() {
      const d = st.day;
      let h = `<path class="gl" d="M70 20H610M70 94H610"/>
        <rect class="men" x="${X(1)}" y="20" width="${X(5) - X(1)}" height="148"/>
        <text x="${(X(1) + X(5)) / 2}" y="34" text-anchor="middle" class="lbl-bad">period</text>
        <path class="guide" d="M${X(14)} 20V318"/><text x="${X(14)}" y="14" text-anchor="middle" class="lbl-ink">ovulation</text>`;
      ["fsh", "lh", "oes", "prog"].forEach((k) => (h += `<path class="hm ${k}" d="${curve(LEVEL[k])}"/>`));
      h += `<path class="ax" d="M70 14V168H614"/><text x="62" y="24" text-anchor="end">high</text><text x="62" y="170" text-anchor="end">low</text><text x="8" y="100" class="side-l">hormones</text>`;
      // ovary row
      h += `<text x="8" y="214" class="side-l">ovary</text><path class="gl" d="M70 212H610"/>`;
      [3, 7, 11, 14, 18, 22, 26].forEach((k) => (h += `<g opacity="${Math.abs(k - d) < 2 ? 1 : 0.32}">${ovaryIcon(k, X(k), 212, Math.abs(k - d) < 2)}</g>`));
      // lining row
      let area = `M${X(1)} 316`;
      for (let k = 1; k <= 28.001; k += 0.5) area += `L${X(k).toFixed(1)} ${(316 - lining(k, st.preg) * 52).toFixed(1)}`;
      area += `L${X(28)} 316Z`;
      h += `<text x="8" y="292" class="side-l">uterus</text><text x="8" y="305" class="side-l">lining</text><path class="lining" d="${area}"/><path class="ax" d="M70 316H614"/>`;
      if (!st.preg) h += `<g class="blood">${[1.5, 2.5, 3.5, 4.5].map((k) => `<circle cx="${X(k)}" cy="${(316 - lining(k, false) * 52 - 6).toFixed(1)}" r="2.5"/>`).join("")}</g>`;
      [1, 7, 14, 21, 28].forEach((k) => (h += `<text x="${X(k)}" y="334" text-anchor="middle">${k}</text>`));
      // the chosen day
      h += `<path class="today" d="M${X(d)} 16V318"/>`;
      ["fsh", "lh", "oes", "prog"].forEach((k) => (h += `<circle class="hm-pt ${k}" cx="${X(d)}" cy="${Y(LEVEL[k](d, st.preg)).toFixed(1)}" r="4"/>`));
      svg.innerHTML = h;
    }
    function facts(d) {
      const preg = st.preg;
      const phase = d <= 5 ? "menstruation" : d < 14 ? "lining rebuilding" : d === 14 ? "ovulation" : preg && d >= 21 ? "embryo implanted" : "lining kept thick";
      const egg = d < 14 ? "maturing in a follicle" : d === 14 ? "released" : d <= 17 ? (preg ? "fertilised in the oviduct" : "in the oviduct") : preg ? (d < 21 ? "embryo moving to the uterus" : "implanted in the lining") : "not fertilised — breaks down";
      const lv = Object.fromEntries(Object.keys(LEVEL).map((k) => [k, LEVEL[k](d, preg)]));
      const top = Object.keys(lv).sort((a, b) => lv[b] - lv[a])[0];
      return { phase, egg, lv, top };
    }
    function render() {
      const d = st.day, f = facts(d);
      slider.value = d; slider.style.setProperty("--pct", `${((d - 1) / 27) * 100}%`);
      $("[data-day-out]", lab).textContent = d;
      pregBtn.setAttribute("aria-pressed", st.preg);
      draw();
      res.innerHTML = rows([["Day", d], ["Phase", f.phase], ["Egg", f.egg], ["Lining", `${Math.round(lining(d, st.preg) * 100)} % of max`], ["Highest hormone", HNAME[f.top]]]);
      let head, text, chain;
      if (d <= 5) {
        head = chips([["Days 1–5"], ["Menstruation", "down"]]);
        text = `<h3>The lining breaks down</h3><p><b>Progesterone</b> fell at the end of the last cycle, so nothing keeps the uterus lining in place: it breaks down and leaves the body with some blood. Meanwhile <b>FSH</b> from the pituitary gland starts an egg maturing inside a follicle in the ovary.</p>`;
        chain = ["low progesterone", "lining not maintained", "lining shed", "menstruation"];
      } else if (d < 14) {
        head = chips([["Days 6–13"], ["Building", "up"]]);
        text = `<h3>Oestrogen rebuilds the lining</h3><p>The growing follicle makes <b>oestrogen</b>. Oestrogen makes the uterus lining <b>thicken</b> again, and as it rises it holds FSH down — then, near its peak, it triggers a surge of LH.</p>`;
        chain = ["FSH", "egg matures, follicle makes oestrogen", "lining thickens"];
      } else if (d === 14) {
        head = chips([["Day 14"], ["Ovulation", "warn"]]);
        text = `<h3>LH surges: the egg is released</h3><p>A sharp peak of <b>LH</b> from the pituitary gland makes the follicle burst and release the egg into the oviduct. This is <b>ovulation</b>. Fertilisation can happen for about a day after this, in the oviduct.</p>`;
        chain = ["oestrogen peaks", "LH surge", "follicle releases the egg", "ovulation"];
      } else if (st.preg) {
        head = chips([["Days 15–28"], ["Pregnant", "up"]]);
        text = `<h3>Progesterone stays high</h3><p>The egg was fertilised. The empty follicle (now a <b>corpus luteum</b>) keeps making <b>progesterone</b> — and later the placenta takes over — so the lining is <b>kept</b>. ${d >= 21 ? "The embryo has implanted in it. " : ""}There is no menstruation and no new egg matures.</p>`;
        chain = ["embryo implants", "progesterone stays high", "lining maintained", "no period"];
      } else {
        head = chips([["Days 15–28"], ["Waiting"]]);
        text = `<h3>Progesterone keeps the lining ready</h3><p>The empty follicle makes <b>progesterone</b>, which keeps the thick lining in place in case an embryo arrives. ${d >= 24 ? "No embryo has implanted, so the follicle shrinks and progesterone falls — soon the lining will break down and the next cycle begins." : "Progesterone also keeps FSH and LH low, so no new egg matures."}</p>`;
        chain = ["progesterone", "lining kept thick", d >= 24 ? "no embryo: progesterone falls" : "FSH and LH kept low", d >= 24 ? "menstruation next" : "ready for an embryo"];
      }
      exp.innerHTML = head + text + flow(chain);
    }
    const stop = () => { clearInterval(timer); timer = 0; play.textContent = "Play the cycle"; };
    play.addEventListener("click", () => {
      if (timer) return stop();
      if (st.day >= 28) st.day = 1;
      play.textContent = "Pause";
      if (still) { st.day = 28; render(); return stop(); }
      timer = setInterval(() => { st.day++; render(); if (st.day >= 28) stop(); }, 260);
    });
    slider.addEventListener("input", () => { stop(); st.day = +slider.value; render(); });
    pregBtn.addEventListener("click", () => { st.preg = !st.preg; render(); });
    $("[data-reset]", lab).addEventListener("click", () => { stop(); st = { day: 1, preg: false }; render(); });
    lab.applyState = (s) => { stop(); st = { day: s.day ?? st.day, preg: !!s.preg }; render(); };
    render();
  }

  const LABS = { mix: mixLab, flower: flowerLab, cycle: cycleLab };
  $$("[data-lab]").forEach((lab) => LABS[lab.dataset.mode]?.(lab));
})();
