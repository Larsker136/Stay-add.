// Light/dark toggle. The page follows the system setting until the reader picks
// one; the choice is remembered. The head of each page applies it before paint.
(() => {
  const KEY = "stayadd-physics-theme";
  const root = document.documentElement;
  const current = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.querySelectorAll(".theme").forEach((btn) => {
    const label = () => btn.setAttribute("aria-label", current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    label();
    btn.addEventListener("click", () => {
      root.dataset.theme = current() === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, root.dataset.theme); } catch (e) {}
      label();
      document.dispatchEvent(new Event("themechange"));
    });
  });
})();
