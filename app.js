// ====== CONFIG ======
const SUBMIT_ENDPOINT = "https://opd-osf-submit.golubmoskva.workers.dev/submit";
// ====================

const steps = Array.from(document.querySelectorAll(".step"));
const form = document.getElementById("surveyForm");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

const stepTitle = document.getElementById("stepTitle");
const progressBar = document.getElementById("progressBar");

const submitError = document.getElementById("submitError");
const submitOk = document.getElementById("submitOk");

let currentStep = 0;

// ---------- Questions data ----------
const m1Scale = [
  { value: 0, label: "Полностью не согласен" },
  { value: 1, label: "Скорее не согласен" },
  { value: 2, label: "Ни согласен, ни не согласен" },
  { value: 3, label: "Скорее согласен" },
  { value: 4, label: "Полностью согласен" },
];

const m1Questions = [
  "Иногда мне кажется, что я сам(а) себе чужой(ая).",
  "Если я слишком много думаю о себе, я начинаю запутываться.",
  "Опасно подпускать других слишком близко к себе.",
  "Мне трудно добиться понимания от окружающих.",
  "Внутри меня часто такой хаос чувств, что я даже не могу его описать.",
  "Иногда я неверно оцениваю, как мое поведение влияет на других.",
  "Если другие знают обо мне слишком много, я часто чувствую, будто меня контролируют или за мной наблюдают.",
  "Иногда мои чувства настолько сильны, что мне становится страшно.",
  "Моя ошибка в оценке человека обернулась для меня болезненными последствиями.",
  "Мне трудно устанавливать контакт с другими людьми.",
  "У меня невысокая самооценка.",
  "Мой опыт таков: если слишком доверять людям, можно получить неожиданные неприятности.",
];

const m2Scale = [
  { value: 1, label: "Утверждение совсем не описывает меня" },
  { value: 2, label: "Утверждение едва описывает меня" },
  { value: 3, label: "Утверждение умеренно описывает меня" },
  { value: 4, label: "Утверждение во многом описывает меня" },
  { value: 5, label: "Утверждение полностью описывает меня" },
];

const m2Questions = [
  "Я способен выносить большинство своих эмоций и хорошо управлять ими.",
  "На моей самооценке сильно сказываются мои неудачи или разочарования.",
  "Я чувствую глубокую пустоту внутри себя.",
  "Я склонен путать свои эмоции с эмоциями других людей.",
  "Я запутался в том, кто я есть на самом деле.",
  "Я узнаю себя в том, как меня описывают другие.",
  "Мне часто кажется, что моя жизнь не имеет смысла.",
  "Я ставлю перед собой разумные цели и предпринимаю реальные меры для их достижения.",
  "Иногда я не понимаю, почему я вел себя определенным образом или почему принял некоторые решения.",
  "В своих действиях и решениях я руководствуюсь своими неотложными потребностями, невзирая на всё остальное.",
  "Я часто меняю свои планы и жизненные цели.",
  "Мои действия и мои решения соответствуют моим ценностям и убеждениям.",
  "Люди часто негативно реагируют на мои слова или мои действия, и я не до конца понимаю, почему.",
  "Люди критикуют меня за то, что я нечуток к другим.",
  "Я часто нахожусь в замешательстве, почему люди ведут себя по отношению ко мне определенным образом.",
  "Меня мало интересуют чувства или проблемы других людей.",
  "Во время беседы мне любопытно и интересно узнать точку зрения других людей.",
  "Когда кто-то думает не так, как я, или возражает мне, я склонен реагировать негативно или гневно, даже если этот человек вел себя уважительно.",
  "У меня много межличностных отношений, которые приносят удовлетворение мне и другому человеку.",
  "Как правило, мои дружеские или любовные отношения длятся не очень долго.",
  "Если я нахожусь в отношениях с другими людьми, то это в первую очередь потому, что я хочу, чтобы они удовлетворяли некоторые из моих потребностей.",
  "На самом деле я не испытываю желания или интереса, чтобы поддерживать взаимоотношения с другими людьми.",
  "Я не доверяю другим и предпочитаю держаться с ними на некотором расстоянии, чтобы избежать от них вреда.",
  "В моей жизни есть много людей, с которыми я близок и поддерживаю отношения, основанные на уважении, привязанности и взаимной поддержке.",
];

const m3Scale = [
  { value: 1, label: "Совершенно не согласен" },
  { value: 2, label: "Немного не согласен" },
  { value: 3, label: "Нейтрально, нет мнения" },
  { value: 4, label: "Немного согласен" },
  { value: 5, label: "Совершенно согласен" },
];

const m3Questions = [
  "Я – человек, который... склонный быть молчаливым.",
  "…сопереживающий и добросердечный.",
  "…склонный быть неорганизованным.",
  "…часто волнующийся, обо всем переживающий.",
  "…увлеченный живописью, музыкой или литературой.",
  "…доминирующий, ведущий себя по-лидерски.",
  "…порой бывающий грубым с окружающими.",
  "…с трудом приступающий к работе.",
  "…склонный к печали, депрессии.",
  "…мало интересующийся абстрактными идеями.",
  "…полный энергии.",
  "…склонный видеть в других людях только хорошее.",
  "…надежный, на меня всегда можно рассчитывать.",
  "…эмоционально стабильный, которого нелегко вывести из себя.",
  "…генерирующий новые идеи, оригинально мыслящий.",
];

