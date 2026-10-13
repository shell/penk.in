import { describe, expect, it } from 'vitest';
import { coverFor } from '../../src/lib/covers';

describe('coverFor', () => {
  it('returns undefined without an ISBN or without a matching asset', () => {
    expect(coverFor(undefined)).toBeUndefined();
    expect(coverFor('9780000000000')).toBeUndefined();
  });
});
