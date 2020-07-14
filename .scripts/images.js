const { cyan, green, red } = require('chalk')
const jimp = require('jimp')
const { asyncMakeDirectory } = require('./_utils')

const images = [
  {
    entry: './src/images/site-logo.png',
    output: './assets/images/site-logo.jpg',
    quality: 85,
    resize: [300, 300]
  },
  {
    entry: './src/images/og-me.jpg',
    output: './assets/images/og-me.jpg',
    quality: 85,
    resize: [1200, 672]
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
