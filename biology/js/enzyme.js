/* ==========================================================================
   stay add. — the enzyme model, shared by the Biology home (Fig. 1) and the
   Enzymes lesson. Numbers only and SVG path strings; no DOM.

   Temperature: rate = (more collisions as T rises: ×2 per 10 °C)
                     × (share of enzyme still the right shape).
   Heating above 45 °C also does permanent damage (denaturation), which cooling
   does not undo — `perm(maxT)` keeps that memory.
   pH: a bell-shaped curve around each enzyme's optimum.
   ========================================================================== */
(function () {
  "use strict";

  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const folded = (T) => 1 / (1 + Math.exp((T - 41) / 3.5));            // share with the right shape at T
  const collide = (T) => Math.pow(2, (T - 37) / 10);                     // relative collision rate
  const perm = (maxT) => clamp(1 - (maxT - 45) / 15);                    // undamaged after reaching maxT
  let RMAX = 0;
  for (let T = 0; T <= 70; T += 0.25) RMAX = Math.max(RMAX, collide(T) * folded(T));

  const ENZ = {
    amylase: { name: "amylase", sub: "starch", shape: "round", product: "maltose", opt: 7, where: "saliva and the small intestine" },
    protease: { name: "protease", sub: "protein", shape: "vee", product: "amino acids", opt: 2, where: "the stomach (pepsin)" },
    lipase: { name: "lipase", sub: "fat", shape: "box", product: "fatty acids + glycerol", opt: 8, where: "the small intestine" }
  };
  const SUB = { starch: "round", protein: "vee", fat: "box" };

  /* ---------- Shapes ----------
     The enzyme is a rounded block 180 × 100 centred on (0, 0); its active site is
     a notch in the top edge. d = 0 is the working shape; d = 1 is fully denatured
     (the notch is shallow, wide and lopsided, so no substrate fits). */
  function notch(shape) {
    if (shape === "vee") return [[-28, -50], [-14, -36], [0, -22], [14, -36], [28, -50]];
    if (shape === "box") return [[-24, -50], [-24, -36], [-24, -24], [0, -24], [24, -24], [24, -36], [24, -50]];
    const pts = [];
    for (let k = 0; k <= 8; k++) { const a = Math.PI - (k / 8) * Math.PI; pts.push([26 * Math.cos(a), -50 + 26 * Math.sin(a)]); }
    return pts;
  }
  function enzymePath(shape, d = 0) {
    const pts = notch(shape).map(([x, y], i, all) => {
      const edge = i === 0 || i === all.length - 1;
      if (edge) return [x * (1 + 0.35 * d), y];
      return [x * (1 + 0.5 * d) + d * 9 * Math.sin(i * 2.1 + 0.6), y + d * (-50 - y) * 0.7 + d * 7 * Math.cos(i * 1.7)];
    });
    const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    return `M-66 -50L${pts.map(f).join("L")}L66 -50Q90 -50 90 -26V26Q90 50 66 50H-66Q-90 50 -90 26V-26Q-90 -50 -66 -50Z`;
  }
  // the substrate: a block 64 × 22 with a tab underneath that matches its own notch; (0, 0) = where it docks
  function substratePath(shape) {
    const tab = notch(shape).slice(1, -1).map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join("");
    const [l, r] = [notch(shape)[0][0], notch(shape).at(-1)[0]];
    return `M-34 -50L${l} -50${tab}L${r} -50H34V-72Q34 -76 30 -76H-30Q-34 -76 -34 -72Z`;
  }
  window.StayAdd = window.StayAdd || {};
  window.StayAdd.enzyme = {
    ENZ, SUB, clamp,
    rateT: (T, maxT = T) => (collide(T) * folded(T) * perm(Math.max(T, maxT))) / RMAX,
    collide, perm,
    siteT: (T, maxT = T) => Math.max(clamp((T - 40) / 18), 1 - perm(Math.max(T, maxT))),
    ratePH: (pH, opt) => Math.exp(-Math.pow((pH - opt) / 1.6, 2)),
    sitePH: (pH, opt) => clamp((Math.abs(pH - opt) - 1) / 3.5),
    siteWord: (d) => (d < 0.05 ? "fits the substrate" : d < 0.6 ? "changing shape" : "denatured"),
    siteShort: (d) => (d < 0.05 ? "active site fits" : d < 0.6 ? "changing shape" : "denatured"),
    enzymePath, substratePath,
    // a curve as an SVG path through fn over [a, b], mapped by X and Y
    curve(fn, a, b, X, Y, step = 0.5) {
      let p = "";
      for (let v = a; v <= b + 1e-9; v += step) p += (p ? "L" : "M") + X(v).toFixed(1) + " " + Y(fn(v)).toFixed(1);
      return p;
    }
  };
})();
