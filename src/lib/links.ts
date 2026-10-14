import { domainToUnicode } from 'node:url';

/** Hostname for display: no "www.", punycode decoded (runs at build time, so node:url is fine). */
export function domainOf(url: string): string {
  return domainToUnicode(new URL(url).hostname).replace(/^www\./, '');
}
