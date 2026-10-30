// Hero instrument: horizontal launch from a 10 m cliff.
// Plot units are metres; the axes map x ∈ [-3, 24] m and h ∈ [0, 12] m onto the SVG.
(() => {
  const $ = (id) => document.getElementById(id);
  const set = (el, a) => { for (const k in a) el.setAttribute(k, a[k]); };
  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs, parent) => { const el = document.createElementNS(NS, tag); set(el, attrs); parent.appendChild(el); return el; };

  const G = 9.81, H = 10, T = Math.sqrt(2 * H / G);
  const L = 52, Rt = 616, TOP = 20, B = 306;
  const X = (m) => L + (m + 3) * (Rt - L) / 27;
  const Y = (h) => B - h * (B - TOP) / 12;
  const VEC = 3.2; // px per m/s for velocity arrows

  const st = { vx: 12, t: 0, playing: true };
  const pos = (t) => [X(st.vx * t), Y(H - 0.5 * G * t * t)];

  // axes, grid and tick marks
  const grid = $("pGrid"), ticks = $("pTicks");
  for (let m = -2; m <= 24; m++) {
    const x = X(m);
    if (m >= 0 && m % 2 === 0) make("line", { x1: x, y1: TOP, x2: x, y2: B, class: "gl" }, grid);
    if (m >= 0) make("line", { x1: x, y1: B, x2: x, y2: B + (m % 4 ? 3 : 6), class: m % 4 ? "tk-m" : "tk" }, ticks);
    if (m >= 0 && m % 4 === 0) make("text", { x, y: B + 18, "text-anchor": "middle" }, ticks).textContent = m;
  }
  for (let h = 0; h <= 12; h++) {
    const y = Y(h);
    if (h % 2 === 0 && h > 0) make("line", { x1: X(0), y1: y, x2: Rt, y2: y, class: "gl" }, grid);
    make("line", { x1: L - (h % 2 ? 3 : 6), y1: y, x2: L, y2: y, class: h % 2 ? "tk-m" : "tk" }, ticks);
    if (h % 2 === 0) make("text", { x: L - 10, y: y + 3.5, "text-anchor": "end" }, ticks).textContent = h;
  }

  const strobe = $("pStrobe"), projX = $("pProjX"), projY = $("pProjY");
  const marks = [];
  for (let k = 1; k * 0.2 < T; k++) {
    marks.push({
      t: k * 0.2,
      dot: make("circle", { r: 3.5, class: "strobe" }, strobe),
      px: make("line", { class: "proj-x" }, projX),
      py: make("line", { class: "proj-y" }, projY),
    });
  }

  function draw() {
    const t = st.t, vy = G * t, [x, y] = pos(t);
    let d = "";
    for (let s = 0; s <= 48; s++) { const p = pos(t * s / 48); d += (s ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }
    $("pTrail").setAttribute("d", d);
    set($("pBall"), { cx: x, cy: y });

    marks.forEach((m) => {
      const show = m.t <= t + 1e-6;
      const [mx, my] = pos(m.t);
      m.dot.style.display = m.px.style.display = m.py.style.display = show ? "" : "none";
      if (!show) return;
      set(m.dot, { cx: mx, cy: my });
      set(m.px, { x1: mx, y1: B - 7, x2: mx, y2: B });
      set(m.py, { x1: L, y1: my, x2: L + 7, y2: my });
    });

    set($("pVx"), { x1: x, y1: y, x2: x + st.vx * VEC, y2: y });
    set($("pVy"), { x1: x, y1: y, x2: x, y2: y + Math.max(vy * VEC, 0.01) });
    set($("pVxT"), { x: x + st.vx * VEC + 8, y: y + 3.5 }); $("pVxT").innerHTML = `v<tspan baseline-shift="sub" font-size="8">x</tspan> ${st.vx.toFixed(1)}`;
    set($("pVyT"), { x: x + 8, y: y + vy * VEC + 4 }); $("pVyT").innerHTML = `v<tspan baseline-shift="sub" font-size="8">y</tspan> ${vy.toFixed(1)}`;
    $("pVyT").style.display = t > 0.35 ? "" : "none";

    const landed = t >= T - 1e-6, R = st.vx * T;
    $("pLand").style.display = landed ? "" : "none";
    $("pLand").setAttribute("transform", `translate(${X(R)} ${B})`);
    $("pLandT").textContent = `R = ${R.toFixed(1)} m`;

    const s = 0.5 * G * t * t, xm = st.vx * t;
    $("rT").textContent = t.toFixed(2);
    $("rX").textContent = xm.toFixed(2);
    $("rY").textContent = s.toFixed(2);
    $("rV").textContent = Math.hypot(st.vx, vy).toFixed(2);
    $("eqX").textContent = `${st.vx.toFixed(1)} × ${t.toFixed(2)} = ${xm.toFixed(2)} m`;
    $("eqY").textContent = `½ × 9.81 × ${t.toFixed(2)}² = ${s.toFixed(2)} m`;
  }

  // controls
  const speed = $("pSpeed"), playBtn = $("pPlay"), status = $("pStatus");
  const syncSpeed = () => {
    speed.style.setProperty("--p", ((st.vx - speed.min) / (speed.max - speed.min) * 100) + "%");
    $("pSpeedOut").textContent = st.vx.toFixed(1);
  };
  const setPlaying = (on) => {
    st.playing = on;
    playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
    playBtn.classList.toggle("is-paused", !on);
    status.textContent = on ? "Running" : "Paused";
    status.classList.toggle("paused", !on);
  };
  speed.addEventListener("input", () => { st.vx = +speed.value; syncSpeed(); draw(); });
  playBtn.addEventListener("click", () => { if (st.t >= T) st.t = 0; setPlaying(!st.playing); });
  $("pReplay").addEventListener("click", () => { st.t = 0; setPlaying(true); draw(); });

  syncSpeed();
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) { st.t = 1; setPlaying(false); draw(); return; }

  // real-time at 0.6×, holding on the landing for a moment before relaunching
  const RATE = 0.6, HOLD = 1.6;
  let last = performance.now(), held = 0;
  (function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (st.playing) {
      if (st.t < T) st.t = Math.min(st.t + dt * RATE, T);
      else if ((held += dt) > HOLD) { st.t = 0; held = 0; }
      draw();
    }
    requestAnimationFrame(tick);
  })(last);
})();
