const actionLink = (link) => {
  return `<em class="action--link">See this example <a aria-label="launch this code snippet" href=${link} rel="noopener noreferrer" target="_blank">in action</a></em>`
}

const codepen = (hash) => {
  return `<p data-height="300" data-theme-id="1" data-slug-hash="${hash}" data-default-tab="html,result" data-user="jeremenichelli" data-embed-version="2" data-pen-title="SVG ring" class="codepen"><em class="action--link">See this example <a aria-label="launch this code snippet" href="https://codepen.io/jeremenichelli/pen/${hash}/" rel="noopener noreferrer" target="_blank">in action</a></em></p><script defer src="https://static.codepen.io/assets/embed/ei.js"></script>`
}

module.exports = {
  actionLink,
  codepen
}
