/**
 * Migrates the workshops from yuccavalleymaterial.org/workshop-reg into the dataset: taxonomy terms (workshop types
 * and materials), instructors (people) and workshops. `workshops-raw.json` holds the text parsed from the page; the
 * tables below add what the page only implies (dates as data, types, materials).
 *
 * Dry run:  pnpm exec sanity exec scripts/migrate-workshops.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/migrate-workshops.ts --with-user-token -- --write
 *
 * Every document has a fixed id and is created only if missing, so the script can be re-run and never overwrites
 * edits made in the studio.
 */
import { readFileSync } from 'node:fs';
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });

type Raw = {
  index: number;
  image: string;
  heading: string[];
  instructorName: string;
  instructorUrl: string | null;
  description: string[];
  price: number;
  soldOut: boolean;
  scholarship: boolean;
  keelaUrl: string | null;
};
const raw: Raw[] = JSON.parse(readFileSync(new URL('./workshops-raw.json', import.meta.url), 'utf8'));

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const key = () => Math.random().toString(36).slice(2, 12);
const localized = (type: string, value: unknown) => [{ _key: 'en', _type: type, value }];
const text = (value: string) => localized('internationalizedArrayStringValue', value);
const slugs = (value: string) => [{ _key: 'en', language: 'en', value: { _type: 'slug', current: value } }];
const body = (paragraphs: string[]) =>
  localized(
    'internationalizedArrayPortableTextBodyValue',
    paragraphs.map((paragraph) => ({
      _key: key(),
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _key: key(), _type: 'span', text: paragraph, marks: [] }],
    }))
  );
const ref = (id: string) => ({ _key: key(), _type: 'reference', _ref: id });

/* ---------- Taxonomy ---------- */

const WORKSHOP_TYPES = [
  'Professional development',
  'Fiber arts',
  'Metalwork',
  'Metal casting',
  'Glass',
  'Printmaking',
  'Leatherwork',
  'Ceramics',
  'Sculpture',
  'Earth building',
  'Stone carving',
  'Landscape & ecology',
];

const MATERIALS = [
  'Steel',
  'Aluminum',
  'Bronze',
  'Glass',
  'Wax',
  'Silicone',
  'Alginate',
  'Ceramic shell',
  'Fabric',
  'Leather',
  'Wild clay',
  'Plaster',
  'PETG plates',
  'Etching ink',
  'Hog casing',
  'Natural dye',
  'Paper',
  'Adobe',
  'Alabaster',
  'Native plants',
  'Waxed linen',
  'Reed',
  'Foundry sand',
];

const typeId = (name: string) => `workshopType-${slugify(name)}`;
const materialId = (name: string) => `material-${slugify(name)}`;

/* ---------- Per-workshop data the page only implies, in page order ---------- */

type Entry = { date: string; endDate?: string; startTime?: string; endTime?: string; allDay?: boolean; description?: string };
type Meta = {
  entries: Entry[];
  isRange?: boolean;
  format?: 'inPerson' | 'virtual' | 'hybrid';
  types: string[];
  materials: string[];
  slugSuffix?: string;
};

const day = (date: string, startTime: string, endTime: string): Entry => ({ date, startTime, endTime });
const span = (date: string, endDate: string, startTime = '09:00', endTime = '16:00'): Meta['entries'] => [
  { date, endDate, startTime, endTime },
];
const glass = (d1: string, d2: string, d3: string): Meta => ({
  entries: [day(d1, '09:00', '16:00'), day(d2, '08:00', '12:00'), day(d3, '14:00', '17:00')],
  types: ['Glass'],
  materials: ['Glass', 'Wax', 'Silicone', 'Alginate'],
});
const welding: Pick<Meta, 'types' | 'materials'> = { types: ['Metalwork'], materials: ['Steel'] };
const foundry: Pick<Meta, 'types' | 'materials'> = {
  types: ['Metal casting'],
  materials: ['Bronze', 'Aluminum', 'Wax', 'Ceramic shell'],
};
const sandCasting: Pick<Meta, 'types' | 'materials'> = {
  types: ['Metal casting'],
  materials: ['Aluminum', 'Foundry sand'],
};
const plants: Pick<Meta, 'types' | 'materials'> = { types: ['Landscape & ecology'], materials: ['Native plants'] };
const sewing: Pick<Meta, 'types' | 'materials'> = { types: ['Fiber arts'], materials: ['Fabric'] };

