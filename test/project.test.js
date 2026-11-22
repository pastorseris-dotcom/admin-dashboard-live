const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

test('project entry files exist and are linked', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  assert.match(html, /<link rel="stylesheet" href="style\.css">/);
  assert.match(html, /<script src="app\.js"><\/script>/);
  assert.ok(fs.existsSync(path.join(root, 'style.css')));
  assert.ok(fs.existsSync(path.join(root, 'app.js')));
});

test('HTML element IDs referenced by JavaScript exist', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const htmlIds = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]));
  const referencedIds = [...js.matchAll(/getElementById\(["']([^"']+)["']\)/g)].map(match => match[1]);
  const missingIds = [...new Set(referencedIds)].filter(id => !htmlIds.has(id));

  assert.deepEqual(missingIds, []);
});

test('URL validation rejects unsafe protocols', () => {
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(js, /url\.protocol === 'http:'/);
  assert.match(js, /url\.protocol === 'https:'/);
});
