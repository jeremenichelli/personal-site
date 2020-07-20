---
title: Getting an object property from a string
excerpt: One of the puzzles I had to solve when writing a data binding script was how to get the value of a property from the value of an attribute. As always, I decided to go my own way before looking for other solutions.
---

The result was very good so I forgot to look at third party solutions. Later I did a little investigation and found some resources that provide solutions to this riddle. Here's my approach.

## Getting the attribute of a node

The start point for this is a _node_ object which has a property called _attributes_, an array-like list with all the attributes of the element. Pretty obvious so far.

```js
var node = document.getElementById('sample-element')
var attrs = node.attributes
var sampleAttr = attrs[0]
```

The value of this attribute is accessible by doing _sampleAttr.value_. When you're using a data binding library (or writing one) you get something like this _'user.name.first'_.

```js
var model = {
  user: {
    name: {
      first: 'John',
      last: 'Oliver'
    }
  }
}
```

Now the question is how we could get the value _'John'_ given this model and the string _'user.name.first'_.

```js
function getFromPath(obj, path) {
  var props = path.split('.')
  var newObj = obj

  for (var i = 0, len = props.length; i < len; i++) {
    if (newObj[props[i]] !== null && newObj[props[i]] !== undefined) {
      newObj = newObj[props[i]]
    } else {
      return null
    }
  }

  return newObj
}
```

Basically what we're doing is splitting the string to get an array of properties, in this case _user_, _name_ and _first_. Then we're looping this array and if the value exists in the base object we override it.

It's not hard to understand this since it's a simple loop and we are getting more deeply into the object with each iteration until there are no properties left to explore. If we pass to the function a path like _'user.name.middle'_ the code will get an _undefined_ value and return _null_ breaking the iteration.

## Modules and libraries

It doesn't get mentioned a lot, but <a href="https://lodash.com/" target="_blank">lodash</a> is a really nice library that solves a lot of things for you in the operations with objects area. This library contains a method called _get_ which solves the exact same thing and you can find it in its <a href="https://github.com/lodash/lodash/blob/master/lodash.js#L9386" target="_blank">github file</a>.

A not so popular **npm module** called <a href="https://www.npmjs.com/package/delve" target="_blank">delve</a> also tackled this problem.

A good thing about **lodash**'s approach is that it lets you pass a default value as fallback if the property is not found. That's something we can easily add to the first approach.

```js
function getFromPath(obj, path, defaultValue) {
  var props = path.split('.')
  var newObj = obj

  for (var i = 0, len = props.length; i < len; i++) {
    if (newObj[props[i]] !== null && newObj[props[i]] !== undefined) {
      newObj = newObj[props[i]]
    } else {
      return defaultValue || null
    }
  }

  return newObj
}

var model = {
  user: {
    name: {
      first: 'John',
      last: 'Oliver'
    }
  }
}

var middleName = getFromPath(model, 'user.name.middle', 'William')
// middleName value is "William"
```

## Performance

Looking for a brief code that solves this, **lodash** uses _while_ to iterate the base object, and while _while_ is shorter than using _for_, the speed difference is huge. Yes, I put while twice there.

As a consequence, _delve_ and my first approach itself are faster than _lodash_ approach and <a href="http://jsperf.com/lodash-get-vs-monster-method/2" target="_blank">perform better</a>.

I'm seeing a lot of solved-in-one-line approaches that work like a magic trick, and actually solve the problem which is great, but they are not the best choices if you're taking performance in account. Remember that when the code is minified and gzipped the differences in using a _while_ loop or a _for_ loop are just bytes, but speed can get really affected.

If you look at **delve** code you'll notice that it also uses _while_. The reason why **delve** is faster than **lodash** when they are both using similar approaches is that the second one contains other methods that are used by more than one public function, so it makes sense to have them there but they are just more functions call for the same action.

Obviously if you use this method just a couple of times it won't hurt a lot, but it will depend on the problem a project is trying to solve.

## Wrap-up

Libraries are good (**lodash** is great in my opinion) it solves a lot of problems, but they also contain general private methods and no so performant choices that can slow down the execution of simple operations.

In case you need it, my approach is in this [gist](//gist.github.com/jeremenichelli/63b75db9434272b16d1d).

_And yes, I love John Oliver._
