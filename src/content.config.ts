import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parseYamlDocument, parseYamlList } from './lib/yaml-loader';

const partialDate = z.union([
  z.number().int().min(1900).max(2100),
  z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'use YYYY, YYYY-MM or YYYY-MM-DD'),
]);
const endDate = z.union([partialDate, z.literal('present')]);

const role = z.object({
  title: z.string(),
  start: partialDate.optional(),
  end: endDate.optional(),
  location: z.string().optional(),
  context: z.string().optional(),
  highlights: z.array(z.string()).default([]),
});

const company = z.object({
  company: z.string(),
  url: z.string().url().optional(),
  location: z.string().optional(),
  start: partialDate.optional(),
  end: endDate.optional(),
  roles: z.array(role).min(1),
});

const resume = defineCollection({
  loader: file('src/content/resume.yaml', { parser: parseYamlDocument }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    location: z.string(),
    contact: z.object({ email: z.string().email(), github: z.string(), linkedin: z.string() }),
    pdf: z.string().startsWith('/'),
    profile: z.array(z.string()).min(1),
    skills: z.array(z.object({ label: z.string(), items: z.array(z.string()).min(1) })).min(1),
    experience: z.array(company).min(1),
    projects: z.object({ intro: z.string().optional(), items: z.array(z.string()).min(1) }),
    education: z
      .array(
        z.object({
          school: z.string(),
          location: z.string().optional(),
          field: z.string(),
          start: partialDate,
          end: partialDate,
        }),
      )
      .min(1),
    languages: z.array(z.object({ language: z.string(), level: z.string() })).min(1),
  }),
});

const life = defineCollection({
  loader: file('src/content/life.yaml', { parser: parseYamlList }),
  schema: z.object({
    date: partialDate,
    title: z.string(),
    description: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const books = defineCollection({
  loader: file('src/content/books.yaml', { parser: parseYamlList }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    read: partialDate,
    rating: z.number().int().min(1).max(5).optional(),
    note: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const links = defineCollection({
  loader: file('src/content/links.yaml', { parser: parseYamlList }),
  schema: z.object({
    topic: z.string(),
    links: z
      .array(z.object({ title: z.string(), url: z.string().url(), note: z.string().optional() }))
      .min(1),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/pages' }),
  schema: z.object({ title: z.string(), description: z.string() }),
});

export const collections = { resume, life, books, links, pages };