const META: Meta[] = [
  /* 1 */ {
    entries: [
      day('2026-11-14', '09:00', '16:00'),
      { date: '2026-11-21', description: '1-on-1 45 min session' },
    ],
    types: ['Professional development'],
    materials: [],
  },
  /* 2 */ { entries: span('2026-11-21', '2026-11-22'), isRange: true, ...sewing, materials: ['Fabric'] },
  /* 3 */ { entries: span('2026-12-05', '2026-12-06'), isRange: true, ...welding },
  /* 4 */ glass('2026-12-11', '2026-12-12', '2026-12-13'),
  /* 5 */ { entries: span('2027-01-15', '2027-01-19'), isRange: true, ...foundry },
  /* 6 */ {
    entries: [day('2027-01-16', '09:00', '12:00')],
    format: 'virtual',
    types: ['Professional development'],
    materials: [],
  },
  /* 7 */ { entries: span('2027-01-21', '2027-01-25'), isRange: true, ...foundry },
  /* 8 */ {
    entries: [
      { date: '2027-01-16', startTime: '09:00', endTime: '14:30', description: 'In person at Sunflower Residence' },
      { date: '2027-01-23', description: 'Virtual Grant Lab, 45 min session' },
    ],
    format: 'hybrid',
    types: ['Professional development'],
    materials: [],
  },
  /* 9 */ { entries: span('2027-01-30', '2027-01-31'), isRange: true, types: ['Leatherwork'], materials: ['Leather'] },
  /* 10 */ {
    entries: span('2027-02-06', '2027-02-07'),
    isRange: true,
    types: ['Printmaking'],
    materials: ['PETG plates', 'Etching ink', 'Plaster'],
  },
  /* 11 */ glass('2027-02-19', '2027-02-20', '2027-02-21'),
  /* 12 */ { entries: span('2027-02-27', '2027-02-28'), isRange: true, types: ['Professional development'], materials: [] },
  /* 13 */ { entries: span('2027-03-05', '2027-03-07'), isRange: true, ...welding },
  /* 14 */ { entries: span('2027-03-13', '2027-03-14'), isRange: true, ...sewing },
  /* 15 */ { entries: span('2027-03-18', '2027-03-21'), isRange: true, ...sewing },
  /* 16 */ { entries: span('2027-03-19', '2027-03-21'), isRange: true, types: ['Ceramics'], materials: ['Wild clay'] },
  /* 17 */ { entries: span('2027-04-03', '2027-04-04'), isRange: true, ...welding },
  /* 18 */ {
    entries: [day('2027-04-09', '09:00', '16:00')],
    types: ['Metalwork', 'Sculpture'],
    materials: ['Steel'],
  },
  /* 19 */ {
    entries: span('2027-04-10', '2027-04-12'),
    isRange: true,
    types: ['Sculpture'],
    materials: ['Steel', 'Hog casing', 'Natural dye', 'Paper'],
  },
  /* 20 */ glass('2027-04-23', '2027-04-24', '2027-04-25'),
  /* 21 */ { entries: span('2027-04-28', '2027-05-02'), isRange: true, types: ['Earth building'], materials: ['Adobe'] },
  /* 22 */ {
    // The page heading says 2026; the scholarship list on the same page says 2027.
    entries: span('2027-05-07', '2027-05-09'),
    isRange: true,
    types: ['Stone carving', 'Sculpture'],
    materials: ['Alabaster'],
  },
  /* 23 */ { entries: [day('2027-05-08', '09:00', '13:00')], ...plants },
  /* 24 */ {
    entries: span('2027-05-13', '2027-05-16'),
    isRange: true,
    types: ['Fiber arts'],
    materials: ['Waxed linen', 'Reed'],
  },
  /* 25 */ { entries: [day('2027-05-15', '09:00', '13:00')], ...plants },
  /* 26 */ { entries: span('2027-05-21', '2027-05-23'), isRange: true, ...sandCasting },
  /* 27 */ { entries: span('2027-05-25', '2027-05-27'), isRange: true, ...sandCasting },
];

/* ---------- Titles and slugs ---------- */

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const titleOf = (heading: string[]) =>
  heading[0]
    .replace(new RegExp(`[:,]?\\s*(${MONTHS})\\b.*$`), '')
    .replace(/[:,]\s*$/, '')
    .trim();
const monthDayOf = (entries: Entry[]) => {
  const date = new Date(`${entries[0].date}T00:00:00`);
  return `${date.toLocaleString('en-US', { month: 'long' }).toLowerCase()}-${date.getDate()}`;
};

const titles = raw.map((r) => titleOf(r.heading));
const workshopSlug = (i: number) => {
  const base = slugify(titles[i]);
  const duplicates = titles.filter((t) => slugify(t) === base).length > 1;
  return duplicates ? `${base}-${monthDayOf(META[i].entries)}` : base;
};

/* ---------- Instructors ---------- */

const NAME_PARTS: Record<string, { given: string; middle?: string; family: string }> = {
  'Kristen Jean Wheatley': { given: 'Kristen', middle: 'Jean', family: 'Wheatley' },
  'Danielle Giudici Wallis': { given: 'Danielle', family: 'Giudici Wallis' },
  'Joanna Keane Lopez': { given: 'Joanna', family: 'Keane Lopez' },
};
const nameParts = (name: string) => {
  if (NAME_PARTS[name]) return NAME_PARTS[name];
  const [given, ...rest] = name.split(' ');
  return { given, family: rest.join(' ') };
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z]/g, '');

