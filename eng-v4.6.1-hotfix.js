(() => {
  const VERSION = "v4.6.6";
  const TOTAL_BANK = 500000;
  const WORD_COUNT = 10;
  const STUDENT_COPY = "หลังล็อกอิน ลูกค้าเห็นคำศัพท์เบื้องต้น 10 คำ แถวละ 5 คำ 2 แถว รีเฟรชหน้าเว็บหรือกด Random words เพื่อเปลี่ยนชุดใหม่";
  const roots = ["message","practice","answer","question","listen","speak","learn","read","write","help","phone","school","teacher","student","family","friend","water","food","house","market","travel","ticket","hotel","work","meeting","client","email","report","payment","security","browser","lesson","score","voice","meaning","clear","daily","easy","open","copy"];
  const modifiers = ["daily","easy","clear","simple","useful","basic","smart","mobile","school","work","travel","online","friendly","quick","common","spoken","written","learning","practice","review","future","active","natural","correct","target","fresh","new","real","core","plus","next","modern"];
  const css = `
    html[data-theme="dark"] .hero,
    html[data-theme="dark"] #home.hero { background: radial-gradient(circle at 82% 18%, rgba(255,178,111,.16), transparent 30%), linear-gradient(180deg, #0f172a 0%, #0b1120 78%) !important; color: #f8fafc !important; }
    html[data-theme="dark"] .hero-copy,html[data-theme="dark"] .hero h1,html[data-theme="dark"] .hero .hero-text,html[data-theme="dark"] .hero .eyebrow,html[data-theme="dark"] .hero-trust span,html[data-theme="dark"] .hero-actions .btn-secondary { color: #f8fafc !important; }
    html[data-theme="dark"] .hero-trust span,html[data-theme="dark"] .hero-actions .btn-secondary { background: #111827 !important; border-color: #334155 !important; }
    html[data-theme="dark"] .login-panel,html[data-theme="dark"] .hero-panel { background: #111827 !important; color: #f8fafc !important; border-color: #334155 !important; box-shadow: 0 18px 45px rgba(0,0,0,.36) !important; }
    .student-top-words{display:grid!important;grid-template-columns:repeat(5,minmax(90px,1fr))!important;gap:10px;width:100%;margin-top:12px;overflow:visible!important;max-height:none!important}
    .student-top-words button{min-height:46px;border-radius:10px;white-space:normal;line-height:1.15;font-weight:800}
    .student-word-toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0 10px}
    @media(max-width:560px){.student-top-words{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    .eng-toast-wrap{position:fixed;right:16px;bottom:16px;z-index:99999;display:grid;gap:10px;max-width:min(420px,calc(100vw - 32px))}
    .eng-toast{border-radius:14px;padding:13px 15px;border:1px solid rgba(15,23,42,.12);background:#fff;color:#0f172a;box-shadow:0 18px 44px rgba(15,23,42,.2);font-weight:800;line-height:1.35}
    .eng-toast.ok{border-left:6px solid #16a34a}.eng-toast.warn{border-left:6px solid #f59e0b}.eng-toast.error{border-left:6px solid #dc2626}
    html[data-theme="dark"] .eng-toast{background:#111827;color:#f8fafc;border-color:#334155}
    .eng-campaign{position:fixed;inset:0;z-index:99998;display:grid;place-items:center;background:rgba(15,23,42,.42);padding:20px}
    .eng-campaign-card{width:min(560px,100%);border-radius:22px;background:#fff;color:#0f172a;padding:24px;border:1px solid rgba(15,23,42,.12);box-shadow:0 28px 70px rgba(15,23,42,.28)}
    .eng-campaign-card h3{margin:0 0 8px;font-size:clamp(22px,4vw,32px);line-height:1.15}.eng-campaign-card p{margin:0 0 16px;color:#475569;font-weight:700;line-height:1.7}.eng-campaign-card .btn{width:100%;justify-content:center}
    html[data-theme="dark"] .eng-campaign-card{background:#111827;color:#f8fafc;border-color:#334155}.eng-campaign-card p{color:#475569}html[data-theme="dark"] .eng-campaign-card p{color:#cbd5e1}
  `;
  const $ = id => document.getElementById(id);
  const getJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const setJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const today = () => new Date().toISOString().slice(0, 10);
  const currentRole = () => getJson("eng_current_user", null)?.role || "public";
  const randomStart = () => Math.floor(Math.random() * Math.max(1, TOTAL_BANK - WORD_COUNT));
  const value = id => ($(id)?.value || "").trim();

  function toast(message, type = "ok") {
    let wrap = document.querySelector(".eng-toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "eng-toast-wrap"; document.body.appendChild(wrap); }
    const item = document.createElement("div");
    item.className = `eng-toast ${type}`;
    item.textContent = message;
    wrap.appendChild(item);
    setTimeout(() => item.remove(), 5200);
  }

  function showCampaignPopup() {
    if (document.querySelector(".eng-campaign")) return;
    const modal = document.createElement("div");
    modal.className = "eng-campaign";
    modal.innerHTML = `<div class="eng-campaign-card" role="dialog" aria-modal="true" aria-label="English campaign"><h3>คนไทยเก่งอังกฤษได้ เริ่มจากวันนี้</h3><p>รณรงค์ให้คนไทยฝึกฟัง พูด อ่าน เขียนภาษาอังกฤษทุกวัน ใช้คำศัพท์ง่ายๆ พูดให้กล้า อ่านให้เข้าใจ เขียนให้ชัด แล้วภาษาอังกฤษจะกลายเป็นทักษะที่ใช้ได้จริงในชีวิตและการทำงาน</p><button class="btn btn-primary" type="button" data-close-campaign>เริ่มฝึกภาษาอังกฤษ</button></div>`;
    document.body.appendChild(modal);
  }

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function addLog(action, detail, role = currentRole()) {
    const logs = getJson("eng_activity_logs", []);
    logs.unshift({ id: `log_${Date.now()}`, at: new Date().toISOString(), action, detail, role });
    setJson("eng_activity_logs", logs.slice(0, 1000));
  }

  function fullName(user) {
    return [user.prefix, user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
  }

  function validateAccess(user) {
    const now = today();
    if (user.status && user.status !== "active") return "บัญชีนี้ถูกปิดใช้งาน กรุณาติดต่อแอดมิน";
    if (user.startDate && now < user.startDate) return "บัญชียังไม่ถึงวันเริ่มใช้งาน";
    if (user.endDate && now > user.endDate) return "บัญชีหมดอายุการใช้งานแล้ว";
    return "";
  }

  function renderUserRows() {
    const body = $("userRows");
    if (!body) return;
    const users = getJson("eng_users", []);
    body.innerHTML = users.map(user => `<tr><td>${fullName(user)}<br><small>${user.nickname || ""}</small></td><td>${user.username}</td><td>${user.role === "admin" ? "แอดมิน" : "ลูกค้า"}</td><td>${user.startDate || "-"} ถึง ${user.endDate || "-"}</td><td>${user.status || "active"}</td><td><span class="badge active">ใช้งานได้</span></td></tr>`).join("");
  }

  function wireUserCreate() {
    const form = $("userForm");
    if (!form || form.dataset.hotfixUserCreate === "1") return;
    form.dataset.hotfixUserCreate = "1";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const feedback = $("userFormFeedback");
      const role = value("newRole") || "student";
      const username = value("newUsername").toLowerCase();
      const password = value("newPassword");
      const firstName = value("newFirst");
      const lastName = value("newLast");
      const startDate = value("newStart");
      const endDate = value("newEnd");
      const fail = message => { if (feedback) feedback.textContent = message; toast(message, "error"); };
      if (!username || !password || !firstName || !lastName || !startDate || !endDate) return fail("สร้างยูสเซอร์ไม่สำเร็จ: กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
      if (password.length < 6) return fail("สร้างยูสเซอร์ไม่สำเร็จ: Password ต้องมีอย่างน้อย 6 ตัวอักษร");
      if (endDate < startDate) return fail("สร้างยูสเซอร์ไม่สำเร็จ: วันสิ้นสุดต้องไม่น้อยกว่าวันเริ่มใช้งาน");
      const users = getJson("eng_users", []);
      if (users.some(user => String(user.username || "").toLowerCase() === username)) return fail("สร้างยูสเซอร์ไม่สำเร็จ: Username นี้มีอยู่แล้ว");
      const user = {
        id: `user_${Date.now()}`,
        role,
        prefix: value("newPrefix"),
        firstName,
        lastName,
        nickname: value("newNick"),
        username,
        passwordHash: await sha256(password),
        startDate,
        endDate,
        status: "active"
      };
      users.push(user);
      setJson("eng_users", users);
      addLog("create_user", `สร้าง ${role}: ${username}`);
      form.reset();
      renderUserRows();
      const message = `สร้างยูสเซอร์สำเร็จ: ${username} (${role === "admin" ? "แอดมิน" : "ลูกค้า"}) สามารถนำไปล็อกอินได้แล้ว`;
      if (feedback) feedback.textContent = message;
      toast(message, "ok");
    }, true);
  }

  function wireLogin() {
    const form = $("loginForm");
    if (!form || form.dataset.hotfixLogin === "1") return;
    form.dataset.hotfixLogin = "1";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const feedback = $("loginFeedback");
      const username = value("loginUsername").toLowerCase();
      const password = value("loginPassword");
      const fail = message => { if (feedback) feedback.textContent = message; toast(message, "error"); addLog("login_failed", `${username}: ${message}`, "public"); };
      if (!username || !password) return fail("ล็อกอินไม่สำเร็จ: กรุณากรอก Username และ Password");
      const users = getJson("eng_users", []);
      const user = users.find(item => String(item.username || "").toLowerCase() === username);
      if (!user) return fail("ล็อกอินไม่สำเร็จ: ไม่พบ Username นี้ในฐานข้อมูล");
      const passwordHash = await sha256(password);
      if (user.passwordHash !== passwordHash) return fail("ล็อกอินไม่สำเร็จ: Password ไม่ถูกต้อง");
      const accessError = validateAccess(user);
      if (accessError) return fail(`ล็อกอินไม่สำเร็จ: ${accessError}`);
      const session = { ...user, passwordHash: undefined, loginAt: new Date().toISOString() };
      localStorage.setItem("eng_current_user", JSON.stringify(session));
      addLog("login_success", `${username} เข้าระบบสำเร็จ`, user.role);
      const message = `ล็อกอินสำเร็จ: ${fullName(user)} (${user.role === "admin" ? "แอดมิน" : "ลูกค้า"})`;
      if (feedback) feedback.textContent = message;
      toast(message, "ok");
      setTimeout(() => {
        location.hash = user.role === "admin" ? "#admin" : "#student";
        location.reload();
      }, 650);
    }, true);
  }

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
    localStorage.setItem("eng_student_10_start", start);
    localStorage.removeItem("eng_student_30_start");
    sessionStorage.setItem("eng_idx_student", "0");
    sessionStorage.setItem("eng_answer_student", "[]");
  }
  function studentWords() {
    const start = Number(localStorage.getItem("eng_student_10_start") || 0);
    const seen = new Set();
    const out = [];
    let i = start;
    while (out.length < WORD_COUNT) {
      const word = wordAt(i % TOTAL_BANK);
      if (!seen.has(word)) { seen.add(word); out.push(word); }
      i += 1;
    }
    return out;
  }
  function applyStyleAndLabels() {
    let style = document.getElementById("engV461HotfixStyle");
    if (!style) { style = document.createElement("style"); style.id = "engV461HotfixStyle"; document.head.appendChild(style); }
    style.textContent = css;
    const badge = $("versionBadge"); if (badge) badge.textContent = VERSION;
    const current = $("currentVersionLabel"); if (current) current.textContent = VERSION;
    const studentText = $("studentAccessText"); if (studentText) studentText.textContent = STUDENT_COPY;
    const desc = $("lessonDescription");
    if (desc && !desc.querySelector(".student-top-words") && currentRole() === "student") desc.textContent = "เรียนคำศัพท์เบื้องต้น 10 คำ แถวละ 5 คำ 2 แถว ฟังเสียง เรียงประโยค ฝึกพูด เขียน และทำ Quiz";
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
    const html = `<div class="student-word-toolbar"><button class="btn btn-secondary" type="button" data-random-student-10>Random words</button><span class="badge active">Beginner 10 words / ${TOTAL_BANK.toLocaleString("en-US")} bank</span></div><div class="student-top-words" data-words="${signature}">${words.map((word, i) => `<button type="button" data-word-student="${i}">${word}</button>`).join("")}</div>`;
    if (force || !existing || existing.dataset.words !== signature || existing.children.length !== WORD_COUNT) desc.innerHTML = html;
  }
  function apply() { applyStyleAndLabels(); wireUserCreate(); wireLogin(); renderUserRows(); ensureStudentTopWords(false); }
  setFreshWordsForPageLoad();
  document.addEventListener("DOMContentLoaded", () => { apply(); showCampaignPopup(); setTimeout(() => ensureStudentTopWords(true), 500); setTimeout(() => ensureStudentTopWords(true), 1500); setTimeout(applyStyleAndLabels, 1700); });
  window.addEventListener("pageshow", apply);
  window.addEventListener("hashchange", () => setTimeout(() => ensureStudentTopWords(true), 250));
  document.addEventListener("click", event => {
    if (event.target.closest("[data-close-campaign]")) event.target.closest(".eng-campaign")?.remove();
    if (event.target.closest("#themeToggle")) setTimeout(applyStyleAndLabels, 0);
    if (event.target.closest("[data-random-student-10]")) {
      localStorage.setItem("eng_student_10_start", String(randomStart()));
      localStorage.removeItem("eng_student_30_start");
      sessionStorage.setItem("eng_idx_student", "0");
      sessionStorage.setItem("eng_answer_student", "[]");
      toast("สุ่มคำศัพท์ใหม่ 10 คำเรียบร้อย", "ok");
      setTimeout(() => ensureStudentTopWords(true), 0);
    }
  }, true);
  new MutationObserver(() => requestAnimationFrame(apply)).observe(document.body, { childList: true, subtree: true });
  new MutationObserver(applyStyleAndLabels).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
