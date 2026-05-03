import sharp from 'sharp';
import { existsSync, mkdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const DEFAULT_WIDTHS = [640, 1024, 1536, 2048];
const QUALITY = 82;

const IMAGES = [
  { src: 'public/app_main.png', dest: 'public/optimized/app_main', widths: [640, 1024, 1536, 2048] },
  { src: 'public/ipad_main.png', dest: 'public/optimized/ipad_main', widths: [640, 1024, 1536, 2048] },
  { src: 'public/mobile_phone.png', dest: 'public/optimized/mobile_phone', widths: [480, 720, 1080, 1320] },
];

async function run() {
  for (const entry of IMAGES) {
    const { src, dest } = entry;
    const widths = entry.widths ?? DEFAULT_WIDTHS;
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

    for (const width of widths) {
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
    const maxWidth = widths[widths.length - 1];
    const pngDest = resolve(destDir, `${maxWidth}w.png`);
    if (!existsSync(pngDest) || statSync(pngDest).mtimeMs <= srcMtime) {
      await sharp(srcPath)
        .resize(maxWidth)
        .png({ compressionLevel: 9 })
        .toFile(pngDest);

      const kb = Math.round(statSync(pngDest).size / 1024);
      console.log(`  wrote ${dest}/${maxWidth}w.png (${kb}KB)`);
    } else {
      console.log(`  skip  ${dest}/${maxWidth}w.png (up to date)`);
    }
  }
  console.log('Done.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
