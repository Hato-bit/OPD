// ====== CONFIG ======
const SUBMIT_ENDPOINT = "https://opd-osf-submit.golubmoskva.workers.dev/submit";
// ====================

const form = document.getElementById("surveyForm");
const screenRoot = document.getElementById("screenRoot");

const navRow = document.getElementById("navRow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");

const phq4Scale = [
  { value: 0, label: "Совсем нет" },
  { value: 1, label: "В течение нескольких дней" },
  { value: 2, label: "Более, чем половину этого времени" },
  { value: 3, label: "Почти каждый день" },
];

const m1Scale = [
  { value: 0, label: "Полностью не согласен" },
  { value: 1, label: "Скорее не согласен" },
  { value: 2, label: "Ни согласен, ни не согласен" },
  { value: 3, label: "Скорее согласен" },
  { value: 4, label: "Полностью согласен" },
];

const m2Scale = [
  { value: 0, label: "Утверждение совсем не описывает меня" },
  { value: 1, label: "Утверждение едва описывает меня" },
  { value: 2, label: "Утверждение умеренно описывает меня" },
  { value: 3, label: "Утверждение во многом описывает меня" },
  { value: 4, label: "Утверждение полностью описывает меня" },
];

const m3Scale = [
  { value: 1, label: "Совершенно не согласен" },
  { value: 2, label: "Немного не согласен" },
  { value: 3, label: "Нейтрально, нет мнения" },
  { value: 4, label: "Немного согласен" },
  { value: 5, label: "Совершенно согласен" },
];

