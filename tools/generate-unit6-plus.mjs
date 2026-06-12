/**
 * Unit 6〜8 問題生成（q642〜）
 * 実行: node tools/generate-unit6-plus.mjs
 */
import fs from 'fs';
import {
  assertUniqueChoices,
  errorDetChoices,
  jpToEnChoices,
  meaningChoices,
} from './choice-helpers.mjs';

let id = 642;

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

function addPastBundle(unit, step, level, en, ja, vocab, fillWord, fillChoices, words, answer, meaningQ, meaningJa) {
  const v = vocab;
  questions.push(meaning(unit, step, level, en, meaningQ, meaningChoices(meaningJa), 0, v));
  questions.push(wordOrder(unit, step, level, en, words, answer, v));
  questions.push(fillIn(unit, step, level, en.replace(fillWord, '___'), '過去形。___に入るのは？', fillChoices, 0, v));
  questions.push(jpToEn(unit, step, level, ja, jpToEnChoices(en), 0, v));
}

function addFutureBundle(unit, step, level, en, ja, vocab, fillWord, fillChoices, words, answer, meaningQ, meaningJa) {
  const v = vocab;
  questions.push(meaning(unit, step, level, en, meaningQ, meaningChoices(meaningJa), 0, v));
  questions.push(wordOrder(unit, step, level, en, words, answer, v));
  questions.push(fillIn(unit, step, level, en.replace(fillWord, '___'), '未来形。___に入るのは？', fillChoices, 0, v));
  questions.push(jpToEn(unit, step, level, ja, jpToEnChoices(en), 0, v));
}

function addCompBundle(unit, step, level, en, ja, vocab, fillWord, fillChoices, words, answer, meaningQ, meaningJa) {
  const v = vocab;
  questions.push(meaning(unit, step, level, en, meaningQ, meaningChoices(meaningJa), 0, v));
  questions.push(wordOrder(unit, step, level, en, words, answer, v));
  questions.push(fillIn(unit, step, level, en.replace(fillWord, '___'), '比較。___に入るのは？', fillChoices, 0, v));
  questions.push(jpToEn(unit, step, level, ja, jpToEnChoices(en), 0, v));
}

const questions = [];

// ══════════════════════════════════════════════════════════════
// Unit 6 — 過去形
// ══════════════════════════════════════════════════════════════

// Step 1: 規則動詞の過去形（肯定文）
addPastBundle(6, 1, '基礎', 'I played soccer yesterday.', '私は昨日サッカーをしました。', [{ en: 'played', ja: 'した' }, { en: 'yesterday', ja: '昨日' }], 'played', ['played', 'play', 'playing'], ['yesterday', 'soccer', 'played', 'I'], ['I', 'played', 'soccer', 'yesterday'], 'いつサッカーをした？', '私は昨日サッカーをしました。');
addPastBundle(6, 1, '基礎', 'She watched TV last night.', '彼女は昨夜テレビを見ました。', [{ en: 'watched', ja: '見た' }, { en: 'last night', ja: '昨夜' }], 'watched', ['watched', 'watch', 'watching'], ['night', 'last', 'TV', 'watched', 'She'], ['She', 'watched', 'TV', 'last', 'night'], '彼女は何をした？', '彼女は昨夜テレビを見ました。');
addPastBundle(6, 1, '基礎', 'We studied English at school.', '私たちは学校で英語を勉強しました。', [{ en: 'studied', ja: '勉強した' }, { en: 'school', ja: '学校' }], 'studied', ['studied', 'study', 'studying'], ['school', 'at', 'English', 'studied', 'We'], ['We', 'studied', 'English', 'at', 'school'], 'どこで勉強した？', '私たちは学校で英語を勉強しました。');
addPastBundle(6, 1, '応用', 'He visited Kyoto last week.', '彼は先週京都を訪れました。', [{ en: 'visited', ja: '訪れた' }, { en: 'Kyoto', ja: '京都' }], 'visited', ['visited', 'visit', 'visiting'], ['week', 'last', 'Kyoto', 'visited', 'He'], ['He', 'visited', 'Kyoto', 'last', 'week'], '彼はいつ京都へ行った？', '彼は先週京都を訪れました。');
addPastBundle(6, 1, '応用', 'They cleaned the classroom.', '彼らは教室を掃除しました。', [{ en: 'cleaned', ja: '掃除した' }, { en: 'classroom', ja: '教室' }], 'cleaned', ['cleaned', 'clean', 'cleaning'], ['classroom', 'the', 'cleaned', 'They'], ['They', 'cleaned', 'the', 'classroom'], '彼らは何をした？', '彼らは教室を掃除しました。');

