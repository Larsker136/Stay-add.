/* ==========================================================================
   stay add. — CS topic 10, Boolean logic: the labs
   gates    one logic gate: switch its inputs and read its truth table
   circuit  three-input circuits built from gates, wires lit when 1; pick a
            row of the truth table to set the inputs
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs } = window.StayAdd.cs;

  const F = { AND: (a, b) => a & b, OR: (a, b) => a | b, NOT: (a) => 1 - a, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b), XOR: (a, b) => a ^ b };
  const DESC = {
    AND: "output 1 only if <b>both</b> inputs are 1", OR: "output 1 if <b>at least one</b> input is 1", NOT: "output is the <b>opposite</b> of the input",
    NAND: "NOT AND: output 0 only if both inputs are 1", NOR: "NOT OR: output 1 only if both inputs are 0", XOR: "exclusive OR: output 1 if the inputs are <b>different</b>"
  };
  // the standard symbol for each gate, drawn with its top-left at (x, y), 60 × 44
  function gatePath(t, x, y) {
    const and = `M${x} ${y}H${x + 30}A22 22 0 0 1 ${x + 30} ${y + 44}H${x}Z`;
    const or = `M${x} ${y}Q${x + 16} ${y + 22} ${x} ${y + 44}Q${x + 38} ${y + 44} ${x + 58} ${y + 22}Q${x + 38} ${y} ${x} ${y}Z`;
    if (t === "AND" || t === "NAND") return { d: and, out: [x + (t === "NAND" ? 62 : 52), y + 22], bub: t === "NAND" ? [x + 57, y + 22] : null };
    if (t === "OR" || t === "NOR") return { d: or, out: [x + (t === "NOR" ? 68 : 58), y + 22], bub: t === "NOR" ? [x + 63, y + 22] : null };
    if (t === "XOR") return { d: or, extra: `M${x - 8} ${y}Q${x + 8} ${y + 22} ${x - 8} ${y + 44}`, out: [x + 58, y + 22], bub: null };
    return { d: `M${x} ${y + 2}L${x + 40} ${y + 22}L${x} ${y + 42}Z`, out: [x + 50, y + 22], bub: [x + 45, y + 22] };
  }
  const inPts = (t, x, y) => (t === "NOT" ? [[x, y + 22]] : [[x + (t === "AND" || t === "NAND" ? 0 : 6), y + 12], [x + (t === "AND" || t === "NAND" ? 0 : 6), y + 32]]);
  function drawGate(t, x, y, on) {
    const g = gatePath(t, x, y);
    return `<path class="gate ${on ? "on" : ""}" d="${g.d}"/>${g.extra ? `<path class="l" style="--fc:var(--ink-2);--lw:2" d="${g.extra}"/>` : ""}${g.bub ? `<circle class="bub" cx="${g.bub[0]}" cy="${g.bub[1]}" r="5"/>` : ""}`;
  }
  const wire = (on, d) => `<path class="${on ? "wire-on" : "wire-off"}" d="${d}"/>`;

  /* ---------- one gate ---------- */
  function gatesLab(lab) {
    const svg = $("[data-svg]", lab), tt = $("[data-tt]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { gate: "AND", a: 1, b: 0 };
    function draw() {
      const t = st.gate, one = t === "NOT", out = one ? F.NOT(st.a) : F[t](st.a, st.b);
      const x = 270, y = 88, g = gatePath(t, x, y), ins = inPts(t, x, y);
      svg.innerHTML = `<g transform="translate(-160 -100) scale(1.5)">
        ${wire(st.a, `M150 ${ins[0][1]}H${ins[0][0]}`)}${one ? "" : wire(st.b, `M150 ${ins[1][1]}H${ins[1][0]}`)}
        ${drawGate(t, x, y, out)}${wire(out, `M${g.out[0]} ${g.out[1]}H440`)}
        <text x="132" y="${ins[0][1] + 4}" text-anchor="end" class="mono-b">A=${st.a}</text>${one ? "" : `<text x="132" y="${ins[1][1] + 4}" text-anchor="end" class="mono-b">B=${st.b}</text>`}
        <text x="448" y="${g.out[1] + 4}" class="mono-b">X=${out}</text><text x="${x + 24}" y="${y + 66}" text-anchor="middle" class="k">${t}</text></g>`;
      const combos = one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      tt.innerHTML = `<table class="tt"><tr><th>A</th>${one ? "" : "<th>B</th>"}<th>X</th></tr>${combos.map((c) => { const o = one ? F.NOT(c[0]) : F[t](c[0], c[1]); const now = c[0] === st.a && (one || c[1] === st.b); return `<tr class="${now ? "now" : ""}" data-row="${c.join("")}">${c.map((v) => `<td class="${v ? "one" : ""}">${v}</td>`).join("")}<td class="out ${o ? "one" : ""}">${o}</td></tr>`; }).join("")}</table>`;
      $$("[data-in]", lab).forEach((b) => { b.setAttribute("aria-pressed", String(!!st[b.dataset.in])); b.textContent = `${b.dataset.in.toUpperCase()} = ${st[b.dataset.in]}`; b.hidden = one && b.dataset.in === "b"; });
      res.innerHTML = rows([["gate", t], ["inputs", one ? `A = ${st.a}` : `A = ${st.a}, B = ${st.b}`], ["output X", out], ["expression", one ? "X = NOT A" : `X = A ${t} B`]]);
      exp.innerHTML = chips([[t], [`X = ${out}`, out ? "up" : ""]]) + `<h3>${t}: ${DESC[t]}</h3><p>Switch the inputs or click a row of the truth table. A wire carrying 1 is lit; 0 is grey.</p>` + flow(["inputs (0 or 1)", `${t} gate`, "output"]);
    }
    $$("[data-in]", lab).forEach((b) => b.addEventListener("click", () => { st[b.dataset.in] ^= 1; draw(); }));
    tt.addEventListener("click", (e) => { const r = e.target.closest("[data-row]"); if (!r) return; st.a = +r.dataset.row[0]; if (r.dataset.row[1] !== undefined) st.b = +r.dataset.row[1]; draw(); });
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { gate: "AND", a: 1, b: 0 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- circuits ---------- */
  const CIRCUITS = {
    c1: { expr: "X = (A AND B) OR (NOT C)", gates: [["g1", "AND", 200, 40, ["A", "B"]], ["g2", "NOT", 200, 170, ["C"]], ["g3", "OR", 380, 100, ["g1", "g2"]]] },
    c2: { expr: "X = (NOT (A OR B)) AND C", gates: [["g1", "NOR", 200, 50, ["A", "B"]], ["g2", "AND", 390, 110, ["g1", "C"]]] },
    c3: { expr: "X = (A NAND B) XOR C", gates: [["g1", "NAND", 200, 50, ["A", "B"]], ["g2", "XOR", 390, 110, ["g1", "C"]]] },
    alarm: { expr: "X = (A AND B) OR C", story: "An alarm X sounds if the door is open (A) AND the system is armed (B), OR if a window is broken (C).", gates: [["g1", "AND", 200, 40, ["A", "B"]], ["g2", "OR", 390, 110, ["g1", "C"]]] }
  };
  function circuitLab(lab) {
    const svg = $("[data-svg]", lab), tt = $("[data-tt]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const start = lab.dataset.start || "c1";
    let st = { c: start, A: 1, B: 1, C: 0 };
    const IN = { A: 62, B: 102, C: 192 };
    function evaluate(c, v) {
      const val = { ...v };
      c.gates.forEach(([id, t, , , src]) => { const a = val[src[0]], b = val[src[1]]; val[id] = t === "NOT" ? F.NOT(a) : F[t](a, b); });
      return val;
    }
    function draw() {
      const c = CIRCUITS[st.c], val = evaluate(c, st), last = c.gates.at(-1)[0];
      const outPt = (src) => { if (IN[src] !== undefined) return [60, IN[src]]; const g = c.gates.find((x) => x[0] === src); return gatePath(g[1], g[2], g[3]).out; };
      let w = "", gs = "";
      c.gates.forEach(([id, t, x, y, src]) => {
        const ins = inPts(t, x, y);
        src.forEach((s, k) => { const [x0, y0] = outPt(s), [x1, y1] = ins[k], mid = x1 - 22 - k * 8; w += wire(val[s], `M${x0} ${y0}H${mid}V${y1}H${x1}`); });
        gs += drawGate(t, x, y, val[id]) + `<text x="${x + 26}" y="${y + 60}" text-anchor="middle">${t}</text>`;
      });
      const [ox, oy] = outPt(last);
      svg.innerHTML = w + gs + wire(val[last], `M${ox} ${oy}H600`) +
        Object.entries(IN).filter(([k]) => c.gates.some((g) => g[4].includes(k))).map(([k, y]) => `<g data-tog="${k}" style="cursor:pointer"><rect class="${st[k] ? "bit1" : "bit0"}" x="14" y="${y - 14}" width="46" height="28" rx="6"/><text x="37" y="${y + 5}" text-anchor="middle" class="mono-b">${k}=${st[k]}</text></g>`).join("") +
        `<rect class="${val[last] ? "bit1" : "bit0"}" x="566" y="${oy - 16}" width="62" height="32" rx="6"/><text x="597" y="${oy + 5}" text-anchor="middle" class="mono-b">X=${val[last]}</text>`;
      let body = "";
      for (let n = 0; n < 8; n++) {
        const v = { A: (n >> 2) & 1, B: (n >> 1) & 1, C: n & 1 }, r = evaluate(c, v), now = v.A === st.A && v.B === st.B && v.C === st.C;
        body += `<tr class="${now ? "now" : ""}" data-n="${n}"><td class="${v.A ? "one" : ""}">${v.A}</td><td class="${v.B ? "one" : ""}">${v.B}</td><td class="${v.C ? "one" : ""}">${v.C}</td>${c.gates.slice(0, -1).map(([id]) => `<td>${r[id]}</td>`).join("")}<td class="out ${r[last] ? "one" : ""}">${r[last]}</td></tr>`;
      }
      tt.innerHTML = `<table class="tt"><tr><th>A</th><th>B</th><th>C</th>${c.gates.slice(0, -1).map(([id, t]) => `<th>${t}</th>`).join("")}<th>X</th></tr>${body}</table>`;
      res.innerHTML = rows([["expression", c.expr], ["inputs", `A=${st.A} B=${st.B} C=${st.C}`], ["output X", val[last]], ["rows where X = 1", Array.from({ length: 8 }, (_, n) => evaluate(c, { A: (n >> 2) & 1, B: (n >> 1) & 1, C: n & 1 })[last]).filter(Boolean).length + " of 8"]]);
      exp.innerHTML = chips([[c.story ? "Problem statement" : "Logic circuit"], [`X = ${val[last]}`, val[last] ? "up" : ""]]) + `<h3>${c.expr}</h3><p>${c.story ? c.story + " " : ""}Work through the circuit gate by gate, left to right: each gate’s output becomes the next gate’s input. Extra columns in the truth table for the middle gates make it easier to get the final column right. With 3 inputs there are 2³ = <b>8 rows</b>.</p>` + flow(["inputs", "first gates", "intermediate results", "final gate", "X"]);
    }
    svg.addEventListener("click", (e) => { const g = e.target.closest("[data-tog]"); if (!g) return; st[g.dataset.tog] ^= 1; draw(); });
    tt.addEventListener("click", (e) => { const r = e.target.closest("[data-n]"); if (!r) return; const n = +r.dataset.n; Object.assign(st, { A: (n >> 2) & 1, B: (n >> 1) & 1, C: n & 1 }); draw(); });
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { c: start, A: 1, B: 1, C: 0 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ gates: gatesLab, circuit: circuitLab });
})();
