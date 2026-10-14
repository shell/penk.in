import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { coverUrl, fetchCovers } from '../../scripts/fetch-covers.mjs';

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
const jpeg = () => new Response(JPEG, { status: 200, headers: { 'content-type': 'image/jpeg' } });
const dir = () => mkdtempSync(join(tmpdir(), 'covers-'));

describe('coverUrl', () => {
  it('asks Open Library for the large cover and a 404 when missing', () => {
    expect(coverUrl('9780593135204')).toBe('https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg?default=false');
  });
});

describe('fetchCovers', () => {
  it('downloads new covers under their normalised ISBN', async () => {
    const d = dir();
    const fetch = vi.fn(async () => jpeg());
    const result = await fetchCovers([{ title: 'A', isbn: '978-0-593-13520-4' }], d, { fetch });
    expect(fetch).toHaveBeenCalledWith(coverUrl('9780593135204'), expect.objectContaining({ signal: expect.anything() }));
    expect(result.fetched).toEqual(['9780593135204']);
    expect(new Uint8Array(readFileSync(join(d, '9780593135204.jpg')))).toEqual(JPEG);
  });

  it('never overwrites an existing cover', async () => {
    const d = dir();
    writeFileSync(join(d, '0441013597.jpg'), 'hand-picked');
    const fetch = vi.fn(async () => jpeg());
    const result = await fetchCovers([{ isbn: '0441013597' }], d, { fetch });
    expect(fetch).not.toHaveBeenCalled();
    expect(result.skipped).toEqual(['0441013597']);
    expect(readFileSync(join(d, '0441013597.jpg'), 'utf8')).toBe('hand-picked');
  });

  it('records a 404 as missing and writes nothing', async () => {
    const d = dir();
    const result = await fetchCovers([{ isbn: '9780593135204' }], d, { fetch: async () => new Response('', { status: 404 }) });
    expect(result.missing).toEqual(['9780593135204']);
    expect(existsSync(join(d, '9780593135204.jpg'))).toBe(false);
  });

  it('treats a non-image 200 as a failure and writes nothing', async () => {
    const d = dir();
    const html = new Response('<html>oops</html>', { status: 200, headers: { 'content-type': 'text/html' } });
    const result = await fetchCovers([{ isbn: '9780593135204' }], d, { fetch: async () => html });
    expect(result.failed).toEqual([{ isbn: '9780593135204', error: 'unexpected content-type "text/html"' }]);
    expect(existsSync(join(d, '9780593135204.jpg'))).toBe(false);
  });

  it('reports network errors and invalid ISBNs, and ignores books without one', async () => {
    const d = dir();
    const fetch = vi.fn(async () => { throw new Error('ECONNRESET'); });
    const result = await fetchCovers([{ title: 'no isbn' }, { isbn: '12345' }, { isbn: '9780593135204' }], d, { fetch });
    expect(result.failed).toEqual([
      { isbn: '12345', error: expect.stringMatching(/ISBN-10 or ISBN-13/) },
      { isbn: '9780593135204', error: 'ECONNRESET' },
    ]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('fetches a duplicated ISBN once', async () => {
    const fetch = vi.fn(async () => jpeg());
    await fetchCovers([{ isbn: '9780593135204' }, { isbn: '978-0593135204' }], dir(), { fetch });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['an empty body', new Uint8Array([])],
    ['a PNG body', new Uint8Array([0x89, 0x50, 0x4e, 0x47])],
  ])('rejects a jpeg content-type with %s and writes nothing', async (_name, body) => {
    const d = dir();
    const res = new Response(body, { status: 200, headers: { 'content-type': 'image/jpeg' } });
    const result = await fetchCovers([{ isbn: '9780593135204' }], d, { fetch: async () => res });
    expect(result.failed).toEqual([{ isbn: '9780593135204', error: 'not a JPEG' }]);
    expect(existsSync(join(d, '9780593135204.jpg'))).toBe(false);
  });

  it('records a 500 as a failure', async () => {
    const result = await fetchCovers([{ isbn: '9780593135204' }], dir(), { fetch: async () => new Response('', { status: 500 }) });
    expect(result.failed).toEqual([{ isbn: '9780593135204', error: 'HTTP 500' }]);
  });

  it('fails an unquoted-number ISBN with a hint to quote it', async () => {
    const fetch = vi.fn(async () => jpeg());
    const result = await fetchCovers([{ isbn: 441013597 }], dir(), { fetch });
    expect(result.failed).toHaveLength(1);
    expect((result.failed[0] as { error: string }).error).toMatch(/quote/i);
    expect(fetch).not.toHaveBeenCalled();
  });
});
