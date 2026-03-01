import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const WIDTHS = [640, 1024, 1536, 2048];
const QUALITY = 82;

const IMAGES = [
  { src: 'public/hero_screenshot.png', dest: 'public/optimized/hero_dark' },
  { src: 'public/hero_screenshot_light.png', dest: 'public/optimized/hero_light' },
];

async function run() {
  for (const { src, dest } of IMAGES) {
    const srcPath = resolve(root, src);
    const destDir = resolve(root, dest);

    if (!existsSync(srcPath)) {
      console.log(`  skip  ${src} (not found)`);
      continue;
    }

    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    const srcMtime = statSync(srcPath).mtimeMs;

    for (const width of WIDTHS) {
      const webpDest = resolve(destDir, `${width}w.webp`);

      if (existsSync(webpDest) && statSync(webpDest).mtimeMs > srcMtime) {
        console.log(`  skip  ${dest}/${width}w.webp (up to date)`);
        continue;
      }

      await sharp(srcPath)
        .resize(width)
        .webp({ quality: QUALITY })
        .toFile(webpDest);

      const kb = Math.round(statSync(webpDest).size / 1024);
      console.log(`  wrote ${dest}/${width}w.webp (${kb}KB)`);
    }

    // Compressed PNG fallback at max size
    const pngDest = resolve(destDir, '2048w.png');
    if (!existsSync(pngDest) || statSync(pngDest).mtimeMs <= srcMtime) {
      await sharp(srcPath)
        .resize(2048)
        .png({ compressionLevel: 9 })
        .toFile(pngDest);

      const kb = Math.round(statSync(pngDest).size / 1024);
      console.log(`  wrote ${dest}/2048w.png (${kb}KB)`);
    } else {
      console.log(`  skip  ${dest}/2048w.png (up to date)`);
    }
  }
  console.log('Done.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
