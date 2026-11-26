// apps/web/tests/home.test.ts
import { describe, expect, it } from 'vitest';
import { materialHue } from '../src/components/home/materials';
import { workshopView } from '../src/components/home/workshopView';

describe('materialHue', () => {
  it('turns a material name into its hue slug', () => {
    expect(materialHue('Ceramics')).toBe('ceramics');
    expect(materialHue('Stone carving')).toBe('stone-carving');
    expect(materialHue('Metal casting')).toBe('metal-casting');
  });

  it('reads the studio names the design calls something else', () => {
    expect(materialHue('Steel')).toBe('metalwork');
    expect(materialHue('Fabric')).toBe('fiber-arts');
    expect(materialHue('Adobe')).toBe('earth-building');
    expect(materialHue('PETG plates')).toBe('printmaking');
  });

  it('gives nothing for a material the theme does not have', () => {
    expect(materialHue('Basketry')).toBeUndefined();
  });
});

const title = (value: string) => [{ _key: 'en', value }];
const base = {
  _id: 'w1',
  slug: 'raku',
  title: title('Raku'),
  price: 200,
  dateTime: { entries: [{ date: '2026-12-01' }] },
  instructors: [{ _id: 'p1', title: 'Amy Zhou' }, { _id: 'p2', title: 'Zed Adams' }],
  materials: [{ _id: 'm1', title: title('Ceramics') }],
  image: { url: 'https://example.com/raku.jpg' },
};

describe('workshopView', () => {
  it('maps a workshop onto what the home shows', () => {
    const view = workshopView(base as never);
    expect(view).toMatchObject({
      id: 'w1',
      href: '/workshops/raku',
      title: 'Raku',
      material: 'Ceramics',
      instructor: 'Amy Zhou, Zed Adams',
      price: '$200',
      imageUrl: 'https://example.com/raku.jpg',
    });
  });

  it('leaves the optional parts empty', () => {
    const view = workshopView({ ...base, price: null, instructors: [], materials: [], image: null } as never);
    expect(view).toMatchObject({ material: '', instructor: '', price: '', imageUrl: null });
  });

  it('shows a free workshop as $0, not as no price', () => {
    expect(workshopView({ ...base, price: 0 } as never).price).toBe('$0');
  });
});
