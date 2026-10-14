import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { OG_PAGES, SITE, type OgSlug } from '../../lib/site';

export const getStaticPaths: GetStaticPaths = () =>
  (Object.keys(OG_PAGES) as OgSlug[]).map((slug) => ({ params: { slug }, props: { title: OG_PAGES[slug], slug } }));

// Satori reads .woff (not .woff2); Fontsource ships both.
const fonts = Promise.all([
  readFile('node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff'),
  readFile('node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'),
]);
const avatar = readFile('src/assets/avatar.png').then((b) => `data:image/png;base64,${b.toString('base64')}`);

export const GET: APIRoute = async ({ props }) => {
  const { title, slug } = props as { title: string; slug: OgSlug };
  const [grotesk, mono] = await fonts;
  const label = slug === 'home' ? 'penk.in' : SITE.name;

  // Horizontal padding only: Satori adds vertical padding on top of the 630px height.
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { display: 'flex', alignItems: 'center', gap: 56, width: 1200, height: 630, padding: '0 90px', background: '#0d1117' },
        children: [
          {
            type: 'img',
            props: { src: await avatar, width: 300, height: 300, style: { borderRadius: 32, background: '#161b22', border: '2px solid #1f2630' } },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: 16 },
              children: [
                { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 30, color: '#f2b84b' }, children: label } },
                { type: 'div', props: { style: { fontFamily: 'Schibsted Grotesk', fontSize: 76, color: '#f0f6fc', lineHeight: 1.1 }, children: title } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Schibsted Grotesk', data: grotesk, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
