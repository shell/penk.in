import { describe, expect, it } from 'vitest';
import { formatPartialDate, sortKey } from '../../src/lib/dates';
import { esc, html, innerAll, markdownPage, textOf, yamlList } from './helpers';

interface Testimonial { name: string; url: string; avatar?: string; headline: string; relationship: string; date: number | string; text: string }

const page = html('testimonials.html');
const items = yamlList<Testimonial>('testimonials.yaml');

describe('/testimonials', () => {
  it('has its title, canonical URL and share image', () => {
    expect(page).toMatch(/<h1[^>]*>Testimonials<\/h1>/);
    expect(page).toContain('<title>Testimonials · Vladimir Penkin</title>');
    expect(page).toContain('<link rel="canonical" href="https://penk.in/testimonials">');
    expect(page).toContain('<meta property="og:image" content="https://penk.in/og/testimonials.png">');
  });

  it('opens with the intro from testimonials.md', () => {
    const intro = markdownPage('testimonials');
    const start = page.indexOf('<div class="prose testimonials-intro">');
    expect(start).toBeGreaterThan(-1);
    const text = textOf(page.slice(start, page.indexOf('</div>', start)));
    for (const paragraph of intro.paragraphs) expect(text).toContain(paragraph);
  });

  it('shows every testimonial, newest first, with the full text and attribution', () => {
    const cards = innerAll(page, 'figure');
    expect(cards).toHaveLength(items.length);
    const sorted = [...items].sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));
    cards.forEach((card, i) => {
      const t = sorted[i];
      const text = textOf(card);
      for (const paragraph of t.text.split(/\n\s*\n/)) expect(text).toContain(textOf(esc(paragraph)));
      expect(text).toContain(t.name);
      expect(text).toContain(t.headline);
      expect(text).toContain(formatPartialDate(t.date));
      expect(card).toMatch(new RegExp(`<a class="testimonial-name" href="${esc(t.url)}"[^>]*>${esc(t.name)}</a>`));
      if (t.avatar) expect(card).toMatch(/<img[^>]+class="testimonial-avatar"/);
      expect(card).toContain(`<a class="testimonial-date" href="https://www.linkedin.com/in/vladimirpenkin/details/recommendations/" rel="noopener">${formatPartialDate(t.date)}</a>`);
    });
  });

  it('is linked from the résumé header', () => {
    const resume = html('resume.html');
    const header = resume.slice(resume.indexOf('<header class="resume-header">'), resume.indexOf('</header>', resume.indexOf('<header class="resume-header">')));
    const pill = header.match(/<a class="proof" href="\/testimonials">([\s\S]*?)<\/a>/);
    expect(pill).not.toBeNull();
    expect(textOf(pill![1])).toContain(`${items.length} recommendations`);
    const faces = [...pill![1].matchAll(/<img[^>]+class="proof-face"/g)];
    expect(faces.length).toBe(Math.min(5, new Set(items.filter((t) => t.avatar).map((t) => t.avatar)).size));
  });
});
