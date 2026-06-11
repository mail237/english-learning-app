/**
 * 全問題の choices に重複・類似がないか検査
 * 実行: node tools/audit-duplicate-choices.mjs
 */
import fs from 'fs';
import path from 'path';
import { isTooSimilar, normalizeChoiceKey } from './choice-helpers.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

function parseChoicesArray(raw) {
  const choices = [];
  let i = 0;
  while (i < raw.length) {
    while (i < raw.length && /[\s,]/.test(raw[i])) i++;
    if (i >= raw.length) break;
    const quote = raw[i];
    if (quote !== "'" && quote !== '"') break;
    i++;
    let s = '';
    while (i < raw.length) {
      if (raw[i] === '\\') {
        s += raw[i + 1] ?? '';
        i += 2;
        continue;
      }
      if (raw[i] === quote) {
        i++;
        break;
      }
      s += raw[i++];
    }
    choices.push(s);
  }
  return choices;
}

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const re = /id:\s*['"]([^'"]+)['"][\s\S]*?choices:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = re.exec(text))) {
    const id = m[1];
    const choices = parseChoicesArray(m[2]);
    if (choices.length < 2) continue;

    const exact = new Set(choices);
    const near = new Set(choices.map(normalizeChoiceKey));

    if (exact.size !== choices.length || near.size !== choices.length) {
      const kind = exact.size !== choices.length ? 'exact' : 'near';
      issues.push({ id, choices, file: path.relative(ROOT, filePath), kind });
    }
  }
  return issues;
}

function collectTsFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...collectTsFiles(p));
    else if (e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

const files = [
  path.join(ROOT, 'src/data/questions.ts'),
  ...collectTsFiles(path.join(ROOT, 'src/data/questions')),
];

const all = files.flatMap(scanFile);
console.log(`Duplicate / near-duplicate choice questions: ${all.length}`);
for (const i of all) {
  console.log(`[${i.kind}] ${i.file} ${i.id}: ${JSON.stringify(i.choices)}`);
}
process.exit(all.length > 0 ? 1 : 0);
