/* ==========================================================================
   stay add. — the standard lesson form (IGCSE Econ Lab form), any subject
   1. Topics: one <section class="topic" data-key> shown at a time; the list
      on the left (.tabs), Previous / Next and "topics opened" follow it.
   2. Step rail: fills with ink as you read.
   3. Interpret chains: <button class="chain" data-set='{…}'> passes its state
      to the lab of the same topic (the lab's own script defines
      lab.applyState) and glides to it.
   4. Long topics: contents buttons (data-goto="id") glide to a section, and
      .checklist[data-check] boxes are remembered on this device.
   Load after core.js and fx.js; the page's own lab script can load before or after.
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const topics = $$(".topic"), tabs = $$(".tabs a");
  if (!topics.length) return;

  /* ---------- 1. Topics, one at a time ---------- */
  const OPENED_KEY = `stayadd-${document.body.dataset.lesson || "lesson"}-opened`;
  let opened = [];
  try { opened = JSON.parse(localStorage.getItem(OPENED_KEY)) || []; } catch (e) { opened = []; }

  function show(key, scroll) {
    const i = Math.max(0, topics.findIndex((t) => t.dataset.key === key));
    topics.forEach((t, k) => (t.hidden = k !== i));
    tabs.forEach((a, k) => (k === i ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    const cur = topics[i].dataset.key;
    if (!opened.includes(cur)) { opened.push(cur); try { localStorage.setItem(OPENED_KEY, JSON.stringify(opened)); } catch (e) { /* storage unavailable */ } }
    $$(".side-steps i").forEach((tick, k) => (tick.className = k === i ? "now" : opened.includes(topics[k]?.dataset.key) ? "done" : ""));
    const count = $(".side-count");
    if (count) count.textContent = `${opened.filter((o) => topics.some((t) => t.dataset.key === o)).length} / ${topics.length}`;
    const prev = topics[i - 1], next = topics[i + 1], pPrev = $("[data-prev]"), pNext = $("[data-next]");
    if (pPrev && pNext) {
      pPrev.hidden = !prev; pNext.hidden = !next;
      if (prev) { pPrev.href = `#${prev.dataset.key}`; pPrev.querySelector("span").textContent = `← ${tabs[i - 1].textContent}`; }
      if (next) { pNext.href = `#${next.dataset.key}`; pNext.querySelector("span").textContent = `${tabs[i + 1].textContent} →`; }
    }
    if (scroll) SA.smoothScroll ? SA.smoothScroll.jump(0) : scrollTo(0, 0);
    paintRail();
  }
  addEventListener("hashchange", () => show(location.hash.slice(1), true));

  /* ---------- 2. Step rail ---------- */
  let railFrame = 0;
  function paintRail() {
    railFrame = 0;
    const line = innerHeight * 0.55;   // the height on screen treated as "the line you are reading"
    $$(".topic:not([hidden]) .step").forEach((step) => {
      const box = step.getBoundingClientRect();
      step.style.setProperty("--read", Math.max(0, Math.min(1, (line - box.top - 34) / (box.height + 30))).toFixed(3));
      step.classList.toggle("reached", box.top + 20 < line);
    });
  }
  const queueRail = () => { if (!railFrame) railFrame = requestAnimationFrame(paintRail); };
  addEventListener("scroll", queueRail, { passive: true });
  addEventListener("resize", queueRail);

  /* ---------- 3. Interpret chains → the lab of the same topic ---------- */
  $$(".chain[data-set]").forEach((btn) => btn.addEventListener("click", () => {
    const lab = btn.closest(".topic").querySelector("[data-lab]");
    if (!lab?.applyState) return;
    lab.applyState(JSON.parse(btn.dataset.set));
    const y = lab.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(lab).scrollMarginTop || 0);
    SA.smoothScroll ? SA.smoothScroll.to(y) : scrollTo({ top: y, behavior: "smooth" });
  }));

  /* ---------- 4. Long topics: in-topic contents and checklists ---------- */
  // contents buttons scroll to a section (they cannot be #links: the hash picks the topic)
  $$("[data-goto]").forEach((btn) => btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.goto);
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(el).scrollMarginTop || 0);
    SA.smoothScroll ? SA.smoothScroll.to(y) : scrollTo({ top: y, behavior: "smooth" });
  }));
  // "I can…" lists: ticks are kept on this device
  const CHECK_KEY = `stayadd-${document.body.dataset.lesson || "lesson"}-checklist`;
  let ticked = [];
  try { ticked = JSON.parse(localStorage.getItem(CHECK_KEY)) || []; } catch (e) { ticked = []; }
  $$(".checklist").forEach((list) => {
    const boxes = $$("input[type=checkbox]", list), count = $(".checklist-h .num", list);
    const paint = () => count && (count.textContent = `${boxes.filter((b) => b.checked).length} / ${boxes.length}`);
    boxes.forEach((box, i) => {
      const id = `${list.dataset.check}-${i}`;
      box.checked = ticked.includes(id);
      box.addEventListener("change", () => {
        ticked = box.checked ? [...new Set([...ticked, id])] : ticked.filter((t) => t !== id);
        try { localStorage.setItem(CHECK_KEY, JSON.stringify(ticked)); } catch (e) { /* storage unavailable */ }
        paint();
      });
    });
    paint();
  });

  show(location.hash.slice(1) || topics[0].dataset.key, false);
})();
