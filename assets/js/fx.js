/* ==========================================================================
   stay add. — feel
   · SA.sound — a tiny Web Audio synth for the lab (off until the learner turns it on)
   · SA.smoothScroll — in-page moves glide with the browser's own smooth scroll
     (wheel, trackpad, touch and keys are never intercepted; jumps for reduced motion)
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
     Wheel, trackpad, touch and keys scroll natively; only moves the page asks for
     (in-page links, lab chains, contents buttons) glide, with the browser's own easing.
     SA.smoothScroll.to(y) glides there; .jump(y) goes at once. */
  const behavior = reduced ? "instant" : "smooth";
  const jump = (y) => scrollTo({ top: y, behavior: "instant" });
  const to = (y) => scrollTo({ top: y, behavior });
  SA.smoothScroll = { to, jump };

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
