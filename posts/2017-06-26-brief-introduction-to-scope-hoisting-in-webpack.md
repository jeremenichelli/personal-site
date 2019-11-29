---
title: Brief introduction to scope hoisting in Webpack
excerpt: On its third major release, Webpack introduced a new feature, scope hoisting. Many developers are already exposing data showing great positive impacts on the initial execution time of their bundles.
host: webpack publication
host_url: https://medium.com/webpack
external_url: https://medium.com/webpack/brief-introduction-to-scope-hoisting-in-webpack-8435084c171f
---

But what is it, and how it works? To answer this questions we first need to understand what happens with our code when we bundle it.

## Your bundles, under the hood

While modules make their way to be natively supported, bundlers like Webpack transform our import and export statements into valid JavaScript code that can run in browsers today.

Here is a quick example of this transformation:

```js
import action from './other-module.js'

var value = action()

export default value
```

… which turns into this:

```js
;(function(module, exports, WEBPACK_REQUIRE_METHOD) {
  'use strict'

  var action = WEBPACK_REQUIRE_METHOD(1)
  var value = action()

  exports.default = value
})
```

Here is a simplified version of it.

```js
;(function(modules) {
  var installedModules = {}

  function WEBPACK_REQUIRE_METHOD(id) {
    // if module was already imported, return its exports
    if (installedModules[id]) {
      return installedModules[id].exports
    }

    // create module object and cache it
    var module = (installedModules[id] = {
      id: id,
      exports: {}
    })

    // call module’s function wrapper
    modules[id](module, module.exports, WEBPACK_REQUIRE_METHOD)
  }

  // kick off by calling entry module
  WEBPACK_REQUIRE_METHOD(0)
})([
  /* 0 module */
  function() {},
  /* 1 module */
  function() {},
  /* n module */
  function() {}
])
```

_A lot it’s happening here. Let’s break it down!_

First, an object is created to save the result from already accessed modules.

Below, the method which replaces import statements gets declared. This method calls the function wrapping the module and populates the exports object, or returns its cached value if it was already required.

At the end, this method is called again, but this time with our entry point module index to kick off our application.

### Experience and tradeoffs

Imagine a situation where a module imports a method, which needs to import another method from another module… and so on.

In our bundle, each import translates into an extra function call and a property access to the modules array as Webpack gets to the end of this import chain.

These constraints have been meassured in the past, like Sam Saccone detecting [400ms were spent only in Browserify module require in Tumblr](https://docs.google.com/document/d/1E2w0UQ4RhId5cMYsDcdcNwsgL0gP_S6SDv27yi1mCEY) or Nolan Lawson [exposing brenchmarks on different bundlers](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules).

But we still need modules. On big projects **performance** is a price we pay in exchange for better codebase scalability and encapsulation.

## What is scope hoisting?

This new feature was introduced to detect where these _import_ chaining can be flatten and converted into one inlined function without compromising our code.

Let’s picture the previously described situation where a method needs to import another.

```js
;(function() {
  'use strict'

  var helper = WEBPACK_REQUIRE_METHOD(0)

  var action = function() {
    var value = helper()
    return value
  }

  exports.action = action
})
```

If scope hoisting is enabled, Webpack here will see the opportunity to save one require method call by inlining the helper method like this:

```js
;(function() {
  'use strict'

  function helper() {
    /* inlined function from module */
  }

  var action = function() {
    var value = helper()
    return value
  }

  exports.action = action
})
```

_No call to Webpack’s require function, no access to the modules array… Faster!_

We not only save an extra function call, but also an access to the modules array, so our code runs faster than before.

## How to enable scope hoisting

To use this feature you will need the latest _webpack_ package version and add the **ModuleConcatenationPlugin** to your config.

```js
var webpack = require('webpack')

module.exports = {
  // your config
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()]
}
```

This optimising technique might break in some edge cases, that’s why webpack did a major release.

Make sure to run some tests and share the results with the webpack team, they will love your feedback!
