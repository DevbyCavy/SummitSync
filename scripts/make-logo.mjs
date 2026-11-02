/**
 * Builds the logo assets from images-src/brand/logo-source.png (the colour logo on a white background).
 *
 *   public/images/brand/logo.png        colour logo, transparent background (header)
 *   public/images/brand/logo-white.png  all-white logo (footer on purple)
 *   public/images/brand/mark.png        "S" mark only, colour (favicon, JSON-LD logo)
 *   public/images/brand/mark-mask.png   "S" mark silhouette (hero watermark, tinted with CSS)
 *   public/favicon.png                  64×64 mark
 *
 * Re-run with a higher-resolution source (or replace the outputs with an SVG) when the client supplies one.
 * Usage: npm run logo
 */
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const SRC = 'images-src/brand/logo-source.png';
const OUT = 'public/images/brand';
const SCALE = 2; // upscale for retina; the source is a screenshot
// Only scan the white area of the source (skips the top border and the coloured panels below).
const SCAN = { top: 10, bottom: 640 };
const INK_THRESHOLD = 235; // a pixel counts as "logo" if any channel is darker than this

await mkdir(OUT, { recursive: true });

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, channels } = info;
const px = (x, y) => {
  const i = (y * width + x) * channels;
  return [data[i], data[i + 1], data[i + 2]];
};
const isInk = (x, y) => Math.min(...px(x, y)) < INK_THRESHOLD;

// Bounding box of the logo plus which rows contain any ink.
let box = { left: width, right: 0, top: SCAN.bottom, bottom: 0 };
const inkRows = new Set();
for (let y = SCAN.top; y < SCAN.bottom; y++) {
  for (let x = 2; x < width - 2; x++) {
    if (!isInk(x, y)) continue;
    inkRows.add(y);
    box = { left: Math.min(box.left, x), right: Math.max(box.right, x), top: Math.min(box.top, y), bottom: Math.max(box.bottom, y) };
  }
}

// The mark ends at the first blank row after the logo's top (gap between "S" and the wordmark).
let markBottom = box.top;
while (inkRows.has(markBottom + 1)) markBottom++;
let markLeft = width;
let markRight = 0;
for (let y = box.top; y <= markBottom; y++) {
  for (let x = box.left; x <= box.right; x++) {
    if (isInk(x, y)) {
      markLeft = Math.min(markLeft, x);
      markRight = Math.max(markRight, x);
    }
  }
}

/** GIMP-style "colour to alpha" against white, so anti-aliased edges stay clean on any background. */
function toRgba(region, mode) {
  const w = region.right - region.left + 1 + 2 * region.pad;
  const h = region.bottom - region.top + 1 + 2 * region.pad;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const sx = region.left - region.pad + x;
      const sy = region.top - region.pad + y;
      const o = (y * w + x) * 4;
      if (sy < SCAN.top || sy >= SCAN.bottom) continue;
      const [r, g, b] = px(sx, sy);
      const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
      if (a < 0.02) continue;
      if (mode === 'white') {
        // Brand inks only reach ~0.83 alpha against white; stretch so solid areas become fully opaque white.
        out.set([255, 255, 255, Math.round(Math.min(1, a / 0.8) * 255)], o);
      } else {
        const un = (c) => Math.round(Math.min(255, Math.max(0, 255 - (255 - c) / a)));
        out.set([un(r), un(g), un(b), Math.round(a * 255)], o);
      }
    }
  }
  return sharp(out, { raw: { width: w, height: h, channels: 4 } });
}

async function write(img, file, scale = SCALE) {
  const { info: meta } = await img.png().toBuffer({ resolveWithObject: true });
  await img.resize({ width: meta.width * scale, kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toFile(file);
  const { width: w, height: h } = await sharp(file).metadata();
  console.log(`✓ ${file} (${w}×${h})`);
}

const full = { ...box, pad: 4 };
const mark = { left: markLeft, right: markRight, top: box.top, bottom: markBottom, pad: 4 };

await write(toRgba(full, 'colour'), `${OUT}/logo.png`);
await write(toRgba(full, 'white'), `${OUT}/logo-white.png`);
await write(toRgba(mark, 'colour'), `${OUT}/mark.png`);
await write(toRgba(mark, 'white'), `${OUT}/mark-mask.png`);

// Square favicon: mark centred on transparent 64×64.
const markPng = await toRgba(mark, 'colour').png().toBuffer();
await sharp(markPng)
  .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile('public/favicon.png');
console.log('✓ public/favicon.png (64×64)');

// Social share image: white logo centred on brand purple.
const ogLogo = await sharp(`${OUT}/logo-white.png`).resize({ height: 380 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#4B2852' } })
  .composite([{ input: ogLogo, gravity: 'center' }])
  .jpeg({ quality: 88 })
  .toFile('public/og-image.jpg');
console.log('✓ public/og-image.jpg (1200×630)');
