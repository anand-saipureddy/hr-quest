import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DrillCard from '../components/DrillCard';
import StepSpine from '../components/StepSpine';
import Doodle from '../components/Doodle';
import { copy } from '../lib/copy';
import { tracks } from '../lib/content';
import { markBuilt } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from '../components/UndoBar';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    try { document.execCommand('copy'); } catch {}
    ta.remove();
  }
}

export default function SkillTrack() {
  const { trackId } = useParams();
  const track = tracks.find((t) => t.id === trackId);
  const { progress, set } = useProgress();
  const [drillIdx, setDrillIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showData, setShowData] = useState(false);

  if (!track) {
    return (
      <div>
        <Doodle mark="circle" />
        <p style={{ color: 'var(--muted)' }}>That track isn't here yet.</p>
        <Link to="/skills">Back to skills</Link>
      </div>
    );
  }

  const st = progress.tracks[track.id];
  const drillsDone = track.drills.every((_, n) => st?.drills[n] !== undefined);
  const built = !!st?.built;
  const current = built ? 3 : drillsDone ? 3 : 2; // spine position

  const doBuilt = (on: boolean) => {
    const prev = progress;
    set(markBuilt(progress, track.id, on));
    pushUndo(() => set(markBuilt(prev, track.id, !on)));
  };

  return (
    <div style={{ maxWidth: 880 }}>
      <p className="kicker">Skill · {track.name}</p>
      <h1 style={{ fontSize: 26 }}>Build the thing, then I'll ask you about it</h1>
      <div style={{ marginTop: 22 }}>
        <StepSpine current={current as 1 | 2 | 3} />
      </div>

      <section style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-sticker)', padding: 20, background: '#fff', marginBottom: 18 }}>
        <p className="kicker" style={{ color: 'var(--muted)' }}>Step 1 · setup</p>
        <h2 style={{ fontSize: 17, fontWeight: 600 }}>{track.setup.title}</h2>
        {track.setup.why && <p style={{ margin: '8px 0 0', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{track.setup.why}</p>}
        <ol style={{ margin: '14px 0 0', paddingLeft: 18, font: '400 14px/1.75 var(--font-ui)' }}>
          {track.setup.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        {track.setup.data && (
          <div style={{ marginTop: 16 }}>
            <button
              className="btn"
              type="button"
              onClick={() => {
                copyText(track.setup.data);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? 'Copied' : track.setup.copyLabel || 'Copy'}
            </button>
            <p style={{ margin: '10px 0 0' }}>
              <button
                type="button"
                onClick={() => setShowData((s) => !s)}
                style={{ background: 'none', border: 'none', padding: 0, font: '500 13px/1 var(--font-ui)', color: 'var(--sky-700)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
              >
                {showData ? 'Hide the data' : 'Or read it here and type it in'}
              </button>
            </p>
            {showData && (
              <pre style={{ margin: '10px 0 0', padding: 14, maxHeight: 200, overflow: 'auto', background: 'var(--bg)', border: '1px solid var(--line)', font: '400 12px/1.5 ui-monospace,Menlo,monospace', whiteSpace: 'pre' }}>
                {track.setup.data}
              </pre>
            )}
          </div>
        )}
        {track.setup.note && <p style={{ margin: '14px 0 0', font: '400 12px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{track.setup.note}</p>}
      </section>

      <section style={{ marginBottom: 18 }}>
        <DrillCard
          trackId={track.id}
          n={drillIdx}
          drill={track.drills[drillIdx]}
          isLast={drillIdx === track.drills.length - 1}
          onNext={() => drillIdx < track.drills.length - 1 && setDrillIdx(drillIdx + 1)}
        />
        {track.drills.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {track.drills.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Drill ${n + 1}`}
                onClick={() => setDrillIdx(n)}
                style={{
                  width: 10, height: 10, borderRadius: 'var(--r-pill)', padding: 0, cursor: 'pointer',
                  border: n === drillIdx ? '2px solid var(--sky-700)' : 'none',
                  background: st?.drills[n] !== undefined ? 'var(--sky-700)' : 'var(--sky-200)',
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-sticker)', padding: 20, background: '#fff' }}>
        <p className="kicker" style={{ color: 'var(--muted)' }}>Step 3 · the artefact</p>
        <h2 style={{ fontSize: 17, fontWeight: 600 }}>{track.build.title}</h2>
        <p style={{ margin: '8px 0 0', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{track.build.what}</p>
        <ol style={{ margin: '14px 0 0', paddingLeft: 18, font: '400 14px/1.75 var(--font-ui)' }}>
          {track.build.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
          <p style={{ font: '600 12px/1 var(--font-ui)', margin: '0 0 10px' }}>{copy.skills.howYouKnow}</p>
          <ul style={{ margin: 0, paddingLeft: 18, font: '400 13px/1.7 var(--font-ui)', color: 'var(--muted)' }}>
            {track.build.howYouKnow.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div style={{ marginTop: 16 }}>
          {built ? (
            <p style={{ margin: 0 }}>
              <span className="hand" style={{ fontSize: 18 }}>built — on your word</span>{' '}
              <button
                type="button"
                onClick={() => doBuilt(false)}
                style={{ background: 'none', border: 'none', padding: 0, font: '500 12px/1 var(--font-ui)', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
              >
                Unmark
              </button>
            </p>
          ) : (
            <button className="btn" type="button" onClick={() => doBuilt(true)}>
              {track.build.doneLabel || copy.skills.builtThis}
            </button>
          )}
        </div>
      </section>
      <p className="hand" style={{ margin: '14px 0 0', fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
        {built && <span className="doodle-pop" style={{ display: 'inline-flex' }}><Doodle mark="sparkle" width={36} /></span>}
        "{copy.skills.builtThis}" is on your word — nobody checks
      </p>
    </div>
  );
}
