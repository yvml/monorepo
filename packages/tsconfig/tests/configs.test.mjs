import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const configs = readdirSync(root).filter((f) => /^tsconfig\..+\.json$/.test(f));
const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));

test('every config parses as JSON', () => {
  assert.ok(configs.length > 0);
  for (const file of configs) JSON.parse(readFileSync(new URL(file, root), 'utf8'));
});

test('every config is exported by package.json', () => {
  for (const file of configs) assert.ok(pkg.exports[`./${file}`], `${file} is not exported`);
});

test('every export points at an existing config', () => {
  for (const [key, target] of Object.entries(pkg.exports)) {
    assert.ok(configs.includes(String(target).replace('./', '')), `${key} has no file`);
  }
});

test('every extends points at a config in this package', () => {
  for (const file of configs) {
    const { extends: parent } = JSON.parse(readFileSync(new URL(file, root), 'utf8'));
    if (parent) assert.ok(configs.includes(parent.replace('./', '')), `${file} extends missing ${parent}`);
  }
});
