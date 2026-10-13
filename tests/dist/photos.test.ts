import { describe, expect, it } from 'vitest';
import { html } from './helpers';

const BANDED = ['about', 'resume', 'life', 'books', 'links', 'contact'];

function band(page: string): string {
  const start = page.indexOf('<div class="photo-band');
  if (start === -1) return '';
  return page.slice(start, page.indexOf('</div>', start));
}

describe('photo bands', () => {
  it.each(BANDED)('%s has a decorative photo band with AVIF and WebP sources', (name) => {
    const b = band(html(`${name}.html`));
    expect(b).toMatch(/^<div class="photo-band photo-band--band"[^>]*aria-hidden="true"/);
    expect(b).toContain('<picture');
    expect(b).toContain('type="image/avif"');
    expect(b).toContain('type="image/webp"');
    // The HTML minifier may print an empty alt as a bare `alt`.
    expect(b).toMatch(/<img[^>]*\salt(?:=""|(?=[\s>]))/);
  });

  it('the homepage has the tall hero band, fetched with high priority', () => {
    const b = band(html('index.html'));
    expect(b).toMatch(/^<div class="photo-band photo-band--hero"/);
    expect(b).toContain('fetchpriority="high"');
  });

  it('the 404 page has no photo band', () => {
    expect(html('404.html')).not.toContain('photo-band');
  });
});
