/* ==========================================================================
   stay add. — feel
   · SA.sound — a tiny Web Audio synth for the lab (off until the learner turns it on)
   · eased wheel scrolling on every page, as in IGCSE Econ Lab and Physics
     (touch, keys and the scrollbar stay native; off for reduced motion)
   ========================================================================== */
(function () {
  "use strict";

  const SA = (window.StayAdd = window.StayAdd || {});
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sound ---------- */
  const SOUND_KEY = "stayadd-sound";
  let audio = null, lastHit = 0;
  const readSound = () => { try { return localStorage.getItem(SOUND_KEY) === "on"; } catch (e) { return false; } };
  SA.sound = {
    enabled: readSound(),
    set(on) {
      this.enabled = on;
      try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch (e) { /* storage unavailable */ }
      if (on) this.play("tick");
    },
    // kind: "hit" (successful collision, energy 0..1), "tick" (UI)
    play(kind, energy = 0.5) {
      if (!this.enabled) return;
      const now = performance.now();
      if (kind === "hit" && now - lastHit < 45) return;   // keep busy reactions from turning into noise
      lastHit = now;
      try {
        audio = audio || new (window.AudioContext || window.webkitAudioContext)();
        if (audio.state === "suspended") audio.resume();
        const t = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
        if (kind === "hit") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(520 + energy * 520 + Math.random() * 60, t);
          osc.frequency.exponentialRampToValueAtTime(260, t + 0.18);
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.09, t + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        } else {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(880, t);
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.05, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        }
        osc.connect(gain).connect(audio.destination);
        osc.start(t); osc.stop(t + 0.25);
      } catch (e) { /* audio unavailable */ }
    }
  };

  /* ---------- Eased wheel scrolling (every page) ----------
     Each frame moves 10% of the distance still to go, and once it is within half a
     pixel it simply lands there — the same feel as IGCSE Econ Lab and Physics.
     Touch, keyboard and the scrollbar stay native. A panel that can scroll itself
     (lesson list, lab controls, menu) keeps its own native scrolling.
     SA.smoothScroll.to(y) glides there; .jump(y) goes at once. */
  let target = scrollY, cur = scrollY, raf = 0;
  const max = () => document.documentElement.scrollHeight - innerHeight;
  const step = () => {
    cur += (target - cur) * 0.1;                     // 10% of what is left
    if (Math.abs(target - cur) < 0.5) cur = target;  // close enough: just arrive
    scrollTo(0, cur);
    raf = cur === target ? 0 : requestAnimationFrame(step);
  };
  const jump = (y) => { cancelAnimationFrame(raf); raf = 0; scrollTo(0, y); target = cur = scrollY; };
  const to = (y) => {
    target = Math.max(0, Math.min(max(), y));
    if (reduced) return jump(target);
    if (!raf) { cur = scrollY; raf = requestAnimationFrame(step); }
  };
  SA.smoothScroll = { to, jump };

  // does an element between the pointer and the page want this wheel turn for itself?
  const ownScroller = (node, dy) => {
    for (let n = node; n && n !== document.body && n.nodeType === 1; n = n.parentElement) {
      const oy = getComputedStyle(n).overflowY;
      if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight + 1) {
        if (dy < 0 ? n.scrollTop > 0 : n.scrollTop + n.clientHeight < n.scrollHeight - 1) return true;
      }
    }
    return false;
  };

  if (!reduced && !matchMedia("(pointer: coarse)").matches) {
    addEventListener("wheel", (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || ownScroller(e.target, e.deltaY)) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 18 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      to((raf ? target : scrollY) + d);
    }, { passive: false });
  }
  // moved by keyboard or the scrollbar: start again from there
  addEventListener("scroll", () => { if (!raf) target = cur = scrollY; }, { passive: true });

  // in-page links glide the same way
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    to(el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")));
    history.replaceState(null, "", url.hash);
  });
})();
