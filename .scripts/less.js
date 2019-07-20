// util modules
const path = require('path')
const chalk = require('chalk')
const {
  asyncGlob,
  asyncMakeDirectory,
  asyncReadFile,
  asyncWriteFile
} = require('./_utils')

// style processing modules
const less = require('less')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// import config file
const config = require('./config.json')

const ENVIRONMENT = process.env.NODE_ENV || 'production'

async function main() {
  console.log(
    `\nProcessing ${chalk.cyan('styles')} for ${chalk.magenta(ENVIRONMENT)}`
  )

  try {
    await asyncMakeDirectory(config.less.output)
    const filesList = await asyncGlob(config.less.files)
    const filesContent = await Promise.all(
      filesList.map((file) => asyncReadFile(file, 'utf-8'))
    )

    // process files content to css
    filesContent.map(async (content, index) => {
      // define output paths and filenames
      const options = {
        paths: [path.dirname(filesList[index])],
        sourceMap:
          ENVIRONMENT === 'production' ? null : { sourceMapFileInline: true }
      }
      const filename = `${path
        .basename(filesList[index])
        .replace('.less', '.liquid')}`
      const output = config.less.output + filename

      // process less content
      const processed = await less.render(content, options)

      // autoprefix and minimized on production
      const postCSSPlugins = [autoprefixer]
      if (ENVIRONMENT === 'production') postCSSPlugins.push(cssnano)

      const result = await postcss(postCSSPlugins).process(processed.css, {
        from: undefined
      })

      // write files
      await asyncWriteFile(output, result.css, 'utf-8')
      console.log(`${chalk.green(output)} file written`)
    })
  } catch (error) {
    console.log(chalk.red(error))
  }
}

main()
