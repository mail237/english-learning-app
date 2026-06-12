/**
 * be動詞 vs 一般動詞 定着ドリル（Unit 4〜8 でもスパイラル復習に出る）
 * 実行: node tools/generate-be-general-spiral.mjs
 */
import fs from 'fs';
import { assertUniqueChoices } from './choice-helpers.mjs';

let id = 837;

function qid() {
  return `q${String(id++).padStart(3, '0')}`;
}

function meaning(unit, step, level, sentence, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'meaning', sentence, question, choices, answer, showText: true, vocab };
}
function fillIn(unit, step, level, sentence, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'fill-in', sentence, question, choices, answer, vocab };
}
function errorDet(unit, step, level, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'error-detection', question, choices, answer, vocab };
}
function jpToEn(unit, step, level, japanese, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'jp-to-en', japanese, question: '日本語に合う英文はどれ？', choices, answer, vocab };
}
function listening(unit, step, level, sentence, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'listening', sentence, question: '聞こえた英文の意味はどれ？', choices, answer, vocab };
}

const drills = [
  [4, 1, '基礎', 'meaning', 'She is reading now. / She reads books.', 'be動詞と一般動詞、今していることはどっち？', ['She is reading now.', 'She reads books every day.', 'She read books now.'], 0, 'reading', '読んでいる'],
  [4, 1, '応用', 'error-detection', '「彼は今忙しいです。」be動詞の文はどっち？', ['He is busy now.', 'He does busy now.'], 0, 'busy', '忙しい'],
  [4, 2, '応用', 'fill-in', 'They ___ playing soccer now.（進行形＝be動詞）', '___に入るのは？', ['are', 'do', 'does'], 0, 'playing', 'している'],
  [4, 2, '発展', 'jp-to-en', '彼女は毎日ピアノを練習します。（一般動詞）', ['She practices the piano every day.', 'She is practicing the piano every day.', 'She practice the piano every day.'], 0, 'practices', '練習する'],
  [4, 3, '発展', 'error-detection', '「今テレビを見ている」と「毎日テレビを見る」正しいのはどっち？', ['He is watching TV now. / He watches TV every day.', 'He does watching TV now. / He is watch TV every day.'], 0, 'watch', '見る'],

  [5, 1, '基礎', 'meaning', 'Are you ready? / Do you play tennis?', 'be動詞の疑問文はどっち？', ['Are you ready?', 'Do you ready?', 'Does you ready?'], 0, 'ready', '準備ができた'],
  [5, 1, '応用', 'fill-in', '___ you a student?（be動詞）', '___に入るのは？', ['Are', 'Do', 'Does'], 0, 'student', '生徒'],
  [5, 2, '応用', 'error-detection', '「ここで走ってはいけません」一般動詞の否定はどっち？', ["You must not run here.", 'You must not are run here.'], 0, 'run', '走る'],
  [5, 2, '発展', 'listening', "Is she at home? / Does she study at home?", ['彼女は家にいますか。', '彼女は家で勉強しますか。', '彼女は家が好きですか。'], 0, 'home', '家'],
  [5, 3, '発展', 'jp-to-en', 'あなたは疲れていますか。（be動詞）', ['Are you tired?', 'Do you tired?', 'Does you tired?'], 0, 'tired', '疲れた'],

  [6, 1, '基礎', 'error-detection', '「彼は昨日学校に行きました」一般動詞の過去形はどっち？', ['He went to school yesterday.', 'He was go to school yesterday.'], 0, 'went', '行った'],
  [6, 1, '応用', 'meaning', 'He was sick yesterday. / He went to the doctor.', 'be動詞の過去形はどっち？', ['He was sick yesterday.', 'He did sick yesterday.', 'He were sick yesterday.'], 0, 'sick', '病気の'],
  [6, 2, '応用', 'fill-in', '___ you at the park yesterday?（be動詞の過去）', '___に入るのは？', ['Were', 'Did', 'Do'], 0, 'park', '公園'],
  [6, 2, '発展', 'error-detection', 'be動詞と一般動詞の過去、正しいのはどっち？', ['She was happy. / She played soccer.', 'She did happy. / She was play soccer.'], 0, 'happy', 'うれしい'],
  [6, 3, '発展', 'jp-to-en', '彼はその本を読みませんでした。（一般動詞）', ["He didn't read the book.", 'He was not read the book.', "He didn't reading the book."], 0, 'read', '読む'],

  [7, 1, '基礎', 'meaning', 'She will be a doctor. / She will study medicine.', 'be動詞を使う未来形はどっち？', ['She will be a doctor.', 'She will studies medicine.', 'She will is a doctor.'], 0, 'doctor', '医者'],
  [7, 1, '応用', 'error-detection', '「明日は晴れでしょう」be動詞の未来形はどっち？', ['It will be sunny tomorrow.', 'It will sunny tomorrow.'], 0, 'sunny', '晴れ'],
  [7, 2, '応用', 'fill-in', '___ they going to be late?（be動詞）', '___に入るのは？', ['Are', 'Do', 'Does'], 0, 'late', '遅刻した'],
  [7, 2, '発展', 'listening', 'Will you be free tonight? / Will you play games tonight?', ['今夜ひまですか。', '今夜ゲームをしますか。', '今夜ゲームが好きですか。'], 0, 'free', 'ひまな'],
  [7, 3, '発展', 'jp-to-en', '私たちは友達になります。（be動詞）', ['We will be friends.', 'We will are friends.', 'We will become friends.'], 0, 'friends', '友達'],

  [8, 1, '基礎', 'error-detection', '「彼は私より背が高い」be動詞を使った文はどっち？', ['He is taller than me.', 'He does taller than me.'], 0, 'taller', 'より背が高い'],
  [8, 1, '応用', 'meaning', 'She is good at math. / She likes math.', 'be動詞で能力を表すのはどっち？', ['She is good at math.', 'She does good at math.', 'She likes good at math.'], 0, 'good', '得意な'],
  [8, 2, '応用', 'fill-in', '___ you interested in music?（be動詞）', '___に入るのは？', ['Are', 'Do', 'Does'], 0, 'interested', '興味がある'],
  [8, 2, '発展', 'error-detection', 'be動詞と一般動詞、正しい組み合わせはどっち？', ['Is he kind? / Does he help you?', 'Does he kind? / Is he help you?'], 0, 'kind', '親切な'],
  [8, 3, '発展', 'jp-to-en', '彼女はクラスで一番歌が上手です。（be動詞）', ['She is the best singer in her class.', 'She does the best singer in her class.', 'She is best singer in her class.'], 0, 'singer', '歌手'],
];

