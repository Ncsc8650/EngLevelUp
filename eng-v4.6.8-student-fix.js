(() => {
  const VERSION = "v4.6.8";
  const WORD_COUNT = 10;
  const roots = ["message","practice","answer","question","listen","speak","learn","read","write","help","phone","school","teacher","student","family","friend","water","food","house","market","travel","ticket","hotel","work","meeting","client","email","report","payment","security","browser","lesson","score","voice","meaning","clear","daily","easy","open","copy"];
  const modifiers = ["daily","easy","clear","simple","useful","basic","smart","mobile","school","work","travel","online","friendly","quick","common","spoken","written","learning","practice","review","future","active","natural","correct","target","fresh","new","real","core","plus","next","modern"];
  const $ = id => document.getElementById(id);
  const getJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const currentRole = () => getJson("eng_current_user", null)?.role || "public";
  const randomStart = () => Math.floor(Math.random() * 490000);
  function wordAt(index) {
    const safe = Math.abs(Number(index) || 0) % 500000;
    if (safe < roots.length) return roots[safe];
    const root = roots[safe % roots.length];
    const mod = modifiers[Math.floor(safe / roots.length) % modifiers.length];
    const round = Math.floor(safe / (roots.length * modifiers.length)) + 1;
    return `${mod}-${root}-${round}`;
  }
  function studentWords() {
    let start = Number(localStorage.getItem("eng_student_10_start") || "");
    if (!start) { start = randomStart(); localStorage.setItem("eng_student_10_start", String(start)); }
    const seen = new Set();
    const out = [];
    let i = start;
    while (out.length < WORD_COUNT) {
      const word = wordAt(i++);
      if (!seen.has(word)) { seen.add(word); out.push(word); }
    }
    return out;
  }
  function toast(message, type = "ok") {
    let wrap = document.querySelector(".eng-toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "eng-toast-wrap"; document.body.appendChild(wrap); }
    const item = document.createElement("div");
    item.className = `eng-toast ${type}`;
    item.textContent = message;
    wrap.appendChild(item);
    setTimeout(() => item.remove(), 5200);
  }
  function injectStyle() {
    let style = $("engV468StudentFixStyle");
    if (!style) { style = document.createElement("style"); style.id = "engV468StudentFixStyle"; document.head.appendChild(style); }
    style.textContent = `
      #student #lessonDescription .student-word-toolbar,#student #lessonDescription .student-top-words{display:none!important}
      #student .student-clean-tools{display:flex!important;gap:10px;align-items:center;flex-wrap:wrap;margin:0 0 12px!important}
      #student .student-clean-words{display:grid!important;grid-template-columns:repeat(10,minmax(66px,1fr))!important;gap:8px!important;width:100%!important;overflow:visible!important;max-height:none!important;margin:0!important}
      #student .student-clean-words button{min-height:44px!important;border-radius:10px!important;white-space:normal!important;line-height:1.12!important;font-weight:800!important;padding:8px 6px!important}
      #student #lessonTabs .vocab-grid:not(.student-clean-words){display:none!important}
      @media(max-width:980px){#student .student-clean-words{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
      @media(max-width:560px){#student .student-clean-words{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    `;
  }
  function applyStudentWords(force = false) {
    if (currentRole() !== "student") return;
    const tabs = $("lessonTabs");
    const desc = $("lessonDescription");
    if (!tabs) return;
    const words = studentWords();
    const signature = words.join("|");
    if (desc && desc.querySelector(".student-top-words")) desc.textContent = "เรียนคำศัพท์ ฟังเสียง เรียงประโยค ฝึกพูด เขียน และทำ Quiz";
    const existing = tabs.querySelector(".student-clean-words");
    if (!force && existing && existing.dataset.words === signature) return;
    tabs.innerHTML = `<div class="student-clean-tools"><button class="btn btn-primary" type="button" data-random-student-clean>Random words</button></div><div class="vocab-grid student-clean-words" data-words="${signature}">${words.map(w => `<button type="button" data-student-clean-word>${w}</button>`).join("")}</div>`;
  }
  function setVersion() {
    const badge = $("versionBadge"); if (badge) badge.textContent = VERSION;
    const current = $("currentVersionLabel"); if (current) current.textContent = VERSION;
    const text = $("studentAccessText"); if (text) text.textContent = "หลังล็อกอิน ลูกค้าเห็นเฉพาะคำศัพท์ 10 คำในแถวเดียว กด Random words หรือรีเฟรชหน้าเพื่อเปลี่ยนชุดใหม่";
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
  function feedbackId(action) {
    if (action.includes("demo") && action.includes("prompt")) return "demoPromptFeedback";
    if (action.includes("demo")) return "demoWordFeedback";
    if (action.includes("speech") || action.includes("prompt")) return "speechFeedback";
    return "studentWordFeedback";
  }
  function targetText(action, button) {
    const panel = button.closest(".tool-panel") || document;
    if (action.includes("prompt")) return panel.querySelector("p")?.textContent || "";
    return panel.querySelector("h3")?.textContent || panel.querySelector("p")?.textContent || "";
  }
  function startMic(action, button) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const feedback = $(feedbackId(action));
    if (!Recognition) { const msg = "เบราว์เซอร์นี้ยังไม่รองรับไมโครโฟนสำหรับฝึกพูด กรุณาใช้ Chrome หรือ Safari เวอร์ชันล่าสุด"; if (feedback) feedback.textContent = msg; toast(msg, "error"); return; }
    const target = targetText(action, button);
    const recog = new Recognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    if (feedback) feedback.textContent = "กำลังฟังเสียง... กรุณาพูดภาษาอังกฤษ";
    toast("ระบบไมค์เริ่มฟังแล้ว กรุณาพูดภาษาอังกฤษ", "ok");
    recog.onresult = e => {
      const spoken = e.results?.[0]?.[0]?.transcript || "";
      const score = scoreSpeech(spoken, target);
      if (feedback) feedback.textContent = `Score: ${score}% | ได้ยิน: ${spoken}`;
      toast(`ระบบไมค์ตรวจแล้ว Score: ${score}%`, score >= 70 ? "ok" : "warn");
    };
    recog.onerror = e => {
      const msg = e.error === "not-allowed" ? "ไมค์ไม่ทำงาน: กรุณาอนุญาต Microphone ในเบราว์เซอร์" : `ไมค์ไม่ทำงาน: ${e.error || "กรุณาลองใหม่"}`;
      if (feedback) feedback.textContent = msg;
      toast(msg, "error");
    };
    recog.onend = () => { if (feedback && feedback.textContent.includes("กำลังฟัง")) feedback.textContent = "ไม่ได้ยินเสียง กรุณากดพูดแล้วลองใหม่"; };
    try { recog.start(); } catch { toast("ไมค์กำลังทำงานอยู่ กรุณารอสักครู่แล้วลองใหม่", "warn"); }
  }
  function apply() { injectStyle(); setVersion(); applyStudentWords(false); }
  document.addEventListener("DOMContentLoaded", () => { apply(); setTimeout(() => applyStudentWords(true), 700); setTimeout(() => applyStudentWords(true), 1600); });
  window.addEventListener("pageshow", apply);
  window.addEventListener("hashchange", () => setTimeout(() => applyStudentWords(true), 300));
  document.addEventListener("click", event => {
    const random = event.target.closest("[data-random-student-clean]");
    if (random) {
      event.preventDefault(); event.stopImmediatePropagation();
      localStorage.setItem("eng_student_10_start", String(randomStart()));
      applyStudentWords(true);
      toast("สุ่มคำศัพท์ใหม่ 10 คำเรียบร้อย", "ok");
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    const action = actionButton?.dataset.action || "";
    if (action.includes("record")) {
      event.preventDefault(); event.stopImmediatePropagation();
      startMic(action, actionButton);
    }
  }, true);
  new MutationObserver(() => requestAnimationFrame(apply)).observe(document.body, { childList: true, subtree: true });
})();
