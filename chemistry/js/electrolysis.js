/* ==========================================================================
   stay add. — Electrolysis labs
   (Topic switching, the step rail and the Interpret chains are the shared
   lesson form in assets/js/lesson.js.)
   One electrolytic cell per topic. Ions drift to the electrodes; the
   anode releases electrons, they travel round the wire, and the cathode can
   only discharge a cation once those electrons arrive — the same story the
   half-equations tell. "What just happened" explains each state.
   The chains reach a lab through lab.applyState(state).
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  /* =======================================================================
     The electrolytic cell
     ======================================================================= */
  const SPECIES = {
    Pb: { txt: "Pb", sign: "cat", cls: "p-cat", r: 11, q: 2, full: "Pb²⁺", name: "lead ion" },
    Br: { txt: "Br", sign: "an", cls: "p-an", r: 10, q: 1, full: "Br⁻", name: "bromide ion" },
    Na: { txt: "Na", sign: "cat", cls: "p-cat", r: 10, q: 1, full: "Na⁺", name: "sodium ion" },
    Cl: { txt: "Cl", sign: "an", cls: "p-an", r: 10, q: 1, full: "Cl⁻", name: "chloride ion" },
    H: { txt: "H", sign: "cat", cls: "p-h", r: 6.5, q: 1, full: "H⁺", name: "hydrogen ion", dark: true },
    OH: { txt: "OH", sign: "an", cls: "p-oh", r: 8, q: 1, full: "OH⁻", name: "hydroxide ion", dark: true },
    SO4: { txt: "SO₄", sign: "an", cls: "p-an", r: 12, q: 2, full: "SO₄²⁻", name: "sulfate ion" },
    Cu: { txt: "Cu", sign: "cat", cls: "p-cat", r: 10, q: 2, full: "Cu²⁺", name: "copper(II) ion" }
  };
  const COPPER = "#b5683a", LEAD = "#8e9097";
  const STAY = {
    Na: "It reached the cathode but was <b>not discharged</b>: sodium is more reactive than hydrogen, so H⁺ ions from water take the electrons instead. Na⁺ stays in solution.",
    SO4: "It reached the anode but was <b>not discharged</b>: sulfate is not a halide, so OH⁻ ions give up electrons instead and oxygen forms.",
    ClDil: "It reached the anode but was <b>not discharged</b>: the chloride is dilute, so OH⁻ ions give up electrons instead and oxygen forms.",
    SO4cu: "It reached the anode but was <b>not discharged</b>: with a copper anode, copper atoms lose electrons more easily than any ion in the solution."
  };
  const CELLS = {
    pbbr2: {
      label: "Lead(II) bromide", liquid: "color-mix(in srgb, var(--amber) 7%, transparent)",
      ions: [{ sp: "Pb", n: 9, on: true }, { sp: "Br", n: 18, on: true }],
      cathode: { kind: "pool", prod: "lead", obs: "a silvery-grey bead of molten lead" },
      anode: { kind: "gas", color: "#9a3b14", per: 2, prod: "bromine", obs: "red-brown bromine gas" },
      title: "Lead at the cathode, bromine at the anode",
      text: "Molten lead(II) bromide contains only Pb²⁺ and Br⁻ ions, so there is no choice: the metal forms at the cathode and the non-metal at the anode.",
      flow: ["Molten PbBr₂", "ions move", "lead at the cathode", "bromine at the anode"],
      story: {
        Pb: "At the cathode it <b>gained 2 electrons</b> and became a lead atom: <span class=num>Pb²⁺ + 2e⁻ → Pb</span>. Gaining electrons is <b>reduction</b>.",
        Br: "At the anode it <b>lost 1 electron</b>; two bromine atoms paired up: <span class=num>2Br⁻ → Br₂ + 2e⁻</span>. Losing electrons is <b>oxidation</b>."
      }
    },
    nacl: {
      label: "Concentrated sodium chloride", liquid: "color-mix(in srgb, var(--blue) 5%, transparent)",
      ions: [{ sp: "Na", n: 9, on: false }, { sp: "Cl", n: 12, on: true }, { sp: "H", n: 6, on: true }, { sp: "OH", n: 4, on: false }],
      cathode: { kind: "gas", per: 2, prod: "hydrogen", obs: "bubbles of colourless gas" },
      anode: { kind: "gas", color: "#a9b83c", per: 2, prod: "chlorine", obs: "pale yellow-green gas" },
      title: "Hydrogen at the cathode, chlorine at the anode",
      text: "At the cathode, Na⁺ and H⁺ arrive — sodium is more reactive than hydrogen, so <b>hydrogen</b> forms. At the anode, Cl⁻ and OH⁻ arrive — the chloride is concentrated, so <b>chlorine</b> forms. Na⁺ and OH⁻ are left behind as sodium hydroxide.",
      flow: ["Concentrated NaCl(aq)", "hydrogen at the cathode", "chlorine at the anode", "sodium hydroxide left"],
      story: { Na: STAY.Na, Cl: "At the anode it <b>lost 1 electron</b>: <span class=num>2Cl⁻ → Cl₂ + 2e⁻</span>. The chloride is concentrated, so chlorine forms rather than oxygen." }
    },
    nacld: {
      label: "Dilute sodium chloride", liquid: "color-mix(in srgb, var(--blue) 4%, transparent)",
      ions: [{ sp: "Na", n: 5, on: false }, { sp: "Cl", n: 4, on: false }, { sp: "H", n: 8, on: true }, { sp: "OH", n: 8, on: true }],
      cathode: { kind: "gas", per: 2, prod: "hydrogen", obs: "bubbles of colourless gas" },
      anode: { kind: "gas", per: 4, prod: "oxygen", obs: "bubbles of colourless gas" },
      title: "Hydrogen at the cathode, oxygen at the anode",
      text: "The cathode is the same as before: <b>hydrogen</b>. But the chloride is now dilute, so OH⁻ ions are discharged at the anode and <b>oxygen</b> forms. In effect, water is being split.",
      flow: ["Dilute NaCl(aq)", "chloride too dilute", "hydrogen at the cathode", "oxygen at the anode"],
      story: { Na: STAY.Na, Cl: STAY.ClDil }
    },
    h2so4: {
      label: "Dilute sulfuric acid", liquid: "color-mix(in srgb, var(--blue) 4%, transparent)",
      ions: [{ sp: "H", n: 14, on: true }, { sp: "SO4", n: 6, on: false }, { sp: "OH", n: 6, on: true }],
      cathode: { kind: "gas", per: 2, prod: "hydrogen", obs: "bubbles of colourless gas" },
      anode: { kind: "gas", per: 4, prod: "oxygen", obs: "bubbles of colourless gas" },
      title: "Hydrogen and oxygen, in a 2 : 1 ratio",
      text: "H⁺ is the only cation, so <b>hydrogen</b> forms at the cathode. Sulfate is not a halide, so OH⁻ is discharged and <b>oxygen</b> forms at the anode. About twice as much hydrogen as oxygen is made — count the bubbles.",
      flow: ["Dilute sulfuric acid", "sulfate is not a halide", "hydrogen and oxygen", "twice as much hydrogen"],
      story: { H: "At the cathode it <b>gained 1 electron</b>; two hydrogen atoms paired up: <span class=num>2H⁺ + 2e⁻ → H₂</span> (reduction).", SO4: STAY.SO4 }
    },
    cuso4c: {
      label: "Copper(II) sulfate, carbon electrodes", liquid: "color-mix(in srgb, var(--blue) 22%, transparent)", fades: "Cu",
      ions: [{ sp: "Cu", n: 10, on: true }, { sp: "SO4", n: 10, on: false }, { sp: "H", n: 3, on: false }, { sp: "OH", n: 5, on: true }],
      cathode: { kind: "coat", prod: "copper", obs: "a pink-brown coating of copper" },
      anode: { kind: "gas", per: 4, prod: "oxygen", obs: "bubbles of colourless gas" },
      title: "Copper at the cathode, oxygen at the anode",
      text: "Copper is less reactive than hydrogen, so <b>copper</b> coats the cathode. Sulfate is not a halide, so <b>oxygen</b> forms at the anode. The blue colour fades as Cu²⁺ ions are used up.",
      flow: ["Copper(II) sulfate", "copper at the cathode", "oxygen at the anode", "blue colour fades"],
      story: { Cu: "At the cathode it <b>gained 2 electrons</b>: <span class=num>Cu²⁺ + 2e⁻ → Cu</span>. Copper is less reactive than hydrogen, so copper forms.", SO4: STAY.SO4 }
    },
    cuso4cu: {
      label: "Copper(II) sulfate, copper electrodes", liquid: "color-mix(in srgb, var(--blue) 22%, transparent)", copperElectrodes: true,
      ions: [{ sp: "Cu", n: 10, on: true }, { sp: "SO4", n: 10, on: false }, { sp: "H", n: 3, on: false }, { sp: "OH", n: 4, on: false }],
      cathode: { kind: "coat", prod: "copper", obs: "copper builds up; the cathode gains mass" },
      anode: { kind: "dissolve", prod: "copper dissolves", obs: "the anode gets thinner; it loses mass" },
      title: "Copper moves from the anode to the cathode",
      text: "The copper anode loses electrons and dissolves as Cu²⁺; at the cathode Cu²⁺ gains electrons and copper builds up. The <b>blue colour stays the same</b>. This is how copper is purified — and how objects are electroplated.",
      flow: ["Copper anode", "Cu → Cu²⁺ + 2e⁻", "Cu²⁺ + 2e⁻ → Cu", "copper on the cathode"],
      story: { Cu: "At the cathode it <b>gained 2 electrons</b>: <span class=num>Cu²⁺ + 2e⁻ → Cu</span>. New Cu²⁺ ions keep coming from the dissolving anode.", SO4: STAY.SO4cu }
    }
  };

  function initLab(lab) {
    const svg = $("[data-cell-svg]", lab), results = $("[data-results]", lab), explain = $("[data-explain]", lab);
    const powerBtn = $("[data-power]", lab), followBtn = $("[data-follow]", lab);
    const keys = lab.dataset.configs.split(/\s+/), solidable = lab.hasAttribute("data-solid");
    const LIQ = { x0: 118, x1: 522, y0: 158, y1: 362 };
    const AN = { x0: 190, x1: 210 }, CA = { x0: 430, x1: 450 }, EL_Y0 = 96, EL_Y1 = 300;
    const WIRE = [[200, 96], [200, 38], [280, 38], [360, 38], [440, 38], [440, 96]];
    const segs = WIRE.slice(1).map((p, i) => ({ a: WIRE[i], b: p, len: Math.hypot(p[0] - WIRE[i][0], p[1] - WIRE[i][1]) }));
    const WLEN = segs.reduce((s, x) => s + x.len, 0);
    const along = (d) => { for (const s of segs) { if (d <= s.len) { const k = d / s.len; return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k]; } d -= s.len; } return WIRE[WIRE.length - 1]; };

    let key = keys[0], cfg, matter = solidable ? "solid" : "liquid";
    let ions = [], electrons = [], bubbles = [], power = false, credit = 0, visible = false, last = performance.now();
    let deposit = 0, dissolved = 0, haze = 0, fadeLeft = 1, initialFade = 1, counts = { c: 0, a: 0, e: 0 }, track = null, anodeTimer = 0, g = {};

    function build() {
      cfg = CELLS[key];
      svg.innerHTML = `
        <text x="320" y="12" text-anchor="middle" class="lbl-ink">power supply</text>
        <path class="wire" d="${WIRE.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("")}"/>
        <g data-e></g>
        <rect x="280" y="20" width="80" height="36" rx="4" class="psu"/>
        <text x="292" y="43" class="sign">+</text><text x="342" y="43" class="sign">−</text>
        <text x="320" y="72" text-anchor="middle">electrons: anode → cathode</text>
        <ellipse cx="200" cy="128" rx="78" ry="26" data-haze opacity="0"/>
        <path class="beaker" d="M110 120V352Q110 370 128 370H512Q530 370 530 352V120"/>
        <path class="liquid" data-liq d="M112 150H528V352Q528 368 512 368H128Q112 368 112 352Z"/>
        <ellipse cx="440" cy="362" rx="0" ry="0" data-pool/>
        <rect y="${EL_Y0}" height="${EL_Y1 - EL_Y0}" data-coat/>
        <rect x="${AN.x0}" y="${EL_Y0}" width="${AN.x1 - AN.x0}" height="${EL_Y1 - EL_Y0}" class="electrode" data-anode/>
        <rect x="${CA.x0}" y="${EL_Y0}" width="${CA.x1 - CA.x0}" height="${EL_Y1 - EL_Y0}" class="electrode" data-cathode/>
        <text x="182" y="112" text-anchor="end">anode (+)</text>
        <text x="458" y="112">cathode (−)</text>
        <text x="320" y="146" text-anchor="middle" class="solid-l" data-solid-l></text>
        <g data-ions></g><g data-bub></g>`;
      g = { e: $("[data-e]", svg), ions: $("[data-ions]", svg), bub: $("[data-bub]", svg), haze: $("[data-haze]", svg), liq: $("[data-liq]", svg),
        pool: $("[data-pool]", svg), coat: $("[data-coat]", svg), anode: $("[data-anode]", svg), cathode: $("[data-cathode]", svg), solidL: $("[data-solid-l]", svg) };
      g.liq.style.setProperty("--liq", cfg.liquid);
      if (cfg.copperElectrodes) [g.anode, g.cathode].forEach((r) => (r.style.fill = COPPER));
      g.haze.style.fill = cfg.anode.color || "none";
      g.pool.style.fill = LEAD;
      g.coat.style.fill = COPPER;

      ions = []; electrons = []; bubbles = []; credit = 0; deposit = 0; dissolved = 0; haze = 0; anodeTimer = 0; track = null;
      counts = { c: 0, a: 0, e: 0 };
      cfg.ions.forEach(({ sp, n, on }) => { for (let i = 0; i < n; i++) addIon(sp, on); });
      initialFade = cfg.fades ? ions.filter((i) => i.sp === cfg.fades).length : 1;
      fadeLeft = 1;
      if (matter === "solid") lattice();

      $("[data-key]", lab).innerHTML = cfg.ions.map(({ sp }) => {
        const s = SPECIES[sp], c = s.sign === "cat" ? "--c-cation" : "--c-anion";
        return `<span><i style="${s.dark ? `border:1.5px solid var(${c})` : `background:var(${c})`}"></i>${s.full}</span>`;
      }).join("") + `<span><i style="background:var(--c-electron);width:6px;height:6px"></i>e⁻</span>`;
      $$("[data-pick]", lab).forEach((b) => b.setAttribute("aria-pressed", b.dataset.pick === key));
      $$("[data-matter]", lab).forEach((b) => b.setAttribute("aria-pressed", b.dataset.matter === matter));
      setPower(false);
      followBtn.setAttribute("aria-pressed", "false");
      g.solidL.textContent = matter === "solid" ? "solid — ions held in a lattice" : "";
      render(); update();
    }

    function addIon(sp, on, x, y) {
      const s = SPECIES[sp];
      let px = x, py = y;
      for (let k = 0; px === undefined && k < 40; k++) {
        const tx = rnd(LIQ.x0 + s.r, LIQ.x1 - s.r), ty = rnd(LIQ.y0 + s.r, LIQ.y1 - s.r);
        if ((tx > AN.x0 - s.r - 4 && tx < AN.x1 + s.r + 4 && ty < EL_Y1 + s.r) || (tx > CA.x0 - s.r - 4 && tx < CA.x1 + s.r + 4 && ty < EL_Y1 + s.r)) continue;
        if (ions.some((o) => Math.hypot(o.x - tx, o.y - ty) < o.r + s.r + 2)) continue;
        px = tx; py = ty;
      }
      if (px === undefined) { px = 320; py = 330; }
      const node = el("g", {}, g.ions);
      el("circle", { r: s.r, class: s.cls }, node);
      const t = el("text", { class: `ion-t${s.dark ? " dark" : ""}` }, node);
      t.textContent = s.txt;
      if (s.r < 8) t.style.fontSize = "7px";
      const ion = { sp, s, on, x: px, y: py, vx: rnd(-20, 20), vy: rnd(-20, 20), r: s.r, node, state: "free" };
      ions.push(ion);
      return ion;
    }

    // solid: ions sit on a lattice (alternating where possible) and only vibrate
    function lattice() {
      const spots = [];
      for (let y = 180; y < LIQ.y1 - 8; y += 26)
        for (let x = 134; x < LIQ.x1 - 8; x += 26) {
          if ((x > AN.x0 - 14 && x < AN.x1 + 14 && y < EL_Y1 + 14) || (x > CA.x0 - 14 && x < CA.x1 + 14 && y < EL_Y1 + 14)) continue;
          spots.push([x, y]);
        }
      const cats = ions.filter((i) => i.s.sign === "cat"), ans = ions.filter((i) => i.s.sign === "an");
      const order = [];
      while (cats.length || ans.length) { if (ans.length) order.push(ans.shift()); if (ans.length) order.push(ans.shift()); if (cats.length) order.push(cats.shift()); }
      order.forEach((ion, k) => { const p = spots[Math.round((k * spots.length) / order.length)] || spots[k % spots.length]; ion.hx = ion.x = p[0]; ion.hy = ion.y = p[1]; });
    }

    function setPower(on) {
      power = on;
      powerBtn.textContent = on ? "Switch power off" : "Switch power on";
      powerBtn.setAttribute("aria-pressed", on);
      if (on) ions.forEach((i) => { if (i.state === "arrived") i.state = "free"; });
    }
    function setMatter(m) {
      if (m === matter) return;
      matter = m;
      $$("[data-matter]", lab).forEach((b) => b.setAttribute("aria-pressed", b.dataset.matter === matter));
      g.solidL.textContent = matter === "solid" ? "solid — ions held in a lattice" : "";
      if (matter === "solid") { build(); return; }
      ions.forEach((i) => { i.vx = rnd(-30, 30); i.vy = rnd(-30, 30); });
      update();
    }

    function spawnBubble(x, color, left) {
      const node = el("circle", { r: 3, fill: color || "none", stroke: color || "currentColor", "stroke-width": 1, "fill-opacity": color ? 0.55 : 0 }, g.bub);
      node.style.color = "var(--ink-3)";
      bubbles.push({ node, x: x + (left ? -rnd(2, 8) : rnd(2, 8)), y: rnd(220, 290), r: rnd(2.5, 4.5), vy: rnd(-55, -40), wob: Math.random() * 6 });
    }
    function emitElectrons(n) { for (let k = 0; k < n; k++) electrons.push({ d: -k * 14, node: el("circle", { r: 3, class: "electron" }, g.e) }); }

    function discharge(ion) {
      ion.node.remove();
      ions.splice(ions.indexOf(ion), 1);
      if (track && (track.cat === ion || track.an === ion)) ion.state = "done";
      if (ion.s.sign === "an") {
        counts.a++;
        emitElectrons(ion.s.q);
        if (cfg.anode.kind === "gas" && counts.a % cfg.anode.per === 0) spawnBubble(AN.x1 + 2, cfg.anode.color, false);
        if (cfg.anode.color) haze = Math.min(0.35, haze + 0.015);
      } else {
        counts.c++;
        credit -= ion.s.q;
        if (cfg.cathode.kind === "gas" && counts.c % cfg.cathode.per === 0) spawnBubble(CA.x0 - 2, null, true);
        if (cfg.cathode.kind === "pool") deposit = Math.min(1, deposit + 0.035);
        if (cfg.cathode.kind === "coat") deposit = Math.min(1, deposit + 0.05);
      }
      if (cfg.fades === ion.sp) { fadeLeft = ions.filter((i) => i.sp === cfg.fades).length / initialFade; return; }
      if (cfg.anode.kind === "dissolve" && ion.sp === "Cu") return;   // replaced by the dissolving anode
      const was = cfg;
      setTimeout(() => { if (cfg === was && matter !== "solid") addIon(ion.sp, ion.on); }, 1200);
    }

    function step(dt) {
      const flowing = power && matter !== "solid";
      for (const i of [...ions]) {
        if (matter === "solid") continue;
        i.vx += rnd(-1, 1) * 160 * dt; i.vy += rnd(-1, 1) * 160 * dt;
        i.vx *= 0.96; i.vy *= 0.96;
        const sp = Math.hypot(i.vx, i.vy);
        if (sp > 34) { i.vx = (i.vx / sp) * 34; i.vy = (i.vy / sp) * 34; }
        i.x += (i.vx + (flowing ? (i.s.sign === "cat" ? 30 : -30) : 0)) * dt; i.y += i.vy * dt;
        if (i.x < LIQ.x0 + i.r) { i.x = LIQ.x0 + i.r; i.vx = Math.abs(i.vx); }
        if (i.x > LIQ.x1 - i.r) { i.x = LIQ.x1 - i.r; i.vx = -Math.abs(i.vx); }
        if (i.y < LIQ.y0 + i.r) { i.y = LIQ.y0 + i.r; i.vy = Math.abs(i.vy); }
        if (i.y > LIQ.y1 - i.r) { i.y = LIQ.y1 - i.r; i.vy = -Math.abs(i.vy); }
        const anX0 = AN.x0 + dissolved * 7, anX1 = AN.x1 - dissolved * 7;
        for (const [x0, x1, isCath] of [[anX0, anX1, false], [CA.x0 - deposit * 4, CA.x1 + deposit * 4, true]]) {
          if (i.y > EL_Y1 + i.r || i.x < x0 - i.r || i.x > x1 + i.r) continue;
          const left = i.x < (x0 + x1) / 2;
          i.x = left ? x0 - i.r : x1 + i.r;
          i.vx = left ? -Math.abs(i.vx) : Math.abs(i.vx);
          const mine = isCath ? i.s.sign === "cat" : i.s.sign === "an";
          if (flowing && !mine) { i.vy = Math.max(i.vy, 0) + 60; continue; }   // pulled the other way: slide down and round
          if (!flowing) continue;
          if (!i.on) { i.state = "arrived"; continue; }
          if (isCath && credit < i.s.q) { i.state = "waiting"; continue; }
          discharge(i);
          break;
        }
      }
      if (matter !== "solid") for (let a = 0; a < ions.length; a++) for (let b = a + 1; b < ions.length; b++) {
        const A = ions[a], B = ions[b], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), rs = A.r + B.r + 1;
        if (d > 0 && d < rs) { const k = (rs - d) / 2 / d; A.x -= dx * k; A.y -= dy * k; B.x += dx * k; B.y += dy * k; }
      }
      if (flowing && cfg.anode.kind === "dissolve") {
        anodeTimer += dt;
        if (anodeTimer > 0.9 && dissolved < 1) {
          anodeTimer = 0; dissolved = Math.min(1, dissolved + 0.025); counts.a++;
          emitElectrons(2);
          addIon("Cu", true, AN.x1 + 12, rnd(LIQ.y0 + 16, EL_Y1 - 10));
        }
      }
      for (const e of [...electrons]) {
        e.d += 110 * dt;
        if (e.d >= WLEN) { credit++; counts.e++; e.node.remove(); electrons.splice(electrons.indexOf(e), 1); }
      }
      for (const b of [...bubbles]) {
        b.y += b.vy * dt;
        if (b.y < LIQ.y0 - 6) { b.node.remove(); bubbles.splice(bubbles.indexOf(b), 1); }
      }
    }

    function render() {
      const t = performance.now() / 1000;
      for (const i of ions) {
        const jx = matter === "solid" ? Math.sin(t * 9 + i.hx) * 1.4 : 0, jy = matter === "solid" ? Math.cos(t * 11 + i.hy) * 1.4 : 0;
        i.node.setAttribute("transform", `translate(${(i.x + jx).toFixed(1)} ${(i.y + jy).toFixed(1)})`);
      }
      for (const e of electrons) {
        const [x, y] = along(Math.max(0, e.d));
        e.node.setAttribute("cx", x.toFixed(1)); e.node.setAttribute("cy", y.toFixed(1));
        e.node.style.opacity = e.d < 0 ? 0 : 1;
      }
      for (const b of bubbles) { b.node.setAttribute("cx", (b.x + Math.sin(t * 4 + b.wob) * 1.5).toFixed(1)); b.node.setAttribute("cy", b.y.toFixed(1)); b.node.setAttribute("r", b.r); }
      g.haze.setAttribute("opacity", haze.toFixed(2));
      if (cfg.cathode.kind === "pool") { g.pool.setAttribute("rx", (deposit * 34).toFixed(1)); g.pool.setAttribute("ry", (deposit * 9).toFixed(1)); }
      if (cfg.cathode.kind === "coat") {
        const w = deposit * 4;
        g.coat.setAttribute("x", (CA.x0 - w).toFixed(1)); g.coat.setAttribute("width", (CA.x1 - CA.x0 + 2 * w).toFixed(1));
        g.coat.setAttribute("y", LIQ.y0); g.coat.setAttribute("height", EL_Y1 - LIQ.y0);
      }
      if (cfg.anode.kind === "dissolve") { const s = dissolved * 7; g.anode.setAttribute("x", (AN.x0 + s).toFixed(1)); g.anode.setAttribute("width", (AN.x1 - AN.x0 - 2 * s).toFixed(1)); }
      if (cfg.fades) g.liq.style.setProperty("--liq", `color-mix(in srgb, var(--blue) ${(4 + 18 * fadeLeft).toFixed(1)}%, transparent)`);
      $$(".track", g.ions).forEach((n) => n.remove());
      if (track) for (const k of ["cat", "an"]) { const i = track[k]; if (i && i.state !== "done" && ions.includes(i)) el("circle", { cx: i.x, cy: i.y, r: i.r + 5, class: "track" }, g.ions); }
    }

    // results + "what just happened"
    function update() {
      const row = (k, v) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`;
      const on = power && matter !== "solid", c = cfg.cathode, a = cfg.anode;
      results.innerHTML =
        row("Electrons through the wire", counts.e) +
        row("At the cathode (−)", on || counts.c ? c.prod : "—") +
        row("At the anode (+)", on || counts.a ? a.prod : "—") +
        row("Ions discharged", `${counts.c} + ${a.kind === "dissolve" ? 0 : counts.a}`) +
        (a.kind === "dissolve" ? row("Copper atoms dissolved", counts.a) : "") +
        (cfg.fades || cfg.copperElectrodes ? row("Blue colour", cfg.fades ? (fadeLeft > 0.97 ? "deep blue" : `fading · ${Math.round(fadeLeft * 100)}%`) : "unchanged") : "");

      let chips, title, text, flow;
      if (matter === "solid") {
        chips = [["No current", "down"], ["Solid"]];
        title = power ? "Power on — but nothing happens" : "Solid: the ions can’t move";
        text = "In solid lead(II) bromide the ions are held in a lattice. They can only vibrate, so they can’t carry charge to the electrodes — no current flows, even with the power on. Choose <b>Molten</b>.";
        flow = ["Solid", "ions held in a lattice", "no current", "no products"];
      } else if (!power) {
        chips = [["Power off"], [cfg.label]];
        title = "Switch the power on";
        text = "With no current, the ions just wander about. Nothing pulls them to either electrode.";
        flow = null;
      } else {
        chips = [["Current flowing", "up"], [cfg.label]];
        title = cfg.title; text = cfg.text; flow = cfg.flow;
      }
      let follow = "";
      if (track) {
        const line = (i, sign) => {
          const s = i.s, who = `<b>${s.full}</b> (${s.name})`;
          if (i.state === "done") return `${who}: ${cfg.story[i.sp]}`;
          if (i.state === "arrived") return `${who}: ${cfg.story[i.sp]}`;
          if (!on) return `${who} wanders about — nothing pulls it while there is no current.`;
          if (i.state === "waiting") return `${who} has reached the cathode and is waiting for electrons to arrive through the wire.`;
          return sign === "cat" ? `${who} is positive, so it is pulled towards the <b>negative cathode</b>.` : `${who} is negative, so it is pulled towards the <b>positive anode</b>.`;
        };
        follow = `<p class="follow"><span class="c-cat">●</span> ${line(track.cat, "cat")}<br><span class="c-an">●</span> ${line(track.an, "an")}</p>`;
      }
      const html = `<div class="chips">${chips.map(([t, c]) => `<span class="chip ${c || ""}">${t}</span>`).join("")}</div>
        <h3>${title}</h3><p>${text}</p>${follow}${flow ? `<p class="flow">${flow.map((f) => `<span>${f}</span>`).join("")}</p>` : ""}`;
      if (html !== explain.dataset.last) { explain.innerHTML = html; explain.dataset.last = html; }
    }

    function follow() {
      if (matter === "solid") setMatter("molten");
      const main = (sign) => cfg.ions.find((x) => SPECIES[x.sp].sign === sign).sp;
      const pick = (sp) => ions.filter((i) => i.sp === sp).sort((p, q) => Math.abs(p.x - 320) - Math.abs(q.x - 320))[0];
      track = { cat: pick(main("cat")), an: pick(main("an")) };
      followBtn.setAttribute("aria-pressed", "true");
      if (!power) setPower(true);
      update();
    }

    // the outside world: chains in the Interpret step
    lab.applyState = (s) => {
      if (s.pick && s.pick !== key) { key = s.pick; build(); }
      if (s.matter && solidable) setMatter(s.matter);
      if (s.power !== undefined) setPower(!!s.power);
      if (s.follow) follow();
      update();
    };

    $$("[data-pick]", lab).forEach((b) => b.addEventListener("click", () => { key = b.dataset.pick; build(); }));
    $$("[data-matter]", lab).forEach((b) => b.addEventListener("click", () => setMatter(b.dataset.matter)));
    powerBtn.addEventListener("click", () => { setPower(!power); update(); });
    followBtn.addEventListener("click", follow);
    $("[data-reset]", lab).addEventListener("click", () => { if (solidable) matter = "solid"; key = keys[0]; build(); });

    let uiClock = 0;
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (visible) {
        step(dt); render();
        uiClock += dt;
        if (uiClock > 0.25) { uiClock = 0; update(); }
      }
      requestAnimationFrame(frame);
    }
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); }).observe(lab);
    build();
    if (!still) requestAnimationFrame(frame);
  }

  $$("[data-lab]").forEach(initLab);
})();
