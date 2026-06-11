/**
 * be動詞 vs 一般動詞の「疑問文・否定文」対比問題（q349〜）
 * 実行: node tools/generate-qa-negative-questions.mjs
 */
import fs from 'fs';

let id = 349;

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
function listening(unit, step, level, sentence, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'listening', sentence, question: '聞こえた英文の意味はどれ？', choices, answer, vocab };
}
function errorDet(unit, step, level, question, choices, answer, vocab) {
  return { id: qid(), unit, step, level, type: 'error-detection', question, choices, answer, vocab };
}

const questions = [];

// ══════════════════════════════════════════════════════════════
// Unit 1 — be動詞の否定文（is not / are not / am not）
// ══════════════════════════════════════════════════════════════
questions.push(
  meaning(1, 2, '基礎', 'I am not tired.', 'この文は何の文？', ['be動詞の否定文', '一般動詞の否定文', '疑問文'], 0, [{ en: 'tired', ja: '疲れた' }]),
  fillIn(1, 2, '基礎', 'I ___ not hungry.', '否定文。___に入るのは？', ['am', 'do', 'does'], 0, [{ en: 'hungry', ja: 'お腹がすいた' }]),
  wordOrder(1, 2, '基礎', 'I am not sad.', ['sad', 'not', 'am', 'I'], ['I', 'am', 'not', 'sad'], [{ en: 'sad', ja: '悲しい' }]),
  jpToEn(1, 2, '基礎', '私は怒っていません。', ['I am not angry.', 'I do not angry.', 'I am angry.'], 0, [{ en: 'angry', ja: '怒った' }]),
  errorDet(1, 2, '基礎', '「私は忙しくない。」be動詞の否定文はどっち？', ['I am not busy.', 'I do not busy.'], 0, [{ en: 'busy', ja: '忙しい' }]),
  fillIn(1, 2, '基礎', 'He ___ not a doctor.', 'be動詞の否定文。___は？', ['is', 'does', 'do'], 0, [{ en: 'doctor', ja: '医者' }]),
  meaning(1, 2, '応用', 'She is not at home.', 'どういう意味？', ['家にいない', '家にいる', '家に帰る'], 0, [{ en: 'at home', ja: '家に' }]),
  wordOrder(1, 2, '応用', 'He is not sick.', ['sick', 'not', 'is', 'He'], ['He', 'is', 'not', 'sick'], [{ en: 'sick', ja: '病気の' }]),
  jpToEn(1, 2, '応用', '彼女は学生ではありません。', ['She is not a student.', 'She does not a student.', 'She is a student.'], 0, [{ en: 'student', ja: '生徒' }]),
  errorDet(1, 2, '応用', 'be動詞の否定文として正しいのはどっち？', ['He is not tall.', 'He does not tall.'], 0, [{ en: 'tall', ja: '背が高い' }]),
  fillIn(1, 2, '応用', 'She ___ not happy today.', '___に入るのは？', ['is', 'does', 'do'], 0, [{ en: 'happy', ja: 'うれしい' }]),
  listening(1, 2, '応用', 'We are not late.', ['私たちは遅刻していません。', '私たちは遅刻しています。', '私たちは遅れません。'], 0, [{ en: 'late', ja: '遅い' }]),
  meaning(1, 2, '応用', 'They are not from Tokyo.', 'どういう意味？', ['東京出身ではない', '東京にいない', '東京が好きではない'], 0, [{ en: 'Tokyo', ja: '東京' }]),
  wordOrder(1, 2, '応用', 'We are not ready.', ['ready', 'not', 'are', 'We'], ['We', 'are', 'not', 'ready'], [{ en: 'ready', ja: '準備ができた' }]),
  jpToEn(1, 2, '応用', '私たちは同じクラスではありません。', ['We are not in the same class.', 'We do not in the same class.', 'We are in the same class.'], 0, [{ en: 'same class', ja: '同じクラス' }]),
  errorDet(1, 2, '発展', '「彼らは先生ではない。」正しい英文はどっち？', ['They are not teachers.', 'They do not teachers.'], 0, [{ en: 'teachers', ja: '先生たち' }]),
  fillIn(1, 2, '発展', 'You ___ not wrong.', 'be動詞の否定。___は？', ['are', 'do', 'does'], 0, [{ en: 'wrong', ja: '間違った' }]),
  meaning(1, 2, '発展', 'It is not expensive.', 'どういう意味？', ['高くない', '高い', '安くない'], 0, [{ en: 'expensive', ja: '高い' }]),
);