const phq4Questions = [
  "Чувство тревоги или раздражения.",
  "Неспособность справиться со своим беспокойством.",
  "Снижение интереса и удовольствия от привычных дел.",
  "Чувство подавленности или безнадежности.",
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

const instruments = {
  phq4: {
    title: "PHQ-4",
    intro:
      "Вам будут предложены 4 утверждения о вашем состоянии за последние две недели. Отвечайте, насколько часто вы это ощущали.",
    questions: phq4Questions,
    scale: phq4Scale,
  },
  m1: {
    title: "OPD-SQS",
    intro:
      "На следующих страницах вы найдёте ряд утверждений, описывающих различные особенности человека. Пожалуйста, укажите, в какой степени эти утверждения относятся к вам. Отметьте тот вариант ответа, который лучше всего описывает вас в целом. Здесь нет правильных или неправильных ответов, потому что люди по-разному воспринимают себя. Часть утверждений относится к отношениям. Пожалуйста, отвечайте на них, исходя из того, как вы обычно видите себя в отношениях. Если у вас ещё не было романтических отношений, представьте, как вы воспринимали бы себя в них.",
    questions: m1Questions,
    scale: m1Scale,
  },
  m2: {
    title: "SIFS",
    intro:
      "Эта анкета состоит из 24 утверждений о вас и о ваших взаимоотношениях с другими людьми. Пожалуйста, оцените, насколько близко каждое из утверждений описывает вас. Пожалуйста, отвечайте спонтанно, в соответствии с собственным впечатлением. Здесь нет правильных или неправильных ответов, мы хотели бы знать, как вы себя видите.",
    questions: m2Questions,
    scale: m2Scale,
  },
  m3: {
    title: "BFI-2-XS",
    intro:
      "На следующих страницах вы найдёте ряд утверждений, описывающих различные особенности человека. Ниже приведен список качеств, которые могут вас характеризовать или не характеризовать. Например, вы согласны с тем, что вы – человек, которому нравится проводить время с другими людьми? Пожалуйста, выберите степень вашего согласия или несогласия с каждым пунктом.",
    questions: m3Questions,
    scale: m3Scale,
  },
};

function buildScreens() {
  const out = [
    { type: "intro" },
    { type: "demographics" },
  ];

  ["phq4", "m1", "m2", "m3"].forEach((instrumentId) => {
    out.push({ type: "instrument_intro", instrumentId });
    instruments[instrumentId].questions.forEach((_, idx) => {
      out.push({
        type: "question",
        instrumentId,
        questionIndex: idx + 1,
        total: instruments[instrumentId].questions.length,
        responseKey: `${instrumentId}_${idx + 1}`,
      });
    });
  });

  out.push({ type: "submit" });
  return out;
}

const screens = buildScreens();

const state = {
  currentScreenIndex: 0,
  submitting: false,
  submitted: false,
  submitErrorText: "",
  autoAdvancing: false,
  consent: {
    age18: false,
    pdn: false,
  },
  demographics: {
    gender: "",
    user_label: "",
    age: "",
    dx: "",
  },
  responses: {
    phq4: {},
    m1: {},
    m2: {},
    m3: {},
  },
};

function getCurrentScreen() {
  return screens[state.currentScreenIndex];
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function validAge(ageStr) {
  return /^\d{1,2}$/.test(String(ageStr || "").trim());
}

function canProceed(screen) {
  if (screen.type === "intro") {
    return state.consent.age18 && state.consent.pdn;
  }

  if (screen.type === "demographics") {
    return (
      !!state.demographics.gender &&
      !!state.demographics.dx &&
      !!String(state.demographics.user_label || "").trim() &&
      validAge(state.demographics.age)
    );
  }

  if (screen.type === "instrument_intro") {
    return true;
  }

  return true;
}

function buildScalePayload(instrumentId) {
  const questions = instruments[instrumentId].questions;
  const out = {};

  for (let i = 1; i <= questions.length; i++) {
    const key = `${instrumentId}_${i}`;
    const value = state.responses[instrumentId][key];
    out[key] = typeof value === "number" ? value : null;
  }

  return out;
}

function buildPayload() {
  return {
    schema_version: "2.0",
    respondent_id: uuidv4(),
    user_label: String(state.demographics.user_label || "").trim(),
    submitted_at: new Date().toISOString(),
    consent: {
      age18: !!state.consent.age18,
      pdn: !!state.consent.pdn,
    },
    demographics: {
      gender: state.demographics.gender,
      age: Number(String(state.demographics.age || "").trim()),
      dx: state.demographics.dx,
    },
    responses: {
      phq4: buildScalePayload("phq4"),
      m1: buildScalePayload("m1"),
      m2: buildScalePayload("m2"),
      m3: buildScalePayload("m3"),
    },
  };
}

function findFirstMissingQuestionScreenIndex() {
  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    if (screen.type !== "question") continue;

    const value = state.responses[screen.instrumentId][screen.responseKey];
    if (typeof value !== "number") {
      return i;
    }
  }
  return -1;
}

function goTo(index) {
  if (index < 0 || index >= screens.length) return;
  state.currentScreenIndex = index;
  state.autoAdvancing = false;
  render();
}

function goNext() {
  if (state.currentScreenIndex >= screens.length - 1) return;
  goTo(state.currentScreenIndex + 1);
}

function goPrev() {
  if (state.currentScreenIndex <= 0) return;
  goTo(state.currentScreenIndex - 1);
}

function renderIntro() {
  screenRoot.innerHTML = `
    <article class="screen-card">
      <h2>Рада вас видеть!</h2>
      <p class="lead">Я провожу исследование, посвящённое адаптации Операционализированной психодинамической диагностики (OPD-SQS) и оценке того, насколько корректно и надежно методика работает на русскоязычной выборке. Для анализа пригодности адаптации OPD-SQS в структуру исследования также включены Шкала личностного и межличностного функционирования (SIFS) и Опросник Большой пятёрки (BFI-2-XS).</p>
      <p class="lead">Что вам предстоит:<br>ответить на несколько блоков вопросов о вашем опыте<br><br>указать базовую социально-демографическую информацию</p>
      <p class="lead">Обычно заполнение занимает около 10 минут.</p>
      <p class="lead">Ответы будут анализироваться только в обобщенном виде. Данные хранятся на защищенном частном сервере, вся информация строго конфиденциальна.</p>
      <p class="lead">Нет “правильных” и “неправильных” ответов. Пожалуйста, отвечайте честно – важна именно ваша личная оценка.</p>
      <p class="lead">Если у вас есть вопросы об исследовании или обработке данных, вы можете написать: kagolub@edu.hse.ru</p>
      <div class="checks">
        <label class="check-item">
          <input type="checkbox" id="consentAge" ${state.consent.age18 ? "checked" : ""}>
          <span>Мне есть 18 лет.</span>
        </label>
        <label class="check-item">
          <input type="checkbox" id="consentPdn" ${state.consent.pdn ? "checked" : ""}>
          <span>Я даю согласие на участие в исследовании.</span>
        </label>
      </div>
    </article>
  `;

  const ageEl = document.getElementById("consentAge");
  const pdnEl = document.getElementById("consentPdn");

  ageEl.addEventListener("change", () => {
    state.consent.age18 = ageEl.checked;
    updateNavState();
  });

  pdnEl.addEventListener("change", () => {
    state.consent.pdn = pdnEl.checked;
    updateNavState();
  });
}

function renderDemographics() {
  screenRoot.innerHTML = `
    <article class="screen-card">
      <h2>Общие вопросы</h2>

      <label class="field">
        <span>Пол</span>
        <div class="choices">
          <label><input type="radio" name="gender" value="male" ${state.demographics.gender === "male" ? "checked" : ""}> Мужской</label>
          <label><input type="radio" name="gender" value="female" ${state.demographics.gender === "female" ? "checked" : ""}> Женский</label>
        </div>
      </label>

      <label class="field">
        <span>ID</span>
        <input type="text" id="userLabel" value="${(state.demographics.user_label || "").replace(/"/g, "&quot;")}" placeholder="Придумайте имя" autocomplete="off">
        <small class="hint">Необходимо для систематизации анализа данных.</small>
      </label>

      <label class="field">
        <span>Возраст</span>
        <input type="text" id="age" value="${(state.demographics.age || "").replace(/"/g, "&quot;")}" inputmode="numeric" placeholder="XX" autocomplete="off">
        <small class="hint">Только цифры, не более двух знаков.</small>
      </label>

      <label class="field">
        <span>Есть ли диагностированные психические заболевания?</span>
        <div class="choices">
          <label><input type="radio" name="dx" value="yes" ${state.demographics.dx === "yes" ? "checked" : ""}> Да</label>
          <label><input type="radio" name="dx" value="no" ${state.demographics.dx === "no" ? "checked" : ""}> Нет</label>
        </div>
      </label>
    </article>
  `;

  screenRoot.querySelectorAll('input[name="gender"]').forEach((el) => {
    el.addEventListener("change", () => {
      state.demographics.gender = el.value;
      updateNavState();
    });
  });

  screenRoot.querySelectorAll('input[name="dx"]').forEach((el) => {
    el.addEventListener("change", () => {
      state.demographics.dx = el.value;
      updateNavState();
    });
  });

  const userLabelEl = document.getElementById("userLabel");
  userLabelEl.addEventListener("input", () => {
    state.demographics.user_label = userLabelEl.value;
    updateNavState();
  });

  const ageEl = document.getElementById("age");
  ageEl.addEventListener("input", () => {
    state.demographics.age = ageEl.value;
    updateNavState();
  });
}

function renderInstrumentIntro(screen) {
  const instrument = instruments[screen.instrumentId];
  screenRoot.innerHTML = `
    <article class="screen-card">
      <h2>${instrument.title}</h2>
      <p class="lead">${instrument.intro}</p>
    </article>
  `;
}

function renderQuestion(screen) {
  const instrument = instruments[screen.instrumentId];
  const percent = Math.round((screen.questionIndex / screen.total) * 100);

  const answers = instrument.scale
    .map((opt) => {
      const disabledAttr = state.autoAdvancing ? "disabled" : "";
      return `
        <button type="button" class="answer-card" data-value="${opt.value}" ${disabledAttr}>
          <span class="answer-label">${opt.label}</span>
        </button>
      `;
    })
    .join("");

  screenRoot.innerHTML = `
    <article class="question-screen">
      <div class="question-top">
        <button type="button" id="questionBackBtn" class="inline-back">Назад</button>
        <div class="local-progress">
          <div class="local-progress__text">Вопрос ${screen.questionIndex} из ${screen.total} (${percent}%)</div>
          <div class="local-progress__track"><div class="local-progress__bar" style="width:${percent}%"></div></div>
        </div>
      </div>

      <div class="question-card">
        ${instrument.questions[screen.questionIndex - 1]}
      </div>

      <div class="answer-list">
        ${answers}
      </div>
    </article>
  `;

  document.getElementById("questionBackBtn").addEventListener("click", goPrev);

  screenRoot.querySelectorAll(".answer-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.autoAdvancing) return;

      const value = Number(btn.dataset.value);
      state.responses[screen.instrumentId][screen.responseKey] = value;

      state.autoAdvancing = true;
      render();

      setTimeout(() => {
        state.autoAdvancing = false;
        goNext();
      }, 120);
    });
  });
}

