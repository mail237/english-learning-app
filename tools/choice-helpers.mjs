/**
 * 問題生成用 — 選択肢の重複・類似を防ぐヘルパー
 */

export function normalizeChoiceKey(choice) {
  return choice.trim().toLowerCase().replace(/[.?!]+$/g, '');
}

/** 句読点だけ違うなど、実質同じ選択肢か */
export function isTooSimilar(a, b) {
  return normalizeChoiceKey(a) === normalizeChoiceKey(b);
}

/** 正解を先頭に、重複・類似を除いた選択肢 */
export function uniqueMeaningfulChoices(correct, ...rest) {
  const out = [correct];
  for (const c of rest) {
    if (!c) continue;
    if (out.some((existing) => isTooSimilar(existing, c))) continue;
    if (!out.includes(c)) out.push(c);
  }
  return out;
}

export function assertUniqueChoices(q) {
  if (!q.choices || q.choices.length < 2) return;
  if (q.choices.some((c, i) => q.choices.findIndex((x) => isTooSimilar(x, c)) !== i)) {
    throw new Error(`${q.id}: duplicate or near-duplicate choices ${JSON.stringify(q.choices)}`);
  }
}

/** Do/Does 疑問文の誤答（be動詞に置き換え） */
export function wrongAuxQuestion(en) {
  if (/\bDoes\b/.test(en)) return en.replace(/\bDoes\b/, 'Is');
  if (/\bdoes\b/.test(en)) return en.replace(/\bdoes\b/, 'is');
  if (/\bDo\b/.test(en)) return en.replace(/\bDo\b/, 'Are');
  if (/\bdo\b/.test(en)) return en.replace(/\bdo\b/, 'are');
  return null;
}

const WORD_SWAPS = {
  cats: 'dogs',
  tennis: 'soccer',
  english: 'Japanese',
  live: 'work',
  want: 'need',
  bus: 'train',
  pizza: 'bread',
  soccer: 'basketball',
  music: 'movies',
  dinner: 'lunch',
  book: 'magazine',
  vegetables: 'fruit',
  comics: 'novels',
  math: 'science',
};

/** キーワードを別の語に差し替えた誤答 */
export function swapKeyword(en) {
  for (const [from, to] of Object.entries(WORD_SWAPS)) {
    const re = new RegExp(`\\b${from}\\b`, 'i');
    if (re.test(en)) return en.replace(re, to.charAt(0) === to.charAt(0).toUpperCase() ? to : to);
  }
  return null;
}

const SUBJECT_SWAPS = [
  [/\byou\b/i, 'we'],
  [/\bhe\b/i, 'she'],
  [/\bshe\b/i, 'he'],
  [/\bthey\b/i, 'we'],
  [/\bI\b/, 'You'],
  [/\bwe\b/i, 'they'],
];

export function swapSubject(en) {
  for (const [re, rep] of SUBJECT_SWAPS) {
    if (re.test(en)) return en.replace(re, rep);
  }
  return null;
}

export function jpToEnChoices(en) {
  return uniqueMeaningfulChoices(
    en,
    wrongAuxQuestion(en),
    swapKeyword(en),
    swapSubject(en),
  ).slice(0, 3);
}

export function errorDetChoices(en) {
  return uniqueMeaningfulChoices(en, wrongAuxQuestion(en)).slice(0, 2);
}

export function meaningChoices(ja) {
  return uniqueMeaningfulChoices(
    ja,
    ja.replace(/ています/g, 'ていません'),
    ja.replace(/います/g, 'いません'),
    ja.replace(/しています/g, 'していません'),
    ja.replace(/です/g, 'ではありません'),
    ja.replace(/した/g, 'してい'),
  ).slice(0, 3);
}

export function modalJpToEnChoices(correct, wrong) {
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
  return uniqueMeaningfulChoices(correct, wrong, third, swapSubject(correct)).slice(0, 3);
}
