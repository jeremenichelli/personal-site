const htmlMinifier = require('html-minifier');

const htmlmin = (content, outputPath) => {
  if (outputPath.endsWith('.html')) {
    const minified = htmlMinifier.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      processScripts: ['application/ld+json']
    });

    return minified;
  }

  return content;
};

module.exports = { htmlmin };
