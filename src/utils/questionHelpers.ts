import type { Question, WordOrderQuestion } from '../types';

/** 語順問題の比較用（語尾の ? や Osaka? などを正規化） */
export function normalizeWordOrderToken(token: string): string {
  if (token === '?') return '?';
  return token.replace(/^[('"]+/, '').replace(/[.,!?]+$/, '').trim();
}

/** 疑問文は ? チップを補完（データ不備・旧キャッシュ両対応） */
export function prepareWordOrderQuestion(question: WordOrderQuestion): {
  words: string[];
  answer: string[];
} {
  const answer = question.answer.map(normalizeWordOrderToken);
  const words = question.words.map(normalizeWordOrderToken);
  const isQuestion = question.sentence.trim().endsWith('?');

  if (isQuestion) {
    if (!answer.includes('?')) {
      answer.push('?');
    }
    if (!words.includes('?')) {
      words.push('?');
    }
  }

  return { words, answer };
}

export function wordsMatchWordOrderAnswer(selected: string[], expected: string[]): boolean {
  if (selected.length !== expected.length) return false;
  return selected.every((w, i) => normalizeWordOrderToken(w) === normalizeWordOrderToken(expected[i]));
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
      return question.sentence.replace('___', question.choices[question.answer]);
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
    return question.sentence.replace('___', question.choices[selected]);
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

export function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
