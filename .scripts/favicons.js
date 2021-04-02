const { blue, green, red } = require('chalk');
const favicons = require('favicons');
const { asyncMakeDirectory, asyncWriteFile, asyncRimraf } = require('./_utils');

const site = require('../_data/site');
const entry = './src/images/site-logo.png';
const outputPath = './assets/favicon/';
const html = './_includes/generated/favicons.liquid';

const setup = {
  appName: site.title,
  appDescription: site.description,
  developerName: site.author,
  background: '#020210',
  path: '/assets/favicon/',
  online: true,
  icons: {
    android: false,
    appleIcon: false,
    appleStartup: false,
    favicons: true,
    windows: false,
    coast: false,
    firefox: false,
    yandex: false
  }
};

const asyncFavicons = (entry, setup) =>
  new Promise((res, rej) => {
    favicons(entry, setup, (err, result) => {
      if (err) return rej(err);
      res(result);
    });
  });

async function main() {
  console.log(`[${blue('.scripts/favicons')}] Generating assets`);

  try {
    // clean favicons directory and generate favicons
    await asyncRimraf(outputPath);
    await asyncMakeDirectory(outputPath, { recursive: true });
    const result = await asyncFavicons(entry, setup);

    // write favicons html content
    await asyncWriteFile(html, result.html.join('\n'), 'utf-8');
    console.log(
      `[${blue('.scripts/favicons')}] ${green('liquid partial')} file written`
    );

    // write favicons files
    for (const file of result.files) {
      const filename = `${outputPath}${file.name}`;
      await asyncWriteFile(filename, file.contents, 'utf-8');
      console.log(
        `[${blue('.scripts/favicons')}] ${green(file.name)} file written`
      );
    }

    // write favicon images files
    for (const image of result.images) {
      const imageName = `${outputPath}${image.name}`;
      await asyncWriteFile(imageName, image.contents, 'utf-8');
      console.log(
        `[${blue('.scripts/favicons')}] ${green(image.name)} file written`
      );
    }
  } catch (error) {
    console.log(
      `[${blue('.scripts/favicons')}] ${red(
        'An error occurred while generating assets'
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
