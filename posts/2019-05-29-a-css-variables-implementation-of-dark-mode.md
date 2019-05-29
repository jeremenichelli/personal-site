---
title: A CSS variables implementation of dark mode
excerpt: You might have noticed a couple of sites and blogs recently added a dark mode feature. Before jumping into the dark wagon, I decided to explore options and different approaches for this both, in the technical as in the user experience side.
---

I first thought about how to let the user decide whether to see the site in light or dark theme or _preferred color scheme_, as you might start to hear about it.

## Implementation and user experience

A lot of sites are implementing this manually in code, building a toggle that handles styles change through class names or a theme context in React based blogs for example.

### A custom toggle

This is a really good option when using tools like Gatsby which turn your site into a single page application as soon as the bundle rehydrates the page.

Inner navigations won't cause any reloads which would make the site go back to the default color scheme, breaking the experience.

This is not an option to me though since my blog is statically generated using [Eleventy](//11ty.io), a way around this is to inline a short script in the head and use a _local storage key_ holding the last setting and update a class at body or document level.

```js
<head>
  <script>
    const theme = localStorage.getItem('theme');
    document.documentElement.className = theme;
  </script>
</head>
```

This is similar to [how Dan Abramov's blog is implementing this](//github.com/gaearon/overreacted.io/blob/1224fd17cb1fd0d80f123d450ac8eee54c759786/src/html.js#L26) for example, and it would also work for future visits too, which is great.

### A media query indicator

The other option is to rely on the new media query that's currently getting implemented in modern browsers, the `prefers-color-scheme` one, which supports three possible values, _no-preference_, _light_ or _dark_.

This media query value will change depending on the user preference set at a system level, something possible now on lastest macOS and coming soon to [iOS](//www.theverge.com/2019/5/28/18642596/apple-ios-13-dark-mode-reminders-apps-screenshots-leak) and [Android](//www.theverge.com/2019/5/7/18530599/google-android-q-features-hands-on-dark-mode-gestures-accessibility-io-2019).

```css
@media (prefers-color-scheme: dark) {
  body {
    background-color: black;
    color: white;
  }
}
```

The good thing is we can be cohesive to the user's choice.

Let's say I've implemented a custom toggle and I've stored _light_ as the latest user preference, but later the user changes the system setting because they are currently working in a dark ambient and don't want to disturb others or. 

How would I decide which one should prevail over the other?

On the other hand, relying only in the media query might miss personalization for the user. So, I feel each has an advantage and a caveat. I decided to go for the media query approach.

## Simple implementation with CSS variables

I recently [rewrote this site](/2019/05/new-site-who-dis/) and switch over to CSS variables to distribute values instead of LESS variables. There's a key difference between both, the CSS ones can actually be overridden at a selector or media query scope.

This is how I'm setting and distributing background and text colors right now.

```css
:root {
  --accent: #4242ef;
  --background: #ffffff;
  --text: #010120;
}

body {
  background-color: var(--background);
  color: var(--text);
}
```

This allows me to easily override the color scheme with the new media query.

```css
:root {
  --accent: #4242ef;
  --background: #ffffff;
  --text: #010120;
}

/* switch values over dark color scheme */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #010120;
    --text: #ffffff;
  }
}

body {
  background-color: var(--background);
  color: var(--text);
}
```

### The best of both worlds

Instead of repeating values twice, we can rely on LESS variables as constants but keep the CSS ones for distribution.

```less
@light--color: #ffffff;
@dark--color: #010120;

:root {
  --background: @light--color;
  --text: @dark--color;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: @dark--color;
    --text: @light--color;
  }
}
```

The only issue with this approach is that right now, not everybody will be able to see it live.

## Browser support

Currently, the `prefers-color-scheme` media query has been released in latest desktop Safari, and it's scheduled for Firefox and Chrome upcoming versions.

_Here's the [caniuse.com table](https://caniuse.com/#feat=prefers-color-scheme) of the feature._

The other limitation, it needs the OS to support a color scheme switch, right now only present in macOS Mojave. You can see how it looks in the [pull request](//github.com/jeremenichelli/personal-site/pull/13) I created for this site.

## Wrap-up

There are two options right now to implement a dark mode, the first one is a **custom toggle**. The advantage is it will be available and customizable for everybody, its caveat that you will need JavaScript for future visits consistency or to avoid value refresh on reloads.

The other one is relying on the new `prefers-color-scheme` **media query**, which requires no JavaScript and can be easily implemented with a few lines of CSS and aligns to user's preference, but it's not customizable and doesn't have a good system and browser support currently.

There's no right or wrong here, but a decision on what user experience you want to provide.

_Check out [Dark Mode Support article](//webkit.org/blog/8840/dark-mode-support-in-webkit/) in WebKit's blog._

### Further reading

I loved this [dark theme implementation using CSS blend modes](//dev.wgao19.cc/2019-05-04__sun-moon-blending-mode/) by Wei Gao, super interesting approach and well-explained theory behind it.
