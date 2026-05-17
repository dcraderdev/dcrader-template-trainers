import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const PAGES_DIR = 'src/pages';

// Match <img tags that don't already have loading=... and add loading="lazy" decoding="async"
const IMG_TAG = /<img\b(?![^>]*\bloading=)([^>]*?)\/?>/g;

const pageFiles = (await readdir(PAGES_DIR)).filter((f) => f.endsWith('.astro'));
for (const f of pageFiles) {
  const p = path.join(PAGES_DIR, f);
  let text = await readFile(p, 'utf8');
  let changed = 0;
  text = text.replace(IMG_TAG, (m, attrs) => {
    changed++;
    return `<img loading="lazy" decoding="async"${attrs}/>`;
  });
  await writeFile(p, text);
  console.log(`${f}: ${changed} <img> updated`);
}
