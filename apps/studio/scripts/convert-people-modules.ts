/**
 * Splits People modules that still carry a kicker and a description into separate modules: a Kicker module, a Text
 * module for the description, then the People module holding only the people. Works on published and draft pages.
 * Safe to re-run.
 *
 * Dry run:  pnpm exec sanity exec scripts/convert-people-modules.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/convert-people-modules.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });
const key = () => Math.random().toString(36).slice(2, 12);

type Module = Record<string, unknown> & { _key: string; _type: string; kicker?: string; description?: unknown };

async function main() {
  const docs: { _id: string; content: Module[] }[] = await client.fetch(
    `*[defined(content) && count(content[_type == "peopleModule" && (defined(kicker) || defined(description))]) > 0]{_id, content}`
  );
  const tx = client.transaction();
  for (const doc of docs) {
    const next: Module[] = [];
    for (const module of doc.content) {
      if (module._type !== 'peopleModule' || (!module.kicker && !module.description)) {
        next.push(module);
        continue;
      }
      if (module.kicker) {
        next.push({
          _key: key(),
          _type: 'kickerModule',
          text: [{ _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: module.kicker }],
        });
      }
      if (module.description) next.push({ _key: key(), _type: 'textModule', text: module.description });
      const { kicker: _kicker, description: _description, ...people } = module;
      next.push(people as Module);
    }
    console.log(`${doc._id}: ${doc.content.length} -> ${next.length} modules`);
    if (WRITE) tx.patch(doc._id, (patch) => patch.set({ content: next }));
  }
  if (WRITE && docs.length) await tx.commit();
  console.log(`\n${docs.length} documents${WRITE ? ' converted.' : '. Dry run. Pass --write to convert.'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
