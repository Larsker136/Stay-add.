// Topic scenes for the "Physics in motion" section. Each scene is a small, framed
// figure computed from real physics — kinetic theory, a bar-magnet field, random
// decay with its N–t graph, and orbits obeying Kepler's third law. Few elements,
// steady motion, nothing scattered across the page.
// Exposes window.StayField = { scenes }.
(() => {
  const TAU = Math.PI * 2;
  const still = () => new URLSearchParams(location.search).has("still") || matchMedia("(prefers-reduced-motion: reduce)").matches;

  const rgba = (hex, a) => {
    const m = hex.replace("#", "");
    const n = parseInt(m.length === 3 ? m.replace(/./g, "$&$&") : m, 16);
    return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
  };
  const MONO = "11px 'IBM Plex Mono', ui-monospace, monospace";

  const SCENES = {
    // Kinetic particle model: a closed box of gas; particle speed ∝ √T.
    thermal: {
      color: "--c-thermal",
      init(s) {
        const box = { x: 24, y: 24, w: s.w - 110, h: s.h - 48 };
        s.box = box;
        s.p = Array.from({ length: 30 }, (_, i) => {
          const a = (i * 2.399) % TAU; // golden-angle spread of directions
          return { x: box.x + 12 + ((i * 37) % 100) / 100 * (box.w - 24), y: box.y + 12 + ((i * 61) % 100) / 100 * (box.h - 24), ux: Math.cos(a), uy: Math.sin(a) };
        });
        s.last = null;
      },
      temp: (t) => 300 + 180 * Math.sin(t * TAU / 16),
      draw(s, t, alpha, readout) {
        const { ctx, box } = s, c = s.colors[this.color], ink3 = s.colors["--ink-3"], line = s.colors["--line-2"];
        const T = this.temp(t), speed = 62 * Math.sqrt(T / 300);
        const dt = s.last === null ? 0 : Math.min(t - s.last, 0.05); s.last = t;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = line; ctx.lineWidth = 1;
        ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w, box.h);
        const R = 4.5;
        for (const p of s.p) {
          p.x += p.ux * speed * dt; p.y += p.uy * speed * dt;
          if (p.x < box.x + R) { p.x = box.x + R; p.ux *= -1; }
          if (p.x > box.x + box.w - R) { p.x = box.x + box.w - R; p.ux *= -1; }
          if (p.y < box.y + R) { p.y = box.y + R; p.uy *= -1; }
          if (p.y > box.y + box.h - R) { p.y = box.y + box.h - R; p.uy *= -1; }
          ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, TAU); ctx.fill();
        }
        // thermometer, 100–500 K
        const tx = s.w - 46, top = box.y + 10, bot = box.y + box.h - 10, frac = (T - 100) / 400;
        ctx.strokeStyle = line; ctx.beginPath(); ctx.moveTo(tx, top); ctx.lineTo(tx, bot); ctx.stroke();
        ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(tx, bot); ctx.lineTo(tx, bot - frac * (bot - top)); ctx.stroke();
        ctx.lineWidth = 1; ctx.font = MONO; ctx.fillStyle = ink3; ctx.textBaseline = "middle";
        for (let k = 100; k <= 500; k += 100) {
          const y = bot - (k - 100) / 400 * (bot - top);
          ctx.strokeStyle = ink3; ctx.beginPath(); ctx.moveTo(tx + 4, y); ctx.lineTo(tx + 8, y); ctx.stroke();
          ctx.fillText(k, tx + 12, y);
        }
        ctx.globalAlpha = 1;
        if (readout) readout(`${Math.round(T)} K`);
      },
    },

    // Bar magnet: field lines traced from the north pole; markers drift along them N → S.
    field: {
      color: "--c-elec",
      init(s) {
        const cx = s.w / 2, cy = s.h / 2, a = Math.min(s.w, s.h) * 0.17;
        s.mag = { cx, cy, a };
        const N = [cx - a * 0.8, cy], S = [cx + a * 0.8, cy];
        const B = (x, y) => {
          const d1 = Math.hypot(x - N[0], y - N[1]) ** 3, d2 = Math.hypot(x - S[0], y - S[1]) ** 3;
          return [(x - N[0]) / d1 - (x - S[0]) / d2, (y - N[1]) / d1 - (y - S[1]) / d2];
        };
        s.lines = [];
        const count = 16;
        for (let i = 0; i < count; i++) {
          const th = Math.PI * 0.18 + (i / (count - 1)) * Math.PI * 1.64; // 32°–328°: every direction except straight at S
          let x = N[0] + 9 * Math.cos(th), y = N[1] + 9 * Math.sin(th);
          const pts = [[x, y]];
          for (let k = 0; k < 1400; k++) {
            const [bx, by] = B(x, y), m = Math.hypot(bx, by);
            x += bx / m * 2.5; y += by / m * 2.5;
            pts.push([x, y]);
            if (Math.hypot(x - S[0], y - S[1]) < 8 || x < -40 || x > s.w + 40 || y < -40 || y > s.h + 40) break;
          }
          let len = 0; const cum = [0];
          for (let k = 1; k < pts.length; k++) { len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); cum.push(len); }
          s.lines.push({ pts, cum, len });
        }
      },
      draw(s, t, alpha) {
        const { ctx, mag } = s, c = s.colors[this.color];
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = rgba(c, 0.38); ctx.lineWidth = 1.2;
        for (const L of s.lines) {
          ctx.beginPath(); L.pts.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
        }
        ctx.fillStyle = c;
        for (const L of s.lines) {
          for (let j = 0; j < Math.max(1, Math.round(L.len / 160)); j++) {
            const d = (t * 34 + j * 160) % L.len;
            let k = 1; while (k < L.cum.length - 1 && L.cum[k] < d) k++;
            const p = L.pts[k];
            ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, TAU); ctx.fill();
          }
        }
        const { cx, cy, a } = mag, h = a * 0.42;
        ctx.fillStyle = s.colors["--red"]; ctx.fillRect(cx - a, cy - h / 2, a, h);
        ctx.fillStyle = s.colors["--blue"]; ctx.fillRect(cx, cy - h / 2, a, h);
        ctx.fillStyle = s.colors["--bg"]; ctx.font = "600 13px 'Space Grotesk', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("N", cx - a / 2, cy); ctx.fillText("S", cx + a / 2, cy);
        ctx.textAlign = "start"; ctx.globalAlpha = 1;
      },
    },

    // Random decay of 80 nuclei beside a live N–t graph and the ideal half-life curve.
    nuclear: {
      color: "--c-nuclear",
      HALF: 3, RUN: 12, HOLD: 2.5,
      init(s) { s.cycle = -1; },
      reseed(s) {
        const lambda = Math.LN2 / this.HALF;
        s.at = Array.from({ length: 80 }, () => -Math.log(1 - Math.random()) / lambda);
      },
      draw(s, t, alpha, readout) {
        const { ctx, w, h } = s, c = s.colors[this.color], ink3 = s.colors["--ink-3"], ink4 = s.colors["--ink-4"], line = s.colors["--line-2"];
        const period = this.RUN + this.HOLD, cyc = Math.floor(t / period), age = Math.min(t % period, this.RUN);
        if (cyc !== s.cycle) { s.cycle = cyc; this.reseed(s); }
        ctx.globalAlpha = alpha;
        // nuclei, 10 × 8
        const gx = 24, gy = 34, gw = w * 0.42, gh = h - 68, cols = 10, rows = 8;
        const dx = gw / (cols - 1), dy = gh / (rows - 1);
        let left = 0;
        s.at.forEach((at, i) => {
          const x = gx + (i % cols) * dx, y = gy + Math.floor(i / cols) * dy, since = age - at;
          if (since < 0) { left++; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, TAU); ctx.fill(); }
          else {
            ctx.strokeStyle = ink4; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.stroke();
            if (since < 0.5) { ctx.strokeStyle = rgba(c, 1 - since / 0.5); ctx.beginPath(); ctx.arc(x, y, 4 + since * 22, 0, TAU); ctx.stroke(); }
          }
        });
        // N–t graph
        const x0 = w * 0.56, x1 = w - 24, y0 = h - 42, y1 = 30;
        const X = (tt) => x0 + tt / this.RUN * (x1 - x0), Y = (f) => y0 - f * (y0 - y1);
        ctx.strokeStyle = ink3; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x0, y1 - 6); ctx.lineTo(x0, y0); ctx.lineTo(x1 + 4, y0); ctx.stroke();
        ctx.font = MONO; ctx.fillStyle = ink3; ctx.textBaseline = "middle";
        [[1, "N₀"], [0.5, "½"], [0.25, "¼"]].forEach(([f, lab]) => {
          ctx.strokeStyle = line; ctx.setLineDash([2, 3]);
          ctx.beginPath(); ctx.moveTo(x0, Y(f)); ctx.lineTo(x1, Y(f)); ctx.stroke(); ctx.setLineDash([]);
          ctx.textAlign = "end"; ctx.fillText(lab, x0 - 6, Y(f));
        });
        ctx.textAlign = "center";
        for (let k = 1; k <= 4; k++) {
          ctx.strokeStyle = ink3; ctx.beginPath(); ctx.moveTo(X(k * this.HALF), y0); ctx.lineTo(X(k * this.HALF), y0 + 4); ctx.stroke();
          ctx.fillText(`${k > 1 ? k : ""}t½`, X(k * this.HALF), y0 + 15);
        }
        ctx.strokeStyle = ink4; ctx.setLineDash([4, 4]); ctx.beginPath();
        for (let k = 0; k <= 60; k++) { const tt = k / 60 * this.RUN; k ? ctx.lineTo(X(tt), Y(0.5 ** (tt / this.HALF))) : ctx.moveTo(X(tt), Y(1)); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath();
        for (let k = 0; k <= 120; k++) {
          const tt = k / 120 * age, n = s.at.filter((a) => a > tt).length / s.at.length;
          k ? ctx.lineTo(X(tt), Y(n)) : ctx.moveTo(X(0), Y(n));
        }
        ctx.stroke(); ctx.lineWidth = 1; ctx.textAlign = "start";
        ctx.globalAlpha = 1;
        if (readout) readout(`N = ${left} of 80`);
      },
    },

    // Four planets; angular speed ω ∝ r^-1.5, drawn with a slight tilt.
    orbits: {
      color: "--c-space",
      init(s) {
        const tilt = 0.42;
        s.orb = { cx: s.w / 2, cy: s.h / 2, R: Math.min(s.w * 0.46, (s.h - 50) / (2 * tilt)), tilt };
        s.planets = [0.32, 0.5, 0.72, 0.95].map((f, i) => ({ f, phase: 0.6 + i * 1.9, size: [3.5, 4.5, 6, 5][i] }));
      },
      draw(s, t, alpha) {
        const { ctx } = s, c = s.colors[this.color], { cx, cy, R, tilt } = s.orb, line = s.colors["--line-2"];
        ctx.globalAlpha = alpha;
        for (const p of s.planets) {
          const r = p.f * R, omega = 0.55 * Math.pow(p.f / 0.32, -1.5), a = p.phase + omega * t;
          ctx.strokeStyle = line; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.ellipse(cx, cy, r, r * tilt, 0, 0, TAU); ctx.stroke();
          ctx.strokeStyle = rgba(c, 0.55); ctx.lineWidth = 1.6; // short trail behind the planet
          ctx.beginPath(); ctx.ellipse(cx, cy, r, r * tilt, 0, a - 0.5 * Math.min(1, omega), a); ctx.stroke();
          ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx + r * Math.cos(a), cy + r * tilt * Math.sin(a), p.size, 0, TAU); ctx.fill();
        }
        const sun = s.colors["--amber"];
        ctx.fillStyle = rgba(sun, 0.18); ctx.beginPath(); ctx.arc(cx, cy, 18, 0, TAU); ctx.fill();
        ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, cy, 9, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1;
      },
    },
  };

  // Sticky scroll section: scroll position picks the scene; the figure cross-fades.
  function scenes(section, canvas, cards, onChange, onReadout) {
    const ctx = canvas.getContext("2d");
    const names = cards.map((c) => c.dataset.scene);
    const colorNames = ["--c-thermal", "--c-elec", "--c-nuclear", "--c-space", "--ink-3", "--ink-4", "--line-2", "--red", "--blue", "--amber", "--bg"];
    const colors = {};
    const readColors = () => { const cs = getComputedStyle(canvas); colorNames.forEach((n) => { colors[n] = cs.getPropertyValue(n).trim(); }); };
    const states = {};
    let w = 0, h = 0;
    const size = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      names.forEach((n) => { states[n] = { ctx, w, h, colors }; SCENES[n].init(states[n]); });
    };
    readColors(); size();

    let current = 0, previous = 0, switchedAt = -10, now = 0, redraw = () => {};
    const activate = (i) => {
      cards.forEach((c, k) => c.classList.toggle("is-active", k === i));
      section.style.setProperty("--sc", `var(${SCENES[names[i]].color})`);
      section.dataset.scene = names[i];
      onChange(cards[i]);
    };
    activate(0);

    const onScroll = () => {
      const r = section.getBoundingClientRect(), span = r.height - innerHeight;
      const p = span > 0 ? Math.min(Math.max(-r.top / span, 0), 0.9999) : 0;
      section.style.setProperty("--p", p.toFixed(4));
      const i = Math.floor(p * names.length);
      if (i !== current) { previous = current; current = i; switchedAt = now; activate(i); if (still()) { switchedAt = -10; redraw(); } }
    };
    addEventListener("scroll", onScroll, { passive: true });

    const draw = (t) => {
      now = t;
      ctx.clearRect(0, 0, w, h);
      const fade = Math.min((t - switchedAt) / 0.5, 1);
      if (fade < 1 && previous !== current) SCENES[names[previous]].draw(states[names[previous]], t, 1 - fade);
      SCENES[names[current]].draw(states[names[current]], t, fade, (txt) => onReadout(names[current], txt));
    };

    if (still()) { redraw = () => draw(4); redraw(); }
    else {
      let raf = 0;
      const tick = (ms) => { draw(ms / 1000); raf = requestAnimationFrame(tick); };
      new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) raf = requestAnimationFrame(tick); }).observe(canvas);
    }
    new ResizeObserver(() => { size(); redraw(); }).observe(canvas);
    document.addEventListener("themechange", () => { readColors(); redraw(); });
  }

  window.StayField = { scenes };
})();
