/* ==========================================================================
   stay add. — CS topic 4, Software: the labs
   interrupt  the CPU runs a program cycle by cycle; trigger an interrupt and
              watch it finish the cycle, save its state, run the interrupt
              service routine, restore and carry on (priorities included)
   translate  the same program run by an interpreter (line by line, stops at
              the error) and by a compiler (whole program first, error report)
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, labs, wait, esc } = window.StayAdd.cs;

  /* ---------- interrupts ---------- */
  function interruptLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    const SRC = { key: ["keyboard: key pressed", "ct", 2], paper: ["printer: out of paper", "ca", 1], power: ["hardware: power failing", "cr", 3], div0: ["software: divide by zero", "cv", 3] };
    let blocks, queue, cycle, timer, saved;
    function reset() { blocks = []; queue = []; cycle = 0; saved = null; clearInterval(timer); timer = setInterval(tick, 700); draw(); explainIdle(); }
    function tick() {
      if (lab.closest(".topic").hidden) return;
      if (blocks.length > 26) blocks.shift();
      // at the end of each cycle the CPU checks for interrupts, highest priority first
      if (queue.length && !saved) {
        queue.sort((a, b) => SRC[b][2] - SRC[a][2]);
        const k = queue.shift(); saved = k;
        blocks.push({ t: "save", k }); blocks.push({ t: "isr", k }); blocks.push({ t: "isr", k }); blocks.push({ t: "restore", k });
        explainIsr(k);
      } else if (saved && blocks.at(-1)?.t === "restore") { saved = null; cycle++; blocks.push({ t: "run", n: cycle }); }
      else { cycle++; blocks.push({ t: "run", n: cycle }); }
      draw();
    }
    function draw() {
      const W = 22;
      svg.innerHTML = `<text x="20" y="24" class="k">CPU timeline →</text>` + blocks.map((b, i) => {
        const x = 20 + i * W, c = b.t === "run" ? "cp" : b.t === "isr" ? SRC[b.k][1] + " dk" : "";
        return `<rect class="f ${c}" x="${x}" y="40" width="${W - 3}" height="60" rx="3"/>${b.t !== "run" ? `<text x="${x + W / 2 - 1}" y="118" text-anchor="middle" style="font-size:9px">${b.t === "save" ? "save" : b.t === "restore" ? "load" : "ISR"}</text>` : ""}`;
      }).join("") + `<text x="20" y="150">pink = the user’s program, one fetch–decode–execute cycle per block · coloured = interrupt service routine</text>
        <text x="20" y="176" class="k">waiting interrupts: ${queue.length ? queue.map((k) => SRC[k][0]).join(" · ") : "none"}</text>`;
      res.innerHTML = rows([["program cycles completed", cycle], ["interrupts waiting", queue.length], ["handling now", saved ? SRC[saved][0] : "—"]]);
    }
    function explainIdle() { exp.innerHTML = chips([["Running"]]) + `<h3>The CPU runs the program</h3><p>Trigger an interrupt with the buttons. Try two at once to see priorities.</p>`; }
    function explainIsr(k) {
      exp.innerHTML = chips([["Interrupt", "warn"], [SRC[k][0]]]) + `<h3>Interrupt: ${SRC[k][0]}</h3><p>The CPU finishes its current cycle, then checks for interrupts. It <b>saves the state</b> of the current program (its registers) so it can return to it, then runs the <b>interrupt service routine (ISR)</b> that handles this interrupt. Afterwards it <b>restores</b> the saved state and carries on exactly where it stopped. ${queue.length ? `Another interrupt is waiting; the one with the higher <b>priority</b> is handled first.` : ""}</p>` + flow(["interrupt signal", "finish current cycle", "save registers", "run ISR", "restore and continue"]);
    }
    $$("[data-irq]", lab).forEach((b) => b.addEventListener("click", () => { queue.push(b.dataset.irq); draw(); }));
    $("[data-reset]", lab).addEventListener("click", reset);
    lab.applyState = (s) => { reset(); (s.irqs || []).forEach((k) => queue.push(k)); draw(); };
    reset();
  }

  /* ---------- compiler vs interpreter ---------- */
  function translateLab(lab) {
    const code = $("[data-code]", lab), log = $("[data-log]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab);
    let fixed = false, busy = false;
    const lines = () => [
      ["OUTPUT \"Enter two numbers\"", () => "Enter two numbers"],
      ["A ← 6", null], ["B ← 4", null],
      [fixed ? "Total ← A + B" : "Total ← A + * B", null],
      ["OUTPUT \"Total is \", Total", () => "Total is 10"],
      ["OUTPUT \"Done\"", () => "Done"]
    ];
    const BAD = 3;
    function show(hl = -1, bad = -1) {
      code.innerHTML = lines().map(([t], i) => `<div class="${i === hl ? "now" : ""} ${i === bad ? "badl" : ""}"><span class="ln">${i + 1}</span>${esc(t)}</div>`).join("");
      $("[data-fix]", lab).setAttribute("aria-pressed", String(fixed));
    }
    const say = (t, c = "") => { log.innerHTML += `<span class="${c}">${esc(t)}</span>\n`; log.scrollTop = 1e6; };
    async function interpret() {
      if (busy) return; busy = true; log.innerHTML = ""; let ran = 0;
      for (let i = 0; i < lines().length; i++) {
        show(i);
        await wait(600);
        if (i === BAD && !fixed) { show(i, i); say(`Error on line ${i + 1}: syntax error — the program stops here`, "err"); report("interpreter", ran, true); busy = false; return; }
        const out = lines()[i][1]; if (out) say(out()); ran++;
      }
      show(); say("Program finished", "ok"); report("interpreter", ran, false); busy = false;
    }
    async function compile() {
      if (busy) return; busy = true; log.innerHTML = ""; say("Compiling the whole program…");
      for (let i = 0; i < lines().length; i++) { show(i); await wait(180); }
      if (!fixed) { show(-1, BAD); say(`Error report: line ${BAD + 1}: syntax error`, "err"); say("No executable file produced — nothing runs", "err"); report("compiler", 0, true); busy = false; return; }
      show(); say("Executable file produced (machine code)", "ok"); await wait(500);
      say("Running the executable:"); lines().forEach(([, f]) => f && say(f())); say("Program finished", "ok"); report("compiler", lines().length, false); busy = false;
    }
    function report(kind, ran, err) {
      res.innerHTML = rows([["translator", kind], ["lines executed", ran], ["result", err ? "stopped by an error" : "ran to the end"]]);
      exp.innerHTML = chips([[kind === "compiler" ? "Compiler" : "Interpreter"], [err ? "error" : "success", err ? "down" : "up"]]) +
        (kind === "interpreter"
          ? `<h3>${err ? "Ran until it hit the error" : "Translated and run, one line at a time"}</h3><p>An <b>interpreter</b> translates and executes <b>one line at a time</b>. ${err ? `Lines 1–3 ran (you saw their output), then it <b>stopped at the error on line 4</b> and reported it. Fix it and run again — handy while developing.` : "It must translate again every time the program runs, so it is slower, and the user needs the interpreter installed."}</p>`
          : `<h3>${err ? "Nothing ran: an error report instead" : "Translated once, then run at full speed"}</h3><p>A <b>compiler</b> translates the <b>whole program</b> before any of it runs. ${err ? "Because of the error, it produced an <b>error report</b> and <b>no executable</b> — not even line 1 ran." : "It produced an <b>executable file</b> that runs quickly, can be distributed without the source code, and doesn’t need the compiler to run."}</p>`) +
        flow(kind === "interpreter" ? ["translate one line", "run it", "next line", "error → stop there"] : ["translate whole program", "errors → report", "no errors → executable", "run any time"]);
    }
    $("[data-int]", lab).addEventListener("click", interpret);
    $("[data-cmp]", lab).addEventListener("click", compile);
    $("[data-fix]", lab).addEventListener("click", () => { if (busy) return; fixed = !fixed; show(); });
    $("[data-reset]", lab).addEventListener("click", () => { if (busy) return; fixed = false; log.innerHTML = ""; show(); res.innerHTML = ""; exp.innerHTML = chips([["Ready"]]) + `<h3>One program, two translators</h3><p>Line 4 has a syntax error. Run it with the interpreter, then with the compiler, and compare.</p>`; });
    lab.applyState = (s) => { if (busy) return; fixed = !!s.fixed; show(); if (s.run === "int") interpret(); if (s.run === "cmp") compile(); };
    $("[data-reset]", lab).click();
  }

  labs({ interrupt: interruptLab, translate: translateLab });
})();
