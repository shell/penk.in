import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE } from '../../src/lib/site';

describe('nginx.conf', () => {
  const conf = readFileSync('nginx.conf', 'utf8');

  it('redirects /email to the site address, unindexed', () => {
    const block = conf.match(/location = \/email \{([\s\S]*?)\}/);
    expect(block).not.toBeNull();
    expect(block![1]).toContain(`return 302 "mailto:${SITE.email}";`);
    expect(block![1]).toContain('add_header X-Robots-Tag "noindex, nofollow";');
  });
});