// Unit 1 Step 3 — be動詞の疑問文（Am/Are/Is + 主語）
questions.push(
  meaning(1, 3, '基礎', 'Are you a student?', 'この文は何の文？', ['be動詞の疑問文', '一般動詞の疑問文', '否定文'], 0, [{ en: 'student', ja: '生徒' }]),
  fillIn(1, 3, '基礎', '___ you happy?', 'be動詞の疑問文。___は？', ['Are', 'Do', 'Does'], 0, [{ en: 'happy', ja: 'うれしい' }]),
  wordOrder(1, 3, '基礎', 'Are you ready?', ['ready', 'you', 'Are'], ['Are', 'you', 'ready'], [{ en: 'ready', ja: '準備ができた' }]),
  jpToEn(1, 3, '基礎', 'あなたは中学生ですか。', ['Are you a junior high school student?', 'Do you a junior high school student?', 'Is you a student?'], 0, [{ en: 'junior high school', ja: '中学校' }]),
  errorDet(1, 3, '基礎', 'be動詞の疑問文として正しいのはどっち？', ['Is he your brother?', 'Does he your brother?'], 0, [{ en: 'brother', ja: '兄弟' }]),
  fillIn(1, 3, '基礎', '___ she your teacher?', '___に入るのは？', ['Is', 'Does', 'Do'], 0, [{ en: 'teacher', ja: '先生' }]),
  meaning(1, 3, '応用', 'Is it cold today?', '何を聞いている？', ['今日は寒いか', '今日は暑いか', '今日は何日か'], 0, [{ en: 'cold', ja: '寒い' }]),
  wordOrder(1, 3, '応用', 'Is she at school?', ['school', 'at', 'she', 'Is'], ['Is', 'she', 'at', 'school'], [{ en: 'school', ja: '学校' }]),
  jpToEn(1, 3, '応用', '彼はケンですか。', ['Is he Ken?', 'Does he Ken?', 'Are he Ken?'], 0, [{ en: 'Ken', ja: 'ケン' }]),
  errorDet(1, 3, '応用', '「彼女は元気ですか。」正しい英文はどっち？', ['Is she fine?', 'Does she fine?'], 0, [{ en: 'fine', ja: '元気な' }]),
  fillIn(1, 3, '応用', '___ they from Japan?', '___に入るのは？', ['Are', 'Do', 'Does'], 0, [{ en: 'Japan', ja: '日本' }]),
  listening(1, 3, '応用', 'Am I right?', ['私の言っていることは正しいですか。', 'あなたは正しいですか。', '彼は正しいですか。'], 0, [{ en: 'right', ja: '正しい' }]),
  meaning(1, 3, '応用', 'Are they your friends?', '何を聞いている？', ['彼らは友達か', '彼らはどこか', '彼らは何歳か'], 0, [{ en: 'friends', ja: '友達' }]),
  wordOrder(1, 3, '応用', 'Are we late?', ['late', 'we', 'Are'], ['Are', 'we', 'late'], [{ en: 'late', ja: '遅い' }]),
  jpToEn(1, 3, '応用', 'それはあなたのかばんですか。', ['Is that your bag?', 'Does that your bag?', 'Are that your bag?'], 0, [{ en: 'bag', ja: 'かばん' }]),
  errorDet(1, 3, '発展', 'be動詞の疑問文。正しいのはどっち？', ['Are you hungry?', 'Do you hungry?'], 0, [{ en: 'hungry', ja: 'お腹がすいた' }]),
  fillIn(1, 3, '発展', '___ I late?', '___に入るのは？', ['Am', 'Do', 'Does'], 0, [{ en: 'late', ja: '遅い' }]),
  meaning(1, 3, '発展', 'Is this your pen?', 'be動詞の疑問文の語順は？', ['Is + 主語 + ...', '主語 + do + ...', '主語 + is + not'], 0, [{ en: 'pen', ja: 'ペン' }]),
);

