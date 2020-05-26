---
title: CSS-only form validation, the required attribute and the valid selector
excerpt: A common issue in server-side rendered applications is the effects of late hydration. While users wait for JavaScript to be parsed and run, buttons don't work even though they are present, leading to a frustrating experience.
---

Usually, the initial state of a form is invalid, how do you re-enable a disabled button on a server-side rendered React application?

Validation is needed, we want to make sure we have all the data we need in the right shape before sending it to our services. In addition, we want to provide visual hints to the user about what actions can be taken or not at a certain moment in a form.

In my previous article I explored an approach for [progressive enhancement in a React application](/2020/05/a-progressive-search-experience-in-next/). There I’m using a third-party service that has a rate limit and I have no control over, so preventing unwanted calls was necessary.

## The hydration paradox

The easiest way to make sure a button doesn’t work is by disabling it. An given the only case I want to prevent a submit is when the search input is empty it’s tempting to disable the button when the value is _falsy_.

```js
const Index = () => {
  const [search, setSearch] = useState('')

  return (
    <form action="?" onSubmit={onSubmit}>
      <input
        name="search"
        value={search}
        onChange={(evt) => setSearch(evt.target.value)}
      />
      <button disabled={!search} type="submit">
        Search
      </button>
    </form>
  )
}
```

In the `input` element, when the `search` state is an empty string the `button` will get disabled and the user won’t be able to trigger a submission.

There are two issues in this approach:

- The first one is, we previously made sure the form was accessible and keyboard friendly, so the user can still trigger a request by pressing the return key.
- Even more important, the second issue is what happens if your user gets our server-side rendered application, and while the bundle is still loading writes something on the `input` but the `button` is still shown as disabled.

This is **a typical hydration issue**, the interface is painted but needs JavaScript to be interactive. We think we are improving the user experience by sending something ahead of time, but we are creating this uncanny valley of user interaction until the bundle loads.

This behavior can be observed by disabling JavaScript on [the live example](//myxh0.sse.codesandbox.io) from the code above. The button is disabled forever because the server sent this initial markup, but React never has the chance to re-evaluate the state of our application.

The premise in my previous article was to not rely on the main bundle for the application to work. How can we toggle this button state without JavaScript? How can we make sure keyboard behavior matches the cursor one?

## Native form validation in the browser

It is possible to circumvent the need for JavaScript to block our search form submission. A while ago the [Constraint Validation API](//html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-constraint-validation-api) was released and implemented in browsers.

It contains a set of methods and properties in form elements to know if they pass a set of patterns and configurations.

For example, we can set any type of input as required.

```html
<input type="text" required />
```

We can go further and require a minimum length and even pass a regular expression as a pattern to be tested against the value of the element.

```html
<input type="text" required minlength="2" pattern="\[A-Z\][a-z]+" />
```

In this case, we are requiring at least two characters and the first one to be uppercase.

In JavaScript, we have a set of methods to check if the current value of a given element is valid and set a custom error message. The [Constraint Validation API](//developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) is a powerful one, and I strongly encourage developers to read and remember for projects.

Along with its release, a useful set of new selectors came to the CSS spec. We can detect which elements are valid or not, and even if forms are valid.

We definitely can’t change the value of an attribute in a form element with CSS, but now with the `:valid` and the `:invalid` selectors in combination with other operators we can prevent actions in the button.

```js
const Index = () => {
  const [search, setSearch] = useState('')

  return (
    <form action="?" onSubmit={onSubmit}>
      <input
        required
        name="search"
        value={search}
        onChange={(evt) => setSearch(evt.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  )
}
```

First in our form, we need to mark the search input as **required**.

Later, in our styles we set a button with an invalid input as a previous sibling should show as disabled and not trigger actions.

```css
input:invalid + button {
  opacity: 0.5;
  pointer-events: none;
}
```

If you have a form with a more complex structure, you might want to use more specific selectors and better check the validation state of the form itself.

```css
form.form__with-validation:invalid button.submit__button {
  opacity: 0.5;
  pointer-events: none;
}
```

{% actionLink '//codesandbox.io/s/form-validation-example-ghjoy' %}

This is indeed a really simple case to solve. Gladly, this specification contains a pretty wide range of attributes to combine and helpful JavaScript methods in case you want to provide a more custom experience.

Important to mention all of this has [pretty decent browser support](//caniuse.com/#feat=form-validation) too.

## Wrap-up

Following the trend of my previous article, and probably the next one, ruling out JavaScript as a given commodity opens a lot of exploration on what we are given out-of-the-box by the browser, and build on top of it.

You can see this validation strategy working in [the application](//muvi.now.sh) I’m using as a base for this series of articles.

If you are interested in going more in-depth into this, I strongly suggest the [Client-side form validation](//developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) article on MDN. It goes step by step on a more complete approach and covers more features from this specification.