questions.push(listening(6, 1, '応用', 'I played soccer yesterday.', ['私は昨日サッカーをしました。', '私は今日サッカーをします。', '私はサッカーが好きです。'], 0, [{ en: 'yesterday', ja: '昨日' }]));
questions.push(errorDet(6, 1, '基礎', '過去形として正しいのはどっち？', errorDetChoices('She watched TV last night.'), 0, [{ en: 'watched', ja: '見た' }]));
questions.push(errorDet(6, 1, '応用', '「彼は先週京都を訪れました。」正しい英文はどっち？', ['He visited Kyoto last week.', 'He visit Kyoto last week.'], 0, [{ en: 'visited', ja: '訪れた' }]));
questions.push(fillIn(6, 1, '基礎', 'Tom ___ basketball after school.', '過去形。___は？', ['played', 'play', 'plays'], 0, [{ en: 'basketball', ja: 'バスケ' }]));
questions.push(jpToEn(6, 1, '基礎', '私は昨日ピアノを練習しました。', jpToEnChoices('I practiced the piano yesterday.'), 0, [{ en: 'practiced', ja: '練習した' }]));

// Step 2: 不規則動詞・否定文
addPastBundle(6, 2, '基礎', 'I went to the park.', '私は公園へ行きました。', [{ en: 'went', ja: '行った' }, { en: 'park', ja: '公園' }], 'went', ['went', 'go', 'going'], ['park', 'the', 'to', 'went', 'I'], ['I', 'went', 'to', 'the', 'park'], 'どこへ行った？', '私は公園へ行きました。');
addPastBundle(6, 2, '基礎', 'She ate lunch at noon.', '彼女は正午に昼食を食べました。', [{ en: 'ate', ja: '食べた' }, { en: 'lunch', ja: '昼食' }], 'ate', ['ate', 'eat', 'eating'], ['noon', 'at', 'lunch', 'ate', 'She'], ['She', 'ate', 'lunch', 'at', 'noon'], '彼女は何をした？', '彼女は正午に昼食を食べました。');
addPastBundle(6, 2, '応用', "They didn't come to school.", '彼らは学校に来ませんでした。', [{ en: "didn't", ja: 'しなかった' }, { en: 'come', ja: '来る' }], "didn't", ["didn't", "don't", "doesn't"], ['school', 'to', 'come', "didn't", 'They'], ['They', "didn't", 'come', 'to', 'school'], '彼らは学校に来た？', '彼らは学校に来ませんでした。');
addPastBundle(6, 2, '応用', "He didn't finish his homework.", '彼は宿題を終えませんでした。', [{ en: "didn't", ja: 'しなかった' }, { en: 'homework', ja: '宿題' }], "didn't", ["didn't", "don't", 'was not'], ['homework', 'his', 'finish', "didn't", 'He'], ['He', "didn't", 'finish', 'his', 'homework'], '彼は宿題を終えた？', '彼は宿題を終えませんでした。');
addPastBundle(6, 2, '発展', 'We saw a movie last Sunday.', '私たちは先週の日曜日に映画を見ました。', [{ en: 'saw', ja: '見た' }, { en: 'movie', ja: '映画' }], 'saw', ['saw', 'see', 'seeing'], ['Sunday', 'last', 'movie', 'a', 'saw', 'We'], ['We', 'saw', 'a', 'movie', 'last', 'Sunday'], '何をした？', '私たちは先週の日曜日に映画を見ました。');

questions.push(listening(6, 2, '応用', "I didn't go home early.", ['私は早く帰りませんでした。', '私は早く帰りました。', '私は家にいます。'], 0, [{ en: 'early', ja: '早く' }]));
questions.push(errorDet(6, 2, '基礎', '過去形の否定文。正しいのはどっち？', ["She didn't eat breakfast.", "She doesn't ate breakfast."], 0, [{ en: "didn't", ja: 'しなかった' }]));
questions.push(errorDet(6, 2, '応用', '不規則動詞の過去形。正しいのはどっち？', ['He went to bed early.', 'He goed to bed early.'], 0, [{ en: 'went', ja: '行った' }]));
questions.push(meaning(6, 2, '応用', 'I had a good time.', 'どういう意味？', meaningChoices('楽しい時間を過ごしました。'), 0, [{ en: 'had', ja: '過ごした' }]));
questions.push(jpToEn(6, 2, '発展', '彼女は新しい靴を買いました。', jpToEnChoices('She bought new shoes.'), 0, [{ en: 'bought', ja: '買った' }]));