// ══════════════════════════════════════════════════════════════
// Unit 2 — 一般動詞の否定文（don't / doesn't + 動詞の原形）
// ══════════════════════════════════════════════════════════════
questions.push(
  meaning(2, 2, '基礎', "I don't like fish.", 'この文は何の文？', ['一般動詞の否定文', 'be動詞の否定文', '疑問文'], 0, [{ en: 'fish', ja: '魚' }]),
  fillIn(2, 2, '基礎', "I ___ like math.", '一般動詞の否定。___は？', ["don't", 'am', 'is'], 0, [{ en: 'math', ja: '数学' }]),
  wordOrder(2, 2, '基礎', "I don't eat meat.", ['meat', 'eat', "don't", 'I'], ['I', "don't", 'eat', 'meat'], [{ en: 'meat', ja: '肉' }]),
  jpToEn(2, 2, '基礎', '私はテレビを見ません。', ["I don't watch TV.", 'I am not watch TV.', 'I do not watching TV.'], 0, [{ en: 'watch TV', ja: 'テレビを見る' }]),
  errorDet(2, 2, '基礎', '「私は泳げません（泳ぎません）。」一般動詞の否定文はどっち？', ["I don't swim.", 'I am not swim.'], 0, [{ en: 'swim', ja: '泳ぐ' }]),
  fillIn(2, 2, '基礎', "She ___ play tennis.", '三単現の否定。___は？', ["doesn't", 'is', "don't"], 0, [{ en: 'tennis', ja: 'テニス' }]),
  meaning(2, 2, '応用', "He doesn't eat breakfast.", 'どういう意味？', ['朝ごはんを食べない', '朝ごはんを食べる', '朝ごはんが好き'], 0, [{ en: 'breakfast', ja: '朝ごはん' }]),
  wordOrder(2, 2, '応用', "She doesn't sing well.", ['well', 'sing', "doesn't", 'She'], ['She', "doesn't", 'sing', 'well'], [{ en: 'sing', ja: '歌う' }]),
  jpToEn(2, 2, '応用', '彼は英語を話しません。', ["He doesn't speak English.", 'He is not speak English.', "He don't speak English."], 0, [{ en: 'speak', ja: '話す' }]),
  errorDet(2, 2, '応用', '一般動詞の否定文として正しいのはどっち？', ["She doesn't study hard.", 'She is not study hard.'], 0, [{ en: 'study', ja: '勉強する' }]),
  fillIn(2, 2, '応用', "We ___ go to school on Sunday.", '___に入るのは？', ["don't", 'are', 'is'], 0, [{ en: 'Sunday', ja: '日曜日' }]),
  listening(2, 2, '応用', "Tom doesn't like vegetables.", ['トムは野菜が好きではない。', 'トムは野菜が好きだ。', 'トムは野菜を食べない（今）。'], 0, [{ en: 'vegetables', ja: '野菜' }]),
  meaning(2, 2, '応用', "They don't live in Osaka.", 'どういう意味？', ['大阪に住んでいない', '大阪に住んでいる', '大阪出身ではない'], 0, [{ en: 'Osaka', ja: '大阪' }]),
  wordOrder(2, 2, '応用', "We don't play games at night.", ['night', 'at', 'games', 'play', "don't", 'We'], ['We', "don't", 'play', 'games', 'at', 'night'], [{ en: 'games', ja: 'ゲーム' }]),
  jpToEn(2, 2, '応用', '彼女はピアノを弾きません。', ["She doesn't play the piano.", 'She is not play the piano.', "She don't play the piano."], 0, [{ en: 'piano', ja: 'ピアノ' }]),
  errorDet(2, 2, '発展', '「彼は走りません。」正しい英文はどっち？', ["He doesn't run.", 'He is not run.'], 0, [{ en: 'run', ja: '走る' }]),
  fillIn(2, 2, '発展', "My brother ___ use a computer.", '三単現の否定。___は？', ["doesn't", "don't", 'is'], 0, [{ en: 'computer', ja: 'パソコン' }]),
  meaning(2, 2, '発展', "I don't know his name.", '否定の作り方は？', ['do + not + 動詞の原形', 'be動詞 + not', '動詞 + not'], 0, [{ en: 'know', ja: '知っている' }]),
);

questions.push(
  meaning(2, 3, '基礎', "She doesn't watch TV every day.", '一般動詞の否定文の語順は？', ['主語 + do/does not + 動詞', '主語 + be + not + 動詞', 'Do + 主語 + 動詞'], 0, [{ en: 'every day', ja: '毎日' }]),
  fillIn(2, 3, '基礎', "He ___ drink milk.", '___に入るのは？', ["doesn't", 'is', "don't"], 0, [{ en: 'milk', ja: '牛乳' }]),
  wordOrder(2, 3, '基礎', "Lisa doesn't read comics.", ['comics', 'read', "doesn't", 'Lisa'], ['Lisa', "doesn't", 'read', 'comics'], [{ en: 'comics', ja: '漫画' }]),
  jpToEn(2, 3, '基礎', '私たちは肉を食べません。', ["We don't eat meat.", 'We are not eat meat.', "We doesn't eat meat."], 0, [{ en: 'meat', ja: '肉' }]),
  errorDet(2, 3, '基礎', '三単現の否定文。正しいのはどっち？', ["He doesn't like dogs.", "He don't like dogs."], 0, [{ en: 'dogs', ja: '犬' }]),
  fillIn(2, 3, '応用', "You ___ need a pen.", '___に入るのは？', ["don't", 'are', 'is'], 0, [{ en: 'need', ja: '必要とする' }]),
  meaning(2, 3, '応用', "My father doesn't work on Sunday.", 'どういう意味？', ['日曜日は働かない', '日曜日に働く', '日曜日は休み'], 0, [{ en: 'work', ja: '働く' }]),
  wordOrder(2, 3, '応用', "Ken doesn't play baseball.", ['baseball', 'play', "doesn't", 'Ken'], ['Ken', "doesn't", 'play', 'baseball'], [{ en: 'baseball', ja: '野球' }]),
  jpToEn(2, 3, '応用', '彼は毎朝走りません。', ["He doesn't run every morning.", 'He is not run every morning.', "He don't run every morning."], 0, [{ en: 'run', ja: '走る' }]),
  errorDet(2, 3, '応用', 'be動詞と一般動詞の否定、正しいのはどっち？', ["I don't understand.", 'I am not understand.'], 0, [{ en: 'understand', ja: '理解する' }]),
  listening(2, 3, '応用', "They don't have a car.", ['彼らは車を持っていない。', '彼らは車を持っている。', '彼らは車が好きではない。'], 0, [{ en: 'car', ja: '車' }]),
  meaning(2, 3, '発展', "She doesn't play tennis.", "doesn't の後ろに来る動詞の形は？", ['原形', '三単現のs', 'ing'], 0, [{ en: "doesn't", ja: '〜しない（三単現）' }]),
  fillIn(2, 3, '発展', "It ___ rain much here.", '___に入るのは？', ["doesn't", "don't", 'is'], 0, [{ en: 'rain', ja: '雨が降る' }]),
  jpToEn(2, 3, '発展', '彼女は時々お母さんを手伝いません。', ["She doesn't sometimes help her mother.", 'She is not sometimes help her mother.', "She don't sometimes help her mother."], 0, [{ en: 'help', ja: '手伝う' }]),
  errorDet(2, 3, '発展', '「be動詞の否定」と「一般動詞の否定」正しいのはどっち？', ['He is not busy. / He does not work.', 'He does not busy. / He is not work.'], 0, [{ en: 'busy', ja: '忙しい' }]),
);

