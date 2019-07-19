const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')
const xmlPlugin = require('eleventy-xml-plugin')

module.exports = function(eleventyConfig) {
  // add xml plugin
  eleventyConfig.addPlugin(xmlPlugin)

  // add highlighting
  eleventyConfig.addPlugin(pluginSyntaxHighlight)

  // liquid config
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  })

  // preprocess collections
  eleventyConfig.addCollection('blogposts', (collection) => {
    return collection
      .getFilteredByTag('post')
      .reverse()
      .slice(0, 8)
  })

  eleventyConfig.addCollection('archive', (collection) => {
    return collection.getFilteredByTag('post').reverse()
  })

  eleventyConfig.addCollection('all', function(collection) {
    return collection.getAll()
  })

  // shortcodes
  eleventyConfig.addShortcode('actionLink', (link) => {
    return `<em>Check out this example <a aria-label="launch this code snippet" href=${link} rel="noopener noreferrer">in action</a>.</em>`
  })

  // set layout alias
  eleventyConfig.addLayoutAlias('home', 'layouts/home.liquid')
  eleventyConfig.addLayoutAlias('default', 'layouts/default.liquid')

  // copy assets folder and public files
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('robots.txt')

  // minify html
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      })

      return minified
    }

    return content
  })

  // do not ignore generated assets
  eleventyConfig.setUseGitIgnore(false)

  // return base config
  return {
    input: './',
    output: './_site',
    passthroughFileCopy: true
  }
}
