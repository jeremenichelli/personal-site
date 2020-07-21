---
title: The cost of moving from Google Fonts to self-hosted web fonts
excerpt: In this article we are going to explore what it takes to self-host and serve your own font files, along with the benefits that come with it, and we are going to compare this with using Google Fonts.
---

Google Fonts has been one of my favorite products on the web of all time. It checks a lot of boxes, and there aren't many reasons for you to not use it.

When you decide to self-host your font files you need to make sure you are delivering them at least _as good_ as them.

## Why is Google Fonts so good?

When you decide to use a custom web font in your project, there are a lot of reasons why going with Google Fonts is a good choice.

The first one is its wide **catalog** with tons of options legally available.

Another really good feature is the network **distribution**. When more sites use Google Fonts, bigger are the chances the user has already downloaded the font you included in your project.

Finally, it's font files **optimization**. The team behind Google Fonts apply really smart compression and subsetting algorithms to shrink font files to small sizes.

They are doing a lot of smart performance optimizations for you. Now, after reading all this, **why would someone not use Google Fonts?**

It could be the font you want is not on Google Fonts' catalog, or simply you want the benefits of self-hosting your own assets.

## Self-hosting your own fonts

I recently launched a new design for this site, and as part of the release I wanted to push even more performance improvements.

_It's fair to say the previous version was using Google Fonts, and was already in good shape, with a perfect score and good numbers in performance measuring tools like [Lighthouse](lighthouse)._

I described my font strategy several times in [articles](font-strategy-article) and [talks](font-strategy-talk), which included loading the stylesheet without blocking text content, switching to the custom font only when it is ready, and saving the stylesheet rules with web storage to prevent text flickering while navigating through the site.

Let's see how that strategy changes when you self-hosted your font files.

### Network distribution, cache and headers

The first step is to stop loading Google's stylesheet and move files to your site.

For this redesign I'm using [Inter](inter-font) by Rasmus Andersson, so I downloaded the font files into my own assets folder and added the font face rules to my styles.

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/Inter-Regular.woff2') format('woff2'), url('/assets/fonts/Inter-Regular.woff')
      format('woff');
}

@font-face {
  font-family: 'Inter';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/assets/fonts/Inter-Italic.woff2') format('woff2'), url('/assets/fonts/Inter-Italic.woff')
      format('woff');
}
```

_We are adding "font-display: swap" to prevent blocking text display to the user while the font files are loading._

I used to load the stylesheet asynchronously with a small amount of JavaScript inlined in the `head` of the page, to inject its content on forthcoming visits. This, plus browser caching font files prevented flashes on every page navigation.

Now that I'm in control of those font files and font face rules, I'm inlining that CSS straight into the page.

_If the amount of font face rules is really big, I would still recommend to put them in a CSS file and load it asynchronously, as an initial flash will always be on the first visit._

With font files under my directory and style rules in place I proceed to navigate through a preview of the site, and to my surprise I see flashes of text on every single navigation.

These flashes are usually a sign of the browser changing the font family of the page because a style has changed or a font file's finished loading.

Looking at the HTTP Headers in the font files that Google delivers, they specify the following rule related to cache control.

```
cache-control: public, max-age=31536000
```

Looking at the ones coming from my self-hosted files, the value is the following.

```
cache-control: public, max-age=0, must-revalidate
```

The presence of `must-revalidate` plus `max-age=0` tells the browser to fetch the resource on every request and never store the resource in cache.

This is probably the default in my server for this type of assets. The caching strategy is one of the many things Google Fonts handles for us, which needs to be defined on our side now.

As this site is deployed on Netlify, in my _netlify.toml_ configuration file I set the headers for the font assets.

```toml
[[headers]]
  for = '/assets/fonts/*'
  [headers.values]
    cache-control = 'public, max-age=31536000'
```

_Depending on what you are using to deploy your site, how you solve this part will be different._

After this change, font files are retrieved from browser cache every time I navigate to a new page in the site, without any text flickering.

### Font subsetting

On each step of the move, I'm checking performance metrics to make sure I'm not impacting negatively the site. One number went up badly, page size.

Using Google Fonts the homepage of this site was **~50Kb**, but my page weighted **~350Kb** with self-hosted font files.

Authors of typefaces usually provide glyphs and features for different usages and languages. The best solution is to create new font files containing only the ones your project needs.

_A great way to find out what your font files contain is to visit [wakamaifondue](wakamaifondue) and drop them there. You will get a list of all symbols and features._

An important part of this is the **unicode range**, the group of symbols your project needs. Tools like [glyphhanger](glyphhanger) can crawl the pages of your site and return the glyphs they are using.

Another option, specially if you were already using Google Fonts is to rely on the unicode range they use to compress their font files.

```bash
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

