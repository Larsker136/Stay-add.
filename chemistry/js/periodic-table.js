/* ==========================================================================
   stay add. — Chemistry topic 8, The Periodic Table: the labs
   table    the first four periods: pick an element to see its group, period,
            type and electronic configuration
   group1   lithium, sodium and potassium (and a prediction for rubidium) in water
   halogen  halogen displacement: which halogen pushes which halide out of solution
   Each lab exposes lab.applyState(state). Needs assets/js/kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop } = window.StayAdd.kit;

  // Z 1–36: symbol, name, group (1–18), state at room temperature
  const EL = "H hydrogen 1 g|He helium 18 g|Li lithium 1 s|Be beryllium 2 s|B boron 13 s|C carbon 14 s|N nitrogen 15 g|O oxygen 16 g|F fluorine 17 g|Ne neon 18 g|Na sodium 1 s|Mg magnesium 2 s|Al aluminium 13 s|Si silicon 14 s|P phosphorus 15 s|S sulfur 16 s|Cl chlorine 17 g|Ar argon 18 g|K potassium 1 s|Ca calcium 2 s|Sc scandium 3 s|Ti titanium 4 s|V vanadium 5 s|Cr chromium 6 s|Mn manganese 7 s|Fe iron 8 s|Co cobalt 9 s|Ni nickel 10 s|Cu copper 11 s|Zn zinc 12 s|Ga gallium 13 s|Ge germanium 14 s|As arsenic 15 s|Se selenium 16 s|Br bromine 17 l|Kr krypton 18 g"
    .split("|").map((r, i) => { const [s, n, g, st] = r.split(" "); const Z = i + 1; return { Z, s, n, g: +g, st, p: Z <= 2 ? 1 : Z <= 10 ? 2 : Z <= 18 ? 3 : 4 }; });
  const NONMETAL = new Set(["H", "He", "B", "C", "N", "O", "F", "Ne", "Si", "P", "S", "Cl", "Ar", "Ge", "As", "Se", "Br", "Kr"]);
  const config = (e) => { const out = []; for (const cap of [2, 8, 8, 2]) { if (e <= 0) break; out.push(Math.min(cap, e)); e -= cap; } return out; };
  const roman = (g) => (g <= 2 ? ["I", "II"][g - 1] : g >= 13 ? ["III", "IV", "V", "VI", "VII", "VIII"][g - 13] : "");
  const family = (e) => (e.g === 1 && e.s !== "H" ? "alkali metals (Group I)" : e.g === 17 ? "halogens (Group VII)" : e.g === 18 ? "noble gases (Group VIII / 0)" : e.g >= 3 && e.g <= 12 ? "transition elements" : `Group ${roman(e.g)}`);

  /* ---------- the Periodic Table ---------- */
  function tableLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), grid = $("[data-ptable]", lab);
    let st = { Z: 11 };
    let cells = "";
    for (let p = 1; p <= 4; p++) for (let g = 1; g <= 18; g++) {
      const e = EL.find((x) => x.p === p && x.g === g);
      cells += e ? `<button type="button" data-z="${e.Z}" class="${e.g === 18 ? "noble" : NONMETAL.has(e.s) ? "non" : "metal"}" title="${e.n}">${e.s}</button>` : "<i></i>";
    }
    grid.innerHTML = cells;
    $$("[data-z]", grid).forEach((b) => b.addEventListener("click", () => { st.Z = +b.dataset.z; draw(); }));
    function draw() {
      const e = EL[st.Z - 1], metal = !NONMETAL.has(e.s), cfg = st.Z <= 20 ? config(st.Z) : null;
      $$("[data-z]", grid).forEach((b) => { const x = EL[b.dataset.z - 1]; b.setAttribute("aria-pressed", String(x.Z === st.Z)); b.classList.toggle("hi", x.Z !== st.Z && (x.g === e.g || x.p === e.p)); });
      let s = `<rect class="f ${e.g === 18 ? "cv" : metal ? "cb" : "ca"}" x="30" y="40" width="180" height="200" rx="10"/><text x="46" y="70" class="mono-b">${e.Z}</text>
        <text x="120" y="160" text-anchor="middle" class="mono-b" style="font-size:64px">${e.s}</text><text x="120" y="200" text-anchor="middle">${e.n}</text><text x="120" y="222" text-anchor="middle" style="font-size:11px">${{ s: "solid", l: "liquid", g: "gas" }[e.st]} at room temperature</text>`;
      if (cfg) {
        s += `<circle class="f cr dk" cx="440" cy="140" r="12"/>`;
        cfg.forEach((n, i) => { const r = 32 + i * 26; s += `<circle class="shell" cx="440" cy="140" r="${r}"/>`; for (let j = 0; j < n; j++) { const a = -Math.PI / 2 + (j / n) * 2 * Math.PI; s += `<circle class="e" cx="${440 + r * Math.cos(a)}" cy="${140 + r * Math.sin(a)}" r="3.5"/>`; } });
        s += `<text x="440" y="284" text-anchor="middle">${cfg.join(",")}</text>`;
      } else s += `<text x="440" y="130" text-anchor="middle" class="k">a transition element</text><text x="440" y="152" text-anchor="middle" style="font-size:11px">(configurations beyond calcium aren’t needed)</text>`;
      svg.innerHTML = s;
      res.innerHTML = rows([["element", `${e.n} (${e.s}), Z = ${e.Z}`], ["group", e.g >= 3 && e.g <= 12 ? "transition block" : roman(e.g) + (e.g === 18 ? " / 0" : "")], ["period", e.p], ["family", family(e)], ["type", e.g === 18 ? "noble gas (non-metal)" : metal ? "metal" : "non-metal"], ["electronic configuration", cfg ? cfg.join(",") : "—"]]);
      const outer = cfg ? cfg[cfg.length - 1] : null;
      exp.innerHTML = chips([[family(e)], [metal ? "metal" : "non-metal"]]) + `<h3>${e.n.charAt(0).toUpperCase() + e.n.slice(1)}: period ${e.p}${e.g <= 2 || e.g >= 13 ? `, group ${roman(e.g)}` : ""}</h3><p>Elements are arranged in order of <b>proton number</b>. ${cfg ? `${e.n.charAt(0).toUpperCase() + e.n.slice(1)} has ${cfg.length} occupied shell${cfg.length > 1 ? "s" : ""} (period ${e.p}) and ${outer} outer electron${outer > 1 ? "s" : ""}${e.g <= 2 || (e.g >= 13 && e.g < 18) ? ` (group ${roman(e.g)})` : ""}.` : ""} Elements in the same <b>group</b> have the same number of outer electrons, so they have <b>similar chemical properties</b>. Across a <b>period</b> the elements change from <b>metals</b> on the left to <b>non-metals</b> on the right. Metals tend to form positive ions; non-metals tend to form negative ions or share electrons.</p>` + flow(["same group", "same number of outer electrons", "similar reactions"]);
    }
    $("[data-reset]", lab).addEventListener("click", () => { st.Z = 11; draw(); });
    lab.applyState = (s) => { Object.assign(st, s); draw(); };
    draw();
  }

  /* ---------- Group I metals in water ---------- */
  function group1Lab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // name, speed, melting point °C, what you see, flame colour
    const M = { Li: ["lithium", 0.6, 181, "floats, fizzes steadily and slowly gets smaller", ""], Na: ["sodium", 1.6, 98, "floats, melts into a silvery ball, fizzes and whizzes around the surface", ""], K: ["potassium", 3, 63, "floats, melts, fizzes violently and burns with a lilac flame", "#b07ad8"], Rb: ["rubidium (predicted)", 5, 39, "reacts explosively — predicted from the trend, not done in school", "#c04a8a"] };
    let st = { m: "Na" }, t = 0;
    function draw() {
      const [name, v, , , flame] = M[st.m], x = 320 + Math.sin(t * 0.02 * v) * 120 * Math.min(1, v / 1.6), size = Math.max(4, 12 - (t * v) / 160);
      let s = `<path class="glass" d="M80 120V240H560V120"/><rect class="liq" style="--lc:var(--blue)" x="82" y="150" width="476" height="88"/><path class="l" style="--fc:var(--blue)" d="M82 150H558"/>`;
      if (size > 4.2) {
        s += `<circle class="f dk" cx="${x}" cy="146" r="${size}"/>`;
        for (let k = 0; k < Math.round(4 + v * 3); k++) { const a = ((t * 7 + k * 53) % 360) * Math.PI / 180, r = size + 2 + ((t + k * 11) % 14); s += `<circle class="shell" cx="${x + r * Math.cos(a)}" cy="${146 - Math.abs(r * Math.sin(a)) * 0.6}" r="2"/>`; }
        if (flame) s += `<path d="M${x - 10} 140Q${x} ${100 - (t % 9)} ${x + 10} 140Z" fill="${flame}" opacity=".75"/>`;
      } else s += `<text x="320" y="110" text-anchor="middle">the metal has all reacted</text>`;
      s += `<text x="320" y="274" text-anchor="middle">water with universal indicator: turns purple as the alkali forms</text>`;
      svg.innerHTML = s;
    }
    function explain() {
      const [name, v, mp, seen] = M[st.m];
      res.innerHTML = rows([["metal", name], ["observations", seen], ["equation", `2${st.m} + 2H₂O → 2${st.m}OH + H₂`], ["melting point", `${mp} °C`], ["reactivity", "Li < Na < K < Rb"]]);
      exp.innerHTML = chips([[name], [`${v > 2 ? "very " : ""}vigorous`]]) + `<h3>Group I: more reactive down the group</h3><p>The alkali metals are soft, have low densities and low melting points, and react with cold water to make an <b>alkaline</b> hydroxide and <b>hydrogen</b>: metal + water → metal hydroxide + hydrogen. Going <b>down the group</b> the metals get <b>more reactive</b>, the <b>melting point decreases</b> and the <b>density generally increases</b>. Each has <b>one outer electron</b>; further down, it is further from the nucleus and more easily lost.</p>` + flow(["down Group I", "outer electron further away", "lost more easily", "more reactive"]);
    }
    const paint = controls(lab, st, () => { paint(); t = 0; explain(); });
    $("[data-reset]", lab).addEventListener("click", () => { st.m = "Na"; t = 0; paint(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); t = 0; paint(); explain(); };
    paint(); explain(); draw();
    loop(lab, () => { t++; draw(); }, 40);
  }

  /* ---------- halogen displacement ---------- */
  function halogenLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const H = { Cl: ["chlorine", 0, "#c9d86a", "pale yellow-green gas"], Br: ["bromine", 1, "#d27a2a", "red-brown liquid"], I: ["iodine", 2, "#7a4a2a", "grey-black solid"] };
    const COL = { Cl: "#e9f0c0", Br: "#e8a050", I: "#8a5a2a" };
    let st = { x2: "Cl", ion: "I" };
    function draw() {
      const [xn, xr] = H[st.x2], [ion, ir] = [{ Cl: "chloride", Br: "bromide", I: "iodide" }[st.ion], H[st.ion][1]], same = st.x2 === st.ion, reacts = !same && xr < ir;
      const col = reacts ? COL[st.ion] : same ? "transparent" : COL[st.x2];
      let s = `<path class="glass" d="M90 40V220a34 34 0 0 0 68 0V40"/><path d="M92 110V220a32 32 0 0 0 64 0V110Z" fill="${col}" opacity="${col === "transparent" ? 0 : 0.8}"/>
        <text x="124" y="282" text-anchor="middle">${reacts ? `turns ${st.ion === "Br" ? "orange" : "brown"}` : same ? "—" : `stays the colour of ${xn} water`}</text>`;
      s += `<text x="220" y="40" class="k">added ↓ / solution →</text>`;
      ["Cl", "Br", "I"].forEach((sol, j) => { s += `<text x="${360 + j * 90}" y="62" text-anchor="middle" class="k">K${sol}</text>`; });
      ["Cl", "Br", "I"].forEach((hal, i) => {
        s += `<text x="220" y="${104 + i * 56}" class="k">${hal}₂</text>`;
        ["Cl", "Br", "I"].forEach((sol, j) => { const r = hal !== sol && H[hal][1] < H[sol][1], on = hal === st.x2 && sol === st.ion; s += `<rect class="f ${hal === sol ? "" : r ? "cg" : ""} ${on ? "dk" : "lt"}" x="${320 + j * 90}" y="${80 + i * 56}" width="80" height="40" rx="6"/><text x="${360 + j * 90}" y="${104 + i * 56}" text-anchor="middle">${hal === sol ? "—" : r ? "reacts" : "no reaction"}</text>`; });
      });
      svg.innerHTML = s;
      const sym = { Cl: "Cl", Br: "Br", I: "I" };
      res.innerHTML = rows([["halogen added", `${xn} (${H[st.x2][3]})`], ["solution", `potassium ${ion}`], ["result", same ? "same halogen — nothing to see" : reacts ? `displacement: ${H[st.ion][0]} forms` : "no reaction"], ...(reacts ? [["equation", `${sym[st.x2]}₂ + 2K${st.ion} → 2K${st.x2} + ${sym[st.ion]}₂`], ["ionic equation (Supp.)", `${sym[st.x2]}₂ + 2${sym[st.ion]}⁻ → 2${sym[st.x2]}⁻ + ${sym[st.ion]}₂`]] : [])]);
      exp.innerHTML = chips([[reacts ? "Displacement" : "No reaction", reacts ? "up" : ""], ["reactivity: Cl₂ > Br₂ > I₂"]]) + `<h3>A more reactive halogen displaces a less reactive one</h3><p>The halogens are diatomic non-metals. Going <b>down Group VII</b> their colour gets darker, they change from gas to liquid to solid (density and melting point increase), and they become <b>less reactive</b>. A more reactive halogen <b>displaces</b> a less reactive halogen from a solution of its halide: ${reacts ? `${xn} is more reactive than ${H[st.ion][0]}, so ${H[st.ion][0]} is pushed out and the solution changes colour.` : same ? "a halogen cannot displace itself." : `${xn} is less reactive than ${H[st.ion][0]}, so nothing happens.`} <span class="tag-s">Supp.</span> These are redox reactions: the halogen gains electrons (is reduced), the halide ion loses them (is oxidised).</p>` + flow(["up Group VII", "gains an electron more easily", "more reactive", "displaces halogens below it"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { x2: "Cl", ion: "I" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ table: tableLab, group1: group1Lab, halogen: halogenLab });
})();