/* ---------- Run ---------- */

async function main() {
  const existingPeople: { _id: string; title?: string; nameGiven?: string; middleGiven?: string; familyName?: string }[] =
    await client.fetch(`*[_type == "person" && !(_id in path("drafts.**"))]{_id, title, nameGiven, middleGiven, familyName}`);
  const personIdByName = new Map<string, string>();
  for (const p of existingPeople) {
    const full = [p.nameGiven, p.middleGiven, p.familyName].filter(Boolean).join(' ') || p.title || '';
    personIdByName.set(normalize(full), p._id);
    if (p.nameGiven && p.familyName) personIdByName.set(normalize(`${p.nameGiven} ${p.familyName}`), p._id);
  }

  const docs: Record<string, unknown>[] = [];
  const log: string[] = [];

  for (const name of WORKSHOP_TYPES)
    docs.push({ _id: typeId(name), _type: 'workshopType', title: text(name), slug: slugs(slugify(name)) });
  for (const name of MATERIALS)
    docs.push({ _id: materialId(name), _type: 'material', title: text(name), slug: slugs(slugify(name)) });

  const instructors = new Map<string, { name: string; url: string | null }>();
  for (const r of raw) instructors.set(r.instructorName, { name: r.instructorName, url: r.instructorUrl });
  const instructorId = new Map<string, string>();
  for (const { name, url } of instructors.values()) {
    const found = personIdByName.get(normalize(name));
    if (found) {
      instructorId.set(name, found.replace(/^drafts\./, ''));
      log.push(`person exists: ${name} (${found})`);
      continue;
    }
    const parts = nameParts(name);
    const id = `person-${slugify(name)}`;
    instructorId.set(name, id);
    log.push(`person new:    ${name} (${id})`);
    docs.push({
      _id: id,
      _type: 'person',
      title: name,
      slug: { _type: 'slug', current: slugify(name) },
      nameGiven: parts.given,
      ...(parts.middle ? { middleGiven: parts.middle } : {}),
      familyName: parts.family,
      ...(url
        ? {
            links: [
              {
                _key: key(),
                _type: 'personLink',
                label: url.includes('instagram.com') ? 'Instagram' : 'Website',
                url,
              },
            ],
          }
        : {}),
    });
  }

  const imageCache = new Map<string, string>();
  const uploadImage = async (url: string, filename: string) => {
    if (imageCache.has(url)) return imageCache.get(url)!;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Image ${url}: ${response.status}`);
    const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), { filename });
    imageCache.set(url, asset._id);
    return asset._id;
  };

  const existingIds = new Set<string>(await client.fetch(`*[_type == "workshop"]._id`));

  for (let i = 0; i < raw.length; i += 1) {
    const r = raw[i];
    const meta = META[i];
    const slug = workshopSlug(i);
    const id = `workshop-${slug}`;
    log.push(`workshop ${String(i + 1).padStart(2)}: ${titles[i]} -> ${slug}`);

    let image: Record<string, unknown> | undefined;
    if (WRITE && !existingIds.has(id)) {
      const assetId = await uploadImage(r.image, `${slug}.${r.image.split('.').pop()?.split('?')[0] ?? 'jpg'}`);
      image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
        decorative: false,
        alt: text(titles[i]),
      };
    }

    docs.push({
      _id: id,
      _type: 'workshop',
      title: text(titles[i]),
      slug: slugs(slug),
      dateTime: {
        _type: 'flexibleDate',
        isRange: Boolean(meta.isRange),
        entries: meta.entries.map((entry) => ({ _key: key(), ...entry })),
      },
      format: meta.format ?? 'inPerson',
      instructors: [ref(instructorId.get(r.instructorName)!)],
      workshopTypes: meta.types.map((t) => ref(typeId(t))),
      materials: meta.materials.map((m) => ref(materialId(m))),
      price: r.price,
      status: r.soldOut ? 'soldOut' : 'open',
      scholarshipAvailable: r.scholarship,
      ...(image ? { image } : {}),
      body: body(r.description),
      ...(r.keelaUrl ? { keelaUrl: r.keelaUrl } : {}),
    });
  }

  console.log(log.join('\n'));
  console.log(`\n${docs.length} documents (${WORKSHOP_TYPES.length} types, ${MATERIALS.length} materials, ${instructors.size} instructors, ${raw.length} workshops)`);
  if (!WRITE) {
    console.log('Dry run. Pass --write to create them.');
    return;
  }
  let tx = client.transaction();
  let count = 0;
  for (const doc of docs) {
    tx = tx.createIfNotExists(doc as never);
    count += 1;
    if (count % 40 === 0) {
      await tx.commit();
      tx = client.transaction();
    }
  }
  await tx.commit();
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
