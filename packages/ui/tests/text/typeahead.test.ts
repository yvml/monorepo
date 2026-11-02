import { describe, expect, it } from 'vitest';
import { announceCount, chosenOption, filterOptions, moveActive } from '../../src/text/typeahead';

const label = { one: 'label', many: 'labels' };

describe('typeahead', () => {
  const options = [
    { id: 1, name: 'Albany Records', count: 1592 },
    { id: 2, name: 'New World Records', count: 581 },
    { id: 3, name: 'Mode Records', count: 276 },
    { id: 4, name: 'Cedille Records', count: 276 },
  ];

  it('filters by name ignoring case, largest first then A to Z', () => {
    expect(filterOptions(options, 'records').map((o) => o.id)).toEqual([1, 2, 4, 3]);
    expect(filterOptions(options, 'NEW').map((o) => o.id)).toEqual([2]);
    expect(filterOptions(options, 'zzz')).toEqual([]);
  });

  it('moves the active option and stops at the ends', () => {
    expect(moveActive(-1, 3, 'ArrowDown')).toBe(0);
    expect(moveActive(2, 3, 'ArrowDown')).toBe(2);
    expect(moveActive(0, 3, 'ArrowUp')).toBe(0);
    expect(moveActive(1, 3, 'Home')).toBe(0);
    expect(moveActive(0, 3, 'End')).toBe(2);
    expect(moveActive(0, 0, 'ArrowDown')).toBe(-1);
  });

  it('chooses the active option, or the first', () => {
    expect(chosenOption(options, 2)?.id).toBe(3);
    expect(chosenOption(options, -1)?.id).toBe(1);
    expect(chosenOption([], -1)).toBeUndefined();
  });

  it('announces the count', () => {
    expect(announceCount(0, label)).toBe('No label matches');
    expect(announceCount(1, label)).toBe('1 label');
    expect(announceCount(12, label)).toBe('12 labels');
  });
});
