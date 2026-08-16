// Tests for internal navigation. The bug we hit twice (Skills lead
// card, and any future "looks like a link but isn't a Link") is a
// bare <a href="/..."> in source. That bypasses the React Router
// basename and lands on GitHub Pages 404. Internal navigation MUST
// go through <Link to> or <NavLink to> from react-router-dom.

import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src');

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

const files = [...walk(join(SRC, 'pages')), ...walk(join(SRC, 'components')), join(SRC, 'App.tsx')];

// Bare <a ... href="/something"> — a single leading slash is an
// internal route. A bare <a> with a relative href won't carry the
// router basename and will 404 on GitHub Pages.
//   <a href="https://example.com">   external — fine
//   <a href="mailto:...">              fine
//   <a href="#section">                fine
//   <a href="/skills/excel">           BUG — use <Link to="/skills/excel">
const BARE_INTERNAL_ANCHOR = /<a\b[^>]*\bhref\s*=\s*(['"`{])\s*\/(?!\/)[^'"`}#]/;

test('no bare <a href="/..."> to internal routes (use <Link to> or <NavLink to>)', () => {
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      const m = line.match(BARE_INTERNAL_ANCHOR);
      if (m) {
        assert.fail(
          `${f}:${i + 1}: bare <a href> to an internal route — use <Link to> (or <NavLink to>) from react-router-dom so the router basename is respected.\n  ${line.trim()}`,
        );
      }
    });
  }
});

test('every page and App.tsx that links internally imports Link or NavLink from react-router-dom', () => {
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    // The regex for bare anchors would have caught any <a href="/...">
    // above, so this is the inverse: any file that uses <Link to> must
    // actually import Link (or NavLink) from react-router-dom.
    const usesLink = /<Link\b/.test(src) || /<NavLink\b/.test(src);
    if (!usesLink) continue;
    assert.match(
      src,
      /from\s+['"]react-router-dom['"]/,
      `${f} uses <Link> or <NavLink> but does not import it from react-router-dom`,
    );
    // The import must name Link or NavLink as an identifier, wherever
    // it sits in the destructure (first, last, or middle).
    const importLine = src.split('\n').find((l) => /from\s+['"]react-router-dom['"]/.test(l));
    assert.ok(
      importLine && /\b(Link|NavLink)\b/.test(importLine),
      `${f} imports from react-router-dom but the import does not name Link or NavLink`,
    );
  }
});
