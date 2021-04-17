---
title: The :first-child reset
excerpt: At some point in history, pseudo classes appear in scene to bring more power and versatility to our styles, but are we using them correctly? I feel like having these shortcuts available sometimes blind us and here's why.
---

To show a clear picture of this, let's start with a small example. Let's say we want to create a fluid three columns system with a gap in the middle.

```css
.column {
  float: left;
  margin-left: 5%;
  width: 30%;
}
```

Pretty simple, but it won't work just yet because we have three columns with `30%` of width and `5%` for left margin which gives us `105%`, not good. So, how would you solve this?

```css
.column {
  float: left;
  margin-left: 5%;
  width: 30%;
}

.column:first-child {
  margin-left: 0;
}
```

There you go. I'm sure you've seen this before so it's not that bad, is it? Well, it actually is. We are creating an unnecessary override and adding complexity to the layout calculation in just ten lines of styles.

It just doesn't feel good.

## An old workaround

There are a lot of selectors that we don't use on a daily basis because they are weird, we're not familiar with them or we just don't need them. Let's bring back one of those, [the plus selector](//developer.mozilla.org/en/docs/Web/CSS/Adjacent_sibling_selectors), which adds styles to adjacent elements.

So, instead of applying a style and immediately reseting it we could just do this:

```css
.column {
  float: left;
  width: 30%;
}

.column + .column {
  margin-left: 5px;
}
```

Following this approach, we avoid seeing this <del>margin-left: 5%</del> in the browser inspector.

## Wrap-up

Nesting is part of CSS, and it's not actually wrong to step over a style, but if you find a straight forward and readable solution with no hacks and to keep strikethrough rules at minimum the better.
