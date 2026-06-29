const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'assets', 'generic imgs');
const targetDir = path.join(__dirname, '..', 'public', 'assets', 'generic');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.avif'));

async function convert() {
  for (const file of files) {
    const baseName = path.basename(file, '.avif');
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(targetDir, `${baseName}.jpg`);

    try {
      await sharp(inputPath)
        .jpeg({ quality: 90, progressive: true })
        .toFile(outputPath);
      console.log(`Converted ${file} -> ${baseName}.jpg`);
    } catch (err) {
      console.error(`Failed to convert ${file}:`, err.message);
    }
  }
}

convert();
