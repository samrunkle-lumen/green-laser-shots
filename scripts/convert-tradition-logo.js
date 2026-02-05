const sharp = require('sharp');
const path = require('path');

async function convertTraditionLogo() {
  const input = path.join(__dirname, '../data/partners/tradition/1593291580f96e581f08c59e070a.jpg');
  const output = path.join(__dirname, '../public/logos/tradition/tradition-horizontal-dark.png');

  try {
    await sharp(input)
      .resize({ width: 400, height: null, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(output);
    console.log(`✓ Converted Tradition logo to ${path.basename(output)}`);
  } catch (error) {
    console.error(`✗ Failed to convert Tradition logo:`, error.message);
  }
}

convertTraditionLogo().then(() => {
  console.log('\nTradition logo conversion complete!');
}).catch(error => {
  console.error('Conversion failed:', error);
  process.exit(1);
});
