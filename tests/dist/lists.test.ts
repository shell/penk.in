import { describe, expect, it } from 'vitest';
import { decadeColor, formatPartialDate, yearOf } from '../../src/lib/dates';
import { newestFirst } from '../../src/lib/group';
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
  const books = yamlList<{ title: string; read: number | string; url?: string }>('books.yaml');

  it('groups books by year, newest first, with a count', () => {
    expect(page).toMatch(/<h1[^>]*>Books<\/h1>/);
    const counts = new Map<number, number>();
    for (const book of books) counts.set(yearOf(book.read), (counts.get(yearOf(book.read)) ?? 0) + 1);
    const years = [...counts.keys()].sort((a, b) => b - a);
    expect(innerAll(page, 'h2').map(textOf)).toEqual(years.map(String));
    for (const year of years) {
      const n = counts.get(year)!;
      expect(page).toContain(`<h2>${year}</h2><span class="meta">${n} ${n === 1 ? 'book' : 'books'}</span>`);
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
  const topics = yamlList<{ topic: string; links: { title: string; url: string }[] }>('links.yaml');

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
});