// Step 3: 過去形の疑問文
questions.push(meaning(6, 3, '基礎', 'Did you finish your homework?', '何を聞いている？', ['宿題を終えたか', '宿題があるか', '宿題が好きか'], 0, [{ en: 'finish', ja: '終える' }]));
questions.push(wordOrder(6, 3, '基礎', 'Did you finish your homework?', ['homework', 'your', 'finish', 'you', 'Did'], ['Did', 'you', 'finish', 'your', 'homework'], [{ en: 'homework', ja: '宿題' }]));
questions.push(fillIn(6, 3, '基礎', '___ you finish your homework?', '過去の疑問文。___は？', ['Did', 'Do', 'Does'], 0, [{ en: 'finish', ja: '終える' }]));
questions.push(jpToEn(6, 3, '基礎', 'あなたは昨日何をしましたか。', jpToEnChoices('What did you do yesterday?'), 0, [{ en: 'yesterday', ja: '昨日' }]));
questions.push(errorDet(6, 3, '基礎', '過去の疑問文。正しいのはどっち？', ['Did she go to school?', 'Did she went to school?'], 0, [{ en: 'go', ja: '行く' }]));

questions.push(meaning(6, 3, '応用', 'Where did she go?', '何を聞いている？', ['行き先', '理由', '時間'], 0, [{ en: 'where', ja: 'どこ' }]));
questions.push(wordOrder(6, 3, '応用', 'Where did she go?', ['go', 'she', 'did', 'Where'], ['Where', 'did', 'she', 'go'], [{ en: 'where', ja: 'どこ' }]));
questions.push(fillIn(6, 3, '応用', 'Where ___ she go?', '___に入るのは？', ['did', 'does', 'do'], 0, [{ en: 'go', ja: '行く' }]));
questions.push(jpToEn(6, 3, '応用', '彼はいつその本を読みましたか。', jpToEnChoices('When did he read the book?'), 0, [{ en: 'read', ja: '読んだ' }]));
questions.push(listening(6, 3, '応用', 'Did you enjoy the party?', ['パーティーは楽しかったですか。', 'パーティーに行きますか。', 'パーティーが好きですか。'], 0, [{ en: 'enjoy', ja: '楽しむ' }]));

questions.push(meaning(6, 3, '発展', 'What did they eat for dinner?', '何を聞いている？', ['夕食に何を食べたか', '夕食をいつ食べるか', '夕食が好きか'], 0, [{ en: 'dinner', ja: '夕食' }]));
questions.push(errorDet(6, 3, '発展', '「彼らは学校に来ませんでした。」正しい英文はどっち？', ["They didn't come to school.", "They didn't came to school."], 0, [{ en: 'come', ja: '来る' }]));
questions.push(jpToEn(6, 3, '発展', 'ケンはテニスをしましたか。', jpToEnChoices('Did Ken play tennis?'), 0, [{ en: 'tennis', ja: 'テニス' }]));
questions.push(listening(6, 3, '発展', 'What did you do last weekend?', ['先週末何をしましたか。', '今週末何をしますか。', '毎週末何をしますか。'], 0, [{ en: 'weekend', ja: '週末' }]));
questions.push(fillIn(6, 3, '発展', '___ did they visit last month?', '___に入るのは？', ['Who', 'Where', 'What'], 0, [{ en: 'visit', ja: '訪れる' }]));

// ══════════════════════════════════════════════════════════════
// Unit 7 — 未来形
// ══════════════════════════════════════════════════════════════

