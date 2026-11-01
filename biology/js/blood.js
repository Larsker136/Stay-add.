/* ==========================================================================
   stay add. — Transport in animals: the clotting lab
   (Topics, the step rail and the Interpret chains are the shared lesson form
   in assets/js/lesson.js.)
   A small blood vessel under the skin, drawn in SVG, with red cells, platelets
   and dissolved fibrinogen flowing through it. Step through six stages:
   flow → cut → platelets stick → fibrinogen to fibrin → cells trapped → scab.
   A switch removes a clotting factor, so fibrin never forms.
   The lab exposes lab.applyState({ stage, noFactor }).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = (list) => list.map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  const chips = (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`;
  const flow = (list) => `<p class="flow">${list.map((t) => `<span>${t}</span>`).join("")}</p>`;
  const el = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

  const STAGES = [
    { name: "Normal flow", text: "Red blood cells, platelets and dissolved <b>fibrinogen</b> (a soluble plasma protein) flow along the vessel. Nothing clots — fibrinogen stays dissolved." },
    { name: "Skin and vessel cut", text: "The wound breaks the skin and the vessel wall. Blood escapes — and pathogens could now get in." },
    { name: "Platelets stick", text: "<b>Platelets</b> touch the damaged wall, stick to it and to each other, and release chemicals that start a chain of reactions." },
    { name: "Fibrinogen → fibrin", text: "The chemicals convert soluble <b>fibrinogen</b> into insoluble <b>fibrin</b>: long threads that form a mesh across the wound." },
    { name: "Cells trapped: a clot", text: "The fibrin mesh traps <b>red blood cells</b>. The plug of cells and threads is a <b>clot</b>, and blood loss stops." },
    { name: "Scab, then repair", text: "The clot dries and hardens into a <b>scab</b>, sealing the wound against pathogens while new skin grows underneath." }
  ];

  function clotLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const VT = 150, VB = 222, GX0 = 296, GX1 = 344, SKIN = 70;   // vessel top/bottom, wound gap, skin surface
    let st = { stage: 0, noFactor: false }, cells = [], plt = [], fib = [], threads = [], lost = 0, t = 0, auto = 0;

    svg.innerHTML = `
      <rect class="f cp lt" x="10" y="${SKIN - 46}" width="620" height="46"/>
      <rect class="f cp" x="10" y="${SKIN}" width="620" height="${VT - SKIN - 6}" style="--fm:7%"/>
      <text x="22" y="${SKIN - 26}">skin</text><text x="22" y="${VT - 18}">tissue</text>
      <rect class="f cr lt" x="10" y="${VT}" width="620" height="${VB - VT}"/>
      <path class="l cr w5" data-wall d="M10 ${VT}H630M10 ${VB}H630"/>
      <path class="f cr dk no-s" data-pool/>
      <g data-wound></g>
      <g data-threads></g>
      <g data-move></g>
      <path class="f no-s" data-scab style="fill:#6b3a26;opacity:0;transition:opacity 1.2s"/>
      <text x="630" y="${VB + 22}" text-anchor="end">blood flow →</text>
      <text x="320" y="${SKIN - 52}" text-anchor="middle" class="k" data-cap></text>`;
    const move = $("[data-move]", svg), woundG = $("[data-wound]", svg), thrG = $("[data-threads]", svg);

    function spawn(kind) {
      const y = VT + 8 + Math.random() * (VB - VT - 16);
      const o = { kind, x: -10 - Math.random() * 600, y, vx: 1 + Math.random() * 0.6, state: "flow" };
      if (kind === "rbc") o.e = el("ellipse", { rx: 9, ry: 5.5, class: "f cr dk" });
      else if (kind === "plt") o.e = el("ellipse", { rx: 3.5, ry: 2.5, class: "f ca dk" });
      else o.e = el("path", { d: "M-3 0H3", class: "l cv" });
      move.appendChild(o.e); return o;
    }
    function build() {
      move.innerHTML = ""; thrG.innerHTML = ""; threads = []; lost = 0; t = 0;
      cells = Array.from({ length: 34 }, () => spawn("rbc")); plt = Array.from({ length: 22 }, () => spawn("plt")); fib = Array.from({ length: 30 }, () => spawn("fib"));
      [...cells, ...plt, ...fib].forEach((o) => (o.x = Math.random() * 640));
    }
    function drawStatic() {
      const cut = st.stage >= 1;
      $("[data-wall]", svg).setAttribute("d", cut ? `M10 ${VT}H${GX0}M${GX1} ${VT}H630M10 ${VB}H630` : `M10 ${VT}H630M10 ${VB}H630`);
      woundG.innerHTML = cut ? `<path class="f lt no-s" d="M${GX0 - 10} ${SKIN - 46}L${GX0} ${VT}H${GX1}L${GX1 + 10} ${SKIN - 46}Z" style="fill:var(--paper)"/><path class="l cr" d="M${GX0 - 10} ${SKIN - 46}L${GX0} ${VT}M${GX1} ${VT}L${GX1 + 10} ${SKIN - 46}"/>` : "";
      $("[data-scab]", svg).setAttribute("d", `M${GX0 - 12} ${SKIN - 52}Q320 ${SKIN - 64} ${GX1 + 12} ${SKIN - 52}L${GX1 + 8} ${SKIN - 30}H${GX0 - 8}Z`);
      $("[data-scab]", svg).style.opacity = st.stage >= 5 && !st.noFactor ? 1 : 0;
      $("[data-cap]", svg).textContent = `${st.stage + 1} · ${STAGES[st.stage].name}`;
    }
    const sealed = () => !st.noFactor && st.stage >= 4;
    const inWound = (o) => o.x > GX0 - 6 && o.x < GX1 + 6;
    function step() {
      t++;
      const cut = st.stage >= 1, sticky = st.stage >= 2, fibrin = st.stage >= 3 && !st.noFactor;
      // fibrin threads grow across the wound
      if (fibrin && threads.length < (st.stage >= 4 ? 26 : 16) && t % 6 === 0) {
        const y1 = SKIN - 30 + Math.random() * (VT - SKIN + 34), y2 = y1 + (Math.random() - 0.5) * 50;
        const p = el("path", { d: `M${GX0 - 4 + Math.random() * 6} ${y1}L${GX1 + 4 - Math.random() * 6} ${y2}`, class: "l cv", style: "opacity:.85" });
        thrG.appendChild(p); threads.push(p);
      }
      const leak = cut && !sealed() ? 1 - Math.min(0.85, threads.length / 40) : 0;
      for (const o of [...cells, ...plt, ...fib]) {
        if (o.state === "stuck") continue;
        if (o.state === "out") {
          o.y -= 1.4; o.x += (Math.random() - 0.5) * 1.5;
          if (fibrin && o.kind === "rbc" && o.y < VT && st.stage >= 4) { o.state = "stuck"; continue; }
          if (o.y < SKIN - 46) { o.state = "flow"; o.x = -20; o.y = VT + 8 + Math.random() * (VB - VT - 16); if (o.kind === "rbc") lost++; }
          continue;
        }
        o.x += o.vx * (sealed() && inWound(o) && o.y < VT + 14 ? 0.3 : 1);
        if (o.x > 650) { o.x = -20; o.y = VT + 8 + Math.random() * (VB - VT - 16); }
        if (cut && inWound(o) && o.y < VT + 16) {
          if (o.kind === "plt" && sticky && Math.random() < 0.5) { o.state = "stuck"; o.y = VT - 4 - Math.random() * 30; o.x = GX0 + Math.random() * (GX1 - GX0); continue; }
          if (o.kind === "fib" && fibrin) { o.x = -20; continue; }   // turned into a thread
          if (Math.random() < 0.08 * leak) o.state = "out";
        }
      }
    }
    function draw() {
      for (const o of [...cells, ...plt, ...fib]) o.e.setAttribute("transform", `translate(${o.x.toFixed(1)} ${o.y.toFixed(1)})`);
      const outN = cells.filter((o) => o.state === "out").length;
      $("[data-pool]", svg).setAttribute("d", st.stage >= 1 && !sealed() ? `M${GX0 - 40} ${SKIN - 46}Q320 ${SKIN - 46 - Math.min(14, 4 + lost / 4)} ${GX1 + 40} ${SKIN - 46}Z` : "");
      if (t % 15 === 0) results(outN);
    }
    function results(outN = 0) {
      const stuckP = plt.filter((o) => o.state === "stuck").length, trapped = cells.filter((o) => o.state === "stuck").length;
      res.innerHTML = rows([["stage", `${st.stage + 1} of 6`], ["red cells lost", lost], ["platelets at the wound", stuckP], ["fibrin threads", threads.length], ["red cells trapped", trapped]]);
    }
    function explain() {
      const s = STAGES[st.stage];
      let head = chips([[`Stage ${st.stage + 1}`], [s.name, st.stage >= 4 ? "up" : st.stage >= 1 ? "warn" : ""]]), body = `<h3>${s.name}</h3><p>${s.text}</p>`;
      if (st.noFactor && st.stage >= 3) {
        head = chips([[`Stage ${st.stage + 1}`], ["No fibrin", "down"]]);
        body = `<h3>No clotting factor: bleeding continues</h3><p>The platelets still gather, but without a clotting factor <b>fibrinogen is never converted to fibrin</b>. With no mesh, red cells are not trapped and blood keeps escaping. This is what happens in haemophilia.</p>`;
      }
      exp.innerHTML = head + body + flow(["wound", "platelets", "fibrinogen (soluble) → fibrin (insoluble)", "mesh traps red cells", "clot → scab"]);
    }
    function setStage(n) {
      const prev = st.stage; st.stage = Math.max(0, Math.min(5, n));
      if (st.stage < prev) { build(); }                         // going back: start the flow fresh
      paint(); drawStatic(); explain(); results();
    }
    function paint() {
      $$("[data-stage]", lab).forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.stage === st.stage)));
      $("[data-toggle]", lab).setAttribute("aria-pressed", String(st.noFactor));
      $("[data-prev]", lab).disabled = st.stage === 0; $("[data-next]", lab).disabled = st.stage === 5;
    }
    $$("[data-stage]", lab).forEach((b) => b.addEventListener("click", () => { stopAuto(); setStage(+b.dataset.stage); }));
    $("[data-next]", lab).addEventListener("click", () => { stopAuto(); setStage(st.stage + 1); });
    $("[data-prev]", lab).addEventListener("click", () => { stopAuto(); setStage(st.stage - 1); });
    $("[data-toggle]", lab).addEventListener("click", () => { st.noFactor = !st.noFactor; thrG.innerHTML = ""; threads = []; cells.forEach((o) => o.state === "stuck" && (o.state = "out")); paint(); drawStatic(); explain(); });
    const playBtn = $("[data-play]", lab);
    function stopAuto() { clearInterval(auto); auto = 0; playBtn.textContent = "Play all stages"; }
    playBtn.addEventListener("click", () => {
      if (auto) return stopAuto();
      setStage(0); playBtn.textContent = "Pause";
      auto = setInterval(() => { if (st.stage >= 5) return stopAuto(); setStage(st.stage + 1); }, 3200);
    });
    $("[data-reset]", lab).addEventListener("click", () => { stopAuto(); st = { stage: 0, noFactor: false }; build(); setStage(0); });
    lab.applyState = (s) => { stopAuto(); if (s.noFactor !== undefined) st.noFactor = s.noFactor; build(); st.stage = 0; setStage(s.stage ?? 0); };

    build(); setStage(0);
    if (still) { st.stage = 4; drawStatic(); for (let i = 0; i < 600; i++) step(); draw(); explain(); results(); paint(); return; }
    (function frame() { if (!lab.closest(".topic").hidden) { step(); draw(); } requestAnimationFrame(frame); })();
  }

  $$("[data-lab]").forEach((lab) => lab.dataset.mode === "clot" && clotLab(lab));
})();
