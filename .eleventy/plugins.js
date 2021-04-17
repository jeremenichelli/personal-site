const externalHrefRegex = /^https?:\/\/|^\/\//gm;

const markdownItExternalLinks = (md) => {
  // Hoist default open link renderer.
  const defaultLinkRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, _, self) {
      return self.renderToken(tokens, idx, options);
    };

  // Override open link rule.
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // Save token reference.
    const token = tokens[idx];

    // Check if href value responds to an external url.
    const hrefIndex = token.attrIndex('href');
    const href = token.attrs[hrefIndex][1];
    const isExternal = externalHrefRegex.test(href);

    // Appendexternal link attributes.
    if (isExternal) {
      token.attrPush(['target', '_blank']);
      token.attrPush(['rel', 'noopener noreferrer']);
    }

    // Pass token to default renderer.
    return defaultLinkRender(tokens, idx, options, env, self);
  };
};

module.exports = {
  markdownItExternalLinks
};
