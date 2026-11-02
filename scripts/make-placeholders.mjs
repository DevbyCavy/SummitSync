/**
 * Generates branded WebP placeholders (brand-colour gradient + soft glow + "S" mark) for every
 * image the site references, so the layout looks intentional and nothing 404s before real
 * photos arrive (TODO(open): §13.4).
 *
 * Real photos are never overwritten: only missing files, or files this script created earlier
 * (tracked in public/images/.placeholders.json), are (re)generated. Running `npm run images`
 * on a real photo replaces the placeholder and it drops out of the manifest on the next run.
 *
 * Usage: npm run placeholders   (run `npm run logo` first — the mark comes from it)
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const WIDTHS = [480, 960, 1600];
const MANIFEST = 'public/images/.placeholders.json';
const MARK = 'public/images/brand/mark-mask.png';

// Gradient palettes: [from, to, glow colour, mark opacity]
const DARK = [
  ['#4B2852', '#24122A', '#F57627', 0.1],
  ['#5D3E64', '#2E1833', '#F6843D', 0.12],
  ['#4B2852', '#8A3F3A', '#F57627', 0.1],
  ['#3A1F40', '#4B2852', '#F6843D', 0.14],
  ['#2E1833', '#5D3E64', '#F57627', 0.1],
];
const WARM = [['#F57627', '#C85A14', '#FEF4EE', 0.16]];
const LIGHT = [
  ['#FEF4EE', '#F8D9C4', '#F57627', 0.14],
  ['#FFF8F3', '#F3D3D9', '#4B2852', 0.1],
  ['#FEF4EE', '#EBD9EE', '#F57627', 0.12],
];

const read = (f) => JSON.parse(readFileSync(join('src/content', f), 'utf8'));

// [path, width, height, palette]
const images = [
  ['/images/hero/hero.webp', 1100, 560, ['#4B2852', '#1E1023', '#F57627', 0.12]],
  ['/images/about/about.webp', 640, 400, ['#5D3E64', '#2E1833', '#F57627', 0.12]],
  ...read('services.json')
    .cards.filter((s) => s.image)
    .map((s, i) => [s.image, 600, 600, LIGHT[i % LIGHT.length]]),
  ...read('projects.json').flatMap((p, i) =>
    [p.cover, ...(p.gallery || [])].map((src, j) => [src, 600, 800, i === 3 && j === 0 ? WARM[0] : DARK[(i + j) % DARK.length]])
  ),
  ...read('magazine.json').map((m) => [m.cover, 600, 800, WARM[0]]),
];

const markB64 = existsSync(MARK) ? readFileSync(MARK).toString('base64') : null;
if (!markB64) console.warn(`! ${MARK} missing — run \`npm run logo\` first for the S mark overlay.`);

/** Seeded so each image gets a stable but different composition. */
function rand(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function svgFor(src, w, h, [from, to, glow, markOpacity]) {
  const r = rand(src);
  const gx = (20 + r() * 60).toFixed(1);
  const gy = (15 + r() * 50).toFixed(1);
  const angle = Math.round(r() * 90);
  const markSize = Math.max(w, h) * (0.7 + r() * 0.3);
  const mx = w - markSize * (0.55 + r() * 0.2);
  const my = h - markSize * (0.6 + r() * 0.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${gx}%" cy="${gy}%" r="65%">
      <stop offset="0" stop-color="${glow}" stop-opacity=".45"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${markB64 ? `<image href="data:image/png;base64,${markB64}" x="${mx}" y="${my}" width="${markSize}" height="${markSize}" opacity="${markOpacity}" preserveAspectRatio="xMidYMid meet"/>` : ''}
</svg>`;
}

async function render(file, svg, width) {
  await mkdir(dirname(file), { recursive: true });
  await sharp(Buffer.from(svg)).resize({ width }).webp({ quality: 72 }).toFile(file);
}

const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
const next = {};
let made = 0;

for (const [src, w, h, palette] of images) {
  const base = join('public', src);
  // Regenerate only if missing, or still the exact placeholder we wrote last time.
  const ours = existsSync(base) && manifest[src] === statSync(base).size;
  if (existsSync(base) && !ours) continue;

  const svg = svgFor(src, w, h, palette);
  await render(base, svg, w);
  for (const width of WIDTHS) await render(base.replace(/\.webp$/, `-${width}.webp`), svg, width);
  next[src] = statSync(base).size;
  console.log(`placeholder → ${src}`);
  made++;
}

await writeFile(MANIFEST, JSON.stringify(next, null, 2) + '\n');
console.log(made ? `Created ${made} placeholder(s).` : 'All images are real photos — nothing to do.');
