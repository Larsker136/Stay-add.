/* ==========================================================================
   stay add. — CS topic 7, Algorithm design and problem-solving: the labs
   trace     step through a pseudocode algorithm and fill its trace table
   search    linear search, one comparison at a time
   sort      bubble sort with a swap flag, pass by pass
   validate  validation and verification checks on a form
   errors    find the errors in an algorithm
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, labs, esc } = window.StayAdd.cs;
  const codeHtml = (lines, now = -1, bad = []) => lines.map((t, i) => `<div class="${i === now ? "now" : ""} ${bad.includes(i) ? "badl" : ""}" data-l="${i}"><span class="ln">${i + 1}</span>${t.replace(/\b(FOR|TO|NEXT|IF|THEN|ELSE|ENDIF|WHILE|DO|ENDWHILE|REPEAT|UNTIL|OUTPUT|INPUT|DECLARE|AND|OR|NOT|DIV|MOD)\b/g, '<span class="kw">$1</span>')}</div>`).join("");

  /* ---------- trace table ---------- */
  function traceLab(lab) {
    const code = $("[data-code]", lab), tt = $("[data-tt]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), inp = $("[data-marks]", lab);
    const L = ["Max ← 0", "Count ← 0", "FOR Index ← 1 TO 5", "   IF Mark[Index] > Max THEN", "      Max ← Mark[Index]", "   ENDIF", "   IF Mark[Index] >= 50 THEN", "      Count ← Count + 1", "   ENDIF", "NEXT Index", "OUTPUT Max, Count"];
    let steps, at;
    function build() {
      const M = inp.value.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n)).slice(0, 5);
      while (M.length < 5) M.push(0);
      steps = []; let Max, Count, Index; const row = (extra = {}) => ({ Index, Mark: Index ? M[Index - 1] : "", Max, Count, ...extra });
      Max = 0; steps.push({ line: 0, row: row(), say: "Max is initialised to 0." });
      Count = 0; steps.push({ line: 1, row: row(), say: "Count is initialised to 0." });
      for (Index = 1; Index <= 5; Index++) {
        steps.push({ line: 2, row: row(), say: `The loop sets Index to ${Index}.`, newRow: true });
        const m = M[Index - 1];
        steps.push({ line: 3, row: row(), say: `Is ${m} > ${Max}? ${m > Max ? "Yes" : "No"}.` });
        if (m > Max) { Max = m; steps.push({ line: 4, row: row(), say: `Max becomes ${m}.` }); }
        steps.push({ line: 6, row: row(), say: `Is ${m} ≥ 50? ${m >= 50 ? "Yes" : "No"}.` });
        if (m >= 50) { Count++; steps.push({ line: 7, row: row(), say: `Count goes up to ${Count}.` }); }
        steps.push({ line: 9, row: row(), say: Index < 5 ? "Back to the top of the loop." : "The loop has finished." });
      }
      Index = 5; steps.push({ line: 10, row: { ...row(), out: `${Max}, ${Count}` }, say: `Output: ${Max}, ${Count}.` });
      at = -1; draw();
    }
    function draw() {
      const s = steps[at];
      code.innerHTML = codeHtml(L, s ? s.line : -1);
      // the trace table gets a new row for each pass of the loop, as Cambridge mark schemes expect
      const shown = steps.slice(0, at + 1), tRows = [];
      shown.forEach((x) => { if (x.newRow || !tRows.length) tRows.push({}); Object.assign(tRows[tRows.length - 1], x.row); });
      tt.innerHTML = `<table class="tt"><tr><th>Index</th><th>Mark[Index]</th><th>Max</th><th>Count</th><th>OUTPUT</th></tr>${tRows.map((r, i) => `<tr class="${i === tRows.length - 1 ? "now" : ""}"><td>${r.Index ?? ""}</td><td>${r.Mark ?? ""}</td><td>${r.Max ?? ""}</td><td>${r.Count ?? ""}</td><td class="out">${r.out ?? ""}</td></tr>`).join("")}</table>`;
      res.innerHTML = rows([["step", `${at + 1} of ${steps.length}`], ["line", s ? s.line + 1 : "—"]]);
      exp.innerHTML = s ? chips([[at === steps.length - 1 ? "Finished" : "Tracing", at === steps.length - 1 ? "up" : ""], [`line ${s.line + 1}`]]) + `<h3>${s.say}</h3><p>A <b>trace table</b> records the value of each variable as the algorithm runs, so you can check it works — or find where it goes wrong — without a computer. This algorithm finds the <b>highest</b> mark and <b>counts</b> the marks of 50 or more.</p>` + flow(["run one line", "record any variable that changes", "new row for each loop", "compare output with what was expected"])
        : chips([["Ready"]]) + `<h3>Press Step to run the first line</h3><p>Change the marks to trace a different set of data.</p>`;
    }
    $("[data-step]", lab).addEventListener("click", () => { if (at < steps.length - 1) { at++; draw(); } });
    $("[data-back]", lab).addEventListener("click", () => { if (at > -1) { at--; draw(); } });
    $("[data-all]", lab).addEventListener("click", () => { at = steps.length - 1; draw(); });
    inp.addEventListener("change", build);
    $("[data-reset]", lab).addEventListener("click", () => { inp.value = "34, 72, 58, 19, 91"; build(); });
    lab.applyState = (s) => { if (s.marks) inp.value = s.marks; build(); if (s.all) { at = steps.length - 1; draw(); } };
    inp.value = "34, 72, 58, 19, 91"; build();
  }

  /* ---------- linear search ---------- */
  function searchLab(lab) {
    const cells = $("[data-cells]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), code = $("[data-code]", lab), tIn = $("[data-target]", lab);
    const L = ["Found ← FALSE", "Index ← 1", "WHILE Found = FALSE AND Index <= 10 DO", "   IF List[Index] = Target THEN", "      Found ← TRUE", "   ELSE", "      Index ← Index + 1", "   ENDIF", "ENDWHILE"];
    let list = [27, 4, 61, 15, 88, 42, 9, 73, 36, 50], i, found, done, comps;
    function reset() { i = 0; found = false; done = false; comps = 0; draw(-1); }
    function draw(line) {
      cells.innerHTML = list.map((v, k) => `<div class="cell-v ${found && k === i ? "hit" : k === i && !done ? "cmp" : k < i ? "miss" : ""}">${v}<small>[${k + 1}]</small></div>`).join("");
      code.innerHTML = codeHtml(L, line);
      res.innerHTML = rows([["target", tIn.value], ["comparisons", comps], ["result", done ? (found ? `found at position ${i + 1}` : "not in the list") : "searching…"]]);
    }
    function step() {
      if (done) return;
      const t = +tIn.value; comps++;
      if (list[i] === t) { found = true; done = true; draw(4); explain(); return; }
      if (i >= list.length - 1) { done = true; i = list.length; draw(8); explain(); return; }
      i++; draw(6); exp.innerHTML = chips([["Comparing"], [`item ${i}`]]) + `<h3>${list[i - 1]} is not ${t} — move to the next item</h3><p>A linear search checks each item <b>in order</b>, starting from the first.</p>`;
    }
    function explain() {
      exp.innerHTML = (found ? chips([["Found", "up"], [`${comps} comparisons`]]) : chips([["Not found", "down"], [`${comps} comparisons`]])) +
        `<h3>${found ? `Found at position ${i + 1}` : "Every item checked — not there"}</h3><p>A linear search works on <b>unsorted</b> data, but in the worst case it checks every item. ${found ? "It stops as soon as the item is found." : "Only after the last item can it say the target is missing."}</p>` + flow(["start at the first item", "compare with the target", "match → stop", "no match → next item"]);
    }
    $("[data-step]", lab).addEventListener("click", step);
    $("[data-all]", lab).addEventListener("click", () => { while (!done) step(); });
    tIn.addEventListener("change", reset);
    $("[data-shuffle]", lab).addEventListener("click", () => { list = list.sort(() => Math.random() - 0.5); reset(); });
    $("[data-reset]", lab).addEventListener("click", () => { list = [27, 4, 61, 15, 88, 42, 9, 73, 36, 50]; tIn.value = 73; reset(); exp.innerHTML = chips([["Ready"]]) + `<h3>Search for a value</h3><p>Choose a target and press Step.</p>`; });
    lab.applyState = (s) => { tIn.value = s.target; reset(); if (s.all) while (!done) step(); };
    $("[data-reset]", lab).click();
  }

  /* ---------- bubble sort ---------- */
  function sortLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), code = $("[data-code]", lab);
    const L = ["Top ← 8", "REPEAT", "   Swap ← FALSE", "   FOR Index ← 1 TO Top − 1", "      IF List[Index] > List[Index + 1] THEN", "         Temp ← List[Index]", "         List[Index] ← List[Index + 1]", "         List[Index + 1] ← Temp", "         Swap ← TRUE", "      ENDIF", "   NEXT Index", "   Top ← Top − 1", "UNTIL Swap = FALSE OR Top = 1"];
    let a, j, top, swapped, pass, comps, swaps, done, last;
    function reset(arr) { a = arr || [5, 9, 2, 7, 4, 8, 1, 6]; j = 0; top = a.length; swapped = false; pass = 1; comps = 0; swaps = 0; done = false; last = null; draw(-1); idle(); }
    function draw(line) {
      const W = 64;
      svg.innerHTML = a.map((v, k) => `<rect class="f ${done || k >= top ? "cg dk" : last && last.k.includes(k) ? (last.sw ? "cr dk" : "ca dk") : "cp"}" x="${40 + k * W}" y="${210 - v * 20}" width="${W - 10}" height="${v * 20}" rx="4"/><text x="${40 + k * W + (W - 10) / 2}" y="${230}" text-anchor="middle" class="mono-b">${v}</text>`).join("") + `<text x="40" y="22">pass ${pass}${done ? " · sorted" : ""}</text><text x="600" y="22" text-anchor="end" class="tc cg">green: in its final place</text>`;
      code.innerHTML = codeHtml(L, line);
      res.innerHTML = rows([["pass", pass], ["comparisons", comps], ["swaps", swaps], ["status", done ? "sorted" : "sorting"]]);
    }
    function step() {
      if (done) return;
      comps++; const sw = a[j] > a[j + 1];
      if (sw) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; swapped = true; }
      last = { k: [j, j + 1], sw };
      const line = sw ? 6 : 4;
      exp.innerHTML = chips([[`Pass ${pass}`], [sw ? "swap" : "no swap", sw ? "warn" : ""]]) + `<h3>Compare ${sw ? a[j + 1] : a[j]} and ${sw ? a[j] : a[j + 1]}: ${sw ? "swap them" : "already in order"}</h3><p>Each pass compares neighbouring pairs and swaps them if they are in the wrong order, so the largest value “bubbles” to the end.</p>`;
      j++;
      if (j >= top - 1) {
        top--;
        if (!swapped || top <= 1) { done = true; draw(12); exp.innerHTML = chips([["Sorted", "up"], [`${pass} passes`]]) + `<h3>${!swapped ? "A whole pass with no swaps — so the list is sorted" : "Sorted"}</h3><p>The <b>Swap</b> flag stops the algorithm early: if a pass makes no swaps, every pair is in order and there is no need to continue. Each pass also needs one fewer comparison, because the end of the list is already sorted.</p>` + flow(["compare neighbours", "swap if out of order", "largest bubbles to the end", "repeat until a pass has no swaps"]); return; }
        pass++; j = 0; swapped = false;
      }
      draw(line);
    }
    function idle() { exp.innerHTML = chips([["Ready"]]) + `<h3>Press Step to compare the first pair</h3><p>Watch the amber pair being compared; red means they swapped.</p>`; }
    $("[data-step]", lab).addEventListener("click", step);
    $("[data-pass]", lab).addEventListener("click", () => { const p = pass; while (!done && pass === p) step(); });
    $("[data-all]", lab).addEventListener("click", () => { while (!done) step(); });
    $("[data-shuffle]", lab).addEventListener("click", () => reset(Array.from({ length: 8 }, () => 1 + Math.floor(Math.random() * 9))));
    $("[data-sorted]", lab).addEventListener("click", () => reset([1, 2, 3, 4, 6, 5, 8, 9]));
    $("[data-reset]", lab).addEventListener("click", () => reset());
    lab.applyState = (s) => { reset(s.list); if (s.all) while (!done) step(); };
    reset();
  }

  /* ---------- validation and verification ---------- */
  function validateLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), out = $("[data-checks]", lab);
    const CHECKS = [
      ["name", "presence check", (v) => v.trim() !== "", "must not be empty"],
      ["name", "length check", (v) => v.trim().length <= 20, "at most 20 characters"],
      ["age", "type check", (v) => /^-?\d+$/.test(v.trim()), "must be a whole number"],
      ["age", "range check", (v) => +v >= 11 && +v <= 18, "between 11 and 18"],
      ["id", "format check", (v) => /^[A-Z]{2}\d{4}$/.test(v.trim()), "two capital letters then four digits, e.g. AB1234"],
      ["email", "format check", (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()), "something@something.something"],
      ["password", "length check", (v) => v.length >= 8, "at least 8 characters"],
      ["confirm", "double entry (verification)", (v, all) => v === all.password && v !== "", "must match the password exactly"]
    ];
    function run() {
      const all = {}; $$("[data-f]", lab).forEach((i) => (all[i.dataset.f] = i.value));
      const r = CHECKS.map(([f, name, fn, rule]) => ({ f, name, ok: fn(all[f] ?? "", all), rule }));
      out.innerHTML = `<table class="qtable"><tr><th>field</th><th>check</th><th>rule</th><th>result</th></tr>${r.map((c) => `<tr class="${c.ok ? "match" : ""}"><td>${c.f}</td><td>${c.name}</td><td>${c.rule}</td><td style="color:${c.ok ? "var(--c-bit)" : "var(--c-err)"}">${c.ok ? "✓ accepted" : "✗ rejected"}</td></tr>`).join("")}</table>`;
      const bad = r.filter((c) => !c.ok);
      res.innerHTML = rows([["checks passed", `${r.length - bad.length} / ${r.length}`], ["data accepted?", bad.length ? "no" : "yes"]]);
      exp.innerHTML = (bad.length ? chips([["Rejected", "down"], [`${bad.length} failed`]]) : chips([["Accepted", "up"]])) +
        `<h3>${bad.length ? `The ${bad[0].name} on “${bad[0].f}” failed` : "All checks passed"}</h3><p><b>Validation</b> is an automatic check that data is <b>reasonable and sensible</b> before it is accepted — it can’t tell whether it is <b>correct</b>: an age of 12 passes even if the student is 14. <b>Verification</b> checks that data has been <b>copied or entered accurately</b>, e.g. typing a password twice (double entry) or a visual check.</p>` + flow(["data entered", "validation: reasonable?", "verification: entered accurately?", "accepted"]);
    }
    lab.addEventListener("input", (e) => e.target.matches("[data-f]") && run());
    const defaults = { name: "Asha Patel", age: "15", id: "AB1234", email: "asha@school.org", password: "kite-moon-7", confirm: "kite-moon-7" };
    $("[data-reset]", lab).addEventListener("click", () => { $$("[data-f]", lab).forEach((i) => (i.value = defaults[i.dataset.f])); run(); });
    lab.applyState = (s) => { $$("[data-f]", lab).forEach((i) => (i.value = s[i.dataset.f] ?? defaults[i.dataset.f])); run(); };
    $("[data-reset]", lab).click();
  }

  /* ---------- find the errors ---------- */
  function errorsLab(lab) {
    const code = $("[data-code]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const L = ["// find the average of 5 numbers", "Total ← 0", "FOR Count ← 1 TO 4", "   INPUT Number", "   Total ← Number", "NEXT Count", "Average ← Total / 4", "OUTPUT Average"];
    const ERR = { 2: ["the loop only runs 4 times", "FOR Count ← 1 TO 5"], 4: ["Total is overwritten instead of added to", "Total ← Total + Number"], 6: ["it divides by 4, not 5", "Average ← Total / 5"] };
    let found = new Set(), wrong = 0;
    function draw() {
      code.innerHTML = codeHtml(L.map((t, i) => (found.has(i) ? `${ERR[i][1]}   // fixed` : t)), -1, [...found]);
      res.innerHTML = rows([["errors found", `${found.size} / 3`], ["wrong guesses", wrong]]);
    }
    code.addEventListener("click", (e) => {
      const d = e.target.closest("[data-l]"); if (!d) return; const i = +d.dataset.l;
      if (ERR[i] && !found.has(i)) { found.add(i); draw(); exp.innerHTML = chips([["Error found", "up"], [`line ${i + 1}`]]) + `<h3>Line ${i + 1}: ${ERR[i][0]}</h3><p>Corrected to <code class="i">${esc(ERR[i][1])}</code>. ${found.size === 3 ? "All three found — the algorithm now works." : `${3 - found.size} more to find.`}</p>`; }
      else if (!ERR[i]) { wrong++; draw(); exp.innerHTML = chips([["Not an error"]]) + `<h3>Line ${i + 1} is fine</h3><p>Trace it with sample data — for example 2, 4, 6, 8, 10 should give an average of 6.</p>`; }
    });
    $("[data-reset]", lab).addEventListener("click", () => { found = new Set(); wrong = 0; draw(); exp.innerHTML = chips([["Find 3 errors"]]) + `<h3>This algorithm should output the average of five numbers</h3><p>Click each line that contains an error.</p>`; });
    lab.applyState = () => { Object.keys(ERR).forEach((k) => found.add(+k)); draw(); exp.innerHTML = chips([["All shown"]]) + `<h3>Three logic errors</h3><p>The loop count, the totalling and the divisor were all wrong. None is a syntax error — the program would run but give the wrong answer.</p>`; };
    $("[data-reset]", lab).click();
  }

  labs({ trace: traceLab, search: searchLab, sort: sortLab, validate: validateLab, errors: errorsLab });
})();