// ══════════════════════════════════════════════════════════════
// Unit 3 — 一般動詞の疑問文（Do/Does + 主語 + 動詞原形）＋ be動詞との対比
// ══════════════════════════════════════════════════════════════
questions.push(
  meaning(3, 1, '基礎', 'Do you like music?', 'この文は何の文？', ['一般動詞の疑問文', 'be動詞の疑問文', '否定文'], 0, [{ en: 'music', ja: '音楽' }]),
  fillIn(3, 1, '基礎', '___ you play soccer?', '一般動詞の疑問文。___は？', ['Do', 'Are', 'Is'], 0, [{ en: 'soccer', ja: 'サッカー' }]),
  wordOrder(3, 1, '基礎', 'Do you like cats?', ['cats', 'like', 'you', 'Do'], ['Do', 'you', 'like', 'cats'], [{ en: 'cats', ja: '猫' }]),
  jpToEn(3, 1, '基礎', 'あなたはピザが好きですか。', ['Do you like pizza?', 'Are you like pizza?', 'Does you like pizza?'], 0, [{ en: 'pizza', ja: 'ピザ' }]),
  errorDet(3, 1, '基礎', '一般動詞の疑問文として正しいのはどっち？', ['Do you study English?', 'Are you study English?'], 0, [{ en: 'study', ja: '勉強する' }]),
  fillIn(3, 1, '基礎', '___ he play basketball?', '三単現の疑問文。___は？', ['Does', 'Is', 'Do'], 0, [{ en: 'basketball', ja: 'バスケットボール' }]),
  meaning(3, 1, '応用', 'Does she speak Japanese?', '何を聞いている？', ['日本語を話すか', '日本人か', '日本にいるか'], 0, [{ en: 'Japanese', ja: '日本語' }]),
  wordOrder(3, 1, '応用', 'Does he live in Kyoto?', ['Kyoto', 'in', 'live', 'he', 'Does'], ['Does', 'he', 'live', 'in', 'Kyoto'], [{ en: 'Kyoto', ja: '京都' }]),
  jpToEn(3, 1, '応用', '彼はテニスをしますか。', ['Does he play tennis?', 'Is he play tennis?', 'Do he play tennis?'], 0, [{ en: 'tennis', ja: 'テニス' }]),
  errorDet(3, 1, '応用', '「あなたは学生ですか」と「サッカーをしますか」be動詞の疑問文はどっち？', ['Are you a student?', 'Do you a student?'], 0, [{ en: 'student', ja: '生徒' }]),
  fillIn(3, 1, '応用', '___ they like dogs?', '___に入るのは？', ['Do', 'Are', 'Does'], 0, [{ en: 'dogs', ja: '犬' }]),
  listening(3, 1, '応用', 'Do you have a pet?', ['ペットを飼っていますか。', 'ペットが好きですか。', 'ペットは何ですか。'], 0, [{ en: 'pet', ja: 'ペット' }]),
  meaning(3, 1, '応用', 'Are you a teacher? / Do you teach English?', 'be動詞と一般動詞の疑問文の違いは？', ['be動詞は「〜ですか」、一般動詞は「〜しますか」', 'どちらも同じ', 'be動詞は過去のこと'], 0, [{ en: 'teacher', ja: '先生' }]),
  wordOrder(3, 1, '応用', 'Do we need a map?', ['map', 'a', 'need', 'we', 'Do'], ['Do', 'we', 'need', 'a', 'map'], [{ en: 'map', ja: '地図' }]),
  jpToEn(3, 1, '応用', '彼女は毎日走りますか。', ['Does she run every day?', 'Is she run every day?', 'Do she run every day?'], 0, [{ en: 'run', ja: '走る' }]),
  errorDet(3, 1, '発展', '三単現の疑問文。正しいのはどっち？', ['Does Tom like music?', "Does Tom likes music?"], 0, [{ en: 'Tom', ja: 'トム' }]),
  fillIn(3, 1, '発展', '___ she know your name?', '___に入るのは？', ['Does', 'Is', 'Do'], 0, [{ en: 'know', ja: '知っている' }]),
  meaning(3, 1, '発展', 'Does she like music?', 'Does の後ろの動詞の形は？', ['原形（sをつけない）', '三単現のs', 'ing'], 0, [{ en: 'Does', ja: '〜しますか（三単現）' }]),
);

