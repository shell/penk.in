import { existsSync, readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { marked } from 'marked';
import { parseYamlDocument, parseYamlList } from '../../src/lib/yaml-loader';

/** Read a built file from dist/. Run `npm run build` first. */
export function html(file: string): string {
  const path = `dist/${file}`;
  if (!existsSync(path)) throw new Error(`${path} is missing. Run "npm run build" first.`);
  return readFileSync(path, 'utf8');
}

/** Escape text the way Astro does when it renders it into HTML. */
export function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function decode(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

/** Visible text of an HTML fragment: tags dropped, entities decoded, quotes straightened, whitespace collapsed. */
export function textOf(fragment: string): string {
  return decode(fragment.replace(/<[^>]*>/g, ' '))
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function yamlList<T = Record<string, any>>(file: string): T[] {
  return parseYamlList(readFileSync(`src/content/${file}`, 'utf8')) as T[];
}

export function yamlDocument<T = Record<string, any>>(file: string): T {
  return parseYamlDocument(readFileSync(`src/content/${file}`, 'utf8'))[0] as T;
}

/** A page in src/content/pages: front matter and Markdown body. */
export function markdownPage(name: string): { data: Record<string, string>; body: string; paragraphs: string[] } {
  const source = readFileSync(`src/content/pages/${name}.md`, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`src/content/pages/${name}.md has no front matter`);
  const body = match[2].trim();
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => textOf(marked.parse(p, { async: false }) as string))
    .filter(Boolean);
  return { data: load(match[1]) as Record<string, string>, body, paragraphs };
}

/** The (decoded) content attribute of a <meta> tag identified by e.g. `name="description"`. */
export function metaContent(page: string, identifier: string): string {
  const match = page.match(new RegExp(`<meta ${identifier} content="([^"]*)"`));
  if (!match) throw new Error(`<meta ${identifier}> not found`);
  return decode(match[1]);
}

/** Inner HTML of every `<tag>` element (no attributes, no nesting of the same tag). */
export function innerAll(page: string, tag: string): string[] {
  return [...page.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => m[1]);
}