addFutureBundle(7, 1, '基礎', 'I will call you tonight.', '私は今夜あなたに電話します。', [{ en: 'will', ja: '〜するつもり' }, { en: 'tonight', ja: '今夜' }], 'will', ['will', 'am', 'can'], ['tonight', 'you', 'call', 'will', 'I'], ['I', 'will', 'call', 'you', 'tonight'], 'いつ電話する？', '私は今夜あなたに電話します。');
addFutureBundle(7, 1, '基礎', 'She will help us.', '彼女は私たちを手伝ってくれます。', [{ en: 'will', ja: '〜するつもり' }, { en: 'help', ja: '手伝う' }], 'will', ['will', 'can', 'must'], ['us', 'help', 'will', 'She'], ['She', 'will', 'help', 'us'], '彼女は何をする？', '彼女は私たちを手伝ってくれます。');
addFutureBundle(7, 1, '応用', 'It will rain tomorrow.', '明日は雨が降るでしょう。', [{ en: 'rain', ja: '雨が降る' }, { en: 'tomorrow', ja: '明日' }], 'will', ['will', 'is', 'can'], ['tomorrow', 'rain', 'will', 'It'], ['It', 'will', 'rain', 'tomorrow'], '明日の天気は？', '明日は雨が降るでしょう。');
addFutureBundle(7, 1, '応用', 'We will have a test next Monday.', '私たちは来週の月曜日にテストがあります。', [{ en: 'test', ja: 'テスト' }, { en: 'Monday', ja: '月曜日' }], 'will', ['will', 'are', 'can'], ['Monday', 'next', 'test', 'a', 'have', 'will', 'We'], ['We', 'will', 'have', 'a', 'test', 'next', 'Monday'], 'いつテストがある？', '私たちは来週の月曜日にテストがあります。');
addFutureBundle(7, 1, '発展', 'They will visit Osaka next month.', '彼らは来月大阪を訪れます。', [{ en: 'visit', ja: '訪れる' }, { en: 'Osaka', ja: '大阪' }], 'will', ['will', 'are', 'did'], ['month', 'next', 'Osaka', 'visit', 'will', 'They'], ['They', 'will', 'visit', 'Osaka', 'next', 'month'], '彼らはいつ大阪へ行く？', '彼らは来月大阪を訪れます。');

questions.push(listening(7, 1, '応用', 'I will study harder.', ['もっと一生懸命勉強します。', 'もっと一生懸命勉強しました。', '私は一生懸命勉強しています。'], 0, [{ en: 'study', ja: '勉強する' }]));
questions.push(errorDet(7, 1, '基礎', '未来形 will。正しいのはどっち？', ['He will come soon.', 'He wills come soon.'], 0, [{ en: 'will', ja: '〜するつもり' }]));
questions.push(jpToEn(7, 1, '基礎', '私は明日早く起きます。', jpToEnChoices('I will get up early tomorrow.'), 0, [{ en: 'tomorrow', ja: '明日' }]));
questions.push(fillIn(7, 1, '応用', 'She ___ be thirteen next year.', '___に入るのは？', ['will', 'is', 'can'], 0, [{ en: 'next year', ja: '来年' }]));
questions.push(meaning(7, 1, '発展', 'You will love this movie.', 'どういう意味？', meaningChoices('あなたはこの映画が好きになるでしょう。'), 0, [{ en: 'love', ja: '好きになる' }]));

// Step 2: be going to / won't
addFutureBundle(7, 2, '基礎', 'I am going to visit my grandmother.', '私はおばあちゃんを訪ねる予定です。', [{ en: 'going to', ja: '〜する予定' }, { en: 'grandmother', ja: 'おばあちゃん' }], 'am going to', ['am going to', 'will', 'am'], ['grandmother', 'my', 'visit', 'to', 'going', 'am', 'I'], ['I', 'am', 'going', 'to', 'visit', 'my', 'grandmother'], '何をする予定？', '私はおばあちゃんを訪ねる予定です。');
addFutureBundle(7, 2, '応用', 'We are going to play soccer.', '私たちはサッカーをする予定です。', [{ en: 'going to', ja: '〜する予定' }, { en: 'soccer', ja: 'サッカー' }], 'are going to', ['are going to', 'will', 'are'], ['soccer', 'play', 'to', 'going', 'are', 'We'], ['We', 'are', 'going', 'to', 'play', 'soccer'], '何をする予定？', '私たちはサッカーをする予定です。');
addFutureBundle(7, 2, '応用', "He is not going to be late.", '彼は遅刻しない予定です。', [{ en: 'late', ja: '遅刻した' }, { en: 'going to', ja: '〜する予定' }], 'is not going to', ['is not going to', 'will not', "doesn't"], ['late', 'be', 'to', 'going', 'not', 'is', 'He'], ['He', 'is', 'not', 'going', 'to', 'be', 'late'], '彼は遅刻する？', '彼は遅刻しない予定です。');
addFutureBundle(7, 2, '発展', "They won't come to the party.", '彼らはパーティーに来ないでしょう。', [{ en: "won't", ja: '〜しない' }, { en: 'party', ja: 'パーティー' }], "won't", ["won't", "don't", "didn't"], ['party', 'the', 'to', 'come', "won't", 'They'], ['They', "won't", 'come', 'to', 'the', 'party'], '彼らは来る？', '彼らはパーティーに来ないでしょう。');

