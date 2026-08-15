type Mark = 'underline' | 'circle' | 'arrow' | 'star' | 'squiggle';

// The five doodle marks from the spec. Stroke-only, decorative, never the
// sole carrier of meaning.
export default function Doodle({ mark, color = 'var(--sky-300)' }: { mark: Mark; color?: string }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 3, strokeLinecap: 'round' as const };
  return (
    <svg viewBox="0 0 90 40" width="90" height="40" aria-hidden="true">
      {mark === 'underline' && <path d="M4 30c8-12 16 4 24-6s14 8 22-2 12 4 16 0" {...common} />}
      {mark === 'squiggle' && <path d="M6 34c14-2 10-22 24-22s10 18 22 14 8-18 20-14" {...common} strokeDasharray="1 7" />}
      {mark === 'circle' && <circle cx="45" cy="20" r="15" {...common} />}
      {mark === 'star' && <path d="M45 4l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--sun)" stroke="var(--ink)" strokeWidth="1.5" />}
      {mark === 'arrow' && <path d="M8 8c18 0 30 8 30 18M38 26l-8-4M38 26l2-9" {...common} stroke="var(--ink)" strokeWidth="2" />}
    </svg>
  );
}