questions.push(
  meaning(3, 2, '基礎', 'What is your name?', 'be動詞を使った疑問文。何を聞いている？', ['名前', '年齢', '住所'], 0, [{ en: 'name', ja: '名前' }]),
  fillIn(3, 2, '基礎', 'Where ___ you live?', '一般動詞の疑問文。___は？', ['do', 'are', 'is'], 0, [{ en: 'live', ja: '住む' }]),
  wordOrder(3, 2, '基礎', 'Where do you live?', ['live', 'you', 'do', 'Where'], ['Where', 'do', 'you', 'live'], [{ en: 'live', ja: '住む' }]),
  jpToEn(3, 2, '基礎', '彼は何歳ですか。（be動詞）', ['How old is he?', 'How old does he?', 'How old do he?'], 0, [{ en: 'old', ja: '歳' }]),
  errorDet(3, 2, '基礎', '「どこに住んでいますか」正しい英文はどっち？', ['Where do you live?', 'Where are you live?'], 0, [{ en: 'live', ja: '住む' }]),
  fillIn(3, 2, '応用', 'What ___ he do on Sunday?', '___に入るのは？', ['does', 'is', 'are'], 0, [{ en: 'Sunday', ja: '日曜日' }]),
  meaning(3, 2, '応用', 'When is your birthday?', 'be動詞の疑問文で聞いているのは？', ['誕生日', '年齢', '名前'], 0, [{ en: 'birthday', ja: '誕生日' }]),
  wordOrder(3, 2, '応用', 'When does the class start?', ['start', 'class', 'the', 'does', 'When'], ['When', 'does', 'the', 'class', 'start'], [{ en: 'class', ja: '授業' }]),
  jpToEn(3, 2, '応用', 'なぜ英語を勉強しますか。', ['Why do you study English?', 'Why are you study English?', 'Why does you study English?'], 0, [{ en: 'English', ja: '英語' }]),
  errorDet(3, 2, '応用', 'be動詞と一般動詞、正しい組み合わせはどっち？', ['Where is the station? / What do you want?', 'Where does the station? / What are you want?'], 0, [{ en: 'station', ja: '駅' }]),
  fillIn(3, 2, '応用', 'Who ___ your favorite teacher?', 'be動詞の疑問文。___は？', ['is', 'does', 'do'], 0, [{ en: 'favorite', ja: 'お気に入りの' }]),
  listening(3, 2, '応用', 'How many books do you have?', ['本を何冊持っていますか。', '本はいくらですか。', '本はどこですか。'], 0, [{ en: 'books', ja: '本' }]),
  meaning(3, 2, '応用', 'Is she happy? / Does she like school?', 'be動詞と一般動詞の疑問文の作り方の違いは？', ['be動詞は主語の前にIs、一般動詞はDo/Doesを使う', 'どちらもDoを使う', 'be動詞はDoesを使う'], 0, [{ en: 'happy', ja: 'うれしい' }]),
  wordOrder(3, 2, '応用', 'Who is your best friend?', ['friend', 'best', 'your', 'is', 'Who'], ['Who', 'is', 'your', 'best', 'friend'], [{ en: 'best friend', ja: '親友' }]),
  jpToEn(3, 2, '応用', '彼は何時に起きますか。', ['What time does he get up?', 'What time is he get up?', 'What time do he get up?'], 0, [{ en: 'get up', ja: '起きる' }]),
  errorDet(3, 2, '発展', '「お腹がすきましたか」be動詞の疑問文はどっち？', ['Are you hungry?', 'Do you hungry?'], 0, [{ en: 'hungry', ja: 'お腹がすいた' }]),
  fillIn(3, 2, '発展', 'How ___ she go to school?', '___に入るのは？', ['does', 'is', 'are'], 0, [{ en: 'go', ja: '行く' }]),
  meaning(3, 2, '発展', 'Are you ready? / Do you understand?', '「〜ですか」と「〜しますか」を作り分けるとき何に注目する？', ['be動詞か一般動詞か', '主語が何人称かだけ', '時制だけ'], 0, [{ en: 'verb', ja: '動詞' }]),
);

