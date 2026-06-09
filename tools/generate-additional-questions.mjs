/**
 * 各 step の問題数を約3倍にする追加問題を生成する。
 * 実行: node tools/generate-additional-questions.mjs
 */
import fs from 'fs';

let id = 59;

function qid() {
  return `q${String(id++).padStart(3, '0')}`;
}

function meaning(unit, step, level, sentence, question, choices, answer, vocab) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'meaning',
    sentence,
    question,
    choices,
    answer,
    showText: true,
    vocab,
  };
}

function fillIn(unit, step, level, sentence, question, choices, answer, vocab) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'fill-in',
    sentence,
    question,
    choices,
    answer,
    vocab,
  };
}

function wordOrder(unit, step, level, sentence, words, answer, vocab) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'word-order',
    sentence,
    question: '正しい順番に並べよう',
    words,
    answer,
    vocab,
  };
}

function jpToEn(unit, step, level, japanese, choices, answer, vocab) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'jp-to-en',
    japanese,
    question: '日本語に合う英文はどれ？',
    choices,
    answer,
    vocab,
  };
}

function listening(unit, step, level, sentence, choices, answer, vocab) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'listening',
    sentence,
    question: '聞こえた英文の意味はどれ？',
    choices,
    answer,
    vocab,
  };
}

function errorDet(unit, step, level, question, choices, answer, vocab) {
  return {
    id: qid(),
    unit,
    step,
    level,
    type: 'error-detection',
    question,
    choices,
    answer,
    vocab,
  };
}

const questions = [];

// ── Unit 1 Step 1: be動詞 I / You（+12 → 計18）──
questions.push(
  meaning(1, 1, '基礎', 'I am twelve years old.', '何歳？', ['12歳', '13歳', '11歳'], 0, [
    { en: 'twelve', ja: '12' },
    { en: 'years old', ja: '歳' },
  ]),
  fillIn(1, 1, '基礎', 'I ___ twelve years old.', '___に入る単語はどれ？', ['am', 'is', 'are'], 0, [
    { en: 'am', ja: '〜です' },
  ]),
  wordOrder(1, 1, '基礎', 'I am twelve years old.', ['old', 'years', 'twelve', 'am', 'I'], ['I', 'am', 'twelve', 'years', 'old'], [
    { en: 'twelve', ja: '12' },
  ]),
  jpToEn(1, 1, '基礎', 'あなたは親切です。', ['You are kind.', 'You are tall.', 'I am kind.'], 0, [
    { en: 'kind', ja: '親切な' },
  ]),
  meaning(1, 1, '基礎', 'You are my teacher.', 'teacherは誰？', ['先生', '生徒', '友達'], 0, [
    { en: 'teacher', ja: '先生' },
    { en: 'my', ja: '私の' },
  ]),
  fillIn(1, 1, '基礎', 'You ___ my teacher.', '___に入る単語はどれ？', ['are', 'am', 'is'], 0, [
    { en: 'are', ja: '〜です（you）' },
  ]),
  wordOrder(1, 1, '基礎', 'You are my teacher.', ['teacher', 'my', 'are', 'You'], ['You', 'are', 'my', 'teacher'], [
    { en: 'teacher', ja: '先生' },
  ]),
  jpToEn(1, 1, '基礎', '私は生徒です。', ['I am a student.', 'You are a student.', 'I am a teacher.'], 0, [
    { en: 'student', ja: '生徒' },
  ]),
  listening(1, 1, '応用', 'I am from Osaka.', ['私は大阪出身です。', '私は大阪にいます。', '私は大阪が好きです。'], 0, [
    { en: 'Osaka', ja: '大阪' },
    { en: 'from', ja: '〜出身' },
  ]),
  errorDet(1, 1, '基礎', '正しい英文はどっち？', ['You are my friend.', 'You is my friend.'], 0, [
    { en: 'friend', ja: '友達' },
  ]),
  meaning(1, 1, '基礎', 'I am tired.', 'どんな状態？', ['疲れている', 'うれしい', 'お腹がすいている'], 0, [
    { en: 'tired', ja: '疲れた' },
  ]),
  fillIn(1, 1, '応用', '___ are my friend.', '___に入る単語はどれ？', ['You', 'I', 'He'], 0, [
    { en: 'friend', ja: '友達' },
  ]),
);

