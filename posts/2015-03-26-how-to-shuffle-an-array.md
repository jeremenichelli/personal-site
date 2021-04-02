---
title: How to shuffle an array in JavaScript
excerpt: The other day I was asked to sort randomly an array of objects, and while it didn't seem a very complex task it turned into hours of investigation. There are a lot of things to consider while dealing with randomizers, so yes, worth a post.
---

Whatever the solution was it needed to cover two concerns to beat any other possible one. First thing was the frequency distribution of the possible results which basically means that I wanted any combination to be equally probable to appear. The second one was performance.

Without overthinking too much about them I decided to quickly bring an algorithm that would do the job, just as a start and dive into alternatives and testing later.

## From the scratch

Trying to achieve equally probable results, I came up with this idea. First of all make a copy of the array. Get a random position, take the item in that position out of the array and put it inside a new one. Then repeat that again, considering now the array length has decreased by one until the copied array is empty.

The best thing of this approach is that every iteration is independent from the previous one, which it should be pretty obvious, but There are a lot of solutions in forums which don't even cover this. Let's start digging into this mentioned approach.

### Copy an array

We need to do this so we don't actually modify the original one. There's an array method called _slice_ that takes two parameters, a start position and a number of elements you want to take from that position.

It returns a new array containing only those elements, if you need a better understanding of it check [its MDN reference page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).

Interesting for us in this case scenario, if you don't pass any arguments to slice it returns a new array with the exact same elements, which is exactly what we need to prevent side effects inside our method.

```js
function shuffle(array) {
  var copiedArray = array.slice();
}
```

Remember that in JavaScript an object as a paramenet is passed as reference, so any modification inside the funciton is going to affect the original data, which we don't want.

### Get a random position

To start, we are going to rely on the good ol' [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random), which returns a number between `0` and `0.99` always.

Let's say we have an array with three elements, if we call this method and then multiply the result with the length of the array we can get a value between _zero_ and _almost three_.

With [Math.floor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) we remove the floating part of any of the possible result, and now we can get _zero_, _one_ or _two_, the three available indexes in our three elements array.

```js
function shuffle(array) {
  var copiedArray = array.slice();
  var len = copiedArray.length;
  var randomPosition;

  randomPosition = Math.floor(Math.random() * len);
}
```

Because we plan on reducing the length as we slice one element from the array, I'm going to put this logic inside a `while` loop which will end after we decrease the `len` variable to _zero_.

```js
function shuffle(array) {
  var copiedArray = array.slice();
  var len = copiedArray.length;
  var randomPosition;

  while (len) {
    randomPosition = Math.floor(Math.random() * len--);
  }
}
```

Simple and beautiful... but still doing nothing, we need to pick up an element randomly using the obtained `randomPosition` and push it to a new one.

### Return a new shuffled array

For this we can use again `splice` but this time we are going to pass `randomPosition` to point the element and `1` to indicate the amount of elements we are going to extract.

```js
function shuffle(array) {
  var copiedArray = array.slice();
  var len = copiedArray.length;
  var shuffledArray = [];
  var randomPosition;

  while (len) {
    randomPosition = Math.floor(Math.random() * len--);
    shuffledArray.push(copiedArray.splice(randomPosition, 1)[0]);
  }

  return shuffledArray;
}
```

And that's it! In terms of space this is creating two new arrays of the same length, which might not be optimal but in my case arrays longer than 20 items was weird so it wasn't a concern.

About its complexity in time, it would be `O(n)` in [Big O notation](https://en.wikipedia.org/wiki/Big_O_notation), more than acceptable for non-critical conditions.

We can even return early when an array is empty or only contains one element, which it happened a lot inside the business logic this code was placed.

```js
function shuffle(array) {
  if (array.length < 2) {
    return array;
  }

  var copiedArray = array.slice();
  var len = copiedArray.length;
  var shuffledArray = [];
  var randomPosition;

  while (len) {
    randomPosition = Math.floor(Math.random() * len--);
    shuffledArray.push(copiedArray.splice(randomPosition, 1)[0]);
  }

  return shuffledArray;
}
```

{% codeExampleLink 'https://jsfiddle.net/jeremenichelli/sbLjxweu/' %}

I've created a fiddle _(link above)_ where you can see this working. It also contains an iteration that gets executed a one hundred thousand times and its results showing the frequencies distribution in the console.

After running those tests and making sure it worked well I started searching for other possible alternatives and surprisingly found mine being more stable and reasonable to implement.

## Using sort, just don't

Don't get me wrong, I think [sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) is great, but when used for its original purposes, to establish a new known order in an array.

For that you need a criteria and a compare function that responds to it. Random isn't a known order and has no criteria, but well, here's the little monster I found out there.

```js
array.sort(function () {
  return 0.5 - Math.random();
});
```

Beautiful, isn't it? Just one line, something that will encourage you to put it inside your code right away because, you know, it's just one line! The problem is it isn't taking in consideration how _sort_ really works. Every time the compare function is called, sort expects a negative number, a positive number or zero.

In case the number is negative the second element in comparison will be moved before the first one, the opposite will happen if the number is positive and nothing will happen if the number returned is zero.

That's pretty useful when you are actually sorting elements but since we want to create a random scenario half of the times this compare function gets called nothing actually changes, leaving elements in their original position, which we don't want. If you send an array of two or three elements there's a high probability you will get the exact same order.

## The best solution out there

I imagined this problem wasn't new and that probably smarter people than me already had a solution for a well distributed and performant algorithm.

Luckily that was true. The solution is very old and it's called [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle), named after Ronald Fisher and Frank Yates and it assures that any possible permutation is equally possible.

This algorithm is the one applied by [lodash](https://github.com/lodash/lodash/blob/master/shuffle.js) in their `_.shuffle` method.

## Wrap-up

I knew there was probably a better solution for this before starting my own approach, but I think giving it a try gives you a great opportunity to think, investigate and learn a lot not only about the problem itself, but new methods, compromises and patterns.

That's the good thing about trying to make your own way through challenges. I hope this post reflected some of that experience and, in case you were looking for a nice solution to shuffle an array, you found it useful.
