/* ==========================================================================
   stay add. — CS topic 3, Hardware: the labs
   fde      a tiny program in memory run one step of the fetch–decode–execute
            cycle at a time; registers and buses light up as they are used
   sensor   pick the sensor for each automated system
   vmem     open programs until RAM is full; pages move to virtual memory on
            the disk, and the computer slows (disk thrashing)
   address  an IPv4 address in denary and binary, and a MAC address split into
            manufacturer and device parts
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, esc } = window.StayAdd.cs;

  /* ---------- fetch–decode–execute ---------- */
  function fdeLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), regsEl = $("[data-regs]", lab);
    const PROG = { 0: ["LDA", 5], 1: ["ADD", 6], 2: ["STO", 7], 3: ["HLT", 0], 5: 12, 6: 30, 7: 0 };
    let mem, r, step, phase, hot, buses, halted;
    const STEPS = [
      { ph: "fetch", t: "The address in the <b>PC</b> is copied to the <b>MAR</b>.", hot: ["PC", "MAR"], bus: [] },
      { ph: "fetch", t: "The address goes along the <b>address bus</b> to memory; the control unit sends a <b>read</b> signal on the control bus.", hot: ["MAR"], bus: ["addr", "ctrl"] },
      { ph: "fetch", t: "The instruction stored at that address travels along the <b>data bus</b> into the <b>MDR</b>.", hot: ["MDR"], bus: ["data"] },
      { ph: "fetch", t: "The instruction is copied from the MDR to the <b>CIR</b>, and the <b>PC is incremented</b> by 1 so it points at the next instruction.", hot: ["MDR", "CIR", "PC"], bus: [] },
      { ph: "decode", t: "The <b>control unit</b> decodes the instruction in the CIR: what operation, and which address?", hot: ["CIR", "CU"], bus: [] },
      { ph: "execute", t: "", hot: [], bus: [] }
    ];
    function reset() {
      mem = Object.fromEntries(Array.from({ length: 8 }, (_, i) => [i, PROG[i] ?? 0]));
      r = { PC: 0, MAR: "–", MDR: "–", CIR: "–", ACC: 0 }; step = 0; phase = "fetch"; hot = []; buses = []; halted = false; draw();
      exp.innerHTML = chips([["Ready"]]) + `<h3>A four-line program</h3><p>Memory holds the instructions and the data together — that is the <b>von Neumann</b> (stored program) idea. Press <b>Next step</b>.</p>`;
    }
    const show = (v) => (Array.isArray(v) ? `${v[0]} ${v[0] === "HLT" ? "" : v[1]}`.trim() : v);
    function draw() {
      const H = (k) => (hot.includes(k) ? " hot" : "");
      regsEl.innerHTML = ["PC", "MAR", "MDR", "CIR", "ACC"].map((k) => `<div class="reg${H(k)}"><b>${k}</b><span>${esc(show(r[k]))}</span></div>`).join("");
      const B = (k, c) => (buses.includes(k) ? `l w5 ${c}` : "l w3");
      svg.innerHTML = `
        <rect class="f cp lt" x="20" y="20" width="300" height="230" rx="10"/><text x="34" y="42" class="k">CPU</text>
        <rect class="f ${hot.includes("CU") ? "cp dk" : "cp"}" x="40" y="56" width="120" height="58" rx="6"/><text x="100" y="82" text-anchor="middle" class="k">control unit</text><text x="100" y="98" text-anchor="middle">decodes, controls</text>
        <rect class="f ${phase === "execute" && hot.includes("ACC") ? "ct dk" : "ct"}" x="180" y="56" width="120" height="58" rx="6"/><text x="240" y="82" text-anchor="middle" class="k">ALU</text><text x="240" y="98" text-anchor="middle">arithmetic, logic</text>
        <text x="40" y="140">registers: see the panel →</text><text x="40" y="160">PC · MAR · MDR · CIR · ACC</text>
        <rect class="f" x="40" y="176" width="260" height="56" rx="6"/><text x="170" y="200" text-anchor="middle" class="k">cache · clock</text><text x="170" y="218" text-anchor="middle">${phase.toUpperCase()}</text>
        <path class="${B("addr", "ca")}" d="M320 90H420"/><path class="${B("data", "cb")}" d="M320 140H420"/><path class="${B("ctrl", "cv")}" d="M320 190H420"/>
        <text x="370" y="82" text-anchor="middle" class="tc ca">address bus →</text><text x="370" y="132" text-anchor="middle" class="tc cb">↔ data bus</text><text x="370" y="182" text-anchor="middle" class="tc cv">↔ control bus</text>
        <rect class="f cb lt" x="420" y="20" width="200" height="230" rx="10"/><text x="434" y="42" class="k">memory (RAM)</text>
        ${Object.entries(mem).map(([a, v], i) => `<rect class="f ${String(r.MAR) === a && buses.length ? "ca dk" : "lt"}" x="436" y="${52 + i * 24}" width="168" height="20" rx="3"/><text x="446" y="${66 + i * 24}">${a}</text><text x="474" y="${66 + i * 24}" class="mono-b">${esc(show(v))}</text>`).join("")}`;
      res.innerHTML = rows([["phase", phase], ["step", step ? `${((step - 1) % 6) + 1} of 6` : "—"], ["next instruction at", r.PC], ["accumulator", r.ACC], ["memory 7", mem[7]]]);
    }
    function next() {
      if (halted) return;
      const s = STEPS[step % 6]; phase = s.ph; hot = s.hot; buses = s.bus;
      if (step % 6 === 0) r.MAR = r.PC;
      if (step % 6 === 2) r.MDR = mem[r.MAR];
      if (step % 6 === 3) { r.CIR = r.MDR; r.PC += 1; }
      let text = s.t;
      if (step % 6 === 5) {
        const [op, a] = r.CIR;
        if (op === "LDA") { r.MAR = a; r.MDR = mem[a]; r.ACC = mem[a]; hot = ["MAR", "MDR", "ACC"]; buses = ["addr", "data", "ctrl"]; text = `Execute <b>LDA ${a}</b>: the value at address ${a} (${mem[a]}) is fetched and loaded into the <b>accumulator</b>.`; }
        if (op === "ADD") { r.MAR = a; r.MDR = mem[a]; r.ACC += mem[a]; hot = ["MDR", "ACC"]; buses = ["addr", "data", "ctrl"]; text = `Execute <b>ADD ${a}</b>: the value at address ${a} (${mem[a]}) is fetched and the <b>ALU</b> adds it to the accumulator: now ${r.ACC}.`; }
        if (op === "STO") { r.MAR = a; r.MDR = r.ACC; mem[a] = r.ACC; hot = ["MAR", "MDR"]; buses = ["addr", "data", "ctrl"]; text = `Execute <b>STO ${a}</b>: the accumulator (${r.ACC}) is sent along the data bus and stored at address ${a}.`; }
        if (op === "HLT") { halted = true; hot = ["CIR"]; text = "Execute <b>HLT</b>: the program stops. 12 + 30 = 42 is now stored in memory."; }
      }
      step++; draw();
      exp.innerHTML = chips([[phase.charAt(0).toUpperCase() + phase.slice(1), phase === "execute" ? "up" : phase === "decode" ? "warn" : ""], [halted ? "halted" : `cycle ${Math.ceil(step / 6)}`]]) + `<h3>${phase === "fetch" ? "Fetch" : phase === "decode" ? "Decode" : "Execute"}</h3><p>${text}</p>` + flow(["PC → MAR", "address bus", "data → MDR", "MDR → CIR, PC + 1", "CU decodes", "execute"]);
    }
    $("[data-next]", lab).addEventListener("click", next);
    $("[data-run]", lab).addEventListener("click", () => { while (!halted) next(); });
    $("[data-reset]", lab).addEventListener("click", reset);
    lab.applyState = (s) => { reset(); for (let i = 0; i < (s.steps || 0); i++) next(); };
    reset();
  }

  /* ---------- sensor matcher ---------- */
  function sensorLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), q = $("[data-q]", lab), opts = $("[data-opts]", lab);
    const S = ["temperature", "light", "moisture", "humidity", "pH", "infrared", "pressure", "acoustic", "gas", "proximity", "level", "magnetic field", "accelerometer", "flow"];
    const QS = [
      ["A greenhouse window opens when it gets too warm.", "temperature"], ["Street lights switch on at dusk.", "light"], ["A sprinkler waters a lawn only when the soil is dry.", "moisture"],
      ["A fish tank warns the owner when the water becomes too acidic.", "pH"], ["A burglar alarm detects body heat moving in a dark room.", "infrared"], ["A car park barrier counts cars driving over a mat.", "pressure"],
      ["A security system detects breaking glass.", "acoustic"], ["A kitchen alarm detects carbon monoxide.", "gas"], ["A car beeps faster as it reverses towards a wall.", "proximity"],
      ["A phone screen rotates when the phone is turned sideways.", "accelerometer"], ["A tank tops up when the water drops below a mark.", "level"], ["A museum keeps the air from becoming too damp for old paintings.", "humidity"]
    ];
    let order = QS.map((_, i) => i).sort(() => Math.random() - 0.5), i = 0, score = 0, answered = false;
    function show() {
      const [text, ans] = QS[order[i]];
      const choices = [ans, ...S.filter((s) => s !== ans).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
      q.innerHTML = `<p class="key"><span>scenario ${i + 1} of ${QS.length}</span></p><h3 style="font:500 20px/1.3 var(--font-display);margin:6px 4px 10px">${text}</h3>`;
      opts.innerHTML = choices.map((c) => `<button class="sc" type="button" data-c="${c}">${c} sensor</button>`).join("");
      answered = false; res.innerHTML = rows([["score", `${score} / ${i}`]]);
      exp.innerHTML = chips([["Choose"]]) + `<h3>Which sensor?</h3><p>Ask: what physical quantity changes in this situation?</p>`;
    }
    opts.addEventListener("click", (e) => {
      const b = e.target.closest("[data-c]"); if (!b || answered) return; answered = true;
      const ans = QS[order[i]][1], ok = b.dataset.c === ans; if (ok) score++;
      $$("[data-c]", opts).forEach((x) => { x.disabled = true; if (x.dataset.c === ans) x.setAttribute("aria-pressed", "true"); });
      res.innerHTML = rows([["score", `${score} / ${i + 1}`]]);
      exp.innerHTML = chips([[ok ? "Correct" : "Not quite", ok ? "up" : "down"], [`${ans} sensor`]]) + `<h3>${ans.charAt(0).toUpperCase() + ans.slice(1)} sensor</h3><p>The sensor sends readings to a <b>microprocessor</b>, which compares them with a stored value and, if needed, signals an <b>actuator</b> or an alarm.</p>`;
      setTimeout(() => { if (i < QS.length - 1) { i++; show(); } else { exp.innerHTML = chips([["Finished", "up"]]) + `<h3>You scored ${score} / ${QS.length}</h3><p>Press Reset to try again in a new order.</p>`; } }, 1600);
    });
    $("[data-reset]", lab).addEventListener("click", () => { order.sort(() => Math.random() - 0.5); i = 0; score = 0; show(); });
    lab.applyState = () => $("[data-reset]", lab).click();
    show();
  }

  /* ---------- virtual memory ---------- */
  function vmemLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), ramEl = $("[data-ram]", lab), diskEl = $("[data-disk]", lab);
    const APPS = [["OS", 3, "cv"], ["browser", 4, "cb"], ["music", 2, "ct"], ["game", 6, "cr"], ["editor", 3, "ca"], ["video call", 4, "cp"]];
    let st = { ram: 12 }, open = ["OS"], active = "OS";
    const size = (n) => APPS.find((a) => a[0] === n)[1];
    function layout() {
      // the active program and the OS stay in RAM; others are paged out when RAM is full
      const pages = []; open.forEach((n) => { for (let k = 0; k < size(n); k++) pages.push(n); });
      const priority = (n) => (n === "OS" ? 0 : n === active ? 1 : 2);
      const sorted = [...pages].sort((a, b) => priority(a) - priority(b));
      return { inRam: sorted.slice(0, st.ram), onDisk: sorted.slice(st.ram) };
    }
    function draw() {
      const { inRam, onDisk } = layout(), col = (n) => APPS.find((a) => a[0] === n)[2];
      ramEl.innerHTML = Array.from({ length: st.ram }, (_, k) => `<div class="cell-v ${inRam[k] ? "done" : ""}" style="${inRam[k] ? `border-color:var(--${{ cv: "violet", cb: "blue", ct: "teal", cr: "red", ca: "amber", cp: "rose" }[col(inRam[k])]})` : ""}">${inRam[k] ? inRam[k].slice(0, 3) : "·"}</div>`).join("");
      diskEl.innerHTML = onDisk.length ? onDisk.map((n) => `<div class="cell-v miss">${n.slice(0, 3)}</div>`).join("") : `<p class="key"><span>empty</span></p>`;
      $$("[data-app]", lab).forEach((b) => b.setAttribute("aria-pressed", String(open.includes(b.dataset.app))));
      const thrash = onDisk.length > st.ram * 0.6;
      res.innerHTML = rows([["programs open", open.length], ["pages in RAM", `${inRam.length} / ${st.ram}`], ["pages in virtual memory", onDisk.length], ["speed", onDisk.length === 0 ? "fast" : thrash ? "very slow (thrashing)" : "slower"]]);
      exp.innerHTML = (onDisk.length === 0 ? chips([["All in RAM", "up"]]) : thrash ? chips([["Disk thrashing", "down"]]) : chips([["Using virtual memory", "warn"]])) +
        (onDisk.length === 0 ? `<h3>Everything fits in RAM</h3><p>RAM holds the data and programs currently in use. Open more programs to fill it.</p>`
          : `<h3>${thrash ? "Constant swapping: thrashing" : "Some pages moved to virtual memory"}</h3><p>RAM is full, so pages that are not being used right now are moved to an area of the <b>secondary storage</b> used as <b>virtual memory</b>. When a paged-out program is needed, it is swapped back in — and something else is swapped out. Secondary storage is much slower than RAM, so ${thrash ? "with this much swapping the computer spends more time moving pages than doing work: <b>disk thrashing</b>. More RAM is the fix." : "the computer slows down."}</p>`) +
        flow(["RAM full", "unused pages → virtual memory", "needed again → swapped back", "slower than RAM"]);
    }
    $$("[data-app]", lab).forEach((b) => b.addEventListener("click", () => {
      const n = b.dataset.app; if (n === "OS") return;
      if (open.includes(n) && active === n) { open = open.filter((x) => x !== n); active = "OS"; } else { if (!open.includes(n)) open.push(n); active = n; }
      draw();
    }));
    const paint = controls(lab, st, () => { paint(); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { open = ["OS"]; active = "OS"; st.ram = 12; paint(); draw(); });
    lab.applyState = (s) => { if (s.open) { open = ["OS", ...s.open]; active = s.open.at(-1); } if (s.ram) st.ram = s.ram; paint(); draw(); };
    paint(); draw();
  }

  /* ---------- IP and MAC addresses ---------- */
  function addressLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), out = $("[data-out-addr]", lab);
    let st = { ip: "192.168.0.24", mac: "00:1A:2B:3C:4D:5E" };
    function draw() {
      const parts = st.ip.trim().split("."), nums = parts.map(Number);
      const valid = parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p)) && nums.every((n) => n >= 0 && n <= 255);
      const macParts = st.mac.trim().toUpperCase().split(/[:-]/), macOk = macParts.length === 6 && macParts.every((p) => /^[0-9A-F]{2}$/.test(p));
      out.innerHTML = `<p class="key"><span>IPv4: 4 groups of 8 bits = 32 bits</span></p>
        <table class="tt"><tr>${parts.map((p) => `<th>${esc(p)}</th>`).join("<th>.</th>")}</tr><tr>${(valid ? nums.map((n) => `<td class="one">${n.toString(2).padStart(8, "0")}</td>`) : parts.map(() => "<td>?</td>")).join("<td></td>")}</tr></table>
        <p class="key" style="margin-top:10px"><span>MAC: 6 bytes in hex = 48 bits</span></p>
        <table class="tt"><tr>${macParts.map((p, k) => `<th style="color:${k < 3 ? "var(--c-addr)" : "var(--c-data)"}">${esc(p)}</th>`).join("")}</tr><tr><td colspan="3" class="out">manufacturer ID</td><td colspan="3" class="out">device serial number</td></tr></table>`;
      res.innerHTML = rows([["IPv4 valid?", valid ? "yes" : "no — each part must be 0–255"], ["IP bits", "32"], ["MAC valid?", macOk ? "yes" : "no — six hex pairs"], ["MAC bits", "48"]]);
      exp.innerHTML = chips([[valid ? "Valid IPv4" : "Invalid IPv4", valid ? "up" : "down"], [macOk ? "Valid MAC" : "Invalid MAC", macOk ? "up" : "down"]]) +
        `<h3>Two kinds of address</h3><p>The <b>IP address</b> identifies a device on a network and is used by routers to send packets across networks; it can change (<b>dynamic</b>, given out each time the device connects) or be fixed (<b>static</b>). The <b>MAC address</b> is set in the device’s <b>NIC</b> by the manufacturer and does not change: the first half identifies the manufacturer, the second half the device.</p>` + flow(["MAC: which device (fixed)", "IP: where on the network (can change)", "router forwards packets by IP"]);
    }
    const paint = controls(lab, st, () => draw());
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { ip: "192.168.0.24", mac: "00:1A:2B:3C:4D:5E" }); paint(); draw(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); draw(); };
    paint(); draw();
  }

  labs({ fde: fdeLab, sensor: sensorLab, vmem: vmemLab, address: addressLab });
})();
