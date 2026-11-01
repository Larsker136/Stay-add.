/* ==========================================================================
   stay add. — Biology home
   1. Facts and the five strands of topics, from the catalog.
   2. Fig. 1: enzyme activity against temperature, with the active site drawn
      beside the graph. It sweeps 5 → 65 °C until you move the slider.
      (Each reading is a fresh sample, so heating here does no lasting harm —
      the lesson shows what happens when you cool a denatured enzyme.)
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {}, E = SA.enzyme;
  const $ = (s, r = document) => r.querySelector(s);
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bio = SA.subject("biology");

  /* ---------- 1. Facts and strands ---------- */
  const isLive = (t) => t.lessons.some((l) => l.status === "live");
  const facts = { topics: bio.topics.length, strands: bio.strands.length, live: bio.topics.reduce((n, t) => n + t.lessons.filter((l) => l.status === "live").length, 0) };
  document.querySelectorAll("[data-bio-fact]").forEach((el) => (el.textContent = facts[el.dataset.bioFact]));

  // a small figure for each live lesson's card (drawn with lab.css classes)
  const bars = (x, y, list) => list.map(([dx, h, p, lt]) => `<rect class="chr p${p}${lt ? " lt" : ""}" x="${x + dx}" y="${y - h / 2}" width="6" height="${h}" rx="3"/>`).join("");
  const MINI = {
    enzymes: () => {
      const X = (T) => 20 + (T / 70) * 250, Y = (r) => 112 - r * 92;
      const line = E.curve((T) => E.rateT(T), 0, 70, X, Y, 1);
      return `<path class="gl" d="M20 66H270M20 20H270"/><path class="area" d="${line}L270 112H20Z"/><path class="plot" d="${line}"/>
        <path class="guide" d="M${X(37)} 20V112"/><path class="ax" d="M20 8V112H274"/>
        <text x="${X(37)}" y="126" text-anchor="middle">37 °C</text><text x="274" y="126" text-anchor="end">T →</text><text x="20" y="6">rate</text>
        <text x="${X(58)}" y="64" text-anchor="middle" class="ser">denatured</text>`;
    },
    reproduction: () => `
      <circle class="gam p1" cx="44" cy="36" r="22"/>${bars(44, 36, [[-12, 22, 1], [-3, 16, 1, 1], [6, 10, 1]])}
      <circle class="gam p2" cx="44" cy="98" r="22"/>${bars(44, 98, [[-12, 22, 2, 1], [-3, 16, 2], [6, 10, 2, 1]])}
      <path class="ar" d="M72 44L134 62M72 90L134 72"/><text x="104" y="70" text-anchor="middle" class="muted">+</text>
      <circle class="zyg" cx="190" cy="67" r="44"/>${bars(190, 67, [[-26, 30, 1], [-18, 30, 2, 1], [-4, 22, 1, 1], [4, 22, 2], [18, 14, 1], [26, 14, 2, 1]])}
      <text x="44" y="128" text-anchor="middle">gametes · n</text><text x="190" y="128" text-anchor="middle">zygote · 2n</text>`,
    inheritance: () => `
      <ellipse class="cell" cx="54" cy="66" rx="44" ry="40"/>${bars(54, 66, [[-20, 30, 1], [-10, 30, 2], [6, 18, 1], [14, 18, 2]])}
      <path class="ar" d="M106 66H130"/>
      <ellipse class="cell zyg" cx="168" cy="38" rx="30" ry="27"/>${bars(168, 38, [[-14, 22, 1], [-6, 22, 2], [5, 14, 1], [12, 14, 2]])}
      <ellipse class="cell zyg" cx="236" cy="94" rx="30" ry="27"/>${bars(236, 94, [[-14, 22, 1], [-6, 22, 2], [5, 14, 1], [12, 14, 2]])}
      <text x="54" y="126" text-anchor="middle">2n</text><text x="210" y="128" text-anchor="middle">mitosis: identical</text>`,
    // the figure-lesson topics, drawn with the generic figure parts (.f .l .mk + colour classes)
    classification: () => `
      <path class="l" d="M140 14V40M24 40H252M24 40V92M74 40V92M130 40V92M184 40V92M252 40V92"/>
      <circle class="f cg dk" cx="140" cy="14" r="7"/>
      <circle class="f cr" cx="24" cy="102" r="10"/><circle class="f cg" cx="74" cy="102" r="10"/><circle class="f ca" cx="130" cy="102" r="10"/><circle class="f cv" cx="184" cy="102" r="10"/><circle class="f ct" cx="252" cy="102" r="10"/>
      <g text-anchor="middle"><text x="24" y="126">animal</text><text x="74" y="126">plant</text><text x="130" y="126">fungus</text><text x="184" y="126">protoctist</text></g><text x="278" y="126" text-anchor="end">prokaryote</text>`,
    organisation: () => `
      <rect class="f cg" x="14" y="26" width="82" height="70" rx="5"/><rect class="f lt" x="20" y="32" width="70" height="58" rx="3"/><rect class="f cb lt" x="38" y="44" width="36" height="34" rx="8"/>
      <g class="f cg dk"><ellipse cx="30" cy="42" rx="6" ry="3"/><ellipse cx="82" cy="84" rx="6" ry="3"/><ellipse cx="80" cy="40" rx="6" ry="3"/></g><circle class="f cv" cx="30" cy="80" r="6"/>
      <path class="f cp lt" d="M128 60C126 34 152 22 176 26C206 30 214 56 206 80C198 104 168 108 146 100C132 94 128 80 128 60Z"/><circle class="f cv" cx="166" cy="62" r="13"/><circle class="f cv dk" cx="164" cy="60" r="4"/>
      <g class="f ca"><ellipse cx="146" cy="46" rx="7" ry="4"/><ellipse cx="190" cy="84" rx="7" ry="4"/></g>
      <rect class="f ct" x="226" y="48" width="44" height="22" rx="11"/><path class="l ct" d="M236 59c4-6 8 6 12 0s8 6 12 0"/>
      <g text-anchor="middle"><text x="55" y="118">plant</text><text x="170" y="124">animal</text><text x="248" y="92">bacterium</text></g>`,
    movement: () => `
      <path class="l dash" d="M140 10V116"/>
      <g class="f cv dk"><circle cx="30" cy="30" r="5"/><circle cx="56" cy="54" r="5"/><circle cx="34" cy="80" r="5"/><circle cx="78" cy="28" r="5"/><circle cx="90" cy="70" r="5"/><circle cx="60" cy="100" r="5"/><circle cx="110" cy="44" r="5"/><circle cx="116" cy="96" r="5"/><circle cx="172" cy="40" r="5"/><circle cx="214" cy="88" r="5"/><circle cx="250" cy="50" r="5"/></g>
      <path class="l cv w3" d="M104 70H176"/><path class="mk cv" d="M176 64l10 6-10 6z"/>
      <g text-anchor="middle"><text x="70" y="126">high concentration</text><text x="214" y="126">low</text></g>`,
    molecules: () => `
      <g class="f cg"><path d="M14 36l10-10h14l10 10-10 10H24z"/><path d="M54 36l10-10h14l10 10-10 10H64z"/><path d="M94 36l10-10h14l10 10-10 10h-14z"/><path d="M134 36l10-10h14l10 10-10 10h-14z"/></g>
      <text x="180" y="40">starch ← glucose</text>
      <path class="l" d="M20 92H170"/><circle class="f cr" cx="24" cy="92" r="9"/><circle class="f cb" cx="48" cy="92" r="9"/><circle class="f cv" cx="72" cy="92" r="9"/><circle class="f ct" cx="96" cy="92" r="9"/><circle class="f ca" cx="120" cy="92" r="9"/><circle class="f cr" cx="144" cy="92" r="9"/><circle class="f cb" cx="168" cy="92" r="9"/>
      <text x="186" y="96">protein ← amino acids</text>`,
    "plant-nutrition": () => `
      <circle class="f ca" cx="34" cy="30" r="18"/><path class="l ca" d="M54 40L104 64M48 52L98 78"/>
      <path class="f cg" d="M100 116C84 70 140 26 250 22C250 92 180 128 100 116Z"/><path class="l cg" d="M100 116L238 32M150 88L156 64M190 66L194 46M170 78L206 78"/>
      <text x="200" y="120">CO₂ + water → glucose + O₂</text>`,
    "human-nutrition": () => `
      <path class="f cp" d="M12 120V64C12 44 40 44 40 64V120M52 120V54C52 34 80 34 80 54V120M92 120V64C92 44 120 44 120 64V120M132 120V54C132 34 160 34 160 54V120"/>
      <path class="l cr" d="M22 118V66M62 118V58M102 118V66M142 118V58"/><path class="l cv w3" d="M30 118V68M70 118V60M110 118V68M150 118V60"/>
      <text x="176" y="56">villi:</text><text x="176" y="72">large surface</text><text x="176" y="88">for absorption</text>`,
    "transport-plants": () => `
      <rect class="f cg lt" x="96" y="8" width="88" height="116" rx="8"/>
      <rect class="f cb" x="110" y="12" width="24" height="108" rx="4"/><rect class="f ca" x="146" y="12" width="24" height="108" rx="4"/>
      <path class="l cb w3" d="M122 104V30"/><path class="mk cb" d="M116 32l6-10 6 10z"/>
      <path class="l ca w3" d="M158 36V96"/><path class="mk ca" d="M152 36l6-10 6 10zM152 96l6 10 6-10z"/>
      <text x="90" y="56" text-anchor="end" class="tc cb">xylem: water</text><text x="190" y="72" class="tc ca">phloem: sucrose</text>`,
    "transport-animals": () => `
      <path class="f cr" d="M140 124C92 98 74 70 82 48C90 26 124 24 140 46C156 24 190 26 198 48C206 70 188 98 140 124Z"/>
      <path class="l w3" d="M140 50V112"/>
      <path class="l cb w3" d="M110 40C80 10 30 14 20 48"/><path class="l cr w3" d="M170 40C200 10 250 14 260 48"/>
      <text x="22" y="70">lungs</text><text x="230" y="70">body</text>`,
    "disease-immunity": () => `
      <circle class="f cr" cx="140" cy="66" r="32"/>
      <g class="f cr dk"><path d="M140 34l-7-12h14z"/><path d="M172 66l12-7v14z"/><path d="M140 98l-7 12h14z"/><path d="M108 66l-12-7v14z"/></g>
      <g class="l cb w3"><path d="M140 6V18M140 18l-8 10M140 18l8 10"/><path d="M206 66H194M194 66l-10-8M194 66l-10 8"/><path d="M74 66H86M86 66l10-8M86 66l10 8"/></g>
      <text x="140" y="126" text-anchor="middle">antibodies fit antigens</text>`,
    "gas-exchange": () => `
      <path class="l w5" d="M140 6V40M140 40L92 70M140 40L188 70M92 70L68 94M92 70L104 98M188 70L212 94M188 70L176 98"/>
      <g class="f cp"><circle cx="64" cy="104" r="12"/><circle cx="104" cy="108" r="12"/><circle cx="176" cy="108" r="12"/><circle cx="216" cy="104" r="12"/></g>
      <path class="l cr" d="M52 104C60 118 76 118 84 110"/><text x="232" y="30">alveoli</text>`,
    respiration: () => `
      <rect class="f ca" x="10" y="44" width="96" height="40" rx="8"/><rect class="f cb" x="174" y="44" width="96" height="40" rx="8"/>
      <g text-anchor="middle" class="k"><text x="58" y="61">glucose</text><text x="58" y="76">+ O₂</text><text x="222" y="61">CO₂</text><text x="222" y="76">+ H₂O</text></g>
      <path class="l ca w3" d="M110 64H166"/><path class="mk ca" d="M166 58l10 6-10 6z"/>
      <path class="l cr" d="M140 58c-4-10 4-16 0-26M128 58c-4-8 4-12 0-20M152 58c-4-8 4-12 0-20"/><text x="140" y="110" text-anchor="middle" class="tc cr">energy released</text>`,
    excretion: () => `
      <path class="f cr" d="M70 18C30 18 22 86 42 108C60 126 88 110 82 86C78 72 96 62 92 44C90 28 82 18 70 18Z"/>
      <path class="l ca w3" d="M82 88C100 104 112 112 120 124"/>
      <circle class="f cr" cx="168" cy="44" r="16"/><path class="l ca w3" d="M182 52C214 52 202 84 226 84V120M226 120C236 120 236 64 250 64C262 64 268 90 268 110"/>
      <text x="170" y="120" text-anchor="middle">nephron</text>`,
    coordination: () => `
      <circle class="f cv" cx="40" cy="64" r="16"/><path class="l cv" d="M24 64l-14-12M24 64l-14 12M40 48l-4-16M40 80l-4 16"/>
      <path class="l cv w3" d="M56 64H236"/><g class="f ca dk"><rect x="80" y="58" width="22" height="12" rx="6"/><rect x="120" y="58" width="22" height="12" rx="6"/><rect x="160" y="58" width="22" height="12" rx="6"/><rect x="200" y="58" width="22" height="12" rx="6"/></g>
      <path class="l cv" d="M236 64l14-14M236 64l18 0M236 64l14 14"/>
      <path class="l cr w3" d="M110 100l10 0 6-10 8 20 6-10h14"/><text x="140" y="126" text-anchor="middle">impulse →</text>`,
    drugs: () => `
      <rect class="f cb" x="26" y="48" width="100" height="32" rx="16"/><path class="f cb dk no-s" d="M42 48H76V80H42A16 16 0 0 1 42 48Z"/>
      <g class="f ct"><rect x="170" y="30" width="40" height="18" rx="9"/><rect x="214" y="70" width="40" height="18" rx="9"/><rect x="176" y="94" width="40" height="18" rx="9"/></g>
      <path class="l cr w3" d="M168 26l44 26M212 26l-44 26"/><rect class="f cr dk" x="230" y="34" width="40" height="18" rx="9"/>
      <text x="76" y="110" text-anchor="middle">antibiotic</text><text x="250" y="124" text-anchor="middle" class="tc cr">resistant</text>`,
    variation: () => `
      <path class="ax" d="M14 112H266"/>
      <g class="f cb"><rect x="30" y="102" width="24" height="10"/><rect x="56" y="84" width="24" height="28"/><rect x="82" y="56" width="24" height="56"/><rect x="108" y="26" width="24" height="86"/><rect x="134" y="20" width="24" height="92"/><rect x="160" y="44" width="24" height="68"/><rect x="186" y="74" width="24" height="38"/><rect x="212" y="98" width="24" height="14"/></g>
      <path class="l cb dash" d="M30 110C80 104 100 14 142 18S210 104 240 110"/><text x="140" y="128" text-anchor="middle">continuous variation</text>`,
    ecology: () => `
      <rect class="f cg" x="40" y="96" width="200" height="22"/><rect class="f cb" x="76" y="70" width="128" height="22"/><rect class="f cr" x="106" y="44" width="68" height="22"/><rect class="f cv" x="128" y="18" width="24" height="22"/>
      <g class="k"><text x="140" y="111" text-anchor="middle">producers</text><text x="140" y="85" text-anchor="middle">herbivores</text></g><text x="186" y="34">top carnivore</text>`,
    "human-influences": () => `
      <g class="f cg"><circle cx="50" cy="56" r="26"/><circle cx="96" cy="48" r="28"/></g><path class="l ca w3" d="M50 82V118M96 76V118"/>
      <g class="f ca"><rect x="150" y="108" width="18" height="10"/><rect x="186" y="108" width="18" height="10"/><rect x="222" y="108" width="18" height="10"/></g>
      <path class="l cr" d="M176 100c0-14 8-20 0-34M212 100c0-14 8-20 0-34"/><text x="196" y="50" text-anchor="middle" class="tc cr">CO₂</text>
      <path class="ground" d="M10 118H270"/>`,
    biotechnology: () => `
      <circle class="l ct w5" cx="80" cy="64" r="40"/><path class="l cr w5" d="M114 44A40 40 0 0 1 120 66"/>
      <text x="80" y="68" text-anchor="middle" class="k">plasmid</text>
      <rect class="f cb lt" x="170" y="14" width="72" height="104" rx="16"/><g class="f ct"><rect x="180" y="40" width="20" height="10" rx="5"/><rect x="210" y="56" width="20" height="10" rx="5"/><rect x="186" y="80" width="20" height="10" rx="5"/><rect x="214" y="96" width="20" height="10" rx="5"/></g>
      <path class="l w3" d="M206 6V22"/><text x="134" y="126" text-anchor="middle">gene → bacteria → fermenter</text>`
  };
  const miniFig = (id) => (MINI[id] ? `<svg class="fig b-fig" viewBox="0 0 280 132" aria-hidden="true">${MINI[id]()}</svg>` : "");
  const progress = SA.progress.all();
  const strandsEl = $("[data-strands]");
  // card sizes [columns of 6, rows] for each strand, by how many topics it has — so no strand reads as a list
  const LAYOUT = {
    3: [[4, 2], [2, 1], [2, 1]],
    4: [[4, 2], [2, 1], [2, 1], [6, 1]],
    5: [[3, 2], [3, 1], [3, 1], [4, 1], [2, 1]],
    6: [[2, 2], [4, 1], [2, 1], [2, 1], [3, 1], [3, 1]]
  };
  const shapeOf = ([c, r]) => (r > 1 ? "tall" : c >= 4 ? "wide" : "small");
  function card(t, size, si) {
    const num = String(t.num).padStart(2, "0"), shape = shapeOf(size), style = `--c:${size[0]};--r:${size[1]}`;
    if (!isLive(t)) return `<article class="b-topic ${shape}" style="${style}"><div class="b-copy"><div class="t-meta"><span class="t-num">${num}</span><span class="status paused">Soon</span></div><h4>${t.title}</h4><p>${t.blurb}</p></div></article>`;
    const l = t.lessons.find((x) => x.status === "live"), opened = progress[l.id]?.visited;
    return `<article class="b-topic is-live ${shape}" style="${style}">
      ${miniFig(l.id)}
      <div class="b-copy">
        <div class="t-meta"><span class="t-num">${num}</span><span class="status" style="--sc:var(--c-bio)">${opened ? "In progress" : "Live"}</span></div>
        <h4><a class="b-link" href="${SA.url(l.href)}">${t.title}</a></h4><p>${t.blurb}</p>
        ${shape === "small" ? "" : `<p class="b-lesson">${l.blurb}</p>`}
        <span class="b-go" aria-hidden="true">${opened ? "Continue" : "Open"} →</span>
      </div>
    </article>`;
  }
  if (strandsEl) strandsEl.innerHTML = bio.strands.map((s, i) => {
    const ts = bio.topics.filter((t) => t.strand === s.id), live = ts.filter(isLive).length;
    const sizes = LAYOUT[ts.length] || ts.map(() => [2, 1]);
    return `
      <section class="strand" aria-labelledby="strand-${s.id}">
        <header class="strand-h"><span class="num">${String.fromCharCode(65 + i)} · topics ${ts[0].num}–${ts.at(-1).num}</span><h3 id="strand-${s.id}">${s.title}</h3><p>${ts.length} topics${live ? ` · ${live} live` : ""}</p></header>
        <div class="strand-grid">${ts.map((t, k) => card(t, sizes[k] || [2, 1], i)).join("")}</div>
      </section>`;
  }).join("");

  /* ---------- 2. Fig. 1 ---------- */
  const fig = $("[data-hero]");
  if (!fig) return;
  const svg = $("[data-hero-svg]", fig), slider = $("[data-hero-temp]", fig), status = $("[data-hero-status]", fig);
  const X = (T) => 56 + (T / 70) * 330, Y = (r) => 262 - r * 222;
  const EX = 528, EY = 214;                                   // where the enzyme sits
  const line = E.curve((T) => E.rateT(T), 0, 70, X, Y, 0.5);
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70];
  svg.innerHTML = `
    <rect class="zone" x="${X(40)}" y="40" width="${X(70) - X(40)}" height="222"/>
    <path class="gl" d="M56 151H386M56 40H386"/>
    <path class="area" d="${line}L${X(70)} 262H56Z"/><path class="plot" d="${line}"/>
    <path class="guide" d="M${X(37)} 40V262"/>
    <path class="ax" d="M56 30V262H392"/>
    <path class="tk" d="${ticks.map((t) => `M${X(t)} 262v5`).join("")}M51 262h5M51 151h5M51 40h5"/>
    <g text-anchor="middle">${ticks.map((t) => `<text x="${X(t)}" y="282">${t}</text>`).join("")}</g>
    <g text-anchor="end"><text x="46" y="265">0</text><text x="46" y="154">50</text><text x="46" y="43">100</text></g>
    <text x="56" y="20">rate / % of max</text><text x="392" y="302" text-anchor="end">temperature / °C</text>
    <text x="${X(37)}" y="34" text-anchor="middle" class="lbl-ink">optimum 37 °C</text>
    <text x="${X(55)}" y="56" text-anchor="middle" class="lbl-bad">denaturing</text>
    <path class="guide" data-g-x/><path class="guide" data-g-y/>
    <circle r="5.5" class="pt" data-pt/>
    <path class="ax" d="M418 30V300" style="stroke:var(--line)"/>
    <text x="528" y="20" text-anchor="middle">up close</text>
    <g transform="translate(${EX} ${EY})">
      <g data-sub><path class="subs" d="${E.substratePath("round")}"/></g>
      <path class="enz" data-enz/>
      <text y="6" text-anchor="middle" class="lbl-enz">enzyme</text>
    </g>
    <text x="${EX}" y="${EY - 108}" text-anchor="middle" class="lbl-sub">substrate</text>
    <text x="${EX}" y="${EY + 76}" text-anchor="middle" class="lbl-ink" data-state></text>`;
  const pt = $("[data-pt]", svg), gx = $("[data-g-x]", svg), gy = $("[data-g-y]", svg), enz = $("[data-enz]", svg), subG = $("[data-sub]", svg), state = $("[data-state]", svg);

  let T = 37, auto = !still, visible = false, t0 = performance.now();
  function show() {
    const r = E.rateT(T), d = E.siteT(T);
    pt.setAttribute("cx", X(T).toFixed(1)); pt.setAttribute("cy", Y(r).toFixed(1));
    gx.setAttribute("d", `M${X(T).toFixed(1)} ${Y(r).toFixed(1)}V262`);
    gy.setAttribute("d", `M56 ${Y(r).toFixed(1)}H${X(T).toFixed(1)}`);
    enz.setAttribute("d", E.enzymePath("round", d));
    enz.classList.toggle("is-bad", d >= 0.6);
    subG.setAttribute("transform", `translate(${(d * 10).toFixed(1)} ${(-d * 34).toFixed(1)}) rotate(${(d * 12).toFixed(1)})`);
    state.textContent = T < 12 ? "fits · few collisions" : E.siteShort(d);
    slider.value = Math.round(T); slider.style.setProperty("--pct", `${(T / 70) * 100}%`);
    $("[data-hero-out]", fig).textContent = Math.round(T);
    $('[data-hero-r="t"]', fig).textContent = Math.round(T);
    $('[data-hero-r="rate"]', fig).textContent = Math.round(r * 100);
    $('[data-hero-r="site"]', fig).textContent = d < 0.05 ? "fits" : d < 0.6 ? "changing" : "denatured";
  }
  function frame(now) {
    if (visible && auto) { T = 35 - 30 * Math.cos(((now - t0) / 1000) * (Math.PI * 2) / 14); show(); }
    if (auto) requestAnimationFrame(frame);
  }
  slider.addEventListener("input", () => { auto = false; T = +slider.value; status.textContent = "Manual"; status.classList.add("paused"); show(); });
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(fig);
  show();
  if (still) { status.textContent = "Still"; status.classList.add("paused"); }
  else requestAnimationFrame(frame);
})();
