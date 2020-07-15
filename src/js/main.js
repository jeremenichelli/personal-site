import {
  COLOR_SCHEME_BUTTON_CLASSNAME,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants'

import Prism from 'prismjs'

window.addEventListener('load', function () {
  console.log('run on load', document, window)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          observer.unobserve(entry.target)
          Prism.highlightElement(entry.target)
        }
      })
    },
    { rootMargin: '200px' }
  )

  Array.prototype.slice
    .call(document.querySelectorAll('code[class*="language"]'))
    .forEach((el) => observer.observe(el))
})

// check stored color scheme value
const isDarkSchemeApplied = document.documentElement.classList.contains(
  COLOR_SCHEME_DARK_CLASSNAME
)

const colorSchemeButton = document.getElementsByClassName(
  COLOR_SCHEME_BUTTON_CLASSNAME
)[0]

// make button accessible for screen readers and set press state
colorSchemeButton.setAttribute('tabindex', '0')
colorSchemeButton.setAttribute(
  'aria-pressed',
  isDarkSchemeApplied ? 'true' : 'false'
)

// toggle color scheme on button click event
colorSchemeButton.addEventListener('click', () => {
  const shouldChangeToDarkScheme = !document.documentElement.classList.contains(
    COLOR_SCHEME_DARK_CLASSNAME
  )

  document.documentElement.classList.toggle(
    COLOR_SCHEME_DARK_CLASSNAME,
    shouldChangeToDarkScheme
  )

  colorSchemeButton.setAttribute(
    'aria-pressed',
    shouldChangeToDarkScheme ? 'true' : 'false'
  )

  localStorage.setItem(
    COLOR_SCHEME_KEY,
    shouldChangeToDarkScheme
      ? COLOR_SCHEME_DARK_VALUE
      : COLOR_SCHEME_LIGHT_VALUE
  )
})
