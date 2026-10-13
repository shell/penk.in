import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { decadeColor, formatPartialDate, yearOf } from '../../src/lib/dates';
import { newestFirst } from '../../src/lib/group';
import { normalizeIsbn } from '../../src/lib/isbn';
import { domainOf } from '../../src/lib/links';
import { esc, html, innerAll, textOf, yamlList } from './helpers';

describe('/life', () => {
  const page = html('life.html');
  const entries = yamlList<{ date: number | string; title: string; url?: string }>('life.yaml');

  it('is one timeline, newest first, coloured by decade, with no decade headings', () => {
    expect(page).toMatch(/<h1[^>]*>Life<\/h1>/);
    expect(innerAll(page, 'h2')).toEqual([]);
    expect(page).not.toMatch(/\d+ entr(y|ies)/);
    const sorted = newestFirst(entries, (e) => e.date);
    const hues = [...page.matchAll(/<li class="hue-(\w+)">/g)].map((m) => m[1]);
    expect(hues).toEqual(sorted.map((e) => decadeColor(e.date)));
    const positions = sorted.map((e) => page.indexOf(esc(e.title)));
    expect(positions.every((p) => p > -1)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('shows every milestone with its date', () => {
    for (const entry of entries) {
      expect(page).toContain(esc(entry.title));
      expect(page).toContain(`>${formatPartialDate(entry.date)}<`);
      if (entry.url) expect(page).toContain(`href="${esc(entry.url)}"`);
    }
  });
});

describe('/books', () => {
  const page = html('books.html');
  const books = yamlList<{ title: string; author: string; read: number | string; url?: string; isbn?: string }>('books.yaml');

  it('groups books by year, newest first, without a count', () => {
    expect(page).toMatch(/<h1[^>]*>Books<\/h1>/);
    const years = [...new Set(books.map((b) => yearOf(b.read)))].sort((a, b) => b - a);
    expect(innerAll(page, 'h2').map(textOf)).toEqual(years.map(String));
    expect(page).not.toMatch(/\d+ books?</);
  });

  it('shows a cover when the file exists, else the fallback tile', () => {
    for (const book of books) {
      const file = book.isbn && `src/assets/books/${normalizeIsbn(book.isbn)}.jpg`;
      if (file && existsSync(file)) {
        expect(page).toContain(`alt="${esc(`Cover of ${book.title} by ${book.author}`)}"`);
      } else {
        expect(page).toContain(`<span class="cover-title">${esc(book.title)}</span>`);
      }
    }
  });

  it('shows every book', () => {
    for (const book of books) {
      expect(page).toContain(esc(book.title));
      if (book.url) expect(page).toContain(`href="${esc(book.url)}"`);
    }
  });
});

describe('/links', () => {
  const page = html('links.html');
  const topics = yamlList<{ topic: string; links: { title: string; url: string; note?: string }[] }>('links.yaml');

  it('groups links by topic, in file order', () => {
    expect(page).toMatch(/<h1[^>]*>Links<\/h1>/);
    expect(innerAll(page, 'h2').map(textOf)).toEqual(topics.map((t) => t.topic));
  });

  it('shows every link', () => {
    for (const { links } of topics) {
      for (const link of links) {
        expect(page).toContain(`href="${esc(link.url)}"`);
        expect(page).toContain(esc(link.title));
      }
    }
  });

  it('renders each link as a card with its note and domain', () => {
    for (const { links } of topics) {
      for (const link of links) {
        const start = page.indexOf(`<a class="link-card" href="${esc(link.url)}"`);
        expect(start).toBeGreaterThan(-1);
        const card = textOf(page.slice(start, page.indexOf('</a>', start)));
        expect(card).toContain(domainOf(link.url));
        if (link.note) expect(card).toContain(link.note);
      }
    }
  });
});