// Unit 3 Step 3 — 総合対比（be vs 一般動詞の疑問・否定）
questions.push(
  jpToEn(3, 3, '基礎', '彼は先生ではありません。', ['He is not a teacher.', 'He does not a teacher.', "He doesn't a teacher."], 0, [{ en: 'teacher', ja: '先生' }]),
  jpToEn(3, 3, '基礎', '彼はサッカーをしません。', ["He doesn't play soccer.", 'He is not play soccer.', 'He does not soccer.'], 0, [{ en: 'soccer', ja: 'サッカー' }]),
  errorDet(3, 3, '基礎', '「彼女は病気ですか」be動詞の疑問文はどっち？', ['Is she sick?', 'Does she sick?'], 0, [{ en: 'sick', ja: '病気の' }]),
  errorDet(3, 3, '基礎', '「彼女は泳ぎますか」一般動詞の疑問文はどっち？', ['Does she swim?', 'Is she swim?'], 0, [{ en: 'swim', ja: '泳ぐ' }]),
  jpToEn(3, 3, '応用', '私たちは疲れていません。', ['We are not tired.', "We don't tired.", 'We are tired.'], 0, [{ en: 'tired', ja: '疲れた' }]),
  jpToEn(3, 3, '応用', '私たちはその映画を見ません。', ["We don't watch that movie.", 'We are not watch that movie.', "We doesn't watch that movie."], 0, [{ en: 'movie', ja: '映画' }]),
  errorDet(3, 3, '応用', '否定文の対比。正しいペアはどっち？', ['She is not busy. / She does not work today.', 'She does not busy. / She is not work today.'], 0, [{ en: 'busy', ja: '忙しい' }]),
  errorDet(3, 3, '応用', '疑問文の対比。正しいペアはどっち？', ['Are you ready? / Do you understand?', 'Do you ready? / Are you understand?'], 0, [{ en: 'ready', ja: '準備ができた' }]),
  fillIn(3, 3, '応用', '___ you tired?（be動詞）', '___に入るのは？', ['Are', 'Do', 'Does'], 0, [{ en: 'tired', ja: '疲れた' }]),
  fillIn(3, 3, '応用', '___ you understand?（一般動詞）', '___に入るのは？', ['Do', 'Are', 'Is'], 0, [{ en: 'understand', ja: '理解する' }]),
  wordOrder(3, 3, '応用', 'Is he your father?', ['father', 'your', 'he', 'Is'], ['Is', 'he', 'your', 'father'], [{ en: 'father', ja: '父' }]),
  wordOrder(3, 3, '応用', 'Does he work at a bank?', ['bank', 'a', 'at', 'work', 'he', 'Does'], ['Does', 'he', 'work', 'at', 'a', 'bank'], [{ en: 'bank', ja: '銀行' }]),
  errorDet(3, 3, '応用', '「happy（うれしい）」を否定するとき正しいのは？', ['I am not happy.', "I don't happy."], 0, [{ en: 'happy', ja: 'うれしい' }]),
  errorDet(3, 3, '応用', '「like（好き）」を否定するとき正しいのは？', ["I don't like it.", 'I am not like it.'], 0, [{ en: 'like', ja: '好き' }]),
  listening(3, 3, '応用', 'Are you from America?', ['あなたはアメリカ出身ですか。', 'あなたはアメリカに行きますか。', 'あなたはアメリカが好きですか。'], 0, [{ en: 'America', ja: 'アメリカ' }]),
  listening(3, 3, '応用', 'Do you want some water?', ['お水が欲しいですか。', 'お水を飲みますか。', 'お水はありますか。'], 0, [{ en: 'water', ja: '水' }]),
  errorDet(3, 3, '発展', '間違いを含む英文。正しいのはどっち？', ['She is not at school. / She does not go to school today.', 'She does not at school. / She is not go to school today.'], 0, [{ en: 'school', ja: '学校' }]),
  errorDet(3, 3, '発展', 'be動詞と一般動詞、正しい英文はどっち？', ['Is this your book? / Do you read every day?', 'Does this your book? / Are you read every day?'], 0, [{ en: 'book', ja: '本' }]),
  jpToEn(3, 3, '発展', 'あなたはその答えを知っていますか。', ['Do you know the answer?', 'Are you know the answer?', 'Does you know the answer?'], 0, [{ en: 'answer', ja: '答え' }]),
  jpToEn(3, 3, '発展', 'それはあなたのノートですか。', ['Is that your notebook?', 'Does that your notebook?', 'Do that your notebook?'], 0, [{ en: 'notebook', ja: 'ノート' }]),
  meaning(3, 3, '発展', "I am not tired. / I don't like it.", 'be動詞の否定文と一般動詞の否定文、共通点は？', ['not を使う', 'do を必ず使う', '動詞にsをつける'], 0, [{ en: 'not', ja: '〜ない' }]),
  fillIn(3, 3, '発展', '___ it your phone?（be動詞の疑問文）', '___に入るのは？', ['Is', 'Does', 'Do'], 0, [{ en: 'phone', ja: '携帯電話' }]),
  fillIn(3, 3, '発展', '___ it rain a lot here?（一般動詞の疑問文）', '___に入るのは？', ['Does', 'Is', 'Are'], 0, [{ en: 'rain', ja: '雨が降る' }]),
);

