const { cyan, green, magenta, red } = require('chalk')
const { asyncMakeDirectory, ENVIRONMENT } = require('./_utils.js')
const { statSync } = require('fs')

// rollup pacakges
const { rollup } = require('rollup')
const commonjs = require('@rollup/plugin-commonjs')
const replace = require('@rollup/plugin-replace')
const resolve = require('@rollup/plugin-node-resolve')
const buble = require('@rollup/plugin-buble')
const { terser } = require('rollup-plugin-terser')

const bundles = [
  {
    input: './src/js/inline.js',
    output: './_includes/scripts/inline.liquid'
  },
  {
    input: './src/js/main.js',
    output: './assets/js/main.js'
  },
  {
    input: './src/js/highlighting.js',
    output: './assets/js/highlighting.js'
  }
]

const baseConfig = {
  plugins: [
    // replace environment
    replace({
      __DEV__: ENVIRONMENT === 'production' ? 'false' : 'true'
    }),
    // resolve node modules
    resolve(),
    // support commonjs
    commonjs({
      include: 'node_modules/**'
    }),
    buble()
  ]
}

// uglify bundle for production
if (ENVIRONMENT === 'production') {
  baseConfig.plugins.push(
    terser({
      mangle: true,
      compress: {
        dead_code: true,
        passes: 2
      }
    })
  )
}

async function main() {
  console.log(`\nGenerating ${cyan('bundles')} for ${magenta(ENVIRONMENT)}`)

  try {
    await asyncMakeDirectory('_includes/scripts', { recursive: true })
    await asyncMakeDirectory('assets/js', { recursive: true })

    const format = 'iife'
    const sourcemap = ENVIRONMENT === 'development' ? 'inline' : false

    for (const bundle of bundles) {
      const { input, output } = bundle

      const result = await rollup({ input, ...baseConfig })
      await result.write({ file: output, format, sourcemap })

      const fileSize = statSync(output).size + 'B'
      console.log(`${green(output)} file written ${cyan(fileSize)}`)
    }
  } catch (error) {
    console.log(red(error))
  }
}

main()
