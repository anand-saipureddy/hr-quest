// Regression tests for the layout-pass. Every test in this file maps
// to a concrete bug we hit (or a structural rule we derived) during
// the pass, so the same mistake can't drift back in.
//
// Mapping:
//   1) the .how selector                              -> Screen-1 cleanup
//   2) the .lesson-grid selector                      -> Step 7 (Lesson uses .page)
//   3) the 12 new Doodle marks + viewBox sizes       -> handoff Part D
//   4) SPINE_STEPS has exactly 3 labels               -> Skills rail + StepSpine
//   5) the handoff-introduced copy keys exist         -> the new strings list
//   6) the sidebar privacy footnote is present        -> the ruled stack
//   7) the page-internal grids live in CSS classes     -> mobile overlap fix
//   8) the Lesson "Go back over the questions" works   -> the reviewing flag
//   9) the Flashcards page renders both views          -> grid on laptop
//
// The CSS structural rules (A1–A5) and the centering / no-cap rule
// live in shell.test.mjs. The internal-link rules live in
// navigation.test.mjs. The copy-rule guards live in
// copy-guards.test.mjs.

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src');
const CSS = readFileSync(join(SRC, 'styles', 'global.css'), 'utf8');
const COPY = readFileSync(join(SRC, 'lib', 'copy.ts'), 'utf8');
const DOODLE = readFileSync(join(SRC, 'components', 'Doodle.tsx'), 'utf8');
const STEP_SPINE = readFileSync(join(SRC, 'components', 'StepSpine.tsx'), 'utf8');
const TODAY = readFileSync(join(SRC, 'pages', 'Today.tsx'), 'utf8');
const JOB_ROW = readFileSync(join(SRC, 'components', 'JobRow.tsx'), 'utf8');
const NEXT = readFileSync(join(SRC, 'components', 'NextThing.tsx'), 'utf8');
const LESSON = readFileSync(join(SRC, 'pages', 'Lesson.tsx'), 'utf8');
const FLASHCARDS = readFileSync(join(SRC, 'pages', 'Flashcards.tsx'), 'utf8');

