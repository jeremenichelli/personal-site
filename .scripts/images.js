const { blue, green, red } = require('kleur');
const jimp = require('jimp');
const { asyncMakeDirectory } = require('./_utils');

const images = [
  {
    entry: './src/images/site-logo.png',
    output: './assets/images/site-logo.jpg',
    quality: 85,
    resize: [300, 300]
  },
  {
    entry: './src/images/og-me.jpg',
    output: './assets/images/og-me.jpg',
    quality: 85,
    resize: [1200, 672]
  }
];

async function main() {
  console.log(`[${blue('.scripts/images')}] Processing image files`);

  try {
    await asyncMakeDirectory('./assets/images', { recursive: true });

    for (const file of images) {
      // read image file with jimp
      const image = await jimp.read(file.entry);

      // process and write image file to assets
      image.quality(file.quality);
      image.resize(file.resize[0], file.resize[1]);
      image.write(file.output);
      console.log(
        `[${blue('.scripts/images')}] ${green(file.output)} file written`
      );
    }
  } catch (error) {
    console.log(
      `[${blue('.scripts/images')}] ${red(
        'An error occurred while processing files'
      )}`,
      '\n',
      error.message
    );
  }

  // Print final line break.
  console.log('');
}

// Detect call from command line and run or export main method.
if (require.main === module) {
  main();
} else {
  module.exports = main;
}
