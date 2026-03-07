const SUBMIT_ENDPOINT = "https://opd-osf-submit.golubmoskva.workers.dev/submit";

const screenRoot = document.getElementById("screenRoot");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const submitBtn = document.getElementById("submitBtn");
const footerNav = document.getElementById("footerNav");

const introHtml = `
  <div class="instruction-block">
    <p><strong>Рада приветствовать вас!</strong></p>
    <p>Мы проводим исследование, посвящённое адаптации <strong>Операционализированной психодинамической диагностики (OPD-SQS)</strong> и оценке того, насколько корректно и надёжно методика работает на русскоязычной выборке. Для анализа пригодности адаптации OPD-SQS в структуру исследования также включены <strong>Шкала личностного и межличностного функционирования (SIFS)</strong> и <strong>Опросник Большой пятёрки (BFI-2-XS)</strong>.</p>
    <p><strong>Что вам предстоит:</strong></p>
    <ul>
      <li>ответить на несколько блоков утверждений/вопросов о вашем опыте, особенностях взаимодействия с людьми и личностных характеристиках;</li>
      <li>указать базовую социально-демографическую информацию.</li>
    </ul>
    <p><strong>Обычно заполнение занимает не более 10 минут.</strong></p>
    <p><strong>Добровольность участия.</strong> Вы можете отказаться от участия или прекратить заполнение в любой момент без каких-либо негативных последствий.</p>
    <p><strong>Анонимность и конфиденциальность.</strong> Мы не запрашиваем контактные данные, позволяющие установить вашу личность. Если вы указываете «Фамилия/Имя/ник» для технических целей, используйте псевдоним или ник, который не позволяет вас идентифицировать.</p>
    <p><strong>Нет «правильных» и «неправильных» ответов.</strong> Пожалуйста, отвечайте честно — важна именно ваша личная оценка.</p>
    <p>Если у вас есть вопросы об исследовании или обработке данных, вы можете написать: <strong>@Shiroi_hato</strong></p>
  </div>
`;

const phq4Instruction = `
  <div class="instruction-block">
    <p><strong>Следующие 4 утверждения касаются вашего самочувствия в последнее время.</strong></p>
    <p>Пожалуйста, укажите, как часто каждое состояние возникало у вас в течение последних двух недель.</p>
    <p>Выберите один вариант ответа для каждого утверждения.</p>
  </div>
`;

const opdInstruction = `
  <div class="instruction-block">
    <p>На следующих страницах вы найдёте ряд утверждений, описывающих различные особенности человека.</p>
    <p>Пожалуйста, укажите, в какой степени эти утверждения относятся к вам. Отметьте тот вариант ответа, который лучше всего описывает вас в целом.</p>
    <p>Здесь нет правильных или неправильных ответов, потому что люди по-разному воспринимают себя.</p>
    <p>Часть утверждений относится к отношениям. Пожалуйста, отвечайте на них, исходя из того, как вы обычно видите себя в отношениях. Если у вас ещё не было романтических отношений, представьте, как вы воспринимали бы себя в них.</p>
  </div>
`;

const sifsInstruction = `
  <div class="instruction-block">
    <p>Эта анкета состоит из 24 утверждений о вас и о ваших взаимоотношениях с другими людьми.</p>
    <p>Пожалуйста, оцените, насколько близко каждое из утверждений описывает вас.</p>
    <p>Пожалуйста, отвечайте спонтанно, в соответствии с собственным впечатлением.</p>
    <p>Здесь нет правильных или неправильных ответов, мы хотели бы знать, как вы себя видите.</p>
  </div>
`;

const bfiInstruction = `
  <div class="instruction-block">
    <p>Ниже приведён список качеств, которые могут вас характеризовать или не характеризовать.</p>
    <p>Например, вы согласны с тем, что вы — человек, которому нравится проводить время с другими людьми?</p>
    <p>Пожалуйста, выберите степень вашего согласия или несогласия с каждым пунктом.</p>
  </div>
`;

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

