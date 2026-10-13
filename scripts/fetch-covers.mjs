// Download Open Library covers for books.yaml entries that have an isbn, into src/assets/books/<isbn>.jpg.
// Existing files are never overwritten, so a cover replaced by hand stays. Commit the new files.
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isbnSchema } from '../src/lib/isbn.ts';
import { parseYamlList } from '../src/lib/yaml-loader.ts';

export const coverUrl = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

export async function fetchCovers(books, dir, { fetch = globalThis.fetch } = {}) {
  const result = { fetched: [], skipped: [], missing: [], failed: [] };
  const seen = new Set();
  for (const book of books) {
    if (book.isbn === undefined) continue;
    const parsed = isbnSchema.safeParse(book.isbn);
    if (!parsed.success) {
      result.failed.push({ isbn: String(book.isbn), error: 'invalid ISBN' });
      continue;
    }
    const isbn = parsed.data;
    if (seen.has(isbn)) continue;
    seen.add(isbn);
    const file = join(dir, `${isbn}.jpg`);
    if (existsSync(file)) {
      result.skipped.push(isbn);
      continue;
    }
    try {
      const res = await fetch(coverUrl(isbn));
      if (res.status === 404) {
        result.missing.push(isbn);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const type = res.headers.get('content-type') ?? '';
      if (!type.startsWith('image/jpeg')) throw new Error(`unexpected content-type "${type}"`);
      await writeFile(file, new Uint8Array(await res.arrayBuffer()));
      result.fetched.push(isbn);
    } catch (error) {
      result.failed.push({ isbn, error: error.message });
    }
  }
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = 'src/assets/books';
  await mkdir(dir, { recursive: true });
  const books = parseYamlList(await readFile('src/content/books.yaml', 'utf8'));
  const { fetched, skipped, missing, failed } = await fetchCovers(books, dir);
  for (const isbn of fetched) console.log(`fetched  ${isbn}`);
  for (const isbn of missing) console.log(`no cover ${isbn} (the page shows a fallback tile)`);
  for (const { isbn, error } of failed) console.error(`failed   ${isbn}: ${error}`);
  console.log(`${fetched.length} fetched, ${skipped.length} already present, ${missing.length} without a cover, ${failed.length} failed`);
  if (failed.length > 0) process.exit(1);
}
