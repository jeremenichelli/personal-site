---
title: How to write a go back button for JavaScript applications
excerpt: Going to the previous screen is such a common action on the web it has a dedicated button in baked in all browsers. Still, some web apps benefit from indicating this action in their interface, but writing a back button that avoids race conditions and hydration issues might be more complicated than it looks like.
---

We don’t need back and forward actions to be present in our applications, but in some cases, it makes sense to include a back button, [Chris Coyer](//twitter.com/chriscoyier) puts this better than me.

> Browsers already have “back” buttons, so you’d better have a darn good reason

In previous articles, I described [a progressive enhancement approach for React applications](/2020/05/a-progressive-search-experience-in-next/) including [form validation](/2020/05/css-only-form-validation-the-required-attribute-and-the-valid-selector/), taking care of accessibility from the very first moment we start developing.

[The application I built for these examples](//muvi.now.sh) has a specific view for a single search result, without a button to go back to the previous results, the context of a previous search action felt missing.

## Writing the go back button

To build this component we are going to start with the HTML, as it is a navigation action it makes sense for this back button to be represented with an anchor element.

```js
import React from 'react'

const BackButton = () => {
  return <a href="/">Go back</a>
}
```

Though we are going to override the behavior of the anchor with JavaScript, it’s important to put something inside its `href` attribute.

If you are doing server-side rendering, this will be the fallback route the user will navigate to in case they click it before the bundle is ready.

### Back in history with JavaScript

There’s more than one way to achieve this, as all of them are similar let’s go with the basic one you might find while searching.

```js
function goBack(evt) {
  // ignore the native anchor action
  evt.preventDefault()

  history.back()
}
```

If you are using a routing library like [React Router](//reacttraining.com/react-router/web/guides/quick-start) or even routers present in frameworks like [Next.js](//nextjs.org) you might be able to do something similar to the following.

```js
import Router from 'next/router'

function goBack(evt) {
  // ignore the native anchor action
  evt.preventDefault()

  Router.back()
}
```

_Check the documentation of the routing library or framework you are using, but big chances are their back method is just wrapping internally history.back anyways._

The next thing to do is bind this method to our component.

```js
const BackButton = () => {
  return (
    <a href="/" onClick={goBack}>
      Go back
    </a>
  )
}
```

If you are relying completely on client-side rendering and giving your users a white screen until your bundle loads, then this is all you are going to need. The article might as well end here.

But following the same tone of previous articles I wrote, I don’t want to take JavaScript for granted. Even if I think all my users will have JavaScript enabled, building solutions not depending on it usually leads to more foolproof outcomes, covering edge cases, and providing better accessibility.

## Navigation and request headers

Every time navigation —or any network request— takes place in browsers **headers** are sent to the server, and the response from the server comes with headers too.

_HTTP Headers are a set of keys and content we can send to or read from the server request, these parameters describe more in-depth the network transaction._

One of those headers is the **referer**, indicating which URL requested the page you are navigating to, which might come handy here to know the location to go back to.

### Reading headers in Next.js

In Next.js, when the `getInitialProps` method runs on the server it receives a request object names `req` containing a `headers` property.

We can check for a `referer` value to pass it down to the page component.

```js
import React from 'react'
import BackButton from '../components/back-button'

export default const SearchResultPage = ({ data, referrer }) = {
    return (
    <>
        <BackButton referer={referrer} />
        <SearchResult data={data} />
    </>
    )
}

SearchResultPage.getInitialProps = ({ req }) => {
    let referrer

    if (req) {
    // referer is a known mispelling in the spec
    referrer = req.headers.referer
    }

    const response = await fetch('your.api/endpoint')
    const data = await response.json()

    return { data, referrer }
}
```

When defined, this newly added `referrer` prop is used as the `href` fallback value in our back button component.

```js
const BackButton = ({ referrer }) => {
  const href = referrer ? referrer : '/'

  return (
    <a href={href} onClick={goBack}>
      Go back
    </a>
  )
}
```

You might have noticed we check if `req` is defined inside the `getInitialProps` method. As I said, this header is present when the request reaches the server.

If the navigation happens with JavaScript already loaded then client-side routing will handle it, and the request object won’t be there because the server didn’t play any part.

The good thing is, it would mean the user has JavaScript enabled and they are on a decent connection, and our initial `goBack` function will probably take care of the situation without the need of the `referrer` value.

## Accessibility improvements

A bit of quick advice to improve accessibility for this component would be to add an `aria-label` extending the context of the navigation.

```js
const BackButton = ({ referrer, searchQuery, resultPage }) => {
  const href = referrer ? referrer : '/'
  const ariaLabel = `Go back to page ${resultPage} of ${searchQuery} search`

  return (
    <a href={href} ariaLabel={ariaLabel} onClick={goBack}>
      Go back
    </a>
  )
}
```

It might not seem necessary, but a more complete announcement in screen readers will help assisted users to know exactly where they are heading if they hit the link.

## Is this worth it?

I started this quest as an experiment to push myself to learn new patterns, but I also mentioned the number of users with JavaScript disabled might just be none for your project. Then, is all of this needed?

A situation, where the referrer approach will action, might be rare. For example, imagine user taps a link of a search result when the application bundle is still loading, then the navigation will happen without client-side routing, a full reload will trigger and the server will be in charge of resolving the request.

The new page will include the referrer value and have a working back button, even if the user taps the link before the JavaScript for that new page is ready.

If in this result page the JavaScript gets the chance to load, then our click event will catch it.

## Gotchas

The solution proposed in this article is more resilient, but it’s still not perfect. Here are some reasons why.

### History discrepancy

If we disable JavaScript entirely while testing this approach, going through a search result, click the link with the _referer_ value and then pressing the back button from the browser will take the user back to the result page instead of the previous search page.

This is a scenario that JavaScript handles better.

Hopefully, your users won’t adhere much to this specific list of actions. A solution to this doesn’t exist right now, I would love for a way to define this behavior by an attribute in the anchor, though I admit it can open possibilities for anti-patterns in user experience around navigation.

### Security

This approach won’t affect the security status of your application, whether it is already good or bad, but security measures can make it not possible to implement.

There is a _Referrer-Policy_ one which defines the content of the _Referer_ header. If the value of the policy header is `no-referrer` for example, then _Referer_ won’t be present at all in the requests.

## Wrap-up

Using the browser’s navigation buttons on content sites comes naturally as a user to me, but when sites have more an application goal, a back button might help by highlighting a clearer action to the user.

When doing so, we can make use of web technologies to make sure we provide a resilient component that handles edge cases combining headers and server-side logic.

You can see this working in [the repository of the application](//github.com/jeremenichelli/muvi) I built to explore progressive patterns inside React applications.

### Further reading

- [Referer header definition](//developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) in MDN
- [Referrer-Policy header](//developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) in MDN
- [Router.back reference](//nextjs.org/docs/api-reference/next/router#routerback) in Next.js documentation
