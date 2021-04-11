---
title: Writing asynchronous tasks in modern JavaScript
excerpt: In this article, we are going to explore the evolution of JavaScript around asynchronous execution in the past era and how it changed the way we write and read code. We will start with the beginnings of web development, and go all the way to modern asynchronous pattern examples.
host: Smashing Magazine
host_url: //www.smashingmagazine.com
external_url: //www.smashingmagazine.com/2019/10/asynchronous-tasks-modern-javascript/
---

JavaScript has two main characteristics as a programming language, both important to understand how our code will work. First is its **synchronous** nature, which means the code will run line after line, _almost_ as you read it, and secondly that it is **single-threaded**, only one command is being executed at any time.

As the language evolved, new artifacts appeared in the scene to allow asynchronous execution; developers tried different approaches while solving more complicated algorithms and data flows, which led to the emergence of new interfaces and patterns around them.

## Synchronous Execution And The Observer Pattern

As mentioned in the introduction, JavaScript runs the code you write line by line, most of the time. Even in its first years, the language had exceptions to this rule, though they were a few and you might know them already: HTTP Requests, DOM events and time intervals.

```js
const button = document.querySelector('button');

// observe for user interaction
button.addEventListener('click', function (e) {
  console.log('user click just happened!');
});
```

If we add an event listener, for example the click of an element and the user triggers this interaction, the JavaScript engine will queue a task for the event listener callback but will continue executing what is present in its current stack. After it’s done with the calls present there, it will now run the listener’s callback.

This behavior is similar to what happens with network requests and timers, which were the first artifacts to access to asynchronous execution for web developers.

Though these were exceptions of common synchronous execution in JavaScript, it’s crucial to understand that the language is still single-threaded and though it can queue taks, run them asynchronously and then go back to the main thread, it can only execute one piece of code at a time.

For example, let’s check out a network request.

```js
var request = new XMLHttpRequest();
request.open('GET', '//some.api.at/server', true);

// observe for server response
request.onreadystatechange = function () {
  if (request.readyState === 4 && request.status === 200) {
    console.log(request.responseText);
  }
};

request.send();
```

When the server comes back, a task for the method assigned to `onreadystatechange` is queued (code execution continues in the main thread).

