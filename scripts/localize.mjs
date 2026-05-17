import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = 'src/data';
const PAGES_DIR = 'src/pages';
const LAYOUT_FILE = 'src/layouts/BaseLayout.astro';

// For data files: replace any unsplash photo URL with local 640.webp (good for thumb sizes)
// For pages: replace external src with local fallback file (we'll then later convert hero ones to <ResponsiveImage>)

const PHOTO_RE = /https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9_-]+)\?[^"']*/g;

function localFromId(id, width = 640) {
  return `/images/shared/photo-${id}-${width}.webp`;
}

// 1. Data files — replace with 640.webp (used as before/after thumbs)
const dataFiles = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.ts'));
for (const f of dataFiles) {
  const p = path.join(DATA_DIR, f);
  let text = await readFile(p, 'utf8');
  text = text.replace(PHOTO_RE, (_m, id) => {
    // photo field uses 1024, before/after uses 640
    return localFromId(id, 640);
  });
  // Coach photo lines (key "photo:") should be 1024
  text = text.replace(/photo: "\/images\/shared\/photo-([a-zA-Z0-9_-]+)-640\.webp"/g, (_m, id) =>
    `photo: "/images/shared/photo-${id}-1024.webp"`
  );
  await writeFile(p, text);
  console.log('data:', f);
}

// 2. Pages — also generic replacement for now (we'll then upgrade specific hero <img>'s later)
const pageFiles = (await readdir(PAGES_DIR)).filter((f) => f.endsWith('.astro'));
for (const f of pageFiles) {
  const p = path.join(PAGES_DIR, f);
  let text = await readFile(p, 'utf8');
  text = text.replace(PHOTO_RE, (_m, id) => localFromId(id, 1920));
  await writeFile(p, text);
  console.log('page:', f);
}

console.log('done');
