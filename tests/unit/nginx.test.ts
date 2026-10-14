import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE } from '../../src/lib/site';

describe('nginx.conf', () => {
  const conf = readFileSync('nginx.conf', 'utf8');

  it('redirects /email to the site address, unindexed', () => {
    const block = conf.match(/location = \/email \{([\s\S]*?)\}/);
    expect(block).not.toBeNull();
    const redirect = block![1].match(/return 302 "([^"]+)";/);
    expect(redirect).not.toBeNull();
    const destination = new URL(redirect![1]);
    expect(destination.protocol).toBe('mailto:');
    expect(destination.pathname).toBe(SITE.email);
    expect(destination.searchParams.get('subject')).toBe('A quick hello');
    expect(block![1]).toContain('add_header X-Robots-Tag "noindex, nofollow";');
  });
});
