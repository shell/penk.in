import { describe, expect, it } from 'vitest';
import { formatPeriod } from '../../src/lib/dates';
import { esc, html, innerAll, textOf, yamlDocument } from './helpers';

interface Role { title: string; start?: number | string; end?: number | string; location?: string }
interface Company extends Role { company: string; url?: string; roles: Role[] }
interface Cv {
  name: string;
  title: string;
  pdf: string;
  skills: { label: string; items: string[] }[];
  experience: Company[];
  education: { school: string }[];
  languages: { language: string }[];
}

const page = html('resume.html');
const cv = yamlDocument<Cv>('resume.yaml');
const meta = (location: string | undefined, period: string) => [location, period].filter(Boolean).join(' · ');

describe('/resume', () => {
  it('has the header and PDF download', () => {
    expect(page).toMatch(new RegExp(`<h1[^>]*>${esc(cv.name)}</h1>`));
    expect(page).toContain(esc(cv.title));
    expect(page).toContain(`href="${cv.pdf}"`);
    expect(page).toContain('download');
  });

  it('orders sections like the CV', () => {
    const headings = innerAll(page, 'h2').map(textOf);
    expect(headings).toEqual(['Profile', 'Experience', 'Skills', 'Projects', 'Education', 'Languages']);
  });

  it('lists companies and their roles in file order, with periods', () => {
    expect(innerAll(page, 'h3').map(textOf)).toEqual(cv.experience.map((c) => c.company));
    expect(innerAll(page, 'h4').map(textOf)).toEqual(cv.experience.flatMap((c) => c.roles.map((r) => r.title)));
    for (const c of cv.experience) {
      if (c.url) expect(page).toContain(`<a href="${esc(c.url)}">${esc(c.company)}</a>`);
      const companyMeta = meta(c.location, formatPeriod(c.start as never, c.end as never));
      if (companyMeta) expect(page).toContain(`<span class="meta">${esc(companyMeta)}</span>`);
      for (const r of c.roles) {
        const roleMeta = meta(r.location, formatPeriod(r.start as never, r.end as never));
        if (roleMeta) expect(page).toContain(`<h4>${esc(r.title)}</h4><span class="meta">${esc(roleMeta)}</span>`);
      }
    }
  });

  it('renders skills, education and languages', () => {
    for (const s of cv.skills) expect(page).toContain(`<strong>${esc(s.label)}</strong> ${esc(s.items.join(', '))}`);
    for (const e of cv.education) expect(page).toContain(esc(e.school));
    for (const l of cv.languages) expect(page).toContain(`<strong>${esc(l.language)}</strong>`);
  });
});
