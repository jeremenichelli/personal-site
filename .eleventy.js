const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const htmlmin = require('html-minifier')
const xmlPlugin = require('eleventy-xml-plugin')
const nbspFilter = require('eleventy-nbsp-filter')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItRenderer = new markdownIt()

module.exports = function(eleventyConfig) {
  /* FILTERS AND PLUGINS */
  eleventyConfig.addPlugin(xmlPlugin)
  eleventyConfig.addPlugin(syntaxHighlightPlugin)
  eleventyConfig.addFilter('nbsp', nbspFilter(2, 12))
  eleventyConfig.addFilter('markdownify', (str) => {
    return markdownItRenderer.renderInline(str)
  })

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

  eleventyConfig.addShortcode('codepen', (hash) => {
    return `<p data-height="300" data-theme-id="1" data-slug-hash="${hash}" data-default-tab="html,result" data-user="jeremenichelli" data-embed-version="2" data-pen-title="SVG ring" class="codepen"><em class="action--link">See this example <a aria-label="launch this code snippet" href="https://codepen.io/jeremenichelli/pen/${hash}/" rel="noopener noreferrer" target="_blank">in action</a></em></p><script defer src="https://static.codepen.io/assets/embed/ei.js"></script>`
  })

  /* LIQUID CONFIG */
  eleventyConfig.setLiquidOptions({ dynamicPartials: true })
  eleventyConfig.addLayoutAlias('home', 'layouts/home.liquid')
  eleventyConfig.addLayoutAlias('default', 'layouts/default.liquid')
  eleventyConfig.setUseGitIgnore(false)

  /* MARKDOWN */
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  }

  const markdownItAnchorOptions = {
    permalink: true,
    permalinkSymbol: '#',
    permalinkBefore: true,
    permalinkClass: 'heading--anchor',
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
