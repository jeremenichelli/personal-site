const deindent = (str) => str.replace(/\n|\t/g, '').trim()

const codeExampleLink = (link) =>
  deindent(`
    <p class="code-example__link">
      <a href=${link} rel="noopener noreferrer" target="_blank">
        See this example in action
      </a>
    </p>
`)

const codepen = (hash) =>
  deindent(`
    <div data-height="300" data-theme-id="1" data-slug-hash="${hash}" data-default-tab="html,result" data-user="jeremenichelli" data-embed-version="2" class="codepen">
      ${codeExampleLink(`https://codepen.io/jeremenichelli/pen/${hash}/`)}
    </div>
    <script defer src="https://static.codepen.io/assets/embed/ei.js"></script>
`)

module.exports = {
  codeExampleLink,
  codepen
}