From the Inter family, I'm only going to make use of a small group of the features it brings by default.

```bash
LAYOUT_FEATURES="ss01,cv05,cv11"
```

Next step is to use [fonttools](fonttools), a Python library that among other utilies provides a subsetting command. We need to pass files with _.ttf_ extension to it.

```bash
pyftsubset "src/fonts/Inter-Regular.ttf" --layout-features=$LAYOUT_FEATURES --unicodes=$UNICODES
```

Additionally font files frequently include hinting. Some operative systems like _macOS_ ignore hinting at all, and improvements are relevant only at small sizes, so I decided to remove them from my subset.

```bash
pyftsubset "src/fonts/Inter-Regular.ttf" --no-hinting --desubroutinize --layout-features=$LAYOUT_FEATURES --unicodes=$UNICODES
```

The final step is to output these as compressed files optimized for web usage.

### Font files compression

Unless you need to support really old browsers, `woff` and `woff2` formats should be good enough.

_If you aren't sure, check [compatibility data](caniuse-woff) for compressed file formats._

To export files in these formats you will have to install [zopfli](zopfli) and [brotli](brotli) Python libraries and specify the flavor you want to the `pyftsubset` command.

```bash
pyftsubset "src/fonts/Inter-Regular.ttf" --output-file="assets/fonts/Inter-Regular-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --layout-features=$LAYOUT_FEATURES --unicodes=$UNICODES
```

After doing this, each font file went from weighing **~100Kb** to **~10Kb** bringing back the site to its original size of **~50Kb** for the homepage.

## Performance results

After moving to self-hosted web fonts and applying all these performance adjustments I used [webpagetest] to run a last performance comparison.

I set the configuration with a **Slow 3G** network in a Motorola G device using Chrome for Android. The first interesting number was **Speed Index**, it was a slightly faster but by a really small amount to actually make a difference.

That's good! It means my previous font loading strategy was good, and using a different domain for my fonts wasn't affecting content delivery.

Metrics which improved were **Largest Contentful Paint** and **Fully Loaded** document as self-hosting your own assets eliminates the need to start and wait for a new domain connection.

> When a resource comes from the same domain as the page, the DNS resolution, handshakes, and negotiation have all been made already

For third-party requests using `link` with `preconnect` usually allows the browser to run these connections ahead of the resource being needed.

The Google Fonts version of the project had this set, but under certain conditions like a slow network it might not make any difference at all, and browsers might even decide to ignore this.

_Pre-connecting to third party domains is still a recommended practice, but it's not a silver bullet approach for third-party assets to get faster to the user._

In a way this demonstrates self-hosting resources ends up making a bigger difference for those users under a slow connections.

## Wrap-up

I have mentioned this a lot of times in this article, Google Fonts is _really fast_, and checks all the boxes for a safe and well executed third-party resource.

The benefits of self-hosting font files are still relevant, but **you need to match their optimizations** like caching strategy, font subsetting and file compression.

You can't afford all these actions on your project? **It's fine**, Google Fonts is still more than a fair and reasonable choice.

_If you do so, Harry Roberts recently wrote an [article on the fastest way to deliver Google Fonts](fastest-google-fonts) for your site, I highly recommend._

Here's a **TL;DR** list of optimizations and things to remember if you decide to self-host your font files:

- Make sure files are correctly cached by checking their response headers.
- Decide on a set of glyphs and font features, and create a subset file.
- Using modern techniques and tools to compress the final files.
- Measure and compare the performance of your strategies to be sure they represent an advantage for your project and the users.

_Shout out to Zach Leatherman's article [Developing a Robust Font Loading Strategy for CSS-Tricks](css-tricks-web-fonts) which was a huge help while applying all these optimizations plus a great inspiration for writing this article._

[lighthouse]: //developers.google.com/web/tools/lighthouse
[font-strategy-article]: /2016/05/font-loading-strategy-static-generated-sites/
[font-strategy-talk]: //youtu.be/TFWTVwgdNPA
[font-face-observer]: //fontfaceobserver.com/
[inter-font]: //rsms.me/inter/
[wakamaifondue]: //wakamaifondue.com/
[glyphhanger]: //github.com/filamentgroup/glyphhanger
[fonttools]: //github.com/fonttools/fonttools
[caniuse-woff]: //caniuse.com/#search=woff
[zopfli]: //github.com/anthrotype/py-zopfli
[brotli]: //github.com/google/brotli
[webpagetest]: //webpagetest.org
[fastest-google-fonts]: //csswizardry.com/2020/05/the-fastest-google-fonts/
[css-tricks-web-fonts]: //www.zachleat.com/web/css-tricks-web-fonts/
