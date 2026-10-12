import { describe, expect, it } from 'vitest';
import { html } from './helpers';

const page = html('resume.html');
const pos = (needle: string) => {
  const i = page.indexOf(needle);
  if (i === -1) throw new Error(`"${needle}" not found on /resume`);
  return i;
};

describe('/resume', () => {
  it('has the header and PDF download', () => {
    expect(page).toMatch(/<h1[^>]*>Vladimir Penkin<\/h1>/);
    expect(page).toContain('Staff Software Engineer · Platform &amp; Backend');
    expect(page).toContain('href="/Vladimir_Penkin_CV_2026.pdf"');
    expect(page).toContain('download');
  });

  it('orders sections like the CV', () => {
    const order = ['>Profile<', '>Experience<', '>Skills<', '>Projects<', '>Education<', '>Languages<'].map(pos);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('nests Rev roles under one company with periods', () => {
    expect(page).toMatch(/<a href="http:\/\/rev.com\/"[^>]*>Rev\.com<\/a>/);
    expect(pos('Staff SWE, Technical Lead (SmartDepo)')).toBeLessThan(pos('Staff SWE (Rev Legal)'));
    expect(page).toContain('2015 – 2026');
    expect(page).toContain('2023 – 2025');
  });

  it('renders the context line and inline links', () => {
    expect(page).toContain('<a href="https://www.smartdepo.law/">SmartDepo</a>: legal deposition-summary product');
    expect(page).toContain('<a href="https://bstock.com/">bstock.com</a>');
    expect(page).toContain('Medellín · 2012 – 2013');
  });

  it('renders skills, education and languages', () => {
    expect(page).toMatch(/<strong>AI\/LLM<\/strong>/);
    expect(page).toContain('LiteLLM, summarization pipelines, scikit-learn, spaCy');
    expect(page).toContain('Southern Federal University');
    expect(page).toContain('Russian');
  });
});
