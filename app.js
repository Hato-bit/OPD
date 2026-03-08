// ====== CONFIG ======
const SUBMIT_ENDPOINT = "https://opd-osf-submit.golubmoskva.workers.dev/submit";
// ====================

const form = document.getElementById("surveyForm");
const screenRoot = document.getElementById("screenRoot");
const topHeader = document.querySelector(".top");

const navRow = document.getElementById("navRow");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultBtn = document.getElementById("resultBtn");
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

const M2_REVERSE = new Set([1, 6, 8, 12, 17, 19, 24]);
const M3_REVERSE = new Set([1, 3, 7, 8, 10, 14]);
const OPD_SQS_TOTAL_TO_PERCENTILE = {
  0: 8,
  1: 10,
  2: 14,
  3: 18,
  4: 22,
  5: 26,
  6: 31,
  7: 36,
  8: 41,
  9: 45,
  10: 50,
  11: 54,
  12: 59,
  13: 62,
  14: 66,
  15: 70,
  16: 74,
  17: 77,
  18: 79,
  19: 82,
  20: 84,
  21: 86,
  22: 89,
  23: 90,
  24: 92,
  25: 94,
  26: 95,
  27: 95,
  28: 96,
  29: 97,
  30: 98,
  31: 98,
  32: 98,
  33: 99,
  34: 99,
  35: 99,
  36: 99,
  37: 100,
};

