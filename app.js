const state = {
  lang: localStorage.getItem("eslp_lang") || "th",
  role: localStorage.getItem("eslp_role") || "public",
};

const dictionary = {
  th: {
    navDemo: "ทดลองเรียน",
    navStudent: "ผู้เรียน",
    navAdmin: "แอดมิน",
    navPayment: "ชำระเงิน",
    navSecurity: "ความปลอดภัย",
    login: "เข้าสู่ระบบ",
    rolePublic: "หน้าแรก",
    roleStudent: "ผู้เรียน",
    roleAdmin: "แอดมิน",
    heroEyebrow: "Production-ready bilingual learning system",
    heroTitle: "ระบบเรียนภาษาอังกฤษครบวงจร พร้อมชำระเงิน แอดมิน และจับเวลาเรียนจริง",
    heroText: "ออกแบบสำหรับผู้เริ่มต้นจนถึงระดับใช้งานจริง รองรับภาษาไทยและอังกฤษ พร้อมโมดูลเรียนครบ 4 ทักษะ ระบบสิทธิ์ ระบบแจ้งเตือน และ Security Audit Trail",
    startLearning: "เริ่มเรียน",
    viewAdmin: "ดูระบบแอดมิน",
    todayMission: "ภารกิจวันนี้",
    remainingHours: "ชั่วโมงคงเหลือ",
    studyStreak: "เรียนต่อเนื่อง",
    quizScore: "คะแนนล่าสุด",
    sampleLesson: "Speaking: Ordering Coffee",
    sampleLessonMeta: "ฝึกพูดพร้อม Speech Recognition และ AI Coach",
    modulesEyebrow: "Learning Modules",
    modulesTitle: "บทเรียนครบ 4 ทักษะ พร้อมคำศัพท์ ประโยค และแบบทดสอบ",
    studentEyebrow: "Student Workspace",
    studentTitle: "Dashboard ผู้เรียนที่รู้สิทธิ์ เวลาเรียน และความคืบหน้าทันที",
    studentText: "ผู้เรียนเห็นระดับปัจจุบัน ชั่วโมงคงเหลือ วันหมดอายุ ประวัติการเรียน คะแนน และรายการชำระเงิน พร้อมเรียนต่อจากจุดเดิมได้ทันที",
    adminEyebrow: "Admin Management",
    adminTitle: "หลังบ้านสำหรับจัดการผู้ใช้ คอนเทนต์ สิทธิ์ และรายงาน",
    userManagement: "User Management",
    createUser: "สร้าง User",
    vocabularyDatabase: "ฐานข้อมูลคำศัพท์",
    importVocabulary: "นำเข้าคำศัพท์",
    importQueue: "คิวตรวจคำศัพท์",
    adminReviewRequired: "รอแอดมินตรวจ",
    word: "คำศัพท์",
    partOfSpeech: "ชนิดคำ",
    level: "Level",
    meaningThai: "ความหมายไทย",
    source: "แหล่งข้อมูล",
    name: "ชื่อ",
    role: "สิทธิ์",
    expiry: "หมดอายุ",
    hours: "ชั่วโมง",
    status: "สถานะ",
    paymentEyebrow: "Payment Automation",
    paymentTitle: "Provider Adapter รองรับ PromptPay, Omise, Stripe และ Manual Transfer",
    paymentText: "ทุก order ตรวจ amount, currency, signature และ idempotency ก่อนเติมชั่วโมงหรือต่ออายุ ป้องกันการเติมซ้ำและไม่เชื่อข้อมูลจาก frontend โดยตรง",
    securityEyebrow: "Security & Logs",
    securityTitle: "RBAC, Audit Trail, Login Lockout และ Suspicious Activity",
    productionEyebrow: "Production Checklist",
    productionTitle: "พร้อมต่อยอดเป็น Next.js/Node.js + PostgreSQL หรือ Google Sheets MVP",
    footerText: "รองรับสองภาษา ระบบชำระเงิน แอดมิน จับเวลาเรียน และความปลอดภัย",
  },
  en: {
    navDemo: "Demo",
    navStudent: "Student",
    navAdmin: "Admin",
    navPayment: "Payment",
    navSecurity: "Security",
    login: "Log in",
    rolePublic: "Home",
    roleStudent: "Student",
    roleAdmin: "Admin",
    heroEyebrow: "Production-ready bilingual learning system",
    heroTitle: "A complete English learning platform with payments, admin tools, and real study-time tracking",
    heroText: "Designed for absolute beginners through practical users, with Thai and English UI, four-skill learning modules, access control, notifications, and security audit trails.",
    startLearning: "Start learning",
    viewAdmin: "View admin",
    todayMission: "Today's mission",
    remainingHours: "Remaining hours",
    studyStreak: "Study streak",
    quizScore: "Latest score",
    sampleLesson: "Speaking: Ordering Coffee",
    sampleLessonMeta: "Practice with Speech Recognition and AI Coach",
    modulesEyebrow: "Learning Modules",
    modulesTitle: "Four-skill lessons with vocabulary, sentence building, and quizzes",
    studentEyebrow: "Student Workspace",
    studentTitle: "A student dashboard that shows access, study time, and progress immediately",
    studentText: "Students can see their current level, remaining hours, expiry date, learning history, scores, and payments, then resume from the exact next activity.",
    adminEyebrow: "Admin Management",
    adminTitle: "Back office for users, content, access control, and reporting",
    userManagement: "User Management",
    createUser: "Create User",
    vocabularyDatabase: "Vocabulary Database",
    importVocabulary: "Import Vocabulary",
    importQueue: "Import Queue",
    adminReviewRequired: "Admin review required",
    word: "Word",
    partOfSpeech: "Part of speech",
    level: "Level",
    meaningThai: "Thai meaning",
    source: "Source",
    name: "Name",
    role: "Role",
    expiry: "Expiry",
    hours: "Hours",
    status: "Status",
    paymentEyebrow: "Payment Automation",
    paymentTitle: "Provider Adapter for PromptPay, Omise, Stripe, and Manual Transfer",
    paymentText: "Every order validates amount, currency, signature, and idempotency before adding hours or extending expiry. The server never trusts direct frontend payment claims.",
    securityEyebrow: "Security & Logs",
    securityTitle: "RBAC, Audit Trail, Login Lockout, and Suspicious Activity",
    productionEyebrow: "Production Checklist",
    productionTitle: "Ready to extend into Next.js/Node.js plus PostgreSQL or Google Sheets MVP",
    footerText: "Bilingual UI, payments, admin, study timer, and security are all included.",
  },
};