questions.push(listening(7, 2, '応用', 'She is going to cook dinner.', ['彼女は夕食を作る予定です。', '彼女は夕食を作っています。', '彼女は夕食を作りました。'], 0, [{ en: 'cook', ja: '料理する' }]));
questions.push(errorDet(7, 2, '基礎', 'be going to。正しいのはどっち？', ['We are going to study.', 'We are go to study.'], 0, [{ en: 'going to', ja: '〜する予定' }]));
questions.push(errorDet(7, 2, '応用', 'won\'t の文。正しいのはどっち？', ["I won't forget.", "I won't forgot."], 0, [{ en: "won't", ja: '〜しない' }]));
questions.push(jpToEn(7, 2, '応用', '彼はテニスをする予定です。', jpToEnChoices('He is going to play tennis.'), 0, [{ en: 'tennis', ja: 'テニス' }]));
questions.push(fillIn(7, 2, '発展', 'It ___ going to snow tonight.', '___に入るのは？', ['is', 'are', 'am'], 0, [{ en: 'snow', ja: '雪が降る' }]));

// Step 3: 未来の疑問文・will vs going to
questions.push(meaning(7, 3, '基礎', 'Will you come to the party?', '何を聞いている？', ['パーティーに来るか', 'パーティーが好きか', 'パーティーはいつか'], 0, [{ en: 'party', ja: 'パーティー' }]));
questions.push(wordOrder(7, 3, '基礎', 'Will you come to the party?', ['party', 'the', 'to', 'come', 'you', 'Will'], ['Will', 'you', 'come', 'to', 'the', 'party'], [{ en: 'party', ja: 'パーティー' }]));
questions.push(jpToEn(7, 3, '基礎', '明日何をする予定ですか。', jpToEnChoices('What are you going to do tomorrow?'), 0, [{ en: 'tomorrow', ja: '明日' }]));
questions.push(errorDet(7, 3, '基礎', '未来の疑問文。正しいのはどっち？', ['Will she help us?', 'Will she helps us?'], 0, [{ en: 'help', ja: '手伝う' }]));
questions.push(listening(7, 3, '応用', 'Are you going to watch the game?', ['試合を見る予定ですか。', '試合を見ましたか。', '試合が好きですか。'], 0, [{ en: 'game', ja: '試合' }]));

questions.push(meaning(7, 3, '応用', 'What will you do this weekend?', '何を聞いている？', ['週末の予定', '週末の天気', '週末の宿題'], 0, [{ en: 'weekend', ja: '週末' }]));
questions.push(fillIn(7, 3, '応用', '___ you going to join us?', '___に入るのは？', ['Are', 'Will', 'Do'], 0, [{ en: 'join', ja: '参加する' }]));
questions.push(jpToEn(7, 3, '応用', '彼は来年日本に行くでしょう。', jpToEnChoices('He will go to Japan next year.'), 0, [{ en: 'Japan', ja: '日本' }]));
questions.push(errorDet(7, 3, '発展', '「彼女は遅刻しない予定です。」正しい英文はどっち？', ["She is not going to be late.", "She is not going to late."], 0, [{ en: 'late', ja: '遅刻した' }]));
questions.push(wordOrder(7, 3, '発展', 'What are you going to do this weekend?', ['weekend', 'this', 'do', 'to', 'going', 'are', 'you', 'What'], ['What', 'are', 'you', 'going', 'to', 'do', 'this', 'weekend'], [{ en: 'weekend', ja: '週末' }]));