const instruments = {
  phq4: {
    prefix: "phq4",
    instructionTitle: "PHQ-4",
    instructionHtml: phq4Instruction,
    scale: phq4Scale,
    questions: [
      "Чувство тревоги или раздражения",
      "Неспособность справиться со своим беспокойством",
      "Снижение интереса и удовольствия от привычных дел",
      "Чувство подавленности или безнадёжности",
    ],
  },
  m1: {
    prefix: "m1",
    instructionTitle: "Утверждения (часть 1)",
    instructionHtml: opdInstruction,
    scale: m1Scale,
    questions: [
      "Иногда мне кажется, что я сам(а) себе чужой(ая).",
      "Если я слишком много думаю о себе, я начинаю запутываться.",
      "Опасно подпускать других слишком близко к себе.",
      "Мне трудно добиться понимания от окружающих.",
      "Внутри меня часто такой хаос чувств, что я даже не могу его описать.",
      "Иногда я неверно оцениваю, как моё поведение влияет на других.",
      "Если другие знают обо мне слишком много, я часто чувствую, будто меня контролируют или за мной наблюдают.",
      "Иногда мои чувства настолько сильны, что мне становится страшно.",
      "Моя ошибка в оценке человека обернулась для меня болезненными последствиями.",
      "Мне трудно устанавливать контакт с другими людьми.",
      "У меня невысокая самооценка.",
      "Мой опыт таков: если слишком доверять людям, можно получить неожиданные неприятности.",
    ],
  },
  m2: {
    prefix: "m2",
    instructionTitle: "Утверждения (часть 2)",
    instructionHtml: sifsInstruction,
    scale: m2Scale,
    questions: [
      "Я способен выносить большинство своих эмоций и хорошо управлять ими.",
      "На моей самооценке сильно сказываются мои неудачи или разочарования.",
      "Я чувствую глубокую пустоту внутри себя.",
      "Я склонен путать свои эмоции с эмоциями других людей.",
      "Я запутался в том, кто я есть на самом деле.",
      "Я узнаю себя в том, как меня описывают другие.",
      "Мне часто кажется, что моя жизнь не имеет смысла.",
      "Я ставлю перед собой разумные цели и предпринимаю реальные меры для их достижения.",
      "Иногда я не понимаю, почему я вёл себя определённым образом или почему принял некоторые решения.",
      "В своих действиях и решениях я руководствуюсь своими неотложными потребностями, невзирая на всё остальное.",
      "Я часто меняю свои планы и жизненные цели.",
      "Мои действия и мои решения соответствуют моим ценностям и убеждениям.",
      "Люди часто негативно реагируют на мои слова или мои действия, и я не до конца понимаю, почему.",
      "Люди критикуют меня за то, что я нечуток к другим.",
      "Я часто нахожусь в замешательстве, почему люди ведут себя по отношению ко мне определённым образом.",
      "Меня мало интересуют чувства или проблемы других людей.",
      "Во время беседы мне любопытно и интересно узнать точку зрения других людей.",
      "Когда кто-то думает не так, как я, или возражает мне, я склонен реагировать негативно или гневно, даже если этот человек вёл себя уважительно.",
      "У меня много межличностных отношений, которые приносят удовлетворение мне и другому человеку.",
      "Как правило, мои дружеские или любовные отношения длятся не очень долго.",
      "Если я нахожусь в отношениях с другими людьми, то это в первую очередь потому, что я хочу, чтобы они удовлетворяли некоторые из моих потребностей.",
      "На самом деле я не испытываю желания или интереса, чтобы поддерживать взаимоотношения с другими людьми.",
      "Я не доверяю другим и предпочитаю держаться с ними на некотором расстоянии, чтобы избежать от них вреда.",
      "В моей жизни есть много людей, с которыми я близок и поддерживаю отношения, основанные на уважении, привязанности и взаимной поддержке.",
    ],
  },
  m3: {
    prefix: "m3",
    instructionTitle: "Утверждения (часть 3)",
    instructionHtml: bfiInstruction,
    scale: m3Scale,
    questions: [
      "Я — человек, который... склонен быть молчаливым.",
      "...сопереживающий и добросердечный.",
      "...склонный быть неорганизованным.",
      "...часто волнующийся, обо всём переживающий.",
      "...увлечённый живописью, музыкой или литературой.",
      "...доминирующий, ведущий себя по-лидерски.",
      "...порой бывающий грубым с окружающими.",
      "...с трудом приступающий к работе.",
      "...склонный к печали, депрессии.",
      "...мало интересующийся абстрактными идеями.",
      "...полный энергии.",
      "...склонный видеть в других людях только хорошее.",
      "...надёжный, на меня всегда можно рассчитывать.",
      "...эмоционально стабильный, которого нелегко вывести из себя.",
      "...генерирующий новые идеи, оригинально мыслящий.",
    ],
  },
};

