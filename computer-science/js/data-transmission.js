/* ==========================================================================
   stay add. — CS topic 2, Data transmission: the labs
   packets  a message split into numbered packets that cross a network of
            routers by different routes, arrive out of order and are put back
            together; a link can be cut so packets reroute
   parity   seven data bits plus a parity bit; noise can flip one or two bits
            on the way, the receiver checks the parity and asks for a resend
   check    an ISBN-13 check digit: calculate it, then mistype a digit
   cipher   a Caesar cipher as the simplest symmetric encryption
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, wait, esc } = window.StayAdd.cs;

  /* ---------- packets ---------- */
  function packetsLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const N = { A: [50, 150], R1: [180, 70], R2: [180, 230], R3: [320, 150], R4: [460, 70], R5: [460, 230], B: [590, 150] };
    const LINKS = [["A", "R1"], ["A", "R2"], ["R1", "R3"], ["R2", "R3"], ["R1", "R4"], ["R2", "R5"], ["R3", "R4"], ["R3", "R5"], ["R4", "B"], ["R5", "B"], ["R4", "R5"]];
    let st = { msg: "HELLO WORLD", cut: false }, sending = false, arrived = [];
    const key = (a, b) => [a, b].sort().join("-");
    const open = (a, b) => !(st.cut && key(a, b) === "R3-R4");
    function routes() {
      // every simple path from A to B, shortest first
      const out = [], walk = (n, path) => { if (n === "B") return out.push(path); LINKS.forEach(([a, b]) => { const m = a === n ? b : b === n ? a : null; if (m && !path.includes(m) && open(n, m)) walk(m, [...path, m]); }); };
      walk("A", ["A"]); return out.sort((p, q) => p.length - q.length).slice(0, 8);
    }
    function base() {
      svg.innerHTML = LINKS.map(([a, b]) => `<path class="l ${open(a, b) ? "" : "cr dash"}" data-link="${key(a, b)}" d="M${N[a][0]} ${N[a][1]}L${N[b][0]} ${N[b][1]}"/>`).join("") +
        Object.entries(N).map(([k, [x, y]]) => k.startsWith("R") ? `<circle class="f" cx="${x}" cy="${y}" r="18"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="k">${k}</text>` : `<rect class="f cb" x="${x - 30}" y="${y - 22}" width="60" height="44" rx="6"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="k">${k === "A" ? "sender" : "receiver"}</text>`).join("") +
        (st.cut ? `<text x="390" y="100" class="tc cr">link broken</text>` : "") + `<g data-pk></g>`;
    }
    const packetsOf = () => { const t = st.msg.slice(0, 24) || " ", size = Math.ceil(t.length / 4); return Array.from({ length: Math.min(6, Math.ceil(t.length / Math.max(1, Math.ceil(t.length / 6)))) }, (_, i) => t.slice(i * Math.ceil(t.length / 6), (i + 1) * Math.ceil(t.length / 6))).filter(Boolean).map((d, i, arr) => ({ n: i + 1, of: arr.length, data: d })); };
    function table(list, title) {
      return `<p class="block-h" style="margin-top:6px">${title}</p><table class="qtable"><tr><th>#</th><th>header: from → to</th><th>payload</th><th>trailer</th></tr>${list.map((p) => `<tr><td>${p.n} of ${p.of}</td><td>192.168.0.2 → 81.2.69.160</td><td>“${esc(p.data)}”</td><td>checksum</td></tr>`).join("")}</table>`;
    }
    async function send() {
      if (sending) return; sending = true; arrived = []; base(); $("[data-send]", lab).disabled = true;
      const ps = packetsOf(), R = routes(), g = $("[data-pk]", svg);
      exp.innerHTML = chips([["Sending", "warn"], [`${ps.length} packets`]]) + `<h3>Split into packets</h3><p>The message is broken into numbered packets. Each router reads the destination in the header and sends the packet on by whichever route is least busy — so packets can take different routes.</p>`;
      await Promise.all(ps.map(async (p, i) => {
        const route = R[(i * 3 + Math.floor(Math.random() * R.length)) % R.length];
        const e = document.createElementNS("http://www.w3.org/2000/svg", "g");
        e.innerHTML = `<rect class="f cp dk" x="-14" y="-10" width="28" height="20" rx="4"/><text y="4" text-anchor="middle" class="k">${p.n}</text>`;
        g.appendChild(e);
        await wait(i * 250 + Math.random() * 300);
        for (let s = 0; s < route.length - 1; s++) {
          const [x0, y0] = N[route[s]], [x1, y1] = N[route[s + 1]], dur = 450 + Math.random() * 500, t0 = performance.now();
          $(`[data-link="${key(route[s], route[s + 1])}"]`, svg)?.classList.add("cp");
          await new Promise((done) => { (function f(now) { const t = Math.min(1, (now - t0) / dur); e.setAttribute("transform", `translate(${x0 + (x1 - x0) * t} ${y0 + (y1 - y0) * t})`); t < 1 ? requestAnimationFrame(f) : done(); })(t0); });
        }
        p.route = route.join(" → "); arrived.push(p); e.remove();
        res.innerHTML = rows([["packets arrived", `${arrived.length} of ${ps.length}`], ["arrival order", arrived.map((a) => a.n).join(", ")], ["received so far", `“${esc(arrived.map((a) => a.data).join(""))}”`]]);
      }));
      const ordered = [...arrived].sort((a, b) => a.n - b.n), outOfOrder = arrived.some((p, i) => p.n !== i + 1);
      res.innerHTML = rows([["arrival order", arrived.map((a) => a.n).join(", ")], ["reassembled", `“${esc(ordered.map((a) => a.data).join(""))}”`], ["routes used", new Set(arrived.map((a) => a.route)).size]]) + table(ordered, "Packets, in order");
      exp.innerHTML = chips([["Delivered", "up"], [outOfOrder ? "out of order" : "in order"]]) + `<h3>${outOfOrder ? "Arrived out of order — and put back together" : "Reassembled"}</h3><p>The packets took ${new Set(arrived.map((a) => a.route)).size} different routes${outOfOrder ? " and arrived in a different order" : ""}. The receiver uses the <b>packet number</b> in each header to put them back in order. A missing packet would be requested again.${st.cut ? " Because one link was broken, routers simply sent packets another way — packet switching is resilient." : ""}</p>` + flow(["split into packets", "each routed separately", "arrive in any order", "reordered by packet number"]);
      sending = false; $("[data-send]", lab).disabled = false;
    }
    const paint = controls(lab, st, (k) => { paint(); if (!sending) { base(); idle(); } });
    function idle() { res.innerHTML = rows([["message", `“${esc(st.msg)}”`], ["packets", packetsOf().length]]) + table(packetsOf(), "Packets to send"); exp.innerHTML = chips([["Ready"]]) + `<h3>Press Send</h3><p>Watch each numbered packet find its own way through the routers.</p>`; }
    $("[data-send]", lab).addEventListener("click", send);
    $("[data-reset]", lab).addEventListener("click", () => { if (sending) return; Object.assign(st, { msg: "HELLO WORLD", cut: false }); paint(); base(); idle(); });
    lab.applyState = (s) => { if (sending) return; Object.assign(st, s); paint(); base(); idle(); if (s.send) send(); };
    paint(); base(); idle();
  }

  /* ---------- parity ---------- */
  function parityLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const host = $("[data-sent]", lab), rhost = $("[data-recv]", lab);
    let st = { data: 0b1011001, type: "even", noise: 1 }, received = null, flipped = [];
    const ones = (n) => n.toString(2).split("").filter((c) => c === "1").length;
    const parityBit = () => (st.type === "even" ? ones(st.data) % 2 : 1 - (ones(st.data) % 2));
    const byte = () => (parityBit() << 7) | st.data;
    function bitsHtml(n, clickable, flips = []) {
      return Array.from({ length: 8 }, (_, i) => { const k = 7 - i, on = (n >> k) & 1; return `<button type="button" class="bit ${k === 7 ? "par" : ""} ${flips.includes(k) ? "flip" : ""}" data-k="${k}" aria-pressed="${!!on}" ${clickable && k !== 7 ? "" : "disabled"}><span>${on}</span><small>${k === 7 ? "parity" : "data"}</small></button>`; }).join("");
    }
    function paintAll() {
      host.innerHTML = bitsHtml(byte(), true);
      rhost.innerHTML = received === null ? `<p class="key"><span>press Transmit</span></p>` : bitsHtml(received, false, flipped);
      const count = ones(byte());
      if (received === null) {
        res.innerHTML = rows([["1s in the data bits", ones(st.data)], ["parity bit set to", parityBit()], ["1s in the whole byte", `${count} (${count % 2 ? "odd" : "even"})`]]);
        exp.innerHTML = chips([[`${st.type} parity`]]) + `<h3>Setting the parity bit</h3><p>With <b>${st.type}</b> parity the sender sets the parity bit so the byte has an <b>${st.type}</b> number of 1s. There are ${ones(st.data)} ones in the data, so the parity bit is <b>${parityBit()}</b>.</p>` + flow(["count the 1s", `make the total ${st.type}`, "send the byte", "receiver counts again"]);
        return;
      }
      const rc = ones(received), ok = (rc % 2 === 0) === (st.type === "even");
      res.innerHTML = rows([["bits flipped by noise", flipped.length], ["1s received", `${rc} (${rc % 2 ? "odd" : "even"})`], ["parity check", ok ? "passed" : "FAILED"]]);
      let head, body;
      if (!ok) { head = chips([["Error detected", "down"], ["resend requested"]]); body = `<h3>Parity check failed</h3><p>The receiver expected an ${st.type} number of 1s but counted ${rc}. It knows the byte is wrong — though not <b>which</b> bit — so with <b>ARQ</b> it sends a negative acknowledgement and the sender transmits the byte again.</p>`; }
      else if (flipped.length) { head = chips([["Not detected!", "warn"]]); body = `<h3>Two bits flipped — the check passed anyway</h3><p>Flipping two bits keeps the number of 1s ${st.type}, so the parity check <b>cannot detect</b> this error. That is the weakness of a single parity bit — parity blocks or checksums catch more.</p>`; }
      else { head = chips([["Received", "up"], ["no errors"]]); body = `<h3>Parity check passed</h3><p>The byte arrived unchanged; the receiver sends a positive acknowledgement.</p>`; }
      exp.innerHTML = head + body + flow(["receiver counts the 1s", "matches the agreed parity?", "no → request resend (ARQ)"]);
    }
    host.addEventListener("click", (e) => { const b = e.target.closest(".bit"); if (!b || b.disabled) return; st.data ^= 1 << +b.dataset.k; received = null; paintAll(); });
    const paint = controls(lab, st, () => { paint(); received = null; paintAll(); });
    $("[data-tx]", lab).addEventListener("click", () => {
      flipped = []; const ks = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => Math.random() - 0.5).slice(0, st.noise);
      received = byte(); ks.forEach((k) => { received ^= 1 << k; flipped.push(k); }); paintAll();
    });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { data: 0b1011001, type: "even", noise: 1 }); received = null; paint(); paintAll(); });
    lab.applyState = (s) => { Object.assign(st, s); received = null; paint(); paintAll(); if (s.tx) $("[data-tx]", lab).click(); };
    paint(); paintAll();
  }

  /* ---------- check digit (ISBN-13) ---------- */
  function checkLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), inp = $("[data-isbn]", lab), work = $("[data-work]", lab);
    function run() {
      const digits = inp.value.replace(/\D/g, "").slice(0, 13).split("").map(Number);
      if (digits.length < 12) { work.innerHTML = `<p class="key"><span>type at least 12 digits</span></p>`; res.innerHTML = ""; exp.innerHTML = chips([["Waiting"]]) + `<h3>Type a 12-digit ISBN</h3><p>The 13th digit — the check digit — is calculated from the first 12.</p>`; return; }
      const first = digits.slice(0, 12), w = first.map((_, i) => (i % 2 ? 3 : 1)), prod = first.map((d, i) => d * w[i]), sum = prod.reduce((a, b) => a + b, 0), cd = (10 - (sum % 10)) % 10;
      work.innerHTML = `<table class="tt"><tr><th>digit</th>${first.map((d) => `<td>${d}</td>`).join("")}</tr><tr><th>× weight</th>${w.map((x) => `<td>${x}</td>`).join("")}</tr><tr><th>=</th>${prod.map((x) => `<td>${x}</td>`).join("")}</tr></table>`;
      const given = digits[12];
      res.innerHTML = rows([["sum of products", sum], ["sum MOD 10", sum % 10], ["check digit = 10 − that", cd], ...(given !== undefined ? [["13th digit typed", given]] : [])]);
      if (given === undefined) exp.innerHTML = chips([["Calculated", "up"], [`check digit ${cd}`]]) + `<h3>The check digit is ${cd}</h3><p>Multiply the digits alternately by 1 and 3, add, take the remainder after dividing by 10, and subtract it from 10 (a result of 10 becomes 0). Now type a 13th digit, or change one of the first 12, to see the check fail.</p>`;
      else exp.innerHTML = (given === cd ? chips([["Valid", "up"]]) : chips([["Invalid", "down"], ["data entry error"]])) + `<h3>${given === cd ? "The number is accepted" : "The check digit does not match"}</h3><p>${given === cd ? "Recalculating from the first 12 digits gives the same check digit, so the number was probably entered correctly." : `The computer recalculates ${cd} but the 13th digit is ${given}, so a digit was mistyped or two digits swapped. The number is rejected and must be re-entered.`}</p>` + flow(["recalculate from the data", "compare with the check digit", "different → error"]);
    }
    inp.addEventListener("input", run);
    $("[data-reset]", lab).addEventListener("click", () => { inp.value = "978014300723"; run(); });
    lab.applyState = (s) => { inp.value = s.isbn; run(); };
    inp.value = "978014300723"; run();
  }

  /* ---------- cipher ---------- */
  function cipherLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), wheel = $("[data-wheel]", lab);
    let st = { text: "MEET AT NOON", key: 3 };
    const shift = (t, k) => t.toUpperCase().replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + k + 26) % 26) + 65));
    function draw() {
      const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      wheel.innerHTML = `<table class="tt"><tr><th>plain</th>${[...A].map((c) => `<td>${c}</td>`).join("")}</tr><tr><th>cipher</th>${[...A].map((c) => `<td class="one">${shift(c, st.key)}</td>`).join("")}</tr></table>`;
      const ct = shift(st.text, st.key);
      res.innerHTML = rows([["plaintext", esc(st.text.toUpperCase())], ["key", st.key], ["ciphertext", esc(ct)], ["decrypted with the same key", esc(shift(ct, -st.key))]]);
      exp.innerHTML = chips([["Symmetric"], [`key ${st.key}`]]) + `<h3>Encrypted with key ${st.key}</h3><p>Each letter moves ${st.key} places along the alphabet. Anyone who intercepts “${esc(ct)}” sees meaningless text — but anyone who knows the <b>key</b> can reverse it. In <b>symmetric</b> encryption the same key encrypts and decrypts, so the key itself must be shared safely. Only 25 keys exist here, so it is easy to crack by trying them all; real ciphers use keys of 128 bits or more.</p>` + flow(["plaintext", "encryption algorithm + key", "ciphertext sent", "same key decrypts"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { text: "MEET AT NOON", key: 3 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ packets: packetsLab, parity: parityLab, check: checkLab, cipher: cipherLab });
})();
