/**
 * Migrates the static pages from yuccavalleymaterial.org (About, Youth Programs, Support) into `page` documents. The content is written out below in a small notation (`h2`, `p`, `li`, `quote`,
 * `img`; `[text](url)` is a link) so the structure is clean rather than a copy of the old layout.
 *
 * Dry run:  pnpm exec sanity exec scripts/migrate-pages.ts --with-user-token
 * Write:    pnpm exec sanity exec scripts/migrate-pages.ts --with-user-token -- --write
 *
 * Pages are created only if missing, so re-running never overwrites edits made in the studio.
 */
import { getCliClient } from 'sanity/cli';

const WRITE = process.argv.includes('--write');
const client = getCliClient({ apiVersion: '2025-01-01' });

type Item = readonly ['h2' | 'h3' | 'p' | 'li' | 'quote' | 'img', string];
type PageSpec = { slug: string; title: string; items: Item[] };

const SQ = 'https://images.squarespace-cdn.com/content/v1/5d695fe1f8d59d0001fd6c8a/';

const PAGES: PageSpec[] = [
  {
    slug: 'about',
    title: 'About',
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
      ['h2', 'Contact'],
      ['p', 'Contact us for more information at [info@yvml.org](mailto:info@yvml.org).'],
      ['h2', 'Recent press'],
      ['li', '[“A Hands-On Haven”, Coachella Valley Independent](https://cvindependent.com/2024/12/a-hands-on-haven-the-yucca-valley-material-lab-serves-as-a-new-model-for-art-education-in-the-high-desert-and-beyond/)'],
      ['li', '[“Creative Hub in the Desert”, LA Times](https://www.latimes.com/lifestyle/story/2024-05-28/yucca-valley-material-lab-draws-artists-to-high-desert)'],
      ['h2', 'Who'],
      ['h3', '[Heidi Schwegler](https://heidischwegler.com), Founding Director'],
      ['p', '[heidi@yvml.org](mailto:heidi@yvml.org)'],
      ['p', 'Having taught at Oregon College of Art for nearly 20 years, and as the former Chair of MFA in Applied Craft + Design (PNCA/OCAC, 2015–18), her professional aspirations have always resided in blending a career that includes a studio practice as an artist and a pedagogical practice as a teacher and administrator. Now based in Yucca Valley, CA she is driven to provide an educational platform for art that is financially accessible and in turn, supports its community. The quonset hut facility and surrounding compound have been designed to allow for material and process exploration free of intended outcomes. Releasing one’s creative practice from preconceived ideas can inspire unimaginable thought and form. Material curiosity, craftsmanship and provocative content have always been the force behind Schwegler’s studio and teaching practice, all of which now play a part at Yucca Valley Material Lab.'],
      ['h3', '[Derek Monypeny](https://derekmonypeny.bandcamp.com), Director of the Music Program'],
      ['p', 'Born in the Arizona desert, a veteran of multiple explorations into the Sahara desert via Morocco and Western Sahara, and now a resident of the Mojave, Derek Monypeny sees his musical mission as adding to and expanding on what he calls the “desert continuum;” the psychedelic sirocco swirl of desert-based stringed instruments played with utter abandon by musicians the world over.'],
      ['p', 'Derek is a former member of the bands Oaxacan (Oakland, CA), ALTO! (Portland, OR), and Sir Richard Bishop’s Freak Of Araby Ensemble. In addition to his solo work, he has an ongoing duo project with Bryan Hillebrandt, OAE (Oakland Afternoon Ensemble). He has performed and toured with artists such as Bill Orcutt, Jozef van Wissem, Eva Aguila/Kevin Shields, Arrington de Dionyso, and many others.'],
      ['h2', 'Staff'],
      ['li', '[Kristen Jean Wheatley](https://kristenjeanwheatley.com/), Program Coordinator, [kristen@yvml.org](mailto:kristen@yvml.org)'],
      ['li', 'Kenneth Knothe, Philanthropy Officer, [kenneth@yvml.org](mailto:kenneth@yvml.org)'],
      ['li', 'Jon Nielsen, Maintenance Technician, [jon@yvml.org](mailto:jon@yvml.org)'],
      ['h2', 'Board of Directors'],
      ['li', 'Michael Dudich, President (Art Museum Executive Director (retired), based in Palm Springs, CA)'],
      ['li', '[Lisa Kahlden](https://www.linkedin.com/in/lkahlden/), Treasurer (President, Anthology of Recorded Music, NY)'],
      ['li', '[Michel Cicero](https://www.realtor.com/realestateagents/5c69d5737e2bce0012e30245), Secretary (realtor based in Yucca Valley, CA)'],
      ['li', '[Avantika Bawa](https://www.avantikabawa.net/), Member (artist, curator, and educator based in Portland, OR)'],
      ['li', '[Christian Camargo](https://en.wikipedia.org/wiki/Christian_Camargo), Member (actor, director, producer, and writer)'],
      ['li', 'Dorie Vollum, Member (based in Portland, OR and Palm Springs, CA)'],
      ['h2', 'Advisory Board'],
      ['li', '[Shaliyah Ben](https://idyllwildarts.org/people/shaliyah-ben/), Director, Native American Art Center, Idyllwild Arts'],
      ['li', '[Stephen Brooks JD, LL.M.](https://www.linkedin.com/in/stephen-brooks-68a12319/), Principal at Pilot Management Resources, LLC'],
      ['li', '[Sandi Burnett](https://www.instagram.com/sandibrearts/), artist, disability advocate'],
      ['li', 'Brian Holland, local nonprofit advisor'],
      ['li', '[Jiseon Lee Isbara](https://www.saic.edu/leadership-governance/office-president), President, School of the Art Institute Chicago'],
      ['li', '[Aly Ogasian](https://alysonogasian.com/about), artist, Assistant Professor of Art, Scripps'],
      ['li', 'Dr. Nicole Panter Dailey, pioneer punk, human rights activist, artist, author, arts educator'],
      ['li', '[Jane Schiffhauer](https://www.janeschiffhauer.com/), artist'],
      ['li', 'Joy Silverman, former executive director of Los Angeles Contemporary Exhibitions'],
      ['li', '[Andy Slater](https://www.thisisandyslater.net/bio/), blind sound artist, musician, and disability advocate'],
      ['li', '[Julie Tolentino](https://julietolentino.com/), artist'],
      ['li', '[Kate Zankowicz](https://www.linkedin.com/in/kate-zankowicz-5388b2b6/), Director of Education, Craft Contemporary Museum, disability justice advocate'],
    ],
  },
  {
    slug: 'youth-programs',
    title: 'Youth Programs',
    items: [
      ['p', 'In a region with limited access to art programming, YVML’s youth programs provide free and low-cost, artist-led classes and workshops, giving young people hands-on learning, mentorship, and access to the tools and skills they need to explore careers in the arts.'],
      ['p', 'Our approach mirrors how artists, engineers, and designers work in the real world, preparing youth not only to create but to problem-solve, innovate, and engage with their communities.'],
      ['img', `${SQ}7282db45-c119-4dd0-9ba0-f4cc95025f00/IMG_7961.JPG`],
      ['p', 'YVML partners with the Morongo Unified School District through California Proposition 28 to expand access to arts education for local youth. Workshops range from glass fusing, paper making and clothing repair to mold making, instrument building, and robotics. These hands-on experiences introduce students to color theory, science, geometry, design, collaboration, and public speaking. Through this program, rural students gain meaningful creative learning opportunities that foster confidence, curiosity, and practical skills that support both personal growth and future participation in the region’s growing creative economy.'],
      ['img', `${SQ}1779329382693-FXBHHLGKNL4G0Y3RY43V/IMG_5047.jpeg`],
      ['img', `${SQ}1779329372898-VK0GLXH85ELQ0JY2FTT9/IMG_5041+%281%29.jpeg`],
      ['img', `${SQ}1779330124368-IH46JRW0FQ3ISBOIGZ04/car.jpg`],
      ['img', `${SQ}1779305106097-0M57ANY4DY4BBBF5PF4D/IMG_8031.JPG`],
      ['img', `${SQ}1779329484432-TJUFU6GPC714N70JF4PY/youth+%281%29.jpg`],
      ['img', `${SQ}1779330132165-3XN1TPB8LY2DO79LM7H0/clay.jpg`],
      ['img', `${SQ}1779330144126-M6AHO4POOM829KQDXXM8/glass.jpg`],
      ['img', `${SQ}1779330158147-QHGJXZ1M0E6ZPKXGM512/lunch.jpg`],
    ],
  },
  {
    slug: 'support',
    title: 'Support',
    items: [
      ['h2', 'Donate today'],
      ['p', 'Giving isn’t passive. It’s creative power — choosing what matters and helping it grow.'],
      ['p', 'Yucca Valley Material Lab is an artist-run nonprofit in the Mojave Desert. We fund residencies for artists who don’t have institutional backing, teach specialized making techniques that have been cut from most art schools, and host free public events in a rural community lacking in cultural opportunities. We are small by design, putting our resources directly into artists, teaching, and public access.'],
      ['p', 'Your gift gives us the ability to say yes. Yes to another student. Another artist. Another idea worth trying.'],
      ['p', 'Yucca Valley Material Lab is a 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law.'],
      ['h2', 'Why support'],
      ['quote', 'We live part time in the High Desert and feel deeply invested in the creative community of this region. Supporting YVML feels very tangible: we can see the young people being introduced to making, artists developing their practices, and a creative community growing around this place. For us, giving to YVML is an investment in the community we’re part of. — Julie Beeler, YVML donor'],
      ['quote', 'What initially drew me to support YVML is its unique ability to combine arts education with community outreach, fostering meaningful conversations about how art can broaden our understanding of the world, both near and far. I am proud to join in the work of amplifying the continued sound of building and creating, all of which resonates throughout the Morongo Basin. — Mark Palmen, YVML donor'],
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
      ['h2', 'Other ways to give'],
      ['p', 'Legal name: Yucca Valley Material Lab, Incorporated. EIN: 83-3715029. Mailing address: 57275 Canterbury Street, Yucca Valley, CA 92284. Contact: Kenneth Knothe, Philanthropy Officer — [support@yvml.org](mailto:support@yvml.org)'],
      ['h3', 'Donor-advised funds'],
      ['p', 'Recommend a grant to YVML using the name and EIN above. If your sponsor requires additional documentation, [email us](mailto:support@yvml.org) and we’ll send it the same week.'],
      ['h3', 'Stocks and appreciated securities'],
      ['p', 'Interested in making a gift of stock or appreciated securities? [Email us](mailto:support@yvml.org) for transfer instructions and brokerage details.'],
      ['h3', 'IRA qualified charitable distributions'],
      ['p', 'If you’re 70 years and six months or older, you can make a tax-free charitable gift directly from your IRA to YVML. Ask your IRA administrator to include your name with the transfer so we know the gift came from you. [Email us](mailto:support@yvml.org).'],
      ['h3', 'Bequests and beneficiary designations'],
      ['p', 'You can include YVML in your will, trust, or as a beneficiary of a retirement account. We’re happy to provide suggested language, and if you choose to let us know about your plans, we’d be honored to thank you. [Email us](mailto:support@yvml.org).'],
      ['h3', 'Employer matching gifts'],
      ['p', 'Your employer may match your donation to YVML. Check your workplace giving portal for Yucca Valley Material Lab or search using our EIN above.'],
      ['h3', 'Vehicles'],
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
      ['h2', 'Support without giving money'],
      ['li', 'Come to something. Show up. Bring a friend. A strong audience helps us keep free public programs free. [Events](/events)'],
      ['li', 'Take a workshop. Your tuition supports our teaching artists and helps make scholarship seats possible for others. [Workshops](/workshops)'],
      ['li', 'Tell one person. Most of our students found us because someone in the Basin mentioned us.'],
      ['li', 'Buy something. Purchases from the shop and Yucca Alta Records go directly back into YVML programs.'],
      ['h2', 'Talk to a person'],
      ['p', 'Kenneth Knothe, Philanthropy Officer. [support@yvml.org](mailto:support@yvml.org) | (760) 209-6368'],
      ['p', 'Have an idea, a question, or another way you’d like to be involved? Get in touch. There’s a real person on the other end.'],
      ['img', `${SQ}f28b2792-73c8-4aa5-8cfd-11ae6b1ef2fc/pink_quonset+copy.jpeg`],
      ['h2', 'Giving safely'],
      ['p', 'We only solicit donations through:'],
      ['li', '[yvml.org](http://yvml.org/) and [yuccavalleymaterial.org](http://yuccavalleymaterial.org/)'],
      ['li', 'Email from an @yvml.org address'],
      ['li', 'Mail from 57275 Canterbury Street, Yucca Valley, CA 92284'],
      ['p', 'We do not solicit donations by phone, text, social media DM, or through third-party fundraising platforms unless we have linked to them directly from this site. If you receive a request that doesn’t look right, please forward it to [support@yvml.org](mailto:support@yvml.org) before giving.'],
      ['p', 'You can independently verify our nonprofit status through the [IRS Tax Exempt Organization Search](https://apps.irs.gov/app/eos/) or our [Candid profile](https://app.candid.org/profile/14419418/yucca-valley-material-lab-incorporated-83-3715029/).'],
      ['p', 'Yucca Valley Material Lab is a 501(c)(3) nonprofit organization, established in 2019. Contributions are tax-deductible to the extent permitted by law.'],
    ],
  },
];

