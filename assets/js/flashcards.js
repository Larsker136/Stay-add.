/* ==========================================================================
   stay add. — flashcards at the end of every topic, any subject
   Each <section class="topic" data-key> of a lesson gets a last step,
   "04 Flashcards": one card at a time, question first.
     - two decks per topic: Key facts (recall) and Explain it (harder: why,
       predict, calculate, spot the mistake) — or All of them together
     - flip a card: click it, Space or Enter
     - mark it: "Still learning" (1) or "I knew it" (2) — then the next card
       you have not marked comes up
     - Previous / Next (← / →) move between cards without marking them
   At the end: the score, the cards still to learn, and a button to go
   through only those again. The last score per topic and deck is kept on
   this device, and so is the deck you chose. Every mark also goes to the
   learner's memory (SA.memory in core.js), card by card, which spaces the
   reviews and lights the subject's syllabus map.

   The cards live in each subject's js/cards.js (Key facts) and
   js/cards-explain.js (Explain it):
     StayAdd.cards[lesson][topic]        = [["question", "answer"], …]
     StayAdd.explainCards[lesson][topic] = [["question", "answer"], …]
   (lesson = <body data-lesson>, topic = <section data-key>)
   Load after core.js and the subject's card files, before or after lesson.js.
   ========================================================================== */
