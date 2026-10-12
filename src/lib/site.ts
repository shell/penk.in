export const SITE = {
  url: 'https://penk.in',
  name: 'Vladimir Penkin',
  email: 'work@penk.in',
  github: 'shell',
  linkedin: 'vladimirpenkin',
  umamiId: 'b996cf54-3aaf-42dd-9e55-615a691978a1',
} as const;

export const NAV = [
  { href: '/about', label: 'about' },
  { href: '/resume', label: 'resume' },
  { href: '/links', label: 'links' },
  { href: '/contact', label: 'contact' },
];

/** Pages that get a generated OG image at /og/<slug>.png, with the title shown on it. */
export const OG_PAGES = {
  home: 'Vladimir Penkin',
  about: 'About',
  resume: 'Résumé',
  life: 'Life',
  books: 'Books',
  links: 'Links',
  contact: 'Contact',
} as const;

export type OgSlug = keyof typeof OG_PAGES;
