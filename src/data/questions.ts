import type { Question } from '../types';
import { ADDITIONAL_QUESTIONS } from './questions/additional';
import { ADDITIONAL_QUESTIONS_2 } from './questions/additional2';
import { QA_NEGATIVE_QUESTIONS } from './questions/qaNegative';
import { REPETITION_VARIATION_QUESTIONS } from './questions/repetitionVariations';
import { UNIT6_PLUS_QUESTIONS } from './questions/unit6plus';
import { BE_GENERAL_SPIRAL_QUESTIONS } from './questions/beGeneralSpiral';

const BASE_QUESTIONS: Question[] = [
  // Unit 1 - Step 1
  { id: 'q001', unit: 1, step: 1, level: '基礎', type: 'meaning', sentence: 'I am Ken.', question: 'Kenって誰のこと？', choices: ['私', 'あなた', '彼'], answer: 0, showText: true },
  { id: 'q002', unit: 1, step: 1, level: '基礎', type: 'word-order', sentence: 'I am Ken.', question: '正しい順番に並べよう', words: ['am', 'I', 'Ken'], answer: ['I', 'am', 'Ken'] },
  { id: 'q003', unit: 1, step: 1, level: '基礎', type: 'fill-in', sentence: 'I ___ Ken.', question: '___に入る単語はどれ？', choices: ['am', 'is', 'are'], answer: 0 },
  { id: 'q004', unit: 1, step: 1, level: '基礎', type: 'meaning', sentence: 'You are my friend.', question: '「my friend」は誰の友達？', choices: ['私の', 'あなたの', '彼の'], answer: 1, showText: true },
  { id: 'q005', unit: 1, step: 1, level: '基礎', type: 'jp-to-en', japanese: '私はケンです。', question: '日本語に合う英文はどれ？', choices: ['I am Ken.', 'You are Ken.', 'I am happy.'], answer: 0 },
  { id: 'q006', unit: 1, step: 1, level: '基礎', type: 'error-detection', question: '正しい英文はどっち？', choices: ['I am Ken.', 'I is Ken.'], answer: 0 },
  // Unit 1 - Step 2
  { id: 'q007', unit: 1, step: 2, level: '基礎', type: 'meaning', sentence: 'She is a student.', question: 'Sheは何者？', choices: ['先生', '生徒', '医者'], answer: 1, showText: true },
  { id: 'q008', unit: 1, step: 2, level: '基礎', type: 'word-order', sentence: 'She is a student.', question: '正しい順番に並べよう', words: ['student', 'a', 'is', 'She'], answer: ['She', 'is', 'a', 'student'] },
  { id: 'q009', unit: 1, step: 2, level: '基礎', type: 'fill-in', sentence: 'He ___ tall.', question: '___に入る単語はどれ？', choices: ['am', 'is', 'are'], answer: 1 },
  { id: 'q010', unit: 1, step: 2, level: '基礎', type: 'meaning', sentence: 'I am happy.', question: 'どんな気持ち？', choices: ['うれしい', '悲しい', '怒っている'], answer: 0, showText: true },
  { id: 'q011', unit: 1, step: 2, level: '応用', type: 'listening', sentence: 'We are in the classroom.', question: '聞こえた英文の意味はどれ？', choices: ['私たちは教室にいます。', '私たちは家にいます。', '私たちは公園にいます。'], answer: 0 },
  // Unit 1 - Step 3
  { id: 'q012', unit: 1, step: 3, level: '応用', type: 'jp-to-en', japanese: '彼らは日本出身です。', question: '日本語に合う英文はどれ？', choices: ['They are from Japan.', 'They are in Japan.', 'They like Japan.'], answer: 0 },
  { id: 'q013', unit: 1, step: 3, level: '応用', type: 'meaning', sentence: 'They are from Japan.', question: 'Theyはどこの出身？', choices: ['アメリカ', '日本', 'イギリス'], answer: 1, showText: true },
  { id: 'q014', unit: 1, step: 3, level: '応用', type: 'error-detection', question: '正しい英文はどっち？', choices: ['It is a cat.', 'It are a cat.'], answer: 0 },
  { id: 'q015', unit: 1, step: 3, level: '応用', type: 'listening', sentence: 'It is a cat.', question: '聞こえた英文の意味はどれ？', choices: ['それは猫です。', 'それは犬です。', 'それは鳥です。'], answer: 0 },

  // Unit 2 - Step 1
  { id: 'q016', unit: 2, step: 1, level: '基礎', type: 'meaning', sentence: 'I like music.', question: '何が好き？', choices: ['スポーツ', '音楽', '映画'], answer: 1, showText: true },
  { id: 'q017', unit: 2, step: 1, level: '基礎', type: 'word-order', sentence: 'I play soccer.', question: '正しい順番に並べよう', words: ['soccer', 'play', 'I'], answer: ['I', 'play', 'soccer'] },
  { id: 'q018', unit: 2, step: 1, level: '基礎', type: 'fill-in', sentence: 'He ___ soccer.', question: '___に入る単語はどれ？', choices: ['play', 'plays', 'playing'], answer: 1 },
  { id: 'q019', unit: 2, step: 1, level: '基礎', type: 'meaning', sentence: 'He plays soccer.', question: 'Heは何をする？', choices: ['サッカーをする', '泳ぐ', '走る'], answer: 0, showText: true },
  { id: 'q020', unit: 2, step: 1, level: '基礎', type: 'jp-to-en', japanese: '彼女は本を読みます。', question: '日本語に合う英文はどれ？', choices: ['She reads books.', 'She writes books.', 'She buys books.'], answer: 0 },
  // Unit 2 - Step 2
  { id: 'q021', unit: 2, step: 2, level: '基礎', type: 'meaning', sentence: 'I eat breakfast every morning.', question: 'いつ朝ごはんを食べる？', choices: ['毎朝', '毎晩', '週に1回'], answer: 0, showText: true },
  { id: 'q022', unit: 2, step: 2, level: '応用', type: 'listening', sentence: 'My father works at a hospital.', question: '聞こえた英文の意味はどれ？', choices: ['父は病院で働きます。', '父は学校で働きます。', '父は会社で働きます。'], answer: 0 },
  { id: 'q023', unit: 2, step: 2, level: '応用', type: 'error-detection', question: '「彼女は本を読みます。」正しい英文はどっち？', choices: ['She reads books.', 'She read books every day.'], answer: 0 },
  { id: 'q024', unit: 2, step: 2, level: '応用', type: 'fill-in', sentence: 'We ___ TV after dinner.', question: '___に入る単語はどれ？', choices: ['watch', 'watches', 'watching'], answer: 0 },
  // Unit 2 - Step 3
  { id: 'q025', unit: 2, step: 3, level: '応用', type: 'word-order', sentence: 'Tom goes to school by bus.', question: '正しい順番に並べよう', words: ['bus', 'by', 'school', 'to', 'goes', 'Tom'], answer: ['Tom', 'goes', 'to', 'school', 'by', 'bus'] },
  { id: 'q026', unit: 2, step: 3, level: '応用', type: 'meaning', sentence: 'Tom goes to school by bus.', question: 'Tomはどうやって学校へ行く？', choices: ['歩いて', 'バスで', '自転車で'], answer: 1, showText: true },
  { id: 'q027', unit: 2, step: 3, level: '発展', type: 'jp-to-en', japanese: '彼女は時々お母さんを手伝います。', question: '日本語に合う英文はどれ？', choices: ['She sometimes helps her mother.', 'She always helps her mother.', 'She never helps her mother.'], answer: 0 },
  { id: 'q028', unit: 2, step: 3, level: '発展', type: 'listening', sentence: 'She sometimes helps her mother.', question: '聞こえた英文の意味はどれ？', choices: ['彼女は時々お母さんを手伝います。', '彼女はいつもお母さんを手伝います。', '彼女はお母さんを探します。'], answer: 0 },

  // Unit 3 - Step 1
  { id: 'q029', unit: 3, step: 1, level: '基礎', type: 'meaning', sentence: 'Do you like pizza?', question: '何について聞いている？', choices: ['ピザが好きか', 'ピザを食べたか', 'ピザを作れるか'], answer: 0, showText: true },
  { id: 'q030', unit: 3, step: 1, level: '基礎', type: 'fill-in', sentence: '___ is your name?', question: '___に入る単語はどれ？', choices: ['What', 'Where', 'When'], answer: 0 },
  { id: 'q031', unit: 3, step: 1, level: '基礎', type: 'word-order', sentence: 'Where do you live?', question: '正しい順番に並べよう', words: ['live', 'you', 'do', 'Where'], answer: ['Where', 'do', 'you', 'live'] },
  { id: 'q032', unit: 3, step: 1, level: '基礎', type: 'error-detection', question: '正しい英文はどっち？', choices: ['Do you like pizza?', 'Does you like pizza?'], answer: 0 },
  // Unit 3 - Step 2
  { id: 'q033', unit: 3, step: 2, level: '応用', type: 'meaning', sentence: 'Does he play tennis?', question: 'Heについて何を聞いている？', choices: ['テニスをするか', 'テニスが好きか', 'テニスが上手か'], answer: 0, showText: true },
  { id: 'q034', unit: 3, step: 2, level: '応用', type: 'listening', sentence: 'How old are you?', question: '聞こえた英文の意味はどれ？', choices: ['あなたは何歳ですか。', 'あなたの名前は何ですか。', 'あなたはどこに住んでいますか。'], answer: 0 },
  { id: 'q035', unit: 3, step: 2, level: '応用', type: 'jp-to-en', japanese: '誕生日はいつですか。', question: '日本語に合う英文はどれ？', choices: ['When is your birthday?', 'What is your birthday?', 'Where is your birthday?'], answer: 0 },
  { id: 'q036', unit: 3, step: 2, level: '応用', type: 'fill-in', sentence: 'When ___ your birthday?', question: '___に入る単語はどれ？', choices: ['is', 'are', 'am'], answer: 0 },
  // Unit 3 - Step 3
  { id: 'q037', unit: 3, step: 3, level: '発展', type: 'meaning', sentence: 'Why do you study English?', question: '何を聞いている？', choices: ['理由', '方法', '時間'], answer: 0, showText: true },
  { id: 'q038', unit: 3, step: 3, level: '発展', type: 'word-order', sentence: 'Who is your favorite singer?', question: '正しい順番に並べよう', words: ['singer', 'favorite', 'your', 'is', 'Who'], answer: ['Who', 'is', 'your', 'favorite', 'singer'] },
  { id: 'q039', unit: 3, step: 3, level: '発展', type: 'listening', sentence: 'Who is your favorite singer?', question: '聞こえた英文の意味はどれ？', choices: ['好きな歌手は誰？', '好きな曲は何？', '好きな映画は何？'], answer: 0 },
  { id: 'q040', unit: 3, step: 3, level: '発展', type: 'error-detection', question: '正しい英文はどっち？', choices: ['Why do you study English?', 'Why does you study English?'], answer: 0 },

  // Unit 4
  { id: 'q041', unit: 4, step: 1, level: '基礎', type: 'meaning', sentence: 'I am studying now.', question: '今何をしている？', choices: ['勉強している', '遊んでいる', '寝ている'], answer: 0, showText: true },
  { id: 'q042', unit: 4, step: 1, level: '基礎', type: 'word-order', sentence: 'She is cooking dinner.', question: '正しい順番に並べよう', words: ['dinner', 'cooking', 'is', 'She'], answer: ['She', 'is', 'cooking', 'dinner'] },
  { id: 'q043', unit: 4, step: 1, level: '基礎', type: 'fill-in', sentence: 'I ___ studying now.', question: '___に入る単語はどれ？', choices: ['am', 'is', 'are'], answer: 0 },
  { id: 'q044', unit: 4, step: 2, level: '応用', type: 'listening', sentence: 'They are playing in the park.', question: '聞こえた英文の意味はどれ？', choices: ['彼らは公園で遊んでいます。', '彼らは学校で遊んでいます。', '彼らは家で遊んでいます。'], answer: 0 },
  { id: 'q045', unit: 4, step: 2, level: '応用', type: 'jp-to-en', japanese: '彼はテレビを見ていません。', question: '日本語に合う英文はどれ？', choices: ['He is not watching TV.', 'He is watching TV.', 'He does not watch TV.'], answer: 0 },
  { id: 'q046', unit: 4, step: 2, level: '応用', type: 'error-detection', question: '正しい英文はどっち？', choices: ['They are playing in the park.', 'They is playing in the park.'], answer: 0 },
  { id: 'q047', unit: 4, step: 3, level: '発展', type: 'meaning', sentence: 'What are you doing?', question: '何を聞いている？', choices: ['今していること', '昨日したこと', '明日すること'], answer: 0, showText: true },
  { id: 'q048', unit: 4, step: 3, level: '発展', type: 'listening', sentence: 'It is raining outside.', question: '聞こえた英文の意味はどれ？', choices: ['外は雨です。', '外は晴れです。', '外は雪です。'], answer: 0 },

  // Unit 5
  { id: 'q049', unit: 5, step: 1, level: '基礎', type: 'meaning', sentence: 'I can swim.', question: '何ができる？', choices: ['泳ぐ', '走る', '飛ぶ'], answer: 0, showText: true },
  { id: 'q050', unit: 5, step: 1, level: '基礎', type: 'word-order', sentence: 'She can speak English.', question: '正しい順番に並べよう', words: ['English', 'speak', 'can', 'She'], answer: ['She', 'can', 'speak', 'English'] },
  { id: 'q051', unit: 5, step: 1, level: '基礎', type: 'fill-in', sentence: 'I ___ swim.', question: '___に入る単語はどれ？', choices: ['can', 'do', 'am'], answer: 0 },
  { id: 'q052', unit: 5, step: 2, level: '応用', type: 'jp-to-en', japanese: '手伝ってくれますか。', question: '日本語に合う英文はどれ？', choices: ['Can you help me?', 'Do you help me?', 'Are you help me?'], answer: 0 },
  { id: 'q053', unit: 5, step: 2, level: '応用', type: 'listening', sentence: 'You must finish your homework.', question: '聞こえた英文の意味はどれ？', choices: ['宿題を終えなければならない。', '宿題をしてもいい。', '宿題はない。'], answer: 0 },
  { id: 'q054', unit: 5, step: 2, level: '応用', type: 'error-detection', question: '正しい英文はどっち？', choices: ['Can you help me?', 'Can you helps me?'], answer: 0 },
  { id: 'q055', unit: 5, step: 3, level: '発展', type: 'meaning', sentence: 'May I use your pen?', question: '何を許可してもらいたい？', choices: ['ペンを使う', 'ペンを借りる', 'ペンを買う'], answer: 0, showText: true },
  { id: 'q056', unit: 5, step: 3, level: '発展', type: 'word-order', sentence: 'We should study harder.', question: '正しい順番に並べよう', words: ['harder', 'study', 'should', 'We'], answer: ['We', 'should', 'study', 'harder'] },
  { id: 'q057', unit: 5, step: 3, level: '発展', type: 'fill-in', sentence: 'We ___ study harder.', question: '___に入る単語はどれ？', choices: ['should', 'can', 'may'], answer: 0 },
  { id: 'q058', unit: 5, step: 3, level: '発展', type: 'listening', sentence: 'We should study harder.', question: '聞こえた英文の意味はどれ？', choices: ['もっと勉強すべきです。', 'もっと遊ぶべきです。', 'もっと休むべきです。'], answer: 0 },
];

export const QUESTIONS: Question[] = [
  ...BASE_QUESTIONS,
  ...ADDITIONAL_QUESTIONS,
  ...ADDITIONAL_QUESTIONS_2,
  ...QA_NEGATIVE_QUESTIONS,
  ...REPETITION_VARIATION_QUESTIONS,
  ...UNIT6_PLUS_QUESTIONS,
  ...BE_GENERAL_SPIRAL_QUESTIONS,
];

export function getQuestionsByUnit(unit: number): Question[] {
  return QUESTIONS.filter((q) => q.unit === unit);
}

export function getQuestionsByUnitAndStep(unit: number, step: number): Question[] {
  return QUESTIONS.filter((q) => q.unit === unit && q.step === step);
}

export function getQuestionsBeforeStep(unit: number, step: number): Question[] {
  return QUESTIONS.filter((q) => q.unit < unit || (q.unit === unit && q.step < step));
}

export function getQuestionsUpToUnit(unit: number): Question[] {
  return QUESTIONS.filter((q) => q.unit <= unit);
}

export function getPreviousUnitQuestions(unit: number): Question[] {
  return QUESTIONS.filter((q) => q.unit < unit);
}
