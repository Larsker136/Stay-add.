/* ==========================================================================
   stay add. — feel
   · SA.sound — a tiny Web Audio synth for the lab (off until the learner turns it on)
   · SA.smoothScroll — in-page moves glide with the browser's own smooth scroll;
     the corner switch adds eased wheel scrolling (off by default; touch and keys stay native)
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

  /* ---------- Scrolling ----------
     By default wheel, trackpad, touch and keys scroll natively; only moves the page
     asks for (in-page links, lab chains, contents buttons) glide, with the browser's
     own easing. SA.smoothScroll.to(y) glides there; .jump(y) goes at once.
     Eased wheel (off unless the learner turns it on with the corner switch): the wheel
     sets a target, and each frame the page moves 10% of the distance still to go,
     snapping onto the target once it is within half a pixel. Touch and keys stay native. */
  const behavior = reduced ? "instant" : "smooth";
  const EASE_KEY = "stayadd-smooth-wheel";
  let eased = false, target = scrollY, raf = 0;
  try { eased = localStorage.getItem(EASE_KEY) === "on"; } catch (e) { /* storage unavailable */ }

  const maxY = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  function step() {
    const y = scrollY, gap = target - y;
    if (Math.abs(gap) < 0.5) { scrollTo(0, target); raf = 0; return; }   // close enough: snap
    scrollTo(0, y + gap * 0.1);
    raf = requestAnimationFrame(step);
  }
  const glide = (y) => { target = Math.max(0, Math.min(maxY(), y)); if (!raf) raf = requestAnimationFrame(step); };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; target = scrollY; };

  // does something under the pointer scroll this way itself? then leave the wheel to it
  function innerScroller(el, dy) {
    for (; el && el !== document.body && el !== document.documentElement; el = el.parentElement) {
      if (el.matches?.('input[type="range"], select, textarea')) return true;
      const s = getComputedStyle(el);
      if (!/(auto|scroll|overlay)/.test(s.overflowY) || el.scrollHeight <= el.clientHeight + 1) continue;
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
    return false;
  }
  addEventListener("wheel", (e) => {
    if (!eased || e.defaultPrevented || e.ctrlKey || e.metaKey) return;          // pinch and ctrl-zoom stay native
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;                          // sideways: native
    if (getComputedStyle(document.body).overflow === "hidden" || maxY() === 0) return;   // page locked (menu open)
    if (innerScroller(e.target, e.deltaY)) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1;
    if (!raf) target = scrollY;                                                   // pick up from wherever the page is
    glide(target + e.deltaY * unit);
  }, { passive: false });
  // scrollbar drags, keys and touch move the page on their own: follow them, don't fight them
  ["keydown", "touchstart", "mousedown"].forEach((t) => addEventListener(t, (e) => { if (t !== "mousedown" || e.target === document.documentElement) stop(); }, { passive: true }));

  const jump = (y) => { stop(); scrollTo({ top: y, behavior: "instant" }); target = scrollY; };
  const to = (y) => (eased && !reduced ? glide(y) : scrollTo({ top: y, behavior }));
  SA.smoothScroll = {
    to, jump,
    get eased() { return eased; },
    setEased(on) {
      eased = !!on; stop();
      try { localStorage.setItem(EASE_KEY, eased ? "on" : "off"); } catch (e) { /* storage unavailable */ }
      document.querySelectorAll("[data-smooth-toggle]").forEach(paintToggle);
    }
  };

  // the corner switch
  function paintToggle(b) {
    b.setAttribute("aria-pressed", String(eased));
    b.querySelector("[data-smooth-state]").textContent = eased ? "on" : "off";
  }
  function addToggle() {
    if (document.querySelector("[data-smooth-toggle]")) return;
    const b = document.createElement("button");
    b.type = "button"; b.className = "smooth-toggle"; b.dataset.smoothToggle = "";
    b.title = "Eased wheel scrolling: the page glides to where you scroll";
    b.innerHTML = `<span class="smooth-toggle-dot" aria-hidden="true"></span><span>Smooth scroll</span><b data-smooth-state></b>`;
    b.addEventListener("click", () => SA.smoothScroll.setEased(!eased));
    document.body.appendChild(b);
    paintToggle(b);
  }
  if (document.body) addToggle(); else document.addEventListener("DOMContentLoaded", addToggle);

  // in-page links glide the same way; scrollIntoView also reaches targets inside
  // a scrolling panel (the lab layouts), and html's scroll-padding clears the header
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
    const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior, block: "start" });
    history.replaceState(null, "", url.hash);
    // keyboard focus follows the view, so Tab carries on from the section
    if (!el.matches("a, button, input, select, textarea, [tabindex]")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  });
})();