// ── 1) The old <details className="how"> was deleted in Screen-1
//      cleanup. If the .how selector comes back, the collapsible
//      explainer returns and "How this works" content duplicates the
//      door rows.
test('removed: the .how selector is gone from global.css', () => {
  assert.doesNotMatch(
    CSS,
    /(^|[^a-zA-Z0-9_-])\.how\s*[\{,]/,
    'the old .how selector (from the deleted <details className="how">) must not be back in global.css',
  );
});

// ── 2) The old .lesson-grid was replaced with the shared .page
//      grid in Step 7. If it returns, the Lesson page goes back to a
//      narrow two-column layout and loses the rail rhythm.
test('removed: the .lesson-grid selector is gone from global.css', () => {
  assert.doesNotMatch(
    CSS,
    /(^|[^a-zA-Z0-9_-])\.lesson-grid\s*[\{,]/,
    'the old .lesson-grid (replaced by .page in step 7) must not be back',
  );
});

// ── 3) The 12 new Doodle marks from handoff Part D, with the
//      viewBox sizes the handoff author chose (the rail scenes depend
//      on the larger viewBoxes; the track icons on 60x44).
const NEW_MARKS = [
  { name: 'desk',      vb: [220, 170] },
  { name: 'clockArrow',vb: [140,  90] },
  { name: 'books',     vb: [200, 150] },
  { name: 'toolbox',   vb: [200, 150] },
  { name: 'skyline',   vb: [220, 140] },
  { name: 'sheet',     vb: [ 60,  44] },
  { name: 'chat',      vb: [ 60,  44] },
  { name: 'person',    vb: [ 60,  44] },
  { name: 'payslip',   vb: [ 60,  44] },
  { name: 'board',     vb: [ 60,  44] },
  { name: 'envelope',  vb: [ 60,  44] },
  { name: 'bars',      vb: [ 60,  44] },
];
test('all 12 new Doodle marks are defined with the handoff viewBox sizes', () => {
  for (const { name, vb } of NEW_MARKS) {
    assert.ok(
      new RegExp(`\\b${name}\\b`).test(DOODLE),
      `Doodle mark "${name}" must be defined in Doodle.tsx`,
    );
    assert.ok(
      new RegExp(`${name}:\\s*\\[\\s*${vb[0]}\\s*,\\s*${vb[1]}\\s*\\]`).test(DOODLE),
      `Doodle mark "${name}" must be BOX [${vb[0]}, ${vb[1]}] per handoff Part D`,
    );
  }
});

// ── 4) SPINE_STEPS exports exactly 3 labels — both the Skills rail
//      ruled list and the StepSpine component index into this array.
test('SPINE_STEPS has exactly 3 labels', () => {
  const m = STEP_SPINE.match(/export const SPINE_STEPS\s*=\s*\[([^\]]+)\]/);
  assert.ok(m, 'SPINE_STEPS must be exported from StepSpine.tsx');
  const labels = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  assert.equal(labels.length, 3, `SPINE_STEPS must have 3 labels, got ${labels.length}: ${labels.join(', ')}`);
});

// ── 5) Every copy key the handoff introduced, plus the back-link
//      strings, must exist with a value.
const REQUIRED_COPY = [
  // top-level objects (handoff groups)
  { key: 'today',   re: /\btoday:\s*\{/ },
  { key: 'course',  re: /\bcourse:\s*\{/ },
  { key: 'skills',  re: /\bskills:\s*\{/ },
  { key: 'jobs',    re: /\bjobs:\s*\{/ },
  { key: 'nav',     re: /\bnav:\s*\{/ },
  { key: 'app',     re: /\bapp:\s*\{/ },
  // handoff-introduced leaves
  { key: 'today.thingsDone',     re: /\bthingsDone:\s*['"][^'"]+['"]/ },
  { key: 'course.shape',         re: /\bshape:\s*\{/ },
  { key: 'course.shape.title',   re: /title:\s*['"]What a lesson looks like['"]/ },
  { key: 'course.shape.steps',   re: /\bsteps:\s*\[/ },
  { key: 'skills.spineNote',     re: /\bspineNote:\s*['"][^'"]+['"]/ },
  { key: 'skills.stepNotes',     re: /\bstepNotes:\s*\[/ },
  { key: 'skills.closingLine',   re: /\bclosingLine:\s*['"][^'"]+['"]/ },
  { key: 'jobs.roughSort',       re: /\broughSort:\s*['"][^'"]+['"]/ },
  { key: 'jobs.allSeven',        re: /\ballSeven:\s*['"][^'"]+['"]/ },
  { key: 'jobs.sortingTitle',    re: /\bsortingTitle:\s*['"][^'"]+['"]/ },
  { key: 'jobs.sortingNote',     re: /\bsortingNote:\s*['"][^'"]+['"]/ },
  // nav.figures are functions
  { key: 'nav.today',  re: /\btoday:\s*\(/ },
  { key: 'nav.course', re: /\bcourse:\s*\(/ },
  { key: 'nav.skills', re: /\bskills:\s*\(/ },
  { key: 'nav.jobs',   re: /\bjobs:\s*\(/ },
  // back-link strings
  { key: 'app.backToSkills', re: /\bbackToSkills:\s*['"][^'"]+['"]/ },
  { key: 'app.backToCourse', re: /\bbackToCourse:\s*['"][^'"]+['"]/ },
  { key: 'app.backToLesson', re: /\bbackToLesson:\s*['"][^'"]+['"]/ },
  // sidebar foot
  { key: 'app.footnote',     re: /\bfootnote:\s*['"][^'"]+['"]/ },
];
test('copy: every key the handoff (and the detail-page back links) introduced is present', () => {
  for (const { key, re } of REQUIRED_COPY) {
    assert.ok(re.test(COPY), `copy.${key} must be defined in src/lib/copy.ts`);
  }
});

// ── 6) The sidebar foot is the privacy footnote. (Complements the
//      key test; this is the substantive content guard.)
test('copy: app.footnote is a non-empty privacy line', () => {
  const m = COPY.match(/\bfootnote:\s*['"]([^'"]+)['"]/);
  assert.ok(m, 'app.footnote must be defined');
  assert.ok(m[1].trim().length > 0, 'app.footnote must not be empty');
});

// ── 7) The three page-internal grids (hero, door row, job row) must
//      live in CSS classes so 768px media queries can collapse them.
//      We check the classes exist (in CSS) AND that the pages wire
//      them up (so a refactor can't quietly move them back to inline
//      grid-template-columns, which media queries can't reach).
test('page-internal grids live in CSS classes', () => {
  for (const cls of ['.hero-grid', '.door-row', '.job-row']) {
    assert.ok(
      new RegExp(`\\${cls}\\s*\\{`).test(CSS),
      `${cls} must be defined in global.css (inline grid-template-columns can't be collapsed by media queries)`,
    );
  }
  // Use a window match so all three quote styles (", ', `) work,
  // and the class names are anchored — no need for a brittle char class.
  assert.match(TODAY,   /className=[\s\S]{0,40}door-row/,   'Today must use the .door-row class on the door Links');
  assert.match(JOB_ROW, /className=[\s\S]{0,40}job-row/,    'JobRow must use the .job-row class on the <li>');
  assert.match(NEXT,    /className=[\s\S]{0,40}hero-grid/,  'NextThing must use the .hero-grid class on the hero panel');
});

// ── 8) The Lesson "Go back over the questions" button. The original
//      bug was that it only called setQ(0); showScenario = allAnswered
//      || done, so once done the questions never re-appeared. The fix
//      is a reviewing flag. Assert the source actually depends on it.
test('Lesson: "Go back over the questions" enters review mode (not just resets q)', () => {
  // showScenario must depend on the reviewing flag
  assert.match(
    LESSON,
    /showScenario\s*=\s*!reviewing\s*&&\s*\(/,
    'Lesson showScenario must depend on the reviewing flag (otherwise the button is a no-op)',
  );
  // The button's onClick must call setReviewing(true) and its text must
  // be "Go back over the questions". In the source the onClick comes
  // before the text, so match a <button> that contains both. Use
  // [\s\S]*? (not [^>]*) because the opening tag has > only at the end,
  // so [^>]* is greedy and swallows onClick.
  assert.match(
    LESSON,
    /<button\b[\s\S]*?onClick[\s\S]*?setReviewing\s*\(\s*true[\s\S]*?Go back over the questions/,
    '"Go back over the questions" button must call setReviewing(true) so the questions re-appear',
  );
  // There must be a "Back to the summary" exit
  assert.match(LESSON, /Back to the summary/, 'there must be a "Back to the summary" link to exit review mode');
});

// ── 9) The Flashcards page must render both the grid (laptop) and
//      the single (mobile) views; CSS toggles which is visible.
test('Flashcards: both .flashcards-grid and .flashcards-single are rendered', () => {
  assert.match(FLASHCARDS, /className="flashcards-grid"/, 'Flashcards must render a .flashcards-grid (shown on laptop)');
  assert.match(FLASHCARDS, /className="flashcards-single"/, 'Flashcards must render a .flashcards-single (shown on mobile)');
});
