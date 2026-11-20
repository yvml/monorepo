/**
 * Sets the prefix and suffix on the two people who had them written into their role text, and removes that text from
 * the Governance page's roles. Patches only those fields, on the published and draft copies. Safe to re-run.
 *
 * Dry run:  pnpm exec sanity exec scripts/set-name-affixes.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/set-name-affixes.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });

const AFFIXES: Record<string, { prefix?: string; suffix?: string }> = {
  'person-nicole-panter-dailey': { prefix: 'Dr.' },
  'person-stephen-brooks': { suffix: 'JD, LL.M.' },
};

/** Role text before and after, by person. */
const ROLES: Record<string, [string, string]> = {
  'person-nicole-panter-dailey': [
    'Dr., pioneer punk, human rights activist, artist, author, arts educator',
    'pioneer punk, human rights activist, artist, author, arts educator',
  ],
  'person-stephen-brooks': [
    'JD, LL.M., Principal at Pilot Management Resources, LLC',
    'Principal at Pilot Management Resources, LLC',
  ],
};

type Module = { _key: string; _type: string; people?: { _key: string; role?: string; person?: { _ref: string } }[] };

async function main() {
  const tx = client.transaction();
  let changes = 0;

  for (const [id, affix] of Object.entries(AFFIXES)) {
    console.log(`${id}: ${JSON.stringify(affix)}`);
    changes += 1;
    for (const docId of [id, `drafts.${id}`]) {
      if (await client.fetch(`defined(*[_id == $docId][0]._id)`, { docId })) tx.patch(docId, (patch) => patch.set(affix));
    }
  }

  for (const pageId of ['page-about-governance', 'drafts.page-about-governance']) {
    const modules: Module[] | null = await client.fetch(`*[_id == $pageId][0].content`, { pageId });
    if (!modules) continue;
    const set: Record<string, string> = {};
    for (const module of modules) {
      for (const entry of module.people ?? []) {
        const roles = entry.person ? ROLES[entry.person._ref] : undefined;
        if (roles && entry.role === roles[0]) {
          set[`content[_key=="${module._key}"].people[_key=="${entry._key}"].role`] = roles[1];
        }
      }
    }
    if (Object.keys(set).length) {
      console.log(`${pageId}: ${Object.keys(set).length} roles`);
      changes += 1;
      tx.patch(pageId, (patch) => patch.set(set));
    }
  }

  if (!WRITE) return console.log(`\n${changes} patches. Dry run. Pass --write to apply.`);
  await tx.commit();
  console.log('\nDone.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
