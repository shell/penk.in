// Fail the build if any internal href/src in dist/*.html points at a file that doesn't exist.
// Mirrors nginx's `try_files $uri $uri.html $uri/index.html`. External links are not checked.
import { statSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith('.html')).map((e) => join(e.parentPath, e.name));
}

const isFile = (p) => statSync(p, { throwIfNoEntry: false })?.isFile() ?? false;

// Routes nginx answers without a file (see nginx.conf).
const SERVER_ROUTES = new Set(['/email']);

function resolves(distDir, link) {
  const path = decodeURIComponent(link.split(/[?#]/)[0]);
  if (SERVER_ROUTES.has(path)) return true;
  const base = join(distDir, path);
  return [base, `${base}.html`, join(base, 'index.html')].some(isFile);
}

export async function findBrokenLinks(distDir) {
  const broken = [];
  for (const file of (await htmlFiles(distDir)).sort()) {
    const html = await readFile(file, 'utf8');
    for (const [, link] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
      if (!resolves(distDir, link)) broken.push({ file: relative(distDir, file), link });
    }
  }
  return broken;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const broken = await findBrokenLinks(process.argv[2] ?? 'dist');
  for (const { file, link } of broken) console.error(`Broken link in ${file}: ${link}`);
  if (broken.length > 0) process.exit(1);
  console.log('Internal links OK');
}
