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
  permalinkBefore: true,
  permalinkClass: 'heading__anchor',
  level: [2, 3, 4]
}

const markdownLib = markdownIt(markdownItOptions).use(
  markdownItAnchor,
  markdownItAnchorOptions
)

module.exports.md = markdownLib
