import solarSet from '@iconify-json/solar/icons.json';
import { siGithub } from 'simple-icons';
import arrowUpRight from 'lucide-static/icons/arrow-up-right.svg?raw';
import bookOpen from 'lucide-static/icons/book-open.svg?raw';
import clock from 'lucide-static/icons/clock.svg?raw';
import download from 'lucide-static/icons/download.svg?raw';
import fileText from 'lucide-static/icons/file-text.svg?raw';
import link from 'lucide-static/icons/link.svg?raw';
import mail from 'lucide-static/icons/mail.svg?raw';
import moon from 'lucide-static/icons/moon.svg?raw';
import sun from 'lucide-static/icons/sun.svg?raw';
import user from 'lucide-static/icons/user.svg?raw';

// simple-icons dropped LinkedIn at LinkedIn's request; this is its last published path (CC0).
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

const brand = (path: string) => `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`;

// Solar duotone (24×24, fill-based) for the home cards.
const solar = (name: keyof typeof solarSet.icons) =>
  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${solarSet.icons[name].body}</svg>`;

export const ICONS = {
  sun,
  moon,
  mail,
  download,
  'arrow-up-right': arrowUpRight,
  github: brand(siGithub.path),
  linkedin: brand(LINKEDIN_PATH),
  user,
  'file-text': fileText,
  clock,
  'book-open': bookOpen,
  link,
  'solar-user': solar('user-rounded-bold-duotone'),
  'solar-resume': solar('document-text-bold-duotone'),
  'solar-testimonials': solar('chat-round-like-bold-duotone'),
  'solar-life': solar('map-bold-duotone'),
  'solar-books': solar('book-2-bold-duotone'),
  'solar-links': solar('link-round-bold-duotone'),
  'solar-contact': solar('letter-bold-duotone'),
} as const;

export type IconName = keyof typeof ICONS;
