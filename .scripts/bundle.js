const { red, blue, cyan, green, gray } = require('kleur');
const { asyncMakeDirectory, ENVIRONMENT } = require('./_utils.js');
const { statSync } = require('fs');
const path = require('path');

const { rollup } = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');

const bundles = [
  {
    input: './src/js/inline.js',
    output: './_includes/generated/scripts/inline.liquid'
  },
  {
    input: './src/js/main.js',
    output: './assets/js/main.js'
  },
  {
    input: './src/js/instant-page.js',
    output: './assets/js/instant-page.js'
  }
];

async function main(env = ENVIRONMENT) {
  const baseConfig = {
    plugins: [
      // replace environment
      replace({
        __DEV__: env === 'production' ? 'false' : 'true'
      }),
      // resolve node modules
      resolve(),
      // support commonjs
      commonjs({
        include: 'node_modules/**'
      })
    ]
  };

  // uglify bundle for production
  if (env === 'production') {
    baseConfig.plugins.push(
      terser({
        mangle: true,
        compress: {
          dead_code: true,
          passes: 2
        }
      })
    );
  }

  console.log(
    `[${blue('.scripts/bundle')}] Generating bundles for ${cyan(env)}`
  );

  try {
    const format = 'iife';
    const sourcemap = env === 'development' ? 'inline' : false;

    for (const bundle of bundles) {
      const { input, output } = bundle;

      await asyncMakeDirectory(path.dirname(output), { recursive: true });
      const result = await rollup({ input, ...baseConfig });
      await result.write({ file: output, format, sourcemap });

      const fileSize = statSync(output).size + 'B';
      console.log(
        `[${blue('.scripts/bundle')}] ${green(output)} file written ${gray(
          fileSize
        )}`
      );
    }
  } catch (error) {
    console.log(
      `[${blue('.scripts/bundle')}] ${red('An error occurred while bundling')}`,
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
