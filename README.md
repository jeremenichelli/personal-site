# personal-site

Repository that runs [jeremenichelli.io](https://jeremenichelli.io), my personal site. This project is built using [Eleventy](//11ty.com) and hosted by [Netlify](//netlify.com).

## Run book

To serve this site locally, clone the repository into your machine.

You will need [Node.js](//nodejs.org) and [npm](//www.npmjs.com) installed.

Install all dependencies by running `npm install` first.

Prepare all pre-processed assets with `npm run assets`, this command just groups all bundling, style processing, favicons, iamges and fonts. Each of them has a specific script that can be run in case you want to update one specific type of assets.

Run `npm run serve` to kick off the server.

## Folder structure

At the root of the project you will find what is at the root of the web server itself like the feed and the homeage (`index.md`) in markdown format, just to align the page extension across the project as its content is in HTML syntax.

Here's a description of the first level of folders:

- `_data`, data files holding the basic information about the site plus the list of talks to be rendered at `/talks` page.
- `_includes`, contains all partials for the templating engine. Inside there are dedicated folders for _structured data_, _scripts_ to be inlined in the head of the pages, inlined _styles_, and the _layouts_ for each page.
- `.scripts`, this folder holds or the custom node scripts used to build assets.
- `.eleventy`, hough the config of the Eleventy build is in the root (`.eleventy.js`) every custom part of it is at the `.eleventy` folder to keep the config file readable and easy to scan.
- `posts` contains all the writing content of the site.
- `src` has all the original assets before being processed, less files, unbundled scripts, images, font files and favicons. The Node scripts in `.scripts` will use the content of this folder to output the results to an `assets` folder, ignored in the repository as it is generated at build time.

## Styles

In this project, LESS is used as base for its styles. All styles generated are exported as partials and inlined in the head of each page containing only the styles needed for that page to render.

This approach makes pages larger than it would be if styles were exported as stylesheets and doesn't take advantage of caching, but avoids render blocking resources and flash of unstyled content. This is why is important to keep them at minimum or it would eliminate its purposes.

Each page needs to hold a `type`, that type needs a reference file,a partial inside the `_includes/styles` directory which will be include it at build time.

To build LESS files do `npm run less`.

### Class naming convention

Class names use the [BEM notation with some flexibilities](//csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/) and changes. The initial prefix not always indicates position unless is necessary.

There's a `_general.less` and a `_page.less` files which can be used as base, page specific files can import them as base, override specific styles. Because of this, some class names might start with its type, like `home` to help detect and identified unnecessary rules.

Before exporting they are exported, files go through [CSS Nano](//cssnano.co/) to compress them. Rules get merged across them and rules which will never get applied because of the internal cascade are removed. This way the final footprint is minimized.

Class names used in CSS can't be used in JavaScript, for those needs special classes need to be created.

### Variables

This projects uses both LESS and CSS variables.

**LESS Variables** are used to hold values across the site, their names might not represent an element or a funcitonality but the usage it represents.

On the other hand, **CSS Variables** do not hold values just for the sake of distributing them across the site, that's the role of LESS Variables, but repsent a style that can change. For example, you can have two variants for texts or backgrouns saved as LESS Variables, which are passed to a CSS Variables if they are meant to be changed due to screen size or color scheme but if they are going to remain constant across the project they will be a LESS Variable. On naming, LESS

Variables are scoped per group (colors, typography), then separated by `__` to indicate its meaning and they can be followed by `--` in case the variable is a variant or belongs to an specific usage.

If names are composed by more than one word a single hyphen is used.

### Type scale

All font sizes are a close match to the Major Second Scale, with some little exceptions, like page dates or elements with monospace fonts. This rule applies for desktop sizes, for mobile they are adapted but not caring much about the scale proportions.

The initial position in the scale is `0` at `18px` and each font size rule has a comment on its side with the equivalent value in pixels and position in the scale. When the font size is proximate to a position in the scale but not exact the `~` character is used to signal the closest position.

_I used [type-scale.com](type-scale.com) a lot, to figure out these numbers._

## JavaScript bundling

// TODO

## Favicons

// TODO

## Fonts

This project is currently using [Inter](//rsms.me/inter) by Rasmus Andersson. All font files are self-hosted, this move required to optimize font delivery even further as before it was relying on [Google Fonts](///google.com/fonts) to do so.

Fonts are stored as `.ttf` files, they get subsetted using [fonttools](https://github.com/fonttools/fonttools) and compressed to `.woff` and `.woff2` formats. This strategy reduces drastically the font files as layout features are cherry-picked and unused unicodes get removed.

To avoid flash of unstyled content, they are preloaded and font face rules are inlined in the head using _font-display_ to keep text visible as font files load.

_At the moment, font subsetting needs to be done manually and push to the repository._

## Deployment

// TODO

## License

This site design and content is licensed under [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/).
