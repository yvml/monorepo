/**
 * Fixes text blocks written with the style `p` (not defined in the schema) by setting them to `normal`, in every
 * document. Safe to re-run.
 *
 * Dry run:  pnpm exec sanity exec scripts/fix-block-styles.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/fix-block-styles.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });

/** The patch paths of every block whose style is `p`. */
function find(node: unknown, path: string, found: string[]) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      const keyed = item as { _key?: string; _type?: string; style?: string };
      const here = `${path}${keyed?._key ? `[_key=="${keyed._key}"]` : `[${index}]`}`;
      if (keyed && typeof keyed === 'object' && keyed._type === 'block' && keyed.style === 'p') found.push(here);
      find(item, here, found);
    });
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.startsWith('_') && key !== '_key') continue;
      find(value, path ? `${path}.${key}` : key, found);
    }
  }
}

async function main() {
  const docs: Record<string, unknown>[] = await client.fetch(
    `*[!(_type match "system.*") && !(_type match "sanity.*") && !(_type match "media.*")]`
  );
  let total = 0;
  let touched = 0;
  let tx = client.transaction();
  let pending = 0;
  for (const doc of docs) {
    const paths: string[] = [];
    find(doc, '', paths);
    if (!paths.length) continue;
    total += paths.length;
    touched += 1;
    console.log(`${doc._id} (${doc._type}): ${paths.length}`);
    if (!WRITE) continue;
    tx = tx.patch(doc._id as string, (patch) => patch.set(Object.fromEntries(paths.map((path) => [`${path}.style`, 'normal']))));
    pending += 1;
    if (pending >= 20) {
      await tx.commit();
      tx = client.transaction();
      pending = 0;
    }
  }
  if (WRITE && pending) await tx.commit();
  console.log(`\n${total} blocks in ${touched} documents${WRITE ? ' fixed.' : '. Dry run. Pass --write to fix.'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
