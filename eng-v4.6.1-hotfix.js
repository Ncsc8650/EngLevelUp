(() => {
  const VERSION = "v4.6.1";
  const css = `
    html[data-theme="dark"] .hero,
    html[data-theme="dark"] #home.hero {
      background: radial-gradient(circle at 82% 18%, rgba(255,178,111,.16), transparent 30%), linear-gradient(180deg, #0f172a 0%, #0b1120 78%) !important;
      color: #f8fafc !important;
    }
    html[data-theme="dark"] .hero-copy,
    html[data-theme="dark"] .hero h1,
    html[data-theme="dark"] .hero .hero-text,
    html[data-theme="dark"] .hero .eyebrow,
    html[data-theme="dark"] .hero-trust span,
    html[data-theme="dark"] .hero-actions .btn-secondary {
      color: #f8fafc !important;
    }
    html[data-theme="dark"] .hero-trust span,
    html[data-theme="dark"] .hero-actions .btn-secondary {
      background: #111827 !important;
      border-color: #334155 !important;
    }
    html[data-theme="dark"] .login-panel,
    html[data-theme="dark"] .hero-panel {
      background: #111827 !important;
      color: #f8fafc !important;
      border-color: #334155 !important;
      box-shadow: 0 18px 45px rgba(0,0,0,.36) !important;
    }
  `;
  function apply() {
    let style = document.getElementById("engV461HotfixStyle");
    if (!style) {
      style = document.createElement("style");
      style.id = "engV461HotfixStyle";
      document.head.appendChild(style);
    }
    style.textContent = css;
    const badge = document.getElementById("versionBadge");
    if (badge) badge.textContent = VERSION;
    const label = document.getElementById("themeLabel");
    const icon = document.querySelector(".theme-icon");
    const dark = document.documentElement.dataset.theme === "dark";
    if (label) label.textContent = dark ? "สว่าง" : "มืด";
    if (icon) icon.textContent = dark ? "☀" : "☾";
  }
  function resetStudentWordsOnFreshLoad() {
    if (!sessionStorage.getItem("eng_v461_loaded")) {
      sessionStorage.setItem("eng_v461_loaded", String(Date.now()));
      localStorage.setItem("eng_student_10_start", String(Math.floor(Math.random() * 499990)));
      sessionStorage.setItem("eng_idx_student", "0");
      sessionStorage.setItem("eng_answer_student", "[]");
    }
  }
  resetStudentWordsOnFreshLoad();
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("pageshow", apply);
  document.addEventListener("click", event => {
    if (event.target.closest("#themeToggle")) setTimeout(apply, 0);
  }, true);
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
