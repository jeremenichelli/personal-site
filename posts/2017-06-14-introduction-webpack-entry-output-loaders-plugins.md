---
title: 'Introduction to webpack: Entry, Output, Loaders, and Plugins'
excerpt: Front-end development has shifted to a modular approach, improving the encapsulation and structure of codebases. Tooling became a critical part of any project, and right now there are a lot of possible choices.
host: CSS-Tricks
host_url: https://css-tricks.com
external_url: https://css-tricks.com/introduction-webpack-entry-output-loaders-plugins/
---

[webpack](//webpack.js.org) has gained popularity in the last years because of its power and scalability, but some developers found its configuration process confusing and hard to adopt.

We'll go step by step from an empty configuration file to a simple but complete setup to bundle a project.

_This article assumes basic understanding of CommonJS notation and how modules work._

## Concepts

Unlike most bundlers out there, the motivation behind webpack is to gather all your dependencies (not just code, but other assets as well) and generate a dependency graph.

At first, it might look strange to see a `.js` file require a stylesheet, or a stylesheet retrieving an image modified as it was a module, but these allow webpack to understand what is included in your bundle and helps you transform and optimize them.

## Install

Let's first add the initial packages we are going to use:

```bash
npm install webpack webpack-dev-server --save-dev
```

Next we create a `webpack.config.js` file in the root of our project and add two scripts to our `package.json` files for both local development and production release.

```json
"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack"
}
```

## Entry

There are many ways to specify our "entry point", which will be the root of our dependencies graph.

The easiest one is to pass a string:

```js
var baseConfig = {
  entry: './src/index.js'
}
```

We could also pass an object in case we need more than one entry in the future.

```js
var baseConfig = {
  entry: {
    main: './src/index.js'
  }
}
```

I recommend the last one since it will scale better as your project grows.

webpack commands will pick up the config file we've just created unless we indicate other action.

## Output

The output in webpack is an object holding the path where our bundles and assets will go, as well as the name the entries will adopt.

```js
var path = require('path')

var baseConfig = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'main.js',
    path: path.resolve('./build')
  }
}

// export configuration
module.exports = baseConfig
```

If you're defining the entry with an object, rather than hardcoding the output filename with a string, you can do:

```js
output: {
  filename: '[name].js',
  path: path.resolve('./build')
}
```

This way when new entries are added webpack will pick up their key to form the file name.

With just this small set of configurations, we are already able to run a server and develop locally with `npm start` or `npm run build` to bundle our code for release. By knowing the dependencies of the project, webpack-dev-server will watch them and reload the site when it detects one of them has changed.

## Loaders

The goal of webpack is to handle all our dependencies.

```js
// index.js file
import helpers from '/helpers/main.js'

// Hey webpack! I will need these styles:
import 'main.css'
```

What's that? Requiring a stylesheet in JavaScript? Yes! But bundlers are only prepared to handle JavaScript dependencies out-of-the-box. This is where "loaders" make their entrance.

Loaders provide an easy way to intercept our dependencies and preprocess them before they get bundled.

```js
var baseConfig = {
  // ...
  module: {
    rules: [
      {
        test: /* RegEx */,
        use: [
          {
            loader: /* loader name */,
            query: /* optional config object */
          }
        ]
      }
    ]
  }
};
```

For loaders to work, we need a regular expression to identify the files we want to modify and a string or an array with the loaders we want to use.

### Styles

To allow webpack to process our styles when required we are going to install css and style loaders.

```bash
npm install --save-dev css-loader style-loader
```

The **css-loader** will interpret styles as dependencies and the **style-loader** will automatically include a `<style>` tag with them on the page when the bundle loads.

```js
var baseConfig = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      }
    ]
  }
}
```

In this example, `main.css` will go first through **css-loader** and then **style-loader**.

### Preprocessors

Adding support for LESS or any other preprocessor is as simple as installing the corresponding loader and adding it to the rule.

```js
rules: [
  {
    test: /\.less$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'less-loader' }
    ]
  }
]
```

### Transpiling

JavaScript can be transformed by loaders too. One example would be using a Babel loader to transpile our scripts.

```js
rules: [
  {
    test: /\.js$/,
    use: [{ loader: 'babel-loader' }]
  }
]
```

### Images

webpack has a great feature where it can detect `url()` statements inside stylesheets and let loaders apply changes to the image file and the url itself.

```less
// index.less file
@import 'less/vars';

body {
  background-color: @background-color;
  color: @text-color;
}

.logo {
  background-image: url('./images/logo.svg');
}
```

By adding one rule, we could apply the **file-loader** to just copy the file or use the **url-loader**, the latest inlines the image as a base64 string unless it exceeds a byte limit, in which case it will replace the url statement with a relative path and copy the file to the output location for us.

```js
{
  test: /\.svg$/,
  use: [
    {
       loader: 'url-loader',
       query: { limit : 10000 }
    }
  ]
}
```

Loaders can be configurable by passing a `query` object with options, like here where we are configuring the loader to inline the file unless it exceeds 10Kb in size.

Managing our build process this way, we will only include the necessary resources instead of moving a hypothetical assets folder with tons of files that might or might be not used in our project.

If you use React or a similar library you can require the `.svg` file in your component with the **svg-inline-loader**.

## Plugins

webpack contains default behaviors to bundle most type of resources. When loaders are not enough, we can use plugins to modify or add capabilities to webpack.

For example, webpack by default includes our styles inside our bundle, but we can alter this by introducing a plugin.

### Extracting Assets

A common use for a plugin is to extract the generated stylesheet and load it as we normally do using a `<link>` tag.

```js
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var lessRules = {
  use: [{ loader: 'css-loader' }, { loader: 'less-loader' }]
}

var baseConfig = {
  // ...
  module: {
    rules: [
      // ...
      { test: /\.less$/, use: ExtractTextPlugin.extract(lessRules) }
    ]
  },
  plugins: [new ExtractTextPlugin('main.css')]
}
```

### Generate an index file

When building single-page applications we usually need one .html file to serve it.

The `HtmlWebpackPlugin` automatically creates an `index.html` file and add script tags for each resulting bundle. It also supports templating syntax and is highly configurable.

```js
var HTMLWebpackPlugin = require('html-webpack-plugin')

var baseConfig = {
  // ...
  plugins: [new HTMLWebpackPlugin()]
}
```

## Building for Production

### Define the Environment

A lot of libraries introduce warnings that are useful during development time but have no use in our production bundle and increase its size.

webpack comes with a built-in plugin to set global constants inside your bundle.

```js
var ENV = process.env.NODE_ENV

var baseConfig = {
  // ...
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    })
  ]
}
```

We now need to specify the environment on our commands:

```json
"scripts": {
  "start": "NODE_ENV=development webpack-dev-server",
  "build": "NODE_ENV=production webpack"
}
```

`process.env.NODE_ENV` will be replaced by a string, allowing compressors to eliminate unreachable development code branches.

This is really useful to introduce warnings in your codebase for your team and they won't get to production.

```js
if (process.env.NODE_ENV === 'development') {
  console.warn('This warning will dissapear on production build!')
}
```

### Compressing

On production, we need to give users the fastest possible product. By minifying our code with remove unnecessary characters, this reduces the size of our bundle and improves loading times.

One of the most popular tools to do this is `UglifyJS`, and webpack comes with a built-in plugin to pass our code through it.

```js
// webpack.config.js file
var ENV = process.env.NODE_ENV

var baseConfig = {
  // ...
  plugins: []
}

if (ENV === 'production') {
  baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin())
}
```

## Wrap Up

webpack config files are incredibly useful, and the complexity of the file will depend on your needs. Take care to organize them well as they can become harder to tame as your project grows.

In this article, we started with a blank config file and ended up with a base setup that would allow you to develop locally and release production code. There's more to explore in webpack, but these key parts and concepts can help you become more familiar with it.

If you want to go deeper, I recommend [webpack official documentation](//webpack.js.org) which has been updated and improved for its second big release.
