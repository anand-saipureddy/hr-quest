// Plain counts of things she has done. Never outstanding, never a percentage.
// Ruled table: label left (muted, small-caps), figure right (700 26px),
// border-bottom per row. A zero renders in --sky-500 to keep it from
// reading as a score.
export default function StatRow({ items }: { items: [number, string][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map(([n, label]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
          <span style={{ font: '500 11px/1.3 var(--font-ui)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</span>
          <b style={{ font: '700 26px/1 var(--font-ui)', color: n === 0 ? 'var(--sky-500)' : 'var(--ink)' }}>{n}</b>
        </div>
      ))}
    </div>
  );
}
