/* ==========================================================================
   stay add. — CS topic 8, Programming: the labs
   ops     string handling (LENGTH, SUBSTRING, UCASE, LCASE) and arithmetic
           (DIV, MOD, ROUND, ^) with the pseudocode and its result
   loops   the same job done with FOR, WHILE and REPEAT, iteration by iteration
   array   a 2D array: pick a row and column, or walk it with nested loops
   files   OPENFILE, WRITEFILE, READFILE and CLOSEFILE on a pretend text file
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, esc } = window.StayAdd.cs;

  /* ---------- string handling and operators ---------- */
  function opsLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), out = $("[data-expr]", lab);
    let st = { s: "Computer Science", start: 1, len: 8, a: 17, b: 5, op: "substring" };
    const OPS = {
      length: [() => `LENGTH("${st.s}")`, () => st.s.length, "the number of characters in the string, including spaces"],
      substring: [() => `SUBSTRING("${st.s}", ${st.start}, ${st.len})`, () => st.s.substr(st.start - 1, st.len), "part of the string: from position <b>start</b> (the first character is 1), <b>length</b> characters long"],
      ucase: [() => `UCASE("${st.s}")`, () => st.s.toUpperCase(), "the string in upper case"],
      lcase: [() => `LCASE("${st.s}")`, () => st.s.toLowerCase(), "the string in lower case"],
      div: [() => `DIV(${st.a}, ${st.b})`, () => (st.b ? Math.trunc(st.a / st.b) : "error: divide by zero"), "<b>integer division</b>: the whole number of times b goes into a"],
      mod: [() => `MOD(${st.a}, ${st.b})`, () => (st.b ? st.a % st.b : "error: divide by zero"), "the <b>remainder</b> after integer division — useful to test for even numbers (MOD(n, 2) = 0)"],
      divide: [() => `${st.a} / ${st.b}`, () => (st.b ? +(st.a / st.b).toFixed(4) : "error: divide by zero"), "normal division, giving a real number"],
      power: [() => `${st.a} ^ ${st.b}`, () => st.a ** st.b, "a raised to the power b"],
      round: [() => `ROUND(${st.a} / ${st.b}, 2)`, () => (st.b ? Math.round((st.a / st.b) * 100) / 100 : "error"), "rounds a value to a set number of decimal places"]
    };
    function draw() {
      const [expr, val, what] = OPS[st.op];
      const isStr = ["length", "substring", "ucase", "lcase"].includes(st.op);
      $$("[data-for]", lab).forEach((g) => (g.hidden = (g.dataset.for === "str") !== isStr));
      let vis = "";
      if (st.op === "substring") vis = `<div class="cells" style="margin-top:10px">${[...st.s].map((c, i) => `<div class="cell-v ${i >= st.start - 1 && i < st.start - 1 + st.len ? "hit" : ""}">${c === " " ? "␣" : esc(c)}<small>${i + 1}</small></div>`).join("")}</div>`;
      out.innerHTML = `<p class="sql"><span class="kw">OUTPUT</span> ${esc(expr())}</p><p class="big-read" style="margin:10px 4px"><span>result</span>${esc(String(val()))}</p>${vis}`;
      res.innerHTML = rows([["expression", esc(expr())], ["result", esc(String(val()))], ["data type of result", typeof val() === "number" ? (Number.isInteger(val()) && st.op !== "divide" && st.op !== "round" ? "INTEGER" : "REAL") : st.op === "length" ? "INTEGER" : "STRING"]]);
      exp.innerHTML = chips([[st.op.toUpperCase()]]) + `<h3>${esc(expr())} → ${esc(String(val()))}</h3><p>${what}.</p>` + flow(isStr ? ["string in", "library routine", "new value out"] : ["two numbers", "operator", "result"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { s: "Computer Science", start: 1, len: 8, a: 17, b: 5, op: "substring" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- loops ---------- */
  function loopsLab(lab) {
    const code = $("[data-code]", lab), trace = $("[data-trace]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { kind: "for", n: 5 };
    const SRC = {
      for: (n) => ["Total ← 0", `FOR Count ← 1 TO ${n}`, "   Total ← Total + Count", "NEXT Count", "OUTPUT Total"],
      while: (n) => ["Total ← 0", "Count ← 1", `WHILE Count <= ${n} DO`, "   Total ← Total + Count", "   Count ← Count + 1", "ENDWHILE", "OUTPUT Total"],
      repeat: (n) => ["Total ← 0", "Count ← 1", "REPEAT", "   Total ← Total + Count", "   Count ← Count + 1", `UNTIL Count > ${n}`, "OUTPUT Total"]
    };
    function draw() {
      code.innerHTML = SRC[st.kind](st.n).map((t, i) => `<div><span class="ln">${i + 1}</span>${esc(t).replace(/\b(FOR|TO|NEXT|WHILE|DO|ENDWHILE|REPEAT|UNTIL|OUTPUT)\b/g, '<span class="kw">$1</span>')}</div>`).join("");
      const its = []; let total = 0;
      if (st.kind === "repeat") { let c = 1; do { total += c; its.push([c, total]); c++; } while (!(c > st.n)); }
      else for (let c = 1; c <= st.n; c++) { total += c; its.push([c, total]); }
      trace.innerHTML = `<table class="tt"><tr><th>iteration</th><th>Count</th><th>Total</th></tr>${its.map(([c, t], i) => `<tr><td>${i + 1}</td><td>${c}</td><td>${t}</td></tr>`).join("")}</table>`;
      res.innerHTML = rows([["iterations", its.length], ["output", total], ["condition checked", st.kind === "for" ? "fixed count" : st.kind === "while" ? "at the start" : "at the end"]]);
      const text = {
        for: "A <b>count-controlled</b> loop: it runs a fixed number of times, and the counter is updated automatically.",
        while: "A <b>pre-condition</b> loop: the condition is checked <b>before</b> each pass, so if it is false at the start the loop body never runs.",
        repeat: "A <b>post-condition</b> loop: the condition is checked <b>after</b> each pass, so the body always runs <b>at least once</b>."
      }[st.kind];
      exp.innerHTML = chips([[st.kind.toUpperCase()], [`${its.length} passes`]]) + `<h3>${st.kind === "for" ? "FOR … NEXT" : st.kind === "while" ? "WHILE … ENDWHILE" : "REPEAT … UNTIL"}</h3><p>${text} ${st.n === 0 ? (st.kind === "repeat" ? "With N = 0 it <b>still ran once</b> — the difference between the loops." : "With N = 0 the body <b>never ran</b>.") : "Set N to 0 to see the difference between the loops."}</p>` + flow(["initialise", "check condition / count", "run the body", "repeat or stop"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { kind: "for", n: 5 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- 2D array ---------- */
  function arrayLab(lab) {
    const grid = $("[data-grid]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), code = $("[data-code]", lab);
    const R = 4, C = 3, NAMES = ["Asha", "Ben", "Chen", "Dee"], A = [[65, 72, 58], [80, 77, 91], [45, 62, 70], [88, 54, 66]];
    let st = { r: 2, c: 3 }, walk = null, timer = 0;
    function draw(hi) {
      grid.innerHTML = `<table class="tt"><tr><th></th>${Array.from({ length: C }, (_, j) => `<th>column ${j + 1}<br><small>test ${j + 1}</small></th>`).join("")}<th>row total</th></tr>` +
        A.map((row, i) => `<tr><th>row ${i + 1}<br><small>${NAMES[i]}</small></th>${row.map((v, j) => `<td class="${hi ? (hi[0] === i && hi[1] === j ? "one out" : (hi[0] > i || (hi[0] === i && hi[1] > j)) ? "one" : "") : i === st.r - 1 && j === st.c - 1 ? "one out" : ""}">${v}</td>`).join("")}<td>${hi && (hi[0] > i || (hi[0] === i && hi[1] === C - 1)) ? row.reduce((a, b) => a + b, 0) : ""}</td></tr>`).join("") + "</table>";
    }
    function show() {
      draw(); code.innerHTML = `<div><span class="kw">OUTPUT</span> Marks[${st.r}, ${st.c}]</div>`;
      const v = A[st.r - 1][st.c - 1];
      res.innerHTML = rows([["array", `Marks[1:${R}, 1:${C}] OF INTEGER`], ["element", `Marks[${st.r}, ${st.c}]`], ["value", v]]);
      exp.innerHTML = chips([["2D array"], [`row ${st.r}, column ${st.c}`]]) + `<h3>Marks[${st.r}, ${st.c}] = ${v}</h3><p>A 2D array is like a table: the first index chooses the <b>row</b>, the second the <b>column</b>. Here it is ${NAMES[st.r - 1]}’s mark in test ${st.c}. All elements have the <b>same data type</b>.</p>` + flow(["DECLARE Marks : ARRAY[1:4, 1:3] OF INTEGER", "Marks[row, column]", "one element"]);
    }
    function startWalk() {
      clearInterval(timer); let i = 0, j = 0;
      code.innerHTML = ["FOR Row ← 1 TO 4", "   Total ← 0", "   FOR Col ← 1 TO 3", "      Total ← Total + Marks[Row, Col]", "   NEXT Col", "   OUTPUT Total", "NEXT Row"].map((t) => `<div>${esc(t).replace(/\b(FOR|TO|NEXT|OUTPUT)\b/g, '<span class="kw">$1</span>')}</div>`).join("");
      timer = setInterval(() => {
        draw([i, j]);
        res.innerHTML = rows([["Row", i + 1], ["Col", j + 1], ["element", A[i][j]]]);
        exp.innerHTML = chips([["Nested loops"], [`Row ${i + 1}, Col ${j + 1}`]]) + `<h3>The inner loop runs through every column for each row</h3><p>The <b>outer</b> loop chooses the row; the <b>inner</b> loop visits each column in that row and adds it to the row total. ${R} rows × ${C} columns = ${R * C} elements visited.</p>`;
        j++; if (j >= C) { j = 0; i++; } if (i >= R) { clearInterval(timer); draw([R, 0]); }
      }, 450);
    }
    const paint = controls(lab, st, () => { clearInterval(timer); paint(); show(); });
    $("[data-walk]", lab).addEventListener("click", startWalk);
    $("[data-reset]", lab).addEventListener("click", () => { clearInterval(timer); Object.assign(st, { r: 2, c: 3 }); paint(); show(); });
    lab.applyState = (s) => { clearInterval(timer); if (s.walk) return startWalk(); Object.assign(st, s); paint(); show(); };
    paint(); show();
  }

  /* ---------- file handling ---------- */
  function filesLab(lab) {
    const log = $("[data-log]", lab), fileEl = $("[data-file]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), line = $("[data-line]", lab);
    let file = ["Asha,15", "Ben,16"], mode = null, readPos = 0;
    const say = (t, c = "") => { log.innerHTML += `<span class="${c}">${esc(t)}</span>\n`; log.scrollTop = 1e6; };
    function draw() {
      fileEl.innerHTML = file.length ? file.map((l, i) => `<div class="${mode === "READ" && i === readPos - 1 ? "now" : ""}"><span class="ln">${i + 1}</span>${esc(l)}</div>`).join("") : `<div><span class="ln"> </span><i>empty file</i></div>`;
      res.innerHTML = rows([["file", "Students.txt"], ["open in mode", mode || "closed"], ["lines in file", file.length]]);
    }
    function explain(t) { exp.innerHTML = chips([[mode ? `open for ${mode}` : "closed"]]) + `<h3>${t}</h3><p>Data in variables is lost when a program ends; storing it in a <b>file</b> keeps it so it can be used again later. Open the file in the right mode, use it, then <b>close</b> it.</p>` + flow(["OPENFILE … FOR READ / WRITE / APPEND", "READFILE or WRITEFILE", "CLOSEFILE"]); }
    $$("[data-open]", lab).forEach((b) => b.addEventListener("click", () => {
      mode = b.dataset.open; readPos = 0;
      say(`OPENFILE "Students.txt" FOR ${mode}`);
      if (mode === "WRITE") { file = []; say("// WRITE starts a new, empty file — old contents gone", "err"); }
      draw(); explain(mode === "WRITE" ? "Opened for WRITE: the file starts empty" : mode === "APPEND" ? "Opened for APPEND: new lines go on the end" : "Opened for READ: read one line at a time");
    }));
    $("[data-write]", lab).addEventListener("click", () => {
      if (mode !== "WRITE" && mode !== "APPEND") { say("Error: file not open for WRITE or APPEND", "err"); return; }
      const t = line.value.trim() || "Chen,15"; file.push(t); say(`WRITEFILE "Students.txt", "${t}"`); draw(); explain(`Wrote “${t}” to the file`);
    });
    $("[data-read]", lab).addEventListener("click", () => {
      if (mode !== "READ") { say("Error: file not open for READ", "err"); return; }
      if (readPos >= file.length) { say("EOF(\"Students.txt\") = TRUE — end of file", "ok"); explain("End of file reached"); return; }
      const t = file[readPos++]; say(`READFILE "Students.txt", Line   → Line = "${t}"`); draw(); explain(`Read line ${readPos}: “${t}”`);
    });
    $("[data-close]", lab).addEventListener("click", () => { say(`CLOSEFILE "Students.txt"`, "ok"); mode = null; draw(); explain("File closed"); });
    $("[data-reset]", lab).addEventListener("click", () => { file = ["Asha,15", "Ben,16"]; mode = null; log.innerHTML = ""; draw(); explain("A text file with two lines"); });
    lab.applyState = () => $("[data-reset]", lab).click();
    $("[data-reset]", lab).click();
  }

  labs({ ops: opsLab, loops: loopsLab, array: arrayLab, files: filesLab });
})();
