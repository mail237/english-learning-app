/**
 * 反復練習用バリエーション問題（q537〜）
 * 実行: node tools/generate-repetition-variations.mjs
 */
import fs from 'fs';

let id = 537;

function qid() {
  return `q${String(id++).padStart(3, '0')}`;
}

function meaning(unit, step, level, sentence, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'meaning', sentence, question, choices, answer, showText: true, vocab };
}
function fillIn(unit, step, level, sentence, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'fill-in', sentence, question, choices, answer, vocab };
}
function wordOrder(unit, step, level, sentence, words, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'word-order', sentence, question: '正しい順番に並べよう', words, answer, vocab };
}
function jpToEn(unit, step, level, japanese, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'jp-to-en', japanese, question: '日本語に合う英文はどれ？', choices, answer, vocab };
}
function listening(unit, step, level, sentence, choices, answer, vocab, question) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'listening',
    sentence,
    question: question ?? '聞こえた英文の意味はどれ？',
    choices,
    answer,
    vocab,
  };
}
function errorDet(unit, step, level, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'error-detection', question, choices, answer, vocab };
}

/** 選択肢の重複を除去（正解は先頭） */
function uniqueChoices(correct, ...rest) {
  const out = [correct];
  for (const c of rest) {
    if (c && c !== correct && !out.includes(c)) out.push(c);
  }
  return out;
}

/** Do/Does 疑問文の誤答（be動詞に置き換え） */
function wrongAuxQuestion(en) {
  if (/\bDoes\b/.test(en)) return en.replace(/\bDoes\b/, 'Is');
  if (/\bdoes\b/.test(en)) return en.replace(/\bdoes\b/, 'is');
  if (/\bDo\b/.test(en)) return en.replace(/\bDo\b/, 'Are');
  if (/\bdo\b/.test(en)) return en.replace(/\bdo\b/, 'are');
  return null;
}

function jpToEnChoices(en) {
  const wrongAux = wrongAuxQuestion(en);
  const wrongPunct = en.endsWith('?') ? `${en.slice(0, -1)}.` : `${en}?`;
  const swaps = [
    [/\byou\b/i, 'we'],
    [/\bhe\b/i, 'she'],
    [/\bshe\b/i, 'he'],
    [/\bthey\b/i, 'we'],
    [/\bI\b/, 'You'],
  ];
  const extras = [wrongAux, wrongPunct];
  for (const [re, rep] of swaps) {
    if (re.test(en)) {
      extras.push(en.replace(re, rep));
      break;
    }
  }
  return uniqueChoices(en, ...extras).slice(0, 3);
}

function errorDetChoices(en) {
  const wrongAux = wrongAuxQuestion(en);
  if (wrongAux) return [en, wrongAux];
  const wrongPunct = en.endsWith('?') ? `${en.slice(0, -1)}.` : `${en}?`;
  return uniqueChoices(en, wrongPunct);
}

function meaningChoices(ja) {
  const candidates = uniqueChoices(
    ja,
    ja.replace(/ています/g, 'ていません'),
    ja.replace(/います/g, 'いません'),
    ja.replace(/しています/g, 'していません'),
    ja.replace(/です/g, 'ではありません'),
    ja.replace(/した/g, 'してい'),
  );
  return candidates.slice(0, 3);
}

function modalJpToEnChoices(correct, wrong) {
  const modals = ['can', 'must', 'may', 'should'];
  const lower = correct.toLowerCase();
  const used = modals.filter((m) => lower.includes(m));
  const alt = modals.find((m) => !used.includes(m) && !wrong.toLowerCase().includes(m));
  let third = null;
  if (alt) {
    for (const m of used) {
      const re = new RegExp(`\\b${m}\\b`, 'i');
      if (re.test(correct)) {
        third = correct.replace(re, (match) =>
          match[0] === match[0].toUpperCase()
            ? alt.charAt(0).toUpperCase() + alt.slice(1)
            : alt,
        );
        break;
      }
    }
  }
  return uniqueChoices(correct, wrong, third).slice(0, 3);
}

function assertUniqueChoices(q) {
  if (!q.choices) return;
  const uniq = new Set(q.choices);
  if (uniq.size !== q.choices.length) {
    throw new Error(`${q.id}: duplicate choices ${JSON.stringify(q.choices)}`);
  }
}

const questions = [];

