import type { VocabEntry } from '../types';

interface Props {
  entries: VocabEntry[];
}

export default function VocabHint({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <div className="vocab-hint" aria-label="この問題の単語">
      <p className="vocab-hint-label">この文の単語</p>
      <div className="vocab-hint-chips">
        {entries.map((entry) => (
          <span key={entry.en} className="vocab-hint-chip">
            <span className="vocab-hint-en">{entry.en}</span>
            <span className="vocab-hint-ja">{entry.ja}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
