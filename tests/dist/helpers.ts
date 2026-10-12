import { existsSync, readFileSync } from 'node:fs';

/** Read a built file from dist/. Run `npm run build` first. */
export function html(file: string): string {
  const path = `dist/${file}`;
  if (!existsSync(path)) throw new Error(`${path} is missing. Run "npm run build" first.`);
  return readFileSync(path, 'utf8');
}
