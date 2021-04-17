---
title: Using Gulp
excerpt: How to quickly start improving your project tasks with this package.
---

To be honest I don't have a lot of experience with Grunt or other task runners. The main reason is that when this automation fever started more than a year ago in the front end community, [Gulp](//www.gulpjs.com) was my first attempt at it and it was so simple that I've never needed or wanted to try anything else.

In a couple of minutes I was creating tasks, automating processes and making my code better.

## How to install it

If you want to use Gulp the first thing you need to do is to install it globally. Your OS might require super user permission for this, in that case just add `sudo` at the beginning of it.

```
npm install -g gulp
```

Then do it locally in your project's folder.

```
npm install --save-dev gulp
```

For every package you want to use, run this command or just add the name of the module with [its version to your package.json file](//docs.npmjs.com/getting-started/installing-npm-packages-locally) and run `npm install` or do it on your terminal using the `--save-dev` flag.

```
npm install --save-dev gulp-uglify
```

Finally, create a file called _gulpfile.js_, require all your modules you'll use and you can start automating tasks for your projects.

```js
var gulp = require('gulp');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
```

## How it works

One of the things you're going to listen or read a lot about **Gulp** is that it's fast. The reason is that it uses **streams**, a great feature of **NodeJS**. Streams are basically chunks of data with an upstream, a start, then piped actions that make modifications on that stream until you get to the end of it, the downstream, where you can report or export the results.

There is a [great article about streams in Node](//www.sitepoint.com/basics-node-js-streams) written by Sandeep Panda if you find this topic interesting or need a more extensive and probably better explanation about it.

When you declare a **task** in Gulp, you first choose a source directory.

```js
gulp.task('minify', function () {
  return gulp
    .src('src/**/*.js')
    .pipe(uglify())
    .pipe(
      rename({
        suffix: '.min'
      })
    )
    .pipe(gulp.dest('dist/'));
});
```

What I've noticed when seeing a code similar to this for the first time was that, while I still had a lot to understand about Gulp and streams, I could totally tell somebody else what was happening. All files inside the folder _src_ with a _.js_ extension are getting uglified, renamed and put inside the _dist_ folder.

Because we are working with streams you always need to _return_ something that can be a file, a file system or another stream, if you don't do it **Gulp** won't work.

### Conditional tasks

If you want to check your scripts' syntax before minifying them (which you should) then you can create another task for it and tell _minify_ to make sure _hint_ task is finished before starting to minify the files.

```js
gulp.task('hint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint());
    .pipe(jshint.reporter('fail'));
});

gulp.task('minify', [ 'hint' ], function() {
  return gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('dist/'));
});
```

You can put both tasks into one but I rather keep them doing just one thing, because you might need to check the style of your code without overriding files in production folder for example. More and shorter tasks adds more versatility to your work flow.

### Running tasks

Once you've finished writing your tasks, you write the command _gulp_ followed by the name of the task, like _minify_ and you're going to see something like this in your console.

```bash
your-pc: to/path/project/ jeremenichelli$ gulp minify
[gulp] Using gulpfile /to/path/project/gulpfile.js
[gulp] Starting 'hint'...
[gulp] Finished 'hint' after 13 μs
[gulp] Starting 'minify'...
[gulp] Finished 'minify' after 42 ms
```

You can also declare a default task and run it just writing _gulp_.

```js
gulp.task('default', ['minify']);
```

## Wrap-up

Gulp is simple and powerful, you can do great things with a short amount of time spent in learning. Maybe one of its drawbacks is that it doesn't have a big community as Grunt has. That means less packages, less maintenance and more bugs probably. It's all about choices.

I've created [a repository with an initial JavaScript project with a Gulp work flow](//github.com/jeremenichelli/recipe) ready to use so you can take it as a start point or just take a look at it to investigate and learn more about this tool.
