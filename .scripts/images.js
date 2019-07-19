const chalk = require('chalk')
const jimp = require('jimp')
const { asyncMakeDirectory } = require('./_utils')

// import config file
const config = require('./config.json')

async function main() {
  console.log(`processing ${chalk.blue('images')}\n`)

  try {
    await asyncMakeDirectory('./assets/images')
    config.images.map(async (file) => {
      // read image file with jimp
      const image = await jimp.read(file.entry)

      // process and write image file to assets
      image.quality(file.quality)
      image.resize(file.resize[0], file.resize[1])
      image.write(file.output)
      console.log(`${chalk.green(file.output)} image processed\n`)
    })
  } catch (error) {
    console.log(chalk.red(error))
  }
}

main()
