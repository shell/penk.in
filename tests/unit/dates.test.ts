import { describe, expect, it } from 'vitest';
import { decadeColor, decadeOf, formatPartialDate, formatPeriod, sortKey, yearOf } from '../../src/lib/dates';

describe('yearOf', () => {
  it('handles all partial date shapes', () => {
    expect(yearOf(2015)).toBe(2015);
    expect(yearOf('2026-03')).toBe(2026);
    expect(yearOf('2026-03-15')).toBe(2026);
  });
});

describe('formatPartialDate', () => {
  it('formats year, month and day precision', () => {
    expect(formatPartialDate(2015)).toBe('2015');
    expect(formatPartialDate('2026-03')).toBe('Mar 2026');
    expect(formatPartialDate('2026-03-05')).toBe('Mar 5, 2026');
  });
});

describe('formatPeriod', () => {
  it('formats ranges with a spaced en dash', () => {
    expect(formatPeriod(2015, 2026)).toBe('2015 – 2026');
    expect(formatPeriod(2025, 'present')).toBe('2025 – present');
  });

  it('collapses equal or missing ends', () => {
    expect(formatPeriod(2015)).toBe('2015');
    expect(formatPeriod(2015, 2015)).toBe('2015');
    expect(formatPeriod()).toBe('');
  });
});

describe('decadeOf', () => {
  it('returns the decade label', () => {
    expect(decadeOf(2015)).toBe('2010s');
    expect(decadeOf('2020-01')).toBe('2020s');
  });
});

describe('sortKey', () => {
  it('pads to YYYY-MM-DD so strings sort chronologically', () => {
    expect(sortKey(2015)).toBe('2015-00-00');
    expect(sortKey('2026-03')).toBe('2026-03-00');
    expect(sortKey('2026-03-15')).toBe('2026-03-15');
  });
});

describe('decadeColor', () => {
  it('maps the 1990s–2020s to accent, blue, green, purple', () => {
    expect(decadeColor(1995)).toBe('accent');
    expect(decadeColor(2000)).toBe('blue');
    expect(decadeColor('2009-12')).toBe('blue');
    expect(decadeColor(2015)).toBe('green');
    expect(decadeColor('2026-03-01')).toBe('purple');
  });

  it('cycles for decades outside that range', () => {
    expect(decadeColor(2030)).toBe('accent');
    expect(decadeColor(1989)).toBe('purple');
    expect(decadeColor(1950)).toBe('accent');
  });
});
