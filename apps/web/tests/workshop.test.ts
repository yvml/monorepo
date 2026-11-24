// apps/web/tests/workshop.test.ts
import { describe, expect, it } from 'vitest';
import { applyFilters, optionsWithCounts, parseUrl, workshopListing } from '@/lib/filters';

const title = (value: string) => [{ _key: 'en', value }];
const workshop = (id: string, extra: Record<string, unknown> = {}) => ({
  _id: id,
  slug: id,
  title: title(id),
  price: null,
  status: 'open',
  dateTime: { entries: [{ date: '2026-12-01' }] },
  instructors: [],
  workshopTypes: [],
  materials: [],
  ...extra,
});
const items = [
  workshop('a', { price: 100, instructors: [{ _id: 'p1', title: 'Zed Adams', familyName: 'Adams', nameGiven: 'Zed', slug: 'zed-adams' }] }),
  workshop('b', { price: 50, status: 'soldOut', dateTime: { entries: [{ date: '2026-01-02' }] } }),
  workshop('c', { instructors: [{ _id: 'p2', title: 'Amy Zhou', familyName: null, nameGiven: 'Amy', slug: 'amy-zhou' }] }),
] as never[];
const context = { today: '2026-06-01' };
const ids = (query: Record<string, string>) =>
  applyFilters(workshopListing, items, parseUrl(workshopListing, [], query)!, context).map((item: { _id: string }) => item._id);

describe('workshop listing', () => {
  it('hides past workshops until asked', () => {
    expect(ids({})).toEqual(['a', 'c']);
    expect(ids({ past: 'yes' })).toContain('b');
  });

  it('puts workshops without a price last in both directions', () => {
    expect(ids({ sort: 'price-low' })).toEqual(['a', 'c']);
    expect(ids({ sort: 'price-high' })).toEqual(['a', 'c']);
  });

  it('lists instructors by last name, falling back to the last word of the name', () => {
    const options = optionsWithCounts(workshopListing, items, parseUrl(workshopListing, [], {})!, context, 'instructor');
    expect(options.map((option) => option.label)).toEqual(['Zed Adams', 'Amy Zhou']);
  });

  it('leaves out a person with no slug, since an address can only carry slugs', () => {
    const unaddressable = [workshop('x', { instructors: [{ _id: 'p9', title: 'No Slug', familyName: 'Slug', nameGiven: 'No', slug: null }] })] as never[];
    const options = optionsWithCounts(workshopListing, unaddressable, parseUrl(workshopListing, [], {})!, context, 'instructor');
    expect(options).toEqual([]);
  });
});