// ── Unit 1 バリエーション（be動詞）──
const u1Names = ['Ken', 'Yuki', 'Tom', 'Emi', 'Ryo'];
const u1Places = ['Osaka', 'Kyoto', 'Tokyo', 'Kobe', 'Nara'];
u1Names.forEach((name, i) => {
  const step = (i % 3) + 1;
  const level = i % 2 === 0 ? '基礎' : '応用';
  questions.push(
    meaning(1, step, level, `I am ${name}.`, '文の意味は？', [`私は${name}です。`, `あなたは${name}です。`, `彼は${name}です。`], 0, [{ en: name, ja: name }]),
    fillIn(1, step, level, `She ___ ${name}'s sister.`, '___に入るのは？', ['is', 'am', 'are'], 0, [{ en: 'sister', ja: '姉妹' }]),
    wordOrder(1, step, level, `We are from ${u1Places[i]}.`, ['from', u1Places[i], 'are', 'We'], ['We', 'are', 'from', u1Places[i]], [{ en: u1Places[i], ja: u1Places[i] }]),
  );
});

// ── Unit 2 バリエーション（don't / doesn't）──
const u2verbs = [
  ['like', 'music', '音楽', "don't"],
  ['play', 'soccer', 'サッカー', "don't"],
  ['watch', 'TV', 'テレビ', "doesn't"],
  ['eat', 'vegetables', '野菜', "doesn't"],
  ['read', 'comics', '漫画', "doesn't"],
  ['study', 'English', '英語', "don't"],
  ['run', 'every morning', '毎朝走る', "doesn't"],
  ['cook', 'dinner', '夕食', "doesn't"],
];
u2verbs.forEach(([verb, obj, ja, aux], i) => {
  const step = (i % 3) + 1;
  const subj = aux === "doesn't" ? 'He' : 'I';
  const level = i < 3 ? '基礎' : i < 6 ? '応用' : '発展';
  questions.push(
    fillIn(2, step, level, `${subj} ___ ${verb} ${obj}.`, '否定文。___は？', [aux, 'is', aux === "doesn't" ? "don't" : "doesn't"], 0, [{ en: verb, ja }]),
    jpToEn(2, step, level, `${subj === 'He' ? '彼' : '私'}は${ja}をしません。`, [`${subj} ${aux} ${verb} ${obj}.`, `${subj} is not ${verb} ${obj}.`, `${subj} ${verb}s ${obj}.`], 0, [{ en: obj, ja }]),
    wordOrder(2, step, level, `${subj} ${aux} ${verb} ${obj}.`, [obj, verb, aux, subj], [subj, aux, verb, obj], [{ en: obj, ja }]),
  );
});

// ── Unit 3 バリエーション（一般疑問文）──
const u3qs = [
  ['Do you like cats?', 'あなたは猫が好きですか。', 'cats', '猫'],
  ['Does he play tennis?', '彼はテニスをしますか。', 'tennis', 'テニス'],
  ['Do they speak English?', '彼らは英語を話しますか。', 'English', '英語'],
  ['Where do you live?', 'どこに住んでいますか。', 'live', '住む'],
  ['What does she want?', '彼女は何がほしいですか。', 'want', 'ほしい'],
  ['When does the bus come?', 'バスはいつ来ますか。', 'bus', 'バス'],
];
u3qs.forEach(([en, ja, vocabEn, vocabJa], i) => {
  const step = (i % 3) + 1;
  questions.push(
    jpToEn(3, step, i % 2 ? '応用' : '基礎', ja, jpToEnChoices(en), 0, [{ en: vocabEn, ja: vocabJa }]),
    errorDet(3, step, '応用', `「${ja}」正しい英文はどっち？`, errorDetChoices(en), 0, [{ en: vocabEn, ja: vocabJa }]),
  );
});

// ── Unit 4 バリエーション（進行形）──
const u4prog = [
  ['I am studying English.', '英語を勉強しています。', 'studying', '勉強している'],
  ['She is cooking dinner.', '夕食を作っています。', 'cooking', '料理している'],
  ['They are playing soccer.', 'サッカーをしています。', 'playing', 'している'],
  ['He is reading a book.', '本を読んでいます。', 'reading', '読んでいる'],
  ['We are listening to music.', '音楽を聞いています。', 'listening', '聞いている'],
];
const u4wordOrders = [
  ['I am studying English.', ['studying', 'English', 'am', 'I'], ['I', 'am', 'studying', 'English']],
  ['She is cooking dinner.', ['dinner', 'cooking', 'is', 'She'], ['She', 'is', 'cooking', 'dinner']],
  ['They are playing soccer.', ['soccer', 'playing', 'are', 'They'], ['They', 'are', 'playing', 'soccer']],
  ['He is reading a book.', ['book', 'a', 'reading', 'is', 'He'], ['He', 'is', 'reading', 'a', 'book']],
  ['We are listening to music.', ['music', 'to', 'listening', 'are', 'We'], ['We', 'are', 'listening', 'to', 'music']],
];
u4prog.forEach(([en, ja, vEn, vJa], i) => {
  const step = (i % 3) + 1;
  const wo = u4wordOrders[i];
  questions.push(
    meaning(4, step, '応用', en, 'どういう意味？', meaningChoices(ja), 0, [{ en: vEn, ja: vJa }]),
    wordOrder(4, step, '応用', wo[0], wo[1], wo[2], [{ en: vEn, ja: vJa }]),
  );
});

