const syntaxHighlightPlugin = require('@11ty/eleventy-plugin-syntaxhighlight')
const xmlPlugin = require('eleventy-xml-plugin')

const { markdownify, nbsp } = require('./.eleventy/filters')
const { all, archive, blogposts } = require('./.eleventy/collections')
const { actionLink, codepen } = require('./.eleventy/shortcodes')
const { md } = require('./.eleventy/libraries')
const { htmlmin } = require('./.eleventy/transforms')

module.exports = function (eleventyConfig) {
  /* LIQUID AND GLOBAL CONFIG */
  eleventyConfig.setLiquidOptions({ dynamicPartials: true })
  eleventyConfig.addLayoutAlias('base', 'layouts/base.liquid')
  eleventyConfig.addLayoutAlias('home', 'layouts/home.liquid')
  eleventyConfig.addLayoutAlias('default', 'layouts/default.liquid')
  eleventyConfig.setUseGitIgnore(false)

  /* PLUGINS */
  eleventyConfig.addPlugin(xmlPlugin)
  eleventyConfig.addPlugin(syntaxHighlightPlugin)

  /* FILTERS */
  eleventyConfig.addFilter('nbsp', nbsp)
  eleventyConfig.addFilter('markdownify', markdownify)

  /* COLLECTIONS */
  eleventyConfig.addCollection('blogposts', blogposts)
  eleventyConfig.addCollection('archive', archive)
  eleventyConfig.addCollection('all', all)

  /* SHORT CODES */
  eleventyConfig.addShortcode('actionLink', actionLink)
  eleventyConfig.addShortcode('codepen', codepen)

  /* MARKDOWN */
  eleventyConfig.setLibrary('md', md)

  /* COPY */
  eleventyConfig.addPassthroughCopy('assets')
  eleventyConfig.addPassthroughCopy('robots.txt')

  /* HTML */
  eleventyConfig.addTransform('htmlmin', htmlmin)

  // return base config
  return {
    input: './',
    output: './_site',
    passthroughFileCopy: true
  }
}
