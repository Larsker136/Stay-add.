/* ==========================================================================
   stay add. — Staggered menu
   Based on React Bits <StaggeredMenu /> (JS-CSS variant), rebuilt in vanilla
   JS for this site. Same GSAP choreography: colour layers sweep in, then the
   panel, then each row rises in with a stagger. Requires GSAP (CDN); without
   it the menu still opens and closes, just without animation.

   SA.StaggeredMenu({ mount, title, items, feature, ... }) → { open, close, toggle }
   items:   [{ label, hint, link, ariaLabel?, current? }]
   feature: { eyebrow, title, text, link } — optional card at the bottom
   ========================================================================== */
(function () {
  "use strict";

  const SA = (window.StayAdd = window.StayAdd || {});
  const icon = (name) => (SA.icon ? SA.icon(name) : "");

  SA.StaggeredMenu = function ({
    mount,                                   // element that receives the toggle button
    position = "right",
    title = "Navigate",                      // small heading above the rows
    colors = ["#B49DFF", "#7C5CFF"],
    items = [],
    feature = null,
    home = null,                             // { link, label, hint, current } — a row back to the home page, above the list
    closeOnClickAway = true,
    onMenuOpen,
    onMenuClose
  } = {}) {
    const gsap = window.gsap;
    const offscreen = position === "left" ? -100 : 100;
    let isOpen = false, busy = false;
    let openTl = null, closeTween = null, spinTween = null, textTween = null;

    /* ---------- Toggle button ---------- */
    const btn = document.createElement("button");
    btn.className = "sm-toggle";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "staggered-menu-panel");
    btn.setAttribute("aria-label", "Open menu");
    btn.innerHTML = `
      <span class="sm-toggle-textWrap" aria-hidden="true"><span class="sm-toggle-textInner"><span class="sm-toggle-line">Menu</span></span></span>
      <span class="sm-icon" aria-hidden="true"><span class="sm-icon-line"></span><span class="sm-icon-line sm-icon-line-v"></span></span>`;
    mount.appendChild(btn);
    const textInner = btn.querySelector(".sm-toggle-textInner");
    const plus = btn.querySelector(".sm-icon");

    /* ---------- Overlay + panel ---------- */
    let layerColors = colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
    if (layerColors.length >= 3) layerColors.splice(Math.floor(layerColors.length / 2), 1);

    const wrap = document.createElement("div");
    wrap.className = "staggered-menu";
    wrap.dataset.position = position;
    wrap.innerHTML = `
      <div class="sm-prelayers" aria-hidden="true">
        ${layerColors.map((c) => `<div class="sm-prelayer" style="background:${c}"></div>`).join("")}
      </div>
      <aside id="staggered-menu-panel" class="staggered-menu-panel" aria-label="Site menu" aria-hidden="true" inert>
        <div class="sm-panel-inner">
          ${home ? `
            <a class="sm-home sm-rise" href="${home.link}"${home.current ? ' aria-current="page"' : ""}>
              <span class="sm-home-ic" aria-hidden="true">${icon("home")}</span>
              <span class="sm-home-t"><b>${home.label}</b><small>${home.hint || ""}</small></span>
              <span class="sm-home-go" aria-hidden="true">${home.current ? "You’re here" : icon("arrowRight")}</span>
            </a>` : ""}
          <div class="sm-panel-top sm-fade">
            <span class="sm-panel-title">${title}</span>
            <span class="sm-esc"><kbd>Esc</kbd> to close</span>
          </div>
          <ul class="sm-panel-list" role="list">
            ${items.map((it, i) => `
              <li class="sm-row">
                <span class="sm-rule" aria-hidden="true"></span>
                <a class="sm-panel-item" href="${it.link}" aria-label="${it.ariaLabel || it.label}"${it.current ? ' aria-current="page"' : ""}>
                  <span class="sm-num sm-fade">${String(i + 1).padStart(2, "0")}</span>
                  <span class="sm-text">
                    <span class="sm-mask"><span class="sm-panel-itemLabel">${it.label}</span></span>
                    ${it.hint ? `<span class="sm-hint sm-fade">${it.hint}</span>` : ""}
                  </span>
                  <span class="sm-go sm-fade" aria-hidden="true">${it.current ? '<span class="sm-here">You’re here</span>' : icon("arrowRight")}</span>
                </a>
              </li>`).join("")}
          </ul>
          ${feature ? `
            <a class="sm-feature sm-rise${feature.live ? " is-live" : ""}" href="${feature.link}">
              <span class="sm-feature-eyebrow"><i></i>${feature.eyebrow}</span>
              <span class="sm-feature-title">${feature.title}</span>
              <span class="sm-feature-text">${feature.text}</span>
              <span class="sm-feature-go" aria-hidden="true">${icon("arrowRight")}</span>
            </a>` : ""}
          <p class="sm-sign sm-rise"><strong>stay add<b>.</b></strong><span>Stay addicted. Keep adding.</span></p>
        </div>
      </aside>`;
    document.body.appendChild(wrap);

    const panel = wrap.querySelector(".staggered-menu-panel");
    const layers = [...wrap.querySelectorAll(".sm-prelayer")];
    const labels = [...panel.querySelectorAll(".sm-panel-itemLabel")];
    const rules = [...panel.querySelectorAll(".sm-rule")];
    const fades = [...panel.querySelectorAll(".sm-fade")];
    const rises = [...panel.querySelectorAll(".sm-rise")];

    function resetContent() {
      gsap.set(labels, { yPercent: 120, rotate: 6 });
      gsap.set(rules, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(fades, { opacity: 0, y: 8 });
      gsap.set(rises, { opacity: 0, y: 24 });
    }

    if (gsap) {
      // x: 0 drops the CSS translateX(100%) so only xPercent drives the slide
      gsap.set([panel, ...layers], { x: 0, xPercent: offscreen });
      gsap.set(plus, { rotate: 0, transformOrigin: "50% 50%" });
      resetContent();
    }

    /* ---------- Animations ---------- */
    function playOpen() {
      if (busy) return;
      busy = true;
      openTl?.kill();
      closeTween?.kill(); closeTween = null;
      resetContent();

      const tl = gsap.timeline({ paused: true, onComplete: () => { busy = false; } });
      layers.forEach((el, i) =>
        tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07)
      );
      const panelAt = (layers.length ? (layers.length - 1) * 0.07 : 0) + (layers.length ? 0.08 : 0);
      const panelDur = 0.65;
      tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDur, ease: "power4.out" }, panelAt);

      const itemsAt = panelAt + panelDur * 0.15;
      tl.to(rules, { scaleX: 1, duration: 0.8, ease: "power3.out", stagger: 0.08 }, itemsAt);
      tl.to(labels, { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: 0.08 }, itemsAt);
      tl.to(fades, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.03 }, itemsAt + 0.15);
      tl.to(rises, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
        onComplete: () => gsap.set([...fades, ...rises], { clearProps: "transform" })
      }, panelAt + panelDur * 0.45);

      openTl = tl;
      tl.play(0);
    }

    function playClose() {
      openTl?.kill(); openTl = null;
      closeTween?.kill();
      closeTween = gsap.to([...layers, panel], {
        xPercent: offscreen, duration: 0.32, ease: "power3.in", overwrite: "auto",
        onComplete: () => { resetContent(); busy = false; }
      });
    }

    function animateIcon(opening) {
      spinTween?.kill();
      spinTween = opening
        ? gsap.to(plus, { rotate: 225, duration: 0.8, ease: "power4.out", overwrite: "auto" })
        : gsap.to(plus, { rotate: 0, duration: 0.35, ease: "power3.inOut", overwrite: "auto" });
    }

    function animateText(opening) {
      textTween?.kill();
      const from = opening ? "Menu" : "Close", to = opening ? "Close" : "Menu";
      const seq = [from];
      let last = from;
      for (let i = 0; i < 3; i++) { last = last === "Menu" ? "Close" : "Menu"; seq.push(last); }
      if (last !== to) seq.push(to);
      seq.push(to);
      textInner.innerHTML = seq.map((l) => `<span class="sm-toggle-line">${l}</span>`).join("");
      gsap.set(textInner, { yPercent: 0 });
      textTween = gsap.to(textInner, {
        yPercent: -((seq.length - 1) / seq.length) * 100,
        duration: 0.5 + seq.length * 0.07,
        ease: "power4.out"
      });
    }

    /* ---------- State ---------- */
    function setOpen(next) {
      if (next === isOpen) return;
      isOpen = next;
      wrap.toggleAttribute("data-open", next);
      btn.setAttribute("aria-expanded", String(next));
      btn.setAttribute("aria-label", next ? "Close menu" : "Open menu");
      panel.setAttribute("aria-hidden", String(!next));
      panel.toggleAttribute("inert", !next);

      if (gsap) {
        next ? playOpen() : playClose();
        animateIcon(next);
        animateText(next);
      } else {
        const x = next ? "0%" : `${offscreen}%`;
        [...layers, panel].forEach((el) => (el.style.transform = `translateX(${x})`));
        textInner.innerHTML = `<span class="sm-toggle-line">${next ? "Close" : "Menu"}</span>`;
      }
      (next ? onMenuOpen : onMenuClose)?.();
    }

    btn.style.setProperty("--sm-toggle-width", "2.9em");   // fixed width so "Menu"/"Close" don't jiggle
    btn.addEventListener("click", () => setOpen(!isOpen));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen) { setOpen(false); btn.focus(); } });
    if (closeOnClickAway)
      document.addEventListener("mousedown", (e) => {
        if (isOpen && !panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
      });

    return { open: () => setOpen(true), close: () => setOpen(false), toggle: () => setOpen(!isOpen) };
  };
})();
