const nbspFilter = require('eleventy-nbsp-filter')
const markdownIt = require('markdown-it')
const markdownItRenderer = new markdownIt()

const nbsp = nbspFilter(2, 12)
const markdownify = (str) => markdownItRenderer.renderInline(str)

module.exports.nbsp = nbsp
module.exports.markdownify = markdownify
