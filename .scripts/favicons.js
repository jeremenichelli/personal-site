const { cyan, green, red } = require('chalk')
const favicons = require('favicons')
const { asyncMakeDirectory, asyncWriteFile, asyncRimraf } = require('./_utils')

const site = require('../_data/site')
const entry = './src/images/site-logo.png'
const outputPath = './assets/favicon/'
const html = './_includes/favicons.liquid'

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
    await asyncRimraf(outputPath)
    await asyncMakeDirectory(outputPath, { recursive: true })
    const result = await asyncFavicons(entry, setup)

    // write favicons html content
    await asyncWriteFile(html, result.html.join('\n'), 'utf-8')
    console.log(`favicon ${green('html partial')} created`)

    // write favicons files
    for (const file of result.files) {
      const filename = `${outputPath}${file.name}`
      await asyncWriteFile(filename, file.contents, 'utf-8')
      console.log(`favicon ${green(file.name)} file created`)
    }

    // write favicon images files
    for (const image of result.images) {
      const imageName = `${outputPath}${image.name}`
      await asyncWriteFile(imageName, image.contents, 'utf-8')
      console.log(`favicon ${green(image.name)} image created`)
    }
  } catch (error) {
    console.log(red(error))
  }
}

main()
