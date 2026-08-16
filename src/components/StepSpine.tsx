// The identical three-step spine for every track: setup → drills → build,
// joined by a dotted doodle. Predictability is the accommodation.
export const SPINE_STEPS = ['Make the thing', 'Answer the questions', 'The real task'];

export default function StepSpine({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: 26 }}>
      <svg viewBox="0 0 400 20" width="100%" height="20" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 14 }} aria-hidden="true">
        <path d="M20 10h360" stroke="var(--sky-300)" strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" fill="none" />
      </svg>
      {SPINE_STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const now = n === current;
        return (
          <div key={n} style={{ position: 'relative', paddingRight: 20 }}>
            <span
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 30, height: 30, borderRadius: 'var(--r-pill)', marginBottom: 12,
                font: '700 13px/1 var(--font-ui)',
                background: done ? 'var(--sky-700)' : now ? 'var(--sky-200)' : '#fff',
                color: done ? '#fff' : now ? 'var(--ink)' : 'var(--muted)',
                border: done ? 'none' : now ? '2px solid var(--sky-700)' : '1px solid var(--line)',
              }}
            >
              {n}
            </span>
            <p style={{ font: '600 15px/1.3 var(--font-ui)', margin: 0 }}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}
