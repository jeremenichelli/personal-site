---
title: Building a Progress Ring, Quickly
excerpt: On some particularly heavy sites, the user needs to see a visual cue temporarily to indicate that resources and assets are still loading before they taking in a finished site. There are different kinds of approaches to solving for this kind of UX, from spinners to skeleton screens.
host: CSS-Tricks
host_url: https://css-tricks.com
external_url: https://css-tricks.com/building-progress-ring-quickly/
---

On some particularly heavy sites, the user needs to see a visual cue temporarily to indicate that resources and assets are still loading before they taking in a finished site. There are different kinds of approaches to solving for this kind of UX, from spinners to skeleton screens.

If we are using an out-of-the-box solution that provides us the current progress, like [preloader package by Jam3](https://www.npmjs.com/package/preloader) does, building a loading indicator becomes easier.

For this, we will make a ring/circle, style it, animate given a progress, and then wrap it in a component for development use.

## Step 1: Let's make an SVG ring

From the many ways available to draw a circle using just HTML and CSS, I'm choosing SVG since it's possible to configure and style through attributes while preserving its resolution in all screens.

```html
<svg class="progress-ring" height="120" width="120">
  <circle
    class="progress-ring__circle"
    stroke-width="1"
    fill="transparent"
    r="58"
    cx="60"
    cy="60"
  />
</svg>
```

Inside an `<svg>` element we place a `<circle>` tag, where we declare the radius of the ring with the `r` attribute, its position from the center in the SVG viewBox with `cx` and `cy` and the width of the circle stroke.

You might have noticed the radius is **58** and not **60** which would seem correct. We need to subtract the stroke or the circle will overflow the SVG wrapper.

```
radius = (width / 2) - (strokeWidth * 2)
```

These means that if we increase the stroke to **4**, then the radius should be **52**.

```
52 = (120 / 2) - (4 * 2)
```

To complete the ring we need to set `fill` to `transparent` and choose a `stroke` color for the circle.

{% codepen 'VMPWdb' %}

## Step 2: Adding the stroke

The next step is to animate the length of the outer line of our ring to simulate visual progress.

We are going to use two CSS properties that you might not have heard of before since they are exclusive to SVG elements, `stroke-dasharray` and `stroke-dashoffset`.

### stroke-dasharray

This property is like `border-style: dashed` but it lets you define the width of the dashes and the gap between them.

```css
.progress-ring__circle {
  stroke-dasharray: 10 20;
}
```

With those values, our ring will have `10px` dashes separated by `20px`.

{% codepen 'mBRMXa' %}

### stroke-dashoffset

The second one allows you to move the starting point of this dash-gap sequence along the path of the SVG element.

Now, imagine if we passed the circle's circumference to both `stroke-dasharray` values. Our shape would have one long dash occupying the whole length and a gap of the same length which wouldn't be visible.

This will cause no change initially, but if we also set to the `stroke-dashoffset` the same length, then the long dash will move all the way and reveal the gap.

Decreasing `stroke-dasharray` would start to reveal our shape.

A few years ago, Jake Archibald explained this technique [in this article](https://jakearchibald.com/2013/animated-line-drawing-svg/), which also has a live example that will help you understand it better. You should go read his tutorial.

### The circumference

What we need now is that length which can be calculated with the radius and this simple trigonometric formula.

```
circumference = radius * 2 * PI
```

Since we know **52** is the radius of our ring:

```
326.7256 ~= 52 * 2 * PI
```

We could also get this value by JavaScript if we want:

```js
const circle = document.querySelector('.progress-ring__circle')
const radius = circle.r.baseVal.value
const circumference = radius * 2 * Math.PI
```

This way we can later assign styles to our circle element.

```js
circle.style.strokeDasharray = `${circumference} ${circumference}`
circle.style.strokeDashoffset = circumference
```

## Step 3: Progress to offset

With this little trick, we know that assigning the circumference value to `stroke-dashoffset` will reflect the status of zero progress and the `0` value will indicate progress is complete.

Therefore, as the progress grows we need to reduce the offset like this:

```js
function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference
  circle.style.strokeDashoffset = offset
}
```

By transitioning the property, we will get the animation feel:

```css
.progress-ring__circle {
  transition: stroke-dashoffset 0.35s;
}
```

One particular thing about `stroke-dashoffset`, its starting point is vertically centered and horizontally tilted to the right. It's necessary to negatively rotate the circle to get the desired effect.

```css
.progress-ring__circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
```

Putting all of this together will give us something like this.

{% codepen 'vegymB' %}

_A numeric input was added in this example to help you test the animation._

For this to be easily coupled inside your application it would be best to encapsulate the solution in a component.

## As a web component

Now that we have the logic, the styles, and the HTML for our loading ring we can port it easily to any technology or framework.

First, let's use web components.

```js
class ProgressRing extends HTMLElement {...}

window.customElements.define('progress-ring', ProgressRing);
```

This is the standard declaration of a custom element, extending the native `HTMLElement` class, which can be configured by attributes.

```html
<progress-ring stroke="4" radius="60" progress="0"></progress-ring>
```

Inside the constructor of the element, we will create a shadow root to encapsulate the styles and its template.

```js
constructor() {
  super();

  // get config from attributes
  const stroke = this.getAttribute('stroke');
  const radius = this.getAttribute('radius');
  const normalizedRadius = radius - stroke * 2;
  this._circumference = normalizedRadius * 2 * Math.PI;

  // create shadow dom root
  this._root = this.attachShadow({mode: 'open'});
  this._root.innerHTML = `
    <svg
      height="${radius * 2}"
      width="${radius * 2}"
     >
       <circle
         stroke="white"
         stroke-dasharray="${this._circumference} ${this._circumference}"
         style="stroke-dashoffset:${this._circumference}"
         stroke-width="${stroke}"
         fill="transparent"
         r="${normalizedRadius}"
         cx="${radius}"
         cy="${radius}"
      />
    </svg>

    <style>
      circle {
        transition: stroke-dashoffset 0.35s;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
      }
    </style>
  `;
}
```

You may have noticed that we have not hardcoded the values into our SVG, instead we are getting them from the attributes passed to the element.

Also, we are calculating the circumference of the ring and setting `stroke-dasharray` and `stroke-dashoffset` ahead of time.

The next thing is to observe the `progress` attribute and modify the circle styles.

```js
setProgress(percent) {
  const offset = this._circumference - (percent / 100 * this._circumference);
  const circle = this._root.querySelector('circle');
  circle.style.strokeDashoffset = offset;
}

static get observedAttributes() {
  return [ 'progress' ];
}

attributeChangedCallback(name, oldValue, newValue) {
  if (name === 'progress') {
    this.setProgress(newValue);
  }
}
```

Here `setProgress` becomes a class method that will be called when the `progress` attribute is changed.

The `observedAttributes` are defined by a static getter which will trigger `attributeChangeCallback` when, in this case, `progress` is modified.

{% codepen 'VMpKrQ' %}

_This Pen only works in Chrome at the time of this writing. An interval was added to simulate the progress change._

### As a Vue component

Web components are great. That said, some of the available libraries and frameworks, like Vue.js, can do quite a bit of the heavy-lifting.

To start, we need to define the view component.

```js
const ProgressRing = Vue.component('progress-ring', {})
```

Writing a single file component is also possible and probably cleaner but we are adopting the factory syntax to match the final code demo.

We will define the attributes as props and the calculations as data.

```js
const ProgressRing = Vue.component('progress-ring', {
  props: {
    radius: Number,
    progress: Number,
    stroke: Number
  },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI

    return {
      normalizedRadius,
      circumference
    }
  }
})
```

Since computed properties are supported out-of-the-box in Vue we can use it to calculate the value of `stroke-dashoffset`.

```js
computed: {
  strokeDashoffset() {
    return this._circumference - percent / 100 * this._circumference;
  }
}
```

Next, we add our SVG as a template. Notice that the easy part here is that Vue provides us with bindings, bringing JavaScript expressions inside attributes and styles.

```js
template: `
  <svg
    :height="radius * 2"
    :width="radius * 2"
  >
    <circle
      stroke="white"
      fill="transparent"
      :stroke-dasharray="circumference + ' ' + circumference"
      :style="{ strokeDashoffset }"
      :stroke-width="stroke"
      :r="normalizedRadius"
      :cx="radius"
      :cy="radius"
    />
  </svg>
`
```

When we update the `progress` prop of the element in our app, Vue takes care of computing the changes and update the element styles.

{% codepen 'vexMgW' %}

_An interval was added to simulate the progress change. We do that in the next example as well._

### As a React component

In a similar way to Vue.js, React helps us handle all the configuration and computed values thanks to props and JSX notation.

First, we obtain some data from props passed down.

```js
class ProgressRing extends React.Component {
  constructor(props) {
    super(props)

    const { radius, stroke } = this.props

    this.normalizedRadius = radius - stroke * 2
    this.circumference = this.normalizedRadius * 2 * Math.PI
  }
}
```

Our template is the return value of the component's `render` function where we use the progress prop to calculate the `stroke-dashoffset` value.

```js
render() {
  const { radius, stroke, progress } = this.props;
  const strokeDashoffset = this.circumference - progress / 100 * this.circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      >
      <circle
        stroke="white"
        fill="transparent"
        strokeWidth={ stroke }
        strokeDasharray={ this.circumference + ' ' + this.circumference }
        style={ { strokeDashoffset } }
        stroke-width={ stroke }
        r={ this.normalizedRadius }
        cx={ radius }
        cy={ radius }
        />
    </svg>
  );
}
```

A change in the `progress` prop will trigger a new render cycle recalculating the `strokeDashoffset` variable.

{% codepen 'gGWPme' %}

## Wrap up

The recipe for this solution is based on SVG shapes and styles, CSS transitions and a little of JavaScript to compute special attributes to simulate the drawing circumference.

Once we separate this little piece, we can port it to any modern library or framework and include it in our app, in this article we explored web components, Vue, and React.
