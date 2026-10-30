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
      <text x="54" y="126" text-anchor="middle">2n</text><text x="210" y="128" text-anchor="middle">mitosis: identical</text>`
  };
  const miniFig = (id) => (MINI[id] ? `<svg class="fig b-fig" viewBox="0 0 280 132" aria-hidden="true">${MINI[id]()}</svg>` : "");
  const progress = SA.progress.all();
  const strandsEl = $("[data-strands]");
  if (strandsEl) strandsEl.innerHTML = bio.strands.map((s, i) => {
    const ts = bio.topics.filter((t) => t.strand === s.id), live = ts.filter(isLive).length;
    return `
      <section class="strand" aria-labelledby="strand-${s.id}">
        <header class="strand-h"><span class="num">${String.fromCharCode(65 + i)} · topics ${ts[0].num}–${ts.at(-1).num}</span><h3 id="strand-${s.id}">${s.title}</h3><p>${ts.length} topics${live ? ` · ${live} live` : ""}</p></header>
        <div class="strand-grid">${ts.map((t) => {
          const num = String(t.num).padStart(2, "0");
          if (!isLive(t)) return `<article class="b-topic"><div class="t-meta"><span class="t-num">${num}</span><span class="status paused">Soon</span></div><h4>${t.title}</h4><p>${t.blurb}</p></article>`;
          const l = t.lessons.find((x) => x.status === "live"), opened = progress[l.id]?.visited;
          return `<article class="b-topic is-live">
            <div class="b-copy">
              <div class="t-meta"><span class="t-num">${num}</span><span class="status" style="--sc:var(--c-bio)">${opened ? "In progress" : "Live now"}</span></div>
              <h4>${t.title}</h4><p>${t.blurb}</p>
              <div class="b-lesson"><small>${l.blurb}</small><a class="btn btn-primary btn-sm" href="${SA.url(l.href)}">${opened ? "Continue" : "Open"} ${t.num}.1 ${l.title} <span class="arr" aria-hidden="true">→</span></a></div>
            </div>
            ${miniFig(l.id)}
          </article>`;
        }).join("")}</div>
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
