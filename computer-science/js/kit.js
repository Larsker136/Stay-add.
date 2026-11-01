/* ==========================================================================
   stay add. — Computer Science: helpers shared by every lesson's labs
   SA.cs.rows / chips / flow   the Results and "What just happened" markup
   SA.cs.controls(lab, st, cb) wires sliders [data-k], seg buttons
                               [data-k] > button[data-v] and toggles
                               [data-toggle] to the state object; returns paint()
   SA.cs.labs(map)             runs map[mode](lab) for every .lab[data-mode]
   Load before the lesson's own script.
   ========================================================================== */
(function () {
  "use strict";

  const SA = (window.StayAdd = window.StayAdd || {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;

  SA.cs = {
    $, $$, still,
    esc: (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]),
    rows: (list) => list.map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join(""),
    chips: (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`,
    flow: (list) => `<p class="flow">${list.map((t) => `<span>${t}</span>`).join("")}</p>`,
    wait: (ms) => new Promise((r) => setTimeout(r, still ? 0 : ms)),
    controls(lab, st, onChange) {
      $$("input[data-k]", lab).forEach((inp) => inp.addEventListener("input", () => { st[inp.dataset.k] = inp.type === "range" || inp.type === "number" ? +inp.value : inp.value; onChange(inp.dataset.k); }));
      $$("select[data-k]", lab).forEach((sel) => sel.addEventListener("change", () => { st[sel.dataset.k] = isNaN(+sel.value) ? sel.value : +sel.value; onChange(sel.dataset.k); }));
      $$("[data-k] > button[data-v]", lab).forEach((b) => b.addEventListener("click", () => { const v = b.dataset.v; st[b.parentElement.dataset.k] = isNaN(+v) ? v : +v; onChange(b.parentElement.dataset.k); }));
      $$("[data-toggle]", lab).forEach((b) => b.addEventListener("click", () => { st[b.dataset.toggle] = !st[b.dataset.toggle]; onChange(b.dataset.toggle); }));
      return function paint() {
        $$("input[data-k]", lab).forEach((inp) => {
          if (document.activeElement !== inp) inp.value = st[inp.dataset.k];
          if (inp.type === "range") inp.style.setProperty("--pct", `${((st[inp.dataset.k] - inp.min) / (inp.max - inp.min)) * 100}%`);
          const out = $(`[data-out="${inp.dataset.k}"]`, lab); if (out) out.textContent = st[inp.dataset.k];
        });
        $$("select[data-k]", lab).forEach((sel) => (sel.value = st[sel.dataset.k]));
        $$("[data-k] > button[data-v]", lab).forEach((b) => b.setAttribute("aria-pressed", String(String(st[b.parentElement.dataset.k]) === b.dataset.v)));
        $$("[data-toggle]", lab).forEach((b) => b.setAttribute("aria-pressed", String(!!st[b.dataset.toggle])));
      };
    },
    // a loop that ticks only while the lab's topic is on screen
    loop(lab, tick, everyMs = 0) {
      let last = 0;
      (function frame(now) {
        if (!lab.closest(".topic").hidden && now - last >= everyMs) { last = now; tick(); }
        requestAnimationFrame(frame);
      })(0);
    },
    labs(map) { $$("[data-lab]").forEach((lab) => map[lab.dataset.mode]?.(lab)); }
  };
})();
