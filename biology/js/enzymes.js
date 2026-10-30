/* ==========================================================================
   stay add. — Enzymes: the labs
   (Topic switching, the step rail and the Interpret chains are the shared
   lesson form in assets/js/lesson.js; the numbers and shapes come from
   js/enzyme.js.)
   Labs: fit (lock and key), temp (temperature, with lasting damage), ph.
   Each exposes lab.applyState(state) for the Interpret chains.
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {}, E = SA.enzyme;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rows = (list) => list.map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join("");
  const chips = (list) => `<div class="chips">${list.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>`;
  const press = (nodes, test) => nodes.forEach((b) => b.setAttribute("aria-pressed", test(b)));
  const flow = (list) => `<p class="flow">${list.map((t) => `<span>${t}</span>`).join("")}</p>`;
  const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
  const lerp = (a, b, k) => a + (b - a) * k;
  const pct = (r) => `${Math.round(r * 100)} %`;

  /* =======================================================================
     Lab: lock and key
     ======================================================================= */
  function fitLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), go = $("[data-go]", lab);
    const CX = 320, CY = 222, START = -138;
    let st = { enz: "amylase", sub: "starch" }, count = 0, phase = "idle", busy = false, timer = 0;

    function scene() {
      const enz = E.ENZ[st.enz], shape = E.SUB[st.sub];
      svg.innerHTML = `
        <defs><clipPath id="clipL"><rect x="-60" y="-100" width="60" height="80"/></clipPath><clipPath id="clipR"><rect x="0" y="-100" width="60" height="80"/></clipPath></defs>
        <g transform="translate(${CX} ${CY})">
          <path class="enz" d="${E.enzymePath(enz.shape)}"/>
          <text y="8" text-anchor="middle" class="t-name">${enz.name}</text>
          <g data-subg transform="translate(0 ${START})">
            <path class="subs" d="${E.substratePath(shape)}"/>
            <text y="-88" text-anchor="middle" class="lbl-sub">${st.sub}</text>
          </g>
          <g data-prodg opacity="0">
            <g data-pl clip-path="url(#clipL)"><path class="prod" d="${E.substratePath(shape)}"/></g>
            <g data-pr clip-path="url(#clipR)"><path class="prod" d="${E.substratePath(shape)}"/></g>
          </g>
        </g>
        <path class="guide" d="M${CX + 30} ${CY - 44}L${CX + 110} ${CY - 86}"/>
        <text x="${CX + 114}" y="${CY - 84}" class="lbl-enz">active site</text>
        <text x="${CX}" y="${CY + 72}" text-anchor="middle" class="lbl-ink" data-cap></text>
        <text x="${CX - 196}" y="${CY - 104}" text-anchor="middle" class="lbl-prod" data-p1></text>
        <text x="${CX + 196}" y="${CY - 104}" text-anchor="middle" class="lbl-prod" data-p2></text>`;
    }
    function render() {
      const enz = E.ENZ[st.enz], fits = enz.shape === E.SUB[st.sub];
      press($$("[data-enz]", lab), (b) => b.dataset.enz === st.enz);
      press($$("[data-sub]", lab), (b) => b.dataset.sub === st.sub);
      go.disabled = busy;
      const done = phase === "done";
      res.innerHTML = rows([
        ["Fits the active site?", done ? (fits ? "yes" : "no") : "—"],
        ["Products", done && fits ? enz.product : "—"],
        ["Reactions so far", count],
        ["Enzyme afterwards", count ? "unchanged" : "—"]
      ]);
      if (!done) {
        exp.innerHTML = chips([["Ready"]]) + `<h3>${enz.name} + ${st.sub}</h3><p>Before you press <b>Add the substrate</b>: will it fit? Compare the shape of the tab under the ${st.sub} with the notch — the <b>active site</b> — in the ${enz.name}.</p>`;
        return;
      }
      const right = Object.values(E.ENZ).find((e) => e.sub === st.sub);
      exp.innerHTML = fits
        ? chips([["Fits", "up"], ["Specific"]]) + `<h3>${st.sub} → ${enz.product}</h3>
           <p>The ${st.sub} has a shape <b>complementary</b> to the active site of ${enz.name}, so it fits and forms an <b>enzyme–substrate complex</b>. The reaction splits it into <b>${enz.product}</b>, the products leave, and the active site is empty again. The ${enz.name} is <b>unchanged</b> — it has now done ${count} reaction${count === 1 ? "" : "s"} and is ready for more.</p>` +
          flow([`${st.sub} meets ${enz.name}`, "fits the active site", "enzyme–substrate complex", enz.product, "enzyme unchanged"])
        : chips([["No fit", "down"]]) + `<h3>${st.sub} does not fit ${enz.name}</h3>
           <p>The active site of ${enz.name} is not complementary to ${st.sub}, so no enzyme–substrate complex forms and nothing happens. Enzymes are <b>specific</b>: ${st.sub} is broken down by <b>${right.name}</b>.</p>` +
          flow([`${st.sub} meets ${enz.name}`, "wrong shape", "no complex", "no reaction"]);
    }
    function animate(dur, step) {
      return new Promise((done) => {
        if (still) { step(1); done(); return; }
        const t0 = performance.now();
        const tick = (now) => { const k = Math.min(1, (now - t0) / dur); step(k); k < 1 ? requestAnimationFrame(tick) : done(); };
        requestAnimationFrame(tick);
      });
    }
    async function runOnce() {
      scene();
      const enz = E.ENZ[st.enz], fits = enz.shape === E.SUB[st.sub];
      const g = $("[data-subg]", svg), pg = $("[data-prodg]", svg), pl = $("[data-pl]", svg), pr = $("[data-pr]", svg), cap = $("[data-cap]", svg);
      const stopAt = fits ? 0 : -30;
      await animate(650, (k) => g.setAttribute("transform", `translate(0 ${lerp(START, stopAt, ease(k)).toFixed(1)})`));
      if (!fits) {
        cap.textContent = "wrong shape — no complex";
        await animate(500, (k) => g.setAttribute("transform", `translate(${(k * 24).toFixed(1)} ${lerp(stopAt, -96, ease(k)).toFixed(1)}) rotate(${(k * 10).toFixed(1)})`));
        return;
      }
      cap.textContent = "enzyme–substrate complex";
      await animate(550, () => {});
      g.setAttribute("opacity", "0"); pg.setAttribute("opacity", "1");
      cap.textContent = "products leave · enzyme unchanged";
      await animate(800, (k) => {
        const e = ease(k);
        pl.setAttribute("transform", `translate(${(-196 * e).toFixed(1)} ${(-98 * e).toFixed(1)}) rotate(${(-14 * e).toFixed(1)})`);
        pr.setAttribute("transform", `translate(${(196 * e).toFixed(1)} ${(-98 * e).toFixed(1)}) rotate(${(14 * e).toFixed(1)})`);
      });
      const [p1, p2] = enz.product.includes("+") ? enz.product.split(" + ") : [enz.product, enz.product];
      $("[data-p1]", svg).textContent = p1; $("[data-p2]", svg).textContent = p2;
      count++;
    }
    async function run(times = 1) {
      if (busy) return;
      busy = true; phase = "running"; render();
      for (let i = 0; i < times; i++) { await runOnce(); if (i < times - 1) await animate(350, () => {}); }
      busy = false; phase = "done"; render();
    }
    const choose = (patch) => { if (busy) return; st = { ...st, ...patch }; phase = "idle"; scene(); render(); };
    $$("[data-enz]", lab).forEach((b) => b.addEventListener("click", () => choose({ enz: b.dataset.enz })));
    $$("[data-sub]", lab).forEach((b) => b.addEventListener("click", () => choose({ sub: b.dataset.sub })));
    go.addEventListener("click", () => run());
    $("[data-reset]", lab).addEventListener("click", () => { if (busy) return; count = 0; choose({ enz: "amylase", sub: "starch" }); });
    lab.applyState = (s) => {
      if (busy) return;
      st = { enz: s.enz || st.enz, sub: s.sub || st.sub }; phase = "idle"; scene(); render();
      clearTimeout(timer);
      if (s.go) timer = setTimeout(() => run(s.repeat || 1), still ? 0 : 500);   // after the glide to the lab
    };
    scene(); render();
  }

  /* =======================================================================
     Shared by the temperature and pH labs: a graph on the left and the
     enzyme close up on the right
     ======================================================================= */
  function closeUp(shape) {
    return `
      <path class="ax" d="M418 30V300" style="stroke:var(--line)"/>
      <text x="528" y="20" text-anchor="middle">up close</text>
      <g transform="translate(528 214)">
        <g data-sub><path class="subs" d="${E.substratePath(shape)}"/></g>
        <path class="enz" data-enz/>
        <text y="6" text-anchor="middle" class="lbl-enz" data-enz-name></text>
      </g>
      <text x="528" y="290" text-anchor="middle" class="lbl-ink" data-state></text>`;
  }
  function setSite(svg, shape, d, name, word) {
    const enz = $("[data-enz]", svg);
    enz.setAttribute("d", E.enzymePath(shape, d));
    enz.classList.toggle("is-bad", d >= 0.6);
    $("[data-sub]", svg).setAttribute("transform", `translate(${(d * 10).toFixed(1)} ${(-d * 34).toFixed(1)}) rotate(${(d * 12).toFixed(1)})`);
    $("[data-enz-name]", svg).textContent = name;
    $("[data-state]", svg).textContent = word;
  }
  const marker = (X, Y, v, r, y0 = 262) => `<path class="guide" d="M${X(v).toFixed(1)} ${Y(r).toFixed(1)}V${y0}M56 ${Y(r).toFixed(1)}H${X(v).toFixed(1)}"/><circle class="pt" r="5.5" cx="${X(v).toFixed(1)}" cy="${Y(r).toFixed(1)}"/>`;
  const yAxis = `<path class="gl" d="M56 151H386M56 40H386"/><g text-anchor="end"><text x="46" y="265">0</text><text x="46" y="154">50</text><text x="46" y="43">100</text></g><text x="56" y="20">rate / % of max</text>`;

  /* =======================================================================
     Lab: temperature
     ======================================================================= */
  function tempLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), slider = $("[data-t]", lab);
    const X = (T) => 56 + (T / 70) * 330, Y = (r) => 262 - r * 222, ticks = [0, 10, 20, 30, 40, 50, 60, 70];
    const fresh = E.curve((T) => E.rateT(T), 0, 70, X, Y, 0.5);
    let T = 37, maxT = 37;

    function render() {
      const r = E.rateT(T, maxT), d = E.siteT(T, maxT), damaged = E.perm(maxT) < 1, gone = E.perm(maxT) === 0;
      const after = damaged ? E.curve((t) => E.rateT(t, maxT), 0, 70, X, Y, 0.5) : "";
      svg.innerHTML = `
        <rect class="zone" x="${X(40)}" y="40" width="${X(70) - X(40)}" height="222"/>
        ${yAxis}
        <path class="area" d="${fresh}L${X(70)} 262H56Z"/><path class="plot" d="${fresh}"/>
        ${damaged ? `<path class="plot dim" d="${after}"/><text x="${X(8)}" y="${Y(E.rateT(8, maxT)) - 10}" class="lbl-ink">after ${maxT} °C</text>` : ""}
        <path class="guide" d="M${X(37)} 40V262"/>
        <path class="ax" d="M56 30V262H392"/>
        <path class="tk" d="${ticks.map((t) => `M${X(t)} 262v5`).join("")}M51 262h5M51 151h5M51 40h5"/>
        <g text-anchor="middle">${ticks.map((t) => `<text x="${X(t)}" y="282">${t}</text>`).join("")}</g>
        <text x="392" y="302" text-anchor="end">temperature / °C</text>
        <text x="${X(37)}" y="34" text-anchor="middle" class="lbl-ink">optimum 37 °C</text>
        <text x="${X(55)}" y="58" text-anchor="middle" class="lbl-bad">denaturing</text>
        ${marker(X, Y, T, r)}
        ${closeUp("round")}`;
      setSite(svg, "round", d, "amylase", T < 12 && !damaged ? "fits · few collisions" : E.siteShort(d));
      slider.value = T; slider.style.setProperty("--pct", `${(T / 70) * 100}%`);
      $("[data-t-out]", lab).textContent = T;
      res.innerHTML = rows([
        ["Activity", pct(r)],
        ["Temperature", `${T} °C`],
        ["Collisions vs 37 °C", `× ${E.collide(T).toFixed(2)}`],
        ["Active site", E.siteWord(d)],
        ["Hottest so far", `${maxT} °C`]
      ]);

      let head, text, chain;
      if (damaged && T < maxT - 3) {
        const was = E.rateT(T);
        head = chips([["Permanent", "down"], ["Supp."]]);
        text = `<h3>Cooling did not undo it</h3><p>This sample was heated to <b>${maxT} °C</b>. ${gone ? "Every" : "Some"} active site${gone ? "" : "s"} lost ${gone ? "its" : "their"} shape, and the bonds do not re-form on cooling. At ${T} °C a fresh sample works at ${pct(was)}; this one manages only <b>${pct(r)}</b>. Press <b>New sample</b> to start again.</p>`;
        chain = [`heated to ${maxT} °C`, "active site changed shape", "cooled", "shape not restored", gone ? "still denatured" : "still slower"];
      } else if (T < 15) {
        head = chips([["Cold"], ["Not denatured", "up"]]);
        text = `<h3>Slow, but not damaged</h3><p>At ${T} °C the molecules have little <b>kinetic energy</b>. The active site still has the right shape, but enzyme and substrate <b>collide rarely</b>, so few complexes form. Warm it and it speeds up again.</p>`;
        chain = ["low temperature", "little kinetic energy", "few collisions", "slow — but not denatured"];
      } else if (T < 34) {
        head = chips([["Rising", "up"]]);
        text = `<h3>Warmer → faster</h3><p>Each 10 °C roughly doubles the collisions here. More enzyme–substrate complexes form each second, so the rate rises — <b>${pct(r)}</b> of the maximum at ${T} °C.</p>`;
        chain = ["higher temperature", "more kinetic energy", "more collisions", "more complexes", "faster rate"];
      } else if (T <= 40) {
        head = chips([["Optimum", "up"]]);
        text = `<h3>Around the optimum</h3><p>Collisions are frequent and the active site still fits the substrate, so the most complexes form each second. For human enzymes this is about <b>37 °C</b> — body temperature.</p>`;
        chain = ["frequent collisions", "active site still fits", "most complexes per second", "optimum"];
      } else if (d < 0.6) {
        head = chips([["Denaturing", "warn"], ["Supp."]]);
        text = `<h3>The active site is changing shape</h3><p>There are even more collisions, but the enzyme now vibrates so much that bonds holding its shape break. Fewer substrates fit, so the rate falls to <b>${pct(r)}</b>. Some of this damage is <b>permanent</b> — try cooling it.</p>`;
        chain = ["above the optimum", "bonds in the enzyme break", "active site changes shape", "fewer complexes", "rate falls"];
      } else {
        head = chips([["Denatured", "down"], ["Supp."]]);
        text = `<h3>Denatured</h3><p>At ${T} °C the active site has lost its shape. The substrate is no longer complementary, so <b>no</b> enzyme–substrate complexes form and the rate is ${pct(r)}. The enzyme is denatured — permanently.</p>`;
        chain = ["too hot", "active site loses its shape", "substrate does not fit", "denatured"];
      }
      exp.innerHTML = head + text + flow(chain);
    }
    slider.addEventListener("input", () => { T = +slider.value; maxT = Math.max(maxT, T); render(); });
    $("[data-cool]", lab).addEventListener("click", () => { T = 20; render(); });
    $("[data-reset]", lab).addEventListener("click", () => { T = 37; maxT = 37; render(); });
    lab.applyState = (s) => { T = s.t; maxT = Math.max(s.t, s.max || 0); render(); };
    render();
  }

  /* =======================================================================
     Lab: pH
     ======================================================================= */
  function phLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), slider = $("[data-ph]", lab);
    const X = (p) => 56 + ((p - 1) / 12) * 330, Y = (r) => 262 - r * 222, ticks = [1, 3, 5, 7, 9, 11, 13];
    const NAMES = ["protease", "amylase", "lipase"];
    let st = { enz: "amylase", ph: 7 };

    function render() {
      const enz = E.ENZ[st.enz], r = E.ratePH(st.ph, enz.opt), d = E.sitePH(st.ph, enz.opt), off = Math.abs(st.ph - enz.opt);
      press($$("[data-enz]", lab), (b) => b.dataset.enz === st.enz);
      const curves = NAMES.map((n) => {
        const e = E.ENZ[n], line = E.curve((p) => E.ratePH(p, e.opt), 1, 13, X, Y, 0.25), on = n === st.enz;
        return (on ? `<path class="area" d="${line}L${X(13)} 262H${X(1)}Z"/>` : "") + `<path class="plot${on ? "" : " dim"}" d="${line}"/>` +
          `<text x="${X(e.opt) + (n === "amylase" ? -8 : 8)}" y="${n === "protease" ? Y(0.86) : Y(1) - 8}" text-anchor="${n === "amylase" ? "end" : "start"}" class="${on ? "lbl-ink" : ""}">${n} · ${e.opt}</text>`;
      }).join("");
      svg.innerHTML = `
        ${yAxis}${curves}
        <path d="M${X(st.ph).toFixed(1)} 30V262" style="stroke:var(--c-ph);stroke-width:1.5;stroke-dasharray:3 3"/>
        <path class="ax" d="M56 30V262H392"/>
        <path class="tk" d="${ticks.map((t) => `M${X(t)} 262v5`).join("")}M51 262h5M51 151h5M51 40h5"/>
        <g text-anchor="middle">${ticks.map((t) => `<text x="${X(t)}" y="282">${t}</text>`).join("")}</g>
        <text x="${X(1)}" y="302">acid</text><text x="${X(7)}" y="302" text-anchor="middle">neutral</text><text x="392" y="302" text-anchor="end">alkali · pH</text>
        ${marker(X, Y, st.ph, r)}
        ${closeUp(enz.shape)}`;
      setSite(svg, enz.shape, d, enz.name, E.siteShort(d));
      slider.value = st.ph; slider.style.setProperty("--pct", `${((st.ph - 1) / 12) * 100}%`);
      $("[data-ph-out]", lab).textContent = st.ph.toFixed(1);
      res.innerHTML = rows([["Activity", pct(r)], ["pH", st.ph.toFixed(1)], ["Optimum pH", enz.opt], ["Active site", E.siteWord(d)], ["Works in", enz.where]]);

      let head, text, chain;
      if (off <= 0.5) {
        head = chips([["Optimum", "up"]]);
        text = `<h3>${enz.name} at its optimum</h3><p>pH ${st.ph.toFixed(1)} is the optimum for ${enz.name}, which works in <b>${enz.where}</b>. The active site has exactly the right shape for ${enz.sub}, so complexes form fastest.</p>`;
        chain = [`pH ${st.ph.toFixed(1)}`, "optimum", `active site fits ${enz.sub}`, "fastest rate"];
      } else if (d < 0.6) {
        head = chips([[`${off.toFixed(1)} from optimum`, "warn"], ["Supp."]]);
        text = `<h3>Off the optimum: ${pct(r)}</h3><p>The pH is ${st.ph < enz.opt ? "more acidic" : "more alkaline"} than ${enz.name} prefers. The active site starts to change shape, so fewer ${enz.sub} molecules fit and the rate falls.</p>`;
        chain = [`pH ${st.ph < enz.opt ? "below" : "above"} the optimum`, "active site changes shape", "fewer complexes", "slower"];
      } else {
        const stomach = st.enz === "amylase" && st.ph <= 3;
        head = chips([["Denatured", "down"], ["Supp."]]);
        text = `<h3>${enz.name} denatured at pH ${st.ph.toFixed(1)}</h3><p>${stomach ? "This is what happens to amylase from saliva once it is swallowed into the acidic stomach: starch digestion stops. " : ""}The active site has lost its shape, ${enz.sub} is no longer complementary to it, and no complexes form.</p>`;
        chain = [`pH ${st.ph.toFixed(1)}`, "far from the optimum", "active site loses its shape", "denatured"];
      }
      exp.innerHTML = head + text + flow(chain);
    }
    $$("[data-enz]", lab).forEach((b) => b.addEventListener("click", () => { st.enz = b.dataset.enz; render(); }));
    slider.addEventListener("input", () => { st.ph = +slider.value; render(); });
    $("[data-reset]", lab).addEventListener("click", () => { st = { enz: "amylase", ph: 7 }; render(); });
    lab.applyState = (s) => { st = { ...st, ...s }; render(); };
    render();
  }

  /* ---------- Header drawings ---------- */
  const ART = {
    fit: () => `<g transform="translate(100 112) scale(.82)"><path class="subs" d="${E.substratePath("round")}" transform="translate(0 -26)"/><path class="enz" d="${E.enzymePath("round")}"/></g>`,
    temp: () => {
      const X = (T) => 14 + (T / 70) * 176, Y = (r) => 124 - r * 104;
      const l = E.curve((T) => E.rateT(T), 0, 70, X, Y, 1);
      return `<path class="area" d="${l}L190 124H14Z"/><path class="plot" d="${l}"/><path class="ax" d="M14 10V124H194"/>`;
    },
    ph: () => {
      const X = (p) => 14 + ((p - 1) / 12) * 176, Y = (r) => 124 - r * 104;
      return ["protease", "amylase", "lipase"].map((n, i) => `<path class="plot${i === 1 ? "" : " dim"}" d="${E.curve((p) => E.ratePH(p, E.ENZ[n].opt), 1, 13, X, Y, 0.25)}"/>`).join("") + `<path class="ax" d="M14 10V124H194"/>`;
    }
  };
  $$("svg[data-art]").forEach((svg) => (svg.innerHTML = ART[svg.dataset.art]()));

  const LABS = { fit: fitLab, temp: tempLab, ph: phLab };
  $$("[data-lab]").forEach((lab) => LABS[lab.dataset.mode]?.(lab));
})();
