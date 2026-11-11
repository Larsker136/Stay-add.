/* ==========================================================================
   stay add. — Physics topic 5, Nuclear physics: the labs
   atom      build a nucleus from protons and neutrons; nuclide notation,
             isotopes, and alpha or beta decay equations
   halflife  a sample of unstable nuclei decaying at random, with its graph
   absorber  alpha, beta and gamma sources against paper, aluminium and lead
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const EL = ["n", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca"];
  const NAME = ["neutron", "hydrogen", "helium", "lithium", "beryllium", "boron", "carbon", "nitrogen", "oxygen", "fluorine", "neon", "sodium", "magnesium", "aluminium", "silicon", "phosphorus", "sulfur", "chlorine", "argon", "potassium", "calcium"];
  const STABLE = { "1,0": 1, "1,1": 1, "2,2": 1, "2,1": 1, "3,3": 1, "3,4": 1, "4,5": 1, "5,5": 1, "5,6": 1, "6,6": 1, "6,7": 1, "7,7": 1, "7,8": 1, "8,8": 1, "8,9": 1, "8,10": 1, "9,10": 1, "10,10": 1, "10,12": 1, "11,12": 1, "12,12": 1, "13,14": 1, "14,14": 1, "15,16": 1, "16,16": 1, "17,18": 1, "17,20": 1, "18,22": 1, "19,20": 1, "20,20": 1 };
  const nucl = (A, Z, s) => `<span class="nuc"><sup>${A}</sup><sub>${Z}</sub>${s}</span>`;

  /* ---------- build a nucleus ---------- */
  function atomLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { Z: 6, N: 8 }, eq = "";
    function draw() {
      const A = st.Z + st.N, stable = STABLE[`${st.Z},${st.N}`];
      // pack protons and neutrons in a spiral, spreading the protons evenly among the neutrons
      let out = "", zp = 0, np = 0;
      for (let i = 0; i < A; i++) {
        const proton = np >= st.N || (zp < st.Z && zp / Math.max(1, st.Z) <= np / Math.max(1, st.N));
        proton ? zp++ : np++;
        const r = 7 * Math.sqrt(i), a = i * 2.4;
        out += `<circle class="f ${proton ? "cr" : "ct"} dk" cx="${200 + r * Math.cos(a)}" cy="${140 + r * Math.sin(a)}" r="8"/>`;
      }
      const shell = A ? `<circle class="l dash" cx="200" cy="140" r="${30 + 7 * Math.sqrt(A)}"/>` : "";
      svg.innerHTML = out + shell + `<text x="200" y="${A ? 140 + 7 * Math.sqrt(A) + 50 : 160}" text-anchor="middle">${st.Z} electrons orbit far outside (not to scale)</text>
        <text x="420" y="90" class="k big" style="font-size:40px">${A}</text><text x="420" y="150" class="k big" style="font-size:40px">${st.Z}</text><text x="470" y="128" class="k" style="font-size:64px">${EL[st.Z] || "?"}</text>
        <text x="420" y="190">nucleon number A</text><text x="420" y="206">proton number Z</text>`;
      res.innerHTML = rows([["element", NAME[st.Z] || "—"], ["protons Z", st.Z], ["neutrons N", st.N], ["nucleon number A = Z + N", A], ["stable?", stable ? "stable" : "unstable (radioactive)"]]);
      exp.innerHTML = chips([[`${NAME[st.Z] || "?"}-${A}`], [stable ? "stable" : "radioactive", stable ? "up" : "warn"]]) + (eq ? `<h3>Decay equation</h3><p class="formula">${eq}</p>` : "") +
        `<h3>${NAME[st.Z] ? `The proton number makes it ${NAME[st.Z]}` : "Add protons"}</h3><p>The number of <b>protons</b> (Z) decides the element. Atoms of the same element with different numbers of <b>neutrons</b> are <b>isotopes</b> — same Z, different A. Isotopes with too many or too few neutrons are unstable and decay.</p>` + flow(["Z = protons", "N = neutrons", "A = Z + N", "same Z, different N = isotope"]);
    }
    const paint = controls(lab, st, () => { eq = ""; paint(); draw(); });
    $$("[data-decay]", lab).forEach((b) => b.addEventListener("click", () => {
      const A = st.Z + st.N, X = EL[st.Z];
      if (b.dataset.decay === "alpha" && st.Z >= 2 && st.N >= 2) { st.Z -= 2; st.N -= 2; eq = `${nucl(A, st.Z + 2, X)} → ${nucl(A - 4, st.Z, EL[st.Z])} + ${nucl(4, 2, "α")}`; }
      else if (b.dataset.decay === "beta" && st.N >= 1 && st.Z < 20) { st.Z += 1; st.N -= 1; eq = `${nucl(A, st.Z - 1, X)} → ${nucl(A, st.Z, EL[st.Z])} + ${nucl(0, "−1", "β")}`; }
      else if (b.dataset.decay === "gamma") eq = `${nucl(A, st.Z, X)} → ${nucl(A, st.Z, X)} + ${nucl(0, 0, "γ")} (no change in A or Z)`;
      paint(); draw();
    }));
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { Z: 6, N: 8 }); eq = ""; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); eq = ""; paint(); draw(); if (s.decay) $(`[data-decay="${s.decay}"]`, lab).click(); };
    paint(); draw();
  }

  /* ---------- half-life ---------- */
  function halflifeLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const N0 = 400;
    let st = { hl: 4 }, alive, hist, t, running = true;
    function reset() { alive = new Array(N0).fill(true); hist = [[0, N0]]; t = 0; draw(); explain(); }
    function tick() {
      if (!running) return;
      const p = 1 - Math.pow(0.5, 0.1 / st.hl); let n = 0;
      for (let i = 0; i < N0; i++) if (alive[i] && Math.random() < p) alive[i] = false;
      for (const a of alive) if (a) n++;
      t += 0.1; hist.push([t, n]); if (t >= st.hl * 5) running = false;
      draw(); if (Math.round(t * 10) % 10 === 0) explain();
    }
    function draw() {
      const n = alive.filter(Boolean).length;
      let grid = ""; for (let i = 0; i < N0; i++) grid += `<rect x="${20 + (i % 20) * 11}" y="${30 + Math.floor(i / 20) * 11}" width="9" height="9" rx="2" class="f ${alive[i] ? "cg dk" : "lt"}"/>`;
      const X = (s) => 290 + (s / (st.hl * 5)) * 320, Y = (c) => 250 - (c / N0) * 220;
      const d = hist.map(([s, c], i) => `${i ? "L" : "M"}${X(s).toFixed(1)} ${Y(c).toFixed(1)}`).join("");
      const guides = [1, 2, 3].map((k) => `<path class="guide" d="M290 ${Y(N0 / 2 ** k)}H${X(st.hl * k)}V250"/><text x="${X(st.hl * k)}" y="266" text-anchor="middle">${k}t½</text>`).join("");
      svg.innerHTML = grid + `<path class="ax" d="M290 24V250H612"/>${guides}<path class="plot" style="stroke:var(--c-phys)" d="${d}"/>
        <text x="290" y="18" class="k">undecayed nuclei</text><text x="612" y="282" text-anchor="end">time / min</text><text x="20" y="270">${n} of ${N0} left</text>`;
      res.innerHTML = rows([["time", `${t.toFixed(1)} min`], ["undecayed nuclei", n], ["half-lives passed", (t / st.hl).toFixed(2)], ["expected after that", Math.round(N0 * Math.pow(0.5, t / st.hl))]]);
    }
    function explain() {
      exp.innerHTML = chips([["Random decay"], [`t½ = ${st.hl} min`]]) + `<h3>Each half-life, half of what is left decays</h3><p>Decay is <b>random</b>: you can’t predict which nucleus decays next, but with many nuclei the pattern is regular. The <b>half-life</b> is the time for <b>half the nuclei</b> of an isotope to decay — or for the count rate to fall to half. After 2 half-lives a quarter remains, after 3 an eighth. When measuring a count rate, first subtract the <b>background</b> count.</p>` + flow(["N₀", "½N₀ after 1 t½", "¼N₀ after 2", "⅛N₀ after 3"]);
    }
    const paint = controls(lab, st, () => { paint(); running = true; reset(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.hl = 4; paint(); running = true; reset(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); running = true; reset(); };
    paint(); reset();
    loop(lab, tick, 60);
  }

  /* ---------- penetration ---------- */
  function absorberLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const STOP = { alpha: "paper", beta: "aluminium", gamma: "lead" }, ORDER = ["none", "paper", "aluminium", "lead"];
    const INFO = { alpha: ["α", "a helium nucleus: 2 protons + 2 neutrons", "+2", "strongly ionising", "a few cm of air or a sheet of paper"], beta: ["β", "a fast electron from the nucleus", "−1", "moderately ionising", "a few mm of aluminium"], gamma: ["γ", "an electromagnetic wave", "0", "weakly ionising", "reduced by thick lead or concrete"] };
    let st = { src: "beta", abs: "paper" };
    function draw() {
      const passes = ORDER.indexOf(st.abs) < ORDER.indexOf(STOP[st.src]) || (st.src === "gamma" && st.abs !== "lead");
      const partial = st.src === "gamma" && st.abs === "lead", count = passes ? 480 : partial ? 60 : 22;
      const stopX = st.abs === "none" ? 540 : 300;
      const col = { alpha: "cr", beta: "cb", gamma: "cv" }[st.src];
      let rays = ""; for (let k = -2; k <= 2; k++) { const y = 140 + k * 14, end = passes ? 540 : partial ? 360 : stopX; rays += st.src === "gamma" ? `<path class="l ${col}" d="M110 ${y}${Array.from({ length: Math.round((end - 110) / 12) }, (_, j) => `l6 ${j % 2 ? 5 : -5}l6 ${j % 2 ? -5 : 5}`).join("")}"/>` : `<path class="l w3 ${col}" d="M110 ${y}H${end}"/>`; }
      svg.innerHTML = `<rect class="f ${col} dk" x="40" y="110" width="70" height="60" rx="6"/><text x="75" y="145" text-anchor="middle" class="k">${INFO[st.src][0]} source</text>
        ${st.abs === "none" ? "" : `<rect class="f ${st.abs === "lead" ? "dk" : st.abs === "aluminium" ? "" : "lt"}" x="300" y="70" width="${st.abs === "paper" ? 4 : st.abs === "aluminium" ? 12 : 40}" height="140"/><text x="310" y="62" text-anchor="middle">${st.abs}</text>`}
        ${rays}<rect class="f" x="550" y="115" width="60" height="50" rx="6"/><text x="580" y="145" text-anchor="middle" class="k">GM tube</text><text x="580" y="190" text-anchor="middle" class="tc cb">${count} counts/min</text>`;
      res.innerHTML = rows([["radiation", `${st.src} (${INFO[st.src][0]})`], ["what it is", INFO[st.src][1]], ["charge", INFO[st.src][2]], ["ionising", INFO[st.src][3]], ["stopped by", INFO[st.src][4]], ["count rate at detector", `${count} /min${passes ? "" : " (just background)"}`]]);
      exp.innerHTML = chips([[passes ? "Passes through" : partial ? "Mostly absorbed" : "Stopped", passes ? "warn" : "up"]]) + `<h3>${st.src.charAt(0).toUpperCase() + st.src.slice(1)} ${passes ? "gets through " + (st.abs === "none" ? "air" : st.abs) : "is stopped by " + st.abs}</h3><p>The more <b>ionising</b> a radiation is, the more quickly it loses energy and the <b>less penetrating</b> it is. Alpha is stopped by paper, beta by a few millimetres of aluminium, and gamma is only reduced by thick lead. When nothing gets through, the detector still records <b>background radiation</b>.</p>` + flow(["strongly ionising", "loses energy quickly", "short range", "stopped easily"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { src: "beta", abs: "paper" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ atom: atomLab, halflife: halflifeLab, absorber: absorberLab });
})();
