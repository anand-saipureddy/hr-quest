import { useSearchParams, Link } from 'react-router-dom';
import Doodle from '../components/Doodle';
import TrackCard, { MARK_BY_TRACK } from '../components/TrackCard';
import { SPINE_STEPS } from '../components/StepSpine';
import { tracks } from '../lib/content';
import { useProgress } from '../lib/progress-context';
import { copy } from '../lib/copy';
import type { Track } from '../lib/progress';

// Seven tracks. No track is locked; there is no suggested order.
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

  const lead = tracks[0];
  const rest = tracks.slice(1);
  const selectedTrack = selected ? tracks.find((t) => t.id === selected) ?? null : null;

  // Featured card: lead layout (span 2, mark right) for the unfiltered lead
  // and for the filtered single track. Uses <Link to> so the router basename
  // is respected (a plain <a href> 404s on the basename'd route).
  const renderFeatured = (t: Track) => {
    const st = status(t.id);
    const label = st === 'built' ? 'Built' : st === 'started' ? 'In progress' : 'New';
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 96px', gap: 20, alignItems: 'center', gridColumn: 'span 2', border: st === 'started' ? '2px solid var(--ink)' : '1px solid var(--line)', borderRadius: 'var(--r-sticker)', padding: 20, background: st === 'started' ? 'var(--sky-100)' : '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.14em', textTransform: 'uppercase', color: st === 'started' ? 'var(--sky-700)' : 'var(--muted)', margin: 0 }}>{label}</p>
          <p style={{ font: '600 19px/1.25 var(--font-ui)', margin: 0 }}>{t.name}</p>
          <p style={{ margin: 0, font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)', maxWidth: '52ch' }}>{t.blurb}</p>
          <Link to={`/skills/${t.id}`} className={st === 'started' ? 'btn primary' : 'btn quiet'} style={{ minHeight: 40, fontSize: 13, textDecoration: 'none' }}>
            {st === 'built' ? 'Revisit' : st === 'started' ? 'Continue' : 'Open'}
          </Link>
        </div>
        <Doodle mark={MARK_BY_TRACK[t.id]} width={96} />
      </div>
    );
  };

  return (
    <div className="page">
      <div className="col">
        <p className="kicker">Skills</p>
        <h1 style={{ fontSize: 30 }}>Seven tracks, no required order</h1>
        <p style={{ margin: '10px 0 22px', maxWidth: '60ch', font: '400 14px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
          Each one: build the real thing first, then answer questions about the thing you built.
        </p>
        <div role="tablist" aria-label="Skill tracks" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          <button
            type="button"
            role="tab"
            aria-selected={!selected}
            onClick={() => setParams({}, { replace: true })}
            style={{
              minHeight: 40, padding: '0 16px', borderRadius: 'var(--r-pill)', cursor: 'pointer',
              border: !selected ? '2px solid var(--sky-700)' : '1px solid var(--line)',
              background: !selected ? 'var(--sky-200)' : '#fff',
              font: '500 13px/1 var(--font-ui)', color: !selected ? 'var(--ink)' : 'var(--muted)',
            }}
          >
            {copy.jobs.allSeven}
          </button>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
          {selectedTrack ? (
            renderFeatured(selectedTrack)
          ) : (
            <>
              {lead && renderFeatured(lead)}
              {rest.map((t) => (
                <TrackCard key={t.id} track={t} status={status(t.id)} />
              ))}
            </>
          )}
        </div>
      </div>

      <aside className="rail">
        <div>
          <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 14px' }}>{copy.skills.spineTitle}</p>
          <div style={{ display: 'grid', gap: 12 }}>
            {SPINE_STEPS.map((label, i) => (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '28px minmax(0,1fr)', gap: 12, alignItems: 'center' }}>
                <span style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--sky-200)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', font: '700 12px/1 var(--font-ui)' }}>{i + 1}</span>
                <p style={{ margin: 0, font: '600 14px/1.3 var(--font-ui)' }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '14px 0 0', font: '400 12px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{copy.skills.spineNote}</p>
        </div>
        <div className="spacer" style={{ display: 'flex', justifyContent: 'center' }}>
          <Doodle mark="toolbox" width={200} />
        </div>
      </aside>
    </div>
  );
}
