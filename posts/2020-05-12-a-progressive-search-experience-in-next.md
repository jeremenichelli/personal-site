---
title: A progressive search experience in Next
excerpt: One of the most controversial topics in web development today is the amount of client code we push with our applications. Bundle sizes keep increasing each year and some people put frameworks to blame, is the solution to stop using them or should we think better how we build features on top of them?
---

In this article I will explore the idea of a progressively enhanced approach for a search experience, using the browser's native behavior first, giving control back to JavaScript only when needed.

We will see how using the web platform as a base is a great option to write less code on the client while providing a good experience for users, even without JavaScript enabled.

## A world with no JavaScript

Sounds horrifying, isn't it? But don't worry, JavaScript is going nowhere.

And it shouldn't, it’s one of the reasons why building on the web is a great today, but it’s also just part of something bigger, something that includes other technologies and specifications.

Nevertheless, we keep building sites and implementing new features with the thought that JavaScript will always be there. I remember talking about this with [Harry Roberts](https://paper.dropbox.com//twitter.com/csswizardry) and he said to me:

> "I’m willing to bet you have more IE6 visitors than disabled-JavaScript-on-purpose visitors. Your IE6 policy is probably ‘forget it’, so why would your disabled-JavaScript-on-purpose policy be any different?"

There are definitely a lot of chances this is true for most of the projects out there, and it makes you question why we should even bother to support this scenario. Later, he closes his quote with this:

> "As Jake Archibald said, ‘[…] all your users are non-JavaScript while they're downloading your JavaScript’. So while I don’t think we should build or optimize for visitors who have disabled JavaScript, we shouldn’t make too many assumptions that our JavaScript will always work as we expect."

We do rely more and more on client code, and it's a trend that seems to not stop in the near future. It gave me a lot of thinking as someone who started coding when frameworks weren't a big thing.

What if we lean back on the platform while still using them only to fill the gaps and improve things? Will that strategy translate into less and even better code or will this impact negatively the user experience?

### Back to the progressive mindset

When I became a web developer there were two terms which got repeated pretty often, like mantras to have present every time you were building something.

One was _graceful degradation_, a concept in computing and electronic systems where they are still useful or functional even if some parts are not working correctly or have been removed.

The second one was _progressive enhancement_, a strategy of prioritizing web content delivery first and start adding improvements to the experience as the user could afford them or as they were supported.

Keeping these two concepts close, let's dive into a search application with form submission, data fetching, paged results and URL persistence.

To start, let's **disable JavaScript** in the browser.

## Kick off and form submission

As a first building block I'm choosing [Next](//nextjs.org), a framework built on top of React. Since I won't have JavaScript available on the client I need a stack that gives me control on the server side.

On the index page, we start with the basic set of elements to get input from the user and fetch data later. If we forget about our premise in this article and assume JavaScript is there, we only need an input and a button.

```js
import React, { useState } from 'react'

function onSubmit(search) {}

const Index = () => {
  const [search, setSearch] = useState('')

  return (
    <>
      <input value={search} onChange={(evt) => setSearch(evt.target.value)} />
      <button onClick={() => onSubmit(search)}>Search</button>
    </>
  )
}

export default Index
```

Is the _name_ attribute in our input necessary? Do we need to wrap everything in a form? What about setting the _action_ on the form? The short answer is, to fetch data with JavaScript, you don't need any of those.

But in the same way you have to write back all the native functionality of a `button` element when using a `div`, writing a semantically correct form will save you from a lot of heavy lifting while enabling a better and more accessible experience out of the box.

```js
import React, { useState } from 'react'

function onSubmit() {}

const Index = () => {
  const [search, setSearch] = useState('')

  return (
    <form action="?" onSubmit={onSubmit}>
      <input
        name="search"
        value={search}
        onChange={(evt) => setSearch(evt.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}

export default Index
```

{% actionLink '//codesandbox.io/s/javascript-less-submission-e8z3g' %}

A button alone does nothing without JavaScript, like in the first code example.

In the second one things are different, users have the ability to submit by clicking and even by using a keyboard, all without writing a single line of code on the client.

We moved from an inert application to one that actually _does_ something and with better accessibility.

Right now our application does one thing, after the user submits the page refreshes but now with the search value appended to the URL, which gives back the control on the server side.

We can see now the importance of the _name_ and _action_ attributes.

## Fetching the search data

After the search submission, a page request hits the server. There we can inspect the new parameters in the URL to know what data to fetch.

For this we are going to use a method called `getInitialProps` provided by [Next](//nextjs.org), really convenient as it runs on each page request but also on route changes, useful to enhance the experience for users with JavaScript.

```js
Index.getInitialProps = async ({ query }) => {
  const currentSearch = query.search
}
```

`getInitialProps` receives a `context` argument, this object holds a collection of properties including the query section of the URL, which here contains the information from the form submitted by the user.

We use `search` value of the query to request data from another service and return an object with the result, [Next](//nextjs.org) passes this object to the page component as props.

_As an example, we use the_ [_Open Movie Database API_](//www.omdbapi.com/) _service._

```js
import unfetch from 'isomorphic-unfetch'

Index.getInitialProps = async ({ query }) => {
  const currentSearch = query.search

  if (!currentSearch) return {}

  const searchUrl = `//www.omdbapi.com/?s=${currentSearch}`
  const response = await unfetch(searchUrl)
  const results = await response.json()

  return {
    currentSearch,
    pageResults: results.Search
  }
}
```

An undefined `search` value indicates we aren’t coming from a form submission, so we return an empty object.

Inside our `Index` page component we inspect the value of the current search passed by the `getInitialProps` method and iterate over the data to show the results.

```js
import React, { useState } from 'react'
import Link from 'next/link'

function onSubmit() {}

const Index = (props) => {
  const { pageResults, currentSearch } = props
  const [search, setSearch] = useState('')

  return (
    <>
      <form action="?" onSubmit={onSubmit}>
        <input
          name="search"
          value={search}
          onChange={(evt) => setSearch(evt.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {currentSearch && (
        <ul>
          {pageResults.map((result) => (
            <li>
              <Link key={result.id} href={`/movie/${result.id}`}>
                {result.Title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
```

Enhancing this for _JavaScript-ready_ users is surprisingly straight-forward.

Because we have the logic already set in place, instead of re-implementing everything again we prevent the submit default behavior, serialize the form data and push a route change, `getInitialProps` handles the rest.

```js
import Router form 'next/router'

function onSubmit (evt) {
    evt.preventDefault()
    const formData = new FormData(evt.target)
    const searchQuery = formData.get('search')
    const url = `/?search=${searchQuery}`
    Router.push(url)
}
```

Relying completely on the event dispatching and its target, which both come built-in, and delegating the navigation to Next’s Router keeps the client side of the code minimal.

> The web does the heavy lifting, our client code is there to enhance the experience

Approaches like these aren’t seen much because we tend to build solutions with JavaScript first in mind. Shifting that initial approach changes drastically the outcome in code for similar or identical tasks, tasks as common as fetching data and URL persistence.

## Pagination

In the same way we lookup inside the context parameter to extract the search query, to enable specific page results we need to inspect this object and look for a `page` key.

Back inside `getInitialProps` we check for this value in the `query` property and construct the correct URL to hit the service.

```js
Index.getInitialProps = async ({ query }) => {
  const currentSearch = query.search

  if (!currentSearch) return {}

  const currentPage = query.page ? +query.page : 1

  const searchUrl = `//www.omdbapi.com/?s=${currentSearch}&page=${currentPage}`

  const response = await unfetch(searchUrl)
  const results = await response.json()

  const RESULTS_PER_PAGE = 10
  const hasNextPage = RESULTS_PER_PAGE * currentPage < results.totalResults
  const hasPrevPage = currentPage > 1

  return {
    pageResults,
    totalResults: results.totalResults,
    currentSearch,
    nextPage: hasNextPage ? currentPage + 1 : null,
    prevPage: hasPrevPage ? currentPage - 1 : null
  }
}
```

By making `page` an optional key we still support our initial flow as we obtain the same result with `?search=batman` and `?search=batman&page=1`, later in the method we use the `totalResults` number to determine if there’s a next page, and a previous page in case the current page is higher than one.

We use again the data returned by `getInitialProps` in the page component to construct those links to different results pages.

```js
import Link from 'next/link'

const Index = (props) => {
  const { pageResults, currentSearch, prevPage, nextPage } = props
  const [search, setSearch] = useState('')

  return (
    <>
      <form action="?" onSubmit={onSubmit}>
        <input
          name="search"
          value={search}
          onChange={(evt) => setSearch(evt.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {currentSearch && (
        <ul>
          {pageResults.map((result) => (
            <li>
              <Link key={result.id} href={`/movie/${result.id}`}>
                {result.Title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {prevPage && (
        <Link href={`/?search=${currentSearch}&page=${prevPage}`}>
          {`Page ${prevPage}`}
        </Link>
      )}
      {nextPage && (
        <Link href={`/?search=${currentSearch}&page=${nextPage}`}>
          {`Page ${nextPage}`}
        </Link>
      )}
    </>
  )
}
```

`Link` components are rendered as anchor elements, so navigation through page results will work perfectly without client code, while users with JavaScript will get a single page application experience.

## Wrap-up

One of the motivations for writing this was the constant battle I see around frameworks and their impact in accessibility and performance.

I don’t think frameworks are evil, though I do believe we need to advocate and educate more around the fundamentals of the web and how it works. This will help us developers make smarter decisions, write better code and create more accessible products.

> Writing better HTML might help you by having to write less JavaScript in the end

The experience of tackling common features in a web application with a more incremental approach did produce better and simpler client code.

Though it is a simplified case, it’s visible how this, as a starting point, is better than breaking or reinventing web fundamentals and try to patch them back again with even more client code.

I encourage you to explore its code base [here in its repository](//github.com/jeremenichelli/muvi) or even try the full application experience at [muvi.now.sh](//muvi.now.sh), or what’s better do it with JavaScript disabled.

It’s the web, built using a framework, and **it just works**.
