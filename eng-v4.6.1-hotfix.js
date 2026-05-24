(() => {
  const VERSION = "v4.6.3";
  const TOTAL_BANK = 500000;
  const WORD_COUNT = 30;
  const roots = ["message","practice","answer","question","listen","speak","learn","read","write","help","phone","school","teacher","student","family","friend","water","food","house","market","travel","ticket","hotel","work","meeting","client","email","report","payment","security","browser","lesson","score","voice","meaning","clear","daily","easy","open","copy"];
  const modifiers = ["daily","easy","clear","simple","useful","basic","smart","mobile","school","work","travel","online","friendly","quick","common","spoken","written","learning","practice","review","future","active","natural","correct","target","fresh","new","useful","real","core","plus","next","modern"];
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
    html[data-theme="dark"] .hero-actions .btn-secondary { color: #f8fafc !important; }
    html[data-theme="dark"] .hero-trust span,
    html[data-theme="dark"] .hero-actions .btn-secondary { background: #111827 !important; border-color: #334155 !important; }
    html[data-theme="dark"] .login-panel,
    html[data-theme="dark"] .hero-panel { background: #111827 !important; color: #f8fafc !important; border-color: #334155 !important; box-shadow: 0 18px 45px rgba(0,0,0,.36) !important; }
    .student-top-words{display:grid!important;grid-template-columns:repeat(10,minmax(72px,1fr))!important;gap:10px;width:100%;margin-top:12px;overflow:visible!important;max-height:none!important}
    .student-top-words button{min-height:44px;border-radius:10px;white-space:normal;line-height:1.15;font-weight:800}
    .student-word-toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}
    @media(max-width:960px){.student-top-words{grid-template-columns:repeat(5,minmax(72px,1fr))!important}}
    @media(max-width:560px){.student-top-words{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
  `;
  const $ = id => document.getElementById(id);
  const currentRole = () => { try { return JSON.parse(localStorage.getItem("eng_current_user") || "null")?.role || "public"; } catch { return "public"; } };
  const randomStart = () => Math.floor(Math.random() * Math.max(1, TOTAL_BANK - WORD_COUNT));
  function wordAt(index) {
    const safe = Math.abs(Number(index) || 0) % TOTAL_BANK;
    if (safe < roots.length) return roots[safe];
    const root = roots[safe % roots.length];
    const mod = modifiers[Math.floor(safe / roots.length) % modifiers.length];
    const round = Math.floor(safe / (roots.length * modifiers.length)) + 1;
    return `${mod}-${root}-${round}`;
  }
  function setFreshWordsForPageLoad() {
    const start = String(randomStart());
    localStorage.setItem("eng_student_30_start", start);
    localStorage.setItem("eng_student_10_start", start);
    sessionStorage.setItem("eng_idx_student", "0");
    sessionStorage.setItem("eng_answer_student", "[]");
  }
  function studentWords() {
    const start = Number(localStorage.getItem("eng_student_30_start") || localStorage.getItem("eng_student_10_start") || 0);
    const seen = new Set();
    const out = [];
    let i = start;
    while (out.length < WORD_COUNT) {
      const step = out.length < 10 ? 1 : out.length < 20 ? 17 : 37;
      const word = wordAt(i % TOTAL_BANK);
      if (!seen.has(word)) { seen.add(word); out.push(word); }
      i += step;
    }
    return out;
  }
  function applyStyleAndLabels() {
    let style = document.getElementById("engV461HotfixStyle");
    if (!style) { style = document.createElement("style"); style.id = "engV461HotfixStyle"; document.head.appendChild(style); }
    style.textContent = css;
    const badge = $("versionBadge");
    if (badge) badge.textContent = VERSION;
    const current = $("currentVersionLabel");
    if (current) current.textContent = VERSION;
    const label = $("themeLabel");
    const icon = document.querySelector(".theme-icon");
    const dark = document.documentElement.dataset.theme === "dark";
    if (label) label.textContent = dark ? "สว่าง" : "มืด";
    if (icon) icon.textContent = dark ? "☀" : "☾";
  }
  function ensureStudentTopWords(force = false) {
    if (currentRole() !== "student") return;
    const desc = $("lessonDescription");
    if (!desc) return;
    const words = studentWords();
    const signature = words.join("|");
    const existing = desc.querySelector(".student-top-words");
    const html = `<div class="student-word-toolbar"><button class="btn btn-secondary" type="button" data-random-student-10>Random words</button><span class="badge active">30 words / 3 rows / ${TOTAL_BANK.toLocaleString("en-US")} bank</span></div><div class="student-top-words" data-words="${signature}">${words.map((word, i) => `<button type="button" data-word-student="${i}">${word}</button>`).join("")}</div>`;
    if (force || !existing || existing.dataset.words !== signature || existing.children.length !== WORD_COUNT) desc.innerHTML = html;
  }
  function apply() { applyStyleAndLabels(); ensureStudentTopWords(false); }
  setFreshWordsForPageLoad();
  document.addEventListener("DOMContentLoaded", () => { apply(); setTimeout(() => ensureStudentTopWords(true), 500); setTimeout(() => ensureStudentTopWords(true), 1500); });
  window.addEventListener("pageshow", apply);
  window.addEventListener("hashchange", () => setTimeout(() => ensureStudentTopWords(true), 250));
  document.addEventListener("click", event => {
    if (event.target.closest("#themeToggle")) setTimeout(applyStyleAndLabels, 0);
    if (event.target.closest("[data-random-student-10]")) {
      const start = String(randomStart());
      localStorage.setItem("eng_student_30_start", start);
      localStorage.setItem("eng_student_10_start", start);
      sessionStorage.setItem("eng_idx_student", "0");
      sessionStorage.setItem("eng_answer_student", "[]");
      setTimeout(() => ensureStudentTopWords(true), 0);
    }
  }, true);
  new MutationObserver(() => requestAnimationFrame(apply)).observe(document.body, { childList: true, subtree: true });
  new MutationObserver(applyStyleAndLabels).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
