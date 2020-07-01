import {
  COLOR_SCHEME_CHECKBOX_CLASSNAME,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants'

const checkbox = document.getElementsByClassName(
  COLOR_SCHEME_CHECKBOX_CLASSNAME
)[0]

// set initial state to checkbox
const currentColorScheme = localStorage.getItem(COLOR_SCHEME_KEY)
const isDarkScheme = currentColorScheme === COLOR_SCHEME_DARK_VALUE
checkbox.checked = isDarkScheme
checkbox.setAttribute('aria-checked', isDarkScheme)

// handle color scheme switching
checkbox.addEventListener('change', (e) => {
  try {
    const shouldChangeToDarkScheme = e.target.checked

    document.documentElement.classList.toggle(
      COLOR_SCHEME_DARK_CLASSNAME,
      shouldChangeToDarkScheme
    )

    checkbox.setAttribute('aria-checked', shouldChangeToDarkScheme)

    localStorage.setItem(
      COLOR_SCHEME_KEY,
      shouldChangeToDarkScheme
        ? COLOR_SCHEME_DARK_VALUE
        : COLOR_SCHEME_LIGHT_VALUE
    )
  } catch (error) {
    if (__DEV__) console.error(error)
  }
})

/**
 * Force loading all font assets as not all pages use all weights using fetch
 * for high priority download. Cache will act in further navigation steps to
 * so it shouldn't impact data.
 * 
 * The option of putting hidden text has been ruled out as it affects search
 * engines crawling the site's content.
 * 
 * The ideal solution would be to preload or prefetch, but preload isn't
 * supported in Firefox and Safari doesn't support prefetch.
 */
const fonts = [
  '/assets/fonts/Inter-Regular.woff2',
  '/assets/fonts/Inter-Italic.woff2',
  '/assets/fonts/Inter-Bold.woff2',
  '/assets/fonts/Inter-ExtraBold.woff2',
]

try {
  fonts.forEach(fontUrl => {
    fetch(fontUrl)
      .then((response) => {
        if (__DEV__) console.log(fontUrl, response)
      })
      .catch((error) => {
        if (__DEV__) console.error(fontUrl, error)
      })
  })
} catch(error) {
  console.elog
}