// ── Unit 1 Step 2: He / She / We（+10 → 計15）──
questions.push(
  meaning(1, 2, '基礎', 'He is a doctor.', 'Heは何者？', ['医者', '生徒', '先生'], 0, [
    { en: 'doctor', ja: '医者' },
  ]),
  fillIn(1, 2, '基礎', 'She ___ a nurse.', '___に入る単語はどれ？', ['is', 'am', 'are'], 0, [
    { en: 'nurse', ja: '看護師' },
  ]),
  wordOrder(1, 2, '基礎', 'He is a doctor.', ['doctor', 'a', 'is', 'He'], ['He', 'is', 'a', 'doctor'], [
    { en: 'doctor', ja: '医者' },
  ]),
  jpToEn(1, 2, '基礎', '彼女は背が高いです。', ['She is tall.', 'He is tall.', 'She is short.'], 0, [
    { en: 'tall', ja: '背が高い' },
  ]),
  meaning(1, 2, '基礎', 'We are friends.', 'Weはどんな関係？', ['友達', '兄弟', '先生と生徒'], 0, [
    { en: 'friends', ja: '友達' },
  ]),
  listening(1, 2, '応用', 'She is in the library.', ['彼女は図書館にいます。', '彼女は教室にいます。', '彼女は家にいます。'], 0, [
    { en: 'library', ja: '図書館' },
  ]),
  errorDet(1, 2, '基礎', '正しい英文はどっち？', ['He is tall.', 'He are tall.'], 0, [
    { en: 'tall', ja: '背が高い' },
  ]),
  fillIn(1, 2, '応用', 'We ___ in the gym.', '___に入る単語はどれ？', ['are', 'is', 'am'], 0, [
    { en: 'gym', ja: '体育館' },
  ]),
  meaning(1, 2, '応用', 'He is hungry.', 'どんな状態？', ['お腹がすいている', 'のどが渇いている', '眠い'], 0, [
    { en: 'hungry', ja: 'お腹がすいた' },
  ]),
  jpToEn(1, 2, '応用', '私たちは同級生です。', ['We are classmates.', 'We are teachers.', 'They are classmates.'], 0, [
    { en: 'classmates', ja: '同級生' },
  ]),
);

// ── Unit 1 Step 3: They / It（+8 → 計12）──
questions.push(
  meaning(1, 3, '応用', 'They are students.', 'Theyは何者？', ['生徒', '先生', '医者'], 0, [
    { en: 'students', ja: '生徒たち' },
  ]),
  fillIn(1, 3, '応用', 'It ___ a dog.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [
    { en: 'dog', ja: '犬' },
  ]),
  wordOrder(1, 3, '応用', 'They are from America.', ['America', 'from', 'are', 'They'], ['They', 'are', 'from', 'America'], [
    { en: 'America', ja: 'アメリカ' },
  ]),
  jpToEn(1, 3, '応用', 'それは私のかばんです。', ['It is my bag.', 'It is my pen.', 'This is my bag.'], 0, [
    { en: 'bag', ja: 'かばん' },
  ]),
  listening(1, 3, '応用', 'It is a beautiful day.', ['今日はいい天気です。', '今日は雨です。', '今日は寒いです。'], 0, [
    { en: 'beautiful', ja: '美しい' },
    { en: 'day', ja: '日' },
  ]),
  errorDet(1, 3, '応用', '正しい英文はどっち？', ['They are happy.', 'They is happy.'], 0, [
    { en: 'happy', ja: 'うれしい' },
  ]),
  meaning(1, 3, '発展', 'This is my desk.', 'deskは誰の？', ['私の', 'あなたの', '彼の'], 0, [
    { en: 'desk', ja: '机' },
  ]),
  fillIn(1, 3, '発展', 'That ___ a bird.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [
    { en: 'bird', ja: '鳥' },
  ]),
);

