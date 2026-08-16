// Plain counts of things she has done. Never outstanding, never a percentage.
export default function StatRow({ items }: { items: [number, string][] }) {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {items.map(([n, label]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <b style={{ font: '700 30px/1 var(--font-ui)', color: 'var(--sky-700)', minWidth: 34 }}>{n}</b>
          <span style={{ font: '400 13px/1.4 var(--font-ui)', color: 'var(--muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
