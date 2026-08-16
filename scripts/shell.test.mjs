// Tests for the shared shell CSS. Each test maps to one of the
// Part A structural rules in the handoff, plus the working-column
// gap that bit us on Screen-1 (the .col was a plain block, so the
// header band, hero and door list all stacked flush).

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(__dirname, '..', 'src', 'styles', 'global.css'), 'utf8');

test('A1: .page uses align-items:stretch (never start)', () => {
  const m = css.match(/\.page\s*\{[^}]*\}/);
  assert.ok(m, '.page rule not found in global.css');
  assert.match(m[0], /align-items\s*:\s*stretch/, '.page must be align-items:stretch');
  assert.doesNotMatch(m[0], /align-items\s*:\s*start\b/, '.page must not be align-items:start');
});

test('A2: no min-height on .rail, .col or .page', () => {
  for (const sel of ['.rail', '\\.col', '.page']) {
    const re = new RegExp(`(?<!\\w)${sel}(?!\\w)\\s*\\{[^}]*\\}`, 'g');
    let m;
    while ((m = re.exec(css)) !== null) {
      assert.doesNotMatch(
        m[0],
        /min-height\s*:/,
        `${sel} must not declare min-height (A2: hand-tuned min-height is the symptom, not the fix)`,
      );
    }
  }
});

test('A3: .rail .scene uses margin:auto 0 (two-value) so the slack splits above and below', () => {
  const m = css.match(/\.rail\s+\.scene\s*\{[^}]*\}/);
  assert.ok(m, '.rail .scene rule not found');
  assert.match(m[0], /margin\s*:\s*auto\s+0\b/, '.rail .scene must use the two-value margin:auto 0');
  assert.doesNotMatch(
    m[0],
    /margin\s*:\s*auto\s+0\s+0\b/,
    '.rail .scene must not use the three-value margin:auto 0 0 (that pools the slack at the top — A3)',
  );
});

test('working column: .page > .col is a flex column with a gap (Screen-1 collision guard)', () => {
  const m = css.match(/\.page\s*>\s*\.col\s*\{[^}]*\}/);
  assert.ok(m, '.page > .col rule not found');
  assert.match(m[0], /display\s*:\s*flex/, '.page > .col must be display:flex');
  assert.match(m[0], /flex-direction\s*:\s*column/, '.page > .col must be flex-direction:column');
  assert.match(m[0], /gap\s*:/, '.page > .col must declare a vertical gap');
});

test('page-internal grids live in CSS classes (so 768px media queries can collapse them)', () => {
  for (const cls of ['.hero-grid', '.door-row', '.job-row']) {
    const re = new RegExp(`\\${cls}\\s*\\{`);
    assert.match(css, re, `${cls} must be defined in global.css — inline grid-template-columns cannot be overridden by media queries`);
  }
});

test('sidebar nav rows carry the 3px transparent left border so all four labels share the 20px left edge', () => {
  const m = css.match(/\.side\s+nav\s+a\s*\{[^}]*\}/);
  assert.ok(m, '.side nav a rule not found');
  assert.match(m[0], /border-left\s*:\s*3px\s+solid\s+transparent/, '.side nav a must keep the 3px transparent left border');
  assert.match(m[0], /padding\s*:\s*0\s+17px/, '.side nav a padding-left must be 17px (3 + 17 = 20px, matches the brand)');
});

test('StepSpine dotted connector is visible (dash and gap both readable, not pinprick-sparse)', () => {
  const spine = readFileSync(join(__dirname, '..', 'src', 'components', 'StepSpine.tsx'), 'utf8');
  const m = spine.match(/strokeDasharray\s*=\s*['"`]([^'"`]+)['"`]/);
  assert.ok(m, 'StepSpine connector is missing a strokeDasharray');
  const [dash, gap] = m[1].split(/\s+/).map(Number);
  assert.ok(Number.isFinite(dash) && Number.isFinite(gap), 'strokeDasharray must be two numbers');
  assert.ok(dash >= 2 && gap >= 3, `strokeDasharray "${m[1]}" is too sparse — the dots disappear (dash>=2, gap>=3)`);
});

test('StepSpine connector extends past the outer circles (line meets each number, no gap)', () => {
  const spine = readFileSync(join(__dirname, '..', 'src', 'components', 'StepSpine.tsx'), 'utf8');
  const m = spine.match(/<path[^>]*\bd\s*=\s*['"`]([^'"`]+)['"`]/);
  assert.ok(m, 'StepSpine connector path not found');
  const coords = m[1].match(/M\s*(\d+)\s+\d+\s+H\s*(\d+)/);
  assert.ok(coords, `StepSpine path must be "M x 15 H x" (horizontal at y=15). Got: ${m[1]}`);
  const [start, end] = coords.slice(1, 3).map(Number);
  // In viewBox 0 0 400 30, circles are at 1/6 and 5/6 (66.67, 333.33). The
  // connector must start BEFORE the first circle and end AFTER the last
  // (i.e. < 66 and > 333) so the visible line clearly enters and exits
  // every circle — no gap between the number and the line.
  assert.ok(start < 66, `connector start x=${start} is inside the first circle; line must start before x=66 so it meets the number`);
  assert.ok(end > 333, `connector end x=${end} is inside the last circle; line must end after x=333 so it meets the number`);
});

test('working column: .page > .col is a flex column with a gap (Screen-1 collision guard)', () => {
  const m = css.match(/\.page\s*>\s*\.col\s*\{[^}]*\}/);
  assert.ok(m, '.page > .col rule not found');
  assert.match(m[0], /display\s*:\s*flex/, '.page > .col must be display:flex');
  assert.match(m[0], /flex-direction\s*:\s*column/, '.page > .col must be flex-direction:column');
  assert.match(m[0], /gap\s*:/, '.page > .col must declare a vertical gap');
});

test('.page is centred in .main so wider laptops distribute the slack on both sides', () => {
  const m = css.match(/\.page\s*\{[^}]*\}/);
  assert.ok(m, '.page rule not found');
  assert.match(
    m[0],
    /margin\s*:\s*0\s+auto/,
    '.page must be centred (margin: 0 auto) so on wider laptops the empty space is on both sides of the page, not piled up on the right',
  );
});
