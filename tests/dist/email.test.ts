import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SITE } from '../../src/lib/site';
import { html, visible } from './helpers';

const pages = readdirSync('dist', { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.html'));

describe('email obfuscation', () => {
  it.each(pages)('%s never contains the address or a mailto: link', (file) => {
    const page = readFileSync(join('dist', file), 'utf8');
    expect(page).not.toContain(SITE.email);
    expect(page).not.toContain('mailto:');
  });

  it('still shows the address to readers on the Contact page and the homepage card', () => {
    expect(visible(html('contact.html'))).toContain(SITE.email);
    expect(visible(html('index.html'))).toContain(`${SITE.email} — say hi`);
  });

  it('marks every /email link nofollow', () => {
    for (const file of pages) {
      for (const [tag] of readFileSync(join('dist', file), 'utf8').matchAll(/<a [^>]*href="\/email"[^>]*>/g)) {
        expect(tag).toMatch(/rel="[^"]*nofollow/);
      }
    }
  });
});