// ── Unit 2 Step 1: 一般動詞 現在形（+10 → 計15）──
questions.push(
  meaning(2, 1, '基礎', 'I like dogs.', '何が好き？', ['犬', '猫', '鳥'], 0, [
    { en: 'dogs', ja: '犬' },
  ]),
  fillIn(2, 1, '基礎', 'She ___ tennis.', '___に入る単語はどれ？', ['plays', 'play', 'playing'], 0, [
    { en: 'tennis', ja: 'テニス' },
  ]),
  wordOrder(2, 1, '基礎', 'He likes baseball.', ['baseball', 'likes', 'He'], ['He', 'likes', 'baseball'], [
    { en: 'baseball', ja: '野球' },
  ]),
  jpToEn(2, 1, '基礎', '私は毎日走ります。', ['I run every day.', 'I runs every day.', 'He runs every day.'], 0, [
    { en: 'run', ja: '走る' },
    { en: 'every day', ja: '毎日' },
  ]),
  meaning(2, 1, '基礎', 'She studies English.', '何を勉強する？', ['英語', '数学', '理科'], 0, [
    { en: 'studies', ja: '勉強する' },
  ]),
  listening(2, 1, '応用', 'I listen to music.', ['音楽を聞きます。', '音楽が好きです。', '音楽を作ります。'], 0, [
    { en: 'listen', ja: '聞く' },
  ]),
  errorDet(2, 1, '応用', '「彼は野球をします。」正しい英文はどっち？', ['He plays baseball.', 'He play baseball.'], 0, [
    { en: 'plays', ja: 'する（三人称）' },
  ]),
  fillIn(2, 1, '応用', 'My mother ___ dinner.', '___に入る単語はどれ？', ['cooks', 'cook', 'cooking'], 0, [
    { en: 'cooks', ja: '料理する' },
  ]),
  meaning(2, 1, '応用', 'Tom walks to school.', 'どうやって学校へ？', ['歩いて', 'バスで', '自転車で'], 0, [
    { en: 'walks', ja: '歩く' },
  ]),
  jpToEn(2, 1, '応用', '彼はピアノを弾きます。', ['He plays the piano.', 'He play the piano.', 'He plays piano every day.'], 0, [
    { en: 'piano', ja: 'ピアノ' },
  ]),
);

// ── Unit 2 Step 2（+8 → 計12）──
questions.push(
  meaning(2, 2, '基礎', 'My sister gets up early.', 'いつ起きる？', ['早く', '遅く', '昼ごろ'], 0, [
    { en: 'early', ja: '早く' },
  ]),
  fillIn(2, 2, '応用', 'He ___ to bed at ten.', '___に入る単語はどれ？', ['goes', 'go', 'going'], 0, [
    { en: 'goes', ja: '行く（三人称）' },
  ]),
  listening(2, 2, '応用', 'My mother cleans the house.', ['母は家を掃除します。', '母は料理します。', '母は買い物します。'], 0, [
    { en: 'cleans', ja: '掃除する' },
  ]),
  errorDet(2, 2, '応用', '「私たちは夕食後にテレビを見ます。」正しい英文はどっち？', ['We watch TV after dinner.', 'We watches TV after dinner.'], 0, [
    { en: 'watch', ja: '見る' },
  ]),
  wordOrder(2, 2, '応用', 'She drinks milk every morning.', ['morning', 'every', 'milk', 'drinks', 'She'], ['She', 'drinks', 'milk', 'every', 'morning'], [
    { en: 'drinks', ja: '飲む' },
  ]),
  jpToEn(2, 2, '応用', '父は会社で働きます。', ['My father works at a company.', 'My father work at a company.', 'My father works at a hospital.'], 0, [
    { en: 'company', ja: '会社' },
  ]),
  meaning(2, 2, '応用', 'We have lunch at school.', 'どこで昼食？', ['学校', '家', '公園'], 0, [
    { en: 'lunch', ja: '昼食' },
  ]),
  fillIn(2, 2, '発展', 'They ___ homework after school.', '___に入る単語はどれ？', ['do', 'does', 'doing'], 0, [
    { en: 'homework', ja: '宿題' },
  ]),
);

