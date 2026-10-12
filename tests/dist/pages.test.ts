import { describe, expect, it } from 'vitest';
import { html } from './helpers';

describe('/about', () => {
  const page = html('about.html');
  it('renders the about prose with avatar and links to life and books', () => {
    expect(page).toContain('<title>About · Vladimir Penkin</title>');
    expect(page).toMatch(/<h1[^>]*>About<\/h1>/);
    expect(page).toContain('dabbling in Go and Python');
    expect(page).toContain('href="/life"');
    expect(page).toContain('href="/books"');
    expect(page).toMatch(/<img[^>]+alt="Illustrated portrait of Vladimir Penkin"/);
    expect(page).toContain('aria-current="page"');
  });
});

describe('/contact', () => {
  const page = html('contact.html');
  it('shows the work email and social links, no PGP', () => {
    expect(page).toMatch(/<h1[^>]*>Contact<\/h1>/);
    expect(page).toContain('href="mailto:work@penk.in"');
    expect(page).toContain('href="https://github.com/shell"');
    // Text nodes only: hashed asset file names could contain any letters.
    expect(page).not.toMatch(/>[^<]*(PGP|GPG|Keybase)[^<]*</);
  });
});

describe('/404', () => {
  it('exists and links home', () => {
    const page = html('404.html');
    expect(page).toMatch(/<h1[^>]*>Page not found<\/h1>/);
    expect(page).toContain('href="/"');
  });
});