// ══════════════════════════════════════════════════════════════
// Unit 4 — 進行形の否定・疑問（be + not + ing / Be + 主語 + ing?）
// ══════════════════════════════════════════════════════════════
questions.push(
  meaning(4, 2, '応用', 'He is not studying now.', '進行形の否定。be動詞を使う理由は？', ['「〜している」の形だから', '一般動詞だから', '過去のことだから'], 0, [{ en: 'studying', ja: '勉強している' }]),
  fillIn(4, 2, '応用', 'She ___ not watching TV now.', '進行形の否定。___は？', ['is', 'does', 'do'], 0, [{ en: 'watching', ja: '見ている' }]),
  errorDet(4, 2, '応用', '「今テレビを見ていない」正しい英文はどっち？', ['He is not watching TV now.', "He doesn't watching TV now."], 0, [{ en: 'watching', ja: '見ている' }]),
  jpToEn(4, 2, '応用', '彼らは今公園で遊んでいません。', ['They are not playing in the park now.', "They don't playing in the park now.", 'They are playing in the park now.'], 0, [{ en: 'playing', ja: '遊んでいる' }]),
  wordOrder(4, 2, '応用', 'Are you listening?', ['listening', 'you', 'Are'], ['Are', 'you', 'listening'], [{ en: 'listening', ja: '聞いている' }]),
  meaning(4, 3, '発展', 'What are you doing?', '進行形の疑問文。何を使う？', ['be動詞（Are）', 'Do', 'Does'], 0, [{ en: 'doing', ja: 'している' }]),
  errorDet(4, 3, '発展', '進行形の疑問文。正しいのはどっち？', ['Is she cooking dinner?', 'Does she cooking dinner?'], 0, [{ en: 'cooking', ja: '料理している' }]),
  fillIn(4, 3, '発展', '___ they playing soccer now?', '___に入るのは？', ['Are', 'Do', 'Does'], 0, [{ en: 'playing', ja: 'している' }]),
  jpToEn(4, 3, '発展', '今何をしていますか。', ['What are you doing?', 'What do you doing?', 'What is you doing?'], 0, [{ en: 'doing', ja: 'している' }]),
  errorDet(4, 3, '発展', '「毎日走らない」と「今走っていない」正しいのはどっち？', ["He doesn't run every day. / He is not running now.", 'He is not run every day. / He does not running now.'], 0, [{ en: 'run', ja: '走る' }]),
);

// ══════════════════════════════════════════════════════════════
// 追加バッチ — 対比ドリル（Unit 1〜3 に分散）
// ══════════════════════════════════════════════════════════════
const contrastPairs = [
  { jp: '彼は幸せではありません。', ok: 'He is not happy.', ng: "He doesn't happy.", u: 1, s: 3, l: '応用', v: 'happy' },
  { jp: '彼はその本を読みません。', ok: "He doesn't read that book.", ng: 'He is not read that book.', u: 2, s: 3, l: '応用', v: 'read' },
  { jp: 'あなたはケンですか。', ok: 'Are you Ken?', ng: 'Do you Ken?', u: 1, s: 3, l: '基礎', v: 'Ken' },
  { jp: 'あなたは野球が好きですか。', ok: 'Do you like baseball?', ng: 'Are you like baseball?', u: 3, s: 1, l: '基礎', v: 'baseball' },
  { jp: '彼女は看護師ですか。', ok: 'Is she a nurse?', ng: 'Does she a nurse?', u: 1, s: 3, l: '応用', v: 'nurse' },
  { jp: '彼女はギターを弾きますか。', ok: 'Does she play the guitar?', ng: 'Is she play the guitar?', u: 3, s: 1, l: '応用', v: 'guitar' },
  { jp: '私はその場所を知りません。', ok: "I don't know the place.", ng: 'I am not know the place.', u: 2, s: 2, l: '応用', v: 'know' },
  { jp: 'それは私の机ではありません。', ok: 'It is not my desk.', ng: "It doesn't my desk.", u: 1, s: 2, l: '応用', v: 'desk' },
  { jp: '彼らは今ここにいません。', ok: 'They are not here now.', ng: "They don't here now.", u: 1, s: 2, l: '応用', v: 'here' },
  { jp: '彼は毎日泳ぎません。', ok: "He doesn't swim every day.", ng: 'He is not swim every day.', u: 2, s: 3, l: '応用', v: 'swim' },
  { jp: 'これはあなたの傘ですか。', ok: 'Is this your umbrella?', ng: 'Does this your umbrella?', u: 1, s: 3, l: '基礎', v: 'umbrella' },
  { jp: 'これはいくらですか。', ok: 'How much is this?', ng: 'How much does this?', u: 3, s: 2, l: '応用', v: 'much' },
  { jp: '彼は英語が得意ではありません。', ok: 'He is not good at English.', ng: "He doesn't good at English.", u: 1, s: 2, l: '発展', v: 'good' },
  { jp: '彼は英語を勉強しません。', ok: "He doesn't study English.", ng: 'He is not study English.', u: 2, s: 2, l: '発展', v: 'study' },
  { jp: 'お腹がすきましたか。', ok: 'Are you hungry?', ng: 'Do you hungry?', u: 3, s: 2, l: '基礎', v: 'hungry' },
  { jp: 'コーヒーを飲みますか。', ok: 'Do you drink coffee?', ng: 'Are you drink coffee?', u: 3, s: 1, l: '基礎', v: 'coffee' },
  { jp: '彼は私の兄ではありません。', ok: 'He is not my brother.', ng: "He doesn't my brother.", u: 1, s: 2, l: '基礎', v: 'brother' },
  { jp: '彼は私の兄と遊びません。', ok: "He doesn't play with my brother.", ng: 'He is not play with my brother.', u: 2, s: 3, l: '基礎', v: 'brother' },
  { jp: '彼女は今忙しいですか。', ok: 'Is she busy now?', ng: 'Does she busy now?', u: 1, s: 3, l: '応用', v: 'busy' },
  { jp: '彼女は今宿題をしていますか。', ok: 'Is she doing her homework now?', ng: 'Does she doing her homework now?', u: 4, s: 2, l: '応用', v: 'homework' },
];

