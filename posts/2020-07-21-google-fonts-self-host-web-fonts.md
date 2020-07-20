---
title: The cost of moving from Google Fonts to self-hosted web fonts
excerpt: In this article we are going to explore what it takes to self-host and serve your own font files, along with the benefits that come with it, and we are going to compare this with using Google Fonts.
---

Google Fonts has been one of my favorite products on the web of all time. It checks a lot of a lot of boxes, and there are really reasons for you to not use it.

When it happens you need to make sure you are delivering fonts at least _as good_ as them. Let's start with why it is such a good option.

## Why is Google Fonts so good?

When you decide to use a custom web font in your project, there are a lot of reasons why going with Google Fonts.

The first reason is its wide **catalog** with tons of options legally available.

Another really good feature is the network **distribution**. When more sites use Google Fonts, bigger are the chances the user has already downloaded the font you included in your project.

Finally, it's font files **optimization**. The team behind Google Fonts apply really smart compression and subsetting algorithms to shrink font files to small sizes.

They are doing a lot of smart performance optimizations for you. Now, after reading all oh this, **why would someone not use them?**

It could be the font you want is not on Google Fonts' catalog, or simply you want to take advantage of self-hosting your own assets.

## Self-hosting your own fonts

I recently launched a new design for this site, and as part of the release I wanted to push more performance improvements.

_It's fair to say the previous version was using Google Fonts, and was already in good shape, with a perfect score and good numbers in performance measuring tools like [Lighthouse](lighthouse)._

I described my font strategy several times in [articles](font-strategy-article) and [talks](font-strategy-talk), which included loading the stylesheet without blocking text content, switching to the custom font only when it is ready, and saving the stylesheet rules with web storage to prevent text flickering while navigating through the site.

Let's see how that strategy changes when you self-hosted your font files.

### Network distribution, cache and headers

The first step is to stop loading Google's stylesheet and move the files to your site. For this redesign I'm using [Inter](inter-font) by Rasmus Andersson, so I downloaded the font files into my own assets folder and add the font face rules to my styles.

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

These flashes are usually a sign of the browser changing the font family of the page because a style change or because a font file's finished loading. My guess was cache wasn't working correctly with these new files.

Looking at the HTTP Headers in the font files that Google delivers, they specify the following rule related to cache control.

```
cache-control: public, max-age=31536000
```

Looking at the ones coming from my self-hosted files, the value is different.

```
cache-control: public, max-age=0, must-revalidate
```

The new value indicates files need to be downloaded on every request and browsers shouldn't store them on cache. This is part of the things Google Fonts handle for us, the caching strategy, which now we need to do on our own.

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

On each step of the move, I'm checking performance metrics to make sure I'm not impacting negatively the site. One number went up badly was page size.

Using Google Fonts the homepage of this site was **~50Kb**, but my page weighted **~350Kb** with self-hosted font files.

Authors of typefaces usually provide glyphs and features for different usages and languages. The best solution is to create new font files containing only the ones your project needs.

_A great way to find out what your font file contains is to visit [wakamaifondue](wakamaifondue) and drop the files there. You will get a list of all symbols and features._

An important part of this is the **unicode range**, the group of symbols you will need. Tools like [glyphhanger](glyphhanger) can crawl the pages of your site and return the glyphs they are using.

Another option, specially if were already using Google Fonts is to rely on the unicode range they use to compress their font files, which is the following.

```bash
UNICODES="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

From the Inter family, I'm only going to make use of a small groups of the features it brings by default.

```bash
LAYOUT_FEATURES="ss01,cv05,cv11"
```

Next step is to use [fonttools](fonttools), a Python library that among other utilies provides a subsetting command. We need to provide files with _.ttf_ extension to it, as web font files are compressed formats.

```bash
pyftsubset "src/fonts/Inter-Regular.ttf" --layout-features=$LAYOUT_FEATURES --unicodes=$UNICODES
```

Additionally font files frequently include hinting. Some operative systems like _macOS_ ignore hinting at all, and they are usually relevant at small sizes, so I decided to remove them from my subset.

```bash
pyftsubset "src/fonts/Inter-Regular.ttf" --no-hinting --desubroutinize --layout-features=$LAYOUT_FEATURES --unicodes=$UNICODES
```

The final step is to output these as compressed files optimized for web usage.

### Font files compression

Unless you need to provide support for really old browsers, `woff` and `woff2` formats should be good enough.

_If you aren't sure, check [compatibility data](caniuse-woff) for compressed file formats._

To export files in this format you will need to install [zopfli](zopfli) and [brotli](brotli) Python libraries and specify the flavor you want to the `pyftsubset` command.

```bash
pyftsubset "src/fonts/Inter-Regular.ttf" --output-file="assets/fonts/Inter-Regular-subset.woff2" --flavor="woff2" --no-hinting --desubroutinize --layout-features=$LAYOUT_FEATURES --unicodes=$UNICODES
```

After doing this, each font file pass from weighing **~100Kb** to **~10Kb** bring the back the site to its original size of **~50Kb** for the homepage.

## Performance results

After moving to self-hosted web fonts and applying all these performance adjustems I used [webpagetest] to do a last performance comparison.

I set the configuration with a **Slow 3G** network in a Motorola G device using Chrome for Android. The first interesting number was **Speed Index**, it was a slightly faster but by a really small amount to actually make a difference.

That's good! It means my previous font loading strategy was already good, and even using a different domain as a resource wasn't affecting content delivery.

Metrics that improved were **Largest Contentful Paint** and **Fully Loaded** document as self-hosting your own assets eliminates the need to establish a new connection.

> When a resource comes from the same domain as the page, the DNS resolution, handshakes, and negotiation have all been made already

To start this process ahead you can add a `link` element with `preconnect` to the domain, and the Google Fonts version of the project had this set, but under certain conditions browsers can decide to ignore this completely.

_Pre-connecting to third party domains is a nice and recommended practice, but it's not a silver bullet approach for those resources to get faster to the user._

This in a way determines that self-hosting resources ends up making a bigger difference more users under a slow connection in terms of speed perception.

## Wrap-up

I mentioned this a lot of times in this article, Google Fonts is fast, _really fast_, and checks all the boxes for a safe and well executed third party resource.

Even then, the benefits of self-hosting your own font files are still relevant, but for it to make sense **you need to match their optimizations** like caching strategy, font subsetting and compression.

You can't afford doing all these steps on your project? **It's fine**, Google Fonts is still more than a reasonable choice.

_If you do so, Harry Roberts recently wrote an [article on the fastest way to deliver Google Fonts](fastest-google-fonts) for your site, I highly recommend._

Here's a **TL;DR** list of optimizations and things to remember if you decide to self-host your font files:

- Make sure files are correctly cached by checking their response headers.
- Decide on a set of glyphs and font features and create a subset file.
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
