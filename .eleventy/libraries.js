const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const { markdownItExternalLinks } = require('./plugins');

const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true
};

const markdownItAnchorOptions = {
  level: [2, 3, 4],
  permalink: markdownItAnchor.permalink.linkInsideHeader({
    symbol: '',
    placement: 'before',
    ariaHidden: true,
    renderAttrs: () => ({ tabindex: '-1' })
  })
};

const md = markdownIt(markdownItOptions).use(
  markdownItAnchor,
  markdownItAnchorOptions
);

md.use(markdownItExternalLinks);

module.exports = { md };