function renderSubmit() {
  const successHtml = state.submitted
    ? `<div class="ok">Благодарю за участие, вы помогли науке! Ответы успешно отправлены.</div>`
    : "";
  const errorHtml = state.submitErrorText
    ? `<div class="error">${state.submitErrorText}</div>`
    : "";

  screenRoot.innerHTML = `
    <article class="screen-card">
      <h2>Завершение</h2>
      <p class="lead">Ура! Нажмите «Отправить» для завершения исследования. Пожалуйста, дождитесь появления окна о том, что ваши ответы отправлены.</p>
      ${successHtml}
      ${errorHtml}
    </article>
  `;
}

function updateNavState() {
  const screen = getCurrentScreen();
  const isQuestion = screen.type === "question";
  const isSubmit = screen.type === "submit";

  navRow.hidden = isQuestion;

  if (isQuestion) {
    nextBtn.hidden = true;
    prevBtn.hidden = true;
    submitBtn.hidden = true;
    return;
  }

  prevBtn.hidden = state.currentScreenIndex === 0;
  prevBtn.disabled = state.submitting;

  if (isSubmit) {
    nextBtn.hidden = true;
    submitBtn.hidden = false;
    submitBtn.disabled = state.submitting;
    return;
  }

  submitBtn.hidden = true;
  nextBtn.hidden = false;
  nextBtn.disabled = !canProceed(screen) || state.submitting;

  if (screen.type === "intro" || screen.type === "instrument_intro") {
    nextBtn.textContent = "Начать";
  } else {
    nextBtn.textContent = "Далее";
  }
}

