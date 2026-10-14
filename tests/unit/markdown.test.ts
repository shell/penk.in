import { describe, expect, it } from 'vitest';
import { inline } from '../../src/lib/markdown';

describe('inline', () => {
  it('renders links and emphasis without a wrapping paragraph', () => {
    expect(inline('see [x](https://x.com) **b**')).toBe('see <a href="https://x.com">x</a> <strong>b</strong>');
  });
});
