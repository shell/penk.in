import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findBrokenLinks } from '../../scripts/check-links.mjs';

function site(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(join(dir, path, '..'), { recursive: true });
    writeFileSync(join(dir, path), body);
  }
  return dir;
}

describe('findBrokenLinks', () => {
  it('accepts clean URLs, files, anchors and external links', async () => {
    const dir = site({
      'index.html': '<a href="/about">a</a><a href="/about#x">b</a><img src="/_astro/a.webp"><a href="https://x.com">c</a><a href="mailto:a@b.c">d</a><a href="/">e</a>',
      'about.html': '<a href="/Vladimir_Penkin_CV_2026.pdf">cv</a>',
      '_astro/a.webp': '',
      'Vladimir_Penkin_CV_2026.pdf': '',
    });
    expect(await findBrokenLinks(dir)).toEqual([]);
  });

  it('reports missing internal targets with their source file', async () => {
    const dir = site({ 'index.html': '<a href="/nope">x</a><link href="/missing.css">' });
    expect(await findBrokenLinks(dir)).toEqual([
      { file: 'index.html', link: '/nope' },
      { file: 'index.html', link: '/missing.css' },
    ]);
  });
});