function render() {
  const screen = getCurrentScreen();

  if (screen.type === "intro") {
    renderIntro();
  } else if (screen.type === "demographics") {
    renderDemographics();
  } else if (screen.type === "instrument_intro") {
    renderInstrumentIntro(screen);
  } else if (screen.type === "question") {
    renderQuestion(screen);
  } else if (screen.type === "submit") {
    renderSubmit();
  }

  updateNavState();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleNextClick() {
  const screen = getCurrentScreen();
  if (!canProceed(screen)) {
    if (screen.type === "demographics" && !validAge(state.demographics.age)) {
      alert("Возраст должен быть числом (1–2 цифры).");
    }
    return;
  }
  goNext();
}

async function handleSubmit(e) {
  e.preventDefault();

  const screen = getCurrentScreen();
  if (screen.type !== "submit") return;

  const firstMissing = findFirstMissingQuestionScreenIndex();
  if (firstMissing >= 0) {
    state.submitErrorText = "Пожалуйста, ответьте на все вопросы перед отправкой.";
    goTo(firstMissing);
    return;
  }

  try {
    state.submitting = true;
    state.submitted = false;
    state.submitErrorText = "";
    updateNavState();

    const payload = buildPayload();

    const res = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ошибка отправки: ${res.status} ${text}`);
    }

    state.submitted = true;
    state.submitErrorText = "";
    render();
  } catch (err) {
    state.submitErrorText = err?.message || String(err);
    render();
  } finally {
    state.submitting = false;
    updateNavState();
  }
}

prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", handleNextClick);
form.addEventListener("submit", handleSubmit);

render();
