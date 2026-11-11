/* ==========================================================================
   stay add. — parts every subject home shares
   1. Every lab   [data-lab-index]: reads each live lesson page of the subject
                  and lists its labs ([data-lab] .lab-title), grouped by topic;
                  each links straight to its subtopic. A lesson page with no
                  labs and no figure plates is itself a lab (collision theory,
                  refraction). Loaded when the section comes near the screen.
   2. Syllabus map [data-universe]: the topics as stars on a 1000 × 600 plane
                  (positions and links: catalog subject.map), lit by what
                  this learner knows (SA.memory, SA.progress).
   Load after catalog.js and core.js.
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const subject = SA.subject && SA.subject();
  if (!subject) return;
  const progress = SA.progress ? SA.progress.all() : {};
  const live = (t) => t.lessons.filter((l) => l.status === "live");

  /* ---------- 1. Every lab ---------- */
  function initLabIndex() {
    const el = $("[data-lab-index]");
    if (!el) return;
    const count = $("[data-lab-count]");
    let started = false;
    async function load() {
      if (started) return;
      started = true;
      const parser = new DOMParser();
      const pages = subject.topics.flatMap((t) => live(t).map((l) => ({ t, l })));
      const found = await Promise.all(pages.map(async ({ t, l }) => {
        let doc;
        try { doc = parser.parseFromString(await fetch(SA.url(l.href)).then((r) => (r.ok ? r.text() : "")), "text/html"); } catch (e) { return { t, labs: [] }; }
        const labs = $$("[data-lab] .lab-title", doc).map((p) => {
          const key = p.closest(".topic[data-key]")?.dataset.key || "", tab = key && $(`.tabs a[href="#${key}"]`, doc);
          const num = tab?.dataset.full?.split(" · ")[0] || "";
          return { fig: p.dataset.fig || "", title: p.textContent.trim(), href: SA.url(l.href) + (key ? `#${key}` : ""), sub: tab ? `${num} ${tab.textContent.trim()}`.trim() : l.title };
        });
        if (!labs.length && !doc.querySelector(".plate")) labs.push({ fig: "", title: l.title, href: SA.url(l.href), sub: "a whole-page lab" });
        return { t, labs };
      }));
      const byTopic = new Map();
      found.forEach(({ t, labs }) => { if (labs.length) byTopic.set(t, [...(byTopic.get(t) || []), ...labs]); });
      const total = [...byTopic.values()].reduce((n, ls) => n + ls.length, 0);
      if (count) count.textContent = total;
      el.innerHTML = [...byTopic].map(([t, labs]) => `
        <section class="li-topic">
          <h3><span class="num">${String(t.num).padStart(2, "0")}</span>${t.title}</h3>
          <ul>${labs.map((x) => `<li><a href="${x.href}"><span class="fig">${x.fig ? `Fig. ${x.fig}` : "Lab"}</span><b>${x.title}</b><small>${x.sub}</small></a></li>`).join("")}</ul>
        </section>`).join("") || `<p class="li-loading">No labs yet.</p>`;
    }
    el.innerHTML = `<p class="li-loading">Gathering the labs from every lesson…</p>`;
    if (location.hash === "#labs" || !("IntersectionObserver" in window)) load();
    else new IntersectionObserver(([en], io) => { if (en.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: "900px 0px" }).observe(el);
    addEventListener("hashchange", () => { if (location.hash === "#labs") load(); });
  }

  /* ---------- 2. Syllabus map ----------
     A star's state comes from the learner's memory (SA.memory in core.js),
     built up from its lessons' subtopics:
       ready     not started (the lesson is live)
       opened    a subtopic has been opened
       practised a subtopic's flashcards have been run through
       secure    every subtopic secure: most of its cards still known days later
       fading    secure, with cards due to be seen again
     The old quiz score (collision theory) still counts as practised. */
  const RANK = { soon: -1, ready: 0, opened: 1, practised: 2, fading: 3, secure: 4 };
  const STATE = {
    soon: ["Coming soon", ""],
    ready: ["Not started", "lesson live"],
    opened: ["Opened", "lesson opened"],
    practised: ["Practised", "flashcards finished"],
    fading: ["Due for review", "secure, cards to see again"],
    secure: ["Secure", "cards still known days later"]
  };
  const secureish = (s) => s === "secure" || s === "fading";

  function lessonState(l) {
    const keys = SA.memory?.lessonTopics(l.id) || [];
    const topics = keys.map((key) => ({ key, ...SA.memory.topicState(l.id, key) }));
    const quiz = !!progress[l.id]?.quiz, visited = !!progress[l.id]?.visited;
    const state = topics.length && topics.every((t) => secureish(t.state)) ? (topics.some((t) => t.state === "fading") ? "fading" : "secure")
      : quiz || topics.some((t) => RANK[t.state] >= RANK.practised) ? "practised"
      : visited || topics.some((t) => t.state !== "new") ? "opened" : "ready";
    return { l, state, topics, due: topics.reduce((n, t) => n + t.due, 0), practised: topics.filter((t) => RANK[t.state] >= RANK.practised).length };
  }

  function initMap() {
    const el = $("[data-universe]");
    if (!el || !subject.map) return;
    const { pos: POS, links: LINKS } = subject.map;

    const nodes = subject.topics.map((t) => {
      const ls = live(t).map(lessonState);
      const state = !ls.length ? "soon"
        : ls.every((x) => secureish(x.state)) ? (ls.some((x) => x.state === "fading") ? "fading" : "secure")
        : ls.some((x) => RANK[x.state] >= RANK.practised) ? "practised"
        : ls.some((x) => x.state === "opened") ? "opened" : "ready";
      return { ...t, live: ls.map((x) => x.l), lessons: ls, state, x: POS[t.num][0], y: POS[t.num][1] };
    });
    const byNum = Object.fromEntries(nodes.map((n) => [n.num, n]));
    const lit = (n) => RANK[n.state] >= RANK.opened;
    const mark = (s) => s === "ready" ? '<circle class="ring" r="15"/><circle class="core" r="8"/>'
      : s === "opened" ? '<circle class="core" r="8"/><circle class="dot" r="3"/>'
      : s === "practised" ? '<circle class="core" r="8"/><path class="half" d="M0-8A8 8 0 0 0 0 8z"/>'
      : secureish(s) ? '<circle class="orbit" r="14"/><circle class="core" r="8"/>'
      : '<circle class="core" r="6"/>';

    let grid = "";
    for (let x = 50; x < 1000; x += 50) grid += `M${x} 0V600`;
    for (let y = 50; y < 600; y += 50) grid += `M0 ${y}H1000`;
    el.innerHTML = `
      <svg class="fig sky-map" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of IGCSE ${subject.name} topics and how they connect">
        <path class="gl" d="${grid}"/>
        ${LINKS.map(([a, b]) => {
          const A = byNum[a], B = byNum[b], cls = lit(A) && lit(B) ? "lit" : lit(A) || lit(B) ? "path" : "";
          return `<line class="sky-link ${cls}" x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"/>`;
        }).join("")}
        ${nodes.map((n) => {
          const href = n.live[0] ? SA.url(n.live[0].href) : null;
          const right = n.x > 800;
          const open = href ? `<a href="${href}"` : `<g tabindex="0"`, close = href ? "</a>" : "</g>";
          return `${open} class="sky-star is-${n.state}" data-num="${n.num}" transform="translate(${n.x} ${n.y})" aria-label="Topic ${n.num}: ${n.title} — ${STATE[n.state][0]}">
              <circle class="hit" r="26"/>
              ${mark(n.state)}
              <text x="${right ? -16 : 16}" y="5" text-anchor="${right ? "end" : "start"}">${n.title}</text>
            ${close}`;
        }).join("")}
      </svg>
      <div class="sky-tip" role="tooltip" hidden></div>`;

    const tip = $(".sky-tip", el);
    const lessonLine = (x) => {
      const bits = [STATE[x.state][0]];
      if (x.topics.length) bits.push(`${x.practised} / ${x.topics.length} subtopics practised`);
      if (x.due) bits.push(`${x.due} card${x.due === 1 ? "" : "s"} due`);
      return `<span class="tip-lesson">${SA.icon ? SA.icon(RANK[x.state] >= RANK.practised ? "check" : "arrowRight") : ""}<span>${x.l.title}<small>${bits.join(" · ")}</small></span></span>`;
    };
    function showTip(node) {
      const n = byNum[node.dataset.num];
      const box = el.getBoundingClientRect(), r = node.querySelector(".core").getBoundingClientRect();
      tip.innerHTML = `
        <span class="tip-num">Topic ${String(n.num).padStart(2, "0")} · <span class="tip-state is-${n.state}">${STATE[n.state][0]}</span></span>
        <b>${n.title}</b>
        <p>${n.blurb}</p>
        ${n.lessons.map(lessonLine).join("")}`;
      tip.hidden = false;
      const x = r.left + r.width / 2 - box.left, y = r.top - box.top;
      tip.style.left = `${clamp(x, 128, box.width - 128)}px`;
      tip.style.top = `${y}px`;
      tip.classList.toggle("is-below", y < 170);
    }
    $$(".sky-star", el).forEach((n) => {
      n.addEventListener("pointerenter", () => showTip(n));
      n.addEventListener("focus", () => showTip(n));
      n.addEventListener("pointerleave", () => (tip.hidden = true));
      n.addEventListener("blur", () => (tip.hidden = true));
    });

    // side panel: the legend (only the states this subject can show), the count, what to do next
    const legend = $(".map-legend");
    if (legend) {
      const shown = ["secure", "fading", "practised", "opened", "ready"].concat(nodes.some((n) => n.state === "soon") ? ["soon"] : []);
      legend.innerHTML = shown.map((s) => `<li><i class="lg lg-${s}"></i>${STATE[s][0]}${STATE[s][1] ? `<small>${STATE[s][1]}</small>` : ""}</li>`).join("");
    }
    const litCount = nodes.filter(lit).length;
    $("[data-uni-lit]").textContent = litCount;
    $("[data-uni-total]").textContent = nodes.length;
    $("[data-uni-bar]").innerHTML = nodes.map((n) => `<i class="${RANK[n.state] >= RANK.practised ? "done" : n.state === "opened" ? "now" : ""}"></i>`).join("");

    // next: cards due come first, then the first lesson not yet opened
    const due = nodes.flatMap((n) => n.lessons.flatMap((x) => x.topics.filter((t) => t.due).map((t) => ({ n, l: x.l, t })))).sort((a, b) => b.t.due - a.t.due)[0];
    const fresh = nodes.flatMap((n) => n.lessons.filter((x) => x.state === "ready").map((x) => ({ n, l: x.l })))[0];
    $("[data-uni-next]").innerHTML = due
      ? `<p class="eyebrow">Due for review</p><b>${due.l.title}</b><p>Topic ${due.n.num} · ${due.t.due} card${due.t.due === 1 ? " is" : "s are"} ready to see again. Run its flashcards to keep this star secure.</p>
         <a class="btn btn-primary btn-sm" href="${SA.url(due.l.href)}#${due.t.key}">Review the cards <span class="arr" aria-hidden="true">→</span></a>`
      : fresh
      ? `<p class="eyebrow">Next</p><b>${fresh.l.title}</b><p>Topic ${fresh.n.num} · ${fresh.n.title}. Open it to light up this star.</p>
         <a class="btn btn-primary btn-sm" href="${SA.url(fresh.l.href)}">Open the lesson <span class="arr" aria-hidden="true">→</span></a>`
      : `<p class="eyebrow">Every lesson opened</p><b>Make each star secure</b><p>Finish a topic's flashcards, then come back in a few days: the cards you still know fill in its star.</p>`;

    const reset = $("[data-uni-reset]");
    reset.hidden = !litCount;
    reset.textContent = `Reset my ${subject.name} progress`;
    reset.addEventListener("click", () => {
      if (!confirm(`Reset your ${subject.name} progress on this device? Opened topics, flashcard scores, checklists and the cards you have learned will be cleared. This cannot be undone.`)) return;
      const ids = subject.topics.flatMap((t) => t.lessons.map((l) => l.id));
      if (SA.memory) SA.memory.forget(ids); else SA.progress.reset();
      location.reload();
    });
  }

  initLabIndex();
  initMap();
})();
