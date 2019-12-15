const { cyan, green, red } = require('chalk')
const favicons = require('favicons')
const { asyncMakeDirectory, asyncWriteFile, asyncRimraf } = require('./_utils')

// import config file
const config = require('./config.json')
const site = require('../_data/site.json')

const setup = {
  appName: 'jeremenichelli.io',
  appDescription: site.description,
  developerName: site.author,
  background: '#020210',
  path: config.favicon.path,
  online: false,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: true,
    coast: false,
    firefox: false,
    yandex: false
  }
}

const asyncFavicons = (entry, setup) =>
  new Promise((res, rej) => {
    favicons(entry, setup, (err, result) => {
      if (err) return rej(err)
      res(result)
    })
  })

async function main() {
  console.log(`\nGenerating ${cyan('favicons')} assets`)

  try {
    // clean favicons directory and generate favicons
    await asyncRimraf(config.favicon.output)
    await asyncMakeDirectory(config.favicon.output, { recursive: true })
    const result = await asyncFavicons(config.favicon.entry, setup)

    // write favicons html content
    await asyncWriteFile(config.favicon.html, result.html.join('\n'), 'utf-8')
    console.log(`favicon ${green('html partial')} created`)

    // write favicons files
    result.files.map(async (file) => {
      const filename = `${config.favicon.output}${file.name}`
      await asyncWriteFile(filename, file.contents, 'utf-8')
      console.log(`favicon ${green(file.name)} file created`)
    })

    // write favicon images files
    result.images.map(async (image) => {
      const imagename = `${config.favicon.output}${image.name}`
      await asyncWriteFile(imagename, image.contents, 'utf-8')
      console.log(`favicon ${green(image.name)} image created`)
    })
  } catch (error) {
    console.log(red(error))
  }
}

main()
