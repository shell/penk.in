import type { ImageMetadata } from 'astro';
import { assetNames, pickAsset } from './assets';

const AVATARS = import.meta.glob<ImageMetadata>('../assets/testimonials/*.jpg', { eager: true, import: 'default' });

export function avatarFor(name: string): ImageMetadata {
  const avatar = pickAsset(AVATARS, name);
  if (!avatar) {
    throw new Error(`Unknown avatar "${name}". Add src/assets/testimonials/${name}.jpg or use one of: ${assetNames(AVATARS).join(', ')}`);
  }
  return avatar;
}
