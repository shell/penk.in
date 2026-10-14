import { describe, expect, it } from 'vitest';
import { obfuscateEmail } from '../../src/lib/obfuscate';

describe('obfuscateEmail', () => {
  const email = 'hello@penk.in';
  const pieces = obfuscateEmail(email);

  it('shows the real address in the odd positions (the ones CSS leaves visible)', () => {
    expect(pieces.filter((_, i) => i % 2 === 0).map((p) => p.text).join('')).toBe(email);
  });

  it('never leaves the full address intact in the markup', () => {
    expect(pieces.map((p) => p.text).join('')).not.toContain(email);
    for (const p of pieces) expect(p.text.length).toBeLessThanOrEqual(4);
  });

  it('uses varied tags, never span', () => {
    expect(new Set(pieces.map((p) => p.tag)).size).toBeGreaterThan(2);
    expect(pieces.some((p) => (p.tag as string) === 'span')).toBe(false);
  });

  it('handles an empty address', () => {
    expect(obfuscateEmail('')).toEqual([]);
  });
});
