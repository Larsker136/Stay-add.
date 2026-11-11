/* ==========================================================================
   stay add. — CS topic 6, Automated and emerging technologies: the labs
   control  a greenhouse: a temperature sensor feeds a microprocessor, which
            compares readings with a preset value and drives a heater and a
            window motor; the temperature is plotted as the loop runs
   robot    program a robot on a grid with FORWARD, LEFT, RIGHT; its proximity
            sensor stops it before it hits a wall
   expert   an expert system: answer questions, the inference engine applies
            rules from the rule base to the knowledge base
   Each lab exposes lab.applyState(state). Needs kit.js.
   ========================================================================== */
(function () {
  "use strict";
  const { $, $$, rows, chips, flow, controls, labs, loop, esc } = window.StayAdd.cs;

  /* ---------- automated greenhouse ---------- */
  function controlLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), logEl = $("[data-log]", lab);
    let st = { outside: 12, preset: 24, auto: true }, T = 18, hist = [], heater = false, win = false, n = 0;
    function tick() {
      n++;
      if (st.auto) { heater = T < st.preset - 1; win = T > st.preset + 1; }
      // the room drifts towards the outside temperature; the heater adds heat, an open window lets it out faster
      T += (st.outside - T) * (win ? 0.06 : 0.015) + (heater ? 0.55 : 0) + (Math.random() - 0.5) * 0.15;
      hist.push(T); if (hist.length > 120) hist.shift();
      if (n % 2 === 0) draw();
      if (n % 12 === 0) log();
    }
    function draw() {
      const X = (i) => 40 + (i / 119) * 560, Y = (t) => 250 - ((t + 5) / 50) * 220;
      const d = hist.map((t, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(t).toFixed(1)}`).join("");
      svg.innerHTML = `<path class="gl" d="M40 ${Y(0)}H600M40 ${Y(20)}H600M40 ${Y(40)}H600"/><path class="ax" d="M40 20V250H604"/>
        <path class="l cg dash" d="M40 ${Y(st.preset)}H600"/><text x="600" y="${Y(st.preset) - 6}" text-anchor="end" class="tc cg">preset ${st.preset} °C</text>
        <path class="l ct dash" d="M40 ${Y(st.outside)}H600"/><text x="600" y="${Y(st.outside) + 14}" text-anchor="end" class="tc ct">outside ${st.outside} °C</text>
        <path class="l cp w3" d="${d}"/>
        <g text-anchor="end"><text x="34" y="${Y(0) + 4}">0</text><text x="34" y="${Y(20) + 4}">20</text><text x="34" y="${Y(40) + 4}">40</text></g>
        <text x="40" y="14">temperature inside / °C</text><text x="600" y="270" text-anchor="end">time →</text>
        <rect class="f ${heater ? "cr dk" : "lt"}" x="60" y="276" width="110" height="20" rx="10"/><text x="115" y="290" text-anchor="middle" class="k">heater ${heater ? "ON" : "off"}</text>
        <rect class="f ${win ? "cb dk" : "lt"}" x="180" y="276" width="130" height="20" rx="10"/><text x="245" y="290" text-anchor="middle" class="k">window ${win ? "OPEN" : "closed"}</text>`;
      res.innerHTML = rows([["sensor reading", `${T.toFixed(1)} °C`], ["preset value", `${st.preset} °C`], ["heater (actuator)", heater ? "on" : "off"], ["window motor (actuator)", win ? "open" : "closed"]]);
    }
    function log() {
      const dec = !st.auto ? "manual: microprocessor not controlling" : T < st.preset - 1 ? "reading < preset → heater on" : T > st.preset + 1 ? "reading > preset → window open" : "reading ≈ preset → no change";
      logEl.textContent = `sensor ${T.toFixed(1)} °C · ${dec}\n` + logEl.textContent.split("\n").slice(0, 5).join("\n");
      const ok = Math.abs(T - st.preset) < 2;
      exp.innerHTML = (st.auto ? chips([["Automatic", "up"], [ok ? "at the preset" : "correcting"]]) : chips([["Manual", "down"]])) +
        (st.auto ? `<h3>Sensor → microprocessor → actuator, again and again</h3><p>The <b>temperature sensor</b> sends readings to the <b>microprocessor</b> (via an ADC). It <b>compares</b> each reading with the <b>preset value</b>: too cold, it signals the heater (an <b>actuator</b>) to switch on; too hot, it signals a motor to open the window. Then it reads the sensor again — a continuous loop. Change the outside temperature and watch it correct itself.</p>`
          : `<h3>No automatic control</h3><p>With the microprocessor out of the loop, nothing responds to the sensor and the greenhouse drifts towards the outside temperature. Switch automation back on.</p>`) +
        flow(["sensor reading", "compared with preset", "signal to actuator", "condition changes", "read again"]);
    }
    const paint = controls(lab, st, () => { paint(); if (!st.auto) { heater = false; win = false; } draw(); log(); });
    $("[data-reset]", lab).addEventListener("click", () => { Object.assign(st, { outside: 12, preset: 24, auto: true }); T = 18; hist = []; paint(); });
    lab.applyState = (s) => { Object.assign(st, s); paint(); log(); };
    paint(); for (let i = 0; i < 40; i++) tick(); draw(); log();
    loop(lab, tick, 80);
  }

  /* ---------- programmable robot ---------- */
  function robotLab(lab) {
    const svg = $("[data-svg]", lab), res = $("[data-results]", lab), exp = $("[data-explain]", lab), prog = $("[data-prog]", lab);
    const G = 8, C = 34, WALLS = new Set(["3,1", "3,2", "3,3", "5,4", "5,5", "5,6", "1,5", "2,5"]), GOAL = [7, 7];
    let cmds = ["FORWARD", "FORWARD", "LEFT", "FORWARD", "FORWARD", "FORWARD"], bot, running = false, stopped = "";
    const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    function reset() { bot = { x: 0, y: 0, d: 2, trail: [[0, 0]] }; stopped = ""; draw(); }
    function draw() {
      let cells = "";
      for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) cells += `<rect class="f ${WALLS.has(`${x},${y}`) ? "dk" : "lt"}" x="${170 + x * C}" y="${12 + y * C}" width="${C - 2}" height="${C - 2}" rx="3"/>`;
      const [gx, gy] = GOAL, tr = bot.trail.map(([x, y], i) => `${i ? "L" : "M"}${170 + x * C + C / 2 - 1} ${12 + y * C + C / 2 - 1}`).join("");
      const cx = 170 + bot.x * C + C / 2 - 1, cy = 12 + bot.y * C + C / 2 - 1, [dx, dy] = DIRS[bot.d];
      svg.innerHTML = cells + `<rect class="f cg dk" x="${170 + gx * C}" y="${12 + gy * C}" width="${C - 2}" height="${C - 2}" rx="3"/><text x="${170 + gx * C + C / 2 - 1}" y="${12 + gy * C + C / 2 + 3}" text-anchor="middle" class="k">goal</text>
        <path class="l cp dash" d="${tr}"/><circle class="f cp dk" cx="${cx}" cy="${cy}" r="12"/><path class="l w3" d="M${cx} ${cy}L${cx + dx * 14} ${cy + dy * 14}"/>
        <path class="l ca dash" d="M${cx + dx * 14} ${cy + dy * 14}L${cx + dx * 30} ${cy + dy * 30}"/>
        <text x="20" y="30" class="k">the robot</text><text x="20" y="48">pink: body · arrow: facing</text><text x="20" y="64" class="tc ca">amber: proximity sensor</text><text x="20" y="90">grey squares: walls</text>`;
      prog.innerHTML = cmds.map((c, i) => `<div class="cmd"><span>${i + 1}</span>${c}<button type="button" class="ghost" data-del="${i}" aria-label="remove">×</button></div>`).join("") || `<p class="key"><span>add commands</span></p>`;
      const atGoal = bot.x === GOAL[0] && bot.y === GOAL[1];
      res.innerHTML = rows([["position", `(${bot.x}, ${bot.y})`], ["facing", ["north", "east", "south", "west"][bot.d]], ["commands", cmds.length], ["status", atGoal ? "reached the goal" : stopped || "ready"]]);
    }
    const blocked = (x, y) => x < 0 || y < 0 || x >= G || y >= G || WALLS.has(`${x},${y}`);
    async function run() {
      if (running) return; running = true; reset();
      for (const c of cmds) {
        await new Promise((r) => setTimeout(r, 380));
        if (c === "LEFT") bot.d = (bot.d + 3) % 4; else if (c === "RIGHT") bot.d = (bot.d + 1) % 4;
        else { const [dx, dy] = DIRS[bot.d]; if (blocked(bot.x + dx, bot.y + dy)) { stopped = "sensor detected an obstacle — stopped"; draw(); break; } bot.x += dx; bot.y += dy; bot.trail.push([bot.x, bot.y]); }
        draw();
      }
      running = false;
      const atGoal = bot.x === GOAL[0] && bot.y === GOAL[1];
      exp.innerHTML = (atGoal ? chips([["Goal reached", "up"]]) : stopped ? chips([["Stopped", "warn"]]) : chips([["Program ended"]])) +
        `<h3>${atGoal ? "Programmed, sensed, moved" : stopped ? "The sensor stopped it" : "The program finished"}</h3><p>A robot has a <b>mechanical structure</b> (body, wheels), <b>electrical components</b> (sensors, a microprocessor, actuators such as motors) and is <b>programmable</b>. ${stopped ? "Its proximity sensor detected a wall ahead, so the microprocessor stopped the motors instead of crashing." : atGoal ? "It followed your program exactly." : "It doesn’t think for itself — it only follows its program. Add commands to reach the goal."}</p>` + flow(["program of instructions", "sensors read surroundings", "microprocessor decides", "actuators move"]);
    }
    $$("[data-cmd]", lab).forEach((b) => b.addEventListener("click", () => { if (running || cmds.length >= 30) return; cmds.push(b.dataset.cmd); draw(); }));
    prog.addEventListener("click", (e) => { const d = e.target.closest("[data-del]"); if (!d || running) return; cmds.splice(+d.dataset.del, 1); draw(); });
    $("[data-run]", lab).addEventListener("click", run);
    $("[data-clear]", lab).addEventListener("click", () => { if (running) return; cmds = []; reset(); });
    $("[data-reset]", lab).addEventListener("click", () => { if (running) return; cmds = ["FORWARD", "FORWARD", "LEFT", "FORWARD", "FORWARD", "FORWARD"]; reset(); exp.innerHTML = chips([["Ready"]]) + `<h3>Program the robot</h3><p>Add commands, then press Run. Can you reach the goal in the corner?</p>`; });
    lab.applyState = (s) => { if (running) return; cmds = s.cmds; reset(); run(); };
    $("[data-reset]", lab).click();
  }

  /* ---------- expert system ---------- */
  function expertLab(lab) {
    const res = $("[data-results]", lab), exp = $("[data-explain]", lab), qEl = $("[data-q]", lab), kbEl = $("[data-kb]", lab);
    // rule base: IF all facts THEN conclusion
    const RULES = [
      [["screen blank", "power light off"], "no power: check the cable and socket"],
      [["screen blank", "power light on", "fan running"], "monitor fault: check the monitor cable"],
      [["screen on", "very slow", "many programs open"], "RAM full: close programs or add RAM"],
      [["screen on", "very slow", "pop-up adverts"], "malware: run an anti-malware scan"],
      [["screen on", "no internet", "wi-fi off"], "wi-fi switched off: turn it on"],
      [["screen on", "no internet", "wi-fi on"], "router problem: restart the router"]
    ];
    // each question adds one fact or its opposite to the knowledge base
    const Q = {
      blank: ["Is the screen blank?", "screen blank", "screen on"], power: ["Is the power light off?", "power light off", "power light on"],
      fan: ["Can you hear the fan running?", "fan running", "fan silent"], slow: ["Is the computer very slow?", "very slow", "speed normal"],
      progs: ["Are many programs open?", "many programs open", "few programs open"], ads: ["Are pop-up adverts appearing?", "pop-up adverts", "no pop-ups"],
      net: ["Is there no internet connection?", "no internet", "internet fine"], wifi: ["Is the wi-fi switched off?", "wi-fi off", "wi-fi on"]
    };
    const opposite = (f) => { for (const q of Object.values(Q)) { if (q[1] === f) return q[2]; if (q[2] === f) return q[1]; } return null; };
    const keyOf = (f) => Object.keys(Q).find((k) => Q[k][1] === f || Q[k][2] === f);
    let facts = [];
    const dead = ([need]) => need.some((f) => facts.includes(opposite(f)));
    function nextQ() {
      // the inference engine asks about the first fact still unknown in a rule that can still fire
      for (const r of RULES) { if (dead(r)) continue; for (const f of r[0]) if (!facts.includes(f)) return keyOf(f); }
      return null;
    }
    function draw() {
      const fired = RULES.find(([need]) => need.every((f) => facts.includes(f)));
      kbEl.innerHTML = RULES.map(([need, c]) => `<div class="rule ${fired && fired[1] === c ? "fired" : dead([need]) ? "out" : ""}"><b>IF</b> ${need.join(" <b>AND</b> ")} <b>THEN</b> ${c}</div>`).join("");
      res.innerHTML = rows([["facts known (knowledge base)", facts.length ? facts.join(", ") : "—"], ["rules in the rule base", RULES.length]]);
      if (fired) { qEl.innerHTML = `<h3 class="q-h">Diagnosis: ${fired[1]}</h3>`; exp.innerHTML = chips([["Conclusion", "up"]]) + `<h3>The inference engine found a match</h3><p>The facts you gave matched every condition of one rule in the <b>rule base</b>, so the <b>inference engine</b> reached its conclusion. The <b>explanation system</b> can show which rule fired (highlighted).</p>` + flow(["user answers questions", "facts added to the knowledge base", "inference engine applies rules", "conclusion + explanation"]); return; }
      const k = nextQ();
      if (!k) { qEl.innerHTML = `<h3 class="q-h">No rule matches these facts</h3>`; exp.innerHTML = chips([["No conclusion", "warn"]]) + `<h3>Outside the system’s knowledge</h3><p>An expert system only knows what is in its rule base. Press Restart.</p>`; return; }
      qEl.innerHTML = `<h3 class="q-h">${Q[k][0]}</h3><div class="btns"><button class="btn btn-primary btn-sm" type="button" data-ans="1" data-key="${k}">Yes</button><button class="sc" type="button" data-ans="0" data-key="${k}">No</button></div>`;
      exp.innerHTML = chips([["Asking"], [`${facts.length} facts`]]) + `<h3>The inference engine needs more facts</h3><p>It picks the next question that could help a rule fire, using the <b>user interface</b>. Rules that can no longer fire are faded.</p>`;
    }
    qEl.addEventListener("click", (e) => { const b = e.target.closest("[data-ans]"); if (!b) return; const q = Q[b.dataset.key]; facts.push(b.dataset.ans === "1" ? q[1] : q[2]); draw(); });
    $("[data-reset]", lab).addEventListener("click", () => { facts = []; draw(); });
    lab.applyState = (s) => { facts = [...s.facts]; draw(); };
    draw();
  }

  labs({ control: controlLab, robot: robotLab, expert: expertLab });
})();
