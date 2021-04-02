const { blue, red } = require('chalk');
const { asyncMakeDirectory } = require('./_utils');
const copy = require('cpy');

const fonts = {
  input: './src/fonts/*.{woff,woff2}',
  output: './assets/fonts'
};

async function main() {
  console.log(`[${blue('.scripts/fonts')}] Copying font files`);

  try {
    await asyncMakeDirectory(fonts.output, { recursive: true });
    await copy(fonts.input, fonts.output);
    console.log(`[${blue('.scripts/fonts')}] Files copied`);
  } catch (error) {
    console.log(
      `[${blue('.scripts/fonts')}] ${red(
        'An error occurred while copying files'
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
