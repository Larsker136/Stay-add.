/* ==========================================================================
   stay add. — exam practice inside the lesson form, any subject
   Two blocks, added to the topics that have data for them:

   1. Calculate it (end of step 3, before the checklist)
      Exam-style calculations with new numbers every time. Type an answer:
      it is checked to about 1% (or exactly, for text answers like binary);
      a wrong answer that matches a common mistake says which mistake.
      "Show working" lists the steps, and on a graph question draws the
      method on the graph (the gradient triangle, the shaded area, the line
      read across to the axis). Graph questions are "Read the graph" ones.
   2. Plan it (end of step 2, after the lab or figure)
      The practical behind the topic, as the Alternative to Practical paper
      asks it: which variable you change, which you measure, which you keep
      the same, then one question on errors or improvements.

   Data: each subject's js/drills.js
     StayAdd.drills[lesson][topic] = [{
       id, title,                     short name of the question type
       v: ({ r, p }) => ({…}),        the numbers: r(min, max, step), p([choices])
       q: (v) => "question (HTML)",
       a: (v) => number | "text",     the answer
       unit, sf = 3, tol = 0.01,      unit shown after the box; display s.f.; relative tolerance
       steps: (v, a) => ["…"],        the working
       traps: (v) => [[value, "what went wrong"]],
       check: (typed, v) => true | false | "what went wrong",   optional: checks a text answer itself
       graph: (v) => ({ x: {label, max, step, minor?}, y: {…}, lines: [{ pts, tc }] }),   minor: finer gridlines
       show: (v) => ({ tri: [[x1,y1],[x2,y2]], area: [[x,y]…], read: [[x,y]…] })
     }]
     StayAdd.plans[lesson][topic] = {
       title, setup,
       iv: { a, x: [wrong…], why }, dv: { a, x, why },
       cv: { a: [right…], x: [wrong…], why },   pick two
       more: [{ q, a, x: [wrong…], why }]
     }
   Results go to the learner's memory (SA.memory in core.js) as
   calc:<lesson>/<topic>/<id> and plan:<lesson>/<topic>/plan items.
   Load after core.js and the subject's js/drills.js.
   ========================================================================== */
