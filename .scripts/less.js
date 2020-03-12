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

const filesGlob = './src/less/{home,blog,post,archive,about,talks,404}.less'
const outputPath = './_includes/styles/'

const asyncPostCSS = async (css) => {
  const postCSSPlugins = [autoprefixer]
  if (ENVIRONMENT === 'production') postCSSPlugins.push(cssnano)

  return await postcss(postCSSPlugins).process(css, { from: undefined })
}

async function main() {
  console.log(`\nProcessing ${cyan('styles')} for ${magenta(ENVIRONMENT)}`)

  await asyncMakeDirectory(outputPath)
  const filesList = await asyncGlob(filesGlob)

  const sourceMap = ENVIRONMENT !== 'production' && {
    sourceMapFileInline: true
  }

  // process files content to css
  for (const source of filesList) {
    const input = await asyncReadFile(source, 'utf-8')
    const paths = [path.dirname(source)]
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
    const filename = path.basename(source).replace('.less', '.liquid')
    const output = outputPath + filename
    await asyncWriteFile(output, css, 'utf-8')
    console.log(`${green(output)} file written`)
  }
}

main()