questions.push(listening(7, 3, '発展', 'We will start at nine.', ['私たちは9時に始めます。', '私たちは9時に始めました。', '私たちは9時に始めています。'], 0, [{ en: 'start', ja: '始める' }]));
questions.push(fillIn(7, 3, '発展', 'I ___ not be able to come.', '___に入るのは？', ['will', 'am', 'do'], 0, [{ en: 'come', ja: '来る' }]));
questions.push(jpToEn(7, 3, '発展', '明日は晴れるでしょう。', jpToEnChoices('It will be sunny tomorrow.'), 0, [{ en: 'sunny', ja: '晴れ' }]));
questions.push(meaning(7, 3, '発展', 'I am going to study abroad.', 'どういう意味？', meaningChoices('私は留学する予定です。'), 0, [{ en: 'abroad', ja: '海外' }]));
questions.push(errorDet(7, 3, '発展', 'will と be going to。正しいのはどっち？', ['I am going to buy a new bag.', 'I am going to buying a new bag.'], 0, [{ en: 'buy', ja: '買う' }]));

// ══════════════════════════════════════════════════════════════
// Unit 8 — 比較級・最上級
// ══════════════════════════════════════════════════════════════

addCompBundle(8, 1, '基礎', 'Tom is taller than Ken.', 'トムはケンより背が高いです。', [{ en: 'taller', ja: 'より背が高い' }, { en: 'than', ja: '〜より' }], 'taller', ['taller', 'tall', 'tallest'], ['Ken', 'than', 'taller', 'is', 'Tom'], ['Tom', 'is', 'taller', 'than', 'Ken'], '誰の方が背が高い？', 'トムはケンより背が高いです。');
addCompBundle(8, 1, '基礎', 'This book is easier than that one.', 'この本はあの本より簡単です。', [{ en: 'easier', ja: 'より簡単な' }, { en: 'book', ja: '本' }], 'easier', ['easier', 'easy', 'easiest'], ['one', 'that', 'than', 'easier', 'is', 'book', 'This'], ['This', 'book', 'is', 'easier', 'than', 'that', 'one'], 'どちらが簡単？', 'この本はあの本より簡単です。');
addCompBundle(8, 1, '応用', 'She runs faster than her brother.', '彼女は兄より速く走ります。', [{ en: 'faster', ja: 'より速く' }, { en: 'brother', ja: '兄' }], 'faster', ['faster', 'fast', 'fastest'], ['brother', 'her', 'than', 'faster', 'runs', 'She'], ['She', 'runs', 'faster', 'than', 'her', 'brother'], '誰の方が速い？', '彼女は兄より速く走ります。');
addCompBundle(8, 1, '応用', 'Winter is colder than summer.', '冬は夏より寒いです。', [{ en: 'colder', ja: 'より寒い' }, { en: 'winter', ja: '冬' }], 'colder', ['colder', 'cold', 'coldest'], ['summer', 'than', 'colder', 'is', 'Winter'], ['Winter', 'is', 'colder', 'than', 'summer'], 'どちらが寒い？', '冬は夏より寒いです。');
addCompBundle(8, 1, '発展', 'My room is bigger than yours.', '私の部屋はあなたの部屋より大きいです。', [{ en: 'bigger', ja: 'より大きい' }, { en: 'room', ja: '部屋' }], 'bigger', ['bigger', 'big', 'biggest'], ['yours', 'than', 'bigger', 'is', 'room', 'My'], ['My', 'room', 'is', 'bigger', 'than', 'yours'], 'どちらが大きい？', '私の部屋はあなたの部屋より大きいです。');

questions.push(listening(8, 1, '応用', 'Tom is taller than Ken.', ['トムはケンより背が高いです。', 'ケンはトムより背が高いです。', 'トムとケンは同じ背です。'], 0, [{ en: 'taller', ja: 'より背が高い' }]));
questions.push(errorDet(8, 1, '基礎', '比較級 -er。正しいのはどっち？', ['She is older than me.', 'She is old than me.'], 0, [{ en: 'older', ja: 'より年上の' }]));
questions.push(jpToEn(8, 1, '基礎', 'このペンはあのペンより安いです。', jpToEnChoices('This pen is cheaper than that one.'), 0, [{ en: 'cheaper', ja: 'より安い' }]));
questions.push(fillIn(8, 1, '応用', 'English is ___ than math for me.', '___に入るのは？', ['easier', 'easy', 'easiest'], 0, [{ en: 'math', ja: '数学' }]));
questions.push(meaning(8, 1, '発展', 'He is younger than his sister.', 'どういう意味？', meaningChoices('彼は姉より年下です。'), 0, [{ en: 'younger', ja: 'より年下の' }]));