// ── Unit 5 バリエーション（助動詞）──
const u5mod = [
  ['You ___ study hard.', ['must', 'can', 'may'], 0, '一生懸命勉強しなければならない。', 'You must study hard.', 'You can study hard.'],
  ['___ you swim?', ['Can', 'Must', 'May'], 0, '泳げますか。', 'Can you swim?', 'Must you swim?'],
  ['May I ___ here?', ['sit', 'stand', 'run'], 0, 'ここに座ってもいいですか。', 'May I sit here?', 'May I stand here?'],
  ['We ___ help others.', ['should', 'can', 'must'], 0, '他人を助けるべきだ。', 'We should help others.', 'We can help others.'],
];
u5mod.forEach(([sentence, choices, answer, ja, correct, wrong], i) => {
  const step = (i % 3) + 1;
  questions.push(
    fillIn(5, step, '応用', sentence, '___に入るのは？', choices, answer, [{ en: choices[answer], ja: '助動詞' }]),
    jpToEn(5, step, '発展', ja, modalJpToEnChoices(correct, wrong), 0, [{ en: 'modal', ja: '助動詞' }]),
  );
});

// ── 眠気覚ましリスニング（全単元）──
const wakeListening = [
  { en: 'Wake up! Class starts now!', ja: ['起きて！授業が始まるよ！', '寝てていいよ。', '帰っていいよ。'] },
  { en: 'Hey! Are you awake?', ja: ['ねえ！起きてる？', 'ねえ！寝てる？', 'ねえ！帰る？'] },
  { en: 'Open your textbook, please!', ja: ['教科書を開いて！', '教科書を閉じて！', 'ノートを捨てて！'] },
  { en: 'Listen carefully!', ja: ['しっかり聞いて！', '聞かなくていいよ。', '寝ていいよ。'] },
  { en: 'Stand up, please!', ja: ['立ってください！', '座ってください！', '帰ってください！'] },
  { en: "Let's wake up and study!", ja: ['起きて勉強しよう！', '寝て休もう！', '遊ぼう！'] },
  { en: 'Are you ready? Let\'s go!', ja: ['準備できた？いくよ！', '疲れた？休もう！', '帰る？バイバイ！'] },
  { en: 'Time for English!', ja: ['英語の時間だ！', '昼休みだ！', '帰宅の時間だ！'] },
  { en: 'Keep your eyes open!', ja: ['目を開けて！', '目を閉じて！', '寝て！'] },
  { en: "Don't sleep! Listen!", ja: ['寝ないで！聞いて！', '寝ていいよ！', '話していいよ！'] },
  { en: 'Good morning! Are you awake?', ja: ['おはよう！起きてる？', 'こんばんは！', 'おやすみ！'] },
  { en: 'Look at the board!', ja: ['黒板を見て！', '窓の外を見て！', '足元を見て！'] },
  { en: 'Repeat after me!', ja: ['私のあとに続けて！', '黙っていて！', '帰って！'] },
  { en: 'Answer loudly!', ja: ['大きな声で答えて！', '小さな声で！', '答えなくていい！'] },
  { en: 'Focus! English time!', ja: ['集中！英語の時間！', '休憩時間！', '帰る時間！'] },
];

wakeListening.forEach((item, i) => {
  const unit = (i % 5) + 1;
  const step = (i % 3) + 1;
  questions.push(
    listening(
      unit,
      step,
      i % 3 === 0 ? '基礎' : '応用',
      item.en,
      item.ja,
      0,
      [{ en: item.en.split(' ')[0], ja: '眠気覚まし' }],
      '⚡ 聞いて目を覚まそう！意味はどれ？',
    ),
  );
});

// ── 追加リスニング（通常・単元別）──
const extraListen = [
  [1, 1, 'I am a student at this school.', ['私はこの学校の生徒です。', '私は先生です。', '私は校長です。']],
  [1, 2, 'She is not in the classroom.', ['彼女は教室にいません。', '彼女は教室にいます。', '彼女は遅刻です。']],
  [2, 1, "I don't eat breakfast at school.", ['私は学校で朝食を食べません。', '私は学校で食べます。', '私は朝食が好きです。']],
  [2, 3, "He doesn't walk to school.", ['彼は歩いて学校に行きません。', '彼は歩いて行きます。', '彼は走って行きます。']],
  [3, 2, 'What do you do after school?', ['放課後何をしますか。', '学校は何時ですか。', '何年生ですか。']],
  [3, 3, 'Who is your homeroom teacher?', ['担任の先生は誰ですか。', '校長は誰ですか。', '友達は誰ですか。']],
  [4, 1, 'I am talking with my friend.', ['友達と話しています。', '友達と遊んでいます。', '友達を待っています。']],
  [4, 3, 'It is snowing outside.', ['外は雪が降っています。', '外は晴れです。', '外は暑いです。']],
  [5, 2, 'You must wear a uniform.', ['制服を着なければなりません。', '制服を着てはいけません。', '制服はなくていいです。']],
  [5, 3, 'We should practice every day.', ['毎日練習すべきです。', '毎日休むべきです。', '練習しなくていいです。']],
];
extraListen.forEach(([unit, step, en, choices], i) => {
  questions.push(listening(unit, step, '応用', en, choices, 0, [{ en: 'practice', ja: '練習' }]));
});

