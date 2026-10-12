import { describe, expect, it } from 'vitest';
import { html } from './helpers';

const page = html('index.html');

describe('homepage', () => {
  it('has the title, description and canonical URL', () => {
    expect(page).toContain('<title>Vladimir Penkin</title>');
    expect(page).toContain('<meta name="description" content="Staff software engineer in San Francisco. Platform &amp; backend.">');
    expect(page).toContain('<link rel="canonical" href="https://penk.in/">');
  });

  it('has Open Graph tags using property=', () => {
    expect(page).toContain('<meta property="og:title" content="Vladimir Penkin">');
    expect(page).toContain('<meta property="og:url" content="https://penk.in/">');
    expect(page).toContain('<meta property="og:image" content="https://penk.in/og/home.png">');
  });

  it('shows the name, intro and avatar', () => {
    expect(page).toMatch(/<h1[^>]*>Vladimir Penkin<\/h1>/);
    expect(page).toContain('Staff software engineer in San Francisco. Platform &amp; backend.');
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