const content = {
  th: {
    modules: [
      ["ฟัง", "เสียงอ่าน, Dictation, ฟังจับใจความ และบันทึกคะแนน"],
      ["พูด", "ไมโครโฟน, Speech Recognition, pronunciation score"],
      ["อ่าน", "บทอ่านตาม Level พร้อมเปิด/ปิดคำแปลไทย"],
      ["เขียน", "Writing prompt, rubric และ AI Coach feedback"],
      ["คำศัพท์", "ชนิดของคำ ตัวอย่างประโยค เสียงอ่าน และ spaced repetition"],
      ["สร้างประโยค", "ฝึกเรียงคำ วิเคราะห์ grammar และดูเฉลยทีละขั้น"],
      ["แบบทดสอบ", "Quiz, placement test, level-up rules และคะแนนย้อนหลัง"],
      ["AI Coach", "ช่วยอธิบายภาษาไทย/อังกฤษตามโหมดผู้เรียน"],
    ],
    workflow: [
      ["Login + Access Check", "ตรวจช่วงเวลา login, สถานะหมดอายุ, role และ block status"],
      ["Study Timer", "จับเวลาเฉพาะตอนเรียนจริง หยุดเมื่อ inactive และบันทึก session"],
      ["Progress Engine", "คำนวณ level จากคะแนน, activity, streak และ learning history"],
      ["Payment Center", "เติมชั่วโมง ต่ออายุ ดู order และประวัติ transaction"],
    ],
    admin: ["Dashboard", "Users", "Lessons", "Vocabulary", "Quizzes", "Payments", "Logs", "Settings"],
    adminKpis: [
      ["Users", "128"],
      ["Vocabulary", "5,240"],
      ["Pending Review", "37"],
      ["Paid Orders", "82"],
    ],
    users: [
      ["ณัฐชา", "student", "2026-06-12", "18.5", "active"],
      ["Michael", "student", "2026-05-26", "3.0", "warning"],
      ["Admin Team", "admin", "ไม่จำกัด", "∞", "active"],
      ["Demo User", "student", "2026-05-21", "0", "blocked"],
    ],
    vocabularyRows: [
      ["account", "noun", "A2", "บัญชี, การอธิบาย", "WordNet + Admin"],
      ["achieve", "verb", "B1", "ทำสำเร็จ, บรรลุผล", "Wiktionary"],
      ["appointment", "noun", "A2", "การนัดหมาย", "Datamuse + Free Dictionary"],
      ["confident", "adjective", "B1", "มั่นใจ", "Wiktionary"],
      ["describe", "verb", "A2", "อธิบาย, บรรยาย", "WordNet"],
    ],
    importQueue: [
      ["restaurant topic", "ดึง candidate จาก Datamuse 120 คำ แล้ว enrich ความหมาย/เสียง"],
      ["Wiktionary 20251020", "รอ parse dump และ map part of speech เข้าฐานข้อมูล"],
      ["Thai explanation draft", "AI สร้างคำอธิบายไทยแล้ว รอแอดมินตรวจ"],
    ],
    payment: [
      ["Create Order", "เลือก plan แล้ว server สร้าง order พร้อม amount/currency จากฐานข้อมูล"],
      ["Provider Adapter", "StripePromptPay, OmisePromptPay, ManualTransfer หรือ provider ใหม่"],
      ["Webhook Verify", "ตรวจ signature, amount, THB currency, order state และ idempotency key"],
      ["Auto Fulfillment", "เติมชั่วโมง ต่ออายุ บันทึก payment log และแจ้งเตือน user/admin"],
    ],
    security: [
      ["แก้ไขชื่อ", "ผู้เรียนแก้ได้เฉพาะชื่อที่แสดงในระบบและภาษาที่ต้องการใช้งาน"],
      ["เปลี่ยนรหัสผ่าน", "ต้องกรอกรหัสผ่านเดิม ตั้งรหัสผ่านใหม่ และระบบบันทึก security log"],
      ["ดูสิทธิ์การใช้งาน", "เห็นวันหมดอายุ ชั่วโมงคงเหลือ และช่วงเวลา login ได้ แต่แก้ไขสิทธิ์เองไม่ได้"],
    ],
    adminSecurity: [
      ["Password Hash", "เก็บเฉพาะ hash ด้วย algorithm ที่ปลอดภัย ห้าม plain text"],
      ["RBAC", "Admin API ตรวจสิทธิ์ทุกครั้ง และ user เห็นเฉพาะข้อมูลตัวเอง"],
      ["Login Lockout", "ผิดเกิน 3 ครั้ง block ชั่วคราว และสร้าง suspicious activity"],
      ["Audit Trail", "บันทึก admin action, access change, payment log และ webhook log"],
      ["Input Validation", "validate ทุก form, sanitize output และป้องกัน script injection"],
      ["Secret Handling", "API key อยู่ฝั่ง server เท่านั้น และไม่ log token/password/OTP"],
      ["Expiry Alert", "แจ้ง admin ก่อนหมดอายุ 10 วัน และแสดงสีตาม 5/1 วัน"],
      ["HTTPS Ready", "deploy ผ่าน HTTPS พร้อม security headers และ rate limiting"],
    ],
    checklist: [
      "Public website", "Login/Register/Forgot password", "Student dashboard", "Admin dashboard",
      "Vocabulary", "Sentence builder", "Listening", "Speaking", "Reading", "Writing", "Quiz",
      "Level-up engine", "Study time tracking", "Access control", "Payment automation",
      "Manual transfer review", "Webhook verification", "Notifications", "Expiry alerts",
      "Security logs", "External import", "AI Coach", "Header/Footer editor", "Responsive UI",
      "Google Sheets template", "Database schema", "API documentation", "Deployment guide",
      "Admin manual", "User manual", "Test cases", "Production checklist",
    ],
  },
  en: {
    modules: [
      ["Listening", "Audio playback, dictation, comprehension, and score history"],
      ["Speaking", "Microphone, Speech Recognition, and pronunciation score"],
      ["Reading", "Level-based passages with Thai translation toggle"],
      ["Writing", "Writing prompts, rubrics, and AI Coach feedback"],
      ["Vocabulary", "Parts of speech, examples, audio, and spaced repetition"],
      ["Sentence Builder", "Word ordering, grammar analysis, and step-by-step answers"],
      ["Quizzes", "Quiz, placement test, level-up rules, and score history"],
      ["AI Coach", "Thai or English explanations based on learner mode"],
    ],
    workflow: [
      ["Login + Access Check", "Validate login window, expiry, role, and block status"],
      ["Study Timer", "Track real learning time only, pause on inactivity, and save sessions"],
      ["Progress Engine", "Calculate level from scores, activities, streak, and history"],
      ["Payment Center", "Buy hours, extend access, view orders, and inspect transactions"],
    ],
    admin: ["Dashboard", "Users", "Lessons", "Vocabulary", "Quizzes", "Payments", "Logs", "Settings"],
    adminKpis: [
      ["Users", "128"],
      ["Vocabulary", "5,240"],
      ["Pending Review", "37"],
      ["Paid Orders", "82"],
    ],
    users: [
      ["Natcha", "student", "2026-06-12", "18.5", "active"],
      ["Michael", "student", "2026-05-26", "3.0", "warning"],
      ["Admin Team", "admin", "Unlimited", "∞", "active"],
      ["Demo User", "student", "2026-05-21", "0", "blocked"],
    ],
    vocabularyRows: [
      ["account", "noun", "A2", "บัญชี, การอธิบาย", "WordNet + Admin"],
      ["achieve", "verb", "B1", "ทำสำเร็จ, บรรลุผล", "Wiktionary"],
      ["appointment", "noun", "A2", "การนัดหมาย", "Datamuse + Free Dictionary"],
      ["confident", "adjective", "B1", "มั่นใจ", "Wiktionary"],
      ["describe", "verb", "A2", "อธิบาย, บรรยาย", "WordNet"],
    ],
    importQueue: [
      ["restaurant topic", "Fetched 120 candidates from Datamuse and enriched definitions/audio"],
      ["Wiktionary 20251020", "Waiting for dump parsing and part-of-speech mapping"],
      ["Thai explanation draft", "AI-generated Thai explanations are waiting for admin review"],
    ],
    payment: [
      ["Create Order", "The server creates the order and derives amount/currency from trusted plan data"],
      ["Provider Adapter", "StripePromptPay, OmisePromptPay, ManualTransfer, or a future provider"],
      ["Webhook Verify", "Verify signature, amount, THB currency, order state, and idempotency key"],
      ["Auto Fulfillment", "Add hours, extend expiry, write logs, and notify users/admins"],
    ],
    security: [
      ["Edit name", "Students can edit only their display name and preferred language."],
      ["Change password", "Students must enter the old password, set a new one, and the system writes a security log."],
      ["View access rights", "Students can see expiry, remaining hours, and login window, but cannot edit their own rights."],
    ],
    adminSecurity: [
      ["Password Hash", "Store only secure password hashes. Plain text passwords are forbidden."],
      ["RBAC", "Every admin API checks permissions; users can only read their own data."],
      ["Login Lockout", "Block temporarily after more than three failed attempts and log suspicious activity."],
      ["Audit Trail", "Record admin actions, access changes, payment events, and webhook logs."],
      ["Input Validation", "Validate every form, sanitize output, and prevent script injection."],
      ["Secret Handling", "API keys stay server-side and logs never contain tokens, passwords, or OTPs."],
      ["Expiry Alert", "Alert admins 10 days before expiry and show 5-day and 1-day warning states."],
      ["HTTPS Ready", "Deploy behind HTTPS with security headers and rate limiting."],
    ],
    checklist: [
      "Public website", "Login/Register/Forgot password", "Student dashboard", "Admin dashboard",
      "Vocabulary", "Sentence builder", "Listening", "Speaking", "Reading", "Writing", "Quiz",
      "Level-up engine", "Study time tracking", "Access control", "Payment automation",
      "Manual transfer review", "Webhook verification", "Notifications", "Expiry alerts",
      "Security logs", "External import", "AI Coach", "Header/Footer editor", "Responsive UI",
      "Google Sheets template", "Database schema", "API documentation", "Deployment guide",
      "Admin manual", "User manual", "Test cases", "Production checklist",
    ],
  },
};

