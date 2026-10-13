import { describe, expect, it } from 'vitest';
import { domainOf } from '../../src/lib/links';

describe('domainOf', () => {
  it('returns the bare hostname', () => {
    expect(domainOf('https://www.taniarascia.com/')).toBe('taniarascia.com');
    expect(domainOf('https://howisfelix.today/')).toBe('howisfelix.today');
    expect(domainOf('https://some-natalie.dev/blog?x=1#y')).toBe('some-natalie.dev');
  });

  it('decodes internationalised domains', () => {
    expect(domainOf('https://xn--gckvb8fzb.com/')).toBe('マリウス.com');
  });
});