_Explaining how JavaScript engines queue tasks and handle execution threads is a complex topic to cover and probably deserves an article of its own. Still, I recommend watching [What The Heck Is The Event Loop Anyway?](//www.youtube.com/watch?v=8aGhZQkoFbQ) by Phillip Roberts to help you get a better understanding._

In each case mentioned, we are responding to an external event. A certain interval of time reached, a user action or a server response. We weren’t able to create an asynchronous task per se, we always _observed_ occurrences happening outside of our reach.

This is why code shaped this way is called the **Observer Pattern**, which is better represented by the `addEventListener` interface in this case. Soon event emitters libraries or frameworks exposing this pattern flourished.

### Node.js And Event Emitters

A good example is Node.js which page describes itself as “an asynchronous event-driven JavaScript runtime”, so event emitters and callback were first-class citizens. It even had an `EventEmitter` constructor already implemented.

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// respond to events
emitter.on('greeting', (message) => console.log(message));

// send events
emitter.emit('greeting', 'Hi there!');
```

This was not only the to-go approach for asynchronous execution but a core pattern and convention of its ecosystem. Node.js opened a new era of writing JavaScript in a different environment — even outside the web. As a consequence, other asynchronous situations were possible, like creating new directories or writing files.

```js
const { mkdir, writeFile } = require('fs');

const styles = 'body { background: #ffdead; }';

mkdir('./assets/', (error) => {
  if (!error) {
    writeFile('assets/main.css', styles, 'utf-8', (error) => {
      if (!error) console.log('stylesheet created');
    });
  }
});
```

You might notice that callbacks receive an `error` as a first argument, if a response data is expected, it goes as a second argument. This was called **Error-first Callback Pattern**, which became a convention that authors and contributors adopted for their own packages and libraries.

## Promises And The Endless Callback Chain

As web development faced more complex problems to solve, the need for better asynchronous artifacts appeared. If we look at the last code snippet, we can see a repeated callback chaining which doesn’t scale well as the number tasks increase.

For example, let’s add only two more steps, file reading and styles preprocessing.

```js
const { mkdir, writeFile, readFile } = require('fs');
const less = require('less');

readFile('./main.less', 'utf-8', (error, data) => {
  if (error) throw error;
  less.render(data, (lessError, output) => {
    if (lessError) throw lessError;
    mkdir('./assets/', (dirError) => {
      if (dirError) throw dirError;
      writeFile('assets/main.css', output.css, 'utf-8', (writeError) => {
        if (writeError) throw writeError;
        console.log('stylesheet created');
      });
    });
  });
});
```

We can see how as the program we are writing gets more complex the code becomes harder to follow for the human eye due to multiple callback chaining and repeated error handling.

### Promises, Wrappers And Chain Patterns

`Promises` didn’t receive much attention when they were first announced as the new addition to the JavaScript language, they aren’t a new concept as other languages had similar implementations decades before. Truth is, they turned out to change a lot the semantics and structure of most of the projects I worked on since its appearance.

`Promises` not only introduced a built-in solution for developers to write asynchronous code but also opened a new stage in web development serving as the construction base of later new features of the web spec like `fetch`.

Migrating a method from a callback approach to a promise-based one became more and more usual in projects (such as libraries and browsers), and even Node.js started slowly migrating to them.

Let’s, for example, wrap Node’s `readFile` method:

```js
const { readFile } = require('fs');

const asyncReadFile = (path, options) => {
  return new Promise((resolve, reject) => {
    readFile(path, options, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
};
```

Here we obscure the callback by executing inside a Promise constructor, calling `resolve` when the method result is successful, and `reject` when the error object is defined.

When a method returns a `Promise` object we can follow its successful resolution by passing a function to `then`, its argument is the value which the promise was resolved, in this case, `data`.

If an error was thrown during the method the `catch` function will be called, if present.

_If you need to understand more in-depth how Promises work, I recommend Jake Archibald’s [JavaScript Promises: An Introduction](//developers.google.com/web/fundamentals/primers/promises) article which he wrote on Google’s web development blog._

Now we can use these new methods and avoid callback chains.

```js
asyncRead('./main.less', 'utf-8')
  .then((data) => console.log('file content', data))
  .catch((error) => console.error('something went wrong', error));
```

Having a native way to create asynchronous tasks and a clear interface to follow up its possible results enabled the industry to move out of the Observer Pattern. Promise-based ones seemed to solve the unreadable and prone-to-error code.

_As a better syntax highlighting or clearer error messages help while coding, a code that is easier to reason becomes more predictable for the developer reading it, with a better picture of the execution path the easier to catch a possible pitfall._

`Promises` adoption was so global in the community that Node.js rapidly release built-in versions of its I/O methods to return Promise objects like importing them file operations from `fs.promises`.

It even provided a `promisify` util to wrap any function which followed the Error-first Callback Pattern and transform it into a Promise-based one.

#### But do Promises help in all cases?

Let’s re-imagine our style preprocessing task written with Promises.

```js
const { mkdir, writeFile, readFile } = require('fs').promises;
const less = require('less');

readFile('./main.less', 'utf-8')
  .then(less.render)
  .then((result) =>
    mkdir('./assets').then(() =>
      writeFile('assets/main.css', result.css, 'utf-8')
    )
  )
  .catch((error) => console.error(error));
```

There is a clear reduction of redundancy in the code, especially around the error handling as we now rely on `catch`, but Promises somehow failed to deliver a clear code indentation that directly relates to the concatenation of actions.

This is actually achieved on the first `then` statement after `readFile` is called. What happens after these lines is the need to create a new scope where we can first make the directory, to later write the result in a file. This causes a _break_ into the indentation rhythm, not making it easy to determinate the instructions sequence at first glance.

A way to solve this is to pre-baked a custom method that handles this and allows the correct concatenation of the method, but we would be introducing one more depth of complexity to a code that already seems to have what it needs to achieve the task we want.

_Take in count this is an example program, and we are in control around some of the methods and they all follow an industry convention, but that’s not always the case. With more complex concatenations or the introduction of a library with a different shape, our code style can easily break._

Gladly, the JavaScript community learned again from other language syntaxes and added a notation that helps a lot around these cases where asynchronous tasks concatenation is not as pleasant or straight-forward to read as synchronous code is.

## Async And Await

A `Promise` is defined as an unresolved value at execution time, and creating an instance of a `Promise` is an _explicit_ call of this artifact.

```js
const { mkdir, writeFile, readFile } = require('fs').promises;
const less = require('less');

readFile('./main.less', 'utf-8')
  .then(less.render)
  .then((result) =>
    mkdir('./assets').then(() => {
      writeFile('assets/main.css', result.css, 'utf-8');
    })
  )
  .catch((error) => console.error(error));
```

Inside an async method, we can use the `await` reserved word to determinate the resolution of a `Promise` before continuing its execution.

Let’s revisit or code snippet using this syntax.

```js
const { mkdir, writeFile, readFile } = require('fs').promises;
const less = require('less');

async function processLess() {
  const content = await readFile('./main.less', 'utf-8');
  const result = await less.render(content);
  await mkdir('./assets');
  await writeFile('assets/main.css', result.css, 'utf-8');
}

processLess();
```

Notice that we needed to move all our code to a method because we can’t use `await` outside the scope of an async function today.

Every time an async method finds an `await` statement, it will stop executing until the proceeding value or promise gets resolved.

There’s a clear consequence of using async/await notation, despite its asynchronous execution, the code looks as if it was _synchronous_, which is something we developers are more used to see and reason around.

What about error handling? For it, we use statements that have been present for a long time in the language, `try` and `catch`.

```js
const { mkdir, writeFile, readFile } = require('fs').promises;
const less = require('less');

async function processLess() {
  try {
    const content = await readFile('./main.less', 'utf-8');
    const result = await less.render(content);
    await mkdir('./assets');
    await writeFile('assets/main.css', result.css, 'utf-8');
  } catch (e) {
    console.error(e);
  }
}

processLess();
```

We rest assured any error thrown in the process will be handled by the code inside the `catch` statement. We have a centric place that takes care of error handling, but now we have a code that is easier to read and follow.

Having consequent actions that returned value doesn’t need to be stored in variables like `mkdir` that don’t break the code rhythm; there’s also no need to create a new scope to access the value of `result` in a later step.

It’s safe to say Promises were a fundamental artifact introduced in the language, necessary to enable async/await notation in JavaScript, which you can use on both modern browsers and latest versions of Node.js.

_Recently in JSConf, Ryan Dahl, creator and first contributor of Node, [regretted not sticking to Promises](//www.youtube.com/watch?v=M3BM9TB-8yA) on its early development mostly because the goal of Node was to create event-driven servers and file management which the Observer pattern served better for._

## Conclusion

The introduction of Promises into the web development world came to change the way we queue actions in our code and changed how we reason about our code execution and how we author libraries and packages.

But moving away from chains of callback is harder to solve, I think that having to pass a method to `then` didn’t help us to move away from the train of thought after years of being accustomed to the Observer Pattern and approaches adopted by major vendors in the community like Node.js.

As Nolan Lawson says in his [excellent article about wrong uses in Promise concatenations](//pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html), _old callback habits die hard!_ He later explains how to escape some of these pitfalls.

I believe Promises were needed as a middle step to allow a natural way to generate asynchronous tasks but didn’t help us much to move forward on better code patterns, sometimes you actually need a more adaptable and improved language syntax.

> As we try to solve more complex puzzles using JavaScript, we see the need for a more mature language and we experiment with architectures and patterns we weren’t used to seeing on the web before.

We still don’t know how the ECMAScript spec will look in years as we are always extending the JavaScript governance outside the web and try to solve more complicated puzzles.

It’s hard to say now what _exactly_ we will need from the language for some of these puzzles to turn into simpler programs, but I’m happy with how the web and JavaScript itself are moving things, trying to adapt to challenges and new environments. I feel right now JavaScript is a more _asynchronous friendly place_ than when I started writing code in a browser over a decade ago.

### Further Reading

- [JavaScript Promises: An Introduction](//developers.google.com/web/fundamentals/primers/promises) article by Jake Archibald
- [Promise Anti-Patterns](//github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern) at Bluebird library documentation
- [We Have A Problem With Promises](//pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html) article by Nolan Lawson
