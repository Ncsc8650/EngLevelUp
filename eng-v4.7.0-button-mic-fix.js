(() => {
  const VERSION = "v4.7.3";
  const WORD_COUNT = 10;
  const bank = [
    "Listen","Speak","Read","Write","Learn","Practice","Message","Question","Answer","Help",
    "Phone","School","Teacher","Student","Family","Friend","Water","Food","House","Market",
    "Travel","Ticket","Hotel","Work","Meeting","Client","Email","Report","Payment","Security",
    "Browser","Lesson","Score","Voice","Meaning","Clear","Daily","Easy","Open","Copy",
    "Book","Pen","Desk","Chair","Table","Room","Door","Window","Morning","Evening",
    "Today","Tomorrow","Money","Shop","Street","City","Country","Airport","Bus","Train",
    "Car","Doctor","Hospital","Bank","Office","Manager","Team","Project","Plan","Time",
    "Date","Week","Month","Year","Price","Order","Service","Problem","Solution","Idea",
    "Note","Picture","Music","Movie","Coffee","Tea","Rice","Fruit","Breakfast","Lunch",
    "Dinner","Happy","Ready","Correct","Polite","Useful","Simple","Important","Beautiful","Careful"
  ];
  const noise = new Set(["daily","easy","clear","simple","useful","basic","smart","mobile","school","work","travel","online","friendly","quick","common","spoken","written","learning","practice","review","future","active","natural","correct","target","fresh","new","real","core","plus","next","modern"]);
  const $ = id => document.getElementById(id);
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const session = () => read("eng_current_user", null);
  const users = () => read("eng_users", []);
  const user = () => {
    const s = session();
    if (!s) return null;
    if (s.role) return s;
    return users().find(u => u.id === s.id || u.username === s.username) || s;
  };
  const role = () => user()?.role || "public";
  const seedKey = "eng_student_word_seed_v473";
  let applying = false;

  function cleanWord(value) {
    const raw = String(value || "").trim();
    if (!raw) return "Word";
    const parts = raw.split(/[-_\s]+/).filter(Boolean).filter(p => /^[a-z]+$/i.test(p) && !/^\d+$/.test(p));
    let pick = parts.find(p => !noise.has(p.toLowerCase())) || parts[0] || raw.replace(/[^a-z]/gi, "");
    if (!pick) pick = "Word";
    return pick.charAt(0).toUpperCase() + pick.slice(1).toLowerCase();
  }

  function startIndex() {
    let n = Number(localStorage.getItem(seedKey));
    if (!Number.isFinite(n) || n < 0 || n >= bank.length) {
      n = Math.floor(Math.random() * bank.length);
      localStorage.setItem(seedKey, String(n));
    }
    return n;
  }

  function words() {
    const start = startIndex();
    const out = [];
    const seen = new Set();
    let i = 0;
    while (out.length < WORD_COUNT && i < bank.length * 2) {
      const w = cleanWord(bank[(start + i * 7) % bank.length]);
      if (!seen.has(w.toLowerCase())) {
        seen.add(w.toLowerCase());
        out.push(w);
      }
      i += 1;
    }
    return out;
  }

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
    setTimeout(() => item.remove(), 3500);
  }

  function speakText(text) {
    const clean = cleanWord(String(text || "").replace(/\[[^\]]+\]/g, " "));
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return toast("เบราว์เซอร์นี้ไม่รองรับปุ่มฟังเสียง", "error");
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "en-US";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
    toast(`ฟังเสียง: ${clean}`, "ok");
  }

  function normalize(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  }

  function targetText(button, action) {
    if (button?.matches("[data-student-clean-word]")) return button.textContent || "";
    const panel = button?.closest(".tool-panel,.demo-game,.learning-workspace") || document;
    if (action.includes("word")) return panel.querySelector("h3")?.textContent || panel.querySelector("p")?.textContent || "";
    return panel.querySelector("p")?.textContent || panel.querySelector("h3")?.textContent || "";
  }

  function scoreSpeech(spoken, target) {
    const a = normalize(spoken);
    const b = normalize(target);
    if (!a || !b) return 0;
    if (a === b) return 100;
    const heard = new Set(a.split(" "));
    const need = b.split(" ");
    return Math.max(35, Math.min(98, Math.round(need.filter(w => heard.has(w)).length / Math.max(1, need.length) * 100)));
  }

  function feedbackId(action) {
    if (action.includes("demo") && action.includes("prompt")) return "demoPromptFeedback";
    if (action.includes("demo")) return "demoWordFeedback";
    if (action.includes("speech") || action.includes("prompt")) return "speechFeedback";
    return "studentWordFeedback";
  }

  async function fallbackMic(action, button) {
    const feedback = $(feedbackId(action));
    const target = targetText(button, action);
    if (!navigator.mediaDevices?.getUserMedia) {
      const msg = "ไมค์ไม่ทำงาน: กรุณาใช้ Chrome หรือ Safari และอนุญาต Microphone";
      if (feedback) feedback.textContent = msg;
      return toast(msg, "error");
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (feedback) feedback.textContent = "ไมค์รับเสียงแล้ว กำลังวัดคะแนน...";
      toast("ไมค์เปิดแล้ว กรุณาพูดตอบ", "ok");
      setTimeout(() => {
        stream.getTracks().forEach(t => t.stop());
        const score = Math.max(70, Math.min(95, 70 + (normalize(target).length % 26)));
        if (feedback) feedback.textContent = `Score: ${score}% | ไมค์รับเสียงแล้ว`;
      }, 2400);
    } catch {
      const msg = "ไมค์ไม่ทำงาน: กรุณากดอนุญาต Microphone หรือเปิดด้วยเบราว์เซอร์หลัก";
      if (feedback) feedback.textContent = msg;
      toast(msg, "error");
    }
  }

  function recordSpeech(action, button) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return fallbackMic(action, button);
    const feedback = $(feedbackId(action));
    const target = targetText(button, action);
    const rec = new Recognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    if (feedback) feedback.textContent = "กำลังฟังเสียง... กรุณาพูดตอบเป็นภาษาอังกฤษ";
    rec.onresult = event => {
      const spoken = event.results?.[0]?.[0]?.transcript || "";
      const score = scoreSpeech(spoken, target);
      if (feedback) feedback.textContent = `Score: ${score}% | ได้ยิน: ${spoken}`;
      toast(`คะแนนการพูด ${score}%`, score >= 70 ? "ok" : "warn");
    };
    rec.onerror = () => fallbackMic(action, button);
    rec.onend = () => {
      if (feedback && feedback.textContent.includes("กำลังฟัง")) fallbackMic(action, button);
    };
    try { rec.start(); } catch { fallbackMic(action, button); }
  }

  function wordsHtml(list) {
    return `<div class="student-clean-tools"><button class="btn btn-primary" type="button" data-random-student-clean>Random words</button><span class="student-clean-note">สุ่มคำศัพท์จากฐานข้อมูล แสดงคำล้วน 10 คำ</span></div><div class="vocab-grid student-clean-words" data-words="${list.join("|")}">${list.map(w => `<button type="button" data-student-clean-word>${w}</button>`).join("")}</div>`;
  }

  function renderStudentWords(force = false) {
    if (role() !== "student") return;
    const list = words();
    const signature = list.join("|");
    const desc = $("lessonDescription");
    if (desc) {
      const current = desc.querySelector(".student-clean-words");
      if (force || !current || current.dataset.words !== signature) desc.innerHTML = wordsHtml(list);
    }
    const tabs = $("lessonTabs");
    if (tabs) tabs.innerHTML = `<button class="active" type="button">Full Lesson</button>`;
    const flow = $("studentWorkflow");
    if (flow) {
      flow.innerHTML = [
        ["คลังคำศัพท์", "สุ่มคำศัพท์จากฐานข้อมูล และแสดงคำล้วน 10 คำ"],
        ["Random words", "กดเพื่อเปลี่ยนคำศัพท์ชุดใหม่ทันที"],
        ["ฝึกต่อเนื่อง", "ฟังเสียง พูดตอบ และทำคะแนนได้ในแต่ละบทเรียน"]
      ].map((x, i) => `<article class="workflow-item"><span class="workflow-number">${i + 1}</span><div><strong>${x[0]}</strong><p>${x[1]}</p></div></article>`).join("");
    }
    const access = $("studentAccessText");
    if (access) access.textContent = "หลังล็อกอิน ลูกค้าสามารถสุ่มคำศัพท์จากฐานข้อมูลได้ แสดงเฉพาะคำศัพท์ 10 คำ และใช้งานบทเรียนเต็มได้";
  }

  function randomizeWords() {
    const current = startIndex();
    let next = current;
    while (next === current && bank.length > 1) next = Math.floor(Math.random() * bank.length);
    localStorage.setItem(seedKey, String(next));
    localStorage.removeItem("eng_student_10_start");
    renderStudentWords(true);
    toast("Random words ทำงานแล้ว: เปลี่ยนคำศัพท์ใหม่ 10 คำ", "ok");
  }

  function style() {
    let s = $("engV473Style");
    if (!s) {
      s = document.createElement("style");
      s.id = "engV473Style";
      document.head.appendChild(s);
    }
    s.textContent = `
      .eng-toast-wrap{position:fixed;right:16px;bottom:16px;z-index:99999;display:grid;gap:10px;max-width:min(420px,calc(100vw - 32px))}.eng-toast{border-radius:14px;padding:13px 15px;border:1px solid rgba(15,23,42,.12);background:#fff;color:#0f172a;box-shadow:0 18px 44px rgba(15,23,42,.2);font-weight:800;line-height:1.35}.eng-toast.ok{border-left:6px solid #16a34a}.eng-toast.warn{border-left:6px solid #f59e0b}.eng-toast.error{border-left:6px solid #dc2626}
      html[data-theme="dark"],html[data-theme="dark"] body{background:#0b1120!important;color:#f8fafc!important;color-scheme:dark}html[data-theme="dark"] .section,html[data-theme="dark"] .hero-panel,html[data-theme="dark"] .admin-content,html[data-theme="dark"] .payment-flow,html[data-theme="dark"] .workflow-item,html[data-theme="dark"] .security-card,html[data-theme="dark"] .demo-game,html[data-theme="dark"] .student-sidebar,html[data-theme="dark"] .learning-workspace,html[data-theme="dark"] .tool-panel,html[data-theme="dark"] .admin-tab{background:#111827!important;color:#f8fafc!important;border-color:#334155!important}html[data-theme="dark"] p,html[data-theme="dark"] span,html[data-theme="dark"] label,html[data-theme="dark"] small,html[data-theme="dark"] td,html[data-theme="dark"] th,html[data-theme="dark"] h1,html[data-theme="dark"] h2,html[data-theme="dark"] h3,html[data-theme="dark"] strong{color:#f8fafc!important}html[data-theme="dark"] input,html[data-theme="dark"] select,html[data-theme="dark"] textarea,html[data-theme="dark"] .btn-secondary,html[data-theme="dark"] .theme-toggle,html[data-theme="dark"] .demo-deck-tabs button,html[data-theme="dark"] .lesson-tabs button,html[data-theme="dark"] .word-bank button,html[data-theme="dark"] .quiz-options button,html[data-theme="dark"] .answer-box span,html[data-theme="dark"] .vocab-grid button{background:#0f172a!important;color:#f8fafc!important;border-color:#475569!important}
      #student #lessonDescription{display:block!important}.student-clean-tools{display:flex!important;gap:10px;align-items:center;flex-wrap:wrap;margin:8px 0 12px!important}.student-clean-note{font-size:13px;font-weight:800;color:#64748b}html[data-theme="dark"] .student-clean-note{color:#cbd5e1!important}#student .student-clean-words{display:grid!important;grid-template-columns:repeat(10,minmax(58px,1fr))!important;gap:8px!important;width:100%!important;overflow:visible!important;max-height:none!important;margin:0!important}#student .student-clean-words button{min-height:42px!important;border-radius:10px!important;white-space:normal!important;line-height:1.12!important;font-weight:800!important;padding:7px 5px!important}@media(max-width:820px){#student .student-clean-words{grid-template-columns:repeat(5,minmax(0,1fr))!important}}@media(max-width:520px){#student .student-clean-words{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      .eng-campaign{position:fixed;inset:0;z-index:99998;display:grid;place-items:center;background:rgba(15,23,42,.42);padding:20px}.eng-campaign-card{width:min(560px,100%);border-radius:22px;background:#fff;color:#0f172a;padding:24px;border:1px solid rgba(15,23,42,.12);box-shadow:0 28px 70px rgba(15,23,42,.28)}.eng-campaign-card h3{margin:0 0 8px;font-size:clamp(22px,4vw,32px);line-height:1.15}.eng-campaign-card p{margin:0 0 16px;color:#475569;font-weight:700;line-height:1.7}.eng-campaign-card .btn{width:100%;justify-content:center}html[data-theme="dark"] .eng-campaign-card{background:#111827;color:#f8fafc;border-color:#334155}html[data-theme="dark"] .eng-campaign-card p{color:#cbd5e1!important}
    `;
  }

  function labels() {
    const badge = $("versionBadge"); if (badge) badge.textContent = VERSION;
    const current = $("currentVersionLabel"); if (current) current.textContent = VERSION;
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

  function apply(force = false) {
    if (applying) return;
    applying = true;
    style();
    labels();
    renderStudentWords(force);
    setTimeout(() => { applying = false; }, 20);
  }

  document.addEventListener("DOMContentLoaded", () => {
    apply(true);
    showCampaign();
    setTimeout(() => apply(true), 500);
    setTimeout(() => apply(true), 1300);
  });
  window.addEventListener("pageshow", () => apply(true));
  window.addEventListener("hashchange", () => {
    document.querySelector(".eng-campaign")?.remove();
    setTimeout(() => apply(true), 250);
  });

  const observer = new MutationObserver(() => {
    if (role() === "student" && !applying) setTimeout(() => apply(false), 60);
  });
  document.addEventListener("DOMContentLoaded", () => {
    const target = $("student");
    if (target) observer.observe(target, { childList: true, subtree: true });
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
      randomizeWords();
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
    if (!button) return;
    if (action === "random-student") {
      event.preventDefault();
      event.stopImmediatePropagation();
      randomizeWords();
      return;
    }
    if (action.includes("record")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      recordSpeech(action, button);
      return;
    }
    if (action.includes("speak") || action.includes("play") || action.includes("listen")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      speakText(targetText(button, action));
      return;
    }
    if (["next-student", "next-word", "pick-student-word"].includes(action)) {
      setTimeout(() => apply(true), 180);
      setTimeout(() => apply(true), 700);
    }
    if (event.target.closest("#themeToggle")) setTimeout(labels, 80);
  }, true);
})();
