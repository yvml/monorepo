/**
 * Moves each workshop's `body` into its `content` array as a text module (the workshop schema no longer has `body`),
 * then removes `body`. Existing content modules are kept after the new text module. Safe to re-run.
 *
 * Dry run:  pnpm exec sanity exec scripts/migrate-body-to-content.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/migrate-body-to-content.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });
const key = () => Math.random().toString(36).slice(2, 12);

async function main() {
  const docs: { _id: string; body: unknown[]; content?: unknown[] }[] = await client.fetch(
    `*[_type == "workshop" && defined(body)]{_id, body, content}`
  );
  let tx = client.transaction();
  for (const doc of docs) {
    console.log(`${doc._id}: ${doc.body.length} text variants, ${doc.content?.length ?? 0} existing modules`);
    if (!WRITE) continue;
    tx = tx.patch(doc._id, (patch) =>
      patch
        .set({ content: [{ _key: key(), _type: 'textModule', text: doc.body }, ...(doc.content ?? [])] })
        .unset(['body'])
    );
  }
  if (WRITE && docs.length) await tx.commit();
  console.log(`\n${docs.length} workshops${WRITE ? ' migrated.' : '. Dry run. Pass --write to migrate.'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
