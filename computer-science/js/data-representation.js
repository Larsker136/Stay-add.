/* ==========================================================================
   stay add. — CS topic 1, Data representation: the labs
   bits      one byte: switch bits, type denary or hex, unsigned or two's
             complement, logical shifts with the bits that fall off
   add       two bytes added column by column, carries and overflow
   media     a sound wave sampled (rate, resolution) or an image (resolution,
             colour depth), drawn as the computer stores it
   filesize  image and sound file sizes in bits, bytes, KiB and MiB
   rle       run-length encoding of a row of pixels
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs } = window.StayAdd.cs;
  const bin = (n, w = 8) => (n >>> 0).toString(2).padStart(w, "0").slice(-w);
  const hex = (n) => n.toString(16).toUpperCase().padStart(2, "0");
  const bitButtons = (host, cls = "") => {
    host.innerHTML = Array.from({ length: 8 }, (_, i) => `<button type="button" class="bit ${cls}" data-b="${7 - i}"><span data-v>0</span><small data-pv></small></button>`).join("");
    return $$(".bit", host);
  };

  /* ---------- bits ---------- */
  function bitsLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), btns = bitButtons($("[data-bits]", lab));
    let st = { n: 77, mode: "unsigned", lost: null, last: "" };
    const signed = () => (st.n & 128 ? st.n - 256 : st.n);
    function paintBits() {
      btns.forEach((b) => {
        const k = +b.dataset.b, on = (st.n >> k) & 1;
        b.setAttribute("aria-pressed", String(!!on)); $("[data-v]", b).textContent = on;
        $("[data-pv]", b).textContent = st.mode === "twos" && k === 7 ? "−128" : 2 ** k;
        b.classList.toggle("sign", st.mode === "twos" && k === 7);
      });
      $("[data-den-in]", lab).value = st.mode === "twos" ? signed() : st.n;
      $("[data-hex-in]", lab).value = hex(st.n);
    }
    function explain() {
      const parts = []; for (let k = 7; k >= 0; k--) if ((st.n >> k) & 1) parts.push(st.mode === "twos" && k === 7 ? "−128" : 2 ** k);
      const val = st.mode === "twos" ? signed() : st.n;
      res.innerHTML = rows([["binary", `${bin(st.n).slice(0, 4)} ${bin(st.n).slice(4)}`], ["denary", val], ["hexadecimal", hex(st.n)], ["range in this mode", st.mode === "twos" ? "−128 to 127" : "0 to 255"]]);
      let head = chips([[st.mode === "twos" ? "Two’s complement" : "Unsigned"], [`${val}`]]), body;
      if (st.last === "shl" || st.last === "shr") {
        const dir = st.last === "shl" ? "left" : "right";
        body = `<h3>Logical shift ${dir}</h3><p>Every bit moved one place ${dir}; a <b>0</b> filled the empty place. Shifting ${dir} ${dir === "left" ? "multiplies by 2" : "divides by 2 (whole numbers only)"}.${st.lost ? ` A <b>1</b> fell off the ${dir === "left" ? "left" : "right"} end and was lost — so the answer is ${dir === "left" ? "no longer double the old value (an overflow)" : "rounded down"}.` : ""}</p>`;
      } else if (st.mode === "twos") {
        body = `<h3>${val < 0 ? "A negative number" : "A positive number"}</h3><p>In two’s complement the leftmost bit is worth <b>−128</b>. ${val < 0 ? "It is 1 here, so start at −128 and add the rest" : "It is 0 here, so the number is positive and reads as normal"}: ${parts.length ? parts.join(" + ") : "0"} = <b>${val}</b>.</p><p>To make a negative: write the positive number in binary, <b>flip every bit</b>, then <b>add 1</b>.</p>`;
      } else {
        body = `<h3>${st.n} in binary</h3><p>Add the place values of the 1 bits: ${parts.length ? parts.join(" + ") : "none"} = <b>${st.n}</b>. For hex, split the byte into two nibbles: ${bin(st.n).slice(0, 4)} = ${hex(st.n)[0]}, ${bin(st.n).slice(4)} = ${hex(st.n)[1]}.</p>`;
      }
      exp.innerHTML = head + body + flow(["binary", "add the place values", "denary", "group in fours → hex"]);
    }
    const paint = controls(lab, st, () => { st.last = ""; paint(); paintBits(); explain(); });
    btns.forEach((b) => b.addEventListener("click", () => { st.n ^= 1 << +b.dataset.b; st.last = ""; paintBits(); explain(); }));
    $("[data-den-in]", lab).addEventListener("change", (e) => {
      let v = Math.round(+e.target.value || 0);
      v = st.mode === "twos" ? Math.max(-128, Math.min(127, v)) : Math.max(0, Math.min(255, v));
      st.n = v & 255; st.last = ""; paintBits(); explain();
    });
    $("[data-hex-in]", lab).addEventListener("change", (e) => { const v = parseInt(e.target.value, 16); st.n = isNaN(v) ? 0 : v & 255; st.last = ""; paintBits(); explain(); });
    $$("[data-op]", lab).forEach((b) => b.addEventListener("click", () => {
      const op = b.dataset.op;
      st.lost = op === "shl" ? (st.n >> 7) & 1 : op === "shr" ? st.n & 1 : null;
      if (op === "shl") st.n = (st.n << 1) & 255;
      if (op === "shr") st.n = st.n >> 1;
      if (op === "neg") st.n = (~st.n + 1) & 255;
      if (op === "clear") st.n = 0;
      st.last = op; paintBits(); explain();
    }));
    $("[data-reset]", lab).addEventListener("click", () => { st = Object.assign(st, { n: 77, mode: "unsigned", last: "" }); paint(); paintBits(); explain(); });
    lab.applyState = (s) => { Object.assign(st, s); st.last = s.last || ""; if (s.op) $(`[data-op="${s.op}"]`, lab).click(); paint(); paintBits(); explain(); };
    paint(); paintBits(); explain();
  }

  /* ---------- add ---------- */
  function addLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const A = bitButtons($("[data-a]", lab)), B = bitButtons($("[data-b]", lab)), S = bitButtons($("[data-s]", lab));
    S.forEach((b) => (b.disabled = true));
    let st = { a: 0b01011010, b: 0b00110110 };
    function paint() {
      const draw = (set, n) => set.forEach((b) => { const k = +b.dataset.b, on = (n >> k) & 1; b.setAttribute("aria-pressed", String(!!on)); $("[data-v]", b).textContent = on; $("[data-pv]", b).textContent = 2 ** k; });
      const sum = st.a + st.b, over = sum > 255;
      draw(A, st.a); draw(B, st.b); draw(S, sum & 255);
      // carries into each column
      const carries = []; let c = 0;
      for (let k = 0; k < 8; k++) { const t = ((st.a >> k) & 1) + ((st.b >> k) & 1) + c; c = t > 1 ? 1 : 0; carries[k] = c; }
      $("[data-carry]", lab).innerHTML = Array.from({ length: 8 }, (_, i) => `<span>${i === 0 ? (over ? "1 ←" : "") : carries[8 - i] ? "1" : ""}</span>`).join("");
      res.innerHTML = rows([["A", `${bin(st.a)} = ${st.a}`], ["B", `${bin(st.b)} = ${st.b}`], ["A + B (8 bits)", `${bin(sum & 255)} = ${sum & 255}`], ["true total", sum], ["overflow?", over ? "yes" : "no"]]);
      exp.innerHTML = (over ? chips([["Overflow", "down"], ["9th bit lost"]]) : chips([["Added", "up"], [`${sum}`]])) +
        (over ? `<h3>Overflow: the answer needs 9 bits</h3><p>${st.a} + ${st.b} = ${sum}, but one byte only holds up to <b>255</b>. The carry out of the leftmost column has nowhere to go, so the stored result is wrong (${sum & 255}). This is an <b>overflow error</b>.</p>`
              : `<h3>Column by column, right to left</h3><p>0 + 0 = 0 · 1 + 0 = 1 · 1 + 1 = 0 carry 1 · 1 + 1 + 1 = 1 carry 1. The small red 1s above are the carries. The answer fits in 8 bits, so it is correct.</p>`) +
        flow(["add each column", "write the units bit", "carry the 1", "carry out of bit 8 = overflow"]);
    }
    A.forEach((b) => b.addEventListener("click", () => { st.a ^= 1 << +b.dataset.b; paint(); }));
    B.forEach((b) => b.addEventListener("click", () => { st.b ^= 1 << +b.dataset.b; paint(); }));
    $("[data-reset]", lab).addEventListener("click", () => { st = { a: 0b01011010, b: 0b00110110 }; paint(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); };
    paint();
  }

  /* ---------- media: sampling a sound, storing an image ---------- */
  function mediaLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { kind: "sound", rate: 8, res: 3, px: 8, depth: 2 };
    const wave = (t) => Math.sin(t * Math.PI * 2 * 1.5) * 0.7 + Math.sin(t * Math.PI * 2 * 4.2) * 0.22;
    function draw() {
      $$("[data-for]", lab).forEach((g) => (g.hidden = g.dataset.for !== st.kind));
      if (st.kind === "sound") {
        const X = (t) => 40 + t * 560, Y = (v) => 150 - v * 110, levels = 2 ** st.res;
        let d = ""; for (let i = 0; i <= 200; i++) d += `${i ? "L" : "M"}${X(i / 200).toFixed(1)} ${Y(wave(i / 200)).toFixed(1)}`;
        const n = st.rate * 2, q = (v) => Math.round(((v + 1) / 2) * (levels - 1)) / (levels - 1) * 2 - 1;
        let stair = "", pts = "";
        for (let i = 0; i <= n; i++) {
          const t = i / n, v = q(wave(t)), x = X(t), y = Y(v);
          stair += `${i ? `L${x.toFixed(1)} ${Y(q(wave((i - 1) / n))).toFixed(1)}` : `M${x.toFixed(1)} ${y.toFixed(1)}`}L${x.toFixed(1)} ${y.toFixed(1)}`;
          pts += `<circle class="f cp dk" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5"/>`;
        }
        const grid = Array.from({ length: levels }, (_, i) => Y((i / (levels - 1)) * 2 - 1)).map((y) => `M40 ${y.toFixed(1)}H600`).join("");
        svg.innerHTML = `<path class="gl" d="${levels <= 32 ? grid : ""}"/><path class="ax" d="M40 30V270M40 150H604"/>
          <path class="l" style="--fc:var(--ink-4)" d="${d}"/><path class="l cp w3" d="${stair}"/>${pts}
          <text x="40" y="22">amplitude · ${levels} levels (${st.res}-bit)</text><text x="600" y="290" text-anchor="end">time → · ${n + 1} samples shown</text>
          <text x="40" y="290" style="fill:var(--ink-3)">grey: real sound</text><text x="150" y="290" class="tc cp">pink: what is stored</text>`;
      } else {
        const N = st.px, cs = Math.floor(240 / N), colours = 2 ** st.depth;
        const pal = colours <= 2 ? ["#f4f1e8", "#1c1c1c"] : Array.from({ length: Math.min(colours, 256) }, (_, i) => `hsl(${(i * 360) / Math.min(colours, 16)} 55% ${30 + (i % 3) * 18}%)`);
        let cells = "";
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
          // a smiley-like picture sampled at this resolution
          const x = (c + 0.5) / N - 0.5, y = (r + 0.5) / N - 0.5, d = Math.hypot(x, y);
          let v = d < 0.42 ? 0.65 : 0.1;
          if (Math.hypot(x + 0.15, y + 0.12) < 0.07 || Math.hypot(x - 0.15, y + 0.12) < 0.07) v = 0.95;
          if (Math.abs(d - 0.22) < 0.05 && y > 0.05) v = 0.95;
          const idx = Math.min(pal.length - 1, Math.round(v * (pal.length - 1)));
          cells += `<rect x="${200 + c * cs}" y="${30 + r * cs}" width="${cs}" height="${cs}" style="fill:${pal[idx]};stroke:var(--line);stroke-width:${N > 24 ? 0 : 0.5}"/>`;
        }
        svg.innerHTML = cells + `<text x="320" y="${30 + N * cs + 22}" text-anchor="middle">${N} × ${N} pixels · ${colours > 65536 ? "16.7 million" : colours} colours (${st.depth}-bit)</text>`;
      }
      explain();
    }
    function explain() {
      if (st.kind === "sound") {
        const bits = st.rate * 1000 * st.res;
        res.innerHTML = rows([["sample rate", `${st.rate} kHz`], ["sample resolution", `${st.res} bits`], ["levels", 2 ** st.res], ["size of 1 s, mono", `${(bits / 8 / 1024).toFixed(1)} KiB`]]);
        exp.innerHTML = chips([["Sound"], [`${st.rate} kHz · ${st.res}-bit`]]) + `<h3>Sampling a sound wave</h3><p>The computer measures the wave’s <b>amplitude</b> at regular intervals. The <b>sample rate</b> is how many samples per second; the <b>sample resolution</b> is how many bits store each sample, which sets how many levels it can choose from. ${st.rate >= 32 && st.res >= 12 ? "Here the stored wave follows the real one closely — high quality, but a large file." : "Raise them and the pink steps hug the grey wave more closely: better quality, larger file."}</p>` + flow(["higher sample rate / resolution", "more accurate copy", "more bits", "bigger file"]);
      } else {
        const bits = st.px * st.px * st.depth;
        res.innerHTML = rows([["resolution", `${st.px} × ${st.px}`], ["colour depth", `${st.depth} bits`], ["colours possible", (2 ** st.depth).toLocaleString()], ["file size", `${bits} bits = ${bits / 8} bytes`]]);
        exp.innerHTML = chips([["Image"], [`${st.px}×${st.px} · ${st.depth}-bit`]]) + `<h3>A bitmap image is a grid of pixels</h3><p>Each <b>pixel</b> stores a colour as a binary number. The <b>colour depth</b> is the number of bits per pixel: n bits gives 2ⁿ colours. The <b>resolution</b> is the number of pixels. More of either gives a better picture and a larger file.</p>` + flow(["more pixels or more bits per pixel", "better quality", "bigger file"]);
      }
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { rate: 8, res: 3, px: 8, depth: 2 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- filesize ---------- */
  function filesizeLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let st = { kind: "image", w: 1920, h: 1080, depth: 24, rate: 44100, sres: 16, secs: 60, ch: 2 };
    const unit = (bits) => { const B = bits / 8; return [["bits", bits.toLocaleString()], ["bytes (÷ 8)", B.toLocaleString()], ["KiB (÷ 1024)", (B / 1024).toLocaleString(undefined, { maximumFractionDigits: 2 })], ["MiB (÷ 1024 again)", (B / 1024 ** 2).toLocaleString(undefined, { maximumFractionDigits: 2 })]]; };
    function draw() {
      $$("[data-for]", lab).forEach((g) => (g.hidden = g.dataset.for !== st.kind));
      const bits = st.kind === "image" ? st.w * st.h * st.depth : st.rate * st.sres * st.secs * st.ch;
      res.innerHTML = rows(unit(bits));
      const sum = st.kind === "image" ? `${st.w.toLocaleString()} × ${st.h.toLocaleString()} × ${st.depth}` : `${st.rate.toLocaleString()} × ${st.sres} × ${st.secs}${st.ch > 1 ? ` × ${st.ch}` : ""}`;
      $("[data-calc]", lab).innerHTML = `<b>${st.kind === "image" ? "image size = width × height × colour depth" : "sound size = sample rate × resolution × seconds" + (st.ch > 1 ? " × channels" : "")}</b><br>${sum} = ${bits.toLocaleString()} bits`;
      exp.innerHTML = chips([[st.kind === "image" ? "Image" : "Sound"], [`${(bits / 8 / 1024 ** 2).toFixed(2)} MiB`]]) +
        `<h3>Work in bits, then divide</h3><p>The formula gives the size in <b>bits</b>. Divide by <b>8</b> for bytes, then by <b>1024</b> for kibibytes (KiB), and by 1024 again for mebibytes (MiB). Exam answers usually ask for a particular unit — show each division.</p>` +
        flow(["bits", "÷ 8 → bytes", "÷ 1024 → KiB", "÷ 1024 → MiB", "÷ 1024 → GiB"]);
    }
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { w: 1920, h: 1080, depth: 24, rate: 44100, sres: 16, secs: 60, ch: 2 }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  /* ---------- rle ---------- */
  function rleLab(lab) {
    const host = $("[data-pixels]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const W = 16, H = 6;
    const preset = ["0000000000000000", "0001111111111000", "0011111111111100", "0011100110011100", "0001111111111000", "0000000000000000"];
    let px = preset.map((r) => [...r].map(Number));
    host.style.gridTemplateColumns = `repeat(${W}, 1fr)`;
    function draw() {
      host.innerHTML = px.map((row, r) => row.map((v, c) => `<button type="button" class="px ${v ? "on" : ""}" data-r="${r}" data-c="${c}" aria-label="pixel ${r + 1},${c + 1}"></button>`).join("")).join("");
      const lines = px.map((row) => { const out = []; let cur = row[0], n = 0; for (const v of row) { if (v === cur) n++; else { out.push([n, cur]); cur = v; n = 1; } } out.push([n, cur]); return out; });
      const runs = lines.reduce((a, l) => a + l.length, 0), orig = W * H, comp = runs * 2;
      $("[data-rle]", lab).innerHTML = lines.map((l, i) => `<div><span>row ${i + 1}</span> ${l.map(([n, v]) => `<b>${n}</b>${v ? "B" : "W"}`).join(" ")}</div>`).join("");
      res.innerHTML = rows([["original: 1 byte per pixel", `${orig} bytes`], ["RLE: 2 bytes per run", `${runs} runs × 2 = ${comp} bytes`], ["saving", comp < orig ? `${Math.round((1 - comp / orig) * 100)} % smaller` : `${Math.round((comp / orig - 1) * 100)} % BIGGER`]]);
      exp.innerHTML = (comp < orig ? chips([["Compressed", "up"], ["lossless"]]) : chips([["Not worth it", "down"]])) +
        `<h3>${comp < orig ? "Long runs compress well" : "Too many short runs"}</h3><p>Run-length encoding replaces a run of identical values with <b>one count and one value</b>. It is <b>lossless</b>: decoding gives back exactly the same pixels. ${comp < orig ? "Here the runs are long, so the file shrinks." : "Click pixels to make a busy pattern: with many short runs, RLE can make the file larger."}</p>` + flow(["find runs of the same colour", "store count + colour", "fewer bytes if runs are long", "decode → identical image"]);
    }
    host.addEventListener("click", (e) => { const b = e.target.closest(".px"); if (!b) return; px[+b.dataset.r][+b.dataset.c] ^= 1; draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { px = preset.map((r) => [...r].map(Number)); draw(); });
    $("[data-noise]", lab).addEventListener("click", () => { px = px.map((r) => r.map(() => (Math.random() < 0.5 ? 1 : 0))); draw(); });
    lab.applyState = (s) => { if (s.noise) $("[data-noise]", lab).click(); else $("[data-reset]", lab).click(); };
    draw();
  }

  labs({ bits: bitsLab, add: addLab, media: mediaLab, filesize: filesizeLab, rle: rleLab });
})();
