/**
 * 不自然な日本語を検出
 * 実行: node tools/audit-japanese.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PLAY_OBJECTS = /サッカー|テニス|バスケ|野球|ゲーム|バスケットボール/;
const SUBJECT_PREFIX = /^(私|彼|彼女|彼ら|私たち|あなた|トム|ケン|ユキ|エミ|リョウ|お父さん|お母さん|先生|校長)/;

function collectFiles() {
  const files = [path.join(ROOT, 'src/data/questions.ts')];
  for (const f of fs.readdirSync(path.join(ROOT, 'src/data/questions'))) {
    files.push(path.join(ROOT, 'src/data/questions', f));
  }
  return files;
}

function extractJapaneseStrings(text) {
  const found = [];

  for (const m of text.matchAll(/japanese:\s*['"]([^'"]+)['"]/g)) {
    found.push({ kind: 'japanese', value: m[1] });
  }

  for (const m of text.matchAll(/choices:\s*\[([\s\S]*?)\]/g)) {
    for (const s of m[1].matchAll(/['"]([^'"]+)['"]/g)) {
      if (/[\u3040-\u9fff]/.test(s[1])) found.push({ kind: 'choice', value: s[1] });
    }
  }

  for (const m of text.matchAll(/question:\s*['「]([^'」]+)['」]/g)) {
    if (/[\u3040-\u9fff]/.test(m[1])) found.push({ kind: 'question', value: m[1] });
  }

  for (const m of text.matchAll(/ja:\s*['"]([^'"]+)['"]/g)) {
    if (/^[a-zA-Z][a-zA-Z\s'-]*$/.test(m[1])) {
      found.push({ kind: 'vocab-ja', value: m[1] });
    }
  }

  return found;
}

function checkJapanese(kind, value) {
  const issues = [];
  if (/走るを/.test(value)) issues.push('走るを');
  if (/をしません/.test(value) && !PLAY_OBJECTS.test(value)) {
    if (/野菜|音楽|テレビ|漫画|英語|夕食|ピザ|肉|牛乳/.test(value)) {
      issues.push('をしません+名詞(動詞不一致)');
    }
  }
  if (/を食べない（今）/.test(value)) issues.push('不自然な訳');
  if (/遅刻です/.test(value)) issues.push('遅刻です→遅刻しています');
  if (/怒った/.test(value) && /ていません/.test(value)) issues.push('怒った→怒っている');
  if (/今読んでいない/.test(value)) issues.push('不完全な引用');
  if (/お父さんは何をしますか/.test(value)) issues.push('仕事の聞き方が不自然');

  if (kind !== 'vocab-ja') {
    if (/勉強しなければならない。$/.test(value) && !SUBJECT_PREFIX.test(value)) {
      issues.push('主語なしの文');
    }
    if (/助けるべきだ。$/.test(value) && !SUBJECT_PREFIX.test(value)) issues.push('主語なしの文');
    if (/泳げますか。$/.test(value) && !SUBJECT_PREFIX.test(value)) issues.push('主語なしの疑問文');
    if (/しています。$/.test(value) && !/^[^。]{1,12}は/.test(value) && !/^今何/.test(value)) {
      issues.push('主語なしの進行形');
    }
    if (/着なければなりません。$/.test(value) && !SUBJECT_PREFIX.test(value)) {
      issues.push('主語なしの文');
    }
    if (/練習すべきです。$/.test(value) && !SUBJECT_PREFIX.test(value)) {
      issues.push('主語なしの文');
    }
  }

  if (kind === 'vocab-ja' && /^[a-zA-Z]/.test(value)) {
    issues.push('単語ヒントが英語のまま');
  }

  return issues;
}

const allIssues = [];
for (const file of collectFiles()) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  for (const { kind, value } of extractJapaneseStrings(text)) {
    for (const reason of checkJapanese(kind, value)) {
      allIssues.push({ file: rel, kind, value, reason });
    }
  }
}

const grouped = new Map();
for (const i of allIssues) {
  const key = `${i.reason}::${i.value}`;
  if (!grouped.has(key)) grouped.set(key, { ...i, files: new Set() });
  grouped.get(key).files.add(i.file);
}

console.log(`Japanese issues: ${grouped.size}`);
for (const g of grouped.values()) {
  console.log(`\n[${g.reason}] ${g.value}`);
  console.log(`  ${[...g.files].join(', ')}`);
}

process.exit(grouped.size > 0 ? 1 : 0);