// ── 意味・空欄の追加バリエーション ──
const misc = [
  meaning(1, 1, '基礎', 'You are my classmate.', 'classmateの意味は？', ['クラスメート', '先生', '校長'], 0, [{ en: 'classmate', ja: 'クラスメート' }]),
  meaning(2, 2, '応用', 'She plays the piano well.', 'wellの意味は？', ['うまく', 'ゆっくり', 'たくさん'], 0, [{ en: 'well', ja: 'うまく' }]),
  meaning(3, 1, '基礎', 'Do you have a question?', 'questionの意味は？', ['質問', '答え', '宿題'], 0, [{ en: 'question', ja: '質問' }]),
  fillIn(3, 2, '応用', '___ do you go to bed?', '___に入るのは？', ['When', 'Where', 'Who'], 0, [{ en: 'bed', ja: 'ベッド' }]),
  fillIn(4, 2, '応用', 'They ___ playing basketball.', '進行形。___は？', ['are', 'is', 'am'], 0, [{ en: 'basketball', ja: 'バスケ' }]),
  errorDet(2, 3, '発展', '「彼女は走りません。」正しいのは？', ["She doesn't run.", 'She is not run.'], 0, [{ en: 'run', ja: '走る' }]),
  errorDet(4, 3, '発展', '「今読んでいない」正しいのは？', ['He is not reading now.', "He doesn't reading now."], 0, [{ en: 'reading', ja: '読んでいる' }]),
  jpToEn(1, 1, '基礎', '彼女は親切です。', ['She is kind.', 'She are kind.', 'She is kindly.'], 0, [{ en: 'kind', ja: '親切な' }]),
  jpToEn(2, 1, '応用', '私たちはピザを食べません。', ["We don't eat pizza.", 'We are not eat pizza.', "We doesn't eat pizza."], 0, [{ en: 'pizza', ja: 'ピザ' }]),
  wordOrder(3, 1, '基礎', 'Do you have a pen?', ['pen', 'a', 'have', 'you', 'Do'], ['Do', 'you', 'have', 'a', 'pen'], [{ en: 'pen', ja: 'ペン' }]),
  wordOrder(5, 1, '応用', 'Can I ask a question?', ['question', 'a', 'ask', 'I', 'Can'], ['Can', 'I', 'ask', 'a', 'question'], [{ en: 'question', ja: '質問' }]),
];
questions.push(...misc);

// JSON-to-TS emit
function emitValue(v, indent = 0) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(v)) {
    if (v.length === 0) return '[]';
    if (typeof v[0] === 'object' && v[0] !== null && 'en' in v[0]) {
      return `[\n${v.map((x) => `${pad}  { en: ${JSON.stringify(x.en)}, ja: ${JSON.stringify(x.ja)} }`).join(',\n')}\n${pad}]`;
    }
    return `[${v.map((x) => (typeof x === 'string' ? JSON.stringify(x) : emitValue(x, indent + 1))).join(', ')}]`;
  }
  if (typeof v === 'object' && v !== null) {
    const lines = Object.entries(v).map(([k, val]) => {
      if (k === 'type' || k === 'level') return `${pad}  ${k}: ${JSON.stringify(val)}`;
      if (k === 'showText') return `${pad}  showText: true`;
      return `${pad}  ${k}: ${emitValue(val, indent + 1)}`;
    });
    return `{\n${lines.join(',\n')}\n${pad}}`;
  }
  return JSON.stringify(v);
}

const tsLines = [
  '/** 反復練習バリエーション（自動生成）— tools/generate-repetition-variations.mjs */',
  "import type { Question } from '../../types';",
  '',
  'export const REPETITION_VARIATION_QUESTIONS: Question[] = [',
  ...questions.map((q) => emitValue(q, 1) + ','),
  '];',
  '',
];

for (const q of questions) {
  assertUniqueChoices(q);
}

fs.writeFileSync('src/data/questions/repetitionVariations.ts', tsLines.join('\n'));
console.log(`Generated ${questions.length} variation questions (q537–q${id - 1})`);
