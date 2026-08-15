import { Link } from 'react-router-dom';
import Doodle from '../components/Doodle';
import { copy } from '../lib/copy';
import { modules } from '../lib/content';
import { useProgress } from '../lib/progress-context';

// Stopping is a first-class action with its own destination.
export default function Break() {
  const { progress } = useProgress();

  // "Where you left off": the first lesson she started but hasn't finished
  let leftOff: string | null = null;
  for (const m of modules) {
    for (const l of m.lessons) {
      const st = progress.lessons[l.id];
      if (st && !st.done) {
        leftOff = `${m.title}, ${l.title}. It'll pick up there.`;
      }
    }
  }

  return (
    <div style={{ maxWidth: 560, position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0, bottom: -8 }} className="doodle-bob deco">
        <Doodle mark="clock" width={64} />
      </div>
      <div className="card sky" style={{ padding: '34px 30px 30px' }}>
        <p className="kicker" style={{ color: 'var(--sky-700)' }}>{copy.app.takeABreak}</p>
        <h1 style={{ fontSize: 23, lineHeight: 1.25, maxWidth: '24ch' }}>{copy.breakScreen.heading}</h1>
        <p style={{ margin: '10px 0 18px', font: '400 14px/1.65 var(--font-ui)', color: 'var(--muted)', maxWidth: '44ch' }}>
          {copy.breakScreen.body}
        </p>
        <div style={{ border: '1px dashed var(--sky-300)', borderRadius: 'var(--r-sticker)', background: '#fff', padding: 16, maxWidth: 360 }}>
          <p style={{ font: '600 13px/1.3 var(--font-ui)', margin: '0 0 6px' }}>{copy.breakScreen.leftOff}</p>
          <p style={{ margin: 0, font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
            {leftOff ?? 'Nothing in progress right now. Start anywhere — the course is a good door.'}
          </p>
        </div>
        <p className="hand" style={{ margin: '20px 0 0', fontSize: 19 }}>{copy.breakScreen.note}</p>
        <p style={{ margin: '18px 0 0' }}>
          <Link to="/" style={{ font: '500 13px/1 var(--font-ui)' }}>← Back to Today</Link>
        </p>
      </div>
    </div>
  );
}
