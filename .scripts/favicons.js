const fs = require('fs')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const chalk = require('chalk')
const favicons = require('favicons')
const { asyncMakeDirectory, asyncWriteFile } = require('./_utils')

// import config file
const config = require('./config.json')

const setup = {
  appName: 'jeremenichelli.io',
  appDescription: 'Personal site',
  developerName: 'Jeremias Menichelli',
  background: '#010120',
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

const asyncRimraf = (path) =>
  new Promise((res, rej) => {
    rimraf(path, (err) => {
      if (err) return rej(err)
      res()
    })
  })

const asyncFavicons = (entry, setup) =>
  new Promise((res, rej) => {
    favicons(entry, setup, (err, result) => {
      if (err) return rej(err)
      res(result)
    })
  })

async function main() {
  console.log(`generating ${chalk.blue('favicons')} assets\n`)

  // clean favicons directory and generate favicons
  await asyncRimraf(config.favicon.output)
  await asyncMakeDirectory(config.favicon.output)
  const result = await asyncFavicons(config.favicon.entry, setup)

  // write favicons html content
  await asyncWriteFile(config.favicon.html, result.html.join('\n'), 'utf-8')
  console.log(`favicon ${chalk.magenta('html partial')} created`)

  // write favicons files
  result.files.map(async (file) => {
    const filename = `${config.favicon.output}${file.name}`
    await asyncWriteFile(filename, file.contents, 'utf-8')
    console.log(`favicon ${chalk.magenta(file.name)} file created`)
  })

  // write favicon images files
  result.images.map(async (image) => {
    const imagename = `${config.favicon.output}${image.name}`
    await asyncWriteFile(imagename, image.contents, 'utf-8')
    console.log(`favicon ${chalk.green(image.name)} image created`)
  })
}

main()
