const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  const conversions = [
    {
      input: path.join(__dirname, '../public/logos/lumen/logo-black.svg'),
      output: path.join(__dirname, '../public/logos/lumen/logo-black.png'),
      width: 400,
    },
    {
      input: path.join(__dirname, '../public/logos/watershed/watershed-horizontal-dark.svg'),
      output: path.join(__dirname, '../public/logos/watershed/watershed-horizontal-dark.png'),
      width: 340,
    },
  ];

  for (const { input, output, width } of conversions) {
    try {
      await sharp(input)
        .resize({ width, height: null, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toFile(output);
      console.log(`✓ Converted ${path.basename(input)} to ${path.basename(output)}`);
    } catch (error) {
      console.error(`✗ Failed to convert ${path.basename(input)}:`, error.message);
    }
  }
}

convertSvgToPng().then(() => {
  console.log('\nLogo conversion complete!');
}).catch(error => {
  console.error('Conversion failed:', error);
  process.exit(1);
});