const state = {
  currentScreenIndex: 0,
  submitting: false,
  status: null,
  intro: {
    age18: false,
    consent: false,
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

const screens = buildScreens();

function buildScreens() {
  const list = [
    { type: "intro" },
    { type: "demographics" },
    { type: "instrument_intro", instrumentId: "phq4" },
    ...buildQuestionScreens("phq4"),
    { type: "instrument_intro", instrumentId: "m1" },
    ...buildQuestionScreens("m1"),
    { type: "instrument_intro", instrumentId: "m2" },
    ...buildQuestionScreens("m2"),
    { type: "instrument_intro", instrumentId: "m3" },
    ...buildQuestionScreens("m3"),
    { type: "submit" },
  ];

  return list;
}

function buildQuestionScreens(instrumentId) {
  return instruments[instrumentId].questions.map((_, index) => ({
    type: "question",
    instrumentId,
    questionIndex: index,
  }));
}

function currentScreen() {
  return screens[state.currentScreenIndex];
}

function questionKey(instrumentId, index) {
  return `${instruments[instrumentId].prefix}_${index + 1}`;
}

function progressPercent(current, total) {
  return Math.round((current / total) * 100);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  const screen = currentScreen();
  screenRoot.innerHTML = "";

  if (screen.type === "intro") renderIntroScreen();
  if (screen.type === "demographics") renderDemographicsScreen();
  if (screen.type === "instrument_intro") renderInstrumentIntro(screen.instrumentId);
  if (screen.type === "question") renderQuestionScreen(screen.instrumentId, screen.questionIndex);
  if (screen.type === "submit") renderSubmitScreen();

  renderFooter(screen);
}

function renderIntroScreen() {
  const wrapper = document.createElement("section");
  wrapper.className = "screen";
  wrapper.innerHTML = `
    <h1 class="screen__title">Опрос</h1>
    <div class="panel panel--padded">${introHtml}</div>
    <div class="panel panel--padded">
      <div class="field-group">
        <label class="choice-chip ${state.intro.age18 ? "is-selected" : ""}">
          <input type="checkbox" id="age18Check" ${state.intro.age18 ? "checked" : ""} />
          <span class="choice-chip__dot" aria-hidden="true"></span>
          <span>Мне есть 18 лет.</span>
        </label>
        <label class="choice-chip ${state.intro.consent ? "is-selected" : ""}">
          <input type="checkbox" id="consentCheck" ${state.intro.consent ? "checked" : ""} />
          <span class="choice-chip__dot" aria-hidden="true"></span>
          <span>Я согласен(на) участвовать в исследовании.</span>
        </label>
      </div>
    </div>
  `;
  screenRoot.appendChild(wrapper);

  document.getElementById("age18Check")?.addEventListener("change", (event) => {
    state.intro.age18 = event.target.checked;
    render();
  });
  document.getElementById("consentCheck")?.addEventListener("change", (event) => {
    state.intro.consent = event.target.checked;
    render();
  });
}

function renderDemographicsScreen() {
  const wrapper = document.createElement("section");
  wrapper.className = "screen";
  wrapper.innerHTML = `
    <h1 class="screen__title">Общие вопросы</h1>
    <div class="panel panel--padded">
      <div class="field-group">
        <div class="field">
          <div class="field__label">Пол</div>
          <div class="choice-row choice-row--two" id="genderRow"></div>
        </div>

        <label class="field">
          <span class="field__label">Фамилия/Имя/ник</span>
          <input class="input" id="userLabelInput" type="text" value="${escapeHtml(state.demographics.user_label)}" placeholder="Фамилия/Имя/ник" maxlength="60" autocomplete="off" />
          <span class="field__hint">Рекомендуется псевдоним/ник, не идентифицирующий личность.</span>
        </label>

        <label class="field">
          <span class="field__label">Возраст</span>
          <input class="input" id="ageInput" type="text" inputmode="numeric" value="${escapeHtml(state.demographics.age)}" placeholder="Например, 27" maxlength="2" autocomplete="off" />
          <span class="field__hint">Только цифры, не более двух знаков.</span>
        </label>

        <div class="field">
          <div class="field__label">Есть ли диагностированные психические заболевания?</div>
          <div class="choice-row choice-row--two" id="dxRow"></div>
        </div>
      </div>
    </div>
  `;
  screenRoot.appendChild(wrapper);

  renderBinaryChoice(document.getElementById("genderRow"), "gender", [
    { value: "male", label: "Мужской" },
    { value: "female", label: "Женский" },
  ], state.demographics.gender);

  renderBinaryChoice(document.getElementById("dxRow"), "dx", [
    { value: "yes", label: "Да" },
    { value: "no", label: "Нет" },
  ], state.demographics.dx);

  document.querySelectorAll("[data-choice-group='gender']").forEach((button) => {
    button.addEventListener("click", () => {
      state.demographics.gender = button.dataset.value;
      render();
    });
  });

  document.querySelectorAll("[data-choice-group='dx']").forEach((button) => {
    button.addEventListener("click", () => {
      state.demographics.dx = button.dataset.value;
      render();
    });
  });

  document.getElementById("userLabelInput")?.addEventListener("input", (event) => {
    state.demographics.user_label = event.target.value;
    syncFooterState();
  });

  document.getElementById("ageInput")?.addEventListener("input", (event) => {
    const digits = String(event.target.value || "").replace(/\D+/g, "").slice(0, 2);
    state.demographics.age = digits;
    event.target.value = digits;
    syncFooterState();
  });
}

function renderBinaryChoice(root, groupName, choices, selectedValue) {
  if (!root) return;
  root.innerHTML = choices
    .map(
      (choice) => `
        <button
          type="button"
          class="choice-chip ${selectedValue === choice.value ? "is-selected" : ""}"
          data-choice-group="${groupName}"
          data-value="${choice.value}"
        >
          <span class="choice-chip__dot" aria-hidden="true"></span>
          <span>${choice.label}</span>
        </button>
      `,
    )
    .join("");
}

function renderInstrumentIntro(instrumentId) {
  const instrument = instruments[instrumentId];
  const wrapper = document.createElement("section");
  wrapper.className = "screen";
  wrapper.innerHTML = `
    <h1 class="screen__title">${instrument.instructionTitle}</h1>
    <div class="panel panel--padded">${instrument.instructionHtml}</div>
  `;
  screenRoot.appendChild(wrapper);
}

function renderQuestionScreen(instrumentId, questionIndex) {
  const instrument = instruments[instrumentId];
  const key = questionKey(instrumentId, questionIndex);
  const selectedValue = state.responses[instrumentId][key];
  const total = instrument.questions.length;
  const current = questionIndex + 1;
  const percent = progressPercent(current, total);

  const wrapper = document.createElement("section");
  wrapper.className = "screen";

  const topbar = document.createElement("div");
  topbar.className = "question-topbar";
  topbar.innerHTML = `
    <button type="button" id="questionBackBtn" class="back-chip">Назад</button>
    <div class="panel progress-chip">
      <div class="progress-chip__fill" style="--progress:${percent}%">
        <div class="progress-chip__text">Вопрос ${current} из ${total} (${percent}%)</div>
      </div>
    </div>
  `;

  const questionCard = document.createElement("div");
  questionCard.className = "panel question-card";
  questionCard.innerHTML = `<p class="question-card__text">${instrument.questions[questionIndex]}</p>`;

  const answers = document.createElement("div");
  answers.className = "answers";
  answers.innerHTML = instrument.scale
    .map(
      (option) => `
        <button
          type="button"
          class="answer-card ${selectedValue === option.value ? "is-selected" : ""}"
          data-answer-value="${option.value}"
        >
          ${option.label}
        </button>
      `,
    )
    .join("");

  wrapper.appendChild(topbar);
  wrapper.appendChild(questionCard);
  wrapper.appendChild(answers);
  wrapper.appendChild(document.createElement("div")).className = "footer-spacer";
  screenRoot.appendChild(wrapper);

  document.getElementById("questionBackBtn")?.addEventListener("click", goPrev);

  screenRoot.querySelectorAll("[data-answer-value]").forEach((button) => {
    button.addEventListener("click", () => {
      state.responses[instrumentId][key] = Number(button.dataset.answerValue);
      button.classList.add("is-selected");
      setTimeout(() => {
        goNext();
      }, 110);
    });
  });
}

function renderSubmitScreen() {
  const wrapper = document.createElement("section");
  wrapper.className = "screen";

  const isError = state.status?.type === "error";
  const isSuccess = state.status?.type === "success";

  wrapper.innerHTML = `
    <h1 class="screen__title">Завершение</h1>
    <div class="panel panel--padded instruction-block">
      <p>Нажмите «Отправить», чтобы завершить опрос и сохранить ответы.</p>
      <p>Перед отправкой можно вернуться назад и изменить ответы.</p>
    </div>
    ${isError ? `<div class="status-box status-box--error">${escapeHtml(state.status.message)}</div>` : ""}
    ${isSuccess ? `<div class="status-box status-box--success">${escapeHtml(state.status.message)}</div>` : ""}
  `;
  screenRoot.appendChild(wrapper);
}

function renderFooter(screen) {
  const isQuestion = screen.type === "question";
  footerNav.hidden = isQuestion;

  if (isQuestion) {
    nextBtn.hidden = true;
    prevBtn.hidden = true;
    submitBtn.hidden = true;
    return;
  }

  const nav = navConfig(screen);

  nextBtn.hidden = !nav.showNext;
  nextBtn.disabled = !!nav.nextDisabled || state.submitting;
  nextBtn.textContent = nav.nextLabel;

  prevBtn.hidden = !nav.showPrev;
  prevBtn.disabled = state.submitting;

  submitBtn.hidden = !nav.showSubmit;
  submitBtn.disabled = !!nav.submitDisabled || state.submitting;
}

function navConfig(screen) {
  if (screen.type === "intro") {
    return {
      showNext: true,
      nextLabel: "Начать",
      nextDisabled: !validateIntro(),
      showPrev: false,
      showSubmit: false,
    };
  }

  if (screen.type === "demographics") {
    return {
      showNext: true,
      nextLabel: "Далее",
      nextDisabled: !validateDemographics(),
      showPrev: true,
      showSubmit: false,
    };
  }

  if (screen.type === "instrument_intro") {
    return {
      showNext: true,
      nextLabel: "Начать",
      nextDisabled: false,
      showPrev: true,
      showSubmit: false,
    };
  }

  if (screen.type === "submit") {
    return {
      showNext: false,
      nextLabel: "Далее",
      nextDisabled: true,
      showPrev: true,
      showSubmit: true,
      submitDisabled: !validateAllResponses(),
    };
  }

  return {
    showNext: false,
    nextLabel: "Далее",
    nextDisabled: true,
    showPrev: false,
    showSubmit: false,
  };
}

function validateIntro() {
  return state.intro.age18 && state.intro.consent;
}

function validateDemographics() {
  const labelOk = String(state.demographics.user_label || "").trim().length > 0;
  const ageOk = /^\d{1,2}$/.test(String(state.demographics.age || "").trim());
  return Boolean(state.demographics.gender && state.demographics.dx && labelOk && ageOk);
}

function validateInstrumentComplete(instrumentId) {
  const instrument = instruments[instrumentId];
  return instrument.questions.every((_, index) => {
    const value = state.responses[instrumentId][questionKey(instrumentId, index)];
    return Number.isFinite(value);
  });
}

function validateAllResponses() {
  return validateIntro() && validateDemographics() && ["phq4", "m1", "m2", "m3"].every(validateInstrumentComplete);
}

function syncFooterState() {
  renderFooter(currentScreen());
}

function goNext() {
  if (!canGoNext()) return;
  state.currentScreenIndex = Math.min(screens.length - 1, state.currentScreenIndex + 1);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goPrev() {
  state.currentScreenIndex = Math.max(0, state.currentScreenIndex - 1);
  state.status = null;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function canGoNext() {
  const screen = currentScreen();
  if (screen.type === "intro") return validateIntro();
  if (screen.type === "demographics") return validateDemographics();
  if (screen.type === "instrument_intro") return true;
  if (screen.type === "question") return validateInstrumentComplete(screen.instrumentId);
  return false;
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function buildPayload() {
  return {
    schema_version: "2.0",
    respondent_id: uuidv4(),
    user_label: String(state.demographics.user_label || "").trim(),
    submitted_at: new Date().toISOString(),
    consent: {
      age18: state.intro.age18,
      pdn: state.intro.consent,
    },
    demographics: {
      gender: state.demographics.gender,
      age: Number(String(state.demographics.age || "").trim()),
      dx: state.demographics.dx,
    },
    responses: {
      phq4: { ...state.responses.phq4 },
      m1: { ...state.responses.m1 },
      m2: { ...state.responses.m2 },
      m3: { ...state.responses.m3 },
    },
  };
}

async function submitSurvey() {
  if (!validateAllResponses() || state.submitting) return;

  state.submitting = true;
  state.status = null;
  renderFooter(currentScreen());

  try {
    const payload = buildPayload();
    const response = await fetch(SUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      throw new Error(`Ошибка отправки: ${response.status} ${message}`);
    }

    state.status = {
      type: "success",
      message: "Спасибо! Ответы успешно отправлены.",
    };
  } catch (error) {
    state.status = {
      type: "error",
      message: error?.message || String(error),
    };
  } finally {
    state.submitting = false;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

nextBtn.addEventListener("click", () => {
  if (canGoNext()) goNext();
});

prevBtn.addEventListener("click", goPrev);
submitBtn.addEventListener("click", submitSurvey);

render();
