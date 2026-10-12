import { describe, expect, it } from 'vitest';
import { html, markdownPage, metaContent, textOf } from './helpers';

const page = html('index.html');
const home = markdownPage('home');

describe('homepage', () => {
  it('has the title, description and canonical URL', () => {
    expect(page).toContain('<title>Vladimir Penkin</title>');
    expect(metaContent(page, 'name="description"')).toBe(home.data.description);
    expect(page).toContain('<link rel="canonical" href="https://penk.in/">');
    expect(page).not.toContain('name="robots"');
  });

  it('has Open Graph tags using property=', () => {
    expect(page).toContain('<meta property="og:title" content="Vladimir Penkin">');
    expect(metaContent(page, 'property="og:description"')).toBe(home.data.description);
    expect(page).toContain('<meta property="og:url" content="https://penk.in/">');
    expect(page).toContain('<meta property="og:image" content="https://penk.in/og/home.png">');
  });

  it('shows the name, the intro rendered from home.md and the avatar', () => {
    expect(page).toMatch(/<h1[^>]*>Vladimir Penkin<\/h1>/);
    const start = page.indexOf('<div class="intro">');
    expect(start).toBeGreaterThan(-1);
    const intro = textOf(page.slice(start, page.indexOf('</section>', start)));
    for (const paragraph of home.paragraphs) expect(intro).toContain(paragraph);
    expect(page).toMatch(/<img[^>]+alt="Illustrated portrait of Vladimir Penkin"/);
  });

  it('has the nav in order and the social links', () => {
    const nav = page.slice(page.indexOf('<nav'), page.indexOf('</nav>'));
    const order = ['/about', '/resume', '/links', '/contact'].map((href) => nav.indexOf(`href="${href}"`));
    expect(order.every((i) => i > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(page).toContain('href="https://github.com/shell"');
    expect(page).toContain('href="https://www.linkedin.com/in/vladimirpenkin"');
    expect(page).toContain('href="mailto:work@penk.in"');
    // Text nodes only: hashed asset file names could contain any letters.
    expect(page).not.toMatch(/>[^<]*Keybase[^<]*</);
  });

  it('bootstraps the theme and loads Umami', () => {
    expect(page).toContain("localStorage.getItem('theme')");
    expect(page).toContain('data-theme-toggle');
    expect(page).toContain('data-website-id="b996cf54-3aaf-42dd-9e55-615a691978a1"');
  });

  it('links favicons', () => {
    expect(page).toContain('<link rel="icon" href="/favicon.ico" sizes="32x32">');
    expect(page).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
  });
});
