/* ==========================================================================
   stay add. — Naming organic compounds: the naming engine and the labs
   (Topic switching, the step rail and the Interpret chains are the shared
   lesson form in assets/js/lesson.js.)

   A molecule is { n, fam, g, subs }:
     n     carbons in the main chain (1–6)
     fam   "alkane" | "alkene" | "alcohol" | "acid"
     g     where the group is, as a carbon index counted from the LEFT (0-based):
           alkene → the left carbon of the C=C; alcohol → the carbon with –OH;
           acid → always the right-hand end
     subs  side chains [{ i, kind }]; kind: methyl, ethyl, fluoro, chloro, bromo, iodo
   The engine follows the seven steps: root from the chain, suffix from the
   group, numbering (group lowest → side chains lowest → alphabetical), side
   chains with numbers, di/tri, alphabetical order, commas and hyphens.
   Labs: build (main chain, optionally side chains), practice (pick the name),
   ester. Each exposes lab.applyState(state) for the Interpret chains.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ROOT = ["", "meth", "eth", "prop", "but", "pent", "hex"];
  const MULT = ["", "", "di", "tri", "tetra"];
  const SUBS = "₀₁₂₃₄₅₆₇₈₉";
  const sub = (f) => String(f).replace(/\d/g, (d) => SUBS[d]);
  const KIND = {
    methyl: { name: "methyl", alkyl: 1, label: ["CH₃"], text: "CH3" },
    ethyl: { name: "ethyl", alkyl: 2, label: ["CH₂", "CH₃"], text: "CH2CH3" },
    fluoro: { name: "fluoro", el: "F" },
    chloro: { name: "chloro", el: "Cl" },
    bromo: { name: "bromo", el: "Br" },
    iodo: { name: "iodo", el: "I" }
  };
  const FAMILY = { alkane: "alkane", alkene: "alkene", alcohol: "alcohol", acid: "carboxylic acid" };
  const GROUP = { alkene: "C=C", alcohol: "–OH", acid: "–COOH" };
  const SUFFIX = { alkane: "-ane", alkene: "-ene", alcohol: "-ol", acid: "-oic acid" };

  /* =======================================================================
     Rules: what may go where
     ======================================================================= */
  function slotsFor(m, i) {
    if (m.fam === "acid" && i === m.n - 1) return 0;                          // C of –COOH is full
    if (m.fam === "alkene" && (i === m.g || i === m.g + 1)) return 1;         // C=C uses one bond
    if (m.fam === "alcohol" && i === m.g) return 1;                           // –OH takes the lower slot
    return 2;
  }
  // why a side chain cannot go on carbon i (or "" if it can)
  function blocked(m, i, kind) {
    const used = m.subs.filter((s) => s.i === i).length;
    if (used >= slotsFor(m, i)) return "That carbon has no hydrogen left to replace — it already has four bonds.";
    const k = KIND[kind];
    if (k.alkyl === 1 && (i < 1 || i > m.n - 2)) return "A –CH₃ on an end carbon just makes the chain one longer. Step 1: it is part of the main chain, not a side chain.";
    if (k.alkyl === 2 && (i < 2 || i > m.n - 3)) return "An ethyl group there would give a longer chain through the branch. Step 1: always use the longest chain.";
    return "";
  }
  function normalise(s) {
    const m = { n: Math.max(1, Math.min(6, s.n || 1)), fam: s.fam || "alkane", g: s.g ?? 0, subs: [] };
    let note = "";
    if (m.fam === "alkene" && m.n < 2) { m.n = 2; note = "There is no “methene”: a C=C needs two carbons."; }
    if (m.fam === "alkene") m.g = Math.max(0, Math.min(m.n - 2, m.g));
    else if (m.fam === "alcohol") m.g = Math.max(0, Math.min(m.n - 1, m.g));
    else if (m.fam === "acid") m.g = m.n - 1;
    else m.g = 0;
    for (const x of s.subs || []) if (x.i < m.n && !blocked(m, x.i, x.kind)) m.subs.push({ i: x.i, kind: x.kind });
    if ((s.subs || []).length > m.subs.length) note = (note ? note + " " : "") + "Some side chains no longer fit and were removed.";
    return { m, note };
  }

  /* =======================================================================
     Step 3: numbering
     ======================================================================= */
  const firstDiff = (a, b) => { for (let k = 0; k < Math.max(a.length, b.length); k++) if ((a[k] ?? 0) !== (b[k] ?? 0)) return (a[k] ?? 0) - (b[k] ?? 0); return 0; };
  function numbering(m) {
    const L = (i) => i + 1, R = (i) => m.n - i;
    const groupLoc = (f) => (m.fam === "alkene" ? Math.min(f(m.g), f(m.g + 1)) : m.fam === "alkane" ? 0 : f(m.g));
    const subLocs = (f) => m.subs.map((s) => f(s.i)).sort((a, b) => a - b);
    const alpha = (f) => [...m.subs].sort((a, b) => KIND[a.kind].name.localeCompare(KIND[b.kind].name) || f(a.i) - f(b.i)).map((s) => f(s.i));
    let pick = L, why;
    const gL = groupLoc(L), gR = groupLoc(R);
    if (m.fam !== "alkane" && gL !== gR) { pick = gL < gR ? L : R; why = { type: "group", got: Math.min(gL, gR), not: Math.max(gL, gR) }; }
    else {
      const c = firstDiff(subLocs(L), subLocs(R));
      if (c) { pick = c < 0 ? L : R; why = { type: "subs", got: subLocs(pick), not: subLocs(pick === L ? R : L) }; }
      else {
        const c2 = firstDiff(alpha(L), alpha(R));
        if (c2) { pick = c2 < 0 ? L : R; why = { type: "alpha", first: [...new Set(m.subs.map((s) => KIND[s.kind].name))].sort()[0] }; }
        else why = { type: "same" };
      }
    }
    return { f: pick, fromLeft: pick === L, why, other: pick === L ? R : L };
  }

  /* =======================================================================
     Steps 4–7: the name. Flags make the classic wrong versions for practice.
     ======================================================================= */
  function nameOf(m, flags = {}, html = false) {
    const num = numbering(m), f = flags.flip ? num.other : num.f;
    const N = m.n + (flags.rootDelta || 0);
    const w = (t, c) => (html && c ? `<span class="nm-${c}">${t}</span>` : t);
    const needLocs = !(N <= 1 || (N === 2 && m.fam === "alkane" && m.subs.length === 1));
    const groups = {};
    for (const s of flags.dropOne ? m.subs.slice(1) : m.subs) (groups[s.kind] = groups[s.kind] || []).push(f(s.i));
    let list = Object.entries(groups).map(([k, locs]) => ({ name: KIND[k].name, locs: locs.sort((a, b) => a - b) }));
    list.sort((a, b) => a.name.localeCompare(b.name));
    if (flags.noAlpha) list.reverse();
    const parts = [];
    for (const gp of list) {
      if (flags.noMult) gp.locs.forEach((l) => parts.push({ locs: [l], mult: "", name: gp.name }));
      else parts.push({ locs: gp.locs, mult: MULT[gp.locs.length], name: gp.name });
    }
    const sep = flags.badPunct ? "-" : ",";
    const prefix = parts.map((p) => (needLocs ? w(p.locs.join(sep), "pos") + "-" : "") + w(p.mult + p.name, "sub")).join("-");
    const gl = m.fam === "alkene" ? Math.min(f(m.g), f(m.g + 1)) : f(m.g);
    const r = w(ROOT[N] || "?", "pre");
    let main;
    if (m.fam === "alkane") main = r + w("ane", "suf");
    else if (m.fam === "alkene") main = N >= 4 ? `${r}-${w(gl, "pos")}-${w("ene", "suf")}` : r + w("ene", "suf");
    else if (m.fam === "alcohol") main = N >= 3 ? `${r}an-${w(gl, "pos")}-${w("ol", "suf")}` : `${r}an${w("ol", "suf")}`;
    else main = `${r}an${w("oic acid", "suf")}`;
    return prefix + main;
  }

  /* ---------- Formulae ---------- */
  function hOn(m, i) {
    let used = (i > 0) + (i < m.n - 1) + m.subs.filter((s) => s.i === i).length;
    if (m.fam === "alkene" && (i === m.g || i === m.g + 1)) used += 1;
    if (m.fam === "alcohol" && i === m.g) used += 1;
    if (m.fam === "acid" && i === m.n - 1) used += 3;
    return 4 - used;
  }
  function molecular(m) {
    const c = { C: m.n, H: 0, Br: 0, Cl: 0, F: 0, I: 0, O: 0 };
    for (let i = 0; i < m.n; i++) c.H += hOn(m, i);
    for (const s of m.subs) { const k = KIND[s.kind]; if (k.alkyl) { c.C += k.alkyl; c.H += 2 * k.alkyl + 1; } else c[k.el]++; }
    if (m.fam === "alcohol") { c.O += 1; c.H += 1; }
    if (m.fam === "acid") { c.O += 2; c.H += 1; }
    return sub(Object.entries(c).filter(([, v]) => v).map(([el, v]) => el + (v > 1 ? v : "")).join(""));
  }
  function structural(m) {
    const num = numbering(m);
    // write carbon 1 on the left, except for alcohols and acids, which are usually written ending in –OH / –COOH
    let order = [...Array(m.n).keys()];
    if (m.fam === "alcohol" || m.fam === "acid") { if (num.fromLeft) order.reverse(); }
    else if (!num.fromLeft) order.reverse();
    const tok = order.map((i, k) => {
      if (m.fam === "acid" && i === m.n - 1) return m.n === 1 ? "HCOOH" : "COOH";
      const h = hOn(m, i);
      let t = "C" + (h ? "H" + (h > 1 ? h : "") : "");
      const here = m.subs.filter((s) => s.i === i);
      for (const el of ["Br", "Cl", "F", "I"]) { const c = here.filter((s) => KIND[s.kind].el === el).length; if (c) t += el + (c > 1 ? c : ""); }
      for (const kind of ["methyl", "ethyl"]) { const c = here.filter((s) => s.kind === kind).length; if (c) t += `(${KIND[kind].text})` + (c > 1 ? c : ""); }
      if (m.fam === "alcohol" && i === m.g) t += k === order.length - 1 ? "OH" : "(OH)";
      return t;
    });
    let out = tok[0];
    for (let k = 1; k < tok.length; k++) {
      const a = order[k - 1], b = order[k];
      out += (m.fam === "alkene" && Math.min(a, b) === m.g && Math.abs(a - b) === 1 ? "=" : "") + tok[k];
    }
    return sub(out);
  }

  /* ---------- The seven steps, written out ---------- */
  function steps(m, withSubs) {
    const num = numbering(m), f = num.f, dir = num.fromLeft ? "left" : "right";
    const out = [];
    out.push(`Longest chain: <b>${m.n}</b> carbon${m.n > 1 ? "s" : ""} → root <span class="nm-pre">${ROOT[m.n]}-</span>${m.subs.some((s) => KIND[s.kind].alkyl) ? " (the branches are not part of it)" : ""}.`);
    out.push(m.fam === "alkane" ? `No functional group → <span class="nm-suf">-ane</span>: an alkane.` : `${GROUP[m.fam]} → <span class="nm-suf">${SUFFIX[m.fam]}</span>: ${m.fam === "alcohol" ? "an" : "a"} ${FAMILY[m.fam]}.`);
    const w = num.why;
    if (m.n <= 1 || (m.fam === "acid" && !m.subs.length)) out.push(m.fam === "acid" ? "The carbon of –COOH is always carbon 1." : "Only one carbon: nothing to number.");
    else if (w.type === "group") out.push(`Number from the <b>${dir}</b>: the ${GROUP[m.fam]} gets <b>${w.got}</b>, not ${w.not}.`);
    else if (w.type === "subs") out.push(`No group decides it, so number from the <b>${dir}</b>: the side chains get <b>${w.got.join(",")}</b>, not ${w.not.join(",")}.`);
    else if (w.type === "alpha") out.push(`Both ends give the same numbers, so <b>${w.first}</b> — first in the alphabet — gets the smaller one: number from the <b>${dir}</b>.`);
    else out.push("Either end gives the same numbers.");
    if (withSubs) {
      const each = [...m.subs].sort((a, b) => f(a.i) - f(b.i)).map((s) => `<span class="nm-sub">${KIND[s.kind].name}</span> on ${f(s.i)}`);
      out.push(each.length ? `Side chains: ${each.join(", ")}.` : "No side chains yet — choose one and click a carbon.");
      const groups = {};
      m.subs.forEach((s) => (groups[s.kind] = (groups[s.kind] || 0) + 1));
      const rep = Object.entries(groups).filter(([, c]) => c > 1).map(([k, c]) => `${c} × ${KIND[k].name} → <span class="nm-sub">${MULT[c]}${KIND[k].name}</span>`);
      out.push(rep.length ? `Repeats joined: ${rep.join(", ")}.` : "No side chain repeats.");
      const kinds = [...new Set(m.subs.map((s) => KIND[s.kind].name))].sort();
      out.push(kinds.length > 1 ? `Alphabetical order: ${kinds.map((k) => `<span class="nm-sub">${k}</span>`).join(" → ")}.` : "Only one kind of side chain — nothing to sort.");
      out.push(`Commas between numbers, hyphens between numbers and letters → <b>${nameOf(m)}</b>`);
    }
    return `<ol class="steps7">${out.map((t, k) => `<li><span class="s7 num">${k + 1}</span><span>${t}</span></li>`).join("")}</ol>`;
  }

  /* =======================================================================
     Drawing a displayed formula
     ======================================================================= */
  const D = 78, HO = 46;
  function chainMol(m, num) {
    const atoms = [], bonds = [];
    const add = (el, x, y, role, extra = {}) => atoms.push({ el, x, y, role, ...extra }) - 1;
    const bond = (a, b, order = 1, role = "") => bonds.push({ a, b, order, role });
    const C = [];
    for (let i = 0; i < m.n; i++) C.push(add("C", i * D, 0, "c", { num: num ? num.f(i) : null, ci: i }));
    for (let i = 0; i < m.n - 1; i++) bond(C[i], C[i + 1], m.fam === "alkene" && i === m.g ? 2 : 1, m.fam === "alkene" && i === m.g ? "g" : "");
    for (let i = 0; i < m.n; i++) {
      const x = i * D, acidC = m.fam === "acid" && i === m.n - 1;
      const slots = [];                                   // the free up/down positions, filled by side chains first
      if (acidC) bond(C[i], add("O", x, -HO * 1.1, "g"), 2, "g"); else slots.push(-1);
      if (m.fam === "alcohol" && i === m.g) { const o = add("O", x, HO * 1.1, "g"); bond(C[i], o, 1, "g"); bond(o, add("H", x, HO * 2.1, "g"), 1, "g"); }
      else if (!acidC && !(m.fam === "alkene" && (i === m.g || i === m.g + 1))) slots.push(1);
      const here = m.subs.filter((s) => s.i === i);
      slots.forEach((dir, k) => {
        const s = here[k];
        if (!s) { bond(C[i], add("H", x, dir * HO, "h")); return; }
        const kind = KIND[s.kind];
        if (kind.el) { bond(C[i], add(kind.el, x, dir * HO * 1.1, "s"), 1, "s"); return; }
        const a1 = add(kind.label[0], x, dir * HO * 1.25, "s lbl");
        bond(C[i], a1, 1, "s");
        if (kind.label[1]) bond(a1, add(kind.label[1], x, dir * HO * 2.5, "s lbl"), 1, "s");
      });
      if (i === 0) bond(C[i], add("H", x - HO, 0, "h"));
      if (i === m.n - 1) {
        if (acidC) { const o = add("O", x + D * 0.8, 0, "g"); bond(C[i], o, 1, "g"); bond(o, add("H", x + D * 0.8 + HO, 0, "g"), 1, "g"); }
        else if (m.n > 1 || m.fam !== "acid") bond(C[i], add("H", x + HO, 0, "h"));
      }
    }
    return { atoms, bonds };
  }
  function esterMol(mA, k) {
    const atoms = [], bonds = [], spans = [];
    const add = (el, x, y, role) => atoms.push({ el, x, y, role }) - 1;
    const bond = (a, b, order = 1, role = "") => bonds.push({ a, b, order, role });
    const A = [];
    for (let i = 0; i < mA; i++) A.push(add("C", i * D, 0, i === mA - 1 ? "g" : "c"));
    for (let i = 0; i < mA - 1; i++) bond(A[i], A[i + 1]);
    for (let i = 0; i < mA; i++) {
      const x = i * D;
      if (i === mA - 1) bond(A[i], add("O", x, -HO * 1.1, "g"), 2, "g");
      else { bond(A[i], add("H", x, -HO, "h")); bond(A[i], add("H", x, HO, "h")); }
      if (i === 0) bond(A[i], add("H", x - HO, 0, "h"));
    }
    const ox = (mA - 1) * D + D * 0.8, O = add("O", ox, 0, "g");
    bond(A[mA - 1], O, 1, "g");
    const B = [];
    for (let j = 0; j < k; j++) B.push(add("C", ox + (j + 1) * D * 0.9, 0, "a"));
    bond(O, B[0], 1, "g");
    for (let j = 0; j < k - 1; j++) bond(B[j], B[j + 1]);
    B.forEach((c, j) => {
      const x = atoms[c].x;
      bond(c, add("H", x, -HO, "h")); bond(c, add("H", x, HO, "h"));
      if (j === k - 1) bond(c, add("H", x + HO, 0, "h"));
    });
    spans.push({ x0: -HO, x1: ox, label: "from the acid", role: "c" }, { x0: ox + D * 0.9 - 14, x1: atoms[B[k - 1]].x + HO, label: "from the alcohol", role: "a" });
    return { atoms, bonds, spans };
  }

  function draw(svg, mol, { fit = false, clickable = false } = {}) {
    const xs = mol.atoms.map((a) => a.x), ys = mol.atoms.map((a) => a.y);
    const x0 = Math.min(...xs) - 22, x1 = Math.max(...xs) + 22, y0 = Math.min(...ys) - 22, y1 = Math.max(...ys) + (mol.spans ? 64 : 22);
    let g = "";
    for (const b of mol.bonds) {
      const A = mol.atoms[b.a], B = mol.atoms[b.b], dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      const cutA = A.role.includes("lbl") ? 12 : 13, cutB = B.role.includes("lbl") ? 12 : 13;
      const p = [A.x + ux * cutA, A.y + uy * cutA, B.x - ux * cutB, B.y - uy * cutB];
      const line = (o) => `<line class="bd${b.role ? " " + b.role : ""}" x1="${(p[0] - uy * o).toFixed(1)}" y1="${(p[1] + ux * o).toFixed(1)}" x2="${(p[2] - uy * o).toFixed(1)}" y2="${(p[3] + ux * o).toFixed(1)}"/>`;
      g += b.order === 2 ? line(-3.5) + line(3.5) : line(0);
    }
    for (const a of mol.atoms) {
      g += `<text class="at ${a.role}" x="${a.x}" y="${a.y}">${a.el}</text>`;
      if (a.num) g += `<text class="cn" x="${a.x + 14}" y="${a.y - 17}">${a.num}</text>`;
      if (clickable && a.ci !== undefined) g += `<circle class="hit-c" cx="${a.x}" cy="${a.y}" r="22" data-ci="${a.ci}"><title>Add the side chain to this carbon</title></circle>`;
    }
    for (const s of mol.spans || []) {
      const y = Math.max(...ys) + 30;
      g += `<path class="brk ${s.role}" d="M${s.x0} ${y - 6}V${y}H${s.x1}V${y - 6}"/><text class="brk-t ${s.role}" x="${(s.x0 + s.x1) / 2}" y="${y + 18}">${s.label}</text>`;
    }
    if (fit) { svg.setAttribute("viewBox", `${x0} ${y0} ${x1 - x0} ${y1 - y0}`); svg.innerHTML = g; return; }
    const [, , W, H] = svg.getAttribute("viewBox").split(" ").map(Number);
    const s = Math.min(1.25, (W - 40) / (x1 - x0), (H - 24) / (y1 - y0));
    const tx = W / 2 - ((x0 + x1) / 2) * s, ty = H / 2 - ((y0 + y1) / 2) * s;
    svg.innerHTML = `<g class="mol-in" transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(3)})">${g}</g>`;
  }

  /* ---------- Small helpers for the dock ---------- */
  const rows = (list) => list.map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  const chips = (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`;
  const press = (nodes, test) => nodes.forEach((b) => b.setAttribute("aria-pressed", test(b)));

  /* =======================================================================
     Lab: build (steps 1–3, or all seven with side chains)
     ======================================================================= */
  function buildLab(lab) {
    const withSubs = lab.hasAttribute("data-subs");
    const svg = $("[data-mol]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const gWrap = $("[data-g-wrap]", lab), gSeg = $("[data-g-seg]", lab);
    const START = withSubs ? { n: 5, fam: "alkane", g: 0, subs: [{ i: 1, kind: "methyl" }] } : { n: 5, fam: "alcohol", g: 3, subs: [] };
    let st = JSON.parse(JSON.stringify(START)), kind = "methyl", msg = "";

    function render() {
      const { m, note } = normalise(st);
      st = { n: m.n, fam: m.fam, g: m.g, subs: m.subs.map((s) => ({ ...s })) };
      const num = numbering(m);
      press($$("[data-n]", lab), (b) => +b.dataset.n === m.n);
      press($$("[data-fam]", lab), (b) => b.dataset.fam === m.fam);
      press($$("[data-kind]", lab), (b) => b.dataset.kind === kind);
      // the "where is the group" buttons depend on the chain and the family
      const opts = m.fam === "alkene" ? [...Array(m.n - 1).keys()] : m.fam === "alcohol" ? [...Array(m.n).keys()] : [];
      gWrap.hidden = !opts.length || opts.length === 1;
      gSeg.innerHTML = opts.map((i) => `<button type="button" data-g="${i}" aria-pressed="${i === m.g}">${m.fam === "alkene" ? `${i + 1}–${i + 2}` : i + 1}</button>`).join("");
      $$("[data-g]", gSeg).forEach((b) => b.addEventListener("click", () => { st.g = +b.dataset.g; msg = ""; render(); }));

      draw(svg, chainMol(m, num), { clickable: withSubs });
      if (withSubs) $$(".hit-c", svg).forEach((c) => c.addEventListener("click", () => addAt(+c.dataset.ci)));
      res.innerHTML = rows([["Name", nameOf(m)], ["Molecular formula", molecular(m)], ["Structural formula", structural(m)], ["Homologous series", `${FAMILY[m.fam]}s`]]);
      const warn = msg || note;
      exp.innerHTML = chips([[FAMILY[m.fam]], [`${m.n}-carbon chain`], ...(withSubs ? [[`${m.subs.length} side chain${m.subs.length === 1 ? "" : "s"}`]] : []), ...(warn ? [["Check", "warn"]] : [])]) +
        `<h3>${nameOf(m, {}, true)}</h3>` + (warn ? `<p>${warn}</p>` : "") + steps(m, withSubs);
      msg = "";
    }
    function addAt(i) {
      const { m } = normalise(st);
      const why = blocked(m, i, kind);
      if (why) { msg = why; render(); return; }
      st.subs.push({ i, kind });
      render();
    }
    $$("[data-n]", lab).forEach((b) => b.addEventListener("click", () => { st.n = +b.dataset.n; render(); }));
    $$("[data-fam]", lab).forEach((b) => b.addEventListener("click", () => { st.fam = b.dataset.fam; render(); }));
    $$("[data-kind]", lab).forEach((b) => b.addEventListener("click", () => { kind = b.dataset.kind; render(); }));
    $("[data-undo]", lab)?.addEventListener("click", () => { st.subs.pop(); render(); });
    $("[data-clear]", lab)?.addEventListener("click", () => { st.subs = []; render(); });
    $("[data-reset]", lab).addEventListener("click", () => { st = JSON.parse(JSON.stringify(START)); render(); });
    lab.applyState = (s) => { st = { n: s.n, fam: s.fam, g: s.g ?? 0, subs: s.subs || [] }; render(); };
    render();
  }

  /* =======================================================================
     Lab: practice — pick the right name; wrong ones say which step they break
     ======================================================================= */
  const POOL = [
    { n: 4, fam: "alkane", subs: [{ i: 1, kind: "methyl" }] },
    { n: 5, fam: "alkane", subs: [{ i: 3, kind: "methyl" }] },
    { n: 4, fam: "alkane", subs: [{ i: 1, kind: "methyl" }, { i: 2, kind: "methyl" }] },
    { n: 3, fam: "alkane", subs: [{ i: 1, kind: "bromo" }, { i: 1, kind: "methyl" }] },
    { n: 5, fam: "alkane", subs: [{ i: 2, kind: "ethyl" }] },
    { n: 3, fam: "alkane", subs: [{ i: 1, kind: "methyl" }, { i: 1, kind: "methyl" }] },
    { n: 5, fam: "alkane", subs: [{ i: 1, kind: "methyl" }, { i: 3, kind: "chloro" }] },
    { n: 3, fam: "alkane", subs: [{ i: 0, kind: "bromo" }] },
    { n: 2, fam: "alkane", subs: [{ i: 0, kind: "chloro" }, { i: 1, kind: "chloro" }] },
    { n: 4, fam: "alcohol", g: 3, subs: [{ i: 1, kind: "methyl" }] },
    { n: 5, fam: "alcohol", g: 3, subs: [] },
    { n: 4, fam: "alkene", g: 1, subs: [{ i: 1, kind: "methyl" }] },
    { n: 6, fam: "alkane", subs: [{ i: 2, kind: "methyl" }, { i: 3, kind: "ethyl" }] },
    { n: 4, fam: "alkane", subs: [{ i: 1, kind: "chloro" }, { i: 2, kind: "chloro" }] },
    { n: 2, fam: "acid", subs: [{ i: 0, kind: "chloro" }] }
  ].map((s) => normalise(s).m);

  function wrongNames(m) {
    const right = nameOf(m), out = [];
    const tryAdd = (flags, step, why) => { const n = nameOf(m, flags); if (!n.includes("?") && n !== right && !out.some((o) => o.name === n)) out.push({ name: n, step, why }); };
    tryAdd({ flip: true }, 3, "it numbers the chain from the wrong end, so the numbers are not the smallest possible");
    if (m.subs.some((s, k) => m.subs.findIndex((t) => t.kind === s.kind) !== k)) {
      tryAdd({ noMult: true }, 5, "the same side chain is written twice instead of once with di/tri");
      tryAdd({ badPunct: true }, 7, "two numbers must be separated by a comma, not a hyphen");
    }
    if (new Set(m.subs.map((s) => s.kind)).size > 1) tryAdd({ noAlpha: true }, 6, "the side chains are not in alphabetical order");
    if (m.subs.some((s) => KIND[s.kind].alkyl)) tryAdd({ rootDelta: 1, dropOne: true }, 1, "it counts a branch as part of a straight chain — the chain is not that long");
    tryAdd({ rootDelta: 1 }, 1, "the root does not match the number of carbons in the longest chain");
    tryAdd({ rootDelta: -1 }, 1, "the root does not match the number of carbons in the longest chain");
    tryAdd({ flip: true, noAlpha: true }, 3, "it numbers from the wrong end");
    return out.slice(0, 3);
  }

  function practiceLab(lab) {
    const svg = $("[data-mol]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), optsEl = $("[data-opts]", lab);
    let cur = null, options = [], answered = null, score = { right: 0, tried: 0, streak: 0 };
    function pick(m) {
      if (m) cur = m;
      else { let next; do next = POOL[Math.floor(Math.random() * POOL.length)]; while (cur && nameOf(next) === nameOf(cur)); cur = next; }
      options = [{ name: nameOf(cur), right: true }, ...wrongNames(cur)].sort(() => Math.random() - 0.5);
      answered = null;
      render();
    }
    function render() {
      draw(svg, chainMol(cur, answered ? numbering(cur) : null));
      optsEl.innerHTML = options.map((o, k) => {
        const state = !answered ? "" : o.right ? " is-right" : o === answered ? " is-wrong" : " is-dim";
        return `<button class="opt num${state}" type="button" data-o="${k}"${answered ? " disabled" : ""}>${o.name}</button>`;
      }).join("");
      $$("[data-o]", optsEl).forEach((b) => b.addEventListener("click", () => choose(options[+b.dataset.o])));
      res.innerHTML = rows([["Score", `${score.right} / ${score.tried}`], ["In a row", score.streak]]);
      if (!answered) {
        exp.innerHTML = chips([["Your turn"]]) + "<h3>Which name is correct?</h3><p>Count the longest chain, find the group, number it, then check the side chains: di/tri, alphabetical order, commas and hyphens.</p>";
        return;
      }
      const head = answered.right
        ? chips([["Correct", "up"]]) + `<h3>${nameOf(cur, {}, true)}</h3>`
        : chips([["Not quite", "down"], [`Step ${answered.step}`, "warn"]]) + `<h3>${nameOf(cur, {}, true)}</h3><p><b>${answered.name}</b> breaks step ${answered.step}: ${answered.why}.</p>`;
      exp.innerHTML = head + steps(cur, true);
    }
    function choose(o) {
      if (answered) return;
      answered = o; score.tried++;
      if (o.right) { score.right++; score.streak++; } else score.streak = 0;
      render();
    }
    $("[data-next-mol]", lab).addEventListener("click", () => pick());
    $("[data-reset]", lab).addEventListener("click", () => { score = { right: 0, tried: 0, streak: 0 }; pick(); });
    lab.applyState = (s) => pick(POOL.find((m) => nameOf(m) === s.show) || null);
    pick();
  }

  /* =======================================================================
     Lab: esters
     ======================================================================= */
  function esterLab(lab) {
    const svg = $("[data-mol]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { alc: 2, acid: 2 };
    const alkylText = (k) => "CH3" + "CH2".repeat(Math.max(0, k - 1));
    const acidName = (m) => `${ROOT[m]}anoic acid`;
    const alcName = (k) => (k >= 3 ? `${ROOT[k]}an-1-ol` : `${ROOT[k]}anol`);
    const acidStruct = (m) => (m === 1 ? "HCOOH" : alkylText(m - 1) + "COOH");
    const alcStruct = (k) => alkylText(k) + "OH";
    const esterStruct = (m, k) => (m === 1 ? "HCOO" : alkylText(m - 1) + "COO") + (k === 1 ? "CH3" : "CH2".repeat(k - 1) + "CH3");
    function render() {
      const { alc: k, acid: m } = st;
      press($$("[data-alc]", lab), (b) => +b.dataset.alc === k);
      press($$("[data-acid]", lab), (b) => +b.dataset.acid === m);
      draw(svg, esterMol(m, k));
      const name = `${ROOT[k]}yl ${ROOT[m]}anoate`;
      res.innerHTML = rows([["Ester", name], ["Structural formula", sub(esterStruct(m, k))], ["Molecular formula", sub(`C${m + k}H${2 * (m + k)}O2`)]]);
      exp.innerHTML = chips([["Ester"], ["Supp."]]) +
        `<h3><span class="nm-alc">${ROOT[k]}yl</span> <span class="nm-pre">${ROOT[m]}anoate</span></h3>
         <p>The alcohol, <b>${alcName(k)}</b>, gives the first word: ${ROOT[k]} + <b>-yl</b>. The acid, <b>${acidName(m)}</b>, gives the second: ${ROOT[m]}an + <b>-oate</b>. They join through the –COO– link and lose a molecule of water.<br><span class="num">${sub(acidStruct(m))} + ${sub(alcStruct(k))} → ${sub(esterStruct(m, k))} + H₂O</span></p>
         <p class="flow"><span>${alcName(k)}</span><span>${ROOT[k]}yl</span><span>${acidName(m)}</span><span>${ROOT[m]}anoate</span><span>${name}</span></p>`;
    }
    $$("[data-alc]", lab).forEach((b) => b.addEventListener("click", () => { st.alc = +b.dataset.alc; render(); }));
    $$("[data-acid]", lab).forEach((b) => b.addEventListener("click", () => { st.acid = +b.dataset.acid; render(); }));
    $("[data-reset]", lab).addEventListener("click", () => { st = { alc: 2, acid: 2 }; render(); });
    lab.applyState = (s) => { st = { ...st, ...s }; render(); };
    render();
  }

  /* ---------- Header drawings ---------- */
  $$("svg[data-art]").forEach((svg) => {
    const spec = JSON.parse(svg.dataset.art);
    draw(svg, spec.ester ? esterMol(...spec.ester) : chainMol(normalise(spec).m, null), { fit: true });
  });

  const LABS = { build: buildLab, practice: practiceLab, ester: esterLab };
  $$("[data-lab]").forEach((lab) => LABS[lab.dataset.mode]?.(lab));

  // exposed for checking in the console: StayAdd.naming.nameOf({ n: 4, fam: "alkane", g: 0, subs: [...] })
  (window.StayAdd = window.StayAdd || {}).naming = { nameOf: (s) => nameOf(normalise(s).m), structural: (s) => structural(normalise(s).m), molecular: (s) => molecular(normalise(s).m) };
})();
