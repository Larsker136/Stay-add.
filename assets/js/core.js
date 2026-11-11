/* ==========================================================================
   stay add. — core
   Shared behaviour for every page of every subject: icons, header/footer,
   theme, the subject menu, search, topic lists, scroll reveals and quizzes.
   (The STEM home's own parts live in landing.js.)
   Pages set <body data-root="../" data-subject="chemistry" data-page="..."
   data-lesson="..."> so links resolve from any folder depth and the header
   knows which subject it is in. The STEM home has no data-subject.
   ========================================================================== */
(function () {
  "use strict";

  const SA = (window.StayAdd = window.StayAdd || {});
  const root = document.body.dataset.root || "";
  const page = document.body.dataset.page || "";
  const subjectId = document.body.dataset.subject || "";
  SA.url = (path) => root + path;

  /* ---------- Icons (24×24 stroke set) ---------- */
  const ICONS = {
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    book: '<path d="M2 5.5C4 4.5 7 4.3 12 6c5-1.7 8-1.5 10-.5V19c-2-1-5-1.2-10 .5C7 17.8 4 18 2 19z"/><path d="M12 6v13.5"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7 15h10"/>',
    thermometer: '<path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0z"/><path d="M12 10v7"/>',
    gauge: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
    dots: '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="12" cy="13" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    spark: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    play: '<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    restart: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    pin: '<path d="M12 17v5M8 3h8l-1 7 3 3v2H6v-2l3-3z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    scale: '<path d="M12 3v18M6 21h12M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M11 9l-2 3h4l-2 3"/>',
    flame: '<path d="M12 3c1 3 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
    drop: '<path d="M12 3s7 7.5 7 12a7 7 0 0 1-14 0c0-4.5 7-12 7-12z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    leaf: '<path d="M5 19c0-9 6-15 15-15 0 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
    hexagon: '<path d="M12 2.5l8.5 5v9L12 21.5l-8.5-5v-9z"/><circle cx="12" cy="12" r="3.5"/>',
    beaker: '<path d="M6 3h12M7 3v15a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V3"/><path d="M7 12h10"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.01"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
    home: '<path d="M4 11l8-6.5 8 6.5v8a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>'
  };
  SA.icon = (name, cls = "") =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  function hydrateIcons(scope = document) {
    scope.querySelectorAll("i[data-icon]").forEach((el) => {
      el.outerHTML = SA.icon(el.dataset.icon, el.className);
    });
  }
  SA.hydrateIcons = hydrateIcons;

  /* ---------- Theme ----------
     Follows the system setting until the reader picks one; the choice is shared
     by every subject. The head of each page applies it before paint. */
  const THEME_KEY = "stayadd-theme";
  const darkQuery = matchMedia("(prefers-color-scheme: dark)");
  SA.theme = () => document.documentElement.dataset.theme || (darkQuery.matches ? "dark" : "light");
  const themeChanged = () => {
    document.dispatchEvent(new CustomEvent("sa:themechange", { detail: SA.theme() }));
    document.dispatchEvent(new Event("themechange"));   // physics figures listen for this name
  };
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
    themeChanged();
  }
  darkQuery.addEventListener?.("change", () => { if (!document.documentElement.dataset.theme) themeChanged(); });
  SA.cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /* ---------- Catalog helpers ---------- */
  SA.allLessons = () => {
    const out = [];
    (SA.catalog?.subjects || []).forEach((s) =>
      s.topics.forEach((t) => t.lessons.forEach((l) => out.push({ ...l, topic: t, subject: s })))
    );
    return out;
  };
  SA.subjects = () => SA.catalog?.subjects || [];
  SA.subject = (id = subjectId) => SA.subjects().find((s) => s.id === id) || null;

  /* ---------- Progress (this browser only) ----------
     { [lessonId]: { visited, quiz: "4/5", at } } — lesson pages mark themselves
     via <body data-lesson="...">; quizzes record their score when finished. */
  const PROGRESS_KEY = "stayadd-progress";
  SA.progress = {
    all() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch (e) { return {}; } },
    get(id) { return this.all()[id] || null; },
    mark(id, patch) {
      const all = this.all();
      all[id] = { ...all[id], ...patch, at: Date.now() };
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch (e) { /* storage unavailable */ }
    },
    reset() { try { localStorage.removeItem(PROGRESS_KEY); } catch (e) { /* storage unavailable */ } }
  };
  const lessonId = document.body.dataset.lesson;
  if (lessonId) SA.progress.mark(lessonId, { visited: true });

  /* ---------- Memory: what this learner actually knows (this browser only) ----------
     One record, localStorage["stayadd-memory"]:
       { v: 1,
         items:   { "card:<lesson>/<topic>/<hash>": { box, due, n, miss, at },
                    "calc:<lesson>/<topic>/<id>", "plan:<lesson>/<topic>/plan": the same shape },
         lessons: { "<lesson>": { topics: ["key", …], cards: { key: count } } } }
     items   — every flashcard the learner has marked. Boxes 1–5 are spaced
               reviews: "I knew it" moves a card up one box only when it is due
               (so knowing it twice in one sitting counts once); "Still
               learning" sends it back to box 1. Box n comes back after
               INTERVAL[n] days, at the start of that day.
     lessons — noted by lesson pages, so a subject home knows each lesson's
               subtopics and card counts without loading them.
     topicState(lesson, topic) reads this plus the lesson's own keys
     (stayadd-<lesson>-opened, -cards) and gives one of:
       new → opened (topic shown) → practised (a full flashcard run)
       → secure (80% of its cards in box 2 or higher) → fading (secure, with
       cards due again). */
  const MEMORY_KEY = "stayadd-memory";
  const DAY = 864e5, INTERVAL = [0, 1, 3, 7, 16, 35], SECURE_BOX = 2, SECURE_SHARE = 0.8;
  const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; } };
  const dayStart = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
  let memo = null, byTopic = null;   // the parsed record, and its items grouped by "lesson/topic"
  const fresh = () => ({ v: 1, items: {}, lessons: {} });
  const load = () => {
    if (!memo) { memo = readJSON(MEMORY_KEY, null); if (!memo || memo.v !== 1) memo = fresh(); memo.items ||= {}; memo.lessons ||= {}; }
    return memo;
  };
  const store = () => { byTopic = null; try { localStorage.setItem(MEMORY_KEY, JSON.stringify(memo)); } catch (e) { /* storage unavailable */ } };
  addEventListener("storage", (e) => { if (e.key === MEMORY_KEY || e.key === null) { memo = null; byTopic = null; } });   // another tab wrote it
  const grouped = () => {
    if (!byTopic) {
      byTopic = {};
      Object.entries(load().items).forEach(([id, it]) => {
        if (!id.startsWith("card:")) return;   // topic states count flashcards; calc: and plan: items are kept for review
        const where = id.slice(id.indexOf(":") + 1, id.lastIndexOf("/"));
        (byTopic[where] ||= []).push(it);
      });
    }
    return byTopic;
  };
  // FNV-1a: a short, stable id for a card from its question text
  const hash = (text) => { let h = 0x811c9dc5; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  const sameList = (a, b) => !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);

  SA.memory = {
    cardId: (lesson, topic, question) => `card:${lesson}/${topic}/${hash(question)}`,
    item: (id) => load().items[id] || null,

    // the learner marked an item: ok = "I knew it"
    review(id, ok, now = Date.now()) {
      const m = load(), it = m.items[id] || { box: 0, due: 0, n: 0, miss: 0 };
      if (!ok) { it.box = 1; it.miss += 1; it.due = dayStart(now) + INTERVAL[1] * DAY; }
      else if (it.box === 0 || now >= it.due) { it.box = Math.min(it.box + 1, INTERVAL.length - 1); it.due = dayStart(now) + INTERVAL[it.box] * DAY; }
      it.n += 1; it.at = now;
      m.items[id] = it;
      store();
      return it;
    },

    // lesson pages note their subtopics and how many cards each has
    noteTopics(lesson, keys) {
      const m = load(), rec = (m.lessons[lesson] ||= {});
      if (sameList(rec.topics, keys)) return;
      rec.topics = keys.slice();
      store();
    },
    noteCards(lesson, topic, count) {
      const m = load(), rec = (m.lessons[lesson] ||= {}), cards = (rec.cards ||= {});
      if (cards[topic] === count) return;
      cards[topic] = count;
      store();
    },
    lessonTopics: (lesson) => load().lessons[lesson]?.topics || null,

    topicState(lesson, topic, now = Date.now()) {
      const items = grouped()[`${lesson}/${topic}`] || [];
      const total = load().lessons[lesson]?.cards?.[topic] || 0;
      const strong = items.filter((it) => it.box >= SECURE_BOX).length;
      const due = items.filter((it) => it.box > 0 && now >= it.due).length;
      const opened = readJSON(`stayadd-${lesson}-opened`, []).includes(topic);
      const runs = readJSON(`stayadd-${lesson}-cards`, {});
      const practised = [topic, `${topic}:explain`, `${topic}:all`].some((k) => runs[k]);
      const state = total && strong >= total * SECURE_SHARE ? (due ? "fading" : "secure")
        : practised ? "practised" : opened ? "opened" : "new";
      return { state, total, strong, due };
    },

    // forget one subject's lessons (the "Reset" on its home), leaving other subjects alone
    forget(lessons) {
      const m = load(), set = new Set(lessons);
      Object.keys(m.items).forEach((id) => { if (set.has(id.slice(id.indexOf(":") + 1).split("/")[0])) delete m.items[id]; });
      lessons.forEach((l) => {
        delete m.lessons[l];
        ["opened", "cards", "checklist"].forEach((k) => { try { localStorage.removeItem(`stayadd-${l}-${k}`); } catch (e) { /* storage unavailable */ } });
      });
      store();
      const all = SA.progress.all();
      lessons.forEach((l) => delete all[l]);
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch (e) { /* storage unavailable */ }
    }
  };

  /* ---------- Header & footer ---------- */
  const MOON = '<svg class="moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  const SUN = '<svg class="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function renderHeader() {
    const el = document.querySelector("[data-site-header]");
    if (!el) return;
    // "Skip to content": the first stop for keyboard and screen-reader users
    const main = document.querySelector("main");
    if (main) {
      main.id ||= "main";
      el.insertAdjacentHTML("beforebegin", `<a class="skip-link" href="#${main.id}">Skip to content</a>`);
    }
    const subject = SA.subject(), current = document.body.dataset.lesson;
    // inside a subject: its own links; on the STEM home: one link per subject
    const links = subject ? subject.nav : SA.subjects().map((s) => ({ id: s.id, label: s.name, href: s.home }));
    const isCurrent = (l) => !!current && l.id === current;
    el.className = "nav on-dark";
    el.innerHTML = `
      <div class="wrap nav-in">
        <div class="brand">
          <a class="logo" href="${SA.url(subject ? subject.home : "index.html")}" aria-label="stay add. ${subject ? subject.name + " home" : "home"}">Stay add<span>.</span></a>
          ${subject ? `<a class="brand-sub" href="${SA.url(subject.home)}">${subject.name}</a>` : ""}
        </div>
        <nav class="links" aria-label="Main">
          ${links.map((l) => `<a href="${SA.url(l.href)}"${isCurrent(l) ? ' aria-current="page"' : ""}>${l.label}</a>`).join("")}
        </nav>
        <div class="nav-r">
          <div class="search" data-search>
            <label class="search-field">
              ${SA.icon("search")}
              <input type="search" placeholder="Search concepts" aria-label="Search all subjects" autocomplete="off">
              <kbd>/</kbd>
            </label>
            <div class="search-results" role="listbox"></div>
          </div>
          <button class="icon-btn theme" type="button" aria-label="Switch theme">${MOON}${SUN}</button>
        </div>
      </div>`;
    const themeBtn = el.querySelector(".theme");
    const label = () => themeBtn.setAttribute("aria-label", SA.theme() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    label();
    themeBtn.addEventListener("click", () => { setTheme(SA.theme() === "dark" ? "light" : "dark"); label(); });
    initSearch(el.querySelector("[data-search]"));

    // the Menu button: choose a subject
    if (SA.StaggeredMenu) {
      const lives = SA.allLessons().filter((l) => l.status === "live");
      const pick = lives.find((l) => l.subject.id === subjectId && l.id !== current) || lives.find((l) => l.id !== current);
      SA.StaggeredMenu({
        mount: el.querySelector(".nav-r"),
        position: "right",
        title: "Subjects",
        colors: ["var(--bg-2)", "var(--line-2)"],   // paper tones sweep in before the panel
        items: [
          ...SA.subjects().map((s) => ({ label: s.name, hint: s.hint, ariaLabel: `Go to ${s.name}`, link: SA.url(s.home), current: s.id === subjectId }))
        ],
        home: { label: "Home", hint: "stay add. · all subjects", link: SA.url("index.html"), current: !subjectId },
        feature: pick ? { eyebrow: `Live lesson · ${pick.subject.name}`, live: true, title: pick.title, text: pick.blurb, link: SA.url(pick.href) } : null
      });
    }
  }

  function renderFooter() {
    const el = document.querySelector("[data-site-footer]");
    if (!el) return;
    el.className = "footer on-dark";
    el.innerHTML = `
      <div class="wrap foot">
        <a class="logo" href="${SA.url("index.html")}">Stay add<span>.</span></a>
        <p>Stay addicted, keep adding · Not affiliated with Cambridge International</p>
        <nav aria-label="Footer">
          ${SA.subjects().map((s) => `<a href="${SA.url(s.home)}">${s.name}</a>`).join("")}
          <a href="${SA.url("index.html")}">All subjects</a>
        </nav>
      </div>`;
  }

  /* ---------- Search ---------- */
  function initSearch(box) {
    const input = box.querySelector("input");
    const results = box.querySelector(".search-results");
    const field = box.querySelector(".search-field");
    const index = [];
    (SA.catalog?.subjects || []).forEach((s) =>
      s.topics.forEach((t) => {
        t.lessons.forEach((l) =>
          index.push({ title: l.title, sub: `${s.name} · ${t.title}`, href: l.href, live: l.status === "live", icon: t.icon, text: [l.title, l.blurb, t.title, ...(l.tags || [])].join(" ") })
        );
        index.push({ title: t.title, sub: `${s.name} · Topic ${t.num}`, href: t.lessons[0]?.href, live: t.lessons.some((l) => l.status === "live"), icon: t.icon, text: `${t.title} ${t.blurb}` });
      })
    );

    let active = -1;
    function render() {
      const q = input.value.trim().toLowerCase();
      if (!q) { box.classList.remove("is-open"); return; }
      const hits = index.filter((i) => i.text.toLowerCase().includes(q)).slice(0, 8);
      active = -1;
      results.innerHTML = hits.length
        ? hits.map((h) => `
            <a class="search-item" href="${h.live && h.href ? SA.url(h.href) : "#"}" ${h.live ? "" : 'aria-disabled="true"'}>
              <span><b>${h.title}</b><small>${h.sub}</small></span>
              <span class="status${h.live ? "" : " paused"}">${h.live ? "Live" : "Soon"}</span>
            </a>`).join("")
        : `<div class="search-empty">No matches yet — more topics are on the way.</div>`;
      box.classList.add("is-open");
    }
    // is-active: the field is in use (on phones it unfolds from an icon into a bar)
    const close = () => box.classList.remove("is-open", "is-active");
    input.addEventListener("input", render);
    input.addEventListener("focus", () => { box.classList.add("is-active"); render(); });
    box.addEventListener("focusout", (e) => { if (e.relatedTarget && !box.contains(e.relatedTarget)) close(); });
    field.addEventListener("click", () => { box.classList.add("is-open"); input.focus(); });
    input.addEventListener("keydown", (e) => {
      const items = [...results.querySelectorAll(".search-item")];
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle("is-active", i === active));
      } else if (e.key === "Enter" && items[Math.max(active, 0)]) {
        items[Math.max(active, 0)].click();
      } else if (e.key === "Escape") {
        input.blur(); close();
      }
    });
    results.addEventListener("click", (e) => {
      const a = e.target.closest('[aria-disabled="true"]');
      if (a) e.preventDefault();
    });
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    document.documentElement.classList.add("js");
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Quiz ----------
     Markup: [data-quiz] > [data-q] > .q-options > button[data-correct?] + .q-why
  */
  function initQuizzes() {
    document.querySelectorAll("[data-quiz]").forEach((quiz) => {
      const qs = [...quiz.querySelectorAll("[data-q]")];
      const scoreEl = document.querySelector(quiz.dataset.quizScore || "[data-quiz-score]");
      let answered = 0, correct = 0;
      const updateScore = () => {
        if (!scoreEl) return;
        scoreEl.innerHTML = answered === qs.length
          ? `You scored <b>${correct} / ${qs.length}</b> — ${correct === qs.length ? "perfect. Stay addicted." : "review the explanations and try the lab again."}`
          : `Answered <b>${answered} / ${qs.length}</b>`;
      };
      qs.forEach((q, qi) => {
        q.querySelector(".q-num") && (q.querySelector(".q-num").textContent = `Question ${qi + 1}`);
        const opts = [...q.querySelectorAll(".q-options button")];
        opts.forEach((b, i) => {
          b.dataset.key = String.fromCharCode(65 + i);
          b.addEventListener("click", () => {
            if (q.classList.contains("is-answered")) return;
            q.classList.add("is-answered");
            const ok = b.hasAttribute("data-correct");
            b.classList.add(ok ? "is-correct" : "is-wrong");
            opts.forEach((o) => { o.disabled = true; if (o.hasAttribute("data-correct")) o.classList.add("is-correct"); });
            answered++; if (ok) correct++;
            updateScore();
            if (answered === qs.length && lessonId) SA.progress.mark(lessonId, { quiz: `${correct}/${qs.length}` });
          });
        });
      });
      updateScore();
    });
  }

  /* ---------- Web app ----------
     sw.js (at the site root) caches the site so it installs as an app and opens
     offline. Service workers only run over https:// or localhost, not file://. */
  function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    addEventListener("load", () => navigator.serviceWorker.register(SA.url("sw.js")).catch(() => { /* the site still works online */ }));
  }

  /* ---------- Boot ---------- */
  renderHeader();
  renderFooter();
  hydrateIcons();
  initReveal();
  initQuizzes();
  registerServiceWorker();
})();
