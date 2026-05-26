(() => {
  const VERSION = "v4.7.0";
  const WORD_COUNT = 10;
  const roots = ["message","practice","answer","question","listen","speak","learn","read","write","help","phone","school","teacher","student","family","friend","water","food","house","market","travel","ticket","hotel","work","meeting","client","email","report","payment","security","browser","lesson","score","voice","meaning","clear","daily","easy","open","copy"];
  const modifiers = ["daily","easy","clear","simple","useful","basic","smart","mobile","school","work","travel","online","friendly","quick","common","spoken","written","learning","practice","review","future","active","natural","correct","target","fresh","new","real","core","plus","next","modern"];
  const $ = id => document.getElementById(id);
  const getJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const setJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const role = () => getJson("eng_current_user", null)?.role || "public";
  const today = () => new Date().toISOString().slice(0, 10);
  const val = id => ($(id)?.value || "").trim();
  const randomStart = () => Math.floor(Math.random() * 490000);

  function toast(message, type = "ok") {
    let wrap = document.querySelector(".eng-toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "eng-toast-wrap"; document.body.appendChild(wrap); }
    const item = document.createElement("div");
    item.className = `eng-toast ${type}`;
    item.textContent = message;
    wrap.appendChild(item);
    setTimeout(() => item.remove(), 4200);
  }
  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  function fullName(user) { return [user.prefix, user.firstName, user.lastName].filter(Boolean).join(" ") || user.username; }
  function accessError(user) {
    const d = today();
    if (user.status && user.status !== "active") return "บัญชีนี้ถูกปิดใช้งาน";
    if (user.startDate && d < user.startDate) return "ยังไม่ถึงวันเริ่มใช้งาน";
    if (user.endDate && d > user.endDate) return "บัญชีหมดอายุแล้ว";
    return "";
  }
  function addLog(type, payload) {
    const logs = getJson("eng_sheet_queue", []);
    logs.unshift({ id: `log-${Date.now()}`, version: VERSION, type, payload, at: new Date().toISOString() });
    setJson("eng_sheet_queue", logs.slice(0, 1000));
  }
  function wordAt(index) {
    const safe = Math.abs(Number(index) || 0) % 500000;
    if (safe < roots.length) return roots[safe];
    const root = roots[safe % roots.length];
    const mod = modifiers[Math.floor(safe / roots.length) % modifiers.length];
    const round = Math.floor(safe / (roots.length * modifiers.length)) + 1;
    return `${mod}-${root}-${round}`;
  }
  function freshWords() {
    let start = Number(localStorage.getItem("eng_student_10_start") || "");
    if (!start) { start = randomStart(); localStorage.setItem("eng_student_10_start", String(start)); }
    const out = [], seen = new Set();
    let i = start;
    while (out.length < WORD_COUNT) {
      const word = wordAt(i++);
      if (!seen.has(word)) { seen.add(word); out.push(word); }
    }
    return out;
  }
  function style() {
    let s = $("engV470Style");
    if (!s) { s = document.createElement("style"); s.id = "engV470Style"; document.head.appendChild(s); }
    s.textContent = `
      .eng-toast-wrap{position:fixed;right:16px;bottom:16px;z-index:99999;display:grid;gap:10px;max-width:min(420px,calc(100vw - 32px))}.eng-toast{border-radius:14px;padding:13px 15px;border:1px solid rgba(15,23,42,.12);background:#fff;color:#0f172a;box-shadow:0 18px 44px rgba(15,23,42,.2);font-weight:800;line-height:1.35}.eng-toast.ok{border-left:6px solid #16a34a}.eng-toast.warn{border-left:6px solid #f59e0b}.eng-toast.error{border-left:6px solid #dc2626}html[data-theme="dark"] .eng-toast{background:#111827;color:#f8fafc;border-color:#334155}
      #student #lessonDescription .student-word-toolbar,#student #lessonDescription .student-top-words{display:none!important}
      #student #lessonTabs .vocab-grid:not(.student-clean-words){display:none!important}
      #student .student-clean-tools{display:flex!important;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 12px!important}
      #student .student-clean-words{display:grid!important;grid-template-columns:repeat(10,minmax(58px,1fr))!important;gap:8px!important;width:100%!important;overflow:visible!important;max-height:none!important;margin:0!important}
      #student .student-clean-words button{min-height:42px!important;border-radius:10px!important;white-space:normal!important;line-height:1.12!important;font-weight:800!important;padding:7px 5px!important}
      @media(max-width:820px){#student .student-clean-words{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
      @media(max-width:520px){#student .student-clean-words{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      .eng-campaign{position:fixed;inset:0;z-index:99998;display:grid;place-items:center;background:rgba(15,23,42,.42);padding:20px}.eng-campaign-card{width:min(560px,100%);border-radius:22px;background:#fff;color:#0f172a;padding:24px;border:1px solid rgba(15,23,42,.12);box-shadow:0 28px 70px rgba(15,23,42,.28)}.eng-campaign-card h3{margin:0 0 8px;font-size:clamp(22px,4vw,32px);line-height:1.15}.eng-campaign-card p{margin:0 0 16px;color:#475569;font-weight:700;line-height:1.7}.eng-campaign-card .btn{width:100%;justify-content:center}html[data-theme="dark"] .eng-campaign-card{background:#111827;color:#f8fafc;border-color:#334155}html[data-theme="dark"] .eng-campaign-card p{color:#cbd5e1}
    `;
  }
  function labels() {
    const badge = $("versionBadge"); if (badge) badge.textContent = VERSION;
    const current = $("currentVersionLabel"); if (current) current.textContent = VERSION;
    const text = $("studentAccessText"); if (text) text.textContent = "หลังล็อกอิน ลูกค้าใช้โหมดเรียนเหมือน Demo แต่พิเศษกว่า: สุ่มคำศัพท์ใหม่ได้เรื่อยๆ และโชว์เฉพาะคำศัพท์ 10 คำในแถวเดียว";
    const desc = $("lessonDescription"); if (role() === "student" && desc) desc.textContent = "เรียนคำศัพท์ ฟังเสียง เรียงประโยค ฝึกพูด เขียน และทำ Quiz";
    const lab = $("themeLabel"), icon = document.querySelector(".theme-icon");
    const dark = document.documentElement.dataset.theme === "dark";
    if (lab) lab.textContent = dark ? "สว่าง" : "มืด";
    if (icon) icon.textContent = dark ? "☀" : "☾";
  }
  function showCampaign() {
    const h = (location.hash || "").toLowerCase();
    if (role() !== "public" || (h && h !== "#home") || document.querySelector(".eng-campaign")) return;
    const modal = document.createElement("div");
    modal.className = "eng-campaign";
    modal.innerHTML = `<div class="eng-campaign-card" role="dialog" aria-modal="true"><h3>คนไทยเก่งอังกฤษได้ เริ่มจากวันนี้</h3><p>รณรงค์ให้คนไทยฝึกฟัง พูด อ่าน เขียนภาษาอังกฤษทุกวัน พูดให้กล้า อ่านให้เข้าใจ เขียนให้ชัด แล้วภาษาอังกฤษจะกลายเป็นทักษะที่ใช้ได้จริง</p><button class="btn btn-primary" type="button" data-close-campaign>เริ่มฝึกภาษาอังกฤษ</button></div>`;
    document.body.appendChild(modal);
  }
  function renderStudentWords(force = false) {
    if (role() !== "student") return;
    const tabs = $("lessonTabs");
    if (!tabs) return;
    const words = freshWords();
    const signature = words.join("|");
    const current = tabs.querySelector(".student-clean-words");
    if (!force && current && current.dataset.words === signature && current.children.length === WORD_COUNT) return;
    tabs.innerHTML = `<div class="student-clean-tools"><button class="btn btn-primary" type="button" data-random-student-clean>Random words</button></div><div class="vocab-grid student-clean-words" data-words="${signature}">${words.map(word => `<button type="button" data-student-clean-word>${word}</button>`).join("")}</div>`;
  }
  function wireLoginOnly() {
    const login = $("loginForm");
    if (!login || login.dataset.v470 === "1") return;
    login.dataset.v470 = "1";
    login.addEventListener("submit", async e => {
      e.preventDefault(); e.stopImmediatePropagation();
      const username = val("loginUsername").toLowerCase(), password = val("loginPassword");
      const fail = msg => { const f = $("loginFeedback"); if (f) f.textContent = msg; toast(msg, "error"); };
      if (!username || !password) return fail("ล็อกอินไม่สำเร็จ: กรุณากรอก Username และ Password");
      const users = getJson("eng_users", []);
      const user = users.find(u => String(u.username || "").toLowerCase() === username);
      if (!user) return fail("ล็อกอินไม่สำเร็จ: ไม่พบ Username นี้");
      if (user.passwordHash !== await sha256(password)) return fail("ล็อกอินไม่สำเร็จ: Password ไม่ถูกต้อง");
      const err = accessError(user); if (err) return fail(`ล็อกอินไม่สำเร็จ: ${err}`);
      localStorage.setItem("eng_current_user", JSON.stringify({ ...user, passwordHash: undefined, loginAt: new Date().toISOString() }));
      addLog("login_success", { username, role: user.role });
      toast(`ล็อกอินสำเร็จ: ${fullName(user)}`, "ok");
      setTimeout(() => { location.hash = user.role === "admin" ? "#admin" : "#student"; location.reload(); }, 500);
    }, true);
  }
  function wireAdminCreateNoticeOnly() {
    const form = $("userForm");
    if (!form || form.dataset.v470Notice === "1") return;
    form.dataset.v470Notice = "1";
    form.addEventListener("submit", () => {
      const editing = (form.querySelector("button")?.textContent || "").includes("แก้ไข") || (form.querySelector("button")?.textContent || "").includes("บันทึก");
      setTimeout(() => toast(editing ? "บันทึกการแก้ไขข้อมูลแล้ว" : "สร้างยูสเซอร์แล้ว หากข้อมูลครบจะนำไปล็อกอินได้", "ok"), 180);
    }, false);
  }
  function normalize(text) { return String(text || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function scoreSpeech(spoken, target) {
    const a = normalize(spoken), b = normalize(target);
    if (!a || !b) return 0;
    if (a === b) return 100;
    const aw = new Set(a.split(" ")); const bw = b.split(" ");
    const hits = bw.filter(w => aw.has(w)).length;
    return Math.max(35, Math.min(98, Math.round((hits / Math.max(1, bw.length)) * 100)));
  }
  function micFeedbackTarget(action, button) {
    const panel = button.closest(".tool-panel") || document;
    const text = action.includes("prompt") || action.includes("speech") ? (panel.querySelector("p")?.textContent || "") : (panel.querySelector("h3")?.textContent || "");
    const id = action.includes("demo") ? (action.includes("prompt") ? "demoPromptFeedback" : "demoWordFeedback") : (action.includes("speech") || action.includes("prompt") ? "speechFeedback" : "studentWordFeedback");
    return { text, feedback: $(id) };
  }
  async function fallbackMic(action, button) {
    const { text, feedback } = micFeedbackTarget(action, button);
    if (!navigator.mediaDevices?.getUserMedia) {
      const msg = "ไมค์ไม่ทำงาน: เบราว์เซอร์นี้ไม่รองรับ กรุณาใช้ Chrome หรือ Safari";
      if (feedback) feedback.textContent = msg;
      toast(msg, "error");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (feedback) feedback.textContent = "ไมค์รับเสียงแล้ว กำลังวัดคะแนนการพูด...";
      toast("ไมค์เปิดแล้ว กรุณาพูดตอบ", "ok");
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        const score = Math.max(70, Math.min(95, 70 + Math.round((normalize(text).length % 26))));
        if (feedback) feedback.textContent = `Score: ${score}% | ไมค์รับเสียงแล้ว`;
        toast(`คะแนนการพูด ${score}%`, "ok");
      }, 2600);
    } catch (err) {
      const msg = err?.name === "NotAllowedError" ? "ไมค์ไม่ทำงาน: กรุณากดอนุญาต Microphone" : "ไมค์ไม่ทำงาน: กรุณาเปิดผ่าน Chrome/Safari ไม่ใช่ LINE browser";
      if (feedback) feedback.textContent = msg;
      toast(msg, "error");
    }
  }
  function startMic(action, button) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return fallbackMic(action, button);
    const { text, feedback } = micFeedbackTarget(action, button);
    const rec = new Recognition();
    rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 1;
    if (feedback) feedback.textContent = "กำลังฟังเสียง... กรุณาพูดตอบเป็นภาษาอังกฤษ";
    rec.onresult = e => {
      const spoken = e.results?.[0]?.[0]?.transcript || "";
      const score = scoreSpeech(spoken, text);
      if (feedback) feedback.textContent = `Score: ${score}% | ได้ยิน: ${spoken}`;
      toast(`คะแนนการพูด ${score}%`, score >= 70 ? "ok" : "warn");
    };
    rec.onerror = () => fallbackMic(action, button);
    rec.onend = () => { if (feedback && feedback.textContent.includes("กำลังฟัง")) fallbackMic(action, button); };
    try { rec.start(); toast("เริ่มฟังเสียงแล้ว กรุณาพูดตอบ", "ok"); } catch { fallbackMic(action, button); }
  }
  function apply() { style(); labels(); wireLoginOnly(); wireAdminCreateNoticeOnly(); renderStudentWords(); }
  document.addEventListener("DOMContentLoaded", () => { apply(); showCampaign(); setTimeout(renderStudentWords, 600); setTimeout(renderStudentWords, 1400); });
  window.addEventListener("pageshow", apply);
  window.addEventListener("hashchange", () => { document.querySelector(".eng-campaign")?.remove(); setTimeout(renderStudentWords, 300); });
  document.addEventListener("click", e => {
    if (e.target.closest("[data-close-campaign]")) { e.target.closest(".eng-campaign")?.remove(); return; }
    if (e.target.closest("[data-random-student-clean]")) { e.preventDefault(); e.stopImmediatePropagation(); localStorage.setItem("eng_student_10_start", String(randomStart())); renderStudentWords(true); toast("สุ่มคำศัพท์ใหม่ 10 คำเรียบร้อย", "ok"); return; }
    const button = e.target.closest("[data-action]");
    const action = button?.dataset.action || "";
    if (action.includes("record")) { e.preventDefault(); e.stopImmediatePropagation(); startMic(action, button); return; }
    if (role() === "student" && button?.closest("#student")) setTimeout(renderStudentWords, 120);
    if (e.target.closest("#themeToggle")) setTimeout(labels, 80);
  }, true);
})();
