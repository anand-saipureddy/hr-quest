// Weekly job refresh. Plain Node, no SDK, no dependencies.
// Sources: Naukri + LinkedIn via Apify REST, Internshala via firecrawl CLI.
// Indeed is deliberately not scraped.
//
// Usage: node scripts/fetch-jobs.mjs [--dry-run] [--fixtures]
// Env:   APIFY_TOKEN, FIRECRAWL_API_KEY (CI secrets)
//
// Failure behaviour — loud to Anand, silent to her: if a source fails or
// returns zero, keep the last good content/jobs.json and exit non-zero.
// Never commit an empty array.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(fileURLToPath(import.meta.url)) + '/..';
const JOBS_FILE = path.join(ROOT, 'content/jobs.json');
const DRY_RUN = process.argv.includes('--dry-run');
const FIXTURES = process.argv.includes('--fixtures');

const TITLES = ['HR Executive', 'HR Recruiter', 'HR Trainee', 'Human Resource Generalist', 'Talent Acquisition'];

// ---------- id: stable hash of the URL, same scheme as v1 ----------
export function jobId(url) {
  return createHash('sha1').update(url).digest('hex').slice(0, 10);
}

// ---------- fit scoring (~30 lines): title match, exp bar ≤1y, Chennai ----------
const HR_RE = /\b(hr|human resource|recruiter|recruitment|talent acquisition|people ops)\b/i;
export function scoreFit({ title, exp, location }) {
  let fit = 40;
  const t = title ?? '';
  if (HR_RE.test(t)) fit += 30;
  if (/generalist|executive/i.test(t)) fit += 10;
  if (/trainee|fresher|intern/i.test(t)) fit += 8;
  if (/chennai/i.test(location ?? '')) fit += 10;
  const years = parseFloat(String(exp ?? '').match(/[\d.]+/)?.[0] ?? 'NaN');
  if (Number.isNaN(years) || years <= 1) fit += 12; // no bar or ≤1 year
  if (/sales|business development|telecall/i.test(t)) fit -= 25;
  return Math.max(0, Math.min(100, fit));
}

// ---------- source fetchers: each returns normalised raw jobs ----------
async function fetchNaukri(token) {
  const out = [];
  for (const keywords of TITLES) {
    const res = await fetch(
      `https://api.apify.com/v2/acts/valig~naukri-jobs-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ keywords, location: 'Chennai', experience: 0, jobAge: '7', limit: 100 }),
        signal: AbortSignal.timeout(240_000),
      }
    );
    if (!res.ok) throw new Error(`naukri ${keywords}: HTTP ${res.status}`);
    const items = await res.json();
    for (const it of items ?? []) {
      const url = it.url ?? it.jobUrl ?? it.link;
      const title = it.title ?? it.jobTitle;
      if (!url || !title) continue;
      out.push({
        url,
        company: it.company ?? it.companyName ?? '',
        title,
        location: it.location ?? 'Chennai',
        src: 'naukri',
        posted: it.postedDate ?? it.posted ?? undefined,
        salary: it.salary ?? undefined,
        exp: it.experience ?? it.exp ?? undefined,
      });
    }
  }
  return out;
}

async function fetchLinkedIn(token) {
  const out = [];
  for (const title of TITLES) {
    const res = await fetch(
      `https://api.apify.com/v2/acts/valig~linkedin-jobs-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title,
          location: 'Chennai, Tamil Nadu, India',
          datePosted: 'past-week',
          experienceLevel: ['1', '2'],
          limit: 100,
        }),
        signal: AbortSignal.timeout(240_000),
      }
    );
    if (!res.ok) throw new Error(`linkedin ${title}: HTTP ${res.status}`);
    const items = await res.json();
    for (const it of items ?? []) {
      const url = it.url ?? it.jobUrl ?? it.link;
      const jt = it.title ?? it.jobTitle;
      if (!url || !jt) continue;
      out.push({
        url,
        company: it.company ?? it.companyName ?? '',
        title: jt,
        location: it.location ?? 'Chennai',
        src: 'linkedin',
        posted: it.postedDate ?? it.postedAt ?? undefined,
        salary: it.salary ?? undefined,
        exp: it.experienceLevel ?? undefined,
      });
    }
  }
  return out;
}

