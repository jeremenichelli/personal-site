# personal-site

Repository that runs [jeremenichelli.io](https://jeremenichelli.io), my personal site. This project is built using [Eleventy](//11ty.com) by [Zach Leatherman](//github.com/zachleat) and hosted by [Netlify](//netlify.com). Liquid is used for templates and Markdown for content.

## Serve locally

Running `npm run serve` kicks off Eleventy, which parses Markdown files and partials written in Liquid templating language.

_Before running the static site generator is necessary to generate styles and script._

## Bundling

Running `npm run bundle` creates a small JavaScript file in `_includes/scripts` which gets inlined in the head to do decide on stored theme and cached font files. In addition a `main.js` file is created inside `assets/js`, which gets loaded with `defer` for later user interactions.

## Styles

The project uses [LESS](//lesscss.org) to generate inlined styles templates that go to `_includes/styles`. All pages need an entry point containing only necessary rules, which get processed and minified and go into the `head` element of each.

You can process all styles by running `npm run less`.

## Favicons

Running `npm run favicons` generates a template partial in `_includes` folder and exporting all favicon images in `assets/favicon` at the same time.

## Images

The rest of images needed are processed by running `npm run images`.

## Assets

Doing `npm run assets` in the terminal generates styles, scripts, favicons and images before the build.

## Release

On each deployment, `npm run release` executes `npm run assets` and `npm run build` to trigger a full build.

## License

This site design and content is licensed under [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).
