import { Link } from 'react-router-dom';
import type { Track } from '../lib/progress';

// Track card on the Skills index. Status label is the only ordering implied;
// no track is locked, none suggested first.
export default function TrackCard({ track, status }: { track: Track; status: 'built' | 'started' | 'new' }) {
  const label = status === 'built' ? 'Built' : status === 'started' ? 'In progress' : 'New';
  return (
    <div style={{ border: status === 'started' ? '2px solid var(--ink)' : '1px solid var(--line)', borderRadius: 'var(--r-sticker)', padding: 20, background: status === 'started' ? 'var(--sky-100)' : '#fff' }}>
      <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.14em', textTransform: 'uppercase', color: status === 'started' ? 'var(--sky-700)' : 'var(--muted)', margin: '0 0 10px' }}>{label}</p>
      <p style={{ font: '600 17px/1.25 var(--font-ui)', margin: '0 0 8px' }}>{track.name}</p>
      <p style={{ margin: '0 0 14px', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>{track.blurb}</p>
      <Link to={`/skills/${track.id}`} className={status === 'started' ? 'btn primary' : 'btn quiet'} style={{ minHeight: 40, fontSize: 13 }}>
        {status === 'built' ? 'Revisit' : status === 'started' ? 'Continue' : 'Open'}
      </Link>
    </div>
  );
}
