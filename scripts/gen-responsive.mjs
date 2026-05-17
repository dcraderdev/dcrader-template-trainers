import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = path.resolve('public/images/shared');
const WIDTHS = [320, 640, 1024, 1920];

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.jpg'));

let totalBytes = 0;
for (const file of files) {
  const full = path.join(SRC_DIR, file);
  const base = file.replace(/\.jpg$/, '');
  const meta = await sharp(full).metadata();
  for (const w of WIDTHS) {
    if (meta.width && w > meta.width) continue;
    const webpOut = path.join(SRC_DIR, `${base}-${w}.webp`);
    const avifOut = path.join(SRC_DIR, `${base}-${w}.avif`);
    const webpInfo = await sharp(full).resize({ width: w }).webp({ quality: 78 }).toFile(webpOut);
    const avifInfo = await sharp(full).resize({ width: w }).avif({ quality: 55 }).toFile(avifOut);
    totalBytes += webpInfo.size + avifInfo.size;
    console.log(`${base}-${w}: webp=${webpInfo.size} avif=${avifInfo.size}`);
  }
}
console.log(`TOTAL responsive bytes: ${totalBytes}`);
