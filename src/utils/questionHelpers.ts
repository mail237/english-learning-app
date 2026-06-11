import type { Question, WordOrderQuestion } from '../types';

/** 語順問題の比較用（語尾の ? や Osaka? などを正規化） */
export function normalizeWordOrderToken(token: string): string {
  if (token === '?') return '?';
  return token.replace(/^[('"]+/, '').replace(/[.,!?]+$/, '').trim();
}

function ensureBankCoversAnswer(words: string[], answer: string[]): string[] {
  const bank = [...words];
  for (const token of answer) {
    const needed = answer.filter((w) => w === token).length;
    let have = bank.filter((w) => w === token).length;
    while (have < needed) {
      bank.push(token);
      have++;
    }
  }
  return bank;
}

/** 疑問文は ? チップを補完（データ不備・旧キャッシュ両対応） */
export function prepareWordOrderQuestion(question: WordOrderQuestion): {
  words: string[];
  answer: string[];
} {
  const answer = question.answer.map(normalizeWordOrderToken);
  let words = question.words.map(normalizeWordOrderToken);
  const isQuestion = question.sentence.trim().endsWith('?');

  if (isQuestion) {
    if (!answer.includes('?')) {
      answer.push('?');
    }
    if (!words.includes('?')) {
      words.push('?');
    }
  }

  words = ensureBankCoversAnswer(words, answer);
  return { words, answer };
}

export function wordsMatchWordOrderAnswer(selected: string[], expected: string[]): boolean {
  if (selected.length !== expected.length) return false;
  return selected.every((w, i) => normalizeWordOrderToken(w) === normalizeWordOrderToken(expected[i]));
}

export function wordOrderAnswerWithoutPunctuation(answer: string[]): string[] {
  return answer.filter((t) => t !== '?');
}

/** 疑問文：単語が揃ったら ? を自動で付ける */
export function maybeAutoAppendQuestionMark(
  selected: string[],
  available: string[],
  expectedAnswer: string[],
): { selected: string[]; available: string[] } {
  if (!expectedAnswer.includes('?')) {
    return { selected, available };
  }

  const core = wordOrderAnswerWithoutPunctuation(expectedAnswer);
  if (selected.length !== core.length || !wordsMatchWordOrderAnswer(selected, core)) {
    return { selected, available };
  }

  if (selected.includes('?')) {
    return { selected, available };
  }

  const qIndex = available.indexOf('?');
  if (qIndex >= 0) {
    return {
      selected: [...selected, '?'],
      available: available.filter((_, i) => i !== qIndex),
    };
  }

  return { selected: [...selected, '?'], available };
}

const AUXILIARY_NEGATIVES = new Set(["don't", "doesn't", 'do not', 'does not']);

/** don't / doesn't を入れる穴埋めでは、文中の余分な not を除いて表示 */
export function formatFillInSentence(sentence: string, word: string): string {
  let filled = sentence.replace('___', word);
  if (AUXILIARY_NEGATIVES.has(word)) {
    filled = filled.replace(/\s+not\b/, '');
  }
  return filled;
}

export function shouldAutoSpeak(question: Question): boolean {
  return question.type !== 'listening' && question.type !== 'jp-to-en';
}

export function getSpeechText(question: Question): string | null {
  switch (question.type) {
    case 'meaning':
    case 'fill-in':
    case 'word-order':
    case 'listening':
      return question.sentence;
    case 'jp-to-en':
      return question.choices.join('. ');
    case 'error-detection':
      return question.choices.join('. ');
  }
}

export function checkIndexAnswer(question: Question, index: number): boolean {
  if (question.type === 'word-order') return false;
  return index === question.answer;
}

export function checkWordOrderAnswer(question: Question, words: string[]): boolean {
  if (question.type !== 'word-order') return false;
  const { answer } = prepareWordOrderQuestion(question);
  return wordsMatchWordOrderAnswer(words, answer);
}

export function getCorrectAnswerText(question: Question): string {
  switch (question.type) {
    case 'word-order':
      return prepareWordOrderQuestion(question).answer.join(' ');
    case 'fill-in':
      return formatFillInSentence(question.sentence, question.choices[question.answer]);
    case 'jp-to-en':
    case 'meaning':
    case 'listening':
    case 'error-detection':
      return question.choices[question.answer];
  }
}

export function getSelectedAnswerText(
  question: Question,
  selected: number | string[],
): string {
  if (Array.isArray(selected)) {
    return selected.join(' ');
  }
  if (question.type === 'fill-in') {
    return formatFillInSentence(question.sentence, question.choices[selected]);
  }
  if (question.type === 'word-order') {
    return selected.toString();
  }
  return question.choices[selected];
}

export function getReviewPrompt(question: Question): string {
  switch (question.type) {
    case 'jp-to-en':
      return question.japanese;
    case 'fill-in':
    case 'meaning':
    case 'listening':
    case 'word-order':
      return question.sentence;
    case 'error-detection':
      return question.question;
  }
}

export function getTypeLabel(type: Question['type']): string {
  const labels: Record<Question['type'], string> = {
    meaning: '意味選択',
    'word-order': '並び替え',
    'fill-in': '空欄補充',
    'jp-to-en': '日本語→英語',
    listening: 'リスニング',
    'error-detection': '間違い探し',
  };
  return labels[type];
}

/** 選択肢の比較用（大文字小文字・末尾の ?!. を無視） */
export function normalizeChoiceKey(choice: string): string {
  return choice.trim().toLowerCase().replace(/[.?!]+$/g, '');
}

/** 表示前に重複・類似選択肢を除去（正解インデックスを追従） */
export function dedupeChoicesForDisplay(
  choices: string[],
  answerIndex: number,
): { choices: string[]; answerIndex: number } {
  const result: string[] = [];
  const keyToIndex = new Map<string, number>();
  let newAnswerIndex = answerIndex;

  for (let i = 0; i < choices.length; i++) {
    const text = choices[i];
    const key = normalizeChoiceKey(text);
    const existing = keyToIndex.get(key);

    if (existing === undefined) {
      keyToIndex.set(key, result.length);
      result.push(text);
      if (i === answerIndex) newAnswerIndex = result.length - 1;
    } else if (i === answerIndex) {
      newAnswerIndex = existing;
      result[existing] = text;
    }
  }

  return { choices: result, answerIndex: newAnswerIndex };
}

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** 選択肢の並びを毎回少し変える（正解インデックスも追従） */
export function shuffleChoicesForDisplay(
  choices: string[],
  answerIndex: number,
): { choices: string[]; answerIndex: number } {
  const tagged = choices.map((text, originalIndex) => ({ text, originalIndex }));
  const shuffled = shuffleArray(tagged);
  return {
    choices: shuffled.map((t) => t.text),
    answerIndex: shuffled.findIndex((t) => t.originalIndex === answerIndex),
  };
}
