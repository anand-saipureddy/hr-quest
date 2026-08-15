import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Doodle from '../components/Doodle';
import EmptyState from '../components/EmptyState';
import JobRow from '../components/JobRow';
import { jobs } from '../lib/content';
import { useProgress } from '../lib/progress-context';

type ListKey = 'recent' | 'earlier' | 'saved' | 'applied' | 'notme';
const NEW_CAP = 10;

// Five lists: Recent · Earlier · Saved · Applied · Not me.
// Recent = isNew (capped at newCap). "Not for me" is a real list, never a delete.
export default function Jobs() {
  const { progress } = useProgress();
  const [params, setParams] = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const list = (params.get('list') as ListKey) || 'recent';

  // Recent = first NEW_CAP of the isNew set (by fit); Earlier = everything else
  const fresh = jobs.filter((j) => j.isNew && !progress.jobs[j.id]?.notMe && !progress.jobs[j.id]?.applied).sort((a, b) => b.fit - a.fit);
  const recent = fresh.slice(0, NEW_CAP);
  const overflow = new Set(recent.map((j) => j.id));
  const earlier = jobs.filter((j) => !overflow.has(j.id) && !progress.jobs[j.id]?.notMe && !progress.jobs[j.id]?.applied && !progress.jobs[j.id]?.saved);
  const saved = jobs.filter((j) => progress.jobs[j.id]?.saved && !progress.jobs[j.id]?.applied);
  const applied = jobs.filter((j) => progress.jobs[j.id]?.applied);
  const notMe = jobs.filter((j) => progress.jobs[j.id]?.notMe);

  const lists: Record<ListKey, { label: string; rows: typeof jobs }> = {
    recent: { label: 'Recent', rows: recent },
    earlier: { label: 'Earlier', rows: earlier },
    saved: { label: 'Saved', rows: saved },
    applied: { label: 'Applied', rows: applied },
    notme: { label: 'Not for me', rows: notMe },
  };

  const current = lists[list] ?? lists.recent;
  const byFit = (a: (typeof jobs)[number], b: (typeof jobs)[number]) => b.fit - a.fit;
  const visible = expanded ? [...current.rows].sort(byFit) : [...current.rows].sort(byFit).slice(0, NEW_CAP);

  const select = (k: ListKey) => {
    setParams(k === 'recent' ? {} : { list: k }, { replace: true });
    setExpanded(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26 }}>HR openings in Chennai</h1>
          <p style={{ margin: '6px 0 0', font: '400 13px/1.6 var(--font-ui)', color: 'var(--muted)' }}>
            Fresher roles only · the word is the fit, the number is just support
          </p>
          <p className="hand" style={{ margin: '10px 0 0', fontSize: 17, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Doodle mark="arrow" width={34} />
            a rough sort, not a verdict
          </p>
        </div>
      </div>

      <div role="tablist" aria-label="Job lists" style={{ display: 'flex', gap: 2, margin: '22px 0 0', borderBottom: '2px solid var(--ink)', flexWrap: 'wrap' }}>
        {(Object.keys(lists) as ListKey[]).map((k) => {
          const l = lists[k];
          const active = k === list;
          return (
            <button
              key={k}
              role="tab"
              aria-selected={active}
              onClick={() => select(k)}
              style={{
                padding: '11px 18px', border: 'none', cursor: 'pointer',
                background: active ? 'var(--ink)' : 'var(--sky-100)',
                color: active ? '#fff' : 'var(--sky-700)',
                font: `${active ? 600 : 500} 13px/1 var(--font-ui)`,
              }}
            >
              {l.label}{l.rows.length > 0 && k !== 'recent' && k !== 'earlier' ? ` (${l.rows.length})` : ''}
            </button>
          );
        })}
      </div>

      {current.rows.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          {list === 'recent' && (
            <EmptyState
              title="No new openings this week"
              body="Boards are quiet some weeks — this happens and it isn't about you. Your saved ones are still there, and the list refreshes on Mondays."
              doors={[
                { label: `Look at saved (${saved.length})`, onClick: () => select('saved') },
                { label: 'Do a lesson instead', onClick: () => navigate('/course') },
              ]}
            />
          )}
          {list === 'earlier' && (
            <EmptyState
              title="Nothing older is live right now"
              body="Everything seen so far is either in Recent or in one of your own lists."
              doors={[
                { label: 'Back to Recent', onClick: () => select('recent') },
                { label: 'Look at saved', onClick: () => select('saved') },
              ]}
            />
          )}
          {list === 'saved' && (
            <EmptyState
              title="Nothing saved yet"
              body="Tap 'Save for later' on any opening and it waits here for you."
              doors={[
                { label: 'See recent openings', onClick: () => select('recent') },
                { label: 'Do a lesson instead', onClick: () => navigate('/course') },
              ]}
            />
          )}
          {list === 'applied' && (
            <EmptyState
              title="No applications marked yet"
              body="When you apply somewhere, tap 'I applied' on that opening and it moves here so you can follow up."
              doors={[
                { label: 'See recent openings', onClick: () => select('recent') },
                { label: 'Look at saved', onClick: () => select('saved') },
              ]}
            />
          )}
          {list === 'notme' && (
            <EmptyState
              title="Nothing hidden"
              body="'Not for me' moves an opening here instead of deleting it — everything here can come back with one tap."
              doors={[
                { label: 'See recent openings', onClick: () => select('recent') },
                { label: 'Back to Today', onClick: () => navigate('/') },
              ]}
            />
          )}
        </div>
      ) : (
        <>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {visible.map((j) => (
              <JobRow key={j.id} job={j} />
            ))}
          </ul>
          {current.rows.length > NEW_CAP && !expanded && (
            <p style={{ margin: '20px 0 0' }}>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                style={{ background: 'none', border: 'none', padding: 0, font: '500 13px/1 var(--font-ui)', color: 'var(--sky-700)', textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }}
              >
                Show the rest ({current.rows.length - NEW_CAP} more)
              </button>
            </p>
          )}
        </>
      )}
    </div>
  );
}
