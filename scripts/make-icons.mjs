// Regenerate favicons from the avatar: `npm run icons`. Outputs are committed to public/.
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const SRC = 'src/assets/avatar.png';
const BG = '#0d1117';

const png = (size) => sharp(SRC).resize(size, size).png().toBuffer();

// iOS fills transparency with black, so the touch icon gets the site background and some padding.
const touch = await sharp({ create: { width: 180, height: 180, channels: 4, background: BG } })
  .composite([{ input: await sharp(SRC).resize(150, 150).png().toBuffer(), gravity: 'center' }])
  .png()
  .toBuffer();

await writeFile('public/favicon.ico', await pngToIco([await png(16), await png(32), await png(48)]));
await writeFile('public/icon-192.png', await png(192));
await writeFile('public/apple-touch-icon.png', touch);
console.log('Wrote public/favicon.ico, public/icon-192.png, public/apple-touch-icon.png');
