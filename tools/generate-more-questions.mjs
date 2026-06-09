/**
 * 問題数を約2倍にする第2弾（q175〜）。実行: node tools/generate-more-questions.mjs
 */
import fs from 'fs';

let id = 175;

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

// ── Unit 1 Step 1 (+18) be動詞 I/You ──
questions.push(
  meaning(1, 1, '基礎', 'I am Yuki.', 'Yukiは誰？', ['私', 'あなた', '彼女'], 0, [{ en: 'Yuki', ja: 'ユキ' }]),
  fillIn(1, 1, '基礎', 'I ___ a boy.', '___に入る単語はどれ？', ['am', 'is', 'are'], 0, [{ en: 'boy', ja: '男の子' }]),
  wordOrder(1, 1, '基礎', 'You are nice.', ['nice', 'are', 'You'], ['You', 'are', 'nice'], [{ en: 'nice', ja: 'すてきな' }]),
  jpToEn(1, 1, '基礎', 'あなたは学生ですか。', ['Are you a student?', 'You are a student?', 'Is you a student?'], 0, [{ en: 'student', ja: '生徒' }]),
  meaning(1, 1, '基礎', 'I am ten years old.', '何歳？', ['10歳', '9歳', '11歳'], 0, [{ en: 'ten', ja: '10' }]),
  listening(1, 1, '応用', 'You are my best friend.', ['あなたは私の親友です。', 'あなたは私の先生です。', 'あなたは私の兄です。'], 0, [{ en: 'best friend', ja: '親友' }]),
  errorDet(1, 1, '基礎', '正しい英文はどっち？', ['I am happy.', 'I are happy.'], 0, [{ en: 'happy', ja: 'うれしい' }]),
  fillIn(1, 1, '応用', '___ am from Kyoto.', '___に入る単語はどれ？', ['I', 'You', 'He'], 0, [{ en: 'Kyoto', ja: '京都' }]),
  meaning(1, 1, '応用', 'You are late.', 'どういう意味？', ['遅刻している', '早い', '元気'], 0, [{ en: 'late', ja: '遅い' }]),
  wordOrder(1, 1, '応用', 'I am in the park.', ['park', 'the', 'in', 'am', 'I'], ['I', 'am', 'in', 'the', 'park'], [{ en: 'park', ja: '公園' }]),
  jpToEn(1, 1, '応用', '私は元気です。', ['I am fine.', 'I am sad.', 'You are fine.'], 0, [{ en: 'fine', ja: '元気な' }]),
  meaning(1, 1, '基礎', 'You are welcome.', 'いつ使う？', ['お礼を言われたとき', '別れのとき', '朝のあいさつ'], 0, [{ en: 'welcome', ja: 'どういたしまして' }]),
  fillIn(1, 1, '基礎', 'You ___ my classmate.', '___に入る単語はどれ？', ['are', 'am', 'is'], 0, [{ en: 'classmate', ja: 'クラスメート' }]),
  listening(1, 1, '基礎', 'I am ready.', ['準備できています。', '疲れています。', 'お腹がすいています。'], 0, [{ en: 'ready', ja: '準備ができた' }]),
  errorDet(1, 1, '応用', '正しい英文はどっち？', ['You are kind.', 'You am kind.'], 0, [{ en: 'kind', ja: '親切な' }]),
  wordOrder(1, 1, '基礎', 'I am at home.', ['home', 'at', 'am', 'I'], ['I', 'am', 'at', 'home'], [{ en: 'home', ja: '家' }]),
  jpToEn(1, 1, '基礎', '私は中学生です。', ['I am a junior high school student.', 'I am a teacher.', 'You are a student.'], 0, [{ en: 'junior high school', ja: '中学校' }]),
  meaning(1, 1, '発展', 'You are right.', 'どういう意味？', ['その通り', '間違い', 'わからない'], 0, [{ en: 'right', ja: '正しい' }]),
);

