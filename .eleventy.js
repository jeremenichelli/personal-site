const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // liquid config
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true
  });

  // preprocess collections
  eleventyConfig.addCollection("blogposts", (collection) => {
    return collection.getFilteredByTag('post').reverse().slice(0,8)
  });

  eleventyConfig.addCollection("archive", (collection) => {
    return collection.getFilteredByTag('post').reverse()
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

  // return base config
  return {
    input: './',
    output: './_site',
    passthroughFileCopy: true
  }
}