function buildScreens() {
  const out = [
    { type: "intro" },
    { type: "demographics" },
  ];

  ["m1", "phq4", "m2", "m3"].forEach((instrumentId) => {
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
  out.push({ type: "results" });
  return out;
}

const screens = buildScreens();

const state = {
  currentScreenIndex: 0,
  submitting: false,
  submitted: false,
  respondentId: uuidv4(),
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
  const ageRaw = String(ageStr || "").trim();
  if (!/^\d{1,2}$/.test(ageRaw)) return false;
  const ageNum = Number(ageRaw);
  return ageNum >= 18 && ageNum <= 99;
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
    respondent_id: state.respondentId,
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

function humanizeSubmitError(err) {
  const raw = String(err?.message || err || "");
  if (!raw) {
    return "Не удалось отправить данные.";
  }

  if (isNetworkSubmitError(err)) {
    return "Связь с сервером прервалась при получении ответа. Данные могли уже сохраниться в OSF. Проверьте хранилище перед повторной отправкой.";
  }

  return raw;
}

function isNetworkSubmitError(err) {
  const raw = String(err?.message || err || "");
  return /load failed|failed to fetch|networkerror|network request failed/i.test(raw);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postSubmit(payload) {
  const res = await fetch(SUBMIT_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ошибка отправки: ${res.status} ${text}`);
  }

  return res;
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

function toValidNumber(value, min, max) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

function collectScaleValues(instrumentId, count, min, max) {
  const source = state.responses[instrumentId] || {};
  const values = {};
  for (let i = 1; i <= count; i++) {
    values[i] = toValidNumber(source[`${instrumentId}_${i}`], min, max);
  }
  return values;
}

function scoreWithReverse(values, reverseSet, maxValue) {
  const scored = {};
  Object.keys(values).forEach((key) => {
    const idx = Number(key);
    const raw = values[idx];
    if (raw == null) {
      scored[idx] = null;
      return;
    }
    scored[idx] = reverseSet.has(idx) ? maxValue - raw : raw;
  });
  return scored;
}

function sumOf(values, indices) {
  let total = 0;
  let hasAny = false;
  indices.forEach((idx) => {
    const val = values[idx];
    if (typeof val === "number") {
      total += val;
      hasAny = true;
    }
  });
  return hasAny ? total : null;
}

function meanOf(values, indices) {
  let total = 0;
  let n = 0;
  indices.forEach((idx) => {
    const val = values[idx];
    if (typeof val === "number") {
      total += val;
      n += 1;
    }
  });
  return n ? total / n : null;
}

function fmt(value) {
  return typeof value === "number" ? value.toFixed(2) : "—";
}

function fmtWith(value, decimals = 2) {
  return typeof value === "number" ? value.toFixed(decimals) : "—";
}

function pct(value, min, max) {
  if (typeof value !== "number") return 0;
  const clamped = Math.min(max, Math.max(min, value));
  return ((clamped - min) / (max - min)) * 100;
}

function sifsSeverity(value) {
  if (value == null) return "Нет данных для интерпретации.";
  if (value < 1.3) return "минимальная выраженность личностной дисфункции";
  if (value < 1.9) return "лёгкая выраженность личностной дисфункции";
  if (value < 2.5) return "умеренная выраженность личностной дисфункции";
  return "высокая выраженность личностной дисфункции";
}

function opdPercentileFromTotal(total) {
  if (typeof total !== "number" || !Number.isFinite(total)) return null;
  const t = Math.max(0, Math.floor(total));
  if (t >= 37) return 100;
  return OPD_SQS_TOTAL_TO_PERCENTILE[t] ?? OPD_SQS_TOTAL_TO_PERCENTILE[0];
}

function purpleScaleColor(value, min, max) {
  if (typeof value !== "number") return "hsl(262 56% 66%)";
  const ratio = pct(value, min, max) / 100;
  const lightness = 76 - ratio * 48;
  const saturation = 50 + ratio * 32;
  return `hsl(262 ${saturation.toFixed(0)}% ${lightness.toFixed(1)}%)`;
}

function buildResultsModel() {
  const phq = collectScaleValues("phq4", 4, 0, 3);
  const m1 = collectScaleValues("m1", 12, 0, 4);
  const m2Raw = collectScaleValues("m2", 24, 0, 4);
  const m3Raw = collectScaleValues("m3", 15, 1, 5);

  const m2 = scoreWithReverse(m2Raw, M2_REVERSE, 4);
  const m3 = scoreWithReverse(m3Raw, M3_REVERSE, 6);

  const phqAnxiety = sumOf(phq, [1, 2]);
  const phqDepression = sumOf(phq, [3, 4]);
  const phqTotal = sumOf(phq, [1, 2, 3, 4]);

  const opdTotalSum = sumOf(m1, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const opdTotalPercentile = opdPercentileFromTotal(opdTotalSum);

  const sifsIdentity = meanOf(m2, [1, 2, 3, 4, 5, 6, 7]);
  const sifsSelfDirection = meanOf(m2, [8, 9, 10, 11, 12]);
  const sifsEmpathy = meanOf(m2, [13, 14, 15, 16, 17, 18]);
  const sifsIntimacy = meanOf(m2, [19, 20, 21, 22, 23, 24]);
  const sifsTotal = meanOf(m2, Array.from({ length: 24 }, (_, i) => i + 1));

  const bfiExtraversion = meanOf(m3, [1, 6, 11]);
  const bfiAgreeableness = meanOf(m3, [2, 7, 12]);
  const bfiConscientiousness = meanOf(m3, [3, 8, 13]);
  const bfiNegativeEmotionality = meanOf(m3, [4, 9, 14]);
  const bfiOpenness = meanOf(m3, [5, 10, 15]);

  return {
    phqAnxiety,
    phqDepression,
    phqTotal,
    opdTotalSum,
    opdTotalPercentile,
    sifsIdentity,
    sifsSelfDirection,
    sifsEmpathy,
    sifsIntimacy,
    sifsTotal,
    bfiExtraversion,
    bfiAgreeableness,
    bfiConscientiousness,
    bfiNegativeEmotionality,
    bfiOpenness,
  };
}

function renderBarRow(label, value, min, max, decimals = 2) {
  const fillColor = purpleScaleColor(value, min, max);
  return `
    <div class="result-row">
      <div class="result-row__label">${label}</div>
      <div class="result-row__bar">
        <div class="result-row__fill" style="width:${pct(value, min, max)}%; --fill-color:${fillColor};"></div>
      </div>
      <div class="result-row__value">${fmtWith(value, decimals)}</div>
    </div>
  `;
}

function renderMinMaxRow(min, max, decimals = 0) {
  const left = Number(min).toFixed(decimals).replace(/\.0+$/, "");
  const right = Number(max).toFixed(decimals).replace(/\.0+$/, "");
  return `
    <div class="result-threshold-row">
      <div></div>
      <div class="result-threshold-track">
        <span class="threshold-mark threshold-low" style="left:0%; transform:translateX(0);">[${left}</span>
        <span class="threshold-mark threshold-high" style="left:100%; transform:translateX(-100%);">${right}]</span>
      </div>
      <div></div>
    </div>
  `;
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
    <div class="screen-section">
      <article class="screen-card screen-title-box">
        <h1 class="intro-title">Рада вас видеть!</h1>
      </article>

      <article class="screen-card screen-instruction-box">
        <div class="intro-copy">
          <p class="intro-paragraph">
            Меня зовут Ксения Голубь, провожу исследование, посвящённое адаптации Операционализированной психодинамической диагностики (OPD-SQS) и оценке того, насколько корректно и надежно методика работает на русскоязычной выборке. Для анализа пригодности адаптации OPD-SQS в структуру исследования также включены Скрининг тревоги и депрессии (PHQ-4), Шкала личностного и межличностного функционирования (SIFS) и Опросник Большой пятёрки (BFI-2-XS).
          </p>

          <p class="intro-section-title">Что Вам предстоит:</p>
          <ul class="intro-list">
            <li>ответить на несколько блоков вопросов о вашем опыте;</li>
            <li>указать базовую социально-демографическую информацию.</li>
          </ul>

          <p class="intro-paragraph">Обычно заполнение занимает <strong>около 10 минут</strong>.</p>
          <p class="intro-paragraph">
            Ответы будут анализироваться <strong>только в обобщённом виде</strong> в учебных целях. Данные хранятся на защищённом частном сервере, вся информация строго конфиденциальна.
          </p>
          <p class="intro-paragraph">
            <strong>Нет “правильных” и “неправильных” ответов.</strong> Пожалуйста, отвечайте честно, важна именно ваша личная оценка.
          </p>
          <p class="intro-paragraph">
            После завершения <strong>Вы сможете посмотреть и сохранить свои результаты</strong> по пройденным опросникам.
          </p>
          <p class="intro-paragraph">
            Если у Вас есть вопросы об исследовании или обработке данных, вы можете написать:
            <br><strong>kagolub@edu.hse.ru</strong>
          </p>
        </div>
      </article>

      <article class="screen-card">
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
    </div>
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
    <div class="screen-section">
      <article class="screen-card screen-title-box">
        <h2>Общие вопросы</h2>
      </article>

      <article class="screen-card">
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
    </div>
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
    <div class="screen-section">
      <article class="screen-card screen-title-box">
        <h2>${instrument.title}</h2>
      </article>
      <article class="screen-card screen-instruction-box screen-instruction-box--center">
        <p class="lead">${instrument.intro}</p>
      </article>
    </div>
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
    <div class="screen-section">
      <article class="screen-card screen-title-box">
        <h2>Завершение</h2>
      </article>
      <article class="screen-card screen-instruction-box screen-instruction-box--center">
        <p class="lead"><strong>Ура!</strong> Нажмите <strong>«Отправить»</strong> для завершения исследования. Пожалуйста, дождитесь появления окна о том, что ваши ответы отправлены.</p>
      </article>
      ${successHtml}
      ${errorHtml}
    </div>
  `;
}

function renderResults() {
  const r = buildResultsModel();

  screenRoot.innerHTML = `
    <article class="screen-card results-screen">
      <div class="results-top">
        <h2>Результаты</h2>
        <button type="button" id="exportPdfBtn" class="result-export-btn">Скачать PDF</button>
      </div>
      <p class="result-warning"><strong>Важно:</strong> представленные результаты и их интерпретация носят исключительно ознакомительный характер и не заменяют профессиональную психологическую диагностику. Диагностически значимые выводы могут быть сделаны только специалистом на основе полноценного обследования.</p>

      <section class="result-group">
        <div class="result-box result-box--title">
          <h3 class="result-block__title">OPD-SQS</h3>
        </div>
        <div class="result-box">
          ${renderBarRow("Общий балл", r.opdTotalSum, 0, 48, 0)}
          ${renderMinMaxRow(0, 48, 0)}
          <p class="result-note">Процентиль: ${r.opdTotalPercentile == null ? "—" : `${r.opdTotalPercentile}-й`}. Ваш балл выше, чем у ${r.opdTotalPercentile == null ? "—" : r.opdTotalPercentile}% людей в нормативной выборке Германии.</p>
        </div>
        <div class="result-box result-box--danger">
          <p><strong>ВАЖНО:</strong> Нормы приведены по данным исследования на взрослой популяции Германии; для российской версии должны рассчитываться отдельные нормы. Результат предоставлен в ознакомительных и развлекательных целях.</p>
        </div>
        <div class="result-box result-interpretation">
          <h4>Содержательная интерпретация</h4>
          <p>Более высокий балл соответствует более выраженным трудностям в области «структуры» – базовых психологических функций, связанных с самовосприятием и межличностным функционированием. Результат не является диагнозом и не заменяет консультацию специалиста.</p>
        </div>
      </section>

      <section class="result-group">
        <div class="result-box result-box--title">
          <h3 class="result-block__title">PHQ-4</h3>
        </div>
        <div class="result-box">
          ${renderBarRow("Тревога", r.phqAnxiety, 0, 6, 0)}
          ${renderBarRow("Депрессия", r.phqDepression, 0, 6, 0)}
          ${renderMinMaxRow(0, 6, 0)}
          <p class="result-note">Тревога и депрессия считаются клинически значимыми при значениях <strong>≥ 3</strong>.</p>
        </div>
      </section>

      <section class="result-group">
        <div class="result-box result-box--title">
          <h3 class="result-block__title">SIFS</h3>
        </div>
        <div class="result-box">
          ${renderBarRow("Индекс тяжести", r.sifsTotal, 0, 4)}
          ${renderMinMaxRow(0, 4, 0)}
          <p class="result-note">Интерпретация общего индекса: <strong>${sifsSeverity(r.sifsTotal)}</strong>.</p>
        </div>
        <div class="result-box">
          ${renderBarRow("Самосознание", r.sifsIdentity, 0, 4)}
          ${renderBarRow("Самонаправленность", r.sifsSelfDirection, 0, 4)}
          ${renderBarRow("Эмпатия", r.sifsEmpathy, 0, 4)}
          ${renderBarRow("Потребность в доверительных отношениях", r.sifsIntimacy, 0, 4)}
          ${renderMinMaxRow(0, 4, 0)}
        </div>
        <div class="result-box result-interpretation">
          <h4>Содержательная интерпретация</h4>
          <p>Шкала позволяет оценивать тяжесть расстройства личности в опоре на выраженность личностной дисфункции в четырех сферах:</p>
          <ul class="result-list">
            <li><strong>самосознание (Identity)</strong> - переживание самого себя как уникального, с четкими границами между собой и другими; стабильность и точность самооценки; способность и умение регулировать диапазон различных эмоциональных переживаний;</li>
            <li><strong>самонаправленность (Self-direction)</strong> - стремление достигать понятных и осмысленных краткосрочных и жизненных целей; использование конструктивных и просоциальных внутренних стандартов поведения; умение продуктивно рефлексировать;</li>
            <li><strong>эмпатия (Empathy)</strong> - понимание и уважительное отношение к чужим переживаниям и мотивации; терпимость к отличающимся точкам зрения; понимание того, как собственное поведение влияет на других;</li>
            <li><strong>потребность в доверительных отношениях (Intimacy)</strong> - глубина и продолжительность связи с другими; желание и способность к близости; взаимоуважение, отражающееся в межличностном поведении.</li>
          </ul>
        </div>
      </section>

      <section class="result-group">
        <div class="result-box result-box--title">
          <h3 class="result-block__title">BFI-2-XS</h3>
        </div>
        <div class="result-box">
          ${renderBarRow("Экстраверсия", r.bfiExtraversion, 1, 5, 1)}
          ${renderBarRow("Доброжелательность", r.bfiAgreeableness, 1, 5, 1)}
          ${renderBarRow("Добросовестность", r.bfiConscientiousness, 1, 5, 1)}
          ${renderBarRow("Негативная эмоциональность", r.bfiNegativeEmotionality, 1, 5, 1)}
          ${renderBarRow("Открытость опыту", r.bfiOpenness, 1, 5, 1)}
          ${renderMinMaxRow(1, 5, 0)}
        </div>
        <div class="result-box result-interpretation">
          <h4>Содержательная интерпретация</h4>
          <h5>Экстраверсия</h5>
          <p>Набравшие высокие баллы как правило разговорчивы и энергичны. Любят находиться среди людей, чувствуют себя комфортно, заявляя о себе в группах. Склонны иметь много друзей и романтических партнеров, считаются популярными. В основном предпочитают должности, связанные с социальной сферой и предпринимательством и преуспевают в этом. Часто могут организовывать общественную деятельность и заниматься волонтерством. Скорее предпочитают энергичную музыку в стилях хип-хоп и хэви-метал, чаще занимаются физкультурой и играют в спортивные игры. Склонны чаще испытывать позитивные эмоции и более интенсивно реагировать на позитивные события. У женщин, как правило, баллы выше, чем у мужчин.</p>
          <p>Набравшие низкие баллы как правило проявляют социальную и эмоциональную сдержанность. Предпочитают в основном быть в одиночестве или иметь несколько близких друзей, и не делиться своими мнениями и чувствами. Обычно стремятся к работе, требующей самостоятельности больше, чем социальных взаимодействий. Как правило, менее склонны к поиску острых ощущений и рискованному поведению, такому как курение, употребление алкоголя и беспорядочные половые связи.</p>

          <h5>Доброжелательность</h5>
          <p>Набравшие высокие баллы как правило тактичны и вежливы в социальных взаимодействиях, склонны к сотрудничеству. Легко доверяют людям, сострадательны к чужим проблемам. Обычно они нравятся сверстникам и создают удовлетворяющие и стабильные близкие отношения. Как правило, предпочитают работу с людьми и успешны в этом. Более склонны к религиозности, к лидирующим ролям в общественной деятельности и к волонтерству. Обычно предпочитают музыку в стилях поп, фолк. Женщины часто набирают более высокие баллы, чем мужчины, а пожилые набирают более высокие баллы, чем молодые.</p>
          <p>Набравшие низкие баллы склонны выражаться непосредственно и прямо, даже если рискуют вступить в спор. Им нравится соревноваться и они склонны скептически относиться к чужим намерениям. Обычно имеют более высокие заработки и более склонны к рискованному поведению, например курению и агрессивному вождению.</p>

          <h5>Добросовестность</h5>
          <p>Набравшие высокие баллы как правило организованны и ответственны. Они усердно трудятся для достижения своих целей и доводят начатое до конца. Обычно хорошо учатся в школе и преуспевают во многих профессиях. Чаще занимаются физкультурой, как правило обладают лучшей физической формой и дольше живут. Женщины обычно набирают более высокие баллы, чем мужчины, а пожилые набирают более высокие баллы, чем молодые.</p>
          <p>Набравшие низкие баллы склонны скорее действовать спонтанно, чем составлять планы, таким людям легче видеть общую картину, чем обращать внимание на детали. Они предпочитают переключаться с одного задания на другое вместо того, чтобы выполнять их последовательно. Чаще имеют либеральные политические взгляды. Склонны к рискованному поведению, например, курению, употреблению алкоголя и наркотиков, беспорядочным половым связям.</p>

          <h5>Негативная эмоциональность</h5>
          <p>Набравшие высокие баллы как правило эмоционально чувствительны и склонны к перепадам настроения. Они чаще испытывают негативные эмоции и сильнее реагируют на негативные события. Женщины обычно набирают более высокие баллы, чем мужчины, а молодые набирают более высокие баллы, чем пожилые.</p>
          <p>Набравшие низкие баллы как правило эмоционально стабильны и устойчивы. Они обычно остаются спокойными даже в стрессовой ситуации и быстро восстанавливаются после негативных событий. Набравшие низкие баллы обычно ощущают себя более благополучными.</p>

          <h5>Открытость опыту</h5>
          <p>Набравшие высокие баллы обычно открыты новому опыту и новым идеям. Обычно это люди творческие и любознательные, чувствительные к искусству и красоте. Предпочитают заниматься наукой и творчеством и преуспевают в этом. Чаще придерживаются либеральных политических взглядов. В музыке предпочитают классику, джаз, блюз и рок. Могут увлечься наркотиками.</p>
          <p>Набравшие низкие баллы как правило проявляют приверженность традициям, приземленность и склонность придерживаться проверенных способов действия. Предпочитают знакомое новому, конкретное абстрактному. Такие люди предпочитают традиционные и прикладные профессии, преуспевая в них. Чаще имеют консервативные политические взгляды.</p>
        </div>
      </section>
    </article>
  `;

  const exportBtn = document.getElementById("exportPdfBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      window.print();
    });
  }
}

function updateNavState() {
  const screen = getCurrentScreen();
  const isQuestion = screen.type === "question";
  const isSubmit = screen.type === "submit";
  const isResults = screen.type === "results";

  navRow.hidden = isQuestion;

  if (isQuestion) {
    nextBtn.hidden = true;
    prevBtn.hidden = true;
    resultBtn.hidden = true;
    submitBtn.hidden = true;
    return;
  }

  prevBtn.hidden = state.currentScreenIndex === 0;
  prevBtn.disabled = state.submitting;

  if (isSubmit) {
    nextBtn.hidden = true;
    resultBtn.hidden = false;
    resultBtn.disabled = !state.submitted || state.submitting;
    submitBtn.hidden = false;
    submitBtn.disabled = state.submitting || state.submitted;
    return;
  }

  if (isResults) {
    nextBtn.hidden = true;
    submitBtn.hidden = true;
    resultBtn.hidden = true;
    return;
  }

  submitBtn.hidden = true;
  resultBtn.hidden = true;
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
  topHeader.hidden = screen.type !== "intro";

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
  } else if (screen.type === "results") {
    renderResults();
  }

  updateNavState();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleNextClick() {
  const screen = getCurrentScreen();
  if (!canProceed(screen)) {
    if (screen.type === "demographics" && !validAge(state.demographics.age)) {
      alert("Возраст должен быть числом от 18 до 99.");
    }
    return;
  }
  goNext();
}

async function handleSubmit(e) {
  e.preventDefault();

  const screen = getCurrentScreen();
  if (screen.type !== "submit") return;
  if (state.submitted || state.submitting) return;

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
    try {
      await postSubmit(payload);
    } catch (err) {
      if (!isNetworkSubmitError(err)) {
        throw err;
      }
      await sleep(700);
      await postSubmit(payload);
    }

    state.submitted = true;
    state.submitErrorText = "";
    render();
  } catch (err) {
    state.submitErrorText = humanizeSubmitError(err);
    render();
  } finally {
    state.submitting = false;
    updateNavState();
  }
}

prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", handleNextClick);
resultBtn.addEventListener("click", () => {
  const screen = getCurrentScreen();
  if (screen.type === "submit" && state.submitted) {
    goNext();
  }
});
form.addEventListener("submit", handleSubmit);

render();
