// apps/web/tests/events.test.ts
import { describe, expect, it } from 'vitest';
import { eventListing } from '@/lib/events';
import { applyFilters, buildUrl, parseUrl } from '@/lib/filters';

const event = (id: string, date: string | null, extra: Record<string, unknown> = {}) => ({
  _id: id,
  slug: id,
  title: [{ _key: 'en', value: id }],
  location: null,
  status: null,
  dateTime: date ? { entries: [{ date }] } : null,
  ...extra,
});
const items = [
  event('opening', '2026-12-05', { location: 'Yucca Valley' }),
  event('closing', '2026-01-10', { location: 'Joshua Tree' }),
  event('someday', null),
] as never[];
const context = { today: '2026-06-01' };
const ids = (query: Record<string, string>) =>
  applyFilters(eventListing, items, parseUrl(eventListing, [], query)!, context).map((item: { _id: string }) => item._id);

describe('event listing', () => {
  it('hides past entries until asked, and keeps undated ones', () => {
    // The order is the listing's business (it groups by date after filtering); only membership is checked here.
    expect(ids({}).sort()).toEqual(['opening', 'someday']);
    expect(ids({ past: 'yes' }).sort()).toEqual(['closing', 'opening', 'someday']);
  });

  it('searches the title and the place', () => {
    expect(ids({ past: 'yes', q: 'joshua' })).toEqual(['closing']);
    expect(ids({ q: 'open' })).toEqual(['opening']);
  });

  it('writes the plain listing as the plain address', () => {
    const state = parseUrl(eventListing, [], {})!;
    expect(buildUrl(eventListing, state)).toEqual({ segments: [], query: {} });
  });
});