for (const p of contrastPairs) {
  const vocab = [{ en: p.v, ja: p.v }];
  questions.push(jpToEn(p.u, p.s, p.l, p.jp, [p.ok, p.ng, p.ok.replace('not', '').replace("n't", '')], 0, vocab));
  questions.push(errorDet(p.u, p.s, p.l, `「${p.jp}」正しい英文はどっち？`, [p.ok, p.ng], 0, vocab));
}

// 語順ドリル追加
const wordOrderDrills = [
  { s: 'I am not a child.', w: ['child', 'a', 'not', 'am', 'I'], u: 1, st: 2, l: '基礎', v: 'child' },
  { s: 'Are you from Osaka?', w: ['Osaka', 'from', 'you', 'Are'], u: 1, st: 3, l: '基礎', v: 'Osaka' },
  { s: "I don't want candy.", w: ['candy', 'want', "don't", 'I'], u: 2, st: 2, l: '基礎', v: 'candy' },
  { s: "She doesn't walk to school.", w: ['school', 'to', 'walk', "doesn't", 'She'], u: 2, st: 3, l: '応用', v: 'walk' },
  { s: 'Do you need help?', w: ['help', 'need', 'you', 'Do'], u: 3, st: 1, l: '基礎', v: 'help' },
  { s: 'Does he eat rice every day?', w: ['day', 'every', 'rice', 'eat', 'he', 'Does'], u: 3, st: 2, l: '応用', v: 'rice' },
  { s: 'Is it your turn?', w: ['turn', 'your', 'it', 'Is'], u: 1, st: 3, l: '応用', v: 'turn' },
  { s: 'Do they speak English?', w: ['English', 'speak', 'they', 'Do'], u: 3, st: 1, l: '応用', v: 'English' },
  { s: 'He is not my friend.', w: ['friend', 'my', 'not', 'is', 'He'], u: 1, st: 2, l: '基礎', v: 'friend' },
  { s: "We don't have homework today.", w: ['today', 'homework', 'have', "don't", 'We'], u: 2, st: 3, l: '応用', v: 'homework' },
];

function sentenceToWordOrderAnswer(sentence) {
  return sentence
    .replace(/[?.!]/g, '')
    .replace(/\./g, '')
    .split(' ')
    .filter(Boolean);
}

for (const d of wordOrderDrills) {
  questions.push(wordOrder(d.u, d.st, d.l, d.s, d.w, sentenceToWordOrderAnswer(d.s), [{ en: d.v, ja: d.v }]));
}

function esc(s) {
  return s.replace(/'/g, "\\'");
}

function formatQuestion(q) {
  const parts = [`  { id: '${q.id}', unit: ${q.unit}, step: ${q.step}, level: '${q.level}', type: '${q.type}'`];
  if (q.sentence) parts.push(`sentence: '${esc(q.sentence)}'`);
  if (q.japanese) parts.push(`japanese: '${esc(q.japanese)}'`);
  parts.push(`question: '${esc(q.question)}'`);
  if (q.words) parts.push(`words: [${q.words.map((w) => `'${esc(w)}'`).join(', ')}]`);
  if (q.choices) parts.push(`choices: [${q.choices.map((c) => `'${esc(c)}'`).join(', ')}]`);
  if (q.answer !== undefined) {
    parts.push(Array.isArray(q.answer) ? `answer: [${q.answer.map((a) => `'${esc(a)}'`).join(', ')}]` : `answer: ${q.answer}`);
  }
  if (q.showText) parts.push('showText: true');
  if (q.vocab) {
    parts.push(`vocab: [${q.vocab.map((v) => `{ en: '${esc(v.en)}', ja: '${esc(v.ja)}' }`).join(', ')}]`);
  }
  return `${parts.join(', ')} },`;
}

const out = `import type { Question } from '../../types';

/** be動詞 vs 一般動詞の疑問文・否定文 対比ドリル */
export const QA_NEGATIVE_QUESTIONS: Question[] = [
${questions.map(formatQuestion).join('\n')}
];
`;

fs.writeFileSync(new URL('../src/data/questions/qaNegative.ts', import.meta.url), out);
console.log(`Generated ${questions.length} questions (q349–q${id - 1})`);
