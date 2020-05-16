const { green, red } = require('chalk')
const { asyncMakeDirectory } = require('./_utils')
const copy = require('cpy')

const fonts = {
  input: './src/fonts/*',
  output: './assets/fonts'
}

async function main() {
  try {
    await asyncMakeDirectory(fonts.output, { recursive: true })
    await copy(fonts.input, fonts.output)
    console.log(`${green('Font files')} copied`)
  } catch (error) {
    console.log(red(error))
  }
}

main()
