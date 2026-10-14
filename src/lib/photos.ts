import type { ImageMetadata } from 'astro';
import { assetNames, pickAsset } from './assets';

const PHOTOS = import.meta.glob<ImageMetadata>('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

export const DEFAULT_PHOTO = 'iceland-kirkjufell';

export function photoFor(name: string): ImageMetadata {
  const photo = pickAsset(PHOTOS, name);
  if (!photo) {
    throw new Error(
      `Unknown photo "${name}". Add src/assets/photos/${name}.jpg or use one of: ${assetNames(PHOTOS).join(', ')}`,
    );
  }
  return photo;
}
