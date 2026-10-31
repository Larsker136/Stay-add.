// Home page behaviour: reveal on scroll, counters, smooth scrolling, the topic scenes,
// the command-word scale and the daily quiz. Depends on field.js and quiz-data.js being loaded first.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => Math.round(n).toLocaleString("en-GB");

  // ---------- reveal + counters ----------
  const countUp = (el) => {
    const end = +el.dataset.count;
    if (still) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), D = 1400;
    const step = (now) => {
      const p = Math.min((now - t0) / D, 1);
      el.textContent = fmt(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (still) { $$(".rv").forEach((el) => el.classList.add("in")); $$("[data-count]").forEach(countUp); }
  else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.matches("[data-count]")) countUp(e.target);
      io.unobserve(e.target);
    }), { rootMargin: "0px 0px -10% 0px" });
    $$(".rv").forEach((el) => io.observe(el));
  }

  // ---------- smooth scrolling ----------
  // Wheel easing and in-page link gliding are shared by the whole site (assets/js/fx.js).
  const smooth = { to: (y) => (window.StayAdd?.smoothScroll ? StayAdd.smoothScroll.to(y) : scrollTo({ top: y, behavior: still ? "auto" : "smooth" })) };

  // ---------- topic scenes ----------
  if (window.StayField) {
    const sec = $("#scenes");
    StayField.scenes(sec, $("#sceneCanvas"), $$(".scene-card", sec),
      (card) => { $("#sceneCap").textContent = card.dataset.cap; $("#sceneFig").textContent = card.dataset.fig; },
      (name, txt) => {
        const out = $(`.scene-card[data-scene="${name}"] .scene-live`);
        if (out && out.textContent !== txt) out.textContent = txt;
      });
    $$(".scene-index button", sec).forEach((b, i, all) => b.addEventListener("click", () => {
      const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
      smooth.to(scrollY + r.top + span * (i + 0.5) / all.length);
    }));
  }

  // ---------- command-word scale ----------
  const LEVELS = [
    { name: "Recall", words: ["State", "Define", "Name"], marks: 1,
      q: "State the unit of electrical resistance.",
      a: "ohm (Ω)", note: "The word or the symbol is enough. No explanation is wanted, and none earns extra credit." },
    { name: "Describe", words: ["Describe", "Sketch", "Compare"], marks: 2,
      q: "Describe the motion of the car between t = 4 s and t = 10 s.",
      a: "It moves at a constant speed ✓ of 8 m/s ✓.", note: "Say what happens and quote the value from the graph. Do not explain why." },
    { name: "Explain & calculate", words: ["Explain", "Calculate", "Determine"], marks: 3,
      q: "Calculate the distance the car travels in the first 4 s.",
      a: "distance = area under graph ✓ = ½ × 4 × 8 ✓ = 16 m ✓", note: "Write the method, substitute, then give the answer with its unit." },
    { name: "Apply", words: ["Suggest", "Predict", "Deduce"], marks: 2,
      q: "Suggest why a ray entering a glass block along the normal does not change direction.",
      a: "The angle of incidence is 0°, so sin r = 0 and r = 0° ✓; the light still slows down ✓.", note: "Use physics you know in a situation you have not met. Several answers can score." },
  ];
  const cmd = $("#cmd");
  if (cmd) {
    const tabs = $$(".cmd-tab", cmd), card = $("#cmdCard"), pts = $$(".cmd-pt", cmd);
    const show = (i) => {
      const L = LEVELS[i];
      tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
      pts.forEach((p, k) => p.classList.toggle("is-on", k === i));
      cmd.style.setProperty("--cut", `${(3 - i) * 25}%`);
      card.innerHTML = `
        <div class="cmd-q"><p class="eyebrow">Example · ${L.marks} mark${L.marks > 1 ? "s" : ""}</p><p class="cmd-question">${L.q}</p></div>
        <div class="cmd-a"><p class="eyebrow">Full-mark answer</p><p class="cmd-answer">${L.a}</p><p class="cmd-note">${L.note}</p></div>`;
      card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(i));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { const n = (i + d + 4) % 4; show(n); tabs[n].focus(); }
      });
    });
    show(2);
  }

  // ---------- daily quiz ----------
  const quizEl = $("#quiz");
  if (quizEl && window.STAY_QUIZ) {
    const TOPICS = { mech: ["Motion", "--c-mech"], thermal: ["Thermal", "--c-thermal"], waves: ["Waves", "--c-waves"], elec: ["Electricity", "--c-elec"], nuclear: ["Nuclear", "--c-nuclear"], space: ["Space", "--c-space"] };
    const today = new Date(), key = today.toISOString().slice(0, 10);
    // same seed for everyone on the same day
    let seed = +key.replace(/-/g, "");
    const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const set = Object.keys(TOPICS).map((tp) => {
      const pool = STAY_QUIZ.filter((x) => x.topic === tp), item = pool[Math.floor(rnd() * pool.length)];
      const order = shuffle(item.o.map((_, i) => i));
      return { ...item, order };
    });

    const STORE = `stayadd-quiz-${key}`;
    let answers = [];
    try { answers = JSON.parse(localStorage.getItem(STORE)) || []; } catch (e) {}
    const save = () => { try { localStorage.setItem(STORE, JSON.stringify(answers)); } catch (e) {} };
    let idx = Math.min(answers.length, set.length - 1);

    const main = $("#qMain"), ring = $("#qRing"), score = $("#qScore"), dots = $("#qDots");
    $("#qDate").textContent = today.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    const C = 2 * Math.PI * 52;

    const side = () => {
      const right = answers.filter((a, i) => a === set[i].a).length;
      score.textContent = right;
      ring.style.strokeDasharray = `${C * right / set.length} ${C}`;
      dots.innerHTML = set.map((s, i) => {
        const st = answers[i] === undefined ? (i === idx ? "now" : "") : answers[i] === s.a ? "ok" : "no";
        return `<li class="${st}" style="--tc:var(${TOPICS[s.topic][1]})" title="${TOPICS[s.topic][0]}"></li>`;
      }).join("");
    };

    const render = () => {
      side();
      if (answers.length >= set.length) {
        const right = answers.filter((a, i) => a === set[i].a).length;
        main.innerHTML = `<div class="q-done"><p class="eyebrow">Today’s set complete</p>
          <p class="q-done-score display">${right} <span>/ ${set.length}</span></p>
          <p class="q-text-sm">${right === 6 ? "A perfect set." : right >= 4 ? "Solid work. Review the ones you missed below." : "Worth another look — each answer has a short explanation."} A new set appears tomorrow.</p>
          <ol class="q-review">${set.map((s, i) => `<li class="${answers[i] === s.a ? "ok" : "no"}"><span style="--tc:var(${TOPICS[s.topic][1]})">${TOPICS[s.topic][0]}</span>${s.why}</li>`).join("")}</ol>
          <button class="btn btn-ghost btn-sm" id="qAgain">Try today’s set again</button></div>`;
        $("#qAgain").addEventListener("click", () => { answers = []; idx = 0; save(); render(); });
        return;
      }
      const s = set[idx], chosen = answers[idx], done = chosen !== undefined;
      main.innerHTML = `
        <p class="eyebrow q-meta"><span style="color:var(${TOPICS[s.topic][1]})">${TOPICS[s.topic][0]}</span> · Question ${idx + 1} of ${set.length}</p>
        <h3 class="q-text display">${s.q}</h3>
        <ol class="q-opts">${s.order.map((oi, k) => {
          const cls = !done ? "" : oi === s.a ? "right" : oi === chosen ? "wrong" : "dim";
          return `<li><button class="q-opt ${cls}" data-o="${oi}" ${done ? "disabled" : ""}><span class="q-l">${"ABCD"[k]}</span><span>${s.o[oi]}</span></button></li>`;
        }).join("")}</ol>
        <div class="q-foot">${done
          ? `<p class="q-why"><b class="${chosen === s.a ? "ok" : "no"}">${chosen === s.a ? "Correct." : "Not quite."}</b> ${s.why}</p><button class="btn btn-primary btn-sm" id="qNext">${idx === set.length - 1 ? "See results" : "Next question"} <span class="arr">→</span></button>`
          : `<p class="q-hint">Choose an answer</p>`}</div>`;
      $$(".q-opt", main).forEach((b) => b.addEventListener("click", () => { answers[idx] = +b.dataset.o; save(); render(); }));
      const next = $("#qNext", main);
      if (next) next.addEventListener("click", () => { idx++; render(); });
    };
    render();
  }
})();
