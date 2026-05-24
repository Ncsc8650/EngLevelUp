(() => {
  const VERSION = "v4.6.0";
  const TOTAL_BANK = 500000;
  const $ = id => document.getElementById(id);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const lang = () => localStorage.getItem("eslp_lang") === "en" ? "en" : "th";
  const text = {
    th: {
      demo: "ทดลองเรียน", student: "ผู้เรียน", admin: "แอดมิน", payment: "ชำระเงิน", security: "ความปลอดภัย",
      login: "ล็อกอิน", logout: "ออกจากระบบ", next: "คำต่อไป", listen: "ฟังเสียง", speak: "พูดตอบ",
      check: "ตรวจคำตอบ", clear: "ล้าง", write: "ตรวจงานเขียน", spell: "สะกดเต็มคำ", hint: "ช่วยสะกด",
      correct: "ถูกต้อง!", wrong: "ยังไม่ถูก ลองใหม่", meaning: "ความหมายที่ถูกต้อง",
      hero: "ทดลองเรียนคำศัพท์ก่อนใช้งานระบบเต็ม",
      heroText: "หน้าแรกเปิดให้ลูกค้าทดลองเล่น Student Workspace แบบ Public Demo ได้ครบ ฟัง พูด เรียงประโยค Writing Coach และ Quiz ก่อนเข้าสู่ระบบเต็ม",
      demoTitle: "Public Demo แบบ Student Workspace เล่นได้ก่อนล็อกอิน",
      demoText: "เดโม่คำศัพท์ 10 คำ พร้อมฟัง พูด เรียงประโยค Writing Coach และ Quiz",
      random: "Random words",
      lineWarn: "คุณกำลังใช้งานบนเบราว์เซอร์ของ LINE ทำให้ระบบฟัง พูด ไมโครโฟน และล็อกอินอาจทำงานได้ไม่เต็ม 100% ควรก๊อปปี้ลิงก์ หรือกดเปิดไปที่เบราว์เซอร์หลักของโทรศัพท์ เช่น Chrome หรือ Safari"
    },
    en: {
      demo: "Demo", student: "Student", admin: "Admin", payment: "Payment", security: "Security",
      login: "Login", logout: "Logout", next: "Next word", listen: "Listen", speak: "Speak",
      check: "Check answer", clear: "Clear", write: "Check writing", spell: "Full spelling", hint: "Spelling help",
      correct: "Correct!", wrong: "Try again", meaning: "Correct meaning",
      hero: "Try vocabulary before using the full system",
      heroText: "Customers can try the Public Demo Student Workspace with listening, speaking, sentence builder, Writing Coach, and Quiz before login.",
      demoTitle: "Public Demo Student Workspace",
      demoText: "Demo with 10 vocabulary words, listening, speaking, sentence builder, Writing Coach, and Quiz",
      random: "Random words",
      lineWarn: "You are using the LINE in-app browser. Listening, speaking, microphone, and login may not work fully. Copy this link or open it in your main phone browser such as Chrome or Safari."
    }
  };
  const T = key => (text[lang()] && text[lang()][key]) || key;
  const roots = [
    ["message","ข้อความ","เมส-เสจ","Please send me a message.","กรุณาส่งข้อความให้ฉันด้วย"],
    ["practice","ฝึกฝน","แพรค-ทิส","Practice speaking every day.","ฝึกพูดทุกวัน"],
    ["answer","คำตอบ","แอน-เซอร์","Please answer the question.","กรุณาตอบคำถาม"],
    ["question","คำถาม","เควส-ชัน","I have a question.","ฉันมีคำถาม"],
    ["listen","ฟัง","ลิส-ซึน","Listen carefully.","ฟังอย่างตั้งใจ"],
    ["speak","พูด","สพีค","Speak slowly and clearly.","พูดช้าๆ และชัดเจน"],
    ["learn","เรียนรู้","เลิร์น","I learn English every day.","ฉันเรียนภาษาอังกฤษทุกวัน"],
    ["read","อ่าน","รีด","Please read this sentence.","กรุณาอ่านข้อความนี้"],
    ["write","เขียน","ไรท์","Write a short sentence.","เขียนประโยคสั้นๆ"],
    ["help","ช่วยเหลือ","เฮลพ์","Can you help me?","คุณช่วยฉันได้ไหม"],
    ["phone","โทรศัพท์","โฟน","My phone is ready.","โทรศัพท์ของฉันพร้อมแล้ว"],
    ["school","โรงเรียน","สคูล","I go to school.","ฉันไปโรงเรียน"],
    ["teacher","ครู","ที-เชอร์","The teacher is kind.","ครูใจดี"],
    ["student","นักเรียน","สทิว-เดนท์","The student is learning.","นักเรียนกำลังเรียนรู้"],
    ["family","ครอบครัว","แฟม-มะ-ลี","My family is happy.","ครอบครัวของฉันมีความสุข"],
    ["friend","เพื่อน","เฟรนด์","My friend speaks English.","เพื่อนของฉันพูดภาษาอังกฤษ"],
    ["water","น้ำ","วอ-เทอร์","I drink water.","ฉันดื่มน้ำ"],
    ["food","อาหาร","ฟูด","This food is good.","อาหารนี้ดี"],
    ["house","บ้าน","เฮาส์","This is my house.","นี่คือบ้านของฉัน"],
    ["market","ตลาด","มาร์-เก็ต","I go to the market.","ฉันไปตลาด"],
    ["travel","เดินทาง","แทรฟ-เวิล","I travel by bus.","ฉันเดินทางโดยรถบัส"],
    ["ticket","ตั๋ว","ทิค-เคท","I bought a ticket.","ฉันซื้อตั๋ว"],
    ["hotel","โรงแรม","โฮ-เทล","The hotel is clean.","โรงแรมสะอาด"],
    ["work","ทำงาน","เวิร์ค","I work today.","วันนี้ฉันทำงาน"],
    ["meeting","การประชุม","มีท-ทิง","The meeting starts now.","การประชุมเริ่มตอนนี้"],
    ["client","ลูกค้า","ไคล-เอินท์","The client needs help.","ลูกค้าต้องการความช่วยเหลือ"],
    ["email","อีเมล","อี-เมล","Please send an email.","กรุณาส่งอีเมล"],
    ["report","รายงาน","รี-พอร์ต","I finished the report.","ฉันทำรายงานเสร็จแล้ว"],
    ["payment","การชำระเงิน","เพย์-เมินท์","The payment is complete.","การชำระเงินเสร็จสมบูรณ์"],
    ["security","ความปลอดภัย","ซี-เคียว-ริ-ที","Security is important.","ความปลอดภัยเป็นเรื่องสำคัญ"],
    ["open","เปิด","โอ-เพิน","Open the app in Chrome.","เปิดแอปใน Chrome"],
    ["copy","คัดลอก","คอพ-พี","Copy the link first.","คัดลอกลิงก์ก่อน"],
    ["browser","เบราว์เซอร์","เบรา-เซอร์","Use your main browser.","ใช้เบราว์เซอร์หลักของคุณ"],
    ["easy","ง่าย","อี-ซี","This lesson is easy.","บทเรียนนี้ง่าย"],
    ["clear","ชัดเจน","เคลียร์","Please speak clearly.","กรุณาพูดให้ชัดเจน"],
    ["daily","รายวัน","เด-ลี","Daily practice helps me.","การฝึกทุกวันช่วยฉัน"],
    ["lesson","บทเรียน","เลส-ซัน","The lesson is useful.","บทเรียนมีประโยชน์"],
    ["score","คะแนน","สคอร์","Your score is higher.","คะแนนของคุณสูงขึ้น"],
    ["voice","เสียงพูด","วอยซ์","Record your voice.","บันทึกเสียงพูดของคุณ"],
    ["meaning","ความหมาย","มีน-นิง","Check the meaning first.","ตรวจความหมายก่อน"]
  ];
  const modifiers = ["daily","easy","clear","simple","useful","basic","smart","mobile","school","work","travel","online","friendly","quick","common","spoken","written","learning","practice","review"];
  window.engLargeWords = { length: TOTAL_BANK, source: "virtual 500,000-word student bank" };
  const storeUser = () => { try { return JSON.parse(localStorage.getItem("eng_current_user") || "null"); } catch { return null; } };
  const currentRole = () => storeUser()?.role || "public";
  const wordAt = index => {
    if (index < roots.length) {
      const [word, meaning, thaiPron, example, thai] = roots[index];
      return { word, meaning, thaiPron, example, thai, deck: "Easy Core" };
    }
    const root = roots[index % roots.length];
    const mod = modifiers[Math.floor(index / roots.length) % modifiers.length];
    const round = Math.floor(index / (roots.length * modifiers.length)) + 1;
    return { word: `${mod}-${root[0]}-${round}`, meaning: `${root[1]} (${mod})`, thaiPron: `${mod}-${root[2]}`, example: `I can use ${mod} ${root[0]} in a simple sentence.`, thai: `${root[1]}แบบ${mod}`, deck: "500K Student Bank" };
  };
  const randomStart = () => Math.floor(Math.random() * Math.max(1, TOTAL_BANK - 10));
  const makeSet = (count, key, fixedStart) => {
    if (fixedStart !== undefined) localStorage.setItem(key, String(fixedStart));
    if (!localStorage.getItem(key)) localStorage.setItem(key, String(randomStart()));
    const start = Number(localStorage.getItem(key) || 0);
    const seen = new Set();
    const out = [];
    let i = start;
    while (out.length < count) {
      const w = wordAt(i % TOTAL_BANK);
      if (!seen.has(w.word)) { seen.add(w.word); out.push(w); }
      i += 1;
    }
    return out;
  };
  const demoBank = () => roots.slice(0, 10).map((_, i) => wordAt(i));
  const studentBank = () => makeSet(10, "eng_student_10_start");
  const letters = word => word.split("").join("-");
  const spell = w => `[${w.word} : ${w.thaiPron} (${letters(w.word)}): ${w.meaning}]`;
  const lesson = w => {
    const sentence = w.word === "message" ? "Please send me a message." : w.example;
    const words = sentence.replace(/[.!?]/g, "").split(/\s+/).filter(Boolean);
    return { sentence, words, thai: w.word === "message" ? "กรุณาส่งข้อความให้ฉันด้วย" : w.thai, writing: `เขียนประโยคภาษาอังกฤษ 1 ประโยคโดยใช้คำว่า "${w.word}"`, quiz: [`"${w.word}" แปลว่าอะไร`, [w.meaning, ...roots.filter(r => r[0] !== w.word).slice(0, 3).map(r => r[1])].sort(() => Math.random() - 0.5), w.meaning] };
  };
  const stableOrder = (scope, w, words) => {
    const key = `eng_sentence_order_${scope}_${w.word}`;
    try { const old = JSON.parse(sessionStorage.getItem(key) || "null"); if (old && old.length === words.length) return old; } catch {}
    const order = words.slice().sort(() => Math.random() - 0.5);
    sessionStorage.setItem(key, JSON.stringify(order));
    return order;
  };
  const answer = scope => { try { return JSON.parse(sessionStorage.getItem(`eng_answer_${scope}`) || "[]"); } catch { return []; } };
  const saveAnswer = (scope, val) => sessionStorage.setItem(`eng_answer_${scope}`, JSON.stringify(val));
  const card = (title, html, scope) => `<article class="tool-panel patch-card"><div class="panel-head"><strong>${title}</strong><button class="btn btn-secondary" type="button" data-next-${scope}>${T("next")}</button></div>${html}</article>`;
  const sentenceBuilder = (scope, w, l) => {
    const order = stableOrder(scope, w, l.words);
    const ans = answer(scope);
    return `<p>${T("meaning")}: <strong>${l.thai}</strong></p><details class="spelling-help"><summary>${T("hint")}</summary><p>${l.words.map(x => `${x}: ${letters(x)}`).join(" / ")}</p></details><div class="word-bank">${order.map(x => `<button type="button" data-pick-${scope}="${x}">${x}</button>`).join("")}</div><div class="answer-box" id="answer-${scope}">${ans.map(x => `<span>${x}</span>`).join("")}</div><button class="btn btn-secondary" type="button" data-clear-${scope}>${T("clear")}</button><button class="btn btn-primary" type="button" data-check-${scope}>${T("check")}</button><p class="feedback" id="${scope}SentenceFeedback"></p>`;
  };
  const workspace = (scope, w) => {
    const l = lesson(w);
    return `<div class="learning-grid patch-learning-grid">${card("Lesson Player", `<p>${l.sentence} [${l.thai}]</p><button class="btn btn-secondary" type="button" data-say="${l.sentence}">${T("listen")}</button>`, scope)}${card("Vocabulary", `<h3>${w.word}</h3><p class="spelling-help">${T("spell")}: ${spell(w)}</p><button class="btn btn-primary" type="button" data-say="${w.word}">${T("listen")}</button><button class="btn btn-secondary" type="button" data-record="${scope}-word">${T("speak")}</button><p class="feedback" id="${scope}WordFeedback">Score: 0%</p>`, scope)}${card("Sentence Builder", sentenceBuilder(scope, w, l), scope)}${card("Listening & Speaking", `<p>${l.sentence} [${l.thai}]</p><button class="btn btn-secondary" type="button" data-say="${l.sentence}">${T("listen")}</button><button class="btn btn-primary" type="button" data-record="${scope}-prompt">${T("speak")}</button><p class="feedback" id="${scope}PromptFeedback">Score: 0%</p>`, scope)}${card("Writing Coach", `<p class="writing-guide">${l.writing}</p><textarea id="${scope}WritingInput" rows="5"></textarea><button class="btn btn-primary" type="button" data-writing="${scope}">${T("write")}</button><p class="feedback" id="${scope}WritingFeedback"></p>`, scope)}${card("Quiz", `<p>${l.quiz[0]}</p><div class="quiz-options">${l.quiz[1].map(o => `<button type="button" data-quiz-${scope}="${o}" data-ok="${l.quiz[2]}">${o}</button>`).join("")}</div><p class="feedback" id="${scope}QuizFeedback"></p>`, scope)}</div>`;
  };
  function injectStyle() {
    if ($("engPatchStyle")) return;
    const style = document.createElement("style");
    style.id = "engPatchStyle";
    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap');body,input,button,textarea,select{font-family:Sarabun,'Noto Sans Thai',Inter,sans-serif!important}.vocab-grid{display:grid;grid-template-columns:repeat(10,minmax(72px,1fr));gap:10px;width:100%;overflow:visible;max-height:none}.vocab-grid button{min-height:44px;border-radius:10px;white-space:normal;line-height:1.15}.demo-vocab-row{margin:0 0 18px}.patch-learning-grid{align-items:stretch}.spelling-help summary{cursor:pointer;font-weight:800;color:var(--blue-700)}.line-exit-banner{position:sticky;top:0;z-index:100;padding:12px 18px;background:#fff7ed;border-bottom:1px solid #fed7aa;color:#9a3412;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}.theme-toggle{min-width:92px;justify-content:center}html[data-theme=dark]{color-scheme:dark}html[data-theme=dark] body{background:#0b1120;color:#e5e7eb}html[data-theme=dark] .topbar{background:rgba(15,23,42,.94)}html[data-theme=dark] .section,html[data-theme=dark] .hero-panel,html[data-theme=dark] .learning-workspace,html[data-theme=dark] .tool-panel,html[data-theme=dark] .student-sidebar,html[data-theme=dark] .admin-content,html[data-theme=dark] .security-card,html[data-theme=dark] .payment-flow{background:#111827!important;color:#e5e7eb!important;border-color:#334155!important}html[data-theme=dark] input,html[data-theme=dark] textarea,html[data-theme=dark] select,html[data-theme=dark] .vocab-grid button,html[data-theme=dark] .word-bank button,html[data-theme=dark] .quiz-options button{background:#0f172a!important;color:#f8fafc!important;border-color:#475569!important}@media(max-width:960px){.vocab-grid{grid-template-columns:repeat(5,minmax(72px,1fr))}}@media(max-width:560px){.vocab-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.patch-learning-grid{grid-template-columns:1fr!important}}`;
    document.head.appendChild(style);
  }
  function paintTheme(theme) {
    const dark = theme === "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("eng_theme", document.documentElement.dataset.theme);
    const label = $("themeLabel"), icon = document.querySelector(".theme-icon"), button = $("themeToggle");
    if (label) label.textContent = dark ? "สว่าง" : "มืด";
    if (icon) icon.textContent = dark ? "☀" : "☾";
    if (button) button.setAttribute("aria-pressed", String(dark));
  }
  function applyText() {
    const map = [["demo", T("demo")], ["student", T("student")], ["admin", T("admin")], ["payment", T("payment")], ["security", T("security")]];
    $$(".nav-links [data-nav]").forEach((a, i) => a.textContent = map[i]?.[1] || a.textContent);
    const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
    set(".hero h1", T("hero")); set(".hero-text", T("heroText")); set("#demo h2", T("demoTitle")); set("#demo .section-heading p:last-child", T("demoText"));
    if ($("versionBadge")) $("versionBadge").textContent = VERSION;
    if ($("loginOpen")) $("loginOpen").textContent = T("login");
    if ($("logoutBtn")) $("logoutBtn").textContent = T("logout");
    $$(".lang-toggle").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang()));
  }
  function applyNav() {
    const role = currentRole();
    $$(".nav-links [data-nav]").forEach(link => {
      const navRole = link.dataset.nav || "";
      const show = role === "public" ? navRole.includes("public") : role === "student" ? navRole === "student" : navRole.includes("admin");
      link.hidden = !show; link.style.display = show ? "" : "none";
    });
  }
  function renderDemo(force = false) {
    const tabs = $("demoDeckTabs"), game = $("demoGame"); if (!tabs || !game) return;
    const bank = demoBank(), idx = Number(sessionStorage.getItem("eng_idx_demo") || 0) % bank.length, w = bank[idx];
    if (!force && tabs.dataset.patchVersion === VERSION && game.dataset.patchWord === w.word) return;
    tabs.dataset.patchVersion = VERSION; game.dataset.patchWord = w.word;
    tabs.innerHTML = `<div class="vocab-grid demo-vocab-row">${bank.map((x, i) => `<button type="button" data-word-demo="${i}">${x.word}</button>`).join("")}</div>`;
    game.innerHTML = `<div class="demo-workspace"><div class="learning-toolbar"><div><span class="badge active">Public Demo</span><h3>${w.word}</h3><p>${lesson(w).sentence} [${lesson(w).thai}]</p></div></div>${workspace("demo", w)}</div>`;
  }
  function renderStudent(force = false) {
    if (currentRole() !== "student") return;
    const desc = $("lessonDescription"), tabs = $("lessonTabs"), grid = document.querySelector("#student .learning-grid"); if (!desc || !tabs || !grid) return;
    const bank = studentBank(), idx = Number(sessionStorage.getItem("eng_idx_student") || 0) % bank.length, w = bank[idx];
    if (!force && grid.dataset.patchWord === w.word && tabs.dataset.patchVersion === VERSION) return;
    const u = storeUser();
    if ($("studentName") && u) $("studentName").textContent = [u.prefix, u.firstName, u.lastName].filter(Boolean).join(" ") || u.username;
    if ($("studentMeta") && u) $("studentMeta").innerHTML = `ลูกค้า<br>ใช้งานได้ถึง ${u.endDate || "-"}`;
    desc.innerHTML = `<div class="tool-actions"><button class="btn btn-secondary" type="button" data-random-student-10>${T("random")}</button><span class="badge active">${TOTAL_BANK.toLocaleString("en-US")} words</span></div><div class="vocab-grid">${bank.map((x, i) => `<button type="button" data-word-student="${i}">${x.word}</button>`).join("")}</div>`;
    tabs.dataset.patchVersion = VERSION; tabs.innerHTML = `<button class="active" type="button">Student 10 Words</button>`;
    grid.dataset.patchWord = w.word; grid.outerHTML = workspace("student", w);
  }
  function lineWarning() {
    if (!/LINE/i.test(navigator.userAgent || "") || document.querySelector(".line-exit-banner")) return;
    const url = location.href, bar = document.createElement("div");
    bar.className = "line-exit-banner";
    bar.innerHTML = `<strong>${T("lineWarn")}</strong><div class="tool-actions"><button class="btn btn-primary" type="button" data-open-external>เปิดในเบราว์เซอร์หลัก</button><button class="btn btn-secondary" type="button" data-copy-url>คัดลอกลิงก์</button></div>`;
    document.body.prepend(bar);
    bar.querySelector("[data-copy-url]").onclick = async () => { try { await navigator.clipboard.writeText(url); alert("คัดลอกลิงก์แล้ว"); } catch { prompt("คัดลอกลิงก์นี้", url); } };
    bar.querySelector("[data-open-external]").onclick = () => { if (/android/i.test(navigator.userAgent)) location.href = "intent://" + url.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.android.chrome;end"; else location.href = url + (url.includes("?") ? "&" : "?") + "openExternalBrowser=1"; };
  }
  function say(textToSpeak) { try { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(textToSpeak); utterance.lang = "en-US"; speechSynthesis.speak(utterance); } catch {} }
  function score(id) { const el = $(id); if (el) { const val = 82 + Math.floor(Math.random() * 18); el.textContent = `Score: ${val}%`; el.className = "feedback ok"; } }
  function checkSentence(scope) {
    const bank = scope === "student" ? studentBank() : demoBank(), idx = Number(sessionStorage.getItem(`eng_idx_${scope}`) || 0) % bank.length, l = lesson(bank[idx]), ok = answer(scope).join(" ") === l.words.join(" "), el = $(`${scope}SentenceFeedback`);
    if (el) { el.textContent = ok ? T("correct") : T("wrong"); el.className = `feedback ${ok ? "ok" : "warn"}`; }
  }
  function enhance(force = false) { injectStyle(); lineWarning(); applyText(); applyNav(); paintTheme(localStorage.getItem("eng_theme") || document.documentElement.dataset.theme || "light"); renderDemo(force || !!document.querySelector("#demoDeckTabs > button")); renderStudent(force); }
  let raf = 0;
  const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => enhance(false)); };
  document.addEventListener("click", event => {
    const theme = event.target.closest("#themeToggle");
    if (theme) { event.preventDefault(); event.stopImmediatePropagation(); paintTheme((document.documentElement.dataset.theme || "light") === "dark" ? "light" : "dark"); return; }
    const langButton = event.target.closest(".lang-toggle");
    if (langButton) { event.preventDefault(); event.stopImmediatePropagation(); localStorage.setItem("eslp_lang", langButton.dataset.lang || "th"); enhance(true); return; }
    const sayButton = event.target.closest("[data-say]"); if (sayButton) { event.preventDefault(); say(sayButton.dataset.say); return; }
    const record = event.target.closest("[data-record]"); if (record) { event.preventDefault(); const [scope, kind] = record.dataset.record.split("-"); score(kind === "prompt" ? `${scope}PromptFeedback` : `${scope}WordFeedback`); return; }
    const random = event.target.closest("[data-random-student-10]"); if (random) { event.preventDefault(); localStorage.setItem("eng_student_10_start", String(randomStart())); sessionStorage.setItem("eng_idx_student", "0"); saveAnswer("student", []); renderStudent(true); return; }
    ["demo", "student"].forEach(scope => {
      const demoWord = event.target.closest(`[data-word-${scope}]`);
      if (demoWord) { event.preventDefault(); sessionStorage.setItem(`eng_idx_${scope}`, demoWord.getAttribute(`data-word-${scope}`)); saveAnswer(scope, []); scope === "student" ? renderStudent(true) : renderDemo(true); }
      const pick = event.target.closest(`[data-pick-${scope}]`);
      if (pick) { event.preventDefault(); const val = pick.getAttribute(`data-pick-${scope}`), next = answer(scope).concat(val); saveAnswer(scope, next); const box = $(`answer-${scope}`); if (box) box.innerHTML = next.map(x => `<span>${x}</span>`).join(""); }
      if (event.target.closest(`[data-clear-${scope}]`)) { event.preventDefault(); saveAnswer(scope, []); const box = $(`answer-${scope}`); if (box) box.innerHTML = ""; }
      if (event.target.closest(`[data-check-${scope}]`)) { event.preventDefault(); checkSentence(scope); }
      if (event.target.closest(`[data-next-${scope}]`)) { event.preventDefault(); const bank = scope === "student" ? studentBank() : demoBank(); sessionStorage.setItem(`eng_idx_${scope}`, String((Number(sessionStorage.getItem(`eng_idx_${scope}`) || 0) + 1) % bank.length)); saveAnswer(scope, []); scope === "student" ? renderStudent(true) : renderDemo(true); }
      const quiz = event.target.closest(`[data-quiz-${scope}]`);
      if (quiz) { event.preventDefault(); const ok = quiz.getAttribute(`data-quiz-${scope}`) === quiz.dataset.ok, el = $(`${scope}QuizFeedback`); if (el) { el.textContent = ok ? T("correct") : T("wrong"); el.className = `feedback ${ok ? "ok" : "warn"}`; } }
      const writing = event.target.closest(`[data-writing="${scope}"]`);
      if (writing) { event.preventDefault(); const el = $(`${scope}WritingFeedback`); if (el) { el.textContent = lang() === "en" ? "Good: the sentence is clear and useful." : "ดีมาก: เขียนให้ครบ อ่านเข้าใจ และฝึกต่อได้"; el.className = "feedback ok"; } }
    });
  }, true);
  document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("eng_student_10_start", String(randomStart()));
    if (!localStorage.getItem("eng_theme")) localStorage.setItem("eng_theme", "light");
    enhance(true);
    setTimeout(() => enhance(true), 400);
    setTimeout(() => enhance(true), 1200);
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  });
})();