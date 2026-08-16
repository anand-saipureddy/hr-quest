// The identical three-step spine for every track: setup → drills → build,
// joined by a dotted doodle. Predictability is the accommodation.
export const SPINE_STEPS = ['Make the thing', 'Answer the questions', 'The real task'];

export default function StepSpine({ current, anchors }: { current: 1 | 2 | 3; anchors?: string[] }) {
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, marginBottom: 26 }}>
      <svg viewBox="0 0 400 30" width="100%" height="30" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }} aria-hidden="true">
        <path d="M20 15 H380" stroke="var(--sky-300)" strokeWidth="3.5" strokeDasharray="2 4" strokeLinecap="round" fill="none" />
      </svg>
      {SPINE_STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const now = n === current;
        const circleBase = {
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 30, height: 30, borderRadius: 'var(--r-pill)', marginBottom: 12,
          font: '700 13px/1 var(--font-ui)', textDecoration: 'none',
          background: done ? 'var(--sky-700)' : now ? 'var(--sky-200)' : '#fff',
          color: done ? '#fff' : now ? 'var(--ink)' : 'var(--muted)',
          border: done ? 'none' : now ? '2px solid var(--sky-700)' : '1px solid var(--line)',
        };
        const href = anchors ? `#${anchors[i]}` : undefined;
        return (
          <div key={n} style={{ position: 'relative', paddingRight: 20, zIndex: 1 }}>
            {href ? (
              <a href={href} style={circleBase} aria-label={`Go to step ${n}: ${label}`}>{n}</a>
            ) : (
              <span style={circleBase}>{n}</span>
            )}
            <p style={{ font: '600 15px/1.3 var(--font-ui)', margin: 0 }}>{label}</p>
          </div>
        );
      })}
    </div>
  );
}