// Step 2: more ~ than / as ~ as
addCompBundle(8, 2, '基礎', 'English is more interesting than math.', '英語は数学より面白いです。', [{ en: 'interesting', ja: '面白い' }, { en: 'math', ja: '数学' }], 'more interesting', ['more interesting', 'interesting', 'most interesting'], ['math', 'than', 'interesting', 'more', 'is', 'English'], ['English', 'is', 'more', 'interesting', 'than', 'math'], 'どちらが面白い？', '英語は数学より面白いです。');
addCompBundle(8, 2, '応用', 'She is more careful than her brother.', '彼女は兄より注意深いです。', [{ en: 'careful', ja: '注意深い' }, { en: 'brother', ja: '兄' }], 'more careful', ['more careful', 'careful', 'most careful'], ['brother', 'her', 'than', 'careful', 'more', 'is', 'She'], ['She', 'is', 'more', 'careful', 'than', 'her', 'brother'], '誰の方が注意深い？', '彼女は兄より注意深いです。');
addCompBundle(8, 2, '応用', 'Tokyo is more crowded than Kyoto.', '東京は京都より混んでいます。', [{ en: 'crowded', ja: '混んでいる' }, { en: 'Tokyo', ja: '東京' }], 'more crowded', ['more crowded', 'crowded', 'most crowded'], ['Kyoto', 'than', 'crowded', 'more', 'is', 'Tokyo'], ['Tokyo', 'is', 'more', 'crowded', 'than', 'Kyoto'], 'どちらが混んでいる？', '東京は京都より混んでいます。');

questions.push(meaning(8, 2, '基礎', 'She runs as fast as her brother.', 'どういう意味？', meaningChoices('彼女は兄と同じくらい速く走ります。'), 0, [{ en: 'as', ja: '同じくらい' }]));
questions.push(wordOrder(8, 2, '基礎', 'She runs as fast as her brother.', ['brother', 'her', 'as', 'fast', 'as', 'runs', 'She'], ['She', 'runs', 'as', 'fast', 'as', 'her', 'brother'], [{ en: 'fast', ja: '速く' }]));
questions.push(jpToEn(8, 2, '基礎', 'この問題はあの問題と同じくらい難しいです。', jpToEnChoices('This problem is as difficult as that one.'), 0, [{ en: 'difficult', ja: '難しい' }]));
questions.push(errorDet(8, 2, '応用', 'more ~ than。正しいのはどっち？', ['This test is more difficult than yesterday.', 'This test is difficulter than yesterday.'], 0, [{ en: 'difficult', ja: '難しい' }]));
questions.push(listening(8, 2, '応用', 'He is as tall as his father.', ['彼は父と同じくらい背が高いです。', '彼は父より背が高いです。', '彼は父より背が低いです。'], 0, [{ en: 'tall', ja: '背が高い' }]));

questions.push(fillIn(8, 2, '発展', 'My bag is not as heavy ___ yours.', '___に入るのは？', ['as', 'than', 'so'], 0, [{ en: 'heavy', ja: '重い' }]));
questions.push(jpToEn(8, 2, '発展', 'サッカーはテニスより人気があります。', jpToEnChoices('Soccer is more popular than tennis.'), 0, [{ en: 'popular', ja: '人気がある' }]));
questions.push(meaning(8, 2, '発展', 'This cake is more delicious than that one.', 'どういう意味？', meaningChoices('このケーキはあのケーキよりおいしいです。'), 0, [{ en: 'delicious', ja: 'おいしい' }]));
questions.push(errorDet(8, 2, '発展', 'as ~ as。正しいのはどっち？', ['She is as kind as her mother.', 'She is as kind than her mother.'], 0, [{ en: 'kind', ja: '親切な' }]));
questions.push(wordOrder(8, 2, '応用', 'Soccer is more popular than tennis.', ['tennis', 'than', 'popular', 'more', 'is', 'Soccer'], ['Soccer', 'is', 'more', 'popular', 'than', 'tennis'], [{ en: 'soccer', ja: 'サッカー' }]));

