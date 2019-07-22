const chalk = require('chalk')
const { asyncMakeDirectory } = require('./_utils.js')

// rollup pacakges
const { rollup } = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const buble = require('rollup-plugin-buble')

// import config file
const config = require('./config.json')

const ENVIRONMENT = process.env.NODE_ENV || 'production'

// base input config for bundles
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
  console.log(
    `\nGenerating ${chalk.cyan('bundles')} for ${chalk.magenta(ENVIRONMENT)}`
  )
  try {
    await asyncMakeDirectory('_includes/scripts')
    const bundles = config.bundles.map(({ input }) =>
      rollup({ input, ...baseConfig })
    )
    const results = await Promise.all(bundles)

    // write files
    results.map((bundle, index) => {
      const file = config.bundles[index].output
      const format = 'iife'
      const sourcemap = ENVIRONMENT === 'development' ? 'inline' : false

      bundle.write({ file, format, sourcemap })
      console.log(`${chalk.green(file)} file written`)
    })
  } catch (error) {
    console.log(chalk.red(error))
  }
}

main()
