import { describe, expect, it } from 'vitest';
import { esc, html, markdownPage, metaContent, textOf, visible } from './helpers';

describe('/about', () => {
  const page = html('about.html');
  const about = markdownPage('about');
  it('renders about.md with the avatar and a canonical URL', () => {
    expect(page).toContain(`<title>${about.data.title} · Vladimir Penkin</title>`);
    expect(page).toMatch(new RegExp(`<h1[^>]*>${about.data.title}</h1>`));
    expect(metaContent(page, 'name="description"')).toBe(about.data.description);
    expect(page).toContain('<link rel="canonical" href="https://penk.in/about">');
    const prose = textOf(page.slice(page.indexOf('<div class="prose">'), page.indexOf('</main>')));
    for (const paragraph of about.paragraphs) expect(prose).toContain(paragraph);
    expect(page).toMatch(/<img[^>]+alt="Illustrated portrait of Vladimir Penkin"/);
    expect(page).toContain('aria-current="page"');
  });

  it('has a sidebar card with the round avatar, location, tech pills and links', () => {
    const start = page.indexOf('<aside class="about-card"');
    expect(start).toBeGreaterThan(-1);
    const card = page.slice(start, page.indexOf('</aside>', start));
    expect(card).toMatch(/<img(?=[^>]*alt="Illustrated portrait of Vladimir Penkin")(?=[^>]*class="avatar-card avatar-card--round")[^>]*>/);
    expect(textOf(card)).toContain('Vladimir Penkin');
    expect(textOf(card)).toContain(String(about.data.location));
    const tech = about.data.tech as unknown as string[];
    const dabbling = about.data.dabbling as unknown as string[];
    expect([...card.matchAll(/<li class="pill">([^<]*)<\/li>/g)].map((m) => m[1])).toEqual(tech.map(esc));
    expect([...card.matchAll(/<li class="pill pill--dim">([^<]*)<\/li>/g)].map((m) => m[1])).toEqual(dabbling.map(esc));
    const hrefs = [...card.matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(['/resume', '/life', '/books']);
  });
});

describe('/contact', () => {
  const page = html('contact.html');
  const contact = markdownPage('contact');
  it('shows the work email and social links, no PGP', () => {
    expect(page).toMatch(new RegExp(`<h1[^>]*>${contact.data.title}</h1>`));
    expect(page).toContain('href="/email"');
    expect(page).toContain('href="https://github.com/shell"');
    // Text nodes only: hashed asset file names could contain any letters.
    expect(page).not.toMatch(/>[^<]*(PGP|GPG|Keybase)[^<]*</);
  });

  it('lists email, LinkedIn and GitHub as labelled rows with icons', () => {
    const rows = [...page.matchAll(/<a class="contact-row" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    expect(rows.map((r) => r[1])).toEqual([
      '/email',
      'https://www.linkedin.com/in/vladimirpenkin',
      'https://github.com/shell',
    ]);
    expect(rows.map((r) => textOf(visible(r[2])))).toEqual([
      'Email hello@penk.in',
      'LinkedIn in/vladimirpenkin',
      'GitHub github.com/shell',
    ]);
    for (const r of rows) expect(r[2]).toContain('class="icon"');
  });
});

describe('/404', () => {
  const page = html('404.html');
  it('exists and links home', () => {
    expect(page).toMatch(/<h1[^>]*>Page not found<\/h1>/);
    expect(page).toContain('href="/"');
  });

  it('has its own title, is noindex and has no canonical URL', () => {
    expect(page).toContain('<title>Page not found · Vladimir Penkin</title>');
    expect(page).toContain('<meta property="og:title" content="Page not found · Vladimir Penkin">');
    expect(page).toContain('<meta name="robots" content="noindex">');
    expect(page).not.toContain('rel="canonical"');
    expect(page).not.toContain('og:url');
  });
});
