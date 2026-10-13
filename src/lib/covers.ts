import type { ImageMetadata } from 'astro';
import { pickAsset } from './assets';

// Covers are fetched by `npm run covers` and committed; the build never downloads anything.
const COVERS = import.meta.glob<ImageMetadata>('../assets/books/*.jpg', { eager: true, import: 'default' });

export function coverFor(isbn?: string): ImageMetadata | undefined {
  return isbn ? pickAsset(COVERS, isbn) : undefined;
}
