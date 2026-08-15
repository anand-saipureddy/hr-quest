import { useSearchParams } from 'react-router-dom';
import Doodle from '../components/Doodle';
import TrackCard from '../components/TrackCard';
import { tracks } from '../lib/content';
import { useProgress } from '../lib/progress-context';

// Seven tracks. No track is locked; there is no suggested order.
// Sticker slot ships as a grey labelled placeholder — never an emoji.
export default function Skills() {
  const { progress } = useProgress();
  const [params, setParams] = useSearchParams();
  const selected = params.get('t');

  const status = (id: string): 'built' | 'started' | 'new' => {
    const st = progress.tracks[id];
    if (st?.built) return 'built';
    if (st && Object.keys(st.drills).length > 0) return 'started';
    return 'new';
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0, top: -4 }}>
        <Doodle mark="hammer" width={72} />
      </div>
      <p className="kicker">Skills</p>
      <h1 style={{ fontSize: 28 }}>Seven tracks, no required order</h1>
      <p style={{ margin: '10px 0 22px', maxWidth: '60ch', font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
        Each one: build the real thing first, then answer questions about the thing you built.
      </p>
      <div role="tablist" aria-label="Skill tracks" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {tracks.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={selected === t.id}
            onClick={() => setParams({ t: t.id }, { replace: true })}
            style={{
              minHeight: 40, padding: '0 16px', borderRadius: 'var(--r-pill)', cursor: 'pointer',
              border: selected === t.id ? '2px solid var(--sky-700)' : '1px solid var(--line)',
              background: selected === t.id ? 'var(--sky-200)' : '#fff',
              font: '500 13px/1 var(--font-ui)', color: selected === t.id ? 'var(--ink)' : 'var(--muted)',
            }}
          >
            {t.short}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 14 }}>
        {tracks.map((t) => (
          <TrackCard key={t.id} track={t} status={status(t.id)} />
        ))}
        <div style={{ border: '1px dashed var(--sky-300)', borderRadius: 'var(--r-sticker)', padding: 20, background: 'var(--bg)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="hand" style={{ fontSize: 20, margin: '0 0 8px' }}>sticker slot</p>
          <p style={{ margin: 0, font: '400 12px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
            One illustration per track goes here. Grey placeholder until then.
          </p>
        </div>
      </div>
    </div>
  );
}
