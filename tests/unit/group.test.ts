import { describe, expect, it } from 'vitest';
import { groupBy, newestFirst } from '../../src/lib/group';

describe('groupBy', () => {
  it('groups by key in first-seen order', () => {
    const groups = groupBy(['a1', 'b1', 'a2'], (s) => s[0]);
    expect(groups).toEqual([
      { key: 'a', items: ['a1', 'a2'] },
      { key: 'b', items: ['b1'] },
    ]);
  });
});

describe('newestFirst', () => {
  it('sorts by partial date descending, stable for ties', () => {
    const items = [
      { n: 'old', d: 2015 },
      { n: 'mar', d: '2026-03' },
      { n: 'tie1', d: 2020 },
      { n: 'day', d: '2026-03-15' },
      { n: 'tie2', d: 2020 },
    ];
    expect(newestFirst(items, (i) => i.d).map((i) => i.n)).toEqual(['day', 'mar', 'tie1', 'tie2', 'old']);
  });

  it('does not mutate the input', () => {
    const items = [{ d: 2015 }, { d: 2020 }];
    newestFirst(items, (i) => i.d);
    expect(items[0].d).toBe(2015);
  });
});