(function () {
  "use strict";

  const SA = (window.StayAdd = window.StayAdd || {});
  const lessonId = document.body.dataset.lesson;
  const facts = (SA.cards || {})[lessonId] || {};
  const explain = (SA.explainCards || {})[lessonId] || {};

  const STORE_KEY = `stayadd-${lessonId}-cards`;
  const MODE_KEY = "stayadd-cards-mode";
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { saved = {}; }
  const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(saved)); } catch (e) { /* storage unavailable */ } };
  let preferred = "facts";
  try { preferred = localStorage.getItem(MODE_KEY) || "facts"; } catch (e) { /* storage unavailable */ }
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  const MODES = [
    { id: "facts", label: "Key facts" },
    { id: "explain", label: "Explain it" },
    { id: "all", label: "All" }
  ];

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const button = (cls, text) => { const b = el("button", cls, text); b.type = "button"; return b; };
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  document.querySelectorAll(".topic[data-key]").forEach((topic) => {
    const key = topic.dataset.key;
    const decks = {
      facts: (facts[key] || []).map(([q, a]) => ({ q, a, kind: "Key fact" })),
      explain: (explain[key] || []).map(([q, a]) => ({ q, a, kind: "Explain it" }))
    };
    decks.all = [...decks.facts, ...decks.explain];
    // every card gets a stable id, so the learner's memory (SA.memory in core.js) can follow it
    decks.all.forEach((c) => (c.id = SA.memory ? SA.memory.cardId(lessonId, key, c.q) : null));
    if (SA.memory && decks.all.length) SA.memory.noteCards(lessonId, key, decks.all.length);
    if (decks.all.length) build(topic, key, decks);
  });

  function build(topic, key, decks) {
    const modes = MODES.filter((m) => decks[m.id].length);
    let mode = modes.some((m) => m.id === preferred) ? preferred : modes[0].id;
    const scoreKey = () => (mode === "facts" ? key : `${key}:${mode}`);

    /* ---------- markup ---------- */
    const step = el("div", "step step-cards");
    step.id = `cards-${key}`;
    const head = el("div", "step-h");
    head.innerHTML = `<span class="step-n">4</span><div><h2>Flashcards</h2><p></p></div>`;
    const sub = head.querySelector("p");
    const paintSub = () => {
      const last = saved[scoreKey()], n = decks[mode].length;
      sub.textContent = last ? `${n} cards · last time you knew ${last.known} / ${last.total}` : `${n} cards · check what you just studied`;
    };

    const deck = el("div", "deck");
    deck.tabIndex = 0;
    deck.setAttribute("aria-label", "Flashcards. Space flips the card; 1: still learning; 2: I knew it; left and right arrows: previous and next card.");

    // deck switch: Key facts · Explain it · All
    const switcher = el("div", "deck-modes");
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "Which cards");
    const modeBtns = modes.length > 1 ? modes.map((m) => {
      const b = button("deck-mode");
      b.dataset.mode = m.id;
      b.append(document.createTextNode(m.label), el("span", "num", String(decks[m.id].length)));
      b.addEventListener("click", () => { if (m.id !== mode) setMode(m.id); });
      switcher.append(b);
      return b;
    }) : [];
    if (!modeBtns.length) switcher.hidden = true;

    const bar = el("div", "deck-bar");
    const count = el("span", "num deck-count");
    const tally = el("span", "num deck-tally");
    const shuffleBtn = button("deck-link", "Shuffle");
    bar.append(count, tally, shuffleBtn);

    const meter = el("div", "deck-meter");
    meter.setAttribute("aria-hidden", "true");

    const card = button("fcard");
    const inner = el("span", "fcard-in");
    const front = el("span", "fcard-face fcard-front");
    const back = el("span", "fcard-face fcard-back");
    const qKind = el("span", "fcard-k"), qText = el("span", "fcard-t");
    const aKind = el("span", "fcard-k", "Answer"), aText = el("span", "fcard-t");
    const qHint = el("span", "fcard-hint", "Tap to see the answer");
    front.append(qKind, qText, qHint);
    back.append(aKind, aText);
    inner.append(front, back);
    card.append(inner);

    const actions = el("div", "deck-actions");
    const reveal = button("btn btn-ink", "Show answer");
    const again = button("btn btn-ghost", "Still learning");
    const knew = button("btn btn-primary", "I knew it");
    again.insertAdjacentHTML("afterbegin", '<kbd aria-hidden="true">1</kbd>');
    knew.insertAdjacentHTML("afterbegin", '<kbd aria-hidden="true">2</kbd>');
    actions.append(reveal, again, knew);

    const nav = el("div", "deck-nav");
    const prevBtn = button("btn btn-ghost btn-sm deck-prev");
    prevBtn.innerHTML = '<span aria-hidden="true">←</span> Previous';
    const navMark = el("span", "num deck-mark");
    const nextBtn = button("btn btn-ghost btn-sm deck-next");
    nextBtn.innerHTML = 'Next <span aria-hidden="true">→</span>';
    nav.append(prevBtn, navMark, nextBtn);

    const done = el("div", "deck-done");
    done.hidden = true;
    const live = el("p", "sr-only");
    live.setAttribute("aria-live", "polite");

    deck.append(switcher, bar, meter, card, actions, nav, done, live);
    step.append(head, deck);
    topic.append(step);

    /* ---------- state ---------- */
    let queue = [], marks = [], pos = 0, flipped = false, fullRun = true;
    const known = () => queue.filter((c, i) => marks[i] === true);
    const missed = () => queue.filter((c, i) => marks[i] === false);

    function setMode(id) {
      mode = id;
      try { localStorage.setItem(MODE_KEY, id); } catch (e) { /* storage unavailable */ }
      modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
      paintSub();
      start(decks[mode].slice(), true);
    }

    function start(list, full) {
      queue = list; marks = list.map(() => null); pos = 0; fullRun = full;
      meter.replaceChildren(...queue.map(() => el("i")));
      done.hidden = true;
      [bar, meter, card, actions, nav].forEach((n) => (n.hidden = false));
      shuffleBtn.hidden = list.length < 2;
      showCard();
    }

    function showCard() {
      const c = queue[pos];
      flip(false, true);
      qKind.textContent = mode === "all" ? `Question · ${c.kind}` : "Question";
      qText.textContent = c.q;
      aText.textContent = c.a;
      count.textContent = `Card ${pos + 1} / ${queue.length}`;
      tally.textContent = `${known().length} known · ${missed().length} learning`;
      [...meter.children].forEach((m, i) => {
        m.className = marks[i] === true ? "ok" : marks[i] === false ? "miss" : "";
        if (i === pos) m.classList.add("now");
      });
      prevBtn.disabled = pos === 0;
      nextBtn.disabled = pos === queue.length - 1;
      navMark.textContent = marks[pos] === true ? "marked: knew it" : marks[pos] === false ? "marked: still learning" : "";
      if (!reduced.matches) { card.classList.remove("enter"); void card.offsetWidth; card.classList.add("enter"); }
    }

    function flip(on, instant) {
      flipped = on;
      card.classList.toggle("instant", !!instant || reduced.matches);
      card.classList.toggle("flipped", on);
      card.setAttribute("aria-label", on ? `Answer: ${queue[pos].a}` : `Question: ${queue[pos].q}. Press to see the answer.`);
      reveal.hidden = on;
      again.hidden = knew.hidden = !on;
      if (on) live.textContent = `Answer: ${queue[pos].a}`;
    }

    function go(i) {
      if (i < 0 || i >= queue.length || i === pos) return;
      pos = i;
      showCard();
    }

    function mark(gotIt) {
      if (!flipped) return;
      marks[pos] = gotIt;
      if (queue[pos].id) SA.memory.review(queue[pos].id, gotIt);
      // the next card not yet marked, looking forward first, then from the start
      const order = [...queue.keys()].slice(pos + 1).concat([...queue.keys()].slice(0, pos));
      const next = order.find((i) => marks[i] === null);
      if (next === undefined) finish();
      else { pos = next; showCard(); }
    }

    function finish() {
      [bar, meter, card, actions, nav].forEach((n) => (n.hidden = true));
      const k = known(), m = missed();
      if (fullRun) { saved[scoreKey()] = { known: k.length, total: queue.length, at: Date.now() }; save(); paintSub(); }

      done.replaceChildren();
      const score = el("p", "deck-score");
      score.append(el("b", "num", `${k.length} / ${queue.length}`), document.createTextNode(m.length ? " known" : " known — every card"));
      const nextDeck = mode === "facts" && decks.explain.length ? " Ready for the harder Explain it cards?" : "";
      const msg = el("p", "deck-msg",
        !m.length ? (fullRun ? `You have this topic.${nextDeck || " Come back in a few days to keep it."}` : "All the cards you were learning are now known.")
          : m.length === queue.length ? "Read the Understand step once more, then try the cards again."
          : `Still learning ${m.length === 1 ? "this card" : `these ${m.length} cards`}:`);
      done.append(score, msg);
      if (m.length && m.length < queue.length) {
        const list = el("ol", "deck-missed");
        m.forEach((c) => list.append(el("li", null, c.q)));
        done.append(list);
      }
      const row = el("div", "deck-actions");
      if (m.length) {
        const retry = button("btn btn-primary", m.length === 1 ? "Review the card I missed" : `Review the ${m.length} I missed`);
        retry.addEventListener("click", () => { start(shuffle(m), false); deck.focus({ preventScroll: true }); });
        row.append(retry);
      } else if (nextDeck && fullRun) {
        const onward = button("btn btn-primary", "Try Explain it");
        onward.addEventListener("click", () => { setMode("explain"); deck.focus({ preventScroll: true }); });
        row.append(onward);
      }
      const restart = button("btn btn-ghost", "Start again with all cards");
      restart.addEventListener("click", () => { start(decks[mode].slice(), true); deck.focus({ preventScroll: true }); });
      row.append(restart);
      done.append(row);
      done.hidden = false;
      live.textContent = `Finished: ${k.length} of ${queue.length} known.`;
    }

    /* ---------- input ---------- */
    card.addEventListener("click", () => flip(!flipped));
    reveal.addEventListener("click", () => { flip(true); card.focus({ preventScroll: true }); });
    again.addEventListener("click", () => mark(false));
    knew.addEventListener("click", () => mark(true));
    prevBtn.addEventListener("click", () => go(pos - 1));
    nextBtn.addEventListener("click", () => go(pos + 1));
    shuffleBtn.addEventListener("click", () => start(shuffle(decks[mode]), true));
    deck.addEventListener("keydown", (e) => {
      if (!done.hidden || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target !== deck && e.target !== card) return;   // let the buttons handle their own keys
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(!flipped); }
      else if (e.key === "1") { e.preventDefault(); mark(false); }
      else if (e.key === "2") { e.preventDefault(); mark(true); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(pos - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(pos + 1); }
    });

    modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    paintSub();
    start(decks[mode].slice(), true);
  }
})();