(function () {
  "use strict";

  const SA = (window.StayAdd = window.StayAdd || {});
  const lessonId = document.body.dataset.lesson;
  const drills = (SA.drills || {})[lessonId] || {}, plans = (SA.plans || {})[lessonId] || {};
  if (!lessonId) return;

  /* ---------- helpers ---------- */
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const button = (cls, html) => { const b = el("button", cls, html); b.type = "button"; return b; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const decimals = (x) => (String(x).split(".")[1] || "").length;
  const rand = {
    r: (min, max, step = 1) => { const n = Math.floor(Math.random() * (Math.round((max - min) / step) + 1)); return +(min + n * step).toFixed(decimals(step)); },
    p: (list) => list[Math.floor(Math.random() * list.length)]
  };
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  // a number as an answer is written: 3 s.f., standard form when very big or small
  function fmt(n, sf = 3) {
    if (typeof n !== "number") return String(n);
    if (n === 0) return "0";
    const s = Number(n.toPrecision(sf));
    if (Math.abs(s) >= 1e6 || Math.abs(s) < 1e-3) {
      const [m, e] = s.toExponential(sf - 1).split("e");
      return `${Number(m)} × 10${String(+e).split("").map((c) => SUP[c]).join("")}`;
    }
    return String(s);
  }
  SA.fmt = fmt;
  // what the learner typed, as a number: "3.2e5", "3.2 × 10^5", "3.2x10⁵", "1,200", "−4"
  function parse(text) {
    let t = String(text).trim().replace(/[−–]/g, "-").replace(/,(?=\d{3}\b)/g, "").replace(/\s+/g, "");
    t = t.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) => "^" + m.split("").map((c) => Object.keys(SUP).find((k) => SUP[k] === c)).join(""));
    const m = t.match(/^(-?\d*\.?\d+)(?:(?:[×x*]10\^?(-?\d+))|(?:e(-?\d+)))?/i);
    if (!m) return NaN;
    return parseFloat(m[1]) * Math.pow(10, +(m[2] || m[3] || 0));
  }
  const close = (x, a, tol) => Math.abs(x - a) <= Math.max(Math.abs(a) * tol, 1e-12) || fmt(x) === fmt(a);
  // text answers: case, spaces and subscript digits don't matter (CH₂ = ch2)
  const norm = (s) => String(s).replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080)).toUpperCase().replace(/\s+/g, "");

  const host = (topic, n) => [...topic.querySelectorAll(":scope > .step")].find((s) => s.querySelector(".step-n")?.textContent.trim() === String(n));

  /* ---------- graphs ---------- */
  const G = { w: 520, h: 300, l: 58, r: 500, t: 22, b: 246 };
  function graph(spec) {
    const sx = (x) => G.l + (x / spec.x.max) * (G.r - G.l), sy = (y) => G.b - (y / spec.y.max) * (G.b - G.t);
    const ticks = (ax, f) => { const out = []; for (let v = 0; v <= ax.max + 1e-9; v += ax.step) out.push(f(+v.toFixed(6))); return out.join(""); };
    // gridlines every `minor` (when given) so values can be read between the labelled ticks
    const fine = (ax) => ({ max: ax.max, step: ax.minor || ax.step });
    const grid = ticks(fine(spec.x), (v) => `M${sx(v)} ${G.t}V${G.b}`) + ticks(fine(spec.y), (v) => `M${G.l} ${sy(v)}H${G.r}`);
    const svg = `
      <svg class="fig drill-g" viewBox="0 0 ${G.w} ${G.h}" role="img" aria-label="Graph of ${spec.y.label} against ${spec.x.label}">
        <path class="gl" d="${grid}"/>
        <path class="ax" d="M${G.l} ${G.t - 8}V${G.b}H${G.r + 8}"/>
        ${ticks(spec.x, (v) => `<text x="${sx(v)}" y="${G.b + 16}" text-anchor="middle">${v}</text>`)}
        ${ticks(spec.y, (v) => `<text x="${G.l - 8}" y="${sy(v) + 3.5}" text-anchor="end">${v}</text>`)}
        <text x="${(G.l + G.r) / 2}" y="${G.h - 6}" text-anchor="middle" class="lbl-ink">${spec.x.label}</text>
        <text x="16" y="${(G.t + G.b) / 2}" text-anchor="middle" class="lbl-ink" transform="rotate(-90 16 ${(G.t + G.b) / 2})">${spec.y.label}</text>
        ${spec.lines.map((ln) => `<polyline class="plot" style="--tc:${ln.tc || "var(--ink)"}" points="${ln.pts.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(" ")}"/>`).join("")}
        <g class="drill-show"></g>
      </svg>`;
    return { svg, sx, sy };
  }
  function drawShow(svg, g, show) {
    const layer = svg.querySelector(".drill-show"), { sx, sy } = g;
    let out = "";
    if (show.area) out += `<polygon class="area" points="${show.area.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")}"/>`;
    if (show.tri) {
      const [[x1, y1], [x2, y2]] = show.tri;
      out += `<path class="drill-tri" d="M${sx(x1)} ${sy(y1)}H${sx(x2)}V${sy(y2)}"/>`;
      // just above the triangle's base, so it never sits on the axis numbers
      out += `<text x="${(sx(x1) + sx(x2)) / 2}" y="${sy(y1) - 7}" text-anchor="middle" class="lbl-ink drill-dl">Δx = ${fmt(x2 - x1)}</text>`;
      out += `<text x="${sx(x2) + 6}" y="${(sy(y1) + sy(y2)) / 2}" class="lbl-ink">Δy = ${fmt(y2 - y1)}</text>`;
    }
    (show.read || []).forEach(([x, y]) => {
      out += `<path class="guide" d="M${sx(x)} ${G.b}V${sy(y)}H${G.l}"/><circle class="pt" cx="${sx(x)}" cy="${sy(y)}" r="4"/>`;
    });
    layer.innerHTML = out;
  }

  /* ---------- 1. Calculate it ---------- */
  function buildDrill(topic, key, list) {
    const step = host(topic, 3);
    if (!step) return;
    const box = el("section", "drill");
    box.setAttribute("aria-label", "Calculate it: exam-style questions");
    const head = el("div", "drill-h", `<p class="drill-t">Calculate it <span>New numbers every time</span></p>`);
    const tally = el("span", "num drill-tally");
    head.append(tally);
    const types = el("div", "deck-modes drill-types");
    types.setAttribute("role", "group");
    types.setAttribute("aria-label", "Question type");
    const card = el("div", "drill-card");
    const fig = el("div", "drill-fig");
    const qn = el("p", "drill-n num");
    const q = el("p", "drill-q");
    const form = el("form", "drill-ans");
    const id = `drill-${key}-in`;
    form.innerHTML = `<label class="drill-lbl" for="${id}">Your answer</label><span class="drill-field"><input id="${id}" autocomplete="off" spellcheck="false"><span class="drill-unit"></span></span><button class="btn btn-ink btn-sm" type="submit">Check</button>`;
    const input = form.querySelector("input"), unitEl = form.querySelector(".drill-unit");
    const fb = el("p", "drill-fb");
    fb.setAttribute("aria-live", "polite");
    const work = el("ol", "drill-steps");
    work.hidden = true;
    const acts = el("div", "drill-acts");
    const showBtn = button("btn btn-ghost btn-sm", "Show working");
    const newBtn = button("btn btn-ghost btn-sm", "New numbers");
    acts.append(showBtn, newBtn);
    card.append(fig, qn, q, form, fb, work, acts);
    box.append(head, types, card);
    const before = step.querySelector(".interpret .checklist") || null;
    (before ? before.parentNode : step.querySelector(".interpret") || step).insertBefore(box, before);

    let t = 0, v = null, ans = null, g = null, checked = false, right = 0, tried = 0;
    const typeBtns = list.map((tpl, i) => {
      const b = button("deck-mode", tpl.title);
      b.addEventListener("click", () => { if (i !== t) { t = i; fresh(); } });
      types.append(b);
      return b;
    });
    if (list.length < 2) types.hidden = true;

    function fresh() {
      const tpl = list[t];
      v = tpl.v ? tpl.v(rand) : {};
      ans = tpl.a(v);
      checked = false;
      typeBtns.forEach((b, i) => b.setAttribute("aria-pressed", String(i === t)));
      qn.textContent = `${tpl.graph ? "Read the graph" : "Question"} · ${tpl.title}`;
      q.innerHTML = tpl.q(v);
      if (tpl.graph) { g = graph(tpl.graph(v)); fig.innerHTML = g.svg; fig.hidden = false; } else { g = null; fig.innerHTML = ""; fig.hidden = true; }
      const unit = typeof tpl.unit === "function" ? tpl.unit(v) : tpl.unit || "";
      unitEl.innerHTML = unit;
      unitEl.hidden = !unit;
      input.value = "";
      input.inputMode = typeof ans === "number" ? "decimal" : "text";
      input.setAttribute("aria-label", `Your answer${unit ? ` in ${unitEl.textContent}` : ""}`);
      fb.className = "drill-fb";
      fb.textContent = "";
      work.hidden = true;
      work.innerHTML = "";
      showBtn.hidden = false;
    }

    function showWorking() {
      const tpl = list[t];
      work.innerHTML = (tpl.steps ? tpl.steps(v, ans) : []).map((s) => `<li>${s}</li>`).join("") + `<li class="drill-final">Answer: <b>${fmt(ans, tpl.sf)}${unitEl.textContent ? " " + unitEl.innerHTML : ""}</b></li>`;
      work.hidden = false;
      showBtn.hidden = true;
      if (g && tpl.show) drawShow(fig.querySelector("svg"), g, tpl.show(v));
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const tpl = list[t], typed = input.value.trim();
      if (!typed) { input.focus(); return; }
      let ok, why = "";
      if (tpl.check) {
        // the question checks itself (binary with or without leading zeros, hex in either case…)
        const res = tpl.check(typed, v);
        ok = res === true;
        if (typeof res === "string") why = res;
      } else if (typeof ans === "number") {
        const x = parse(typed);
        if (Number.isNaN(x)) { fb.className = "drill-fb is-wrong"; fb.textContent = "Type a number, such as 4.5 or 3.2 × 10^5."; return; }
        ok = close(x, ans, tpl.tol ?? 0.01);
        if (!ok) { const trap = (tpl.traps ? tpl.traps(v) : []).find(([val]) => close(x, val, tpl.tol ?? 0.01)); if (trap) why = trap[1]; }
      } else ok = norm(typed) === norm(ans);
      if (!checked) {
        checked = true; tried++; if (ok) right++;
        SA.memory?.review(`calc:${lessonId}/${key}/${tpl.id}`, ok);
        tally.textContent = `${right} / ${tried} right`;
      }
      fb.className = `drill-fb ${ok ? "is-right" : "is-wrong"}`;
      fb.textContent = ok ? `Right — ${fmt(ans, tpl.sf)}${unitEl.textContent ? " " + unitEl.textContent : ""}.` : why ? `Not quite. ${why}` : "Not quite. Try again, or show the working.";
      if (ok) showWorking();
    });
    showBtn.addEventListener("click", showWorking);
    newBtn.addEventListener("click", () => { fresh(); input.focus({ preventScroll: true }); });
    fresh();
  }

  /* ---------- 2. Plan it ---------- */
  function buildPlan(topic, key, plan) {
    const step = host(topic, 2);
    if (!step) return;
    const box = el("section", "plan");
    box.setAttribute("aria-label", "Plan it: the practical");
    const head = el("div", "drill-h", `<p class="drill-t">Plan it <span>The practical, as Paper 6 asks it</span></p>`);
    const tally = el("span", "num drill-tally");
    head.append(tally);
    const lede = el("p", "plan-lede", `<b>${plan.title}.</b> ${plan.setup}`);
    const ol = el("ol", "plan-qs");
    box.append(head, lede, ol);
    step.append(box);

    const qs = [
      { q: "Which variable do you <b>change</b>? (the independent variable)", ...plan.iv },
      { q: "Which variable do you <b>measure</b>? (the dependent variable)", ...plan.dv },
      { q: "Choose <b>two</b> variables you must keep the same (control variables).", ...plan.cv, multi: true },
      ...(plan.more || [])
    ];
    let done = 0, firstTime = 0;
    const paint = () => (tally.textContent = `${firstTime} / ${qs.length}${done === qs.length ? " first time" : ""}`);
    const finish = (ok) => {
      done++; if (ok) firstTime++;
      paint();
      if (done === qs.length) SA.memory?.review(`plan:${lessonId}/${key}/plan`, firstTime === qs.length);
    };
    qs.forEach((item) => {
      const li = el("li", "plan-q");
      li.append(el("p", "plan-ask", item.q));
      const opts = el("div", "opts");
      const why = el("p", "plan-why", item.why || "");
      why.hidden = true;
      const right = [].concat(item.a);
      const choices = shuffle([...right, ...item.x]).map((txt) => {
        const b = button("opt", txt);
        b.dataset.right = String(right.includes(txt));
        opts.append(b);
        return b;
      });
      const reveal = () => {
        choices.forEach((b) => { b.disabled = true; if (b.dataset.right === "true") b.classList.add("is-right"); });
        why.hidden = !item.why;
      };
      if (item.multi) {
        const picked = new Set();
        choices.forEach((b) => b.addEventListener("click", () => {
          b.classList.toggle("is-picked");
          b.setAttribute("aria-pressed", String(b.classList.contains("is-picked")));
          b.classList.contains("is-picked") ? picked.add(b) : picked.delete(b);
          if (picked.size < 2) return;
          const ok = [...picked].every((p) => p.dataset.right === "true");
          picked.forEach((p) => p.classList.add(p.dataset.right === "true" ? "is-right" : "is-wrong"));
          choices.forEach((c) => c.classList.remove("is-picked"));
          reveal();
          finish(ok);
        }));
      } else {
        choices.forEach((b) => b.addEventListener("click", () => {
          const ok = b.dataset.right === "true";
          if (!ok) b.classList.add("is-wrong");
          reveal();
          finish(ok);
        }));
      }
      li.append(opts, why);
      ol.append(li);
    });
    paint();
  }

  document.querySelectorAll(".topic[data-key]").forEach((topic) => {
    const key = topic.dataset.key;
    if (plans[key]) buildPlan(topic, key, plans[key]);
    if (drills[key]?.length) buildDrill(topic, key, drills[key]);
  });
})();
