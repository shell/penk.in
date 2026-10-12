import { describe, expect, it } from 'vitest';
import { html } from './helpers';

describe('/life', () => {
  const page = html('life.html');
  it('groups milestones by decade, newest first', () => {
    expect(page).toMatch(/<h1[^>]*>Life<\/h1>/);
    const d2020 = page.indexOf('>2020s<');
    const d2010 = page.indexOf('>2010s<');
    const d2000 = page.indexOf('>2000s<');
    expect(d2020).toBeGreaterThan(-1);
    expect(d2020).toBeLessThan(d2010);
    expect(d2010).toBeLessThan(d2000);
    expect(page).toContain('Moved to Medellín, Colombia');
  });
});

describe('/books', () => {
  const page = html('books.html');
  it('groups books by year with a count', () => {
    expect(page).toMatch(/<h1[^>]*>Books<\/h1>/);
    expect(page).toMatch(/>2026<\/h2>\s*<span class="meta">1 book<\/span>/);
  });
});

describe('/links', () => {
  const page = html('links.html');
  it('groups links by topic', () => {
    expect(page).toMatch(/<h1[^>]*>Links<\/h1>/);
    expect(page).toMatch(/<h2[^>]*>Personal sites I like<\/h2>/);
    expect(page).toContain('href="https://howisfelix.today/"');
  });
});