// ── Unit 2 Step 3（+8 → 計12）──
questions.push(
  wordOrder(2, 3, '応用', 'Mary takes a bus to school.', ['school', 'to', 'bus', 'a', 'takes', 'Mary'], ['Mary', 'takes', 'a', 'bus', 'to', 'school'], [
    { en: 'takes', ja: '乗る' },
  ]),
  meaning(2, 3, '応用', 'Ken often plays basketball.', 'どのくらいの頻度？', ['よく', 'たまに', '決して'], 0, [
    { en: 'often', ja: 'よく' },
  ]),
  jpToEn(2, 3, '発展', '彼は毎週土曜日に泳ぎます。', ['He swims on Saturdays.', 'He swim on Saturdays.', 'He swims on Sunday.'], 0, [
    { en: 'swims', ja: '泳ぐ' },
  ]),
  listening(2, 3, '発展', 'She never eats fast food.', ['彼女はファストフードを食べません。', '彼女はいつも食べます。', '彼女は時々食べます。'], 0, [
    { en: 'never', ja: '決して〜ない' },
  ]),
  fillIn(2, 3, '発展', 'I usually ___ home at four.', '___に入る単語はどれ？', ['get', 'gets', 'getting'], 0, [
    { en: 'usually', ja: 'たいてい' },
  ]),
  errorDet(2, 3, '発展', '正しい英文はどっち？', ['Tom goes to school by train.', 'Tom go to school by train.'], 0, [
    { en: 'train', ja: '電車' },
  ]),
  meaning(2, 3, '発展', 'They visit their grandma on Sundays.', 'いつおばあちゃんを訪ねる？', ['日曜日', '土曜日', '毎日'], 0, [
    { en: 'visit', ja: '訪ねる' },
  ]),
  wordOrder(2, 3, '発展', 'I sometimes ride my bike.', ['bike', 'my', 'ride', 'sometimes', 'I'], ['I', 'sometimes', 'ride', 'my', 'bike'], [
    { en: 'ride', ja: '乗る' },
  ]),
);

// ── Unit 3 Step 1（+8 → 計12）──
questions.push(
  meaning(3, 1, '基礎', 'Do you play the guitar?', '何を聞いている？', ['ギターを弾くか', 'ギターが好きか', 'ギターを持っているか'], 0, [
    { en: 'guitar', ja: 'ギター' },
  ]),
  fillIn(3, 1, '基礎', '___ do you live?', '___に入る単語はどれ？', ['Where', 'What', 'Who'], 0, [
    { en: 'live', ja: '住む' },
  ]),
  wordOrder(3, 1, '基礎', 'What is your hobby?', ['hobby', 'your', 'is', 'What'], ['What', 'is', 'your', 'hobby'], [
    { en: 'hobby', ja: '趣味' },
  ]),
  jpToEn(3, 1, '基礎', 'あなたはサッカーが好きですか。', ['Do you like soccer?', 'Does you like soccer?', 'Are you like soccer?'], 0, [
    { en: 'soccer', ja: 'サッカー' },
  ]),
  listening(3, 1, '応用', 'What time is it?', ['今何時ですか。', '何時に起きますか。', '何時に寝ますか。'], 0, [
    { en: 'time', ja: '時間' },
  ]),
  errorDet(3, 1, '基礎', '正しい英文はどっち？', ['Where do you study?', 'Where does you study?'], 0, [
    { en: 'study', ja: '勉強する' },
  ]),
  meaning(3, 1, '応用', 'Are you a student?', '何を聞いている？', ['生徒かどうか', '先生かどうか', '名前'], 0, [
    { en: 'student', ja: '生徒' },
  ]),
  fillIn(3, 1, '応用', '___ is your favorite color?', '___に入る単語はどれ？', ['What', 'Where', 'When'], 0, [
    { en: 'color', ja: '色' },
  ]),
);

// ── Unit 3 Step 2（+8 → 計12）──
questions.push(
  meaning(3, 2, '応用', 'Does she like cats?', '何について？', ['猫が好きか', '猫を飼っているか', '猫を見たか'], 0, [
    { en: 'cats', ja: '猫' },
  ]),
  fillIn(3, 2, '応用', 'How ___ is your brother?', '___に入る単語はどれ？', ['old', 'long', 'many'], 0, [
    { en: 'brother', ja: '兄弟' },
  ]),
  listening(3, 2, '応用', 'Where is the station?', ['駅はどこですか。', '駅は何時ですか。', '駅はどのくらい遠いですか。'], 0, [
    { en: 'station', ja: '駅' },
  ]),
  jpToEn(3, 2, '応用', 'お父さんは何をしますか。', ['What does your father do?', 'What do your father do?', 'What is your father do?'], 0, [
    { en: 'father', ja: 'お父さん' },
  ]),
  errorDet(3, 2, '応用', '正しい英文はどっち？', ['Does he like music?', 'Do he like music?'], 0, [
    { en: 'music', ja: '音楽' },
  ]),
  wordOrder(3, 2, '応用', 'When do you go to bed?', ['bed', 'to', 'go', 'you', 'do', 'When'], ['When', 'do', 'you', 'go', 'to', 'bed'], [
    { en: 'bed', ja: 'ベッド' },
  ]),
  meaning(3, 2, '応用', 'How many books do you have?', '何を聞いている？', ['冊数', '値段', '色'], 0, [
    { en: 'books', ja: '本' },
  ]),
  fillIn(3, 2, '発展', '___ does she get up?', '___に入る単語はどれ？', ['When', 'What', 'Who'], 0, [
    { en: 'get up', ja: '起きる' },
  ]),
);