function t(key) {
  return dictionary[state.lang][key] || key;
}

function renderStaticText() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll(".lang-toggle").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  document.querySelectorAll(".role-toggle").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === state.role);
  });
  document.querySelectorAll("[data-nav]").forEach((node) => {
    const roles = node.dataset.nav.split(" ");
    node.hidden = !roles.includes(state.role);
  });
  document.querySelectorAll("[data-section-role]").forEach((node) => {
    const roles = node.dataset.sectionRole.split(" ");
    node.hidden = !roles.includes(state.role);
  });
}

function renderModules() {
  const mount = document.getElementById("learningModules");
  mount.innerHTML = content[state.lang].modules
    .map((item, index) => `
      <article class="module-card">
        <span class="module-icon">${index + 1}</span>
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
      </article>
    `)
    .join("");
}

function renderStudentWorkflow() {
  const mount = document.getElementById("studentWorkflow");
  mount.innerHTML = content[state.lang].workflow
    .map((item, index) => `
      <article class="workflow-item">
        <span class="workflow-number">${index + 1}</span>
        <div>
          <strong>${item[0]}</strong>
          <p>${item[1]}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderAdmin() {
  document.getElementById("adminMenu").innerHTML = content[state.lang].admin
    .map((item) => `<button type="button">${item}</button>`)
    .join("");

  document.getElementById("adminKpis").innerHTML = content[state.lang].adminKpis
    .map((item) => `
      <article class="admin-kpi">
        <span>${item[0]}</span>
        <strong>${item[1]}</strong>
      </article>
    `)
    .join("");

  document.getElementById("userRows").innerHTML = content[state.lang].users
    .map((user) => `
      <tr>
        <td>${user[0]}</td>
        <td>${user[1]}</td>
        <td>${user[2]}</td>
        <td>${user[3]}</td>
        <td><span class="badge ${user[4]}">${user[4]}</span></td>
      </tr>
    `)
    .join("");

  document.getElementById("vocabularyRows").innerHTML = content[state.lang].vocabularyRows
    .map((word) => `
      <tr>
        <td><strong>${word[0]}</strong></td>
        <td>${word[1]}</td>
        <td>${word[2]}</td>
        <td>${word[3]}</td>
        <td>${word[4]}</td>
      </tr>
    `)
    .join("");

  document.getElementById("importQueue").innerHTML = content[state.lang].importQueue
    .map((item, index) => `
      <article class="workflow-item">
        <span class="workflow-number">${index + 1}</span>
        <div>
          <strong>${item[0]}</strong>
          <p>${item[1]}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderPayment() {
  document.getElementById("paymentFlow").innerHTML = content[state.lang].payment
    .map((item, index) => `
      <article class="payment-step">
        <span class="payment-number">${index + 1}</span>
        <div>
          <strong>${item[0]}</strong>
          <p>${item[1]}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderSecurity() {
  const cards = state.role === "admin" ? content[state.lang].adminSecurity : content[state.lang].security;
  document.getElementById("securityCards").innerHTML = cards
    .map((item) => `
      <article class="security-card">
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
      </article>
    `)
    .join("");
}

function renderChecklist() {
  document.getElementById("productionChecklist").innerHTML = content[state.lang].checklist
    .map((item) => `<li>${item}</li>`)
    .join("");
}

function render() {
  renderStaticText();
  renderModules();
  renderStudentWorkflow();
  renderAdmin();
  renderPayment();
  renderSecurity();
  renderChecklist();
}

document.querySelectorAll(".lang-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    state.lang = button.dataset.lang;
    localStorage.setItem("eslp_lang", state.lang);
    render();
  });
});

document.querySelectorAll(".role-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    switchRole(button.dataset.role);
  });
});

document.querySelectorAll("[data-switch-role]").forEach((button) => {
  button.addEventListener("click", () => switchRole(button.dataset.switchRole));
});

function switchRole(role) {
  state.role = role;
  localStorage.setItem("eslp_role", state.role);
  render();
  const target = state.role === "admin" ? "#admin" : state.role === "student" ? "#student" : "#home";
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

render();
