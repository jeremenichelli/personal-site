---
title: Quick introduction to the Intersection Observer API
excerpt: These last years browsers vendors have paid more attention to the riddles developers were trying to solve to implement native and more performant solutions, and this one was a high on the list.
lastModified: 2019-08-09
---

The new **Intersection Observer** interface is here as a response of developers trying to figure out the best way to detect when an element enters the viewport. Doing this is useful in a lot of cases like infinite scrolling, lazy loading images or animating content.

## Create a new observer

First thing you need to do is to create an observer passing a `callback` function that will be executed everytime an element or more changes its status and an `options` object to configure the observer's behavior.

```js
const observer = new IntersectionObserver(onChange, {
  threshold: [0.25]
})

function onChange(changes) {
  // for each element that has become visible
  changes.forEach((entry) => {
    // change in one of the targets observed
    console.log(entry)
  })
}
```

The callback will receive a collection of all changes detected. Important to say this doesn't mean that all of them correspond to elements that have become visible, but elements whose `intersectionRatio` has changed.

## Add targets

We haven't told the observer what elements to look at yet.

For this we use the `observe` method.

```js
// add one element
const image = document.querySelector('.lazy--image')
observer.observe(image)

// multiple elements
const hiddenElements = document.querySelectorAll('.hidden')
[ ...hiddenElements ].forEach(el => observer.observe(el))
```

Going back to our `onChange` callback, we need to understand which of these _entries_ mean and how to use them to react to ratio changes.

## Inspecting intersection entries

Each entry you receive the observer callback will contain a `target` property containing a reference of the element, an `intersectionRatio` which goes from `0` to `1.0` which is a coeficient indicating the visible portion of the target and an easier to read `isIntersecting` property which will be `true` only when the visible ratio is bigger than `0`.

Better checking this in a code snippet.

```js
// create observer
const observer = new IntersectionObserver(onChange);

// observer callback
function onChange(changes) {
  changes.forEach(entry => {
    // check if image is visible
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src
    }
  });
}

// observe images
const lazyImages = document.querySelectorAll('.lazy--image')
[...lazyImages].forEach(el => observer.observe(el));
```

That's how you can easily implement a lazy loading logic right now on browsers supporting `IntersectionObserver`, the issue with this code snippet is we will re-assign the `src` of the iamges every time the re-enter the viewport, even when it's not necessary, for this we need to remove the target from the observer.

```js
function onChange(changes) {
  changes.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src
      // STOP OBSERVING IMAGE
      observer.unobserve(entry.target)
    }
  })
}
```

{% codeExampleLink '//codesandbox.io/s/intersection-observer-example-p4gcl' %}

Now, we will stop tracking images we already checked.

It's important to mention that `isIntersecting` was added later to the spec, so in some browser versions it will be `undefined`, to be safe you can rely on the `intersectionRatio` property.

```js
function onChange(changes) {
  changes.forEach((entry) => {
    // rely on intersectionRatio
    if (entry.intersectionRatio > 0) {
      entry.target.src = entry.target.dataset.src
      observer.unobserve(entry.target)
    }
  })
}
```

_Check in caniuse.com [which browsers](https://caniuse.com/#feat=intersectionobserver) don't support this._

You might wonder why intersection ratios are important, the fact is that the usual example for this new interface are around lazy loading images, like I just did so it doesn't count as shaming, but let's say you want to trigger an animation on a visible element.

It doesn't make any sense to do this as soon as one pixel from the target enters the viewport, you might prefer to animate once a more decent portion of it is visible for the use, let's say half of it.

```js
function onChange(changes) {
  changes.forEach((entry) => {
    if (entry.intersectionRatio > 0.5) {
      entry.target.classList.add('animate')
      observer.unobserve(entry.target)
    }
  })
}
```

This gives developers more granular control over when the actions are executed during observation.

## Disconnect

You can always suspend the whole observation by doing `observer.disconnect()`, useful if for example, after some change in the DOM you know elements are not longer gonna be present.

## Observers behavior

As I mentioned before, the second argument the observer constructor receives allows you to configure its behavior. The options this object supports are:

- `root`, the reference object used to check the targets visibility, when _null_ it defaults to the browser's viewport.
- `rootMargin` accepts a collection of values as string similar to CSS margins and allows you to shrink the area of the root element that's going to take in count when calculating intersection ratios.
- `threshold` can be a number or an array of numbers to inform the observer to only fire when a certain portion of the element is visible, recommended for more complex ratio situations like when you want the whole element to be visible you can pass `1.0`, then the callback will act.

It's possible though not immediately probable you will need to alter these values. If you do, I recommend checking out [the MDN page](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for intersection observers use.

## Wrap-up

It's interesting to see vendors filling up the gaps between what we do on our projects against what the platform offers natively.

If you find yourself observing the DOM as you scroll to observe elements you should definitely consider intersection observers as a more performant solution as it immediately frees the main thread for its execution.

You can always add a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) for legacy browsers that don't support or for partial implementations.

### Updates

**9 AUG 2016** &mdash; The article was udpated to reflect the last changes in the spec.