// ---------- Render questions ----------
function renderQuestions(containerId, prefix, questions, scale) {
  const root = document.getElementById(containerId);
  if (!root) return;

  root.innerHTML = "";
  questions.forEach((qText, idx) => {
    const qNum = idx + 1;
    const name = `${prefix}_${qNum}`;

    const card = document.createElement("div");
    card.className = "q";

    const t = document.createElement("div");
    t.className = "qtext";
    t.textContent = `${qNum}. ${qText}`;

    const opts = document.createElement("div");
    opts.className = "opts";

    scale.forEach((opt) => {
      const lab = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = String(opt.value);
      input.required = true;
      lab.appendChild(input);
      lab.appendChild(document.createTextNode(" " + opt.label));
      opts.appendChild(lab);
    });

    card.appendChild(t);
    card.appendChild(opts);
    root.appendChild(card);
  });
}

renderQuestions("m1Questions", "m1", m1Questions, m1Scale);
renderQuestions("m2Questions", "m2", m2Questions, m2Scale);
renderQuestions("m3Questions", "m3", m3Questions, m3Scale);

// ---------- Validation + steps ----------
function isOptionalStep(stepIndex) {
  return stepIndex === 2; // доходы/трудоустройство
}

function validateAgeStrict() {
  const ageEl = form?.elements?.["age"];
  if (!ageEl) return true;
  const v = String(ageEl.value || "").trim();
  return /^\d{1,2}$/.test(v);
}

function validateCurrentStep(showMessages = false) {
  if (isOptionalStep(currentStep)) return true;

  const stepEl = steps[currentStep];
  const inputs = Array.from(stepEl.querySelectorAll("input"));

  for (const inp of inputs) {
    if (!inp.checkValidity()) {
      if (showMessages) inp.reportValidity();
      return false;
    }
  }

  if (currentStep === 1 && !validateAgeStrict()) {
    if (showMessages) alert("Возраст должен быть числом (1–2 цифры).");
    return false;
  }

  return true;
}

function updateNextButtonState() {
  if (!nextBtn) return;

  if (isOptionalStep(currentStep)) {
    nextBtn.disabled = false;
    return;
  }

  const ok = validateCurrentStep(false);
  nextBtn.disabled = !ok;

  // диагностика: можно убрать потом
  console.log("step", currentStep, "valid =", ok, {
    gender: form?.elements?.["gender"]?.value,
    age: form?.elements?.["age"]?.value,
    dx: form?.elements?.["dx"]?.value,
    ageValid: validateAgeStrict(),
  });
}

function showStep(n) {
  steps.forEach((s, i) => (s.hidden = i !== n));
  currentStep = n;

  if (prevBtn) prevBtn.hidden = n === 0;
  if (nextBtn) nextBtn.hidden = n === steps.length - 1;
  if (submitBtn) submitBtn.hidden = n !== steps.length - 1;

  if (stepTitle) stepTitle.textContent = `Страница ${n + 1} из ${steps.length}`;
  if (progressBar) progressBar.style.width = `${(n / (steps.length - 1)) * 100}%`;

  if (submitError) submitError.hidden = true;
  if (submitOk) submitOk.hidden = true;

  updateNextButtonState();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ВАЖНО: change для radio
form.addEventListener("input", updateNextButtonState);
form.addEventListener("change", updateNextButtonState);

prevBtn.addEventListener("click", () => showStep(Math.max(0, currentStep - 1)));
nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep(true)) return;
  showStep(Math.min(steps.length - 1, currentStep + 1));
});

// ---------- Submit ----------
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function extractScale(prefix, n) {
  const out = {};
  for (let i = 1; i <= n; i++) {
    out[`${prefix}_${i}`] = Number(form.elements[`${prefix}_${i}`].value);
  }
  return out;
}

function getRadioValue(name) {
  const el = form?.elements?.[name];
  if (!el) return null;
  return el.value === "" ? null : el.value;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateCurrentStep(true)) return;

  const respondent_id = uuidv4();

  const payload = {
    respondent_id,
    submitted_at: new Date().toISOString(),
    consent: {
      age18: !!form.elements["age18"]?.checked,
      pdn: !!form.elements["consent"]?.checked,
    },
    demographics: {
      gender: getRadioValue("gender"),
      age: Number(String(form.elements["age"]?.value || "").trim()),
      dx: getRadioValue("dx"),
    },
    socioeconomic: {
      employed: getRadioValue("employed"),
      income_personal: getRadioValue("income_personal"),
      income_family: getRadioValue("income_family"),
    },
    responses: {
      m1: extractScale("m1", m1Questions.length),
      m2: extractScale("m2", m2Questions.length),
      m3: extractScale("m3", m3Questions.length),
    },
  };

  try {
    submitBtn.disabled = true;

    const res = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ошибка отправки: ${res.status} ${text}`);
    }

    submitOk.hidden = false;
  } catch (err) {
    submitError.textContent = err?.message || String(err);
    submitError.hidden = false;
    submitBtn.disabled = false;
  }
});

// start
showStep(0);
