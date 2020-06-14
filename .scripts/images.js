const { cyan, green, red } = require('chalk')
const jimp = require('jimp')
const { asyncMakeDirectory } = require('./_utils')

const images = [
  {
    entry: './src/favicon/favicon.png',
    output: './assets/images/twitter-card-image.jpeg',
    quality: 85,
    resize: [300, 300]
  },
  {
    entry: './src/favicon/favicon.png',
    output: './assets/images/site-logo.jpeg',
    quality: 85,
    resize: [300, 300]
  }
]

async function main() {
  console.log(`\nProcessing ${cyan('images')}`)

  try {
    await asyncMakeDirectory('./assets/images', { recursive: true })

    for (const file of images) {
      // read image file with jimp
      const image = await jimp.read(file.entry)

      // process and write image file to assets
      image.quality(file.quality)
      image.resize(file.resize[0], file.resize[1])
      image.write(file.output)
      console.log(`${green(file.output)} image processed`)
    }
  } catch (error) {
    console.log(red(error))
  }
}

main()
