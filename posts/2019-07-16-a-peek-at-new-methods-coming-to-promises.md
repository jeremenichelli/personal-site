---
title: A peek at new methods coming to Promises
excerpt: Promises are one of the most celebrated features introduced to JavaScript. Having a native asynchronous artifact baked right into the language has opened up a new era, changing not only how we write code but also setting up the base for other freat APIs — like fetch! Let's step back a moment to recap the features we gained when they were initially released and what new bells and whistles we’re getting next.
host: CSS-Tricks
host_url: https://css-tricks.com
external_url: https://css-tricks.com/a-peek-at-new-methods-coming-to-promises/
---

Promises are one of the most celebrated features introduced to JavaScript. Having a native asynchronous artifact baked right into the language has opened up a new era, changing not only how we write code but also setting up the base for other freat APIs — like _fetch_!

Let's step back a moment to recap the features we gained when they were initially released and what new bells and whistles we’re getting next.

_New to the concept of Promises? I highly recommend [Jake Archibald’s article](https://developers.google.com/web/fundamentals/primers/promises) as a primer._

## Features we have today

Let’s take a quick look at some of the things we can currently do with promises. When JavaScript introduced them, it gave us an API to execute asynchronous actions and react to their succesful return or failure, a way to create an association around some data or result which value we still don't know.

Here are the Promises features we have today.

### Handling promises

Every time an async method returns a promise — like when we use fetch — we can pipe `then()` to execute actions when the promise is fulfilled, and `catch()` to respond to a promise being rejected.

```js
fetch('//resource.to/some/data')
  .then(result => console.log('we got it', result.json()))
  .catch(error => console.error('something went wrong', error))
```

The classic use case is calling data from an API and either loading the data when it returns or displaying an error message if the data couldn’t be located.

In addition, in its initial release we got two methods to handle groups of Promises.

### Resolving and rejecting collections of promises

A promise can be _fulfilled_ when it was successfully resolved, _rejected_ when it was resolved with an error, and _pending_ while there’s no resolution. A promise is considered settled when it has been resolved, disregarding the result.

As such, there are two methods we have to help with the behavior of handling a group of promises depending on the combination of states we obtain.

`Promise.all` is one or those methods. It fulfills only if all promises were resolved successfully, returning an array with the result for each one. If one of the promises fails, `Promise.all` will go to `catch` returning the reason of the error.

```js
Promise.all([
    fetch('//resource.to/some/data'),
    fetch('//resource.to/more/data')
  ])
  .then(results => console.log('We got an array of results', results)
  .catch(error => console.error('One of the promises failed', error)
```

In this case, `Promise.all` will short-circuit and go to `catch` as soon as one of the members of the collections throws an error, or settle when all promises are `fulfilled`.

_Check out this [short writing](https://github.com/domenic/promises-unwrapping/blob/master/docs/states-and-fates.md) about promises states by Domenic Denicola for a more detailed explanation about the wording and concepts about them._

We also have `Promise.race`, which immediately resolves to the first promise it gets back, whether it was fulfilled or rejected. After the first promise gets resolved, the remaining ones are ignored.

```js
Promise.race([
    fetch('//resource.to/some/data'),
    fetch('//resource.to/other/data')
  ])
  .then(result => console.log('The first promise was resolved', result))
  .catch(reason => console.error('One of the promises failed because', reason))
```

## The new kids on the block

OK, we’re going to turn our attention to new promise features we can look forward to.

### Promise.allSettled

The next proposed introduction to the family is `Promise.allSettled` which, as the name indicates, only moves on when the entire collection members in the array are no longer in a pending status, whether they were _rejected_ or _fulfilled_.

```js
Promise.allSettled([
    fetch('//resource.to/some/data'),
    fetch('//resource.to/more/data'),
    fetch('//resource.to/even/more/data')
  ])
  .then(results => {
    const fulfilled = results.filter(r => r.status === 'fulfilled')
    const rejected = results.filter(r => r.status === 'rejected')
  })
```

Notice how this is different from `Promise.all` in that we will never enter in the `catch` statement. This is really good if we are waiting for sets of data that will go to different parts of a web application but want to provide more specific messages or execute different actions for each outcome.

### Promise.any

The next new method is `Promise.any`, which lets us react to any fulfilled promise in a collection, but only short-circuit when _all_ of them failed.

```js
Promise.any([
    fetch('//resource.to/some/data'),
    fetch('//resource.to/more/data'),
    fetch('//resource.to/even/more/data')
  ])
  .then(result => console.log('a batch of data has arrived', result))
  .catch(() => console.error('all promises failed'))
```

This is sort of like `Promise.race` except that `Promise.race` short-circuits on the first resolution. So, if the first promise in the set resolves with an error, `Promise.race` moves ahead. `Promise.any` will continue waiting for the rest of the items in the array to resolve before moving forward.

## Demo

Some of these are much easier to understand with a visual, so I put together a [little playground](https://promise-combinators.netlify.com/) that shows the differences between the new and existing methods.

## Wrap-up

Though they are still in proposal stage, there are community scripts that emulate the new methods we covered in this post. Things like Bluebird’s `any` and `reflect` are good polyfills while we wait for browser support to improve.

They also show how the community is already using these kind of asynchronous patterns, but having them built-in will open the possibilities for new patterns in data fetching and asynchronous resolution for web applications.

If you want to know more about the upcoming `Promise` combinators, [the V8 blog just published a short explanation](https://v8.dev/features/promise-combinators) with links to the official spec and proposals.
