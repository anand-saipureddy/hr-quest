import { Link } from 'react-router-dom';
import Doodle from './Doodle';
import { copy } from '../lib/copy';
import type { Suggestion } from '../lib/progress';

// Hero panel: left bay has the pick + buttons, right bay the desk scene.
// Two-bay grid keeps the next thing on the same rhythm as every other screen.
export default function NextThing({ s, onShuffle, hasMore }: { s: Suggestion; onShuffle: () => void; hasMore: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 250px', border: '2px solid var(--ink)', background: 'var(--sky-100)' }}>
      <div style={{ padding: '26px 24px 24px' }}>
        <p className="kicker" style={{ color: 'var(--sky-700)', margin: '0 0 12px' }}>{copy.today.pickedForToday}</p>
        <p style={{ font: '700 22px/1.3 var(--font-ui)', margin: '0 0 8px' }}>{s.label}</p>
        <p style={{ margin: '0 0 20px', font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)', maxWidth: '38ch' }}>{s.note}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link className="btn primary" to={s.to}>{copy.today.openLesson}</Link>
          {hasMore && (
            <button className="btn" type="button" onClick={onShuffle}>{copy.today.somethingElse}</button>
          )}
        </div>
      </div>
      <div style={{ borderLeft: '1px solid var(--sky-300)', background: 'var(--bg)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 14, overflow: 'hidden' }}>
        <Doodle mark="desk" width={222} />
      </div>
    </div>
  );
}
