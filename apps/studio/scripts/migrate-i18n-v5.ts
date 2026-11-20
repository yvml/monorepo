/**
 * Migrates internationalized-array values from the v4 format (language in `_key`) to v5 (language in `language`).
 * Walks every document, finds items of an `internationalizedArray*Value` type that have no `language`, and sets it
 * from `_key`. Nothing else is changed. Safe to re-run.
 *
 * Dry run:  pnpm exec sanity exec scripts/migrate-i18n-v5.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/migrate-i18n-v5.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });

type Node = unknown;

/** The paths (as patch selectors) of every v4 item inside a document. */
function findV4(node: Node, path: string, found: string[]) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      const item_ = item as { _key?: string; _type?: string; language?: string };
      const segment = item_?._key ? `[_key=="${item_._key}"]` : `[${index}]`;
      const here = `${path}${segment}`;
      if (
        item_ &&
        typeof item_ === 'object' &&
        typeof item_._type === 'string' &&
        item_._type.startsWith('internationalizedArray') &&
        item_._type.endsWith('Value') &&
        !item_.language &&
        item_._key
      ) {
        found.push(here);
      }
      findV4(item, here, found);
    });
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.startsWith('_') && key !== '_key') continue;
      findV4(value, path ? `${path}.${key}` : key, found);
    }
  }
}

async function main() {
  const docs: Record<string, unknown>[] = await client.fetch(
    `*[!(_type match "system.*") && !(_type match "sanity.*") && !(_type match "media.*")]`
  );
  let total = 0;
  let patched = 0;
  let tx = client.transaction();
  let pending = 0;

  for (const doc of docs) {
    const paths: string[] = [];
    findV4(doc, '', paths);
    if (!paths.length) continue;
    total += paths.length;
    patched += 1;
    console.log(`${doc._id} (${doc._type}): ${paths.length}`);
    if (!WRITE) continue;
    const set: Record<string, string> = {};
    for (const path of paths) {
      const key = path.match(/\[_key=="([^"]+)"\]$/)?.[1];
      if (key) set[`${path}.language`] = key;
    }
    tx = tx.patch(doc._id as string, (p) => p.set(set));
    pending += 1;
    if (pending >= 25) {
      await tx.commit();
      tx = client.transaction();
      pending = 0;
    }
  }
  if (WRITE && pending) await tx.commit();
  console.log(`\n${total} items in ${patched} documents${WRITE ? ' migrated.' : '. Dry run. Pass --write to migrate.'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
