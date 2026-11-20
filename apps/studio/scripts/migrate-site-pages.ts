/**
 * Builds the About YVML and Support Us page trees from the text of yuccavalleymaterial.org, plus the people they list.
 * People are created as `person` documents; the Staff and Governance pages hold them in People modules.
 *
 * Pages are written with `createOrReplace`, so a re-run resets them to this content. Dry run by default.
 *
 * Dry run:  pnpm exec sanity exec scripts/migrate-site-pages.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/migrate-site-pages.ts --with-user-token -- --write
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });
const SQ = 'https://images.squarespace-cdn.com/content/v1/5d695fe1f8d59d0001fd6c8a/';

type Link = { label: string; url: string };
type Person = {
  given: string;
  middle?: string;
  family: string;
  links?: Link[];
  bio?: string[];
};
type Entry = readonly [string, string];
type People = { kicker: string; description?: string; entries: Entry[] };
type Item = readonly ['h2' | 'h3' | 'p' | 'li' | 'quote' | 'img', string] | readonly ['people', People];
type PageSpec = { slug: string; title: string; items: Item[] };

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
const name = (p: Person) => [p.given, p.middle, p.family].filter(Boolean).join(' ');
const personId = (p: Person) => `person-${slugify(name(p))}`;

/* ---------- People ---------- */

