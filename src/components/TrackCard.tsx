import { Link } from 'react-router-dom';
import Doodle from './Doodle';
import type { Track } from '../lib/progress';

// Track card on the Skills index. Status label is the only ordering implied;
// no track is locked, none suggested first. Each card carries its own mark.
export const MARK_BY_TRACK: Record<Track['id'], 'sheet' | 'chat' | 'person' | 'payslip' | 'board' | 'envelope' | 'bars'> = {
  excel: 'sheet',
  genai: 'chat',
  interview: 'person',
  payroll: 'payslip',
  ats: 'board',
  email: 'envelope',
  analytics: 'bars',
};

export default function TrackCard({ track, status }: { track: Track; status: 'built' | 'started' | 'new' }) {
  const label = status === 'built' ? 'Built' : status === 'started' ? 'In progress' : 'New';
  const mark = MARK_BY_TRACK[track.id];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, border: status === 'started' ? '2px solid var(--ink)' : '1px solid var(--line)', padding: 20, background: status === 'started' ? 'var(--sky-100)' : '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <p style={{ font: '600 10px/1 var(--font-ui)', letterSpacing: '.14em', textTransform: 'uppercase', color: status === 'started' ? 'var(--sky-700)' : 'var(--muted)', margin: 0 }}>{label}</p>
        <Doodle mark={mark} width={48} />
      </div>
      <p style={{ font: '600 17px/1.25 var(--font-ui)', margin: 0 }}>{track.name}</p>
      <p style={{ margin: 0, font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)', flex: 1 }}>{track.blurb}</p>
      <Link to={`/skills/${track.id}`} className={status === 'started' ? 'btn primary' : 'btn quiet'} style={{ minHeight: 40, fontSize: 13, alignSelf: 'flex-start' }}>
        {status === 'built' ? 'Revisit' : status === 'started' ? 'Continue' : 'Open'}
      </Link>
    </div>
  );
}
