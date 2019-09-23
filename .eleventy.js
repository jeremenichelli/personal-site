const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')
const xmlPlugin = require('eleventy-xml-plugin')
const nbspFilter = require('eleventy-nbsp-filter')

module.exports = function(eleventyConfig) {
  /* FILTERS AND PLUGINS */
  eleventyConfig.addPlugin(xmlPlugin)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addFilter('nbsp', nbspFilter(2, 12))

  /* COLLECTIONS */
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

  /* SHORT CODES */
  eleventyConfig.addShortcode('actionLink', (link) => {
    return `<em class="action--link">See this example <a aria-label="launch this code snippet" href=${link} rel="noopener noreferrer" target="_blank">in action</a></em>`
  })

  /* LIQUID CONFIG */
  eleventyConfig.setLiquidOptions({ dynamicPartials: true })
  eleventyConfig.addLayoutAlias('home', 'layouts/home.liquid')
  eleventyConfig.addLayoutAlias('default', 'layouts/default.liquid')

  eleventyConfig.setUseGitIgnore(false)

  /* MARKDOWN */
  const markdownIt = require('markdown-it')
  const markdownItAnchor = require('markdown-it-anchor')
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  }
  const markdownItAnchorOptions = {
    permalink: true,
    permalinkSymbol: '#',
    level: [2, 3, 4]
  }
  const markdownLib = markdownIt(markdownItOptions).use(
    markdownItAnchor,
    markdownItAnchorOptions
  )
  eleventyConfig.setLibrary('md', markdownLib)

  /* COPY */
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('robots.txt')

  /* HTML */
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

  // return base config
  return {
    input: './',
    output: './_site',
    passthroughFileCopy: true
  }
}
