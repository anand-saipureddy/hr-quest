import { useSearchParams, Link } from 'react-router-dom';
import Doodle from '../components/Doodle';
import Ring from '../components/Ring';
import { modules } from '../lib/content';
import { useProgress } from '../lib/progress-context';

// Accordion: one module open at a time, open module in the URL as ?m=1.
// Nothing is locked; collapsed modules show no counts.
export default function Course() {
  const { progress } = useProgress();
  const [params, setParams] = useSearchParams();
  const open = params.get('m');

  if (modules.length === 0) {
    return (
      <div>
        <Doodle mark="circle" />
        <p style={{ color: 'var(--muted)' }}>The lessons aren't loaded yet.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0, top: -4 }}>
        <Doodle mark="book" width={72} />
      </div>
      <p className="kicker">Coursera · HR for People Managers</p>
      <h1 style={{ fontSize: 28 }}>The course</h1>
      <Doodle mark="underline" color="var(--sky-500)" />
      <p style={{ margin: '14px 0 26px', maxWidth: '56ch', font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
        Open one when you feel like it — nothing here expires and nothing is in a hurry.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {modules.map((m, i) => {
          const isOpen = open === m.id;
          return (
            <div key={m.id} style={{ border: isOpen ? '2px solid var(--ink)' : '1px solid var(--line)', borderRadius: 'var(--r-sticker)', overflow: 'hidden', background: '#fff' }}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setParams(isOpen ? {} : { m: m.id }, { replace: true })}
                style={{
                  display: 'flex', alignItems: 'baseline', gap: 14, width: '100%', textAlign: 'left',
                  padding: '20px 22px', background: isOpen ? 'var(--sky-100)' : '#fff',
                  border: 0, borderBottom: isOpen ? '1px solid var(--line)' : 0, cursor: 'pointer',
                }}
              >
                <span style={{ font: '700 26px/1 var(--font-ui)', color: isOpen ? 'var(--sky-700)' : 'var(--sky-300)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ flex: 1, font: '600 17px/1.3 var(--font-ui)' }}>{m.title}</span>
                <span style={{ font: '500 12px/1 var(--font-ui)', color: isOpen ? 'var(--sky-700)' : 'var(--muted)' }}>
                  {isOpen ? 'Close' : 'Open'}
                </span>
              </button>
              {isOpen && (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {m.lessons.map((l) => {
                    const done = !!progress.lessons[l.id]?.done;
                    const started = !!progress.lessons[l.id];
                    return (
                      <li key={l.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid var(--line)', background: started && !done ? 'var(--bg)' : '#fff' }}>
                        <Ring state={done ? 'done' : started ? 'current' : 'untouched'} />
                        <div style={{ flex: 1 }}>
                          <p style={{ font: '600 15px/1.3 var(--font-ui)', margin: 0 }}>{l.title}</p>
                          <p style={{ margin: '3px 0 0', font: '400 12px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
                            {l.videos.length} videos{done ? ' · questions answered' : started ? ' · in progress' : ''}
                          </p>
                        </div>
                        <Link to={`/course/${m.id}/${l.id}`} style={{ font: '500 12px/1 var(--font-ui)' }}>
                          {done ? 'Revisit' : started ? 'Continue' : 'Open'}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