// ── Unit 3 Step 3（+8 → 計12）──
questions.push(
  meaning(3, 3, '発展', 'Who teaches you English?', '誰について？', ['英語を教える人', '英語が好きな人', '英語の先生の名前'], 0, [
    { en: 'teaches', ja: '教える' },
  ]),
  wordOrder(3, 3, '発展', 'What do you want to eat?', ['eat', 'to', 'want', 'you', 'do', 'What'], ['What', 'do', 'you', 'want', 'to', 'eat'], [
    { en: 'want', ja: '〜したい' },
  ]),
  listening(3, 3, '発展', 'Why are you late?', ['なぜ遅れたのですか。', 'いつ来ましたか。', 'どこにいましたか。'], 0, [
    { en: 'late', ja: '遅れた' },
  ]),
  jpToEn(3, 3, '発展', '誰がその本を読みましたか。', ['Who read the book?', 'Who reads the book?', 'What read the book?'], 0, [
    { en: 'Who', ja: '誰' },
  ]),
  errorDet(3, 3, '発展', '正しい英文はどっち？', ['How do you spell it?', 'How does you spell it?'], 0, [
    { en: 'spell', ja: 'つづりを言う' },
  ]),
  fillIn(3, 3, '発展', '___ do they practice soccer?', '___に入る単語はどれ？', ['Where', 'What', 'Who'], 0, [
    { en: 'practice', ja: '練習する' },
  ]),
  meaning(3, 3, '発展', 'Which bag is yours?', '何を聞いている？', ['どのかばんか', 'いくつか', 'だれのか'], 0, [
    { en: 'bag', ja: 'かばん' },
  ]),
  wordOrder(3, 3, '発展', 'Why does he study hard?', ['hard', 'study', 'does', 'he', 'Why'], ['Why', 'does', 'he', 'study', 'hard'], [
    { en: 'hard', ja: '一生懸命' },
  ]),
);

// ── Unit 4 Step 1（+6 → 計9）──
questions.push(
  meaning(4, 1, '基礎', 'They are eating lunch.', '今何をしている？', ['昼食を食べている', '朝食を食べている', '夕食を食べている'], 0, [
    { en: 'eating', ja: '食べている' },
  ]),
  wordOrder(4, 1, '基礎', 'He is reading a book.', ['book', 'a', 'reading', 'is', 'He'], ['He', 'is', 'reading', 'a', 'book'], [
    { en: 'reading', ja: '読んでいる' },
  ]),
  fillIn(4, 1, '基礎', 'We ___ waiting for the bus.', '___に入る単語はどれ？', ['are', 'is', 'am'], 0, [
    { en: 'waiting', ja: '待っている' },
  ]),
  jpToEn(4, 1, '基礎', '彼女は今ピアノを練習しています。', ['She is practicing the piano now.', 'She practices the piano now.', 'She is practice the piano now.'], 0, [
    { en: 'practicing', ja: '練習している' },
  ]),
  listening(4, 1, '応用', 'I am writing a letter.', ['手紙を書いています。', '手紙を読んでいます。', '手紙を送っています。'], 0, [
    { en: 'writing', ja: '書いている' },
  ]),
  errorDet(4, 1, '基礎', '正しい英文はどっち？', ['She is cooking dinner.', 'She are cooking dinner.'], 0, [
    { en: 'cooking', ja: '料理している' },
  ]),
);

