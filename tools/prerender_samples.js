/* Build-time helper for build.py: renders no-JS font samples with the site's
 * real style code, so the HTML that ships matches what the live tool produces.
 *
 * Input (stdin, JSON): [{ key, scripts: ["fonts-core.js", ...], categories: [...],
 *                         text, max }]
 * Output (stdout, JSON): { key: [{ name, category, sample }] }
 *
 * For each page it loads the same scripts the browser loads, applies the same
 * category filter as apps.js (__applyFilter), and runs styleBase() from apps.js
 * (style.transform(text), or applyMap(text, style.map)). Only deterministic
 * styles are kept: a style is used only if it gives identical output under
 * three different Math.random seeds. The random decoration layer that apps.js
 * adds on top (styleOutput) is deliberately not reproduced.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');

function seeded(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function loadStyles(scripts, seed) {
  const sandboxMath = Object.create(Math);
  sandboxMath.random = seeded(seed);
  // 'localhost' passes the authorized-host gate in fonts-core.js, the same way
  // the live domain does, so remix transforms produce real output here.
  const ctx = { location: { hostname: 'localhost' }, console, Intl, Math: sandboxMath };
  ctx.window = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);
  for (const s of scripts) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, s), 'utf8'), ctx, { filename: s });
  }
  return ctx;
}

function styleBase(ctx, style, text) {
  if (typeof style.transform === 'function') return style.transform(text);
  if (style.map) return ctx.applyMap(text, style.map);
  return text;
}

function render(page) {
  const seeds = [1, 2, 3];
  const runs = seeds.map(seed => {
    const ctx = loadStyles(page.scripts, seed);
    const allowed = page.categories || [];
    const styles = (ctx.window.styles || []).filter(
      s => !allowed.length || !s.category || allowed.indexOf(s.category) !== -1);
    return styles.map(s => {
      try { return { name: s.name, category: s.category || 'Styles', out: styleBase(ctx, s, page.text) }; }
      catch (e) { return { name: s.name, category: s.category || 'Styles', out: null }; }
    });
  });
  const picked = [];
  for (let i = 0; i < runs[0].length && picked.length < page.max; i++) {
    const r = runs[0][i];
    const stable = r.out && r.out !== page.text &&
      runs.every(run => run[i] && run[i].name === r.name && run[i].out === r.out);
    if (stable) picked.push({ name: r.name, category: r.category, sample: r.out });
  }
  return picked;
}

const pages = JSON.parse(fs.readFileSync(0, 'utf8'));
const result = {};
for (const p of pages) result[p.key] = render(p);
process.stdout.write(JSON.stringify(result));
