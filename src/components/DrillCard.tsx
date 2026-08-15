import { useState } from 'react';
import { copy } from '../lib/copy';
import { markDrill, unmarkDrill, type Mcq } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from './UndoBar';

// One drill visible at a time. References her actual artefact, not a
// hypothetical one. teach before options, why after, change always allowed.
export default function DrillCard({ trackId, n, drill, onNext, isLast }: { trackId: string; n: number; drill: Mcq; onNext: () => void; isLast: boolean }) {
  const { progress, set } = useProgress();
  const picked = progress.tracks[trackId]?.drills[n];
  const answered = picked !== undefined;
  const right = answered && picked === drill.answer;
  const [showTeach, setShowTeach] = useState(false);

  const choose = (i: number) => {
    const prev = progress;
    set(markDrill(progress, trackId, n, i));
    pushUndo(() => set(unmarkDrill(prev, trackId, n)));
  };

  return (
    <div style={{ border: '2px solid var(--ink)', borderRadius: 'var(--r-sticker)', padding: 20, background: 'var(--sky-100)' }}>
      <p className="kicker" style={{ color: 'var(--sky-700)' }}>Step 2 · question {n + 1}</p>
      <p style={{ font: '600 15px/1.45 var(--font-ui)', margin: '0 0 14px' }}>{drill.q}</p>
      {!answered && (
        <p style={{ margin: '0 0 14px' }}>
          <button
            type="button"
            onClick={() => setShowTeach((s) => !s)}
            style={{ background: 'none', border: 'none', padding: 0, font: '500 13px/1 var(--font-ui)', color: 'var(--sky-700)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
          >
            {showTeach ? 'Hide the explainer' : 'Show me how this works first'}
          </button>
        </p>
      )}
      {(showTeach || answered) && (
        <p style={{ margin: '0 0 14px', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{drill.teach}</p>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        {drill.options.map((o, i) => {
          const isPick = picked === i;
          const isAnswer = i === drill.answer;
          const style: React.CSSProperties = answered
            ? isAnswer
              ? { border: '2px solid var(--ink)', background: 'var(--sky-200)', fontWeight: 600 }
              : isPick
                ? { border: '1px solid var(--line)', textDecoration: 'line-through', color: 'var(--muted)', background: '#fff' }
                : { border: '1px solid var(--line)', color: 'var(--muted)', background: '#fff' }
            : { border: '1px solid var(--sky-200)', background: '#fff' };
          const mono = /^=/.test(o);
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => choose(i)}
              style={{ display: 'block', textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--r-sticker)', font: `${mono ? '500 13px/1.3 ui-monospace,Menlo,monospace' : '400 13px/1.4 var(--font-ui)'}`, cursor: answered ? 'default' : 'pointer', ...style }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {answered && (
        <p style={{ margin: '14px 0 0', font: '400 12px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>{right ? copy.lesson.thatsIt : copy.lesson.notQuite}</b> {drill.why}
        </p>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        {answered && (
          <button className="btn primary" type="button" onClick={onNext} style={{ minHeight: 40, fontSize: 13 }}>
            {isLast ? 'On to the task' : copy.lesson.nextQuestion}
          </button>
        )}
        {answered && (
          <button className="btn quiet" type="button" onClick={() => set(unmarkDrill(progress, trackId, n))} style={{ minHeight: 40, fontSize: 13 }}>
            {copy.lesson.changeMyAnswer}
          </button>
        )}
      </div>
    </div>
  );
}
