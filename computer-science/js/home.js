/* ==========================================================================
   stay add. — Computer Science home
   1. Facts and the topic cards of the two papers, from the catalog: each card
      has a small figure, and each paper's cards are laid out in mixed sizes.
   2. Fig. 1: one byte. Click any bit to switch it; the denary and hexadecimal
      values follow. It counts up on its own until you touch it.
   ========================================================================== */
(function () {
  "use strict";

  const SA = window.StayAdd || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cs = SA.subject("computer-science");

  /* ---------- 1. Facts and topic cards ---------- */
  const isLive = (t) => t.lessons.some((l) => l.status === "live");
  const facts = { topics: cs.topics.length, papers: cs.strands.length, live: cs.topics.reduce((n, t) => n + t.lessons.filter((l) => l.status === "live").length, 0) };
  $$("[data-cs-fact]").forEach((el) => (el.textContent = facts[el.dataset.csFact]));

  const byte = (x, y, bits, w = 26) => [...bits].map((b, i) => `<rect class="${b === "1" ? "bit1" : "bit0"}" x="${x + i * (w + 4)}" y="${y}" width="${w}" height="${w + 4}" rx="4"/><text x="${x + i * (w + 4) + w / 2}" y="${y + w / 2 + 6}" text-anchor="middle" class="mono-b">${b}</text>`).join("");
  const MINI = {
    "cs-data-representation": () => `${byte(14, 30, "01001101")}<text x="14" y="18">128  64  32  16   8   4   2   1</text>
      <text x="14" y="96" class="k">77 denary</text><text x="140" y="96" class="tc cp">4D hex</text><text x="14" y="118">two’s complement · shifts · file size</text>`,
    "cs-data-transmission": () => `
      <rect class="f cb" x="10" y="54" width="44" height="30" rx="5"/><rect class="f cb" x="226" y="54" width="44" height="30" rx="5"/>
      <g class="f lt"><circle cx="100" cy="30" r="10"/><circle cx="140" cy="100" r="10"/><circle cx="180" cy="34" r="10"/></g>
      <path class="l" d="M54 64L90 34M54 74L130 100M110 30H170M150 100L226 74M190 38L226 62M106 38L134 92"/>
      <g class="f cp dk"><rect x="66" y="44" width="16" height="10" rx="2"/><rect x="88" y="84" width="16" height="10" rx="2"/><rect x="196" y="40" width="16" height="10" rx="2"/></g>
      <text x="140" y="128" text-anchor="middle">packets take different routes</text>`,
    "cs-hardware": () => `
      <rect class="f cp" x="96" y="20" width="88" height="86" rx="8"/><text x="140" y="44" text-anchor="middle" class="k">CPU</text>
      <rect class="f lt" x="106" y="54" width="32" height="18" rx="3"/><rect class="f lt" x="142" y="54" width="32" height="18" rx="3"/><text x="122" y="67" text-anchor="middle">ALU</text><text x="158" y="67" text-anchor="middle">CU</text>
      <g class="l"><path d="M110 20V8M124 20V8M138 20V8M152 20V8M166 20V8M110 106V118M124 106V118M138 106V118M152 106V118M166 106V118M96 40H84M96 60H84M96 80H84M184 40H196M184 60H196M184 80H196"/></g>
      <rect class="f cb" x="214" y="40" width="54" height="44" rx="5"/><text x="241" y="66" text-anchor="middle">RAM</text>
      <path class="l cb w3" d="M196 56H214M196 70H214"/><text x="140" y="96" text-anchor="middle">registers</text>
      <text x="40" y="66" text-anchor="middle" class="tc ca">fetch</text><text x="40" y="80" text-anchor="middle">decode</text><text x="40" y="94" text-anchor="middle">execute</text>`,
    "cs-software": () => `
      <rect class="f lt" x="10" y="14" width="260" height="22" rx="4"/><rect class="f cb lt" x="10" y="42" width="260" height="22" rx="4"/><rect class="f cp lt" x="10" y="70" width="260" height="22" rx="4"/><rect class="f" x="10" y="98" width="260" height="22" rx="4"/>
      <g text-anchor="middle" class="k"><text x="140" y="29">user</text><text x="140" y="57">application software</text><text x="140" y="85">operating system · utilities</text><text x="140" y="113">hardware</text></g>`,
    "cs-internet": () => `
      <rect class="f lt" x="10" y="44" width="260" height="30" rx="15"/>
      <text x="22" y="64" class="mono-b"><tspan class="tc cg">https://</tspan><tspan class="tc cb">www.example.com</tspan><tspan class="tc ca">/learn</tspan></text>
      <g text-anchor="middle"><text x="50" y="96">protocol</text><text x="140" y="96">domain name</text><text x="236" y="96">file / page</text></g>
      <path class="l cv" d="M200 24l10-10 10 10v12h-20z"/><text x="230" y="30" class="tc cv">padlock: SSL</text>`,
    "cs-emerging-tech": () => `
      <rect class="f cb" x="10" y="48" width="70" height="34" rx="6"/><rect class="f cp" x="105" y="48" width="70" height="34" rx="6"/><rect class="f ca" x="200" y="48" width="70" height="34" rx="6"/>
      <g text-anchor="middle" class="k"><text x="45" y="69">sensor</text><text x="140" y="69">processor</text><text x="235" y="69">actuator</text></g>
      <path class="l w3" d="M80 65H100M175 65H195"/><path class="mk" d="M98 60l8 5-8 5zM193 60l8 5-8 5z"/>
      <path class="l dash" d="M235 82V110H45V82"/><text x="140" y="124" text-anchor="middle">feedback loop</text>`,
    "cs-algorithms": () => {
      const v = [5, 9, 2, 7, 4, 8, 1, 6];
      return v.map((h, i) => `<rect class="f ${i === 3 || i === 4 ? "ca dk" : "cp"}" x="${22 + i * 31}" y="${112 - h * 10}" width="24" height="${h * 10}" rx="3"/>`).join("") +
        `<path class="l ca" d="M127 18c8-10 24-10 32 0"/><path class="mk ca" d="M155 14l6 6-8 1z"/><text x="140" y="128" text-anchor="middle">bubble sort: compare, swap</text>`;
    },
    "cs-programming": () => `
      <rect class="f lt" x="10" y="10" width="260" height="104" rx="6"/>
      <text x="22" y="32" class="mono-b"><tspan class="tc cp">FOR</tspan> i ← 1 <tspan class="tc cp">TO</tspan> 5</text>
      <text x="40" y="52" class="mono-b">Total ← Total + i</text>
      <text x="22" y="72" class="mono-b"><tspan class="tc cp">NEXT</tspan> i</text>
      <text x="22" y="98" class="mono-b"><tspan class="tc cp">OUTPUT</tspan> Total</text><text x="200" y="98" class="tc ct">→ 15</text>`,
    "cs-databases": () => `
      <rect class="f lt" x="10" y="12" width="260" height="104" rx="4"/><rect class="f cp lt" x="10" y="12" width="260" height="22" rx="4"/>
      <g class="k"><text x="20" y="27">StudentID 🔑</text><text x="110" y="27">Name</text><text x="200" y="27">Age</text></g>
      <path class="l" d="M10 56H270M10 78H270M10 100H270M100 12V116M190 12V116"/>
      <g><text x="20" y="49">S001</text><text x="110" y="49">Asha</text><text x="200" y="49">15</text><text x="20" y="71">S002</text><text x="110" y="71">Ben</text><text x="200" y="71">16</text><text x="20" y="93">S003</text><text x="110" y="93">Chen</text><text x="200" y="93">15</text></g>
      <text x="140" y="130" text-anchor="middle">SELECT Name FROM Students WHERE Age = 15</text>`,
    "cs-boolean-logic": () => `
      <path class="wire-on" d="M14 40H70M14 84H70"/><path class="gate on" d="M70 26H100A36 36 0 0 1 100 98H70Z"/>
      <path class="wire-on" d="M136 62H170"/><path class="gate on" d="M170 44L206 62L170 80Z"/><circle class="bub" cx="211" cy="62" r="5"/><path class="wire-off" d="M216 62H266"/>
      <text x="14" y="32" class="tc ct">A = 1</text><text x="14" y="104" class="tc ct">B = 1</text><text x="100" y="66" text-anchor="middle" class="k">AND</text><text x="186" y="104" text-anchor="middle" class="k">NOT</text><text x="266" y="54" text-anchor="end">X = 0</text>
      <text x="140" y="126" text-anchor="middle">X = NOT (A AND B)</text>`
  };
  const miniFig = (id) => (MINI[id] ? `<svg class="fig b-fig" viewBox="0 0 280 132" aria-hidden="true">${MINI[id]()}</svg>` : "");
  const progress = SA.progress.all();
  // card sizes [columns of 6, rows] by how many topics a paper has — so neither paper reads as a list
  const LAYOUT = {
    4: [[4, 2], [2, 1], [2, 1], [6, 1]],
    6: [[2, 2], [4, 1], [2, 1], [2, 1], [3, 1], [3, 1]]
  };
  const shapeOf = ([c, r]) => (r > 1 ? "tall" : c >= 4 ? "wide" : "small");
  function card(t, size) {
    const num = String(t.num).padStart(2, "0"), shape = shapeOf(size), style = `--c:${size[0]};--r:${size[1]}`;
    if (!isLive(t)) return `<article class="b-topic ${shape}" style="${style}"><div class="b-copy"><div class="t-meta"><span class="t-num">${num}</span><span class="status paused">Soon</span></div><h4>${t.title}</h4><p>${t.blurb}</p></div></article>`;
    const l = t.lessons.find((x) => x.status === "live"), opened = progress[l.id]?.visited;
    return `<article class="b-topic is-live ${shape}" style="${style}">
      ${miniFig(l.id)}
      <div class="b-copy">
        <div class="t-meta"><span class="t-num">${num}</span><span class="status" style="--sc:var(--c-cs)">${opened ? "In progress" : "Live"}</span></div>
        <h4><a class="b-link" href="${SA.url(l.href)}">${t.title}</a></h4><p>${t.blurb}</p>
        ${shape === "small" ? "" : `<p class="b-lesson">${l.blurb}</p>`}
        <span class="b-go" aria-hidden="true">${opened ? "Continue" : "Open"} →</span>
      </div>
    </article>`;
  }
  const strandsEl = $("[data-strands]");
  if (strandsEl) strandsEl.innerHTML = cs.strands.map((s) => {
    const ts = cs.topics.filter((t) => t.strand === s.id), live = ts.filter(isLive).length;
    const sizes = LAYOUT[ts.length] || ts.map(() => [2, 1]);
    return `
      <section class="strand" aria-labelledby="strand-${s.id}">
        <header class="strand-h"><span class="num">${s.paper} · topics ${ts[0].num}–${ts.at(-1).num}</span><h3 id="strand-${s.id}">${s.title}</h3><p>${ts.length} topics${live ? ` · ${live} live` : ""}</p></header>
        <div class="strand-grid">${ts.map((t, k) => card(t, sizes[k] || [2, 1])).join("")}</div>
      </section>`;
  }).join("");

  /* ---------- 2. Fig. 1: one byte ---------- */
  const fig = $("[data-hero]");
  if (!fig) return;
  const svg = $("[data-hero-svg]", fig), status = $("[data-hero-status]", fig);
  let n = 77, auto = !still, timer = 0;
  const X0 = 40, W = 64, G = 8;
  svg.innerHTML = `
    <text x="${X0}" y="34">place value</text>
    ${Array.from({ length: 8 }, (_, i) => `<g data-bit="${7 - i}" style="cursor:pointer">
      <text x="${X0 + i * (W + G) + W / 2}" y="62" text-anchor="middle" class="lbl-ink">${2 ** (7 - i)}</text>
      <rect x="${X0 + i * (W + G)}" y="72" width="${W}" height="84" rx="10" data-r/>
      <text x="${X0 + i * (W + G) + W / 2}" y="128" text-anchor="middle" style="font:500 34px var(--font-mono)" data-t></text></g>`).join("")}
    <path class="guide" d="M${X0} 186H${X0 + 8 * (W + G) - G}"/>
    <text x="${X0}" y="214" data-sum class="lbl-ink" style="font-size:13px"></text>
    <text x="${X0}" y="250">nibbles → hex</text>
    <rect class="f cp lt" x="${X0 + 120}" y="232" width="${4 * (W + G) - G - 120}" height="30" rx="6"/><rect class="f cp lt" x="${X0 + 4 * (W + G)}" y="232" width="${4 * (W + G) - G}" height="30" rx="6"/>
    <text x="${X0 + 2 * (W + G) + 60}" y="252" text-anchor="middle" class="mono-b" data-h1></text><text x="${X0 + 6 * (W + G) - G / 2}" y="252" text-anchor="middle" class="mono-b" data-h2></text>`;
  function show() {
    $$("[data-bit]", svg).forEach((g) => {
      const on = (n >> +g.dataset.bit) & 1;
      $("[data-r]", g).setAttribute("class", on ? "bit1" : "bit0");
      $("[data-t]", g).textContent = on; $("[data-t]", g).style.fill = on ? "var(--ink)" : "var(--ink-4)";
    });
    const parts = []; for (let b = 7; b >= 0; b--) if ((n >> b) & 1) parts.push(2 ** b);
    $("[data-sum]", svg).textContent = parts.length ? `${parts.join(" + ")} = ${n}` : "all bits off = 0";
    const hex = n.toString(16).toUpperCase().padStart(2, "0");
    $("[data-h1]", svg).textContent = `${(n >> 4).toString(2).padStart(4, "0")} = ${hex[0]}`;
    $("[data-h2]", svg).textContent = `${(n & 15).toString(2).padStart(4, "0")} = ${hex[1]}`;
    $('[data-hero-r="bin"]', fig).textContent = n.toString(2).padStart(8, "0");
    $('[data-hero-r="den"]', fig).textContent = n;
    $('[data-hero-r="hex"]', fig).textContent = hex;
  }
  function stopAuto() { auto = false; clearInterval(timer); status.textContent = "Your byte"; }
  svg.addEventListener("click", (e) => { const g = e.target.closest("[data-bit]"); if (!g) return; stopAuto(); n ^= 1 << +g.dataset.bit; show(); });
  $$("[data-hero-op]", fig).forEach((b) => b.addEventListener("click", () => {
    stopAuto();
    const op = b.dataset.heroOp;
    n = op === "clear" ? 0 : op === "inc" ? (n + 1) & 255 : op === "shl" ? (n << 1) & 255 : (n >> 1);
    show();
  }));
  show();
  if (auto) timer = setInterval(() => { if (!auto) return; n = (n + 1) & 255; show(); }, 900);
})();
