// util modules
const path = require('path')
const { cyan, green, magenta, red } = require('chalk')
const {
  asyncGlob,
  asyncMakeDirectory,
  asyncReadFile,
  asyncWriteFile,
  ENVIRONMENT
} = require('./_utils')

// style processing modules
const less = require('less')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const filesList = [
  {
    input: './src/less/home.less',
    output: './_includes/styles/home.liquid'
  },
  {
    input: './src/less/blog.less',
    output: './_includes/styles/blog.liquid'
  },
  {
    input: './src/less/post.less',
    output: './_includes/styles/post.liquid'
  },
  {
    input: './src/less/archive.less',
    output: './_includes/styles/archive.liquid'
  },
  {
    input: './src/less/about.less',
    output: './_includes/styles/about.liquid'
  },
  {
    input: './src/less/talks.less',
    output: './_includes/styles/talks.liquid'
  },
  {
    input: './src/less/404.less',
    output: './_includes/styles/404.liquid'
  },
  {
    input: './src/less/highlighting.less',
    output: './assets/css/highlighting.css'
  }
]

const asyncPostCSS = async (css) => {
  const postCSSPlugins = [autoprefixer]
  if (ENVIRONMENT === 'production') postCSSPlugins.push(cssnano)

  return await postcss(postCSSPlugins).process(css, { from: undefined })
}

async function main() {
  console.log(`\nProcessing ${cyan('styles')} for ${magenta(ENVIRONMENT)}`)

  const sourceMap = ENVIRONMENT !== 'production' && {
    sourceMapFileInline: true,
    outputSourceFiles: true
  }

  // process files content to css
  for (const file of filesList) {
    const input = await asyncReadFile(file.input, 'utf-8')
    const paths = [path.dirname(file.input)]
    const options = { paths, sourceMap }

    // process less content
    let processed

    try {
      processed = await less.render(input, options)
    } catch (error) {
      console.error(red(error))
    }

    // process with Post CSS
    const { css } = await asyncPostCSS(processed.css)

    // write files
    await asyncMakeDirectory(path.dirname(file.output))
    await asyncWriteFile(file.output, css, 'utf-8')
    console.log(`${green(file.output)} file written`)
  }
}

main()
