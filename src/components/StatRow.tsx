// Plain counts of things she has done. Never outstanding, never a percentage.
// Ruled table: label left (muted), figure right (700 26px, tight tracking),
// border-bottom per row. A zero renders in --sky-500 to keep it from
// reading as a score.
export default function StatRow({ items }: { items: [number, string][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map(([n, label]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ font: '500 13px/1.4 var(--font-ui)', color: 'var(--muted)' }}>{label}</span>
          <b style={{ font: '700 26px/1 var(--font-ui)', letterSpacing: '-0.02em', color: n === 0 ? 'var(--sky-500)' : 'var(--ink)' }}>{n}</b>
        </div>
      ))}
    </div>
  );
}
