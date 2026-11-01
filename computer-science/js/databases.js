/* ==========================================================================
   stay add. — CS topic 9, Databases: the labs
   keys  pick a field as the primary key and see whether it identifies every
         record uniquely
   sql   build a SELECT query — fields, WHERE with AND / OR, ORDER BY, SUM and
         COUNT — and see the SQL and its result on a real table
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, esc } = window.StayAdd.cs;
  const FIELDS = [["StudentID", "text"], ["FirstName", "text"], ["Surname", "text"], ["Form", "text"], ["Age", "integer"], ["Score", "integer"], ["Library", "boolean"]];
  const DATA = [
    ["S001", "Asha", "Patel", "10A", 15, 78, true], ["S002", "Ben", "Okafor", "10B", 16, 64, false], ["S003", "Chen", "Li", "10A", 15, 91, true],
    ["S004", "Dee", "Patel", "10C", 16, 55, true], ["S005", "Eli", "Smith", "10B", 15, 82, false], ["S006", "Asha", "Khan", "10C", 16, 70, false],
    ["S007", "Finn", "Murphy", "10A", 14, 47, true], ["S008", "Gia", "Rossi", "10B", 15, 88, true]
  ];
  const cell = (v) => (v === true ? "TRUE" : v === false ? "FALSE" : esc(v));

  /* ---------- primary keys ---------- */
  function keysLab(lab) {
    const host = $("[data-table]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { key: "StudentID" };
    function draw() {
      const k = FIELDS.findIndex((f) => f[0] === st.key), vals = DATA.map((r) => String(r[k])), dup = vals.filter((v, i) => vals.indexOf(v) !== i);
      host.innerHTML = `<table class="qtable"><tr>${FIELDS.map(([f, t], i) => `<th class="${i === k ? "pick" : ""}">${f}${i === k ? " 🔑" : ""}<br><small>${t}</small></th>`).join("")}</tr>${DATA.map((r) => `<tr class="${dup.includes(String(r[k])) ? "no" : ""}">${r.map((v, i) => `<td class="${i === k ? "pick" : ""}">${cell(v)}</td>`).join("")}</tr>`).join("")}</table>`;
      res.innerHTML = rows([["table", "Students"], ["records (rows)", DATA.length], ["fields (columns)", FIELDS.length], ["primary key", st.key], ["unique?", dup.length ? `no — repeated: ${[...new Set(dup)].join(", ")}` : "yes"]]);
      exp.innerHTML = (dup.length ? chips([["Not a good key", "down"]]) : chips([["Good primary key", "up"]])) +
        `<h3>${dup.length ? `${st.key} has repeated values` : `${st.key} is different for every record`}</h3><p>A <b>primary key</b> is a field that <b>uniquely identifies</b> each record — no two records can have the same value. ${dup.length ? "Faded rows share a value, so this field can’t tell them apart. Names, forms and ages usually repeat." : "That is why databases give each record an ID."}</p>` + flow(["table", "record = one row", "field = one column", "primary key = unique field"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.key = "StudentID"; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- SQL ---------- */
  function sqlLab(lab) {
    const out = $("[data-sql]", lab), host = $("[data-table]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { pick: ["FirstName", "Score"], f1: "Form", op1: "=", v1: "10A", join: "none", f2: "Score", op2: ">", v2: "60", order: "Score", dir: "DESC", agg: "none" };
    const fx = (f) => FIELDS.findIndex((x) => x[0] === f);
    const lit = (f, v) => (FIELDS[fx(f)][1] === "integer" ? v : FIELDS[fx(f)][1] === "boolean" ? v.toUpperCase() : `'${v}'`);
    const test = (r, f, op, v) => {
      let a = r[fx(f)], b = FIELDS[fx(f)][1] === "integer" ? +v : FIELDS[fx(f)][1] === "boolean" ? v.toUpperCase() === "TRUE" : v;
      return { "=": a === b, "<>": a !== b, ">": a > b, "<": a < b, ">=": a >= b, "<=": a <= b }[op];
    };
    function run() {
      $$("[data-pick]", lab).forEach((b) => b.setAttribute("aria-pressed", String(st.pick.includes(b.dataset.pick))));
      const where = st.join === "none" ? (r) => test(r, st.f1, st.op1, st.v1) : st.join === "AND" ? (r) => test(r, st.f1, st.op1, st.v1) && test(r, st.f2, st.op2, st.v2) : (r) => test(r, st.f1, st.op1, st.v1) || test(r, st.f2, st.op2, st.v2);
      const hasWhere = st.v1 !== "";
      let rowsOut = DATA.filter((r) => !hasWhere || where(r));
      if (st.order !== "none") { const k = fx(st.order); rowsOut = [...rowsOut].sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * (st.dir === "DESC" ? -1 : 1)); }
      const fields = st.pick.length ? st.pick : ["StudentID"];
      const sel = st.agg === "count" ? "COUNT(*)" : st.agg === "sum" ? "SUM(Score)" : fields.join(", ");
      const kw = (t) => `<span class="kw">${t}</span>`;
      let sql = `${kw("SELECT")} ${sel}\n${kw("FROM")} Students`;
      if (hasWhere) sql += `\n${kw("WHERE")} ${st.f1} ${esc(st.op1)} ${esc(lit(st.f1, st.v1))}${st.join !== "none" && st.v2 !== "" ? ` ${kw(st.join)} ${st.f2} ${esc(st.op2)} ${esc(lit(st.f2, st.v2))}` : ""}`;
      if (st.order !== "none" && st.agg === "none") sql += `\n${kw("ORDER BY")} ${st.order} ${st.dir === "DESC" ? kw("DESC") : kw("ASC")}`;
      out.innerHTML = sql + ";";
      // the table: matching rows lit, chosen columns marked
      const picked = new Set(fields.map(fx));
      host.innerHTML = `<table class="qtable"><tr>${FIELDS.map(([f], i) => `<th class="${picked.has(i) && st.agg === "none" ? "pick" : ""}">${f}</th>`).join("")}</tr>${DATA.map((r) => `<tr class="${!hasWhere || where(r) ? "match" : "no"}">${r.map((v, i) => `<td class="${picked.has(i) && st.agg === "none" ? "pick" : ""}">${cell(v)}</td>`).join("")}</tr>`).join("")}</table>`;
      const result = st.agg === "count" ? `<p class="big-read"><span>COUNT</span>${rowsOut.length}</p>` : st.agg === "sum" ? `<p class="big-read"><span>SUM(Score)</span>${rowsOut.reduce((a, r) => a + r[5], 0)}</p>`
        : `<table class="qtable"><tr>${fields.map((f) => `<th>${f}</th>`).join("")}</tr>${rowsOut.map((r) => `<tr>${fields.map((f) => `<td>${cell(r[fx(f)])}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="${fields.length}">no records match</td></tr>`}</table>`;
      res.innerHTML = result;
      exp.innerHTML = chips([[`${rowsOut.length} record${rowsOut.length === 1 ? "" : "s"}`, rowsOut.length ? "up" : "down"]]) +
        `<h3>${st.agg === "count" ? "COUNT counts the matching records" : st.agg === "sum" ? "SUM adds up a numeric field" : "SELECT chooses the fields; WHERE chooses the records"}</h3><p><b>SELECT</b> lists the fields to show, <b>FROM</b> names the table, <b>WHERE</b> gives the condition (with <b>AND</b> both must be true, with <b>OR</b> either), and <b>ORDER BY</b> sorts the results ascending (ASC) or descending (DESC). Text values go in quotes; numbers don’t.</p>` + flow(["FROM which table", "WHERE which records", "SELECT which fields", "ORDER BY how to sort"]);
    }
    $$("[data-pick]", lab).forEach((b) => b.addEventListener("click", () => { const f = b.dataset.pick; st.pick = st.pick.includes(f) ? st.pick.filter((x) => x !== f) : [...st.pick, f].sort((a, c) => fx(a) - fx(c)); run(); }));
    const paint = controls(lab, st, () => { paint(); run(); });
    const DEF = JSON.stringify(st);
    $("[data-reset]", lab).addEventListener("click", () => { st = Object.assign(st, JSON.parse(DEF)); paint(); run(); });
    lab.applyState = (s) => { Object.assign(st, JSON.parse(DEF), s); paint(); run(); };
    paint(); run();
  }

  labs({ keys: keysLab, sql: sqlLab });
})();