const key = () => Math.random().toString(36).slice(2, 12);
const text = (value: string) => [{ _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value }];

/** Turns `a [link](url) b` into spans plus the link annotations they use. */
function inline(source: string) {
  const markDefs: { _key: string; _type: 'link'; href: string }[] = [];
  const children: { _key: string; _type: 'span'; text: string; marks: string[] }[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    if (match.index > last) children.push({ _key: key(), _type: 'span', text: source.slice(last, match.index), marks: [] });
    const linkKey = key();
    markDefs.push({ _key: linkKey, _type: 'link', href: match[2] });
    children.push({ _key: key(), _type: 'span', text: match[1], marks: [linkKey] });
    last = match.index + match[0].length;
  }
  if (last < source.length) children.push({ _key: key(), _type: 'span', text: source.slice(last), marks: [] });
  return { markDefs, children };
}

function block([kind, value]: Item) {
  const style = kind === 'quote' ? 'blockquote' : kind === 'p' || kind === 'li' ? 'normal' : kind;
  return {
    _key: key(),
    _type: 'block',
    style,
    ...(kind === 'li' ? { listItem: 'bullet', level: 1 } : {}),
    ...inline(value),
  };
}

const imageCache = new Map<string, string>();
async function uploadImage(url: string) {
  if (imageCache.has(url)) return imageCache.get(url)!;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Image ${url}: ${response.status}`);
  const filename = decodeURIComponent(url.split('/').pop() ?? 'image.jpg');
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), { filename });
  imageCache.set(url, asset._id);
  return asset._id;
}

async function content(items: Item[], upload: boolean) {
  const modules: Record<string, unknown>[] = [];
  let run: Item[] = [];
  const flush = () => {
    if (!run.length) return;
    modules.push({
      _key: key(),
      _type: 'textModule',
      text: [{ _key: 'en', _type: 'internationalizedArrayPortableTextBodyValue', language: 'en', value: run.map(block) }],
    });
    run = [];
  };
  for (const item of items) {
    if (item[0] !== 'img') {
      run.push(item);
      continue;
    }
    flush();
    modules.push({
      _key: key(),
      _type: 'imageModule',
      image: upload
        ? { _type: 'image', asset: { _type: 'reference', _ref: await uploadImage(item[1]) }, decorative: false }
        : { _type: 'image', decorative: false },
    });
  }
  flush();
  return modules;
}

async function main() {
  const existing = new Set<string>(await client.fetch(`*[_type == "page"]._id`));
  let tx = client.transaction();
  for (const page of PAGES) {
    const id = `page-${page.slug}`;
    const texts = page.items.filter((item) => item[0] !== 'img').length;
    const images = page.items.length - texts;
    console.log(`${page.slug}: ${texts} text blocks, ${images} images${existing.has(id) ? ' (exists, skipped)' : ''}`);
    if (!WRITE || existing.has(id)) continue;
    tx = tx.createIfNotExists({
      _id: id,
      _type: 'page',
      title: text(page.title),
      slug: [{ _key: 'en', language: 'en', value: { _type: 'slug', current: page.slug } }],
      content: await content(page.items, true),
    });
  }
  if (!WRITE) return console.log('Dry run. Pass --write to create them.');
  await tx.commit();
  console.log('Done.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
