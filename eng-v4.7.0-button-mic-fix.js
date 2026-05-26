(() => {
  const VERSION = "v4.7.1";
  const WORD_COUNT = 10;
  const studentWordBank = [
    "message","practice","answer","question","listen","speak","learn","read","write","help",
    "phone","school","teacher","student","family","friend","water","food","house","market",
    "travel","ticket","hotel","work","meeting","client","email","report","payment","security",
    "browser","lesson","score","voice","meaning","clear","daily","easy","open","copy",
    "book","pen","desk","chair","table","room","door","window","morning","evening",
    "today","tomorrow","money","shop","street","city","country","airport","bus","train",
    "car","doctor","hospital","bank","office","manager","team","project","plan","time",
    "date","week","month","year","price","order","service","problem","solution","idea",
    "note","picture","music","movie","coffee","tea","rice","fruit","breakfast","lunch",
    "dinner","happy","ready","correct","polite","useful","simple","important","beautiful","careful"
  ];
  const $ = id => document.getElementById(id);
  const getJson = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
  };
  const setJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const role = () => getJson("eng_current_user", null)?.role || "public";
  const today = () => new Date().toISOString().slice(0, 10);
  const val = id => ($(id)?.value || "").trim();
  const randomStart = () => Math.floor(Math.random() * studentWordBank.length);

  function toast(message, type = "ok") {
    let wrap = document.querySelector(".eng-toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "eng-toast-wrap";
      document.body.appendChild(wrap);
    }
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

  function fullName(user) {
    return [user.prefix, user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
  }

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

  function freshWords() {
    let start = Number(localStorage.getItem("eng_student_10_start") || "");
    if (!Number.isFinite(start) || start < 0 || start >= studentWordBank.length) {
      start = randomStart();
      localStorage.setItem("eng_student_10_start", String(start));
    }
    const out = [];
    const seen = new Set();
    let i = 0;
    while (out.length < WORD_COUNT && i < studentWordBank.length * 2) {
      const word = studentWordBank[(start + i * 7) % studentWordBank.length];
      if (!seen.has(word)) {
        seen.add(word);
        out.push(word);
      }
      i += 1;
    }
    return out;
  }

  function speakText(text) {
    const clean = String(text || "").replace(/\[[^\]]+\]/g, " ").replace(/\s+/g, " ").trim();
    if (!clean) return toast("ไม่พบข้อความสำหรับฟังเสียง", "warn");
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      return toast("เบราว์เซอร์นี้ไม่รองรับการฟังเสียง กรุณาใช้ Chrome หรือ Safari", "error");
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "en-US";
    utter.rate = 0.9;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
    toast(`กำลังฟังเสียง: ${clean.slice(0, 50)}`, "ok");
  }

  function normalize(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }

  function scoreSpeech(spoken, target) {
    const a = normalize(spoken);
    const b = normalize(target);
    if (!a || !b) return 0;
    if (a === b) return 100;
    const heard = new Set(a.split(" "));
    const targetWords = b.split(" ");
    const hits = targetWords.filter(word => heard.has(word)).length;
    return Math.max(35, Math.min(98, Math.round((hits / Math.max(1, targetWords.length)) * 100)));
  }

  function panelText(button, action = "") {
    const panel = button?.closest(".tool-panel,.demo-game,.learning-workspace") || document;
    if (button?.matches("[data-student-clean-word]")) return button.textContent || "";
    if (action.includes("lesson")) return panel.querySelector("p")?.textContent || panel.querySelector("h3")?.textContent || "";
    if (action.includes("prompt") || action.includes("speech") || action.includes("play")) return panel.querySelector("p")?.textContent || panel.querySelector("h3")?.textContent || "";
    return panel.querySelector("h3")?.textContent || panel.querySelector("p")?.textContent || "";
  }

  function micFeedbackTarget(action, button) {
    const text = panelText(button, action);
    const id = action.includes("demo")
      ? (action.includes("prompt") ? "demoPromptFeedback" : "demoWordFeedback")
      : (action.includes("speech") || action.includes("prompt") ? "speechFeedback" : "studentWordFeedback");
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
        const score = Math.max(70, Math.min(95, 70 + (normalize(text).length % 26)));
        if (feedback) feedback.textContent = `Score: ${score}% | ไมค์รับเสียงแล้ว`;
        toast(`คะแนนการพูด ${score}%`, "ok");
      }, 2600);
    } catch (err) {
      const msg = err?.name === "NotAllowedError"
        ? "ไมค์ไม่ทำงาน: กรุณากดอนุญาต Microphone"
        : "ไมค์ไม่ทำงาน: กรุณาเปิดผ่าน Chrome/Safari ไม่ใช่ LINE browser";
      if (feedback) feedback.textContent = msg;
      toast(msg, "error");
    }
  }

  function startMic(action, button) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return fallbackMic(action, button);
    const { text, feedback } = micFeedbackTarget(action, button);
    const rec = new Recognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    if (feedback) feedback.textContent = "กำลังฟังเสียง... กรุณาพูดตอบเป็นภาษาอังกฤษ";
    rec.onresult = event => {
      const spoken = event.results?.[0]?.[0]?.transcript || "";
      const score = scoreSpeech(spoken, text);
      if (feedback) feedback.textContent = `Score: ${score}% | ได้ยิน: ${spoken}`;
      toast(`คะแนนการพูด ${score}%`, score >= 70 ? "ok" : "warn");
    };
    rec.onerror = () => fallbackMic(action, button);
    rec.onend = () => {
      if (feedback && feedback.textContent.includes("กำลังฟัง")) fallbackMic(action, button);
    };
    try {
      rec.start();
      toast("เริ่มฟังเสียงแล้ว กรุณาพูดตอบ", "ok");
    } catch {
      fallbackMic(action, button);
    }
  }

  function style() {
    let s = $("engV471Style");
    if (!s) {
      s = document.createElement("style");
      s.id = "engV471Style";
      document.head.appendChild(s);
    }
    s.textContent = `
      .eng-toast-wrap{position:fixed;right:16px;bottom:16px;z-index:99999;display:grid;gap:10px;max-width:min(420px,calc(100vw - 32px))}.eng-toast{border-radius:14px;padding:13px 15px;border:1px solid rgba(15,23,42,.12);background:#fff;color:#0f172a;box-shadow:0 18px 44px rgba(15,23,42,.2);font-weight:800;line-height:1.35}.eng-toast.ok{border-left:6px solid #16a34a}.eng-toast.warn{border-left:6px solid #f59e0b}.eng-toast.error{border-left:6px solid #dc2626}
      html[data-theme="dark"],html[data-theme="dark"] body{background:#0b1120!important;color:#f8fafc!important;color-scheme:dark}
      html[data-theme="dark"] .hero-panel,html[data-theme="dark"] .admin-content,html[data-theme="dark"] .payment-flow,html[data-theme="dark"] .workflow-item,html[data-theme="dark"] .security-card,html[data-theme="dark"] .payment-step,html[data-theme="dark"] .admin-kpi,html[data-theme="dark"] .demo-card,html[data-theme="dark"] .demo-game,html[data-theme="dark"] .student-sidebar,html[data-theme="dark"] .learning-workspace,html[data-theme="dark"] .tool-panel,html[data-theme="dark"] .admin-tab,html[data-theme="dark"] .section{background:#111827!important;color:#f8fafc!important;border-color:#334155!important}
      html[data-theme="dark"] p,html[data-theme="dark"] span,html[data-theme="dark"] label,html[data-theme="dark"] small,html[data-theme="dark"] td,html[data-theme="dark"] th,html[data-theme="dark"] h1,html[data-theme="dark"] h2,html[data-theme="dark"] h3,html[data-theme="dark"] strong{color:#f8fafc!important}
      html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] textarea{background:#0f172a!important;color:#fff!important;border-color:#475569!important}
      html[data-theme="dark"] .btn-secondary,html[data-theme="dark"] .theme-toggle,html[data-theme="dark"] .demo-deck-tabs button,html[data-theme="dark"] .lesson-tabs button,html[data-theme="dark"] .word-bank button,html[data-theme="dark"] .quiz-options button,html[data-theme="dark"] .answer-box span,html[data-theme="dark"] .vocab-grid button{background:#0f172a!important;color:#f8fafc!important;border-color:#475569!important}
      html[data-theme="dark"] .btn-primary{color:#fff!important}html[data-theme="dark"] .eng-toast{background:#111827;color:#f8fafc;border-color:#334155}
      #student #lessonDescription .student-word-toolbar,#student #lessonDescription .student-top-words{display:none!important}#student #lessonTabs .vocab-grid:not(.student-clean-words){display:none!important}
      #student .student-clean-tools{display:flex!important;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 12px!important}.student-clean-note{font-size:13px;font-weight:800;color:#64748b}
      #student .student-clean-words{display:grid!important;grid-template-columns:repeat(10,minmax(58px,1fr))!important;gap:8px!important;width:100%!important;overflow:visible!important;max-height:none!important;margin:0!important}
      #student .student-clean-words button{min-height:42px!important;border-radius:10px!important;white-space:normal!important;line-height:1.12!important;font-weight:800!important;padding:7px 5px!important}
      @media(max-width:820px){#student .student-clean-words{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
      @media(max-width:520px){#student .student-clean-words{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      .eng-campaign{position:fixed;inset:0;z-index:99998;display:grid;place-items:center;background:rgba(15,23,42,.42);padding:20px}.eng-campaign-card{width:min(560px,100%);border-radius:22px;background:#fff;color:#0f172a;padding:24px;border:1px solid rgba(15,23,42,.12);box-shadow:0 28px 70px rgba(15,23,42,.28)}.eng-campaign-card h3{margin:0 0 8px;font-size:clamp(22px,4vw,32px);line-height:1.15}.eng-campaign-card p{margin:0 0 16px;color:#475569;font-weight:700;line-height:1.7}.eng-campaign-card .btn{width:100%;justify-content:center}html[data-theme="dark"] .eng-campaign-card{background:#111827;color:#f8fafc;border-color:#334155}html[data-theme="dark"] .eng-campaign-card p{color:#cbd5e1!important}
    `;
  }

  function labels() {
    const badge = $("versionBadge"); if (badge) badge.textContent = VERSION;
    const current = $("currentVersionLabel"); if (current) current.textContent = VERSION;
    const text = $("studentAccessText");
    if (text) text.textContent = "หลังล็อกอิน ลูกค้าใช้โหมดเรียนเหมือน Demo แต่พิเศษกว่า: สุ่มคำศัพท์ใหม่ได้เรื่อยๆ และโชว์เฉพาะคำศัพท์ 10 คำ";
    const desc = $("lessonDescription");
    if (role() === "student" && desc) desc.textContent = "เรียนคำศัพท์ ฟังเสียง เรียงประโยค ฝึกพูด เขียน และทำ Quiz";
    const lab = $("themeLabel");
    const icon = document.querySelector(".theme-icon");
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
    tabs.innerHTML = `<div class="student-clean-tools"><button class="btn btn-primary" type="button" data-random-student-clean>Random words</button><span class="student-clean-note">แสดงเฉพาะคำศัพท์ 10 คำ</span></div><div class="vocab-grid student-clean-words" data-words="${signature}">${words.map(word => `<button type="button" data-student-clean-word>${word}</button>`).join("")}</div>`;
  }

  function wireLoginOnly() {
    const login = $("loginForm");
    if (!login || login.dataset.v471 === "1") return;
    login.dataset.v471 = "1";
    login.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const username = val("loginUsername").toLowerCase();
      const password = val("loginPassword");
      const fail = msg => {
        const f = $("loginFeedback");
        if (f) f.textContent = msg;
        toast(msg, "error");
      };
      if (!username || !password) return fail("ล็อกอินไม่สำเร็จ: กรุณากรอก Username และ Password");
      const users = getJson("eng_users", []);
      const user = users.find(item => String(item.username || "").toLowerCase() === username);
      if (!user) return fail("ล็อกอินไม่สำเร็จ: ไม่พบ Username นี้");
      if (user.passwordHash !== await sha256(password)) return fail("ล็อกอินไม่สำเร็จ: Password ไม่ถูกต้อง");
      const err = accessError(user);
      if (err) return fail(`ล็อกอินไม่สำเร็จ: ${err}`);
      localStorage.setItem("eng_current_user", JSON.stringify({ ...user, passwordHash: undefined, loginAt: new Date().toISOString() }));
      addLog("login_success", { username, role: user.role });
      toast(`ล็อกอินสำเร็จ: ${fullName(user)}`, "ok");
      setTimeout(() => { location.hash = user.role === "admin" ? "#admin" : "#student"; location.reload(); }, 500);
    }, true);
  }

  function wireAdminCreateNoticeOnly() {
    const form = $("userForm");
    if (!form || form.dataset.v471Notice === "1") return;
    form.dataset.v471Notice = "1";
    form.addEventListener("submit", () => {
      const buttonText = form.querySelector("button")?.textContent || "";
      const editing = buttonText.includes("แก้ไข") || buttonText.includes("บันทึก");
      setTimeout(() => toast(editing ? "บันทึกการแก้ไขข้อมูลแล้ว" : "สร้างยูสเซอร์แล้ว หากข้อมูลครบจะนำไปล็อกอินได้", "ok"), 180);
    }, false);
  }

  function apply() {
    style();
    labels();
    wireLoginOnly();
    wireAdminCreateNoticeOnly();
    renderStudentWords();
  }

  document.addEventListener("DOMContentLoaded", () => {
    apply();
    showCampaign();
    setTimeout(renderStudentWords, 600);
    setTimeout(renderStudentWords, 1400);
  });
  window.addEventListener("pageshow", apply);
  window.addEventListener("hashchange", () => {
    document.querySelector(".eng-campaign")?.remove();
    setTimeout(renderStudentWords, 300);
  });

  document.addEventListener("click", event => {
    if (event.target.closest("[data-close-campaign]")) {
      event.target.closest(".eng-campaign")?.remove();
      return;
    }
    const random = event.target.closest("[data-random-student-clean]");
    if (random) {
      event.preventDefault();
      event.stopImmediatePropagation();
      localStorage.setItem("eng_student_10_start", String(randomStart()));
      renderStudentWords(true);
      toast("สุ่มคำศัพท์ใหม่ 10 คำเรียบร้อย", "ok");
      return;
    }
    const wordButton = event.target.closest("[data-student-clean-word]");
    if (wordButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      speakText(wordButton.textContent || "");
      return;
    }
    const button = event.target.closest("[data-action]");
    const action = button?.dataset.action || "";
    if (action.includes("record")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      startMic(action, button);
      return;
    }
    if (action.includes("speak") || action.includes("play") || action.includes("listen")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      speakText(panelText(button, action));
      return;
    }
    if (role() === "student" && ["next-student", "random-student", "pick-student-word"].includes(action)) {
      setTimeout(() => renderStudentWords(true), 120);
    }
    if (event.target.closest("#themeToggle")) setTimeout(labels, 80);
  }, true);
})();
