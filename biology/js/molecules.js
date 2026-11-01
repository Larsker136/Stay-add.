/* ==========================================================================
   stay add. — Biological molecules: the food test bench
   (Topics, the step rail and the Interpret chains are the shared lesson form
   in assets/js/lesson.js.)
   Pick a food and a reagent, add it, then heat (Benedict's), pour into water
   (ethanol emulsion) or add drop by drop (DCPIP). Every finished test is
   written into the notebook; a mystery sample is drawn at random each reset.
   The lab exposes lab.applyState({ sample, reagent }).
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chips = (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`;
  const flow = (list) => `<p class="flow">${list.map((t) => `<span>${t}</span>`).join("")}</p>`;
  const wait = (ms) => new Promise((r) => setTimeout(r, still ? 0 : ms));

  // what each food contains: reducing sugar on a 0–3 scale (how far Benedict's goes)
  const FOODS = {
    glucose: { name: "Glucose solution", starch: 0, sugar: 3, protein: 0, fat: 0, vitc: 0 },
    starch: { name: "Starch suspension", starch: 1, sugar: 0, protein: 0, fat: 0, vitc: 0 },
    egg: { name: "Egg white", starch: 0, sugar: 0, protein: 1, fat: 0, vitc: 0 },
    oil: { name: "Vegetable oil", starch: 0, sugar: 0, protein: 0, fat: 1, vitc: 0 },
    juice: { name: "Orange juice", starch: 0, sugar: 2, protein: 0, fat: 0, vitc: 1 },
    milk: { name: "Milk", starch: 0, sugar: 1, protein: 1, fat: 1, vitc: 0 },
    sucrose: { name: "Sucrose solution", starch: 0, sugar: 0, protein: 0, fat: 0, vitc: 0 },
    water: { name: "Water (control)", starch: 0, sugar: 0, protein: 0, fat: 0, vitc: 0 }
  };
  const SAMPLES = [...Object.keys(FOODS), "mystery"];
  const TESTS = {
    iodine: { name: "Iodine", for: "starch", key: "starch" },
    benedicts: { name: "Benedict’s", for: "reducing sugar", key: "sugar" },
    biuret: { name: "Biuret", for: "protein", key: "protein" },
    ethanol: { name: "Ethanol", for: "fats and oils", key: "fat" },
    dcpip: { name: "DCPIP", for: "vitamin C", key: "vitc" }
  };
  // real reagent colours — fixed in both themes, like the chemicals themselves
  const C = {
    glass: "rgba(190, 205, 220, .18)", food: "rgba(225, 215, 190, .55)",
    iodineNeg: "#b9702a", iodinePos: "#25264f",
    ben: ["#3d72d6", "#5f9e48", "#d9b23a", "#c4482c"], benOrange: "#de8a2e",
    biuretNeg: "#4a7ad8", biuretPos: "#8d55c8",
    clear: "rgba(205, 222, 240, .35)", cloudy: "#ece8dc",
    dcpip: "#3456c4", colourless: "rgba(215, 228, 240, .4)"
  };

  function benchLab(lab) {
    const svg = $("[data-svg]", lab), notes = $("[data-results]", lab), exp = $("[data-explain]", lab), act = $("[data-act]", lab);
    let st, mystery, busy = false, book = {};

    svg.innerHTML = `
      <rect class="f lt" x="20" y="250" width="600" height="12" rx="3"/>
      <g data-bath style="opacity:0;transition:opacity .4s">
        <path class="f cb lt" d="M330 150H520V246H330Z"/><path class="l" d="M330 150V246H520V150"/><path class="l cb dash" d="M334 168H516"/>
        <text x="425" y="240" text-anchor="middle">water bath · 80 °C</text>
        <g class="l cr"><path d="M360 140c-4-10 4-14 0-24M400 140c-4-10 4-14 0-24M440 140c-4-10 4-14 0-24M480 140c-4-10 4-14 0-24"/></g>
      </g>
      <g data-beaker style="opacity:0;transition:opacity .4s">
        <path class="l" d="M350 150V246H500V150"/><path data-bwater d="M352 180H498V244H352Z" style="fill:${C.clear};transition:fill 1.2s"/>
        <text x="425" y="240" text-anchor="middle">beaker of water</text>
      </g>
      <g data-tube style="transform:translate(200px,40px);transition:transform .8s cubic-bezier(.2,.7,.2,1)">
        <path data-liq d="M2 200V210a18 18 0 0 0 36 0V200Z" style="fill:${C.glass};transition:fill 1.4s, d .6s"/>
        <path class="l w3" d="M0 0V210a20 20 0 0 0 40 0V0"/><path class="l" d="M-6 0H46"/>
      </g>
      <g data-dropper style="opacity:0;transition:opacity .3s,transform .5s" transform="translate(212 -10)">
        <rect class="f" x="0" y="0" width="16" height="30" rx="6"/><path class="f" d="M4 30H12L9 50H7Z"/>
        <circle data-drop cx="8" cy="56" r="3.5" style="fill:${C.dcpip};opacity:0"/>
      </g>
      <text x="220" y="282" text-anchor="middle" class="k" data-tlabel></text>
      <text x="40" y="40" class="ser" data-step></text>
      <text x="40" y="60" data-sub></text>`;
    const tube = $("[data-tube]", svg), liq = $("[data-liq]", svg), drop = $("[data-drop]", svg);
    // liquid height in the tube: the d attribute for a fill up to h px
    const fill = (h) => `M2 ${210 - h}V210a18 18 0 0 0 36 0V${210 - h}Z`;
    const colour = (c) => (liq.style.fill = c);

    function newMystery() {
      const pool = ["glucose", "starch", "egg", "oil", "juice", "milk", "sucrose"];
      mystery = pool[Math.floor(Math.random() * pool.length)];
    }
    const food = (id) => (id === "mystery" ? FOODS[mystery] : FOODS[id]);
    const label = (id) => (id === "mystery" ? "Mystery sample" : FOODS[id].name);

    function paintChoices() {
      $$("[data-sample]", lab).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sample === st.sample)));
      $$("[data-reagent]", lab).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.reagent === st.reagent)));
      $$("[data-sample],[data-reagent]", lab).forEach((b) => (b.disabled = busy));
    }
    function setAction(text, fn) {
      act.textContent = text; act.onclick = fn; act.disabled = busy || !fn;
    }
    function caption(step, sub) { $("[data-step]", svg).textContent = step; $("[data-sub]", svg).textContent = sub || ""; }

    function resetTube() {
      tube.style.transform = "translate(200px, 40px)";
      $("[data-bath]", svg).style.opacity = 0; $("[data-beaker]", svg).style.opacity = 0; $("[data-dropper]", svg).style.opacity = 0;
      $("[data-bwater]", svg).style.fill = C.clear;
      liq.setAttribute("d", fill(0)); colour(C.glass);
      $("[data-tlabel]", svg).textContent = label(st.sample);
    }
    function ready() {
      resetTube(); busy = false; paintChoices();
      const t = TESTS[st.reagent];
      caption(`${label(st.sample)} + ${t.name}`, `testing for ${t.for}`);
      setAction(st.reagent === "dcpip" ? "Add the food to DCPIP, drop by drop" : st.reagent === "ethanol" ? "Shake the food with ethanol" : `Add ${t.name} ${st.reagent === "iodine" ? "solution" : "solution"}`, run);
      explainIdle();
    }

    async function run() {
      busy = true; paintChoices(); setAction("…", null);
      const f = food(st.sample), r = st.reagent;
      if (r === "dcpip") return runDcpip(f);
      liq.setAttribute("d", fill(60)); colour(st.sample === "oil" || (st.sample === "mystery" && mystery === "oil") ? "rgba(230, 200, 90, .7)" : C.food);
      caption("Food sample in the tube", "ground up with a little water if solid");
      await wait(700);
      liq.setAttribute("d", fill(96));
      if (r === "iodine") { colour(f.starch ? C.iodinePos : C.iodineNeg); caption("Iodine added", "a few drops"); await wait(1400); return finish(!!f.starch, f.starch ? "blue-black" : "orange-brown"); }
      if (r === "biuret") { colour(C.biuretNeg); caption("Biuret solution added", "mix gently"); await wait(900); if (f.protein) { colour(C.biuretPos); await wait(1300); } return finish(!!f.protein, f.protein ? "purple" : "stays blue"); }
      if (r === "benedicts") {
        colour(C.ben[0]); caption("Benedict’s solution added", "it is blue — now it must be heated");
        busy = false; setAction("Heat in a water bath (80 °C)", heatBenedicts); return;
      }
      if (r === "ethanol") {
        colour(C.clear); caption("Shaken with ethanol", "any fat dissolves in the ethanol — no change yet");
        busy = false; setAction("Pour into a beaker of water", pourEthanol); return;
      }
    }
    async function heatBenedicts() {
      busy = true; setAction("Heating…", null);
      const f = food(st.sample);
      $("[data-bath]", svg).style.opacity = 1; tube.style.transform = "translate(405px, -10px)";
      caption("Heating in the water bath", "a few minutes at about 80 °C");
      await wait(900);
      const steps = [C.ben[1], C.ben[2], C.benOrange, C.ben[3]].slice(0, f.sugar === 3 ? 4 : f.sugar === 2 ? 3 : f.sugar);
      for (const c of steps) { colour(c); await wait(1000); }
      if (!steps.length) await wait(1200);
      const name = ["stays blue", "green", "yellow-orange", "brick-red"][f.sugar];
      finish(f.sugar > 0, name);
    }
    async function pourEthanol() {
      busy = true; setAction("Pouring…", null);
      const f = food(st.sample);
      $("[data-beaker]", svg).style.opacity = 1; tube.style.transform = "translate(405px, -60px)";
      caption("Poured into water", "watch the water in the beaker");
      await wait(900);
      liq.setAttribute("d", fill(20));
      $("[data-bwater]", svg).style.fill = f.fat ? C.cloudy : C.clear;
      await wait(1400);
      finish(!!f.fat, f.fat ? "cloudy white emulsion" : "stays clear");
    }
    async function runDcpip(f) {
      liq.setAttribute("d", fill(70)); colour(C.dcpip);
      $("[data-dropper]", svg).style.opacity = 1;
      caption("1 cm³ of DCPIP in the tube", "now add the food, one drop at a time");
      await wait(700);
      const needed = f.vitc ? 6 : 99;
      let n = 0;
      for (n = 1; n <= 20; n++) {
        drop.style.opacity = 1; await wait(170); drop.style.opacity = 0;
        caption(`Drops added: ${n}`, f.vitc && n >= needed ? "blue colour gone!" : "the blue colour stays…");
        if (n >= needed) { colour(C.colourless); break; }
        if (n === 3 && f.vitc) colour("#6c86d0");
        await wait(130);
      }
      await wait(900);
      finish(!!f.vitc, f.vitc ? `decolourised after ${needed} drops` : "stays blue after 20 drops");
    }

    function finish(pos, seen) {
      busy = false;
      book[st.sample] = book[st.sample] || {};
      book[st.sample][st.reagent] = { pos, seen };
      caption(pos ? `Positive: ${seen}` : `Negative: ${seen}`, `${label(st.sample)} · ${TESTS[st.reagent].name}`);
      setAction("Wash the tube and test again", ready);
      paintChoices(); drawBook(); explainDone(pos, seen);
    }

    function drawBook() {
      const keys = Object.keys(TESTS);
      const cell = (s, k) => { const e = book[s]?.[k]; return e ? `<td class="${e.pos ? "pos" : "neg"}" title="${e.seen}">${e.pos ? "+" : "−"}</td>` : `<td class="nd">·</td>`; };
      const tested = SAMPLES.filter((s) => book[s]);
      notes.innerHTML = `<table class="nb"><tr><th></th>${keys.map((k) => `<th>${TESTS[k].name}</th>`).join("")}</tr>
        ${(tested.length ? tested : [st.sample]).map((s) => `<tr><td>${label(s)}</td>${keys.map((k) => cell(s, k)).join("")}</tr>`).join("")}</table>
        <p class="nb-k">+ positive · − negative · tested results stay until Reset</p>`;
    }
    function explainIdle() {
      const t = TESTS[st.reagent];
      const how = { iodine: "Add a few drops of iodine solution. Blue-black means starch.", benedicts: "Add Benedict’s solution, then heat in a water bath. Green → yellow → orange → brick-red means reducing sugar — the further along, the more sugar.", biuret: "Add biuret solution. Purple means protein.", ethanol: "Shake the food with ethanol, then pour into water. A cloudy white emulsion means fat.", dcpip: "Add the food drop by drop to blue DCPIP. If the blue disappears, there is vitamin C — the fewer drops needed, the more vitamin C." }[st.reagent];
      exp.innerHTML = chips([[t.name], [`tests for ${t.for}`]]) + `<h3>Ready: ${label(st.sample)}</h3><p>${how}</p>`;
    }
    function explainDone(pos, seen) {
      const t = TESTS[st.reagent], f = food(st.sample);
      let extra = "";
      if (st.reagent === "benedicts" && !pos && (st.sample === "sucrose" || (st.sample === "mystery" && mystery === "sucrose"))) extra = " Sucrose is a sugar, but <b>not a reducing sugar</b> — so Benedict’s stays blue.";
      if (st.reagent === "benedicts" && pos && f.sugar < 3) extra = " The colour stopped before brick-red, so there is <b>less</b> reducing sugar than in pure glucose solution.";
      if (st.sample === "water") extra = " Water is the <b>control</b>: it shows what a negative result looks like.";
      const m = book.mystery, done = m && Object.keys(TESTS).every((k) => m[k]);
      let reveal = "";
      if (st.sample === "mystery" && done) {
        const match = Object.keys(FOODS).filter((id) => id !== "water").filter((id) => Object.keys(TESTS).every((k) => (FOODS[id][TESTS[k].key] > 0) === m[k].pos));
        reveal = `<p class="note-k" style="margin-top:4px"><b>Mystery solved</b> Your five results match <b>${match.map((id) => FOODS[id].name.toLowerCase()).join(" or ")}</b>. It was ${FOODS[mystery].name.toLowerCase()}.</p>`;
      } else if (st.sample === "mystery") {
        reveal = `<p>Mystery sample: ${Object.keys(m).length} of 5 tests done. Do all five to identify it.</p>`;
      }
      exp.innerHTML = chips([[pos ? "Positive" : "Negative", pos ? "up" : "down"], [t.name]]) +
        `<h3>${label(st.sample)}: ${pos ? `contains ${t.for}` : `no ${t.for}`}</h3><p>${t.name} ${pos ? "gave" : "showed"} <b>${seen}</b>.${extra}</p>${reveal}` +
        flow([label(st.sample), t.name, seen, pos ? `${t.for} present` : `${t.for} absent`]);
    }

    lab.addEventListener("click", (e) => {
      const s = e.target.closest("[data-sample]"), r = e.target.closest("[data-reagent]");
      if (busy || (!s && !r)) return;
      if (s) st.sample = s.dataset.sample;
      if (r) st.reagent = r.dataset.reagent;
      ready();
    });
    $("[data-reset]", lab).addEventListener("click", () => { book = {}; newMystery(); st = { sample: "glucose", reagent: "benedicts" }; ready(); drawBook(); });
    lab.applyState = (s) => { if (busy) return; Object.assign(st, s); ready(); if (s.run) run(); };
    st = { sample: "glucose", reagent: "benedicts" }; newMystery(); ready(); drawBook();
  }

  $$("[data-lab]").forEach((lab) => lab.dataset.mode === "bench" && benchLab(lab));
})();
