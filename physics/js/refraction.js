// Refraction lab: Snell's law, draggable laser, readings table and sin i / sin r graph.
(() => {
  const $ = (id) => document.getElementById(id);
  const set = (el, a) => { for (const k in a) el.setAttribute(k, a[k]); };
  const NS = "http://www.w3.org/2000/svg";
  const make = (tag, attrs, parent) => { const el = document.createElementNS(NS, tag); set(el, attrs); parent.appendChild(el); return el; };
  const R = Math.PI / 180, O = [400, 270], LI = 205, LR = 270;
  const st = { i: 40, n: 1.5, slow: false, recorded: [10, 20, 30], fresh: false };
  const snell = (i) => Math.asin(Math.sin(i * R) / st.n) / R;
  const fmtI = (i) => i.toFixed(i % 1 ? 1 : 0);

  // ---------- static drawing: protractor and graph axes ----------
  const prot = $("prot");
  make("circle", { cx: O[0], cy: O[1], r: 170, class: "prot-c" }, prot);
  for (let a = 0; a < 360; a += 5) {
    const len = a % 30 === 0 ? 10 : a % 10 === 0 ? 6 : 3.5, s = Math.sin(a * R), c = Math.cos(a * R);
    make("line", { x1: O[0] + 170 * s, y1: O[1] - 170 * c, x2: O[0] + (170 - len) * s, y2: O[1] - (170 - len) * c, class: a % 30 ? "prot-t" : "prot-T" }, prot);
    if (a % 30 === 0 && a % 90 !== 0) {
      const fromNormal = Math.min(a % 180, 180 - (a % 180));
      make("text", { x: O[0] + 184 * s, y: O[1] - 184 * c + 3.5, "text-anchor": "middle" }, prot).textContent = fromNormal + "°";
    }
  }

  // graph: sin r ∈ [0, 0.8] across, sin i ∈ [0, 1] up
  const GL = 44, GR = 428, GT = 14, GB = 160;
  const gx = (s) => GL + s / 0.8 * (GR - GL), gy = (s) => GB - s * (GB - GT);
  const ax = $("gAxes");
  for (let k = 1; k <= 8; k++) if (k % 2 === 0) make("line", { x1: gx(k / 10), y1: GT, x2: gx(k / 10), y2: GB, class: "gl" }, ax);
  for (let k = 1; k <= 10; k++) if (k % 2 === 0) make("line", { x1: GL, y1: gy(k / 10), x2: GR, y2: gy(k / 10), class: "gl" }, ax);
  make("path", { d: `M${GL} ${GT - 6}V${GB}H${GR + 4}`, class: "ax" }, ax);
  for (let k = 0; k <= 8; k++) {
    make("line", { x1: gx(k / 10), y1: GB, x2: gx(k / 10), y2: GB + (k % 2 ? 3 : 5), class: k % 2 ? "tk-m" : "tk" }, ax);
    if (k % 2 === 0) make("text", { x: gx(k / 10), y: GB + 16, "text-anchor": "middle" }, ax).textContent = (k / 10).toFixed(1);
  }
  for (let k = 0; k <= 10; k++) {
    make("line", { x1: GL - (k % 2 ? 3 : 5), y1: gy(k / 10), x2: GL, y2: gy(k / 10), class: k % 2 ? "tk-m" : "tk" }, ax);
    if (k % 2 === 0) make("text", { x: GL - 9, y: gy(k / 10) + 3.5, "text-anchor": "end" }, ax).textContent = (k / 10).toFixed(1);
  }
  make("text", { x: GL + 8, y: GT + 2 }, ax).textContent = "sin i";
  make("text", { x: GR + 4, y: GB + 28, "text-anchor": "end" }, ax).textContent = "sin r";

  // ---------- rendering ----------
  const row = (i, cls = "") => {
    const r = snell(i), si = Math.sin(i * R), sr = Math.sin(r * R);
    return `<tr class="${cls}"><td>${fmtI(i)}</td><td>${r.toFixed(1)}</td><td>${si.toFixed(3)}</td><td>${sr.toFixed(3)}</td><td>${i < 0.5 ? "—" : (si / sr).toFixed(2)}</td></tr>`;
  };

  function renderData() {
    const last = st.recorded.slice(-3);
    $("rows").innerHTML = last.map((i, k) => row(i, st.fresh && k === last.length - 1 ? "fresh" : "")).join("") + row(st.i, "live");
    st.fresh = false;
    $("tCount").textContent = `${st.recorded.length} readings`;
    $("gPts").innerHTML = st.recorded.map((i) => `<circle cx="${gx(Math.sin(snell(i) * R)).toFixed(1)}" cy="${gy(Math.sin(i * R)).toFixed(1)}" r="3.5" class="pt"/>`).join("");
    const endS = Math.min(0.8, 1 / st.n);
    set($("gLine"), { x1: GL, y1: GB, x2: gx(endS), y2: gy(endS * st.n) });
    $("gGrad").textContent = `gradient = ${st.n.toFixed(2)}`;
  }

  const ray = (a, len, dir) => [O[0] + dir[0] * len * Math.sin(a * R), O[1] + dir[1] * len * Math.cos(a * R)];

  function render() {
    const i = st.i, r = snell(i), si = Math.sin(i * R), sr = Math.sin(r * R);
    const src = ray(i, LI, [-1, -1]), end = ray(r, LR, [1, 1]), refl = ray(i, LI, [1, -1]);
    set($("inc"), { x1: src[0], y1: src[1], x2: O[0], y2: O[1] });
    set($("pInc"), { x1: src[0], y1: src[1], x2: O[0], y2: O[1] });
    set($("refr"), { x2: end[0], y2: end[1] });
    set($("pRefr"), { x2: end[0], y2: end[1] });
    set($("refl"), { x2: refl[0], y2: refl[1] });
    $("laser").setAttribute("transform", `translate(${src[0]} ${src[1]}) rotate(${90 - i})`);
    set($("handle"), { cx: src[0], cy: src[1] });

    const ai = ray(i, 80, [-1, -1]), ar = ray(r, 80, [1, 1]);
    $("arcI").setAttribute("d", `M400 190A80 80 0 0 0 ${ai[0]} ${ai[1]}`);
    $("wedgeI").setAttribute("d", `M400 270L400 190A80 80 0 0 0 ${ai[0]} ${ai[1]}Z`);
    $("arcR").setAttribute("d", `M400 350A80 80 0 0 0 ${ar[0]} ${ar[1]}`);
    $("wedgeR").setAttribute("d", `M400 270L400 350A80 80 0 0 0 ${ar[0]} ${ar[1]}Z`);
    const li = ray(Math.max(i / 2, 8), 112, [-1, -1]), lr = ray(Math.max(r / 2, 8), 112, [1, 1]);
    set($("valI"), { x: li[0], y: li[1] + 4 }); $("valI").textContent = i.toFixed(1) + "°";
    set($("valR"), { x: lr[0], y: lr[1] + 4 }); $("valR").textContent = r.toFixed(1) + "°";

    // wavefronts: perpendicular to the ray; wavelength shrinks by a factor n in the medium
    let wf = "";
    const front = (a, d, dir, cls) => {
      const c = ray(a, d, dir), u = [Math.cos(a * R) * 14, -Math.sin(a * R) * 14];
      return `<path d="M${c[0] - u[0]} ${c[1] - u[1]}L${c[0] + u[0]} ${c[1] + u[1]}" class="${cls}"/>`;
    };
    for (let d = 24; d < LI - 10; d += 24) wf += front(i, d, [-1, -1], "wf-i");
    for (let d = 24 / st.n; d < LR - 10; d += 24 / st.n) wf += front(r, d, [1, 1], "wf-r");
    $("wf").innerHTML = wf;

    // readouts
    const nTxt = st.n.toFixed(2);
    $("angOut").textContent = i.toFixed(1) + "°";
    $("ang").value = i;
    $("ang").style.setProperty("--p", (i / 85 * 100) + "%");
    $("hI").textContent = i.toFixed(1) + "°"; $("hR").textContent = r.toFixed(1) + "°"; $("hN").textContent = nTxt;
    $("eqI").textContent = i.toFixed(1); $("eqR").textContent = r.toFixed(1);
    $("eqSI").textContent = si.toFixed(3); $("eqSR").textContent = sr.toFixed(3);
    $("eqN").textContent = i < 0.5 ? "undefined at i = 0" : (si / sr).toFixed(2);
    $("dR").textContent = r.toFixed(1) + "°";
    $("dV").textContent = (3 / st.n).toFixed(2);
    $("medN").textContent = `n = ${nTxt}`;
    const crit = Math.asin(1 / st.n) / R, pos = (crit / 85 * 100) + "%";
    $("dC").textContent = crit.toFixed(1) + "°";
    $("critLbl").textContent = `c ${crit.toFixed(1)}°`;
    $("rng").style.setProperty("--c-pos", pos); $("scale").style.setProperty("--c-pos", pos);
    set($("gCur"), { cx: gx(sr), cy: gy(si) });
    $("gGuide").setAttribute("d", `M${gx(sr)} ${GB}V${gy(si)}H${GL}`);
    renderData();
  }

  // ease discrete changes (medium switch, reset) so rays and numbers move rather than jump
  const tweens = {};
  function tween(key, to, ms = 360) {
    cancelAnimationFrame(tweens[key]);
    const from = st[key], t0 = performance.now();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { st[key] = to; render(); return; }
    const step = (now) => {
      const p = Math.min((now - t0) / ms, 1), e = 1 - Math.pow(1 - p, 3);
      st[key] = from + (to - from) * e; render();
      if (p < 1) tweens[key] = requestAnimationFrame(step);
    };
    tweens[key] = requestAnimationFrame(step);
  }

  function setMedium(btn) {
    document.querySelectorAll("#seg button").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    document.body.style.setProperty("--med", btn.dataset.c);
    $("medLabel").firstChild.nodeValue = btn.dataset.name + " ";
    tween("n", +btn.dataset.n);
  }

  // ---------- controls ----------
  $("ang").addEventListener("input", (e) => { cancelAnimationFrame(tweens.i); st.i = +e.target.value; render(); });
  document.querySelectorAll("#seg button").forEach((b) => b.addEventListener("click", () => setMedium(b)));
  document.querySelectorAll(".checks input").forEach((c) => c.addEventListener("change", () => { $(c.dataset.g).style.display = c.checked ? "" : "none"; }));
  $("reset").addEventListener("click", () => tween("i", 40));
  $("slow").addEventListener("click", (e) => { st.slow = !st.slow; e.currentTarget.setAttribute("aria-pressed", st.slow); });
  $("rec").addEventListener("click", () => {
    const i = Math.round(st.i * 2) / 2;
    if (!st.recorded.includes(i)) { st.recorded.push(i); st.fresh = true; }
    render();
  });
  document.querySelector(".stepper").addEventListener("click", (e) => {
    const b = e.target.closest("a"); if (!b) return;
    document.querySelectorAll(".stepper a").forEach((x) => x.toggleAttribute("aria-current", x === b));
    b.setAttribute("aria-current", "step");
  });

  // drag anywhere above the boundary to aim the laser
  const svg = $("svg"), stage = $("stage");
  const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  let drag = false;
  const aim = (e) => { const p = toSvg(e); if (p.y >= O[1] - 4) return; st.i = Math.max(0, Math.min(85, Math.round(Math.atan2(O[0] - p.x, O[1] - p.y) / R * 2) / 2)); render(); };
  svg.addEventListener("pointerdown", (e) => { if (toSvg(e).y >= O[1]) return; cancelAnimationFrame(tweens.i); drag = true; stage.classList.add("dragging"); svg.setPointerCapture(e.pointerId); aim(e); });
  svg.addEventListener("pointermove", (e) => drag && aim(e));
  svg.addEventListener("pointerup", () => { drag = false; stage.classList.remove("dragging"); });

  // a short pulse travels along the ray, slower in the medium (v = c / n)
  function pulse(now) {
    const Di = st.slow ? 2.8 : 1.2, Dr = Di * (LR / LI) * st.n, e = (now / 1000) % (Di + Dr);
    $("pInc").setAttribute("stroke-dashoffset", e < Di ? 4 - 104 * (e / Di) : 4);
    $("pRefr").setAttribute("stroke-dashoffset", e < Di ? 4 : 4 - 104 * ((e - Di) / Dr));
    requestAnimationFrame(pulse);
  }

  render();
  const still = new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still) requestAnimationFrame(pulse);
})();
