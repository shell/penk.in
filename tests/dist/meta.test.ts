import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { html } from './helpers';

const SLUGS = ['home', 'about', 'resume', 'testimonials', 'life', 'books', 'links', 'contact'];

describe('OG images', () => {
  it.each(SLUGS)('og/%s.png is a 1200x630 PNG', (slug) => {
    const path = `dist/og/${slug}.png`;
    expect(existsSync(path)).toBe(true);
    const buf = readFileSync(path);
    expect(buf.subarray(1, 4).toString()).toBe('PNG');
    expect(buf.readUInt32BE(16)).toBe(1200);
    expect(buf.readUInt32BE(20)).toBe(630);
  });
});

describe('sitemap', () => {
  it('lists every page with clean URLs and no 404', () => {
    const xml = html('sitemap-0.xml');
    for (const path of ['/', '/about', '/resume', '/testimonials', '/life', '/books', '/links', '/contact']) {
      expect(xml).toContain(`<loc>https://penk.in${path}</loc>`);
    }
    expect(xml).not.toContain('404');
  });
});
