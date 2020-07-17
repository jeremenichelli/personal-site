---
title: I love the ampersand
excerpt: Small things can make a big difference. It costed me a lot to move from plain CSS to preprocessors languages, but somehow LESS convinced me and its little shorcuts are the way I enjoy the most and the ampersand is one of those small things.
---

## &amp;

For the ones that don't work with SASS or LESS or never heard about it, the ampersand when it's placed inside a common selector declaration refers to the selector itself.

Examples are better, right?

```less
.box {
  display: block;
  float: left;

  &.small {
    height: 40px;
    width: 40px;
  }

  &.large {
    height: 90px;
    width: 90px;
  }
}
```

Remember that new declarations inside curly braces in LESS indicates inner elements, but using an ampersand changes everything and we are now indicating that a _.box_ element with an additional class that can be **small** or **medium** needs extra styles. This is the result...

```css
.box.small {
  display: block;
  float: left;
  height: 40px;
  width: 40px;
}

.box.medium {
  display: block;
  float: left;
  height: 90px;
  width: 90px;
}
```

It's a nice touch, maybe not a big thing. To me this little guy it's great when working with elements that have pseudo-elements or different states like buttons or links. It's also very useful inside mixins.

```less
.clearfix() {
  &:before,
  &:after {
    content: '';
    display: table;
  }

  &:after {
    clear: both;
  }
}
```

I love how the symbol eliminates the noise in the declaration. You know that everything inside that mixin takes care of one specific thing,. It's like a closure, you don't need to look for other style declaration for that, it's all there. Simpler to read, ergo simpler to mantain.

## Bringing mixins to the game

Now let's see what happens when you need to style buttons or links.

```less
.button() {
  background-color: #f90000;
  border: solid 1px #9a3590;
  border-radius: 3px;
  color: #ffffff;
  min-width: 120px;
  padding: 10px;

  &:hover {
    background-color: #ff3a3a;
  }

  &[disabled] {
    opacity: 0.5;
  }
}
```

The code is pretty straight forward and if you use variables inside the mixin you can build flavors of button in a really easy way.

```less
.button(@color) {
  background-color: @color;
  border: solid 1px @color - #555555;
  border-radius: 3px;
  color: #ffffff;
  min-width: 120px;
  padding: 10px;

  &:hover {
    background-color: @color + #222222;
  }

  &:active {
    background-color: @color + #111111;
    color: #e0e0e0;
  }

  &[disabled] {
    opacity: 0.5;
  }
}

.red-button {
  .button(#d32f2f);
}

.blue-button {
  .button(#303f9f);
}

.green-button {
  .button(#388e3c);
}
```

I don't know you but to me that's beautiful.

## Variable interpolation

Well this has nothing to do with the ampersand selector, but this simple feature is a beast if you know where you can use it. What it basically does is to put variables content inside strings. Again, examples are better.

```less
@base-img-url: '../img' #header{
  background-image: url('@{base-img-url}/banner.jpg');
  background-repeat: no-repeat;
};
```

There's a higher chance you'll use the same base path for images so in case you need to change it for some reason, you only have to do it in one place.

Here's another place where I usually need this...

```less
.opacity(@value) {
  @percentValue: @value * 100;
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=@{percentValue})';
  filter: alpha(opacity=7 @percentValue);
  -moz-opacity: @value;
  -khtml-opacity: @value;
  opacity: @value;
}

.overlay {
  .opacity(0.75);
  background-color: #000000;
  transition: opacity 0.25s ease;

  &.closed {
    .opacity(0);
  }
}
```

## Wrap-up

Small patterns usually behave in a more flexible way, they can bend and adapt to different situations.

If you are interested in more LESS awesomeness you can go to the <a href="http://lesscss.org/features/" target="_blank">official language features reference</a>.
