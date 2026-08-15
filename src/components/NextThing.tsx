import { Link } from 'react-router-dom';
import { copy } from '../lib/copy';
import type { Suggestion } from '../lib/progress';

// One card: the next thing. Not a dashboard.
export default function NextThing({ s, onShuffle, hasMore }: { s: Suggestion; onShuffle: () => void; hasMore: boolean }) {
  return (
    <div style={{ border: '2px solid var(--ink)', borderRadius: 'var(--r-sticker)', background: 'var(--sky-100)', padding: 22, maxWidth: 520 }}>
      <p className="kicker" style={{ color: 'var(--sky-700)' }}>{copy.today.pickedForToday}</p>
      <p style={{ font: '600 18px/1.35 var(--font-ui)', margin: '0 0 6px' }}>{s.label}</p>
      <p style={{ margin: '0 0 18px', font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{s.note}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="btn primary" to={s.to}>{copy.today.openLesson}</Link>
        {hasMore && (
          <button className="btn" type="button" onClick={onShuffle}>{copy.today.somethingElse}</button>
        )}
      </div>
    </div>
  );
}
