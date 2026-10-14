import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { decadeColor, formatPartialDate, yearOf } from '../../src/lib/dates';
import { newestFirst } from '../../src/lib/group';
import { normalizeIsbn } from '../../src/lib/isbn';
import { domainOf } from '../../src/lib/links';
import { decode, esc, html, innerAll, textOf, yamlList } from './helpers';

describe('/life', () => {
  const page = html('life.html');
  const entries = yamlList<{ date: number | string; title: string; hue?: string; url?: string }>('life.yaml');

  it('is one timeline, newest first, coloured by decade, with no decade headings', () => {
    expect(page).toMatch(/<h1[^>]*>Life<\/h1>/);
    expect(innerAll(page, 'h2')).toEqual([]);
    expect(page).not.toMatch(/\d+ entr(y|ies)/);
    const sorted = newestFirst(entries, (e) => e.date);
    const hues = [...page.matchAll(/<li class="hue-(\w+)">/g)].map((m) => m[1]);
    expect(hues).toEqual(sorted.map((e) => e.hue ?? decadeColor(e.date)));
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
  const books = yamlList<{ title: string; author: string; read?: number | string; url?: string; isbn?: string; cover?: string }>('books.yaml');

  it('groups books by year, newest first, then undated ones under "Earlier", without a count', () => {
    expect(page).toMatch(/<h1[^>]*>Read Books<\/h1>/);
    const years = [...new Set(books.flatMap((b) => (b.read === undefined ? [] : [yearOf(b.read)])))].sort((a, b) => b - a);
    const headings = years.map(String);
    if (books.some((b) => b.read === undefined)) headings.push('Earlier');
    expect(innerAll(page, 'h2').map(textOf)).toEqual(headings);
    expect(page).not.toMatch(/\d+ books?</);
  });

  it('lists one row per book, with a cover thumbnail when the file exists, else a fallback thumb', () => {
    const rows = innerAll(page, 'li').filter((li) => li.includes('class="book-row-title"'));
    expect(rows).toHaveLength(books.length);
    const alts = [...page.matchAll(/alt="([^"]*)"/g)].map((m) => decode(m[1]));
    const coverName = (b: (typeof books)[number]) => b.cover ?? (b.isbn && normalizeIsbn(b.isbn));
    const hasCover = (b: (typeof books)[number]) => !!coverName(b) && existsSync(`src/assets/books/${coverName(b)}.jpg`);
    for (const book of books.filter(hasCover)) {
      expect(alts).toContain(book.read === undefined ? `Cover of ${book.title} by ${book.author}` : `Finished reading ${formatPartialDate(book.read)}`);
    }
    expect([...page.matchAll(/class="cover cover-fallback"/g)]).toHaveLength(books.filter((b) => !hasCover(b)).length);
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

  it('renders each link as a compact card with its note, and the domain as a tooltip', () => {
    expect(page).not.toContain('class="domain"');
    for (const { links } of topics) {
      for (const link of links) {
        const href = esc(link.url).replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
        const tag = page.match(new RegExp(`<a class="link-card" href="${href}"[^>]*>`));
        expect(tag).not.toBeNull();
        expect(tag![0]).toContain(`title="${esc(domainOf(link.url))}"`);
        expect(tag![0]).toContain('target="_blank"');
        expect(tag![0]).toContain('rel="noopener"');
        const start = page.indexOf(tag![0]);
        const card = textOf(page.slice(start, page.indexOf('</a>', start)));
        expect(card).toContain(link.title);
        if (link.note) expect(card).toContain(link.note);
      }
    }
  });
});
