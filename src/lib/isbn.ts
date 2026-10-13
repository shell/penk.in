import { z } from 'astro/zod';

/** ISBN-10 (last char may be X) or ISBN-13 (978/979 prefix), digits only. */
export const ISBN_PATTERN = /^(?:\d{9}[\dX]|97[89]\d{10})$/;

export function normalizeIsbn(value: string): string {
  return value.replace(/[-\s]/g, '').toUpperCase();
}

// YAML's core schema turns unquoted digits into a number, which drops ISBN-10 leading zeros,
// so a number is rejected outright instead of being converted.
export const isbnSchema = z
  .string({ error: 'Quote the ISBN in books.yaml, e.g. isbn: "9780593135204" (unquoted digits lose leading zeros)' })
  .transform(normalizeIsbn)
  .pipe(z.string().regex(ISBN_PATTERN, 'Expected an ISBN-10 or ISBN-13 (hyphens and spaces are fine)'));