// Step 3: 最上級
addCompBundle(8, 3, '基礎', 'Mt. Fuji is the highest mountain in Japan.', '富士山は日本で一番高い山です。', [{ en: 'highest', ja: '一番高い' }, { en: 'mountain', ja: '山' }], 'the highest', ['the highest', 'higher', 'high'], ['Japan', 'in', 'mountain', 'highest', 'the', 'is', 'Fuji', 'Mt'], ['Mt', 'Fuji', 'is', 'the', 'highest', 'mountain', 'in', 'Japan'], '日本で一番高い山は？', '富士山は日本で一番高い山です。');
addCompBundle(8, 3, '応用', 'This is the most delicious cake.', 'これは一番おいしいケーキです。', [{ en: 'delicious', ja: 'おいしい' }, { en: 'most', ja: '一番' }], 'the most delicious', ['the most delicious', 'more delicious', 'delicious'], ['cake', 'delicious', 'most', 'the', 'is', 'This'], ['This', 'is', 'the', 'most', 'delicious', 'cake'], 'どんなケーキ？', 'これは一番おいしいケーキです。');
addCompBundle(8, 3, '応用', 'She is the youngest in her class.', '彼女はクラスで一番年下です。', [{ en: 'youngest', ja: '一番年下の' }, { en: 'class', ja: 'クラス' }], 'the youngest', ['the youngest', 'younger', 'young'], ['class', 'her', 'in', 'youngest', 'the', 'is', 'She'], ['She', 'is', 'the', 'youngest', 'in', 'her', 'class'], 'クラスでどんな立場？', '彼女はクラスで一番年下です。');

questions.push(meaning(8, 3, '基礎', 'Who is the tallest in your class?', '何を聞いている？', ['クラスで一番背が高い人', 'クラスで一番速い人', 'クラスの人数'], 0, [{ en: 'tallest', ja: '一番背が高い' }]));
questions.push(wordOrder(8, 3, '基礎', 'Who is the tallest in your class?', ['class', 'your', 'in', 'tallest', 'the', 'is', 'Who'], ['Who', 'is', 'the', 'tallest', 'in', 'your', 'class'], [{ en: 'tallest', ja: '一番背が高い' }]));
questions.push(jpToEn(8, 3, '基礎', 'これは世界で一番大きな動物です。', jpToEnChoices('This is the biggest animal in the world.'), 0, [{ en: 'biggest', ja: '一番大きい' }]));
questions.push(errorDet(8, 3, '基礎', '最上級。正しいのはどっち？', ['He is the fastest runner.', 'He is the faster runner.'], 0, [{ en: 'fastest', ja: '一番速い' }]));
questions.push(listening(8, 3, '応用', 'Summer is the hottest season.', ['夏は一番暑い季節です。', '夏は冬より暑いです。', '夏は春と同じくらい暑いです。'], 0, [{ en: 'hottest', ja: '一番暑い' }]));

questions.push(fillIn(8, 3, '応用', 'This is ___ most interesting book I have read.', '___に入るのは？', ['the', 'a', 'more'], 0, [{ en: 'interesting', ja: '面白い' }]));
questions.push(jpToEn(8, 3, '応用', '彼は学校で一番英語が得意です。', jpToEnChoices('He is the best at English in his school.'), 0, [{ en: 'best', ja: '一番得意な' }]));
questions.push(errorDet(8, 3, '発展', '「英語は数学より面白いです。」正しい英文はどっち？', ['English is more interesting than math.', 'English is the more interesting than math.'], 0, [{ en: 'interesting', ja: '面白い' }]));
questions.push(meaning(8, 3, '発展', 'Tokyo is one of the biggest cities in the world.', 'どういう意味？', meaningChoices('東京は世界で最大の都市の一つです。'), 0, [{ en: 'biggest', ja: '最大の' }]));
questions.push(listening(8, 3, '発展', 'Who is the most popular singer in Japan?', ['日本で一番人気の歌手は誰ですか。', '日本で一番背が高い歌手は誰ですか。', '日本で一番若い歌手は誰ですか。'], 0, [{ en: 'popular', ja: '人気がある' }]));

// ── emit ──
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

for (const q of questions) {
  assertUniqueChoices(q);
}

const tsLines = [
  '/** Unit 6〜8 問題（自動生成）— tools/generate-unit6-plus.mjs */',
  "import type { Question } from '../../types';",
  '',
  'export const UNIT6_PLUS_QUESTIONS: Question[] = [',
  ...questions.map((q) => emitValue(q, 1) + ','),
  '];',
  '',
];

fs.writeFileSync('src/data/questions/unit6plus.ts', tsLines.join('\n'));
console.log(`Generated ${questions.length} questions (q642–q${id - 1})`);
