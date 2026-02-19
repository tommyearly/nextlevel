/**
 * Export public/icon.svg to PNG at common sizes for use elsewhere
 * (favicons, app icons, social). Keeps original SVG on site; run: npm run icon:export
 */
const fs = require('fs');
const path = require('path');

const sizes = [32, 180, 192, 512];
const inputPath = path.join(__dirname, '..', 'public', 'icon.svg');
const svg = fs.readFileSync(inputPath, 'utf8');

async function run() {
  const sharp = require('sharp');
  for (const size of sizes) {
    const outPath = path.join(__dirname, '..', 'public', `icon-${size}.png`);
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`Wrote ${outPath}`);
  }
  console.log('Done. Use public/icon-32.png, icon-180.png, etc. elsewhere; keep icon.svg on site.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
