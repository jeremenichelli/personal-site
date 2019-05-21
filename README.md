# personal-site

Repository that runs [jeremenichelli.io](jeremenichelli.io).

## About the site

This project is built using [Eleventy](//11ty.com) by [Zach Leatherman](//github.com/zachleat) and hosted by [Netlify](//netlify.com).

## Scripts

To run the site locally you will need the latest LTS version of [Node.js](https://nodejs.org) and [yarn](//yarnpkg.com).

To serve the site locally first generate all assets and includes by running `yarn release`, later you can run more specific scripts depending on the asset you changed.

_All initial assets are in `src` and get exported to `assets` and `_includes` folders._

### Styles

The project uses [LESS](//lesscss.org) to generate inlined styles templates that go to `_includes/styles`. You can process all styles by running `yarn less`.

### Scripts

Running `yarn bundle` creates a critical amount of JavaScript tempalte in `_includes/scripts` and a `font.js` file inside `assets/js` which gets async loaded and handles web font loading.

### Favicons

Running `yarn favicons` generates a tempalte partial inside `_includes` folder and exports all images in `assets/favicon`.

### Images

The rest of images needed are processed by running `yarn images`.

## Template languages and content

Liquid is used for templates and Markdown for content.

## License

This site design and content is licensed under [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).
