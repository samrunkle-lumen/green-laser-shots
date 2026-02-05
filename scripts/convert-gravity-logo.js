const sharp = require('sharp');
const path = require('path');

async function convertGravityLogo() {
  const input = path.join(__dirname, '../data/partners/gravity/Gravity-Climate-logo.jpg');
  const output = path.join(__dirname, '../public/logos/gravity/gravity-horizontal-dark.png');

  try {
    await sharp(input)
      .resize({ width: 400, height: null, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(output);
    console.log(`✓ Converted Gravity logo to ${path.basename(output)}`);
  } catch (error) {
    console.error(`✗ Failed to convert Gravity logo:`, error.message);
  }
}

convertGravityLogo().then(() => {
  console.log('\nGravity logo conversion complete!');
}).catch(error => {
  console.error('Conversion failed:', error);
  process.exit(1);
});
