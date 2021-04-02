const browserSync = require('browser-sync');
const { red, blue } = require('kleur');
const { asyncExec } = require('./_utils');
const bundle = require('./bundle');
const less = require('./less');
const favicons = require('./favicons');
const fonts = require('./fonts');
const images = require('./images');

const server = browserSync.create();

async function main() {
  try {
    // Execute initial Eleventy build before starting server
    console.log(`[${blue('.scripts/serve')}] Running initial build...`, '\n');

    await bundle('development');
    await less('development');
    await favicons();
    await fonts();
    await images();

    console.log(`[${blue('.scripts/serve')}] Running eleventy build`, '\n');
    await asyncExec('npx eleventy');

    console.log(`[${blue('.scripts/serve')}] Initial build successful`, '\n');

    server.init({
      server: { baseDir: './_site' },
      port: 8080,
      watch: false,
      notify: false,
      open: false,
      ghostMode: false,
      minify: false
    });

    // Watch content files, trigger Eleventy build and browser reload.
    server.watch('**/*.{md,liquid}').on('change', async function (file) {
      // We ignore generated partials as other watch scripts take care of them.
      if (file.includes('generated')) {
        return;
      }

      console.log(''); // Insert line break to create space from Browsersync messages.
      console.log(`[${blue('.scripts/serve')}] Content files changed`, '\n');

      try {
        console.log(`[${blue('.scripts/serve')}] Running eleventy build`, '\n');
        await asyncExec('npx eleventy');
        server.reload();
      } catch (error) {
        console.log(
          `[${blue('.scripts/serve')}] ${red('Eleventy build failed')}`,
          '\n',
          error.message
        );
      }
    });

    // Watch styles files, trigger Eleventy build and browser reload.
    server.watch('./src/**/*.less').on('change', async function () {
      console.log(''); // Insert line break to create space from Browsersync messages.
      console.log(`[${blue('.scripts/serve')}] Styles changed`, '\n');

      try {
        await less('development');

        console.log(`[${blue('.scripts/serve')}] Running eleventy build`, '\n');
        await asyncExec('npx eleventy');
        server.reload();
      } catch (error) {
        console.log(
          `[${blue('.scripts/serve')}] ${red('Styles processing failed')}`,
          '\n',
          error.message
        );
      }
    });

    // Watch scripts, trigger bundling and browser reload.
    server.watch('./src/**/*.js').on('change', async function () {
      console.log(''); // Insert line break to create space from Browsersync messages.
      console.log(`[${blue('.scripts/serve')}] Scripts changed`, '\n');

      try {
        await bundle('development');

        console.log(`[${blue('.scripts/serve')}] Running eleventy build`, '\n');
        await asyncExec('npx eleventy');
        server.reload();
      } catch (error) {
        console.log(
          `[${blue('.scripts/serve')}] ${red('Scripts bundling failed')}`,
          '\n',
          error.message
        );
      }
    });
  } catch (error) {
    console.log(
      `[${blue('.scripts/serve')}] ${red('Serving failed')}`,
      '\n',
      error.message
    );
  }
}

// Detect call from command line and run or export main method.
if (require.main === module) {
  main();
} else {
  module.exports = main;
}