const P = {
  heidi: { given: 'Heidi', family: 'Schwegler', bio: [
    'Having taught at Oregon College of Art for nearly 20 years, and as the former Chair of MFA in Applied Craft + Design (PNCA/OCAC, 2015–18), her professional aspirations have always resided in blending a career that includes a studio practice as an artist and a pedagogical practice as a teacher and administrator. Now based in Yucca Valley, CA she is driven to provide an educational platform for art that is financially accessible and in turn, supports its community. The quonset hut facility and surrounding compound have been designed to allow for material and process exploration free of intended outcomes. Releasing one’s creative practice from preconceived ideas can inspire unimaginable thought and form. Material curiosity, craftsmanship and provocative content have always been the force behind Schwegler’s studio and teaching practice, all of which now play a part at Yucca Valley Material Lab.',
  ] },
  derek: { given: 'Derek', family: 'Monypeny', links: [{ label: 'Bandcamp', url: 'https://derekmonypeny.bandcamp.com' }], bio: [
    'Born in the Arizona desert, a veteran of multiple explorations into the Sahara desert via Morocco and Western Sahara, and now a resident of the Mojave, Derek Monypeny sees his musical mission as adding to and expanding on what he calls the “desert continuum;” the psychedelic sirocco swirl of desert-based stringed instruments played with utter abandon by musicians the world over.',
    'Derek is a former member of the bands Oaxacan (Oakland, CA), ALTO! (Portland, OR), and Sir Richard Bishop’s Freak Of Araby Ensemble. In addition to his solo work, he has an ongoing duo project with Bryan Hillebrandt, OAE (Oakland Afternoon Ensemble). He has performed and toured with artists such as Bill Orcutt, Jozef van Wissem, Eva Aguila/Kevin Shields, Arrington de Dionyso, and many others.',
  ] },
  kristen: { given: 'Kristen', middle: 'Jean', family: 'Wheatley' },
  kenneth: { given: 'Kenneth', family: 'Knothe', links: [{ label: 'Email', url: 'mailto:kenneth@yvml.org' }] },
  jon: { given: 'Jon', family: 'Nielsen', links: [{ label: 'Email', url: 'mailto:jon@yvml.org' }] },
  dudich: { given: 'Michael', family: 'Dudich' },
  kahlden: { given: 'Lisa', family: 'Kahlden', links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/lkahlden/' }] },
  cicero: { given: 'Michel', family: 'Cicero', links: [{ label: 'Website', url: 'https://www.realtor.com/realestateagents/5c69d5737e2bce0012e30245' }] },
  bawa: { given: 'Avantika', family: 'Bawa', links: [{ label: 'Website', url: 'https://www.avantikabawa.net/' }] },
  camargo: { given: 'Christian', family: 'Camargo', links: [{ label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Christian_Camargo' }] },
  vollum: { given: 'Dorie', family: 'Vollum' },
  ben: { given: 'Shaliyah', family: 'Ben', links: [{ label: 'Website', url: 'https://idyllwildarts.org/people/shaliyah-ben/' }] },
  brooks: { given: 'Stephen', family: 'Brooks', links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/stephen-brooks-68a12319/' }] },
  burnett: { given: 'Sandi', family: 'Burnett', links: [{ label: 'Instagram', url: 'https://www.instagram.com/sandibrearts/' }] },
  holland: { given: 'Brian', family: 'Holland' },
  isbara: { given: 'Jiseon', middle: 'Lee', family: 'Isbara', links: [{ label: 'Website', url: 'https://www.saic.edu/leadership-governance/office-president' }] },
  ogasian: { given: 'Aly', family: 'Ogasian', links: [{ label: 'Website', url: 'https://alysonogasian.com/about' }] },
  panter: { given: 'Nicole', middle: 'Panter', family: 'Dailey' },
  schiffhauer: { given: 'Jane', family: 'Schiffhauer', links: [{ label: 'Website', url: 'https://www.janeschiffhauer.com/' }] },
  silverman: { given: 'Joy', family: 'Silverman' },
  slater: { given: 'Andy', family: 'Slater', links: [{ label: 'Website', url: 'https://www.thisisandyslater.net/bio/' }] },
  tolentino: { given: 'Julie', family: 'Tolentino', links: [{ label: 'Website', url: 'https://julietolentino.com/' }] },
  zankowicz: { given: 'Kate', family: 'Zankowicz', links: [{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/kate-zankowicz-5388b2b6/' }] },
} satisfies Record<string, Person>;

const who = (p: Person, role: string): Entry => [personId(p), role];

/* ---------- Pages ---------- */

const PAGES: PageSpec[] = [
  {
    slug: 'about',
    title: 'About YVML',
    items: [
      ['p', 'Yucca Valley Material Lab (YVML) champions a decentralized, inclusive, and affordable model for art education grounded in direct material exploration.'],
      ['p', 'Located in the rural high desert community of the Morongo Basin, YVML offers a diverse range of core programs and services, including artist and musician residencies, workshops and public events.'],
      ['p', 'The Residency Program provides lodging, 24 hour studio access and personalized instruction on a chosen material, alongside numerous community engagement opportunities.'],
      ['p', 'The Workshop Program provides fee-based, artist-led classes in materials such as glass, metal, fiber, wood, neon, and experimental sound.'],
      ['p', 'Lazy Eye Gallery is a 64 sq. ft. micro gallery housed in a former water tower. Dedicated to experimental and contemporary art, the gallery provides a platform for multimedia installations, sound art, and performance.'],
      ['p', 'YVML is home to The Living Library, which was constructed from the remains of the Oregon College of Art and Craft’s book collection after it closed in 2019, and generous donations from Radius Books, Santa Fe.'],
      ['p', 'Yucca Alta, YVML’s record label and recording studio for local and visiting musicians, emphasizes the contributions of Black, Indigenous, and artists of color within its musician-in-residence program, and posts recordings of live performances on its [YouTube channel](https://www.youtube.com/@YuccaValleyMaterial). Albums released by Yucca Alta can be found on [Bandcamp](https://yuccaaltarecords.bandcamp.com/).'],
      ['p', 'Overall, YVML adopts an anti-ableist approach, challenging the dominant hierarchies of ability that often marginalize disabled voices while celebrating diverse learning styles and creative outcomes.'],
      ['p', 'Join our mailing list or follow us on Instagram for announcements on the public events calendar.'],
    ],
  },
  {
    slug: 'about/history',
    title: 'History',
    items: [
      ['p', 'Yucca Valley Material Lab was founded in 2019 by Heidi Schwegler, who taught at Oregon College of Art for nearly 20 years.'],
      ['p', 'YVML is home to The Living Library, built from the remains of the Oregon College of Art and Craft’s book collection after the college closed in 2019, and from generous donations from Radius Books, Santa Fe.'],
      ['p', 'Since 2019, more than 1000 students have taken workshops at YVML. The lab has fully funded 60+ artist, musician and writer residencies, awarded 49 scholarships, and continued to offer free public programs to the community.'],
      ['p', 'In 2024, YVML was given a 2.5-acre property, making a permanent home for the organization possible.'],
    ],
  },
  {
    slug: 'about/press',
    title: 'Press',
    items: [
      ['li', '[“A Hands-On Haven”, Coachella Valley Independent](https://cvindependent.com/2024/12/a-hands-on-haven-the-yucca-valley-material-lab-serves-as-a-new-model-for-art-education-in-the-high-desert-and-beyond/)'],
      ['li', '[“Creative Hub in the Desert”, LA Times](https://www.latimes.com/lifestyle/story/2024-05-28/yucca-valley-material-lab-draws-artists-to-high-desert)'],
    ],
  },
  {
    slug: 'about/staff',
    title: 'Staff',
    items: [
      ['people', {
        kicker: 'Staff',
        entries: [
          who(P.heidi, 'Founding Director'),
          who(P.derek, 'Director of Music Program'),
          who(P.kristen, 'Program Coordinator'),
          who(P.kenneth, 'Philanthropy Officer'),
          who(P.jon, 'Maintenance Technician'),
        ],
      }],
    ],
  },
  {
    slug: 'about/governance',
    title: 'Governance',
    items: [
      ['people', {
        kicker: 'Board of Directors',
        entries: [
          who(P.dudich, 'President (Art Museum Executive Director (retired), based in Palm Springs, CA)'),
          who(P.kahlden, 'Treasurer (President, Anthology of Recorded Music, NY)'),
          who(P.cicero, 'Secretary (realtor based in Yucca Valley, CA)'),
          who(P.bawa, 'Member (artist, curator, and educator based in Portland, OR)'),
          who(P.camargo, 'Member (actor, director, producer, and writer)'),
          who(P.vollum, 'Member (based in Portland, OR and Palm Springs, CA)'),
        ],
      }],
      ['people', {
        kicker: 'Advisory Board',
        entries: [
          who(P.ben, 'Director, Native American Art Center, Idyllwild Arts'),
          who(P.brooks, 'JD, LL.M., Principal at Pilot Management Resources, LLC'),
          who(P.burnett, 'artist, disability advocate'),
          who(P.holland, 'local nonprofit advisor'),
          who(P.isbara, 'President, School of the Art Institute Chicago'),
          who(P.ogasian, 'artist, Assistant Professor of Art, Scripps'),
          who(P.panter, 'Dr., pioneer punk, human rights activist, artist, author, arts educator'),
          who(P.schiffhauer, 'artist'),
          who(P.silverman, 'former executive director of Los Angeles Contemporary Exhibitions'),
          who(P.slater, 'blind sound artist, musician, and disability advocate'),
          who(P.tolentino, 'artist'),
          who(P.zankowicz, 'Director of Education, Craft Contemporary Museum, disability justice advocate'),
        ],
      }],
    ],
  },
  {
    slug: 'about/contact',
    title: 'Contact Us',
    items: [
      ['p', 'Contact us for more information at [info@yvml.org](mailto:info@yvml.org).'],
      ['p', 'Mailing address: 57275 Canterbury Street, Yucca Valley, CA 92284.'],
      ['p', 'Join our mailing list or follow us on Instagram for announcements on the public events calendar.'],
    ],
  },
  {
    slug: 'support',
    title: 'Support Us',
    items: [
      ['h2', 'Donate today'],
      ['p', 'Giving isn’t passive. It’s creative power — choosing what matters and helping it grow.'],
      ['p', 'Yucca Valley Material Lab is an artist-run nonprofit in the Mojave Desert. We fund residencies for artists who don’t have institutional backing, teach specialized making techniques that have been cut from most art schools, and host free public events in a rural community lacking in cultural opportunities. We are small by design, putting our resources directly into artists, teaching, and public access.'],
      ['p', 'Your gift gives us the ability to say yes. Yes to another student. Another artist. Another idea worth trying.'],
      ['p', 'Yucca Valley Material Lab is a 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law.'],
      ['h2', 'Why support'],
      ['quote', 'We live part time in the High Desert and feel deeply invested in the creative community of this region. Supporting YVML feels very tangible: we can see the young people being introduced to making, artists developing their practices, and a creative community growing around this place. For us, giving to YVML is an investment in the community we’re part of. — Julie Beeler, YVML donor'],
      ['quote', 'What initially drew me to support YVML is its unique ability to combine arts education with community outreach, fostering meaningful conversations about how art can broaden our understanding of the world, both near and far. I am proud to join in the work of amplifying the continued sound of building and creating, all of which resonates throughout the Morongo Basin. — Mark Palmen, YVML donor'],
      ['h2', 'Support without giving money'],
      ['li', 'Come to something. Show up. Bring a friend. A strong audience helps us keep free public programs free. [Events](/events)'],
      ['li', 'Take a workshop. Your tuition supports our teaching artists and helps make scholarship seats possible for others. [Workshops](/workshops)'],
      ['li', 'Tell one person. Most of our students found us because someone in the Basin mentioned us.'],
      ['li', 'Buy something. Purchases from the shop and Yucca Alta Records go directly back into YVML programs.'],
      ['h2', 'Talk to a person'],
      ['p', 'Kenneth Knothe, Philanthropy Officer. [support@yvml.org](mailto:support@yvml.org) | (760) 209-6368'],
      ['p', 'Have an idea, a question, or another way you’d like to be involved? Get in touch. There’s a real person on the other end.'],
      ['img', `${SQ}f28b2792-73c8-4aa5-8cfd-11ae6b1ef2fc/pink_quonset+copy.jpeg`],
    ],
  },
  {
    slug: 'support/donate',
    title: 'Donate',
    items: [
      ['h2', 'What your gift does'],
      ['li', '$50: covers the materials for one student in a weekend workshop'],
      ['li', '$400: provides a full workshop scholarship, making sure cost doesn’t keep someone from participating'],
      ['li', '$2,000: supports one week of an artist residency, including housing, instruction, daily stipend and studio access'],
      ['li', '$5,000: supports a season of free public programming, including artist fees, travel and production costs'],
      ['li', '$10/month: keeps the studios supplied with the everyday essentials that make hands-on work possible: gloves, masks, mixing containers, abrasives, and other frequently used materials'],
      ['p', 'Your gift goes to YVML’s annual fund, allowing us to put it where it’s needed most – often scholarships, artist support, and programming. If you’d like your gift to support a specific program or the Campaign for Creative Access, just let us know and we’ll honor your request.'],
      ['img', `${SQ}1616794441650-3UYINGKA13T9LFN4HGOH/qhut+angled+interior.jpg`],
      ['h2', 'Give monthly'],
      ['p', 'A recurring gift of any size gives us something especially valuable: the ability to plan ahead. It means we can commit to a scholarship and fund an artist residency months in advance, or say yes to a program knowing the support will be there.'],
      ['p', 'Change or cancel your gift anytime.'],
      ['h2', 'Where it goes'],
      ['p', 'In 2025, for every dollar we spent:'],
      ['li', '$0.64 went directly to programs: residencies, scholarships, workshops, public events'],
      ['li', '$0.13 to the facility that makes those programs possible'],
      ['li', '$0.23 to administration and fundraising'],
      ['p', '[Candid profile](https://app.candid.org/profile/14419418/yucca-valley-material-lab-incorporated-83-3715029/)'],
    ],
  },
  {
    slug: 'support/planned-giving',
    title: 'Planned Giving',
    items: [
      ['h3', 'Bequests and beneficiary designations'],
      ['p', 'You can include YVML in your will, trust, or as a beneficiary of a retirement account. We’re happy to provide suggested language, and if you choose to let us know about your plans, we’d be honored to thank you. [Email us](mailto:support@yvml.org).'],
      ['h3', 'IRA qualified charitable distributions'],
      ['p', 'If you’re 70 years and six months or older, you can make a tax-free charitable gift directly from your IRA to YVML. Ask your IRA administrator to include your name with the transfer so we know the gift came from you. [Email us](mailto:support@yvml.org).'],
      ['h3', 'Stocks and appreciated securities'],
      ['p', 'Interested in making a gift of stock or appreciated securities? [Email us](mailto:support@yvml.org) for transfer instructions and brokerage details.'],
    ],
  },
  {
    slug: 'support/corporate-sponsorship',
    title: 'Corporate Sponsorship',
    items: [
      ['h3', 'Employer matching gifts'],
      ['p', 'Your employer may match your donation to YVML. Check your workplace giving portal for Yucca Valley Material Lab or search using our EIN: 83-3715029.'],
      ['p', 'To talk about a corporate sponsorship, contact Kenneth Knothe, Philanthropy Officer, at [support@yvml.org](mailto:support@yvml.org) or (760) 209-6368.'],
    ],
  },
  {
    slug: 'support/foundation-support',
    title: 'Foundation Support',
    items: [
      ['h3', 'Donor-advised funds'],
      ['p', 'Recommend a grant to YVML using our legal name, Yucca Valley Material Lab, Incorporated, and EIN 83-3715029. If your sponsor requires additional documentation, [email us](mailto:support@yvml.org) and we’ll send it the same week.'],
      ['p', 'To talk about foundation support, contact Kenneth Knothe, Philanthropy Officer, at [support@yvml.org](mailto:support@yvml.org) or (760) 209-6368.'],
    ],
  },
  {
    slug: 'support/government-partners',
    title: 'Government Partners',
    items: [
      ['p', 'YVML partners with the Morongo Unified School District through California Proposition 28 to expand access to arts education for local youth.'],
      ['p', 'To talk about a partnership, contact Kenneth Knothe, Philanthropy Officer, at [support@yvml.org](mailto:support@yvml.org) or (760) 209-6368.'],
    ],
  },
  {
    slug: 'support/information-for-donors',
    title: 'Information for Donors',
    items: [
      ['h2', 'Organization details'],
      ['p', 'Legal name: Yucca Valley Material Lab, Incorporated. EIN: 83-3715029. Mailing address: 57275 Canterbury Street, Yucca Valley, CA 92284. Contact: Kenneth Knothe, Philanthropy Officer — [support@yvml.org](mailto:support@yvml.org)'],
      ['p', 'Yucca Valley Material Lab is a 501(c)(3) nonprofit organization, established in 2019. Contributions are tax-deductible to the extent permitted by law.'],
      ['p', 'You can independently verify our nonprofit status through the [IRS Tax Exempt Organization Search](https://apps.irs.gov/app/eos/) or our [Candid profile](https://app.candid.org/profile/14419418/yucca-valley-material-lab-incorporated-83-3715029/).'],
      ['h2', 'Vehicles'],
      ['p', 'Donate a car, truck, RV, or trailer. Our partner CARS handles the pickup, title transfer, and paperwork.'],
      ['img', `${SQ}e252426f-7d52-46a1-8f37-8fb7d4fca772/_O7A8572.JPG`],
      ['h2', 'In-kind'],
      ['p', 'Good tools and materials should be used. We put donated equipment and supplies directly into the hands of artists, residents, and students.'],
      ['p', 'Before bringing anything by, email a photo to [support@yvml.org](mailto:support@yvml.org) so we can make sure it’s a good fit.'],
      ['h3', 'Wishlist'],
      ['li', '[Cyclone Sandblaster](https://www.hisglassworks.com/cyclone-4826-top-and-side-opening-sandblaster.html)'],
      ['li', '[Ingersoll Compressor](https://www.fergusonhome.com/ingersoll-rand-45464922/s2104584)'],
      ['li', '[Lincoln Tig Welder Square Wave 205](https://bakersgas.com/products/lincoln-k5613-1)'],
      ['li', '[Tig Welding Cart](https://weldingmart.com/products/lincoln-electricutility-cart-150-cu-ft-bottle-capacity-k520-1)'],
      ['li', '[Miller Welder 211 Millermatic](https://bakersgas.com/products/miller-907839)'],
      ['li', '[Shaper Origin](https://www.shapertools.com/en-us/origin)'],
      ['li', '[Ceramic Kiln](https://www.theceramicshop.com/product/19409/hf-1813-240v-icon/)'],
      ['li', '[MK Tile Saw](https://www.mkdiamond.com/tile/saw_101pro24_jcs.html)'],
      ['li', '[Jet Bandsaw](https://www.amazon.com/dp/B0DDYBP3LG)'],
      ['li', '[DeWalt Track Saw](https://www.zoro.com/dewalt-flexvolt-track-saw-60v-max-cordless-59-in-track-dcs520st1/i/G2478712/)'],
      ['p', 'Also always welcome: hand tools in working order, hardwood and sheet goods, shop vacuums, welding consumables, and sturdy shop furniture.'],
      ['p', 'What we can’t take: CRT monitors, non-functioning power tools or tools without batteries, upholstered furniture, opened chemicals, and used clay.'],
      ['h2', 'Giving safely'],
      ['p', 'We only solicit donations through:'],
      ['li', '[yvml.org](http://yvml.org/) and [yuccavalleymaterial.org](http://yuccavalleymaterial.org/)'],
      ['li', 'Email from an @yvml.org address'],
      ['li', 'Mail from 57275 Canterbury Street, Yucca Valley, CA 92284'],
      ['p', 'We do not solicit donations by phone, text, social media DM, or through third-party fundraising platforms unless we have linked to them directly from this site. If you receive a request that doesn’t look right, please forward it to [support@yvml.org](mailto:support@yvml.org) before giving.'],
    ],
  },
];

/* ---------- Building documents ---------- */

const key = () => Math.random().toString(36).slice(2, 12);
const v5 = (type: string, value: unknown) => [{ _key: 'en', _type: type, language: 'en', value }];
const text = (value: string) => v5('internationalizedArrayStringValue', value);

function inline(source: string) {
  const markDefs: { _key: string; _type: 'link'; href: string }[] = [];
  const children: { _key: string; _type: 'span'; text: string; marks: string[] }[] = [];
  let last = 0;
  for (const match of source.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    if (match.index > last) children.push({ _key: key(), _type: 'span', text: source.slice(last, match.index), marks: [] });
    const linkKey = key();
    markDefs.push({ _key: linkKey, _type: 'link', href: match[2] });
    children.push({ _key: key(), _type: 'span', text: match[1], marks: [linkKey] });
    last = match.index + match[0].length;
  }
  if (last < source.length) children.push({ _key: key(), _type: 'span', text: source.slice(last), marks: [] });
  return { markDefs, children };
}

type TextItem = readonly ['h2' | 'h3' | 'p' | 'li' | 'quote', string];
const block = ([kind, value]: TextItem) => ({
  _key: key(),
  _type: 'block',
  style: kind === 'quote' ? 'blockquote' : kind === 'p' || kind === 'li' ? 'normal' : kind,
  ...(kind === 'li' ? { listItem: 'bullet', level: 1 } : {}),
  ...inline(value),
});
const paragraphs = (items: string[]) => items.map((value) => block(['p', value]));

const imageCache = new Map<string, string>();
async function uploadImage(url: string) {
  if (imageCache.has(url)) return imageCache.get(url)!;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image ${url}: ${response.status}`);
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
    filename: decodeURIComponent(url.split('/').pop() ?? 'image.jpg'),
  });
  imageCache.set(url, asset._id);
  return asset._id;
}

async function content(items: Item[]) {
  const modules: Record<string, unknown>[] = [];
  let run: TextItem[] = [];
  const flush = () => {
    if (!run.length) return;
    modules.push({
      _key: key(),
      _type: 'textModule',
      text: v5('internationalizedArrayPortableTextBodyValue', run.map(block)),
    });
    run = [];
  };
  for (const item of items) {
    if (item[0] === 'people') {
      flush();
      const spec = item[1] as People;
      modules.push({
        _key: key(),
        _type: 'peopleModule',
        kicker: spec.kicker,
        ...(spec.description ? { description: v5('internationalizedArrayPortableTextBodyValue', paragraphs([spec.description])) } : {}),
        people: spec.entries.map(([id, role]) => ({
          _key: key(),
          _type: 'personEntry',
          person: { _type: 'reference', _ref: id },
          role,
        })),
      });
    } else if (item[0] === 'img') {
      flush();
      modules.push({
        _key: key(),
        _type: 'imageModule',
        image: WRITE
          ? { _type: 'image', asset: { _type: 'reference', _ref: await uploadImage(item[1] as string) }, decorative: false }
          : { _type: 'image', decorative: false },
      });
    } else {
      run.push(item as TextItem);
    }
  }
  flush();
  return modules;
}

async function main() {
  let tx = client.transaction();

  for (const person of Object.values(P) as Person[]) {
    const id = personId(person);
    console.log(`person ${id}`);
    tx = tx.createIfNotExists({
      _id: id,
      _type: 'person',
      title: name(person),
      slug: { _type: 'slug', current: slugify(name(person)) },
      nameGiven: person.given,
      ...(person.middle ? { middleGiven: person.middle } : {}),
      familyName: person.family,
      ...(person.links ? { links: person.links.map((link) => ({ _key: key(), _type: 'personLink', ...link })) } : {}),
    });
    if (person.bio) {
      tx = tx.patch(id, (patch) =>
        patch.setIfMissing({ Biography: v5('internationalizedArrayPortableTextBodyValue', paragraphs(person.bio ?? [])) })
      );
    }
  }

  for (const page of PAGES) {
    const id = `page-${page.slug.replace(/\//g, '-')}`;
    console.log(`page ${page.slug}: ${page.items.length} items`);
    tx = tx.createOrReplace({
      _id: id,
      _type: 'page',
      title: text(page.title),
      slug: [{ _key: 'en', language: 'en', value: { _type: 'slug', current: page.slug } }],
      content: await content(page.items),
    });
  }

  if (!WRITE) return console.log('\nDry run. Pass --write to create them.');
  await tx.commit();
  console.log('\nDone.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
