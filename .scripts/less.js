// util modules
const path = require('path');
const { red, blue, cyan, green } = require('kleur');
const {
  asyncMakeDirectory,
  asyncReadFile,
  asyncWriteFile,
  ENVIRONMENT
} = require('./_utils');

// style processing modules
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const filesList = [
  {
    input: './src/less/home.less',
    output: './_includes/generated/styles/home.liquid'
  },
  {
    input: './src/less/blog.less',
    output: './_includes/generated/styles/blog.liquid'
  },
  {
    input: './src/less/post.less',
    output: './_includes/generated/styles/post.liquid'
  },
  {
    input: './src/less/archive.less',
    output: './_includes/generated/styles/archive.liquid'
  },
  {
    input: './src/less/about.less',
    output: './_includes/generated/styles/about.liquid'
  },
  {
    input: './src/less/talks.less',
    output: './_includes/generated/styles/talks.liquid'
  },
  {
    input: './src/less/404.less',
    output: './_includes/generated/styles/404.liquid'
  }
];

const asyncPostCSS = async (css, env) => {
  const postCSSPlugins = [autoprefixer];
  if (env === 'production') postCSSPlugins.push(cssnano);

  return await postcss(postCSSPlugins).process(css, { from: undefined });
};

async function main(env = ENVIRONMENT) {
  console.log(`[${blue('.scripts/less')}] Generating styles for ${cyan(env)}`);

  const sourceMap = env !== 'production' && {
    sourceMapFileInline: true,
    outputSourceFiles: true
  };

  // process files content to css
  for (const file of filesList) {
    const input = await asyncReadFile(file.input, 'utf-8');
    const paths = [path.dirname(file.input)];
    const options = { paths, sourceMap };

    // process less content
    let processed;

    try {
      processed = await less.render(input, options);
    } catch (error) {
      console.log(
        `[${blue('.scripts/less')}] ${red(
          'An error occurred while processing styles'
        )}`,
        '\n',
        error.message
      );
    }

    // process with Post CSS
    const { css } = await asyncPostCSS(processed.css, env);

    // write files
    await asyncMakeDirectory(path.dirname(file.output), { recursive: true });
    await asyncWriteFile(file.output, css, 'utf-8');
    console.log(
      `[${blue('.scripts/less')}] ${green(file.output)} file written`
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
