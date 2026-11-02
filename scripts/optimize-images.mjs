/**
 * Converts source photos into the WebP files the site expects.
 *
 *   images-src/projects/un-forum-cover.jpg
 *     → public/images/projects/un-forum-cover.webp        (1600w, used as `src`)
 *     → public/images/projects/un-forum-cover-480.webp    (srcset)
 *     → public/images/projects/un-forum-cover-960.webp
 *     → public/images/projects/un-forum-cover-1600.webp
 *
 * Usage: npm run images
 */
import { readdir, mkdir } from 'node:fs/promises';
import { join, relative, dirname, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'public/images';
const WIDTHS = [480, 960, 1600];
const EXT = /\.(jpe?g|png|webp|tiff?|avif)$/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    // brand/ holds the logo source, which `npm run logo` handles separately.
    if (entry.isDirectory()) {
      if (relative(SRC, path) !== 'brand') yield* walk(path);
    }
    else if (EXT.test(entry.name)) yield path;
  }
}

let count = 0;
for await (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  const { dir, name } = parse(rel);
  const outDir = join(OUT, dir);
  await mkdir(outDir, { recursive: true });

  for (const w of WIDTHS) {
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(outDir, `${name}-${w}.webp`));
  }
  await sharp(file).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(outDir, `${name}.webp`));
  console.log(`✓ ${rel} → ${join(outDir, name)}.webp (+${WIDTHS.join('/')}w)`);
  count++;
}
console.log(count ? `Done: ${count} image(s).` : `No images found in ${SRC}/.`);