// ── Unit 1 Step 2 (+15) He/She/We ──
questions.push(
  meaning(1, 2, '基礎', 'She is my sister.', 'Sheは誰？', ['姉妹', '先生', '友達'], 0, [{ en: 'sister', ja: '姉妹' }]),
  fillIn(1, 2, '基礎', 'He ___ my brother.', '___に入る単語はどれ？', ['is', 'am', 'are'], 0, [{ en: 'brother', ja: '兄弟' }]),
  wordOrder(1, 2, '基礎', 'We are a team.', ['team', 'a', 'are', 'We'], ['We', 'are', 'a', 'team'], [{ en: 'team', ja: 'チーム' }]),
  jpToEn(1, 2, '基礎', '彼は先生です。', ['He is a teacher.', 'She is a teacher.', 'He are a teacher.'], 0, [{ en: 'teacher', ja: '先生' }]),
  listening(1, 2, '応用', 'She is good at math.', ['彼女は数学が得意です。', '彼女は数学が嫌いです。', '彼女は数学を教えます。'], 0, [{ en: 'math', ja: '数学' }]),
  errorDet(1, 2, '基礎', '正しい英文はどっち？', ['We are busy.', 'We is busy.'], 0, [{ en: 'busy', ja: '忙しい' }]),
  meaning(1, 2, '応用', 'He is sick today.', '今日どうなっている？', ['病気', '元気', '旅行中'], 0, [{ en: 'sick', ja: '病気の' }]),
  fillIn(1, 2, '応用', 'She ___ in the kitchen.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [{ en: 'kitchen', ja: '台所' }]),
  wordOrder(1, 2, '応用', 'He is very kind.', ['kind', 'very', 'is', 'He'], ['He', 'is', 'very', 'kind'], [{ en: 'very', ja: 'とても' }]),
  jpToEn(1, 2, '応用', '私たちは同じクラスです。', ['We are in the same class.', 'They are in the same class.', 'We are in different classes.'], 0, [{ en: 'same', ja: '同じ' }]),
  meaning(1, 2, '基礎', 'She is thirteen.', '何歳？', ['13歳', '30歳', '3歳'], 0, [{ en: 'thirteen', ja: '13' }]),
  listening(1, 2, '基礎', 'He is at school now.', ['彼は今学校にいます。', '彼は今家にいます。', '彼は今病院にいます。'], 0, [{ en: 'school', ja: '学校' }]),
  fillIn(1, 2, '基礎', 'We ___ happy today.', '___に入る単語はどれ？', ['are', 'is', 'am'], 0, [{ en: 'today', ja: '今日' }]),
  errorDet(1, 2, '応用', '正しい英文はどっち？', ['She is a nurse.', 'She are a nurse.'], 0, [{ en: 'nurse', ja: '看護師' }]),
  meaning(1, 2, '発展', 'He is from Canada.', 'どこの出身？', ['カナダ', 'アメリカ', 'イギリス'], 0, [{ en: 'Canada', ja: 'カナダ' }]),
);

// ── Unit 1 Step 3 (+12) They/It ──
questions.push(
  meaning(1, 3, '応用', 'They are my parents.', 'Theyは誰？', ['両親', '友達', '先生'], 0, [{ en: 'parents', ja: '両親' }]),
  fillIn(1, 3, '応用', 'It ___ a pen.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [{ en: 'pen', ja: 'ペン' }]),
  wordOrder(1, 3, '応用', 'They are in the garden.', ['garden', 'the', 'in', 'are', 'They'], ['They', 'are', 'in', 'the', 'garden'], [{ en: 'garden', ja: '庭' }]),
  jpToEn(1, 3, '応用', 'それは犬です。', ['It is a dog.', 'It is a cat.', 'They are dogs.'], 0, [{ en: 'dog', ja: '犬' }]),
  listening(1, 3, '応用', 'This is my room.', ['これは私の部屋です。', 'これは私の机です。', 'あれは私の部屋です。'], 0, [{ en: 'room', ja: '部屋' }]),
  errorDet(1, 3, '応用', '正しい英文はどっち？', ['It is cold today.', 'It are cold today.'], 0, [{ en: 'cold', ja: '寒い' }]),
  meaning(1, 3, '発展', 'Those are my shoes.', '何について？', ['くつ', 'かばん', 'ぼうし'], 0, [{ en: 'shoes', ja: 'くつ' }]),
  fillIn(1, 3, '発展', 'These ___ my books.', '___に入る単語はどれ？', ['are', 'is', 'am'], 0, [{ en: 'books', ja: '本' }]),
  wordOrder(1, 3, '発展', 'That is an apple.', ['apple', 'an', 'is', 'That'], ['That', 'is', 'an', 'apple'], [{ en: 'apple', ja: 'りんご' }]),
  jpToEn(1, 3, '発展', '彼らは公園にいます。', ['They are in the park.', 'They are at school.', 'We are in the park.'], 0, [{ en: 'park', ja: '公園' }]),
  meaning(1, 3, '応用', 'It is hot today.', '今日の天気は？', ['暑い', '寒い', '雨'], 0, [{ en: 'hot', ja: '暑い' }]),
  listening(1, 3, '発展', 'They are from Australia.', ['彼らはオーストラリア出身です。', '彼らはオーストラリアにいます。', '彼らはオーストラリアが好きです。'], 0, [{ en: 'Australia', ja: 'オーストラリア' }]),
);

// ── Unit 2 Step 1 (+15) 一般動詞 現在形 ──
questions.push(
  meaning(2, 1, '基礎', 'I enjoy cooking.', '何が好き？', ['料理', '掃除', '買い物'], 0, [{ en: 'cooking', ja: '料理' }]),
  fillIn(2, 1, '基礎', 'She ___ the piano.', '___に入る単語はどれ？', ['plays', 'play', 'playing'], 0, [{ en: 'piano', ja: 'ピアノ' }]),
  wordOrder(2, 1, '基礎', 'I brush my teeth.', ['teeth', 'my', 'brush', 'I'], ['I', 'brush', 'my', 'teeth'], [{ en: 'brush', ja: 'みがく' }]),
  jpToEn(2, 1, '基礎', '彼は毎朝走ります。', ['He runs every morning.', 'He run every morning.', 'He runs every night.'], 0, [{ en: 'runs', ja: '走る' }]),
  meaning(2, 1, '基礎', 'He speaks Japanese.', '何語を話す？', ['日本語', '英語', '中国語'], 0, [{ en: 'speaks', ja: '話す' }]),
  listening(2, 1, '応用', 'I take a bath at night.', ['夜お風呂に入ります。', '朝お風呂に入ります。', '夜シャワーを浴びます。'], 0, [{ en: 'bath', ja: 'お風呂' }]),
  errorDet(2, 1, '応用', '「私は猫が好きです。」正しい英文はどっち？', ['I like cats.', 'I likes cats.'], 0, [{ en: 'cats', ja: '猫' }]),
  fillIn(2, 1, '応用', 'My father ___ the newspaper.', '___に入る単語はどれ？', ['reads', 'read', 'reading'], 0, [{ en: 'newspaper', ja: '新聞' }]),
  meaning(2, 1, '応用', 'She draws pictures.', '何をする？', ['絵を描く', '歌う', '踊る'], 0, [{ en: 'draws', ja: '描く' }]),
  wordOrder(2, 1, '応用', 'We eat lunch at noon.', ['noon', 'at', 'lunch', 'eat', 'We'], ['We', 'eat', 'lunch', 'at', 'noon'], [{ en: 'noon', ja: '正午' }]),
  jpToEn(2, 1, '応用', '彼女は英語を勉強します。', ['She studies English.', 'She study English.', 'He studies English.'], 0, [{ en: 'studies', ja: '勉強する' }]),
  meaning(2, 1, '基礎', 'Tom loves animals.', '何が大好き？', ['動物', '車', 'ゲーム'], 0, [{ en: 'animals', ja: '動物' }]),
  fillIn(2, 1, '基礎', 'Birds ___ in the sky.', '___に入る単語はどれ？', ['fly', 'flies', 'flying'], 0, [{ en: 'fly', ja: '飛ぶ' }]),
  listening(2, 1, '基礎', 'He washes his face.', ['彼は顔を洗います。', '彼は手を洗います。', '彼は髪を洗います。'], 0, [{ en: 'washes', ja: '洗う' }]),
  errorDet(2, 1, '基礎', '正しい英文はどっち？', ['She sings well.', 'She sing well.'], 0, [{ en: 'sings', ja: '歌う' }]),
);

// ── Unit 2 Step 2 (+12) ──
questions.push(
  meaning(2, 2, '基礎', 'I go to bed at ten.', '何時に寝る？', ['10時', '9時', '11時'], 0, [{ en: 'bed', ja: 'ベッド' }]),
  fillIn(2, 2, '応用', 'She ___ her homework.', '___に入る単語はどれ？', ['does', 'do', 'doing'], 0, [{ en: 'homework', ja: '宿題' }]),
  listening(2, 2, '応用', 'We play games on Sunday.', ['日曜日にゲームをします。', '土曜日にゲームをします。', '毎日ゲームをします。'], 0, [{ en: 'games', ja: 'ゲーム' }]),
  errorDet(2, 2, '応用', '正しい英文はどっち？', ['He goes to school.', 'He go to school.'], 0, [{ en: 'goes', ja: '行く' }]),
  wordOrder(2, 2, '応用', 'I buy bread at the store.', ['store', 'the', 'at', 'bread', 'buy', 'I'], ['I', 'buy', 'bread', 'at', 'the', 'store'], [{ en: 'bread', ja: 'パン' }]),
  jpToEn(2, 2, '応用', '母は料理が上手です。', ['My mother cooks well.', 'My mother cook well.', 'My father cooks well.'], 0, [{ en: 'cooks', ja: '料理する' }]),
  meaning(2, 2, '応用', 'They practice soccer after school.', 'いつ練習する？', ['放課後', '朝', '夜'], 0, [{ en: 'practice', ja: '練習する' }]),
  fillIn(2, 2, '発展', 'He ___ his room on Saturday.', '___に入る単語はどれ？', ['cleans', 'clean', 'cleaning'], 0, [{ en: 'cleans', ja: '掃除する' }]),
  meaning(2, 2, '基礎', 'I call my grandma.', '誰に電話する？', ['おばあちゃん', '先生', '友達'], 0, [{ en: 'call', ja: '電話する' }]),
  listening(2, 2, '基礎', 'She walks her dog.', ['彼女は犬を散歩します。', '彼女は犬と遊びます。', '彼女は犬を買います。'], 0, [{ en: 'walks', ja: '散歩する' }]),
  wordOrder(2, 2, '発展', 'Tom writes a letter.', ['letter', 'a', 'writes', 'Tom'], ['Tom', 'writes', 'a', 'letter'], [{ en: 'writes', ja: '書く' }]),
  jpToEn(2, 2, '発展', '私たちは週末に映画を見ます。', ['We watch movies on weekends.', 'We watches movies on weekends.', 'We watch movies on weekdays.'], 0, [{ en: 'movies', ja: '映画' }]),
);

// ── Unit 2 Step 3 (+12) ──
questions.push(
  wordOrder(2, 3, '応用', 'Lisa often sings songs.', ['songs', 'sings', 'often', 'Lisa'], ['Lisa', 'often', 'sings', 'songs'], [{ en: 'often', ja: 'よく' }]),
  meaning(2, 3, '応用', 'Ken sometimes eats out.', 'どのくらいの頻度？', ['時々', 'いつも', '決して'], 0, [{ en: 'sometimes', ja: '時々' }]),
  jpToEn(2, 3, '発展', '彼女は毎日ピアノを練習します。', ['She practices the piano every day.', 'She practice the piano every day.', 'She practices the piano every week.'], 0, [{ en: 'practices', ja: '練習する' }]),
  listening(2, 3, '発展', 'I never skip breakfast.', ['私は朝食を抜きません。', '私は朝食を食べません。', '私はいつも朝食を抜きます。'], 0, [{ en: 'never', ja: '決して〜ない' }]),
  fillIn(2, 3, '発展', 'He usually ___ up at six.', '___に入る単語はどれ？', ['gets', 'get', 'getting'], 0, [{ en: 'gets up', ja: '起きる' }]),
  errorDet(2, 3, '発展', '正しい英文はどっち？', ['She always helps me.', 'She always help me.'], 0, [{ en: 'always', ja: 'いつも' }]),
  meaning(2, 3, '発展', 'They ride bikes to school.', 'どうやって学校へ？', ['自転車で', 'バスで', '歩いて'], 0, [{ en: 'ride', ja: '乗る' }]),
  wordOrder(2, 3, '発展', 'We visit Kyoto in spring.', ['spring', 'in', 'Kyoto', 'visit', 'We'], ['We', 'visit', 'Kyoto', 'in', 'spring'], [{ en: 'spring', ja: '春' }]),
  jpToEn(2, 3, '応用', '彼は週に2回泳ぎます。', ['He swims twice a week.', 'He swim twice a week.', 'He swims once a week.'], 0, [{ en: 'twice', ja: '2回' }]),
  listening(2, 3, '応用', 'My sister teaches English.', ['姉は英語を教えています。', '姉は英語を勉強しています。', '姉は英語が好きです。'], 0, [{ en: 'teaches', ja: '教える' }]),
  fillIn(2, 3, '応用', 'I ___ shopping on Friday.', '___に入る単語はどれ？', ['go', 'goes', 'going'], 0, [{ en: 'shopping', ja: '買い物' }]),
  meaning(2, 3, '応用', 'He sends emails every day.', '何をする？', ['メールを送る', '手紙を書く', '電話する'], 0, [{ en: 'emails', ja: 'メール' }]),
);

// ── Unit 3 Step 1 (+12) 疑問文 ──
questions.push(
  meaning(3, 1, '基礎', 'Do you have a pet?', '何を聞いている？', ['ペットを飼っているか', 'ペットが好きか', 'ペットを探しているか'], 0, [{ en: 'pet', ja: 'ペット' }]),
  fillIn(3, 1, '基礎', '___ is your phone number?', '___に入る単語はどれ？', ['What', 'Where', 'Who'], 0, [{ en: 'phone number', ja: '電話番号' }]),
  wordOrder(3, 1, '基礎', 'Where is the station?', ['station', 'the', 'is', 'Where'], ['Where', 'is', 'the', 'station'], [{ en: 'station', ja: '駅' }]),
  jpToEn(3, 1, '基礎', 'あなたはテニスをしますか。', ['Do you play tennis?', 'Does you play tennis?', 'Are you play tennis?'], 0, [{ en: 'tennis', ja: 'テニス' }]),
  listening(3, 1, '応用', 'What is this?', ['これは何ですか。', 'あれは何ですか。', 'それは誰ですか。'], 0, [{ en: 'this', ja: 'これ' }]),
  errorDet(3, 1, '基礎', '正しい英文はどっち？', ['Are you hungry?', 'Is you hungry?'], 0, [{ en: 'hungry', ja: 'お腹がすいた' }]),
  meaning(3, 1, '応用', 'Do they speak English?', '何を聞いている？', ['英語を話すか', '英語が好きか', '英語を勉強するか'], 0, [{ en: 'speak', ja: '話す' }]),
  fillIn(3, 1, '応用', '___ are you from?', '___に入る単語はどれ？', ['Where', 'What', 'When'], 0, [{ en: 'from', ja: '〜出身' }]),
  meaning(3, 1, '基礎', 'Is this your bag?', '何を聞いている？', ['これはあなたのかばんか', 'かばんはどこか', 'かばんが好きか'], 0, [{ en: 'bag', ja: 'かばん' }]),
  wordOrder(3, 1, '応用', 'Who is that boy?', ['boy', 'that', 'is', 'Who'], ['Who', 'is', 'that', 'boy'], [{ en: 'boy', ja: '男の子' }]),
  jpToEn(3, 1, '応用', 'これはいくらですか。', ['How much is this?', 'How old is this?', 'What is this?'], 0, [{ en: 'How much', ja: 'いくら' }]),
  listening(3, 1, '基礎', 'Do you understand?', ['わかりますか。', '聞こえますか。', 'できますか。'], 0, [{ en: 'understand', ja: 'わかる' }]),
);

// ── Unit 3 Step 2 (+12) ──
questions.push(
  meaning(3, 2, '応用', 'Does she like dogs?', '何について？', ['犬が好きか', '犬を飼っているか', '犬を見たか'], 0, [{ en: 'dogs', ja: '犬' }]),
  fillIn(3, 2, '応用', 'How ___ is your sister?', '___に入る単語はどれ？', ['old', 'many', 'long'], 0, [{ en: 'sister', ja: '姉妹' }]),
  listening(3, 2, '応用', 'Where do you study?', ['どこで勉強しますか。', 'いつ勉強しますか。', '何を勉強しますか。'], 0, [{ en: 'study', ja: '勉強する' }]),
  jpToEn(3, 2, '応用', 'お母さんは何時に帰りますか。', ['What time does your mother come home?', 'What time do your mother come home?', 'What time is your mother come home?'], 0, [{ en: 'come home', ja: '帰る' }]),
  errorDet(3, 2, '応用', '正しい英文はどっち？', ['Does he live in Tokyo?', 'Do he live in Tokyo?'], 0, [{ en: 'live', ja: '住む' }]),
  wordOrder(3, 2, '応用', 'When does the class start?', ['start', 'class', 'the', 'does', 'When'], ['When', 'does', 'the', 'class', 'start'], [{ en: 'start', ja: '始まる' }]),
  meaning(3, 2, '応用', 'How many pens do you have?', '何を聞いている？', ['ペンの本数', 'ペンの色', 'ペンの値段'], 0, [{ en: 'pens', ja: 'ペン' }]),
  fillIn(3, 2, '発展', '___ does he go to school?', '___に入る単語はどれ？', ['How', 'What', 'Who'], 0, [{ en: 'How', ja: 'どのように' }]),
  meaning(3, 2, '基礎', 'Is there a bank near here?', '何を聞いている？', ['近くに銀行があるか', '銀行は何時までか', '銀行はどこか'], 0, [{ en: 'bank', ja: '銀行' }]),
  listening(3, 2, '基礎', 'What do you want?', ['何がほしいですか。', '何が好きですか。', '何をしていますか。'], 0, [{ en: 'want', ja: 'ほしい' }]),
  jpToEn(3, 2, '発展', '彼は何を食べますか。', ['What does he eat?', 'What do he eat?', 'What is he eat?'], 0, [{ en: 'eat', ja: '食べる' }]),
  errorDet(3, 2, '発展', '正しい英文はどっち？', ['Where do they work?', 'Where does they work?'], 0, [{ en: 'work', ja: '働く' }]),
);

// ── Unit 3 Step 3 (+12) ──
questions.push(
  meaning(3, 3, '発展', 'Who made this cake?', '何を聞いている？', ['誰が作ったか', 'いつ作ったか', 'どこで作ったか'], 0, [{ en: 'made', ja: '作った' }]),
  wordOrder(3, 3, '発展', 'What did you buy?', ['buy', 'you', 'did', 'What'], ['What', 'did', 'you', 'buy'], [{ en: 'buy', ja: '買う' }]),
  listening(3, 3, '発展', 'Why is she crying?', ['なぜ泣いているのですか。', 'いつ泣いたのですか。', 'どこで泣いているのですか。'], 0, [{ en: 'crying', ja: '泣いている' }]),
  jpToEn(3, 3, '発展', 'どのくらい時間がかかりますか。', ['How long does it take?', 'How many does it take?', 'How old does it take?'], 0, [{ en: 'How long', ja: 'どのくらい長く' }]),
  errorDet(3, 3, '発展', '正しい英文はどっち？', ['Which book do you like?', 'Which book does you like?'], 0, [{ en: 'Which', ja: 'どちら' }]),
  fillIn(3, 3, '発展', '___ did you go yesterday?', '___に入る単語はどれ？', ['Where', 'What', 'Who'], 0, [{ en: 'yesterday', ja: '昨日' }]),
  meaning(3, 3, '発展', 'Whose cap is this?', '何を聞いている？', ['誰のぼうしか', 'どのぼうしか', 'ぼうしはいくらか'], 0, [{ en: 'whose', ja: '誰の' }]),
  wordOrder(3, 3, '発展', 'How often do you exercise?', ['exercise', 'you', 'do', 'often', 'How'], ['How', 'often', 'do', 'you', 'exercise'], [{ en: 'exercise', ja: '運動する' }]),
  jpToEn(3, 3, '応用', '誰がその歌を歌いましたか。', ['Who sang the song?', 'Who sings the song?', 'What sang the song?'], 0, [{ en: 'sang', ja: '歌った' }]),
  listening(3, 3, '応用', 'What time does the movie start?', ['映画は何時に始まりますか。', '映画はどこで見ますか。', '映画は何時に終わりますか。'], 0, [{ en: 'movie', ja: '映画' }]),
  fillIn(3, 3, '応用', '___ is your favorite subject?', '___に入る単語はどれ？', ['What', 'Where', 'When'], 0, [{ en: 'subject', ja: '教科' }]),
  meaning(3, 3, '基礎', 'Can I ask a question?', '何をしたい？', ['質問したい', '答えたい', '帰りたい'], 0, [{ en: 'ask', ja: '尋ねる' }]),
);

// ── Unit 4 Step 1 (+9) 現在進行形 ──
questions.push(
  meaning(4, 1, '基礎', 'I am eating lunch now.', '今何をしている？', ['昼食を食べている', '朝食を食べている', '夕食を食べている'], 0, [{ en: 'eating', ja: '食べている' }]),
  wordOrder(4, 1, '基礎', 'She is drawing a picture.', ['picture', 'a', 'drawing', 'is', 'She'], ['She', 'is', 'drawing', 'a', 'picture'], [{ en: 'drawing', ja: '描いている' }]),
  fillIn(4, 1, '基礎', 'He ___ talking on the phone.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [{ en: 'talking', ja: '話している' }]),
  jpToEn(4, 1, '基礎', '彼らは今サッカーをしています。', ['They are playing soccer now.', 'They play soccer now.', 'They are play soccer now.'], 0, [{ en: 'playing', ja: 'している' }]),
  listening(4, 1, '応用', 'I am doing my homework.', ['宿題をしています。', '宿題を終えました。', '宿題を忘れました。'], 0, [{ en: 'homework', ja: '宿題' }]),
  errorDet(4, 1, '基礎', '正しい英文はどっち？', ['We are waiting for the bus.', 'We is waiting for the bus.'], 0, [{ en: 'waiting', ja: '待っている' }]),
  meaning(4, 1, '応用', 'The dog is sleeping.', '犬は何をしている？', ['寝ている', '走っている', '食べている'], 0, [{ en: 'sleeping', ja: '寝ている' }]),
  fillIn(4, 1, '応用', 'They ___ having fun.', '___に入る単語はどれ？', ['are', 'is', 'am'], 0, [{ en: 'having fun', ja: '楽しんでいる' }]),
  wordOrder(4, 1, '応用', 'Mom is making soup.', ['soup', 'making', 'is', 'Mom'], ['Mom', 'is', 'making', 'soup'], [{ en: 'making', ja: '作っている' }]),
);

// ── Unit 4 Step 2 (+9) ──
questions.push(
  meaning(4, 2, '応用', 'He is not studying now.', '今何をしていない？', ['勉強していない', '遊んでいない', '寝ていない'], 0, [{ en: 'studying', ja: '勉強している' }]),
  listening(4, 2, '応用', 'The children are laughing.', ['子どもたちは笑っています。', '子どもたちは泣いています。', '子どもたちは歌っています。'], 0, [{ en: 'laughing', ja: '笑っている' }]),
  jpToEn(4, 2, '応用', '彼女はピアノを弾いています。', ['She is playing the piano.', 'She plays the piano.', 'She is play the piano.'], 0, [{ en: 'playing', ja: '弾いている' }]),
  fillIn(4, 2, '応用', 'It ___ getting dark.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [{ en: 'dark', ja: '暗い' }]),
  wordOrder(4, 2, '応用', 'Are they watching TV?', ['TV', 'watching', 'they', 'Are'], ['Are', 'they', 'watching', 'TV'], [{ en: 'watching', ja: '見ている' }]),
  errorDet(4, 2, '応用', '正しい英文はどっち？', ['I am reading a book.', 'I are reading a book.'], 0, [{ en: 'reading', ja: '読んでいる' }]),
  meaning(4, 2, '応用', 'We are cleaning the room.', '何をしている？', ['部屋を掃除している', '部屋を探している', '部屋を借りている'], 0, [{ en: 'cleaning', ja: '掃除している' }]),
  listening(4, 2, '基礎', 'She is washing the dishes.', ['彼女は皿を洗っています。', '彼女は服を洗っています。', '彼女は車を洗っています。'], 0, [{ en: 'dishes', ja: '皿' }]),
  jpToEn(4, 2, '基礎', '雨が降っています。', ['It is raining.', 'It rains.', 'It is rain.'], 0, [{ en: 'raining', ja: '雨が降っている' }]),
);

// ── Unit 4 Step 3 (+6) ──
questions.push(
  meaning(4, 3, '発展', 'Who are you waiting for?', '何を聞いている？', ['誰を待っているか', 'いつ来るか', 'どこで待つか'], 0, [{ en: 'waiting for', ja: '待っている' }]),
  listening(4, 3, '発展', 'Look! A bird is flying.', ['鳥が飛んでいます。', '鳥が歌っています。', '鳥が寝ています。'], 0, [{ en: 'flying', ja: '飛んでいる' }]),
  jpToEn(4, 3, '発展', '今何をしていますか。', ['What are you doing now?', 'What do you do now?', 'What did you do now?'], 0, [{ en: 'doing', ja: 'している' }]),
  fillIn(4, 3, '発展', 'The cat ___ climbing the tree.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [{ en: 'climbing', ja: '登っている' }]),
  wordOrder(4, 3, '発展', 'They are building a house.', ['house', 'a', 'building', 'are', 'They'], ['They', 'are', 'building', 'a', 'house'], [{ en: 'building', ja: '建てている' }]),
  errorDet(4, 3, '発展', '正しい英文はどっち？', ['She is running fast.', 'She are running fast.'], 0, [{ en: 'running', ja: '走っている' }]),
);

// ── Unit 5 Step 1 (+9) can ──
questions.push(
  meaning(5, 1, '基礎', 'I can cook.', '何ができる？', ['料理', '泳ぐ', '運転'], 0, [{ en: 'cook', ja: '料理する' }]),
  wordOrder(5, 1, '基礎', 'He can play the guitar.', ['guitar', 'the', 'play', 'can', 'He'], ['He', 'can', 'play', 'the', 'guitar'], [{ en: 'guitar', ja: 'ギター' }]),
  fillIn(5, 1, '基礎', 'She ___ dance well.', '___に入る単語はどれ？', ['can', 'cans', 'canning'], 0, [{ en: 'dance', ja: '踊る' }]),
  jpToEn(5, 1, '基礎', '私は自転車に乗れます。', ['I can ride a bike.', 'I can rides a bike.', 'I can riding a bike.'], 0, [{ en: 'ride', ja: '乗る' }]),
  listening(5, 1, '応用', 'Birds can fly high.', ['鳥は高く飛べます。', '鳥は速く走れます。', '鳥は深く泳げます。'], 0, [{ en: 'high', ja: '高く' }]),
  errorDet(5, 1, '基礎', '正しい英文はどっち？', ['You can sing.', 'You can sings.'], 0, [{ en: 'sing', ja: '歌う' }]),
  meaning(5, 1, '応用', 'He can use a computer.', '何ができる？', ['パソコンを使える', 'パソコンを買える', 'パソコンが好き'], 0, [{ en: 'computer', ja: 'パソコン' }]),
  fillIn(5, 1, '応用', 'We ___ speak a little English.', '___に入る単語はどれ？', ['can', 'must', 'may'], 0, [{ en: 'a little', ja: '少し' }]),
  jpToEn(5, 1, '応用', '彼女は速く走れます。', ['She can run fast.', 'She can runs fast.', 'She can running fast.'], 0, [{ en: 'fast', ja: '速く' }]),
);

// ── Unit 5 Step 2 (+9) must/may ──
questions.push(
  meaning(5, 2, '応用', 'You must wear a uniform.', '何をしなければならない？', ['制服を着る', '帽子をかぶる', '靴を脱ぐ'], 0, [{ en: 'uniform', ja: '制服' }]),
  jpToEn(5, 2, '応用', 'ここで写真を撮ってもいいですか。', ['May I take a photo here?', 'Must I take a photo here?', 'Can I takes a photo here?'], 0, [{ en: 'photo', ja: '写真' }]),
  listening(5, 2, '応用', 'You must be quiet.', ['静かにしなければなりません。', '静かにしてもいいです。', '静かにできません。'], 0, [{ en: 'quiet', ja: '静かな' }]),
  fillIn(5, 2, '応用', 'You ___ not eat in the library.', '___に入る単語はどれ？', ['must', 'can', 'may'], 0, [{ en: 'library', ja: '図書館' }]),
  errorDet(5, 2, '応用', '正しい英文はどっち？', ['May I sit here?', 'May I sits here?'], 0, [{ en: 'sit', ja: '座る' }]),
  meaning(5, 2, '応用', 'Can I use your dictionary?', '何をしたい？', ['辞書を借りたい', '辞書を買いたい', '辞書を返したい'], 0, [{ en: 'dictionary', ja: '辞書' }]),
  wordOrder(5, 2, '応用', 'You must do your best.', ['best', 'your', 'do', 'must', 'You'], ['You', 'must', 'do', 'your', 'best'], [{ en: 'best', ja: '最善' }]),
  jpToEn(5, 2, '基礎', '宿題をしなければなりません。', ['You must do your homework.', 'You must does your homework.', 'You can do your homework.'], 0, [{ en: 'must', ja: '〜しなければならない' }]),
  listening(5, 2, '基礎', 'May I come in?', ['入ってもいいですか。', '入ってはいけません。', '入りなければなりません。'], 0, [{ en: 'come in', ja: '入る' }]),
);

// ── Unit 5 Step 3 (+12) should ──
questions.push(
  wordOrder(5, 3, '発展', 'You should try again.', ['again', 'try', 'should', 'You'], ['You', 'should', 'try', 'again'], [{ en: 'again', ja: 'もう一度' }]),
  meaning(5, 3, '発展', 'We should save water.', '何をすべき？', ['水を大切にする', '水を飲む', '水を買う'], 0, [{ en: 'save', ja: '節約する' }]),
  jpToEn(5, 3, '発展', 'もっと野菜を食べるべきです。', ['You should eat more vegetables.', 'You should eats more vegetables.', 'You can eat more vegetables.'], 0, [{ en: 'vegetables', ja: '野菜' }]),
  listening(5, 3, '発展', 'May I borrow your eraser?', ['消しゴムを借りてもいいですか。', '消しゴムを貸してもいいですか。', '消しゴムを使わなければなりません。'], 0, [{ en: 'borrow', ja: '借りる' }]),
  fillIn(5, 3, '発展', 'You ___ not be late for school.', '___に入る単語はどれ？', ['should', 'can', 'may'], 0, [{ en: 'late', ja: '遅刻した' }]),
  errorDet(5, 3, '発展', '正しい英文はどっち？', ['We should help each other.', 'We should helps each other.'], 0, [{ en: 'each other', ja: 'お互い' }]),
  meaning(5, 3, '発展', 'You can ask me anytime.', 'いつでも何ができる？', ['質問できる', '帰れる', '休める'], 0, [{ en: 'anytime', ja: 'いつでも' }]),
  wordOrder(5, 3, '発展', 'Students must follow the rules.', ['rules', 'the', 'follow', 'must', 'Students'], ['Students', 'must', 'follow', 'the', 'rules'], [{ en: 'rules', ja: '規則' }]),
  jpToEn(5, 3, '応用', '早く寝るべきです。', ['You should go to bed early.', 'You should goes to bed early.', 'You must go to bed early.'], 0, [{ en: 'early', ja: '早く' }]),
  listening(5, 3, '応用', 'We should protect the earth.', ['地球を守るべきです。', '地球を探すべきです。', '地球を見るべきです。'], 0, [{ en: 'protect', ja: '守る' }]),
  fillIn(5, 3, '応用', 'I ___ help my parents.', '___に入る単語はどれ？', ['should', 'can', 'may'], 0, [{ en: 'parents', ja: '両親' }]),
  meaning(5, 3, '基礎', 'May I leave early today?', '何を許可してもらいたい？', ['早く帰る', '早く食べる', '早く起きる'], 0, [{ en: 'leave', ja: '帰る' }]),
);

function formatQuestion(q) {
  const parts = [`  { id: '${q.id}', unit: ${q.unit}, step: ${q.step}, level: '${q.level}', type: '${q.type}'`];
  if (q.sentence) parts.push(`sentence: '${q.sentence.replace(/'/g, "\\'")}'`);
  if (q.japanese) parts.push(`japanese: '${q.japanese.replace(/'/g, "\\'")}'`);
  parts.push(`question: '${q.question.replace(/'/g, "\\'")}'`);
  if (q.words) parts.push(`words: [${q.words.map((w) => `'${w}'`).join(', ')}]`);
  if (q.choices) parts.push(`choices: [${q.choices.map((c) => `'${c.replace(/'/g, "\\'")}'`).join(', ')}]`);
  if (q.answer !== undefined) {
    parts.push(Array.isArray(q.answer) ? `answer: [${q.answer.map((a) => `'${a}'`).join(', ')}]` : `answer: ${q.answer}`);
  }
  if (q.showText) parts.push('showText: true');
  if (q.vocab) {
    parts.push(`vocab: [${q.vocab.map((v) => `{ en: '${v.en.replace(/'/g, "\\'")}', ja: '${v.ja.replace(/'/g, "\\'")}' }`).join(', ')}]`);
  }
  return `${parts.join(', ')} },`;
}

const out = `import type { Question } from '../../types';

/** 追加問題 第2弾（問題数約2倍） */
export const ADDITIONAL_QUESTIONS_2: Question[] = [
${questions.map(formatQuestion).join('\n')}
];
`;

fs.writeFileSync(new URL('../src/data/questions/additional2.ts', import.meta.url), out);
console.log(`Generated ${questions.length} questions (q175–q${id - 1})`);