// ── Unit 4 Step 2（+6 → 計9）──
questions.push(
  meaning(4, 2, '応用', 'He is not sleeping now.', '今何をしていない？', ['寝ていない', '食べていない', '遊んでいない'], 0, [
    { en: 'sleeping', ja: '寝ている' },
  ]),
  listening(4, 2, '応用', 'The children are singing a song.', ['子どもたちは歌を歌っています。', '子どもたちは踊っています。', '子どもたちは話しています。'], 0, [
    { en: 'singing', ja: '歌っている' },
  ]),
  jpToEn(4, 2, '応用', '私たちは公園でサッカーをしています。', ['We are playing soccer in the park.', 'We play soccer in the park.', 'We are play soccer in the park.'], 0, [
    { en: 'playing', ja: '遊んでいる' },
  ]),
  fillIn(4, 2, '応用', 'It ___ snowing outside.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [
    { en: 'snowing', ja: '雪が降っている' },
  ]),
  wordOrder(4, 2, '応用', 'Are you listening to me?', ['me', 'to', 'listening', 'you', 'Are'], ['Are', 'you', 'listening', 'to', 'me'], [
    { en: 'listening', ja: '聞いている' },
  ]),
  errorDet(4, 2, '応用', '正しい英文はどっち？', ['They are running in the gym.', 'They is running in the gym.'], 0, [
    { en: 'running', ja: '走っている' },
  ]),
);

// ── Unit 4 Step 3（+4 → 計6）──
questions.push(
  meaning(4, 3, '発展', 'What is she wearing?', '何を聞いている？', ['何を着ているか', '何を買ったか', '何が好きか'], 0, [
    { en: 'wearing', ja: '着ている' },
  ]),
  listening(4, 3, '発展', 'Look! The dog is running.', ['犬が走っています。', '犬が寝ています。', '犬が食べています。'], 0, [
    { en: 'Look', ja: '見て' },
  ]),
  jpToEn(4, 3, '発展', '今何をしていますか。', ['What are you doing now?', 'What do you do now?', 'What did you do now?'], 0, [
    { en: 'doing', ja: 'している' },
  ]),
  fillIn(4, 3, '発展', 'The baby ___ crying.', '___に入る単語はどれ？', ['is', 'are', 'am'], 0, [
    { en: 'crying', ja: '泣いている' },
  ]),
);

// ── Unit 5 Step 1（+6 → 計9）──
questions.push(
  meaning(5, 1, '基礎', 'Birds can fly.', '何ができる？', ['飛ぶ', '泳ぐ', '走る'], 0, [
    { en: 'fly', ja: '飛ぶ' },
  ]),
  wordOrder(5, 1, '基礎', 'I can ride a bike.', ['bike', 'a', 'ride', 'can', 'I'], ['I', 'can', 'ride', 'a', 'bike'], [
    { en: 'ride', ja: '乗る' },
  ]),
  fillIn(5, 1, '基礎', 'She ___ speak Japanese.', '___に入る単語はどれ？', ['can', 'cans', 'canning'], 0, [
    { en: 'speak', ja: '話す' },
  ]),
  jpToEn(5, 1, '基礎', '私はギターを弾くことができます。', ['I can play the guitar.', 'I can plays the guitar.', 'I can playing the guitar.'], 0, [
    { en: 'guitar', ja: 'ギター' },
  ]),
  listening(5, 1, '応用', 'He can run fast.', ['彼は速く走れます。', '彼は速く走ります。', '彼は走るのが好きです。'], 0, [
    { en: 'fast', ja: '速く' },
  ]),
  errorDet(5, 1, '基礎', '正しい英文はどっち？', ['We can dance.', 'We can dances.'], 0, [
    { en: 'dance', ja: '踊る' },
  ]),
);

// ── Unit 5 Step 2（+6 → 計9）──
questions.push(
  meaning(5, 2, '応用', 'You must be quiet in the library.', '図書館でどうすべき？', ['静かにする', '走る', '食べる'], 0, [
    { en: 'quiet', ja: '静かな' },
  ]),
  jpToEn(5, 2, '応用', 'ここで写真を撮ってもいいですか。', ['May I take a picture here?', 'Can I takes a picture here?', 'Must I take a picture here?'], 0, [
    { en: 'picture', ja: '写真' },
  ]),
  listening(5, 2, '応用', 'You should wash your hands.', ['手を洗うべきです。', '手を洗ってもいいです。', '手を洗わなければなりません。'], 0, [
    { en: 'wash', ja: '洗う' },
  ]),
  fillIn(5, 2, '応用', 'You ___ not run in the hallway.', '___に入る単語はどれ？', ['must', 'can', 'may'], 0, [
    { en: 'hallway', ja: '廊下' },
  ]),
  errorDet(5, 2, '応用', '正しい英文はどっち？', ['You must listen to the teacher.', 'You must listens to the teacher.'], 0, [
    { en: 'listen', ja: '聞く' },
  ]),
  meaning(5, 2, '応用', 'Can I borrow your eraser?', '何をしたい？', ['消しゴムを借りたい', '消しゴムを買いたい', '消しゴムを貸したい'], 0, [
    { en: 'borrow', ja: '借りる' },
  ]),
);

