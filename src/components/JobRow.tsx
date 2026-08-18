import { copy } from '../lib/copy';
import { whyThisOne } from '../lib/fit';
import { markJob, type Job } from '../lib/progress';
import { useProgress } from '../lib/progress-context';
import { pushUndo } from './UndoBar';
import FitBadge from './FitBadge';
import JobNote from './JobNote';
import FollowUpDraft from './FollowUpDraft';

const BOARD: Record<Job['src'], string> = { naukri: 'Naukri', internshala: 'Internshala', linkedin: 'LinkedIn', indeed: 'Indeed' };

function daysSince(d?: string): number {
  if (!d) return 0;
  return Math.floor((Date.now() - new Date(d + 'T00:00:00').getTime()) / 86400000);
}

function fmtShortDate(d?: string): string {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export default function JobRow({ job }: { job: Job }) {
  const { progress, set } = useProgress();
  const st = progress.jobs[job.id] ?? {};

  const toggle = (flag: 'saved' | 'applied' | 'notMe', on: boolean) => {
    const prev = progress;
    set(markJob(progress, job.id, flag, on));
    pushUndo(() => set(prev));
  };

  const followUpDays = st.applied && !st.note?.includes('replied') ? daysSince(st.appliedOn) : 0;

  return (
    <li className={`job-row${st.applied ? ' applied' : ''}`}>
      <FitBadge fit={job.fit} />
      <div style={{ minWidth: 0 }}>
        <p style={{ font: '600 17px/1.3 var(--font-ui)', margin: 0 }}>{job.title}</p>
        <p style={{ margin: '3px 0 0', font: '400 14px/1.4 var(--font-ui)' }}>
          {job.company} · {job.location}{job.salary ? ` · ${job.salary}` : ''}
        </p>
        <p style={{ margin: '8px 0 0', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
          <b style={{ color: 'var(--ink)' }}>Why this one:</b> {whyThisOne(job)}
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <span className="pill">{BOARD[job.src]}</span>
          {job.exp && <span className="pill">{job.exp}</span>}
          {job.isNew ? (
            <span className="pill">{copy.jobs.newThisWeek}</span>
          ) : job.firstSeen ? (
            <span style={{ font: '400 11px/1.3 var(--font-ui)', color: 'var(--muted)' }}>{copy.jobs.firstSeen(fmtShortDate(job.firstSeen))}</span>
          ) : null}
        </div>
        {followUpDays >= 7 && (
          <p style={{ margin: '12px 0 0', font: '400 13px/1.5 var(--font-ui)', color: 'var(--muted)', borderLeft: '2px solid var(--sky-300)', paddingLeft: 12 }}>{copy.jobs.followUp(followUpDays)}</p>
        )}
        {(st.applied || st.saved) && (
          <div style={{ marginTop: 6, display: 'grid', gap: 8 }}>
            <JobNote jobId={job.id} />
            {st.applied && st.appliedOn && <FollowUpDraft job={job} appliedOn={st.appliedOn} />}
          </div>
        )}
      </div>
      <div className="job-actions">
        {!st.notMe && (
          <>
            <a className="btn primary" href={job.url} target="_blank" rel="noopener" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
              Apply on site ↗
            </a>
            {!st.applied && (
              <button className="btn quiet" type="button" onClick={() => toggle('applied', true)} style={{ minHeight: 40, fontSize: 13 }}>
                I applied
              </button>
            )}
            {st.applied && (
              <span className="btn" style={{ minHeight: 40, fontSize: 13, cursor: 'default' }}>Applied {st.appliedOn}</span>
            )}
            <button className="btn quiet" type="button" onClick={() => toggle('saved', !st.saved)} style={{ minHeight: 40, fontSize: 13 }}>
              {st.saved ? 'Unsave' : 'Save for later'}
            </button>
            {!st.applied && (
              <button
                type="button"
                onClick={() => toggle('notMe', true)}
                style={{ background: 'none', border: 'none', padding: 0, minHeight: 40, textAlign: 'left', font: '500 13px/1 var(--font-ui)', color: 'var(--muted)', cursor: 'pointer' }}
              >
                {copy.jobs.notForMe}
              </button>
            )}
            {st.applied && (
              <button
                type="button"
                onClick={() => toggle('applied', false)}
                style={{ background: 'none', border: 'none', padding: 0, minHeight: 40, textAlign: 'left', font: '500 13px/1 var(--font-ui)', color: 'var(--muted)', cursor: 'pointer' }}
              >
                Undo applied
              </button>
            )}
          </>
        )}
        {st.notMe && (
          <button className="btn quiet" type="button" onClick={() => toggle('notMe', false)} style={{ minHeight: 40, fontSize: 13 }}>
            {copy.jobs.putItBack}
          </button>
        )}
      </div>
    </li>
  );
}
