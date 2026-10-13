import { describe, expect, it } from 'vitest';
import { isbnSchema, normalizeIsbn } from '../../src/lib/isbn';

describe('normalizeIsbn', () => {
  it('strips hyphens and spaces and upper-cases the check digit', () => {
    expect(normalizeIsbn('978-0-593-13520-4')).toBe('9780593135204');
    expect(normalizeIsbn('0 441 01359 7')).toBe('0441013597');
    expect(normalizeIsbn('080442957x')).toBe('080442957X');
  });
});

describe('isbnSchema', () => {
  it('accepts ISBN-10 and ISBN-13 in any common spelling', () => {
    expect(isbnSchema.parse('9780593135204')).toBe('9780593135204');
    expect(isbnSchema.parse('978-0-593-13520-4')).toBe('9780593135204');
    expect(isbnSchema.parse('0441013597')).toBe('0441013597');
    expect(isbnSchema.parse('080442957X')).toBe('080442957X');
  });

  it('rejects an unquoted YAML number with a hint to quote it', () => {
    const result = isbnSchema.safeParse(441013597);
    expect(result.success).toBe(false);
    expect(result.error!.issues[0].message).toMatch(/quote/i);
  });

  it('rejects malformed values', () => {
    for (const bad of ['12345', '9790593135204X', 'abcdefghij', '']) {
      expect(isbnSchema.safeParse(bad).success).toBe(false);
    }
  });
});
