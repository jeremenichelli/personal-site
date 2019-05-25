const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const htmlmin = require('html-minifier')

module.exports = function(eleventyConfig) {
  // liquid config
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  });

  // preprocess collections
  eleventyConfig.addCollection('blogposts', (collection) => {
    return collection.getFilteredByTag('post').reverse().slice(0,8)
  });

  eleventyConfig.addCollection('archive', (collection) => {
    return collection.getFilteredByTag('post').reverse()
  });

  eleventyConfig.addCollection('all', function (collection) {
    return collection.getAll();
  });

  // shortcodes
  eleventyConfig.addShortcode('actionLink', (link) => {
    return `<em>Check out this example <a aria-label="launch this code snippet" href=${link} rel="noopener noreferrer">in action</a>.</em>`
  });

  // add highlighting
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // set layout alias
  eleventyConfig.addLayoutAlias('home', 'layouts/home.liquid');
  eleventyConfig.addLayoutAlias('default', 'layouts/default.liquid');

  // copy assets folder
  eleventyConfig.addPassthroughCopy('assets');

  // minify html
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      const minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });

      return minified;
    }

    return content;
  });

  // do not ignore generated assets
  eleventyConfig.setUseGitIgnore(false);

  // return base config
  return {
    input: './',
    output: './_site',
    passthroughFileCopy: true
  }
}