// Internshala via the firecrawl CLI against the Chennai HR search URL.
// Parsed from the markdown listing — no SDK.
function fetchInternshala() {
  const md = execFileSync('firecrawl', ['scrape', 'https://internshala.com/jobs/human-resources-jobs-in-chennai/', '-o', '-'], {
    encoding: 'utf8',
    timeout: 120_000,
  });
  const out = [];
  const re = /## \[([^\]]+)\]\((https:\/\/internshala\.com\/job\/detail\/[^)]+)\)\n\n([^\n]+)\n[\s\S]*?\n\n(Chennai[^\n]*)\n\n(₹[^\n]+)/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    out.push({
      title: m[1].trim(),
      url: m[2],
      company: m[3].trim(),
      location: m[4].trim(),
      src: 'internshala',
      salary: m[5].replace(/\s*\/year.*$/, '').trim(),
    });
  }
  return out;
}

// ---------- merge: never lose an entry, keep firstSeen, never drop saved ----------
export function mergeJobs(existing, fetched, progress, today) {
  const byId = new Map(existing.map((j) => [j.id, j]));
  const seenThisRun = new Set();
  const fresh = [];
  for (const raw of fetched) {
    const id = jobId(raw.url);
    if (seenThisRun.has(id) || byId.has(id)) continue; // dedupe across title variants
    seenThisRun.add(id);
    fresh.push({ ...raw, id, fit: scoreFit(raw), firstSeen: today, isNew: true });
  }
  // Existing entries always kept — an id vanishing from jobs.json would
  // silently erase her saved/applied/notes keyed by that id.
  const keep = existing.map((j) => ({ ...j, isNew: false }));
  // existing jobs keep original firstSeen; new ones already carry today
  return [...keep, ...fresh].sort((a, b) => b.fit - a.fit);
}

// ---------- main ----------
async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const token = process.env.APIFY_TOKEN;
  if (!token && !FIXTURES) {
    console.error('APIFY_TOKEN is not set');
    process.exit(1);
  }

  let existing = [];
  try {
    existing = JSON.parse(readFileSync(JOBS_FILE, 'utf8'));
  } catch {}

  const sources = {};
  if (FIXTURES) {
    sources.naukri = [
      { url: 'https://www.naukri.com/job-listings-hr-executive-demo-chennai-0-to-1-years-150826000001', company: 'Demo Co', title: 'HR Executive', location: 'Chennai', exp: '0-1 Yrs', salary: '2-3 Lacs' },
    ];
    sources.linkedin = [];
    sources.internshala = [];
  } else {
    try {
      sources.naukri = await fetchNaukri(token);
    } catch (e) {
      console.error(`naukri failed: ${e.message}`);
      process.exit(1);
    }
    try {
      sources.linkedin = await fetchLinkedIn(token);
    } catch (e) {
      console.error(`linkedin failed: ${e.message}`);
      process.exit(1);
    }
    try {
      sources.internshala = fetchInternshala();
    } catch (e) {
      console.error(`internshala failed: ${e.message}`);
      process.exit(1);
    }
  }

  const total = Object.values(sources).reduce((n, a) => n + a.length, 0);
  console.log(`fetched: naukri=${sources.naukri.length} linkedin=${sources.linkedin.length} internshala=${sources.internshala.length}`);
  if (sources.naukri.length === 0 || total === 0) {
    console.error('a source returned zero — keeping last good jobs.json, exiting non-zero');
    process.exit(1);
  }

  let progress = {};
  const merged = mergeJobs(existing, Object.values(sources).flat(), progress, today);
  const newCount = merged.filter((j) => j.isNew).length;
  console.log(`merged: ${merged.length} total, ${newCount} new`);

  if (merged.length === 0) {
    console.error('refusing to write an empty jobs.json');
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log(JSON.stringify(merged.filter((j) => j.isNew).slice(0, 5), null, 2));
    console.log('--dry-run: not writing');
    return;
  }
  writeFileSync(JOBS_FILE, JSON.stringify(merged, null, 2) + '\n');
  console.log(`wrote ${JOBS_FILE}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) main();
