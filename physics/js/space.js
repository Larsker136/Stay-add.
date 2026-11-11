/* ==========================================================================
   stay add. — Physics topic 6, Space physics: the labs
   orbit   planets of the Solar System orbiting the Sun; orbital speed from
           v = 2πr / T, further out = slower
   star    the life cycle of a star, for a Sun-like star or a massive one
   hubble  galaxies receding: redshift, v = H₀ d and the age of the Universe
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;
  const f1 = (n) => (Math.round(n * 10) / 10).toString();

  /* ---------- orbits ---------- */
  function orbitLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // distance from the Sun (million km), orbital period (Earth days), surface g (N/kg), colour class
    const P = { Mercury: [58, 88, 3.7, "ca"], Venus: [108, 225, 8.9, "cp"], Earth: [150, 365, 9.8, "cb"], Mars: [228, 687, 3.7, "cr"], Jupiter: [778, 4333, 24.8, "ca"], Saturn: [1430, 10759, 10.4, "ct"], Uranus: [2870, 30687, 8.9, "ct"], Neptune: [4500, 60190, 11.2, "cb"] };
    let st = { p: "Earth" }, t = 0;
    const r = (d) => 16 + Math.sqrt(d) * 3.2;
    function draw() {
      let s = `<circle class="f ca dk" cx="320" cy="150" r="12"/>`;
      for (const [n, [d, T, , c]] of Object.entries(P)) {
        const R = r(d), a = (t / T) * 2 * Math.PI * 60;
        s += `<ellipse class="l" style="--fc:var(--line-2);--lw:1" cx="320" cy="150" rx="${R}" ry="${R * 0.55}"/><circle class="f ${c} dk" cx="${320 + R * Math.cos(a)}" cy="${150 + R * Math.sin(a) * 0.55}" r="${n === st.p ? 7 : 4}"/>`;
        if (n === st.p) s += `<text x="${320 + R * Math.cos(a) + 10}" y="${150 + R * Math.sin(a) * 0.55 - 8}" class="k">${n}</text>`;
      }
      svg.innerHTML = s;
    }
    function explain() {
      const [d, T, g] = P[st.p], v = (2 * Math.PI * d * 1e9) / (T * 86400) / 1000;
      res.innerHTML = rows([["distance from the Sun", `${d} million km`], ["orbital period", `${T.toLocaleString()} days`], ["orbital speed v = 2πr / T", `${f1(v)} km/s`], ["surface gravity", `${g} N/kg`]]);
      exp.innerHTML = chips([[st.p], [`${f1(v)} km/s`]]) + `<h3>Further from the Sun: weaker gravity, slower orbit</h3><p>The planets orbit the Sun because of its <b>gravitational attraction</b>. Further out the Sun’s gravitational field is weaker, so planets move <b>more slowly</b> and have <b>longer orbits</b>. Average orbital speed v = 2πr / T. The four inner planets are small and rocky; the four outer ones are large gas giants.</p>` + flow(["further out", "weaker gravitational field", "slower orbital speed", "longer period"]);
    }
    const paint = controls(lab, st, () => { paint(); explain(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.p = "Earth"; paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { t += 0.4; draw(); }, 40);
  }

  /* ---------- life cycle of a star ---------- */
  function starLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const PATH = {
      sun: [["nebula", "a cloud of dust and gas pulled together by gravity", 46, "cv"], ["protostar", "it heats up as it collapses", 26, "cr"], ["main sequence star", "hydrogen fuses to helium; inward gravity balances outward pressure — stable for billions of years", 22, "ca"], ["red giant", "hydrogen in the core runs out; it expands and cools", 44, "cr"], ["white dwarf", "the outer layers drift away as a planetary nebula, leaving a small, hot, dense core: a white dwarf", 12, "cb"]],
      massive: [["nebula", "a cloud of dust and gas pulled together by gravity", 46, "cv"], ["protostar", "it heats up as it collapses", 30, "cr"], ["main sequence star", "fuses hydrogen much faster; shorter life", 30, "cb"], ["red supergiant", "expands enormously once core hydrogen runs out", 58, "cr"], ["supernova", "the core collapses and the star explodes, making heavier elements", 64, "ca"], ["neutron star or black hole", "the remaining core: extremely dense (a black hole if the star was very massive)", 10, "cv"]]
    };
    let st = { mass: "sun", stage: 2 };
    function draw() {
      const p = PATH[st.mass], n = p.length; if (st.stage >= n) st.stage = n - 1;
      svg.innerHTML = p.map(([name, , R, c], i) => { const x = 80 + i * (480 / (n - 1)); return `<circle class="f ${c} ${i === st.stage ? "dk" : "lt"}" cx="${x}" cy="120" r="${R * 0.7}"/><text x="${x}" y="${200 + (i % 2) * 16}" text-anchor="middle" class="${i === st.stage ? "k" : ""}" style="font-size:9.5px">${name}</text>`; }).join("") +
        `<path class="guide" d="M60 240H580"/><text x="60" y="262">time →</text>`;
      const [name, what] = p[st.stage];
      res.innerHTML = rows([["star", st.mass === "sun" ? "about the Sun’s mass" : "much more massive (≥ 8 Suns)"], ["stage", `${st.stage + 1} of ${n}`], ["now", name]]);
      exp.innerHTML = chips([[name]]) + `<h3>${name.charAt(0).toUpperCase() + name.slice(1)}</h3><p>${what}.</p><p>Stars form from interstellar clouds of gas and dust. What happens at the end depends on the star’s <b>mass</b>: a Sun-like star becomes a red giant and then a white dwarf; a much more massive star becomes a red supergiant, explodes as a <b>supernova</b>, and leaves a <b>neutron star</b> or a <b>black hole</b>. The material from a supernova can form new stars and planets.</p>` + flow(PATH[st.mass].map((s) => s[0]));
    }
    $("[data-next]", lab).addEventListener("click", () => { st.stage = Math.min(PATH[st.mass].length - 1, st.stage + 1); paint(); draw(); });
    $("[data-prev]", lab).addEventListener("click", () => { st.stage = Math.max(0, st.stage - 1); paint(); draw(); });
    const paint = controls(lab, st, (k) => { if (k === "mass") st.stage = 0; paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { mass: "sun", stage: 2 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- redshift and Hubble's law ---------- */
  function hubbleLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const H0 = 2.2e-18;   // per second
    let st = { d: 400 };  // million light-years
    function draw() {
      const dm = st.d * 9.46e21, v = H0 * dm, z = v / 3e8, shift = Math.min(1, z * 8);
      const lines = [434, 486, 656].map((l) => { const x0 = 40 + ((l - 380) / 380) * 560, x1 = 40 + ((l * (1 + z) - 380) / 380) * 560; return `<path class="l" style="--fc:var(--ink);--lw:2" d="M${x0} 40V80"/><path class="l" style="--fc:var(--ink);--lw:2" d="M${Math.min(600, x1)} 120V160"/>`; }).join("");
      svg.innerHTML = `<defs><linearGradient id="spec"><stop offset="0" stop-color="#7a3cff"/><stop offset=".25" stop-color="#3c6bff"/><stop offset=".45" stop-color="#2fbf6a"/><stop offset=".65" stop-color="#f2d22e"/><stop offset=".85" stop-color="#f08a2c"/><stop offset="1" stop-color="#d23c2c"/></linearGradient></defs>
        <rect x="40" y="40" width="560" height="40" fill="url(#spec)" opacity=".55"/><rect x="40" y="120" width="560" height="40" fill="url(#spec)" opacity=".55"/>${lines}
        <text x="40" y="32" class="k">light from the Sun (lab)</text><text x="40" y="112" class="k">light from a galaxy ${st.d} million light-years away</text>
        <text x="600" y="178" text-anchor="end">lines shifted towards red →</text>
        <path class="ax" d="M60 280H360M60 280V190"/><path class="plot" style="stroke:var(--c-phys)" d="M60 280L360 196"/><circle class="pt" cx="${60 + (st.d / 2000) * 300}" cy="${280 - (st.d / 2000) * 84}" r="5"/><text x="366" y="200">v = H₀ d</text><text x="210" y="298" text-anchor="middle">distance</text>`;
      res.innerHTML = rows([["distance d", `${st.d} million light-years`], ["recession speed v = H₀ d", `${Math.round(v / 1000).toLocaleString()} km/s`], ["H₀ (syllabus value)", "2.2 × 10⁻¹⁸ /s"], ["age of the Universe ≈ 1 / H₀", `${(1 / H0 / 3.15e16).toFixed(1)} billion years`]]);
      exp.innerHTML = chips([["Redshift"], [`${Math.round(v / 1000).toLocaleString()} km/s`]]) + `<h3>Further galaxies move away faster</h3><p>Light from distant galaxies is <b>redshifted</b>: its wavelength is longer than when it was emitted, because the galaxies are moving away. The further the galaxy, the bigger the redshift, so the Universe is <b>expanding</b> — evidence for the <b>Big Bang</b>. The other key evidence is the <b>cosmic microwave background radiation</b> (CMBR), left over from the early Universe. <span class="tag-s">Supp.</span> v = H₀ d, and the age of the Universe ≈ d / v = 1 / H₀.</p>` + flow(["galaxy moving away", "wavelength stretched", "redshift", "further → faster → expanding Universe"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.d = 400; paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ orbit: orbitLab, star: starLab, hubble: hubbleLab });
})();
