---
title: The thing every dark mode implementation is missing
excerpt: I am an avid reader of personal blogs. A year ago or so, almost every blog I read got a dark mode toggle (I did too, it's hidden in some circle around this page, top corner right), but almost all of them forgot one detail.
lastModified: 2021-04-03
---

The title of the article might sound a little bit like a click bait, well if you are here, it worked! But for real, almost every site out there has a dark mode, and all of them are missing something.

Let me present the case from a user, instead of a developer's, perspective.

You enter a site, you see an interesting link you want to follow but don't want to lose your current position, so you _open this link in a new tab_. Actually, you keep going and do this multiple times.

At this point you have several tabs from the same site, your room is dark and the white background is burning your retina, so you click that glorified dark mode toggle. _Oh, much better!_

You finished reading that page and close it, which makes the browser show the previous tab and, _"Argh, white background again, my eyes! I can't see!"_.

Why did this happen? Well, you set dark mode on that last page you opened, but not on all the others you opened before.

If you reload that same page you will actually see it in dark mode. This is a pattern for pretty much every dark mode implementation out there.

## Pretty much every dark mode implementation out there

Let's go over a basic dark mode approach.

The first thing you will need is to have some styles, right? Let's go simple for this and let's say you toggle a class in the root element of your project, and from there you swap a few values.

```css
:root {
  /* Light mode values */
  --background: #fff;
  --text: #000;
}

:root.darkMode {
  /* Dark mode values */
  --background: #000;
  --text: #fff;
}

body {
  /* Setting body values from variables */
  background-color: var(--background);
  color: var(--text);
}
```

That's pretty much it, you got halfway already, and using CSS variables and all, _how modern of you!_ Now we need to toggle this class somehow.

Let's add something in the page the user can actually click.

```html
<label for="dark-mode">Dark mode</label>
<input id="dark-mode" type="checkbox" />
```

Boom! We got it, but when you click it nothing happens.

We need some good ol' JavaScript.

_Making a button or checkbox completely accessible with all the bells and whistles might require more work (that you should do), but I am going to oversimplify for the sake of this article, and because I am lazy._

```js
const DARK_MODE_CLASSNAME = 'darkMode';

const darkModeCheckbox = document.getElementById('dark-mode');

darkModeCheckbox.addEventListener('change', function (event) {
  document.documentElement.classList.toggle(
    DARK_MODE_CLASSNAME,
    event.target.checked
  );
});
```

Now that's what I call a fully working and modern dark mode implementation.

If you made it this far, well first of all **congrats**, and thanks for staying there. I indeed promised a _missing thing_ or a _flaw_, not an implementation.

Remember the use case I mentioned? Two tabs open, you change the dark mode in one, close it but the previously opened is still in light mode, but if you refresh it renders in dark mode.

That's because the developer is most possibly storing the last value selected in web storage and checking it on each page load.

Something like the following.

```js
darkModeCheckbox.addEventListener('change', function (event) {
  document.documentElement.classList.toggle(
    DARK_MODE_CLASSNAME,
    event.target.checked
  );

  localStorage.setItem('mode', event.target.checked ? 'dark' : 'light');
});
```

For it to work you also need to inline some JavaScript in the page to check the value in the storage on load, and add the class before anything renders or the user will see some flash between modes.

```js
if (localStorage.getItem('mode') === 'dark') {
  document.documentElement.classList.toggle(DARK_MODE_CLASSNAME, true);
}
```

This piece of code is what makes the dark mode update on reload.

Now, into the missing thing.

## Web storage has an event

Oh wow! **You didn't know?**

Me neither, or I knew and completely forgot it existed.

So, let's do a little test, grab any blog with a dark mode implementation, it can be yours or any of those cool blogs you and me read (lol, not this one, you think I was gonna release this piece without fixing this issue in my blog first? Please).

Open two tabs of that same site, or even better open two smaller windows, side by side. Same browser too or the trick won't work for sure.

In one window change the theme to _dark_, it probably didn't change on the other.

In the second window, the one stuck on _light_ mode, check the local storage items. You can open the terminal of the browser and run `localStorage` there.

You will see something like this.

```js
Storage { theme: "dark", length: 1 }
```

Wait, what? It says _dark_, but the page is not _dark_.

What happens is the browser is correctly updating `localStorage` across tabs as it changes, but we the developers aren't doing anything about it.

Now, the **missing** thing.

The web storage specification has a `storage` event, it fires on a page every time **another** page from the same domain has modified a value.

_This is important, the event won't fire on the same page where the change was made. Take this into account while testing._

The `event` object contains a property called _key_, indicating which item was changed in storage, for us that would be _mode_, and both an _oldValue_ and _newValue_ properties, pretty self-explanatory.

We can check the `key` value and `newValue` properties and react to a storage change happening somewhere else.

```js
window.addEventListener('storage', function (event) {
  if (event.key === 'mode') {
    document.documentElement.classList.toggle(
      DARK_MODE_CLASSNAME,
      event.newValue === 'dark'
    );
  }
});
```

And that's it! Now, go and fix the dark mode of your site, or let the developer of your favorite blog about it, open a pull request if you feel like it too.

### Some gotchas

If you are using [Browsersync](//browsersync.io/) as part of your development environment you might not see this issue while working locally on your project.

That's because _Browsersync is doing it for you_, but of course, it won't work once you deploy your site.

In your configuration, set `ghostMode` to `false` while working on this.

## About system color scheme

Something I didn't mention in this piece is the `prefers-color-scheme` option.

Instead of a custom toggle, you can consume whatever preference the user has set on their device, I wrote [an article about how to do that](/2019/05/a-css-variables-implementation-of-dark-mode/) already.

The reasons I didn't cover this approach here are:

- If you support _only_ that option, then your site is already _reactive_ to those setting changes.
- Even when `prefers-color-scheme` is in [a decent compatibility situation](//caniuse.com/prefers-color-scheme) in modern browsers, they depend on the device the user is in to have a color scheme setting, which is not always the case.
- The dark mode toggles I am talking about usually don't have this option, even if they do have a **three states toggle** and you repeat the user flow from above and choose the system option, the other previously opened tabs won't react to this configuration change.
- As a user, I don't change constantly the color scheme setting in my device depending on the site or time of the day. I am always on dark or light scheme and switch the specific site settings depending on the conditions I am in at the moment.

## Wrap up

Shout out to [Jake Archibald](//twitter.com/jaffathecake) who started a research on web storage usage, which I participated in. Reading his [findings](//docs.google.com/document/d/1cCTBZR6nWsVC2TlQ8PBse7eBb4ro0rtPJxX0zCou1lw/) led me to check all this.

Do you want to see a working solution to this? Go to [this link](//jeremenichelli-mode-but-right.glitch.me/) and check both the code from this article and a preview.

### Updates

**03 APR 2021** &mdash; After some people mentioned in social media the ommission to `prefers-color-scheme` approach, I added a note about it.
