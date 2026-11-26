// apps/web/tests/remember.test.ts
import { describe, expect, it } from 'vitest';
import { recallListing, rememberListing } from '../src/lib/filters/remember';

/** A store that keeps its items in a map. */
const store = () => {
  const items = new Map<string, string>();
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
  };
};

describe('remembering a listing', () => {
  it('returns the address a listing was left at', () => {
    const kept = store();
    rememberListing('/workshops', '/workshops/material/adobe?sort=price-low', kept);
    expect(recallListing('/workshops', kept)).toBe('/workshops/material/adobe?sort=price-low');
  });

  it('remembers the plain address as nothing', () => {
    const kept = store();
    rememberListing('/workshops', '/workshops/material/adobe', kept);
    rememberListing('/workshops', '/workshops', kept);
    expect(recallListing('/workshops', kept)).toBeNull();
  });

  it('keeps each listing apart', () => {
    const kept = store();
    rememberListing('/workshops', '/workshops/open', kept);
    expect(recallListing('/events', kept)).toBeNull();
  });

  it('only returns an address inside the listing', () => {
    const kept = store();
    kept.setItem('yvml-listing:/workshops', 'https://example.com');
    expect(recallListing('/workshops', kept)).toBeNull();
  });

  it('does nothing without a store', () => {
    expect(() => rememberListing('/workshops', '/workshops/open', null)).not.toThrow();
    expect(recallListing('/workshops', null)).toBeNull();
  });
});