// ── Unit 5 Step 3（+8 → 計12）──
questions.push(
  wordOrder(5, 3, '発展', 'You may sit here.', ['here', 'sit', 'may', 'You'], ['You', 'may', 'sit', 'here'], [
    { en: 'may', ja: '〜してもよい' },
  ]),
  meaning(5, 3, '発展', 'We must wear uniforms at school.', '学校で何をしなければならない？', ['制服を着る', '帽子をかぶる', '靴を脱ぐ'], 0, [
    { en: 'uniforms', ja: '制服' },
  ]),
  jpToEn(5, 3, '発展', 'もっと早く起きるべきです。', ['You should get up earlier.', 'You should gets up earlier.', 'You can get up earlier.'], 0, [
    { en: 'earlier', ja: 'もっと早く' },
  ]),
  listening(5, 3, '発展', 'May I open the window?', ['窓を開けてもいいですか。', '窓を閉めてもいいですか。', '窓を開けなければなりません。'], 0, [
    { en: 'window', ja: '窓' },
  ]),
  fillIn(5, 3, '発展', 'Students ___ not use phones in class.', '___に入る単語はどれ？', ['must', 'can', 'may'], 0, [
    { en: 'phones', ja: '携帯電話' },
  ]),
  errorDet(5, 3, '発展', '正しい英文はどっち？', ['I may go home early.', 'I may goes home early.'], 0, [
    { en: 'early', ja: '早く' },
  ]),
  meaning(5, 3, '発展', 'You can ask the teacher for help.', '誰に助けを求められる？', ['先生', '友達だけ', '誰にも'], 0, [
    { en: 'ask', ja: '頼む' },
  ]),
  wordOrder(5, 3, '発展', 'We must be on time.', ['time', 'on', 'be', 'must', 'We'], ['We', 'must', 'be', 'on', 'time'], [
    { en: 'on time', ja: '時間通りに' },
  ]),
);

function formatQuestion(q) {
  const parts = [`  { id: '${q.id}', unit: ${q.unit}, step: ${q.step}, level: '${q.level}', type: '${q.type}'`];
  if (q.sentence) parts.push(`sentence: '${q.sentence.replace(/'/g, "\\'")}'`);
  if (q.japanese) parts.push(`japanese: '${q.japanese.replace(/'/g, "\\'")}'`);
  parts.push(`question: '${q.question.replace(/'/g, "\\'")}'`);
  if (q.words) parts.push(`words: [${q.words.map((w) => `'${w}'`).join(', ')}]`);
  if (q.choices) parts.push(`choices: [${q.choices.map((c) => `'${c.replace(/'/g, "\\'")}'`).join(', ')}]`);
  if (q.answer !== undefined) {
    if (Array.isArray(q.answer)) {
      parts.push(`answer: [${q.answer.map((a) => `'${a}'`).join(', ')}]`);
    } else {
      parts.push(`answer: ${q.answer}`);
    }
  }
  if (q.showText) parts.push('showText: true');
  if (q.vocab) {
    parts.push(
      `vocab: [${q.vocab.map((v) => `{ en: '${v.en.replace(/'/g, "\\'")}', ja: '${v.ja.replace(/'/g, "\\'")}' }`).join(', ')}]`,
    );
  }
  return `${parts.join(', ')} },`;
}

const out = `import type { Question } from '../../types';

/** 追加問題（各 step を約3倍に） */
export const ADDITIONAL_QUESTIONS: Question[] = [
${questions.map(formatQuestion).join('\n')}
];
`;

const outPath = new URL('../src/data/questions/additional.ts', import.meta.url);
fs.writeFileSync(outPath, out);
console.log(`Generated ${questions.length} questions (${id - 59} total, ids q059–q${String(id - 1).padStart(3, '0')})`);
