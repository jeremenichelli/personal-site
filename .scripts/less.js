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

// import config file
const config = require('./config.json')

const asyncPostCSS = async (css) => {
  // autoprefix and minimized on production
  const postCSSPlugins = [autoprefixer]
  if (ENVIRONMENT === 'production') postCSSPlugins.push(cssnano)

  return await postcss(postCSSPlugins).process(css, { from: undefined })
}

async function main() {
  console.log(`\nProcessing ${cyan('styles')} for ${magenta(ENVIRONMENT)}`)

  try {
    await asyncMakeDirectory(config.less.output)
    const filesList = await asyncGlob(config.less.files)

    // hoist sourcemap option
    const sourceMap = ENVIRONMENT !== 'production' && {
      sourceMapFileInline: true
    }

    // process files content to css
    filesList.map(async (source) => {
      const input = await asyncReadFile(source, 'utf-8')
      const paths = [path.dirname(source)]
      const options = { paths, sourceMap }

      // process less content
      const processed = await less.render(input, options)

      // process with Post CSS
      const { css } = await asyncPostCSS(processed.css)

      // write files
      const filename = path.basename(source).replace('.less', '.liquid')
      const output = config.less.output + filename
      await asyncWriteFile(output, css, 'utf-8')
      console.log(`${green(output)} file written`)
    })
  } catch (error) {
    console.log(red(error))
  }
}

main()
