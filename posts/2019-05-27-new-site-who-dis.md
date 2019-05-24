---
title: New site, show dis?
excerpt: As I do every year, I went through my personal sites doing some refreshing and improvements. Here the main take aways and lessons learned, in case you are curious.
---

So, let's start with the design changes.

## Design

In terms of design no much changed. I did style from the grown up all again and it's relying more on __normalize_ and browsers default styles to minimize the styling footprint, more details on this in the next section.

I stuck with this minimalistic style, which also helps a lot performance. This is a small site so of course scaling isn't a threat and that's a lot, but still there are a lot of details and they are thought and grouped in a manner to help serve a performance purpose at the end of the line.

I moved the site to a [new repository](//github.com/jeremenichelli/personal-site), which means you can still [check out the old one](//github.com/jeremenichelli/jeremenichelli.github.io) and compare it if you want to.

## Styles

As said before, though styles haven't change a lot I coded all from scratch, and there are good reasons for this. The overall feeling I had previously was that I was over-adjusting a lot of corners of browsers default styles, at a level that human eyes couldn't detect even.

Overly obsess with minimizing styling too, I was using bare tags as selectors, which made me use some elements not for their semantic meaning but because of the _styling shortcut_ they provided. The site in terms of accessibility wasn't bad, but could have been better.

The metodology I went for is, design on the browser and **use only class names** for styling. This made me, first, use the right and preffered tags for content and only override the necessary styles, relying less on the cascade effect of CSS.

I'm using [LESS](//lesscss.org/), not much for its syntax and features, but as a bundling tool. Each page has a _type_ indicator in the frontmatter and for each a `type.less` file where I only import and write the styles necessary for it. The result is so minimal that I directly inline the styles in the head. Finally, I pass the processed styles through [cssnano](//cssnano.com) and export them as partials to get included in the `head` of pages.

## Scripts

There's no much JavaScript around the site, and most of it takes care of the web font loading strategy. The static output assumes the user has disabled JavaScript and unless an inline script runs at the beginning then no animations run on the homepage and no web font nor other dependencies are loaded giving the user a complete opt-out of network resources needed, only content.

If the user has JavaScript enable then, a stylesheet containing font face rules and a script which will observe the fonts are both asynchronously loaded. If this procedure is successful then I use [store-css](//github.com/jeremenichelli/store-css) to save in local storage the font face rules in addition to a `fonts-chaced` flag, browser cached does the rest for future inner navigations.

I wrote about this approach in [this article](/2016/05/font-loading-strategy-static-generated-sites/) a while ago if you are interested.

## Animations

Home page has some little orchestrated animations, the page waits for maximum of three seconds to the web fonts to be loaded, if not it will kick off and it won't run at all if user has disabled JavaScript.

In the previous version of this site I was using transitions and transition delays, this caused them to be _fast-forwarded_ on repeated views and strage side effects on resizes. This is why I'm know using animation keyframes.

## Static generator

Originally this site was using [Jekyll](//jekyllrb.com) and [GitHub Pages](https://pages.github.com/), a really convenient setup to quickly launch something without much overhead and a decision I would still recommend to anyone.

Sadly as the content grew, Jekyll couldn't handle updates fast even with incremental builds option turned on, making the experience really bad for writing or site small adjustments, so I decided to give [Eleventy](//11ty.io) a try.

Eleventy is basically a Jekyll implementation in Node.js, but with more extensibility, control and template language options. The most important thing, _builds are fast_ folks, really fast.

### New ecosystem, new gotchas

The move was smooth in a lot of corners, and not as smooth as I would have liked in others. Most of the package defaults are the same as Jekyll like template language and directories which it's great when migrating. But now _liquid_ and _markdown_ parsers are JavaScript implementations which have differences with their Ruby counterparts so some snippets weren't _just working_ out the box.

Most of this differences are not bugs though, since there aren't real standards around but is good to keep [these](https://github.com/11ty/eleventy/issues/68#issuecomment-383386627) [gotchas](https://github.com/11ty/eleventy/issues/533) in mind if you are going to move a Jekyll site to Eleventy.

In addition, Jekyll extends _liquid_ with some useful filters that aren't present, the good thing is that Eleventy is super extensible so you can create these missing parts in seconds, eleventy has really good up-to-date documentation and Paul Lloyd wrote [a great introduction article](//github.com/11ty/eleventy/issues/533) I strongly recommend.

## Hosting

One of the things that performance tool were _penalizing_ my site for was low server response which wasn't much in my control. Now this site lives in [Netlify](//netlify.com) supporting secure connections, branch previews and continuous deployment in addition to CDN distribution.

> Netlify is the thing I wished was available when I was a kid throwing invalid html to an ftp server like twenty years&nbsp;ago.

As much as I recommend the simplest setup to new developers and beginners, to focus more on code and learning than in infrastructure and servers, Netlify is just so simple that was the simplest thing in the long migration list I had.

## Wrap-up

As I said on Twitter some time ago, a personal site is this place where you can show _who you are_ and by roaming around mine and reading this piece you will notice that, first, I'm definitely not a designer and I'm quite obsessed with performance.

I always say that business is the main threat to a performant web, thrid party scripts, complex and badly orchestrated feature implementations are coming from it. This is why is interesting how people deal with optimizations while keeping business together, but here _there'sno business_, this is me and my playground.

My playground, my rules.

### Credits

_Huge thanks to [Zach Leatherman](//twitter.com/zachleat) for Eleventy, [Jun Yang](//github.com/harttle) for liquijds, and [Alex Kocharin](github.com/rlidwka) and [Vitaly Puzrin](//github.com/puzrin) for markdown-it, technologies this site heavily relies on._