const questions = drills.map(([unit, step, level, type, ...rest]) => {
  if (type === 'meaning') {
    const [sentence, question, choices, answer, vEn, vJa] = rest;
    return meaning(unit, step, level, sentence, question, choices, answer, [{ en: vEn, ja: vJa }]);
  }
  if (type === 'fill-in') {
    const [sentence, question, choices, answer, vEn, vJa] = rest;
    return fillIn(unit, step, level, sentence, question, choices, answer, [{ en: vEn, ja: vJa }]);
  }
  if (type === 'error-detection') {
    const [question, choices, answer, vEn, vJa] = rest;
    return errorDet(unit, step, level, question, choices, answer, [{ en: vEn, ja: vJa }]);
  }
  if (type === 'jp-to-en') {
    const [japanese, choices, answer, vEn, vJa] = rest;
    return jpToEn(unit, step, level, japanese, choices, answer, [{ en: vEn, ja: vJa }]);
  }
  const [sentence, choices, answer, vEn, vJa] = rest;
  return listening(unit, step, level, sentence, choices, answer, [{ en: vEn, ja: vJa }]);
});

for (const q of questions) assertUniqueChoices(q);

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
  '/** be動詞 vs 一般動詞 定着ドリル（自動生成）— tools/generate-be-general-spiral.mjs */',
  "import type { Question } from '../../types';",
  '',
  'export const BE_GENERAL_SPIRAL_QUESTIONS: Question[] = [',
  ...questions.map((q) => emitValue(q, 1) + ','),
  '];',
  '',
];

fs.writeFileSync('src/data/questions/beGeneralSpiral.ts', tsLines.join('\n'));
console.log(`Generated ${questions.length} be/general spiral drills (q837–q${id - 1})`);
