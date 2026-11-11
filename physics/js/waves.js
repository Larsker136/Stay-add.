/* ==========================================================================
   stay add. — Physics topic 3, Waves, light and sound: the labs
   wave      a transverse or longitudinal wave: frequency, amplitude, speed
   refract   a ray entering or leaving a glass block; critical angle and total
             internal reflection
   lens      a converging lens: move the object and see where the image forms
   spectrum  slide along the electromagnetic spectrum
   sound     pitch and loudness on a trace, plus an echo calculation
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString(), f2 = (n) => (Math.round(n * 100) / 100).toString();
  const deg = Math.PI / 180;

  /* ---------- wave ---------- */
  function waveLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { kind: "transverse", f: 2, A: 40, v: 120 }, t = 0;
    function draw() {
      const lam = st.v / st.f, px = 1.2; // 1 cm = 1.2 px on screen
      let d = "";
      if (st.kind === "transverse") {
        for (let x = 0; x <= 600; x += 3) d += `${x ? "L" : "M"}${20 + x} ${140 - st.A * Math.sin((2 * Math.PI * (x / px)) / lam - 2 * Math.PI * st.f * t)}`;
        svg.innerHTML = `<path class="guide" d="M20 140H620"/><path class="plot" style="stroke:var(--c-phys)" d="${d}"/>
          <path class="l cr" d="M${20 + lam * px * 0.25} 140V${140 - st.A}"/><text x="${24 + lam * px * 0.25}" y="${140 - st.A / 2}" class="tc cr">amplitude</text>
          <path class="l cg" d="M20 250h${lam * px}"/><path class="l cg" d="M20 244v12M${20 + lam * px} 244v12"/><text x="${20 + (lam * px) / 2}" y="270" text-anchor="middle" class="tc cg">wavelength λ = ${f1(lam)} cm</text>
          <text x="620" y="30" text-anchor="end">particles move up and down; the wave moves →</text>`;
      } else {
        let lines = "";
        for (let i = 0; i < 70; i++) { const x0 = 20 + i * 8.6, x = x0 + (st.A / 4) * Math.sin((2 * Math.PI * (x0 / px)) / lam - 2 * Math.PI * st.f * t); lines += `M${x.toFixed(1)} 90V190`; }
        svg.innerHTML = `<path class="l" style="--fc:var(--c-phys);--lw:2" d="${lines}"/>
          <path class="l cg" d="M20 230h${lam * px}"/><path class="l cg" d="M20 224v12M${20 + lam * px} 224v12"/><text x="${20 + (lam * px) / 2}" y="252" text-anchor="middle" class="tc cg">wavelength λ = ${f1(lam)} cm</text>
          <text x="20" y="74">compressions (close together) and rarefactions (spread out)</text><text x="620" y="74" text-anchor="end">particles move back and forth ↔</text>`;
      }
      res.innerHTML = rows([["frequency f", `${st.f} Hz`], ["wave speed v", `${st.v} cm/s`], ["wavelength λ = v / f", `${f1(lam)} cm`], ["period T = 1 / f", `${f2(1 / st.f)} s`]]);
    }
    function explain() {
      exp.innerHTML = chips([[st.kind === "transverse" ? "Transverse" : "Longitudinal"], [`v = f λ`]]) + (st.kind === "transverse"
        ? `<h3>Vibrations at right angles to the direction of travel</h3><p>In a <b>transverse</b> wave (light, all electromagnetic waves, waves on water and strings) the vibrations are <b>perpendicular</b> to the direction the energy travels. Waves transfer <b>energy</b>, not matter.</p>`
        : `<h3>Vibrations along the direction of travel</h3><p>In a <b>longitudinal</b> wave (sound, seismic P-waves) the vibrations are <b>parallel</b> to the direction of travel, making compressions and rarefactions.</p>`) +
        `<p>At a fixed speed, a higher frequency means a shorter wavelength: v = f λ.</p>` + flow(["frequency f (Hz)", "× wavelength λ (m)", "= wave speed v (m/s)"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { kind: "transverse", f: 2, A: 40, v: 120 }); paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { t += 0.016; draw(); }, 30);
  }

  /* ---------- refraction and total internal reflection ---------- */
  function refractLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const N = { glass: 1.5, water: 1.33, diamond: 2.42 };
    let st = { i: 40, mat: "glass", dir: "in" };
    function draw() {
      const n = N[st.mat], cx = 320, cy = 150, L = 170, inside = st.dir === "out";
      const n1 = inside ? n : 1, n2 = inside ? 1 : n, s = (n1 / n2) * Math.sin(st.i * deg), tir = s > 1, crit = Math.asin(1 / n) / deg;
      const r = tir ? null : Math.asin(s) / deg;
      const ix = cx - L * Math.sin(st.i * deg), iy = inside ? cy + L * Math.cos(st.i * deg) : cy - L * Math.cos(st.i * deg);
      const rx = cx + L * Math.sin(st.i * deg), ry = iy;   // reflected ray
      let out = "";
      if (!tir) { const tx = cx + L * Math.sin(r * deg), ty = inside ? cy - L * Math.cos(r * deg) : cy + L * Math.cos(r * deg); out = `<path class="ray" d="M${cx} ${cy}L${tx} ${ty}"/><text x="${tx + 6}" y="${ty}" class="tc ca">r = ${f1(r)}°</text>`; }
      svg.innerHTML = `<rect class="f cb lt" x="20" y="${inside ? 20 : cy}" width="600" height="130" style="--fc:var(--teal)"/>
        <path class="l" d="M20 ${cy}H620"/><path class="guide" d="M${cx} 10V290"/>
        <path class="ray" style="stroke-width:3" d="M${ix} ${iy}L${cx} ${cy}"/>
        <path class="ray dash" style="opacity:${tir ? 1 : 0.35};stroke-width:${tir ? 3 : 1.5}" d="M${cx} ${cy}L${rx} ${ry}"/>${out}
        <text x="${ix - 6}" y="${iy}" text-anchor="end" class="tc ca">i = ${st.i}°</text>
        <text x="30" y="${inside ? cy + 22 : cy - 10}">air · n = 1.00</text><text x="30" y="${inside ? cy - 10 : cy + 22}">${st.mat} · n = ${n}</text>
        ${tir ? `<text x="${cx + 10}" y="${inside ? cy + 40 : cy - 40}" class="tc cr">total internal reflection</text>` : ""}`;
      res.innerHTML = rows([["angle of incidence i", `${st.i}°`], ["angle of refraction r", tir ? "—" : `${f1(r)}°`], ["refractive index n", n], ["critical angle (" + st.mat + " → air)", `${f1(crit)}°`]]);
      exp.innerHTML = (tir ? chips([["Total internal reflection", "warn"]]) : chips([["Refraction"], [inside ? "bends away from normal" : "bends towards normal"]])) +
        (tir ? `<h3>Above the critical angle: all of the light reflects</h3><p>Going from ${st.mat} into air, if the angle of incidence is greater than the <b>critical angle</b> (${f1(crit)}°) no light gets out — it is all reflected inside. <b>Optical fibres</b> use this to carry light (and data) round bends. sin c = 1 / n.</p>`
          : `<h3>Light changes speed and bends</h3><p>Light slows down in a denser medium, so it <b>bends towards the normal</b> going in and <b>away from the normal</b> coming out. The refractive index n = sin i / sin r (going from air into the material). ${inside ? `Increase i past ${f1(crit)}° to see total internal reflection.` : ""}</p>`) +
        flow(["light enters denser medium", "slows down", "bends towards the normal", "n = sin i / sin r"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { i: 40, mat: "glass", dir: "in" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- converging lens ---------- */
  function lensLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { u: 30, f: 10 };
    function draw() {
      const S = 7, cx = 340, cy = 150, h = 40, F = st.f * S, U = st.u * S;
      const v = (st.f * st.u) / (st.u - st.f), V = v * S, m = -v / st.u, real = st.u > st.f, inf = Math.abs(st.u - st.f) < 0.01;
      const ox = cx - U, top = cy - h, ix = cx + V, ih = cy - h * m;
      let rays = "";
      // ray 1: parallel to the axis, then through the far focus; ray 2: straight through the centre
      if (!inf) {
        if (real) rays = `<path class="ray" d="M${ox} ${top}H${cx}L${ix} ${ih}"/><path class="ray" d="M${ox} ${top}L${ix} ${ih}"/>`;
        else rays = `<path class="ray" d="M${ox} ${top}H${cx}L${cx + 260} ${cy - h + (260 * h) / F}"/><path class="ray" d="M${ox} ${top}L${cx + 260} ${cy + (260 * (cy - top)) / U}"/><path class="ray dash" d="M${cx} ${top}L${ix} ${ih}"/><path class="ray dash" d="M${ox} ${top}L${ix} ${ih}"/>`;
      }
      svg.innerHTML = `<path class="guide" d="M10 ${cy}H630"/><path class="lens" d="M${cx} 40Q${cx + 16} ${cy} ${cx} 260Q${cx - 16} ${cy} ${cx} 40Z"/>
        <circle class="pt" cx="${cx - F}" cy="${cy}" r="3"/><circle class="pt" cx="${cx + F}" cy="${cy}" r="3"/><text x="${cx - F}" y="${cy + 18}" text-anchor="middle">F</text><text x="${cx + F}" y="${cy + 18}" text-anchor="middle">F</text>
        <path class="vec" style="--fc:var(--blue)" d="M${ox} ${cy}V${top}"/><text x="${ox}" y="${cy + 18}" text-anchor="middle" class="tc cb">object</text>
        ${rays}
        ${inf ? "" : `<path class="vec" style="--fc:var(--red);${real ? "" : "stroke-dasharray:4 3"}" d="M${ix} ${cy}V${ih}"/><text x="${ix}" y="${ih + (ih > cy ? 16 : -6)}" text-anchor="middle" class="tc cr">${real ? "real" : "virtual"} image</text>`}`;
      res.innerHTML = rows([["object distance u", `${st.u} cm`], ["focal length f", `${st.f} cm`], ["image", inf ? "at infinity" : real ? "real, inverted" : "virtual, upright"], ["image distance", inf ? "—" : `${f1(Math.abs(v))} cm ${real ? "behind the lens" : "same side as object"}`], ["magnification", inf ? "—" : `${f2(Math.abs(m))}×`]]);
      const kind = inf ? "No image (rays parallel)" : !real ? "Magnifying glass" : st.u > 2 * st.f ? "Camera / eye" : "Projector";
      exp.innerHTML = chips([[kind]]) + (inf ? `<h3>Object at the focal point</h3><p>The rays leave the lens parallel and never meet: no image.</p>`
        : real ? `<h3>A real, inverted image</h3><p>Rays parallel to the axis are refracted through the <b>principal focus</b> F. The image forms where the rays actually meet, so it can be shown on a screen: <b>real</b> and <b>inverted</b>. ${st.u > 2 * st.f ? "Beyond 2F it is diminished — like in a camera or the eye." : "Between F and 2F it is magnified — like in a projector."}</p>`
        : `<h3>Closer than F: a virtual, magnified image</h3><p>The rays spread out after the lens; traced back (dashed) they appear to come from an upright, magnified image on the same side as the object. It can’t be put on a screen: <b>virtual</b>. This is how a <b>magnifying glass</b> works.</p>`) + flow(["ray parallel to the axis → through F", "ray through the centre → straight on", "where they cross: the image"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { u: 30, f: 10 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- electromagnetic spectrum ---------- */
  function spectrumLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const R = [
      ["radio waves", 1e-1, 1e4, "radio and TV broadcasting, astronomy, RFID", "large exposure may heat tissue (very low risk)", "cb"],
      ["microwaves", 1e-3, 1e-1, "satellite TV, mobile phones, wi-fi, microwave ovens", "internal heating of body cells", "ct"],
      ["infrared", 7e-7, 1e-3, "remote controls, thermal imaging, optical fibres, cooking, intruder alarms", "skin burns", "cr"],
      ["visible light", 4e-7, 7e-7, "vision, photography, illumination", "very bright light can damage the eyes", "cg"],
      ["ultraviolet", 1e-8, 4e-7, "security marking, detecting fake bank notes, sterilising water", "damage to eyes and skin, skin cancer", "cv"],
      ["X-rays", 1e-11, 1e-8, "medical imaging, security scanners", "mutation or damage to cells, cancer", "ca"],
      ["gamma rays", 1e-14, 1e-11, "sterilising food and medical equipment, cancer treatment", "mutation or damage to cells, cancer", "cp"]
    ];
    let st = { log: -6.5 };
    function draw() {
      const lam = 10 ** st.log, reg = R.find(([, a, b]) => lam >= a && lam < b) || (lam >= 1e4 ? R[0] : R[6]), f = 3e8 / lam;
      const X = (l) => 600 - ((Math.log10(l) + 14) / 18) * 560;
      svg.innerHTML = R.map(([n, a, b, , , c]) => `<rect class="f ${c} ${reg[0] === n ? "dk" : ""}" x="${X(Math.min(b, 1e4))}" y="70" width="${X(a) - X(Math.min(b, 1e4))}" height="60"/><text x="${(X(a) + X(Math.min(b, 1e4))) / 2}" y="104" text-anchor="middle" style="font-size:${n === "visible light" ? 8 : 10}px">${n === "visible light" ? "vis" : n.split(" ")[0]}</text>`).join("") +
        `<path class="l w3" style="--fc:var(--ink)" d="M${X(lam)} 52V148"/><text x="${X(lam)}" y="44" text-anchor="middle" class="k">λ = ${lam.toExponential(1)} m</text>
         <text x="40" y="176">← longer wavelength, lower frequency</text><text x="600" y="176" text-anchor="end">shorter wavelength, higher frequency →</text>
         <text x="320" y="210" text-anchor="middle" class="ser">all travel at 3.0 × 10⁸ m/s in a vacuum</text>`;
      res.innerHTML = rows([["region", reg[0]], ["wavelength", `${lam.toExponential(2)} m`], ["frequency f = c / λ", `${f.toExponential(2)} Hz`]]);
      exp.innerHTML = chips([[reg[0]]]) + `<h3>${reg[0].charAt(0).toUpperCase() + reg[0].slice(1)}</h3><p><b>Uses:</b> ${reg[3]}.</p><p><b>Dangers:</b> ${reg[4]}.</p><p>All electromagnetic waves are <b>transverse</b> and travel at the same speed in a vacuum. Towards gamma, the frequency — and the energy, and the danger — increase.</p>` + flow(["radio", "microwave", "infrared", "visible", "ultraviolet", "X-ray", "gamma"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.log = -6.5; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- sound ---------- */
  function soundLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { f: 440, A: 60, echo: 1.2 };
    function draw() {
      const cycles = Math.min(60, st.f / 50);
      let d = ""; for (let x = 0; x <= 560; x += 1) d += `${x ? "L" : "M"}${40 + x} ${120 - st.A * Math.sin((x / 560) * cycles * 2 * Math.PI)}`;
      const audible = st.f >= 20 && st.f <= 20000;
      svg.innerHTML = `<rect class="f lt" x="40" y="30" width="560" height="180"/><path class="gl" d="M40 120H600"/><path class="plot" style="stroke:var(--c-phys)" d="${d}"/>
        <text x="40" y="22" class="k">oscilloscope trace (same time across)</text><text x="600" y="232" text-anchor="end">${audible ? "audible to humans" : st.f > 20000 ? "ultrasound — too high to hear" : "too low to hear"}</text>`;
      const dist = (330 * st.echo) / 2;
      res.innerHTML = rows([["frequency (pitch)", `${st.f} Hz`], ["amplitude (loudness)", st.A > 70 ? "loud" : st.A > 35 ? "medium" : "quiet"], ["wavelength in air (v = 330 m/s)", `${f2(330 / st.f)} m`], ["echo after " + st.echo + " s → wall distance", `${f1(dist)} m`]]);
      exp.innerHTML = chips([[audible ? "Audible" : "Not audible", audible ? "up" : "warn"]]) + `<h3>Higher frequency = higher pitch; bigger amplitude = louder</h3><p>Sound is a <b>longitudinal</b> wave made by vibrating objects; it needs a <b>medium</b> and can’t travel through a vacuum. Humans hear about <b>20 Hz to 20 000 Hz</b>; above that is <b>ultrasound</b>. Sound travels faster in solids than liquids, and faster in liquids than gases (about 330–350 m/s in air). An <b>echo</b> travels to the wall and back, so distance = speed × time ÷ 2.</p>` + flow(["vibration", "compressions and rarefactions", "frequency → pitch", "amplitude → loudness"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { f: 440, A: 60, echo: 1.2 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ wave: waveLab, refract: refractLab, lens: lensLab, spectrum: spectrumLab, sound: soundLab });
})();
