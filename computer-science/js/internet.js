/* ==========================================================================
   stay add. — CS topic 5, The internet and its uses: the labs
   dns       a URL split into protocol, domain and file, then the journey of a
             web page request: browser → DNS → web server → browser
   chain     a blockchain: each block stores the hash of the one before; edit a
             block and every later link breaks
   password  how long a brute-force attack takes for a password
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, wait, esc } = window.StayAdd.cs;

  /* ---------- URL and DNS ---------- */
  function dnsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), parts = $("[data-parts]", lab);
    let st = { url: "https://www.example.com/learn/binary.html" }, busy = false;
    const NODES = { browser: [80, 150, "your browser", "cb"], dns: [320, 60, "DNS server", "cv"], dns2: [540, 60, "another DNS server", "cv"], web: [430, 240, "web server", "cg"] };
    function parse() {
      const m = st.url.trim().match(/^(https?):\/\/([^/\s]+)(\/[^\s]*)?$/i);
      return m ? { protocol: m[1].toLowerCase(), domain: m[2], path: m[3] || "/" } : null;
    }
    function base(active = [], label = "") {
      svg.innerHTML = Object.entries(NODES).map(([k, [x, y, t, c]]) => `<rect class="f ${c}${active.includes(k) ? " dk" : ""}" x="${x - 70}" y="${y - 24}" width="140" height="48" rx="8"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="k">${t}</text>`).join("") +
        `<path class="l dash" d="M150 140L250 70M390 60H470M150 160L360 236"/><g data-msg></g><text x="320" y="296" text-anchor="middle" class="k">${esc(label)}</text>`;
    }
    async function travel(from, to, text, cls) {
      const [x0, y0] = NODES[from], [x1, y1] = NODES[to], g = $("[data-msg]", svg);
      g.innerHTML = `<g data-dot><rect class="f ${cls} dk" x="-46" y="-12" width="92" height="24" rx="12"/><text text-anchor="middle" y="4" style="font-size:9.5px;fill:var(--ink)">${esc(text)}</text></g>`;
      const e = $("[data-dot]", g), t0 = performance.now(), dur = 900;
      await new Promise((done) => (function f(now) { const t = Math.min(1, (now - t0) / dur); e.setAttribute("transform", `translate(${x0 + (x1 - x0) * t} ${y0 + (y1 - y0) * t})`); t < 1 ? requestAnimationFrame(f) : done(); })(t0));
    }
    function showParts() {
      const p = parse();
      parts.innerHTML = p ? `<div class="url-parts"><span class="up-p">${esc(p.protocol)}://</span><span class="up-d">${esc(p.domain)}</span><span class="up-f">${esc(p.path)}</span></div>
        <div class="url-legend"><span class="up-p">protocol</span><span class="up-d">domain name</span><span class="up-f">web page / file name</span></div>` : `<p class="key"><span>type a full URL starting http:// or https://</span></p>`;
      return p;
    }
    async function go() {
      const p = showParts(); if (!p || busy) return; busy = true; $("[data-go]", lab).disabled = true;
      const ip = "93.184." + (p.domain.length * 7 % 255) + "." + (p.domain.length * 13 % 255);
      const step = async (active, label, text, ...move) => { base(active, label); exp.innerHTML = chips([["Request"], [label]]) + `<p>${text}</p>`; await travel(...move); };
      await step(["browser", "dns"], "1 · ask DNS for the IP address", `The browser sends the domain name <b>${esc(p.domain)}</b> to a <b>DNS server</b>.`, "browser", "dns", p.domain, "cb");
      await step(["dns", "dns2"], "2 · not found here — ask another DNS server", `If this DNS server doesn’t have the domain in its database, it passes the request on to another DNS server.`, "dns", "dns2", p.domain, "cv");
      await step(["dns", "dns2"], "3 · IP address found", `The IP address <b>${ip}</b> is found and sent back.`, "dns2", "dns", ip, "cv");
      await step(["browser", "dns"], "4 · IP address returned to the browser", `The DNS server returns the IP address to the browser.`, "dns", "browser", ip, "cv");
      await step(["browser", "web"], `5 · ${p.protocol.toUpperCase()} request sent to the web server`, `The browser sends a request for <b>${esc(p.path)}</b> to the web server at ${ip}${p.protocol === "https" ? ", over an encrypted <b>HTTPS</b> connection" : ""}.`, "browser", "web", `GET ${p.path}`.slice(0, 18), "cg");
      await step(["browser", "web"], "6 · web page sent back", `The web server sends back the page’s HTML (and its images, CSS…).`, "web", "browser", "HTML file", "cg");
      base(["browser"], "7 · browser renders the HTML into the page");
      res.innerHTML = rows([["protocol", p.protocol.toUpperCase() + (p.protocol === "https" ? " (secure)" : "")], ["domain name", esc(p.domain)], ["IP address (from DNS)", ip], ["file requested", esc(p.path)]]);
      exp.innerHTML = chips([["Page loaded", "up"]]) + `<h3>From URL to web page</h3><p>Humans use domain names; computers use IP addresses. The <b>DNS</b> translates one into the other, then the browser requests the page from the web server using <b>${p.protocol.toUpperCase()}</b> and <b>renders</b> the HTML it receives.</p>` + flow(["URL typed", "DNS → IP address", "HTTP(S) request to web server", "HTML sent back", "browser renders it"]);
      busy = false; $("[data-go]", lab).disabled = false;
    }
    const paint = controls(lab, st, () => { showParts(); });
    $("[data-go]", lab).addEventListener("click", go);
    $("[data-reset]", lab).addEventListener("click", () => { if (busy) return; st.url = "https://www.example.com/learn/binary.html"; paint(); showParts(); base(); res.innerHTML = ""; exp.innerHTML = chips([["Ready"]]) + `<h3>Type a URL and press Go</h3><p>Watch the browser find the server and fetch the page.</p>`; });
    lab.applyState = (s) => { if (busy) return; Object.assign(st, s); paint(); showParts(); if (s.go) go(); };
    $("[data-reset]", lab).click();
  }

  /* ---------- blockchain ---------- */
  function chainLab(lab) {
    const host = $("[data-blocks]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    // a small, readable stand-in for a cryptographic hash
    const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16).padStart(8, "0").toUpperCase(); };
    let data = ["Genesis", "Ana pays Ben 5", "Ben pays Cal 2", "Cal pays Dee 1"], links;
    function build() { links = []; let prev = "00000000"; data.forEach((d, i) => { const h = hash(i + d + prev); links.push({ d, prev, h }); prev = h; }); }
    let original;
    function draw() {
      const brokenFrom = links.findIndex((b, i) => b.h !== original[i].h);
      host.innerHTML = links.map((b, i) => `<div class="blk ${brokenFrom !== -1 && i >= brokenFrom ? "bad" : ""}">
        <b>block ${i}</b><label class="field">data<input type="text" data-i="${i}" value="${esc(b.d)}"></label>
        <span>previous hash</span><code class="i">${b.prev}</code><span>this block’s hash</span><code class="i">${b.h}</code></div>`).join("");
      const ok = brokenFrom === -1;
      res.innerHTML = rows([["blocks", links.length], ["chain valid?", ok ? "yes" : `no — broken from block ${brokenFrom}`]]);
      exp.innerHTML = (ok ? chips([["Valid", "up"]]) : chips([["Tampered", "down"]])) + (ok
        ? `<h3>Every block points to the one before</h3><p>Each block stores its transaction data, its own <b>hash</b> (a value calculated from its contents) and the <b>hash of the previous block</b>. Try changing an amount in block 2.</p>`
        : `<h3>Changing one block breaks every link after it</h3><p>Editing block ${brokenFrom} changed its hash, so it no longer matches the “previous hash” stored in block ${brokenFrom + 1} — and so on along the chain. Because copies of the chain are held by many computers, the tampered copy is rejected. This is why a blockchain is hard to alter.</p>`) +
        flow(["transaction recorded in a block", "block’s hash from its data + previous hash", "blocks chained", "change one → hashes no longer match"]);
    }
    host.addEventListener("change", (e) => { const i = e.target.dataset.i; if (i === undefined) return; data[+i] = e.target.value; build(); draw(); });
    $("[data-add]", lab).addEventListener("click", () => { data.push(`Dee pays Ana ${data.length}`); build(); original = links.map((x) => ({ ...x })); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { data = ["Genesis", "Ana pays Ben 5", "Ben pays Cal 2", "Cal pays Dee 1"]; build(); original = links.map((x) => ({ ...x })); draw(); });
    lab.applyState = (s) => { $("[data-reset]", lab).click(); if (s.tamper) { data[2] = "Ben pays Cal 200"; build(); draw(); } };
    $("[data-reset]", lab).click();
  }

  /* ---------- password strength ---------- */
  function passwordLab(lab) {
    const inp = $("[data-pw]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), bar = $("[data-bar]", lab);
    const GUESSES = 1e10;   // guesses per second for a fast offline attack
    const nice = (s) => s < 1 ? "instantly" : s < 60 ? `${s.toFixed(0)} seconds` : s < 3600 ? `${(s / 60).toFixed(0)} minutes` : s < 86400 ? `${(s / 3600).toFixed(0)} hours` : s < 3.15e7 ? `${(s / 86400).toFixed(0)} days` : s < 3.15e10 ? `${(s / 3.15e7).toFixed(0)} years` : "millions of years";
    function run() {
      const p = inp.value, sets = [[/[a-z]/, 26, "lower case"], [/[A-Z]/, 26, "upper case"], [/[0-9]/, 10, "digits"], [/[^A-Za-z0-9]/, 32, "symbols"]];
      const used = sets.filter(([r]) => r.test(p)), pool = used.reduce((a, [, n]) => a + n, 0) || 1;
      const combos = Math.pow(pool, p.length), secs = combos / 2 / GUESSES, common = /^(password|123456|qwerty|letmein|admin)/i.test(p);
      const score = common ? 0 : Math.min(1, Math.log10(Math.max(1, secs)) / 12);
      bar.style.width = `${Math.max(4, score * 100)}%`; bar.style.background = score < 0.35 ? "var(--c-err)" : score < 0.7 ? "var(--amber)" : "var(--c-bit)";
      res.innerHTML = rows([["length", p.length], ["character types", used.map((u) => u[2]).join(", ") || "—"], ["possible combinations", combos > 1e15 ? combos.toExponential(1) : Math.round(combos).toLocaleString()], ["average brute-force time", common ? "instantly (common password)" : nice(secs)]]);
      exp.innerHTML = chips([[common || score < 0.35 ? "Weak" : score < 0.7 ? "Medium" : "Strong", common || score < 0.35 ? "down" : score < 0.7 ? "warn" : "up"]]) +
        `<h3>${common ? "A common password is guessed first" : "Brute force: try every combination"}</h3><p>A <b>brute-force attack</b> tries every possible combination until one works. Each extra character multiplies the number of combinations by the size of the character set, so <b>length</b> and a <b>mix of character types</b> make it far slower. ${common ? "Lists of common passwords are tried before anything else." : ""} Two-step verification means a stolen password alone is not enough.</p>` +
        flow(["longer + more character types", "far more combinations", "brute force takes too long"]);
    }
    inp.addEventListener("input", run);
    $("[data-reset]", lab).addEventListener("click", () => { inp.value = "sunshine"; run(); });
    lab.applyState = (s) => { inp.value = s.pw; run(); };
    inp.value = "sunshine"; run();
  }

  labs({ dns: dnsLab, chain: chainLab, password: passwordLab });
})();
