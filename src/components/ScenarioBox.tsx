import { useEffect, useRef, useState } from 'react';
import { saveScenario, type Scenario } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from './UndoBar';

// The scenario is self-marked: free text, autosaved (500ms debounce), model
// answer revealed ONLY after she has written something. Never before.
export default function ScenarioBox({ lessonId, scenario }: { lessonId: string; scenario: Scenario }) {
  const { progress, set } = useProgress();
  const saved = progress.lessons[lessonId]?.scenario ?? '';
  const [text, setText] = useState(saved);
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setText(saved), [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (v: string) => {
    setText(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const prev = progress;
      set(saveScenario(progress, lessonId, v));
      pushUndo(() => set(prev));
    }, 500);
  };

  const canReveal = text.trim().length > 0;

  return (
    <div style={{ border: '1px dashed var(--sky-300)', borderRadius: 'var(--r-sticker)', padding: 20, background: 'var(--bg)' }}>
      <p className="kicker" style={{ color: 'var(--sky-700)' }}>Interview scenario</p>
      <p style={{ margin: '0 0 14px', font: '400 14px/1.7 var(--font-ui)', whiteSpace: 'pre-wrap' }}>{scenario.prompt}</p>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        aria-label="Your answer"
        placeholder="Write it the way you would actually say it out loud."
        style={{
          width: '100%', padding: 14, border: '1px solid var(--line)', borderRadius: 'var(--r-structural)',
          font: '400 14px/1.6 var(--font-ui)', background: '#fff', resize: 'vertical',
        }}
      />
      <p style={{ margin: '8px 0 0', font: '400 11px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
        Saved on this laptop as you type. Nobody marks it but you.
      </p>
      {!revealed ? (
        <div style={{ marginTop: 14 }}>
          <button className="btn" type="button" disabled={!canReveal} onClick={() => setRevealed(true)} style={!canReveal ? { opacity: 0.5, cursor: 'default' } : undefined}>
            Show the model answer
          </button>
          {!canReveal && (
            <p style={{ margin: '8px 0 0', font: '400 12px/1.5 var(--font-ui)', color: 'var(--muted)' }}>
              Write something first — even one rough sentence — and the model answer opens.
            </p>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 14, padding: 16, background: '#fff', border: '1px solid var(--line)', borderRadius: 'var(--r-sticker)' }}>
          <p style={{ margin: 0, font: '400 13px/1.7 var(--font-ui)', whiteSpace: 'pre-wrap' }}>{scenario.model}</p>
          <p style={{ margin: '10px 0 0', font: '400 11px/1.5 var(--font-ui)', color: 'var(--muted)' }}>{scenario.source}</p>
        </div>
      )}
    </div>
  );
}
