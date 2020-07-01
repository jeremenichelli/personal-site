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
 * Warm up all font variants by appending preload or prefetch link elements
 * when supported. Cache will act in further navigation steps to prevent flash
 * of unstyled content and avoid impacting data consumption.
 *
 * The option of putting hidden text has been ruled out as it affects search
 * engines crawling the site's content.
 *
 * The ideal solution would be to preload or prefetch directly in the head,
 * but preload isn't supported in Firefox and Safari doesn't support prefetch.
 */
const fonts = [
  '/assets/fonts/Inter-Regular.woff2',
  '/assets/fonts/Inter-Italic.woff2',
  '/assets/fonts/Inter-Bold.woff2',
  '/assets/fonts/Inter-ExtraBold.woff2'
]

/**
 * Returns the highest priority value possible, falls back to null if none are
 * supported to signal no work should be done.
 *
 * @method resolveRel
 *
 * @returns {String|null}
 */
function resolveRel() {
  const link = document.createElement('link')

  if (link.relList && link.relList.supports) {
    // when supported return 'preload' for high priority fetch
    if (link.relList.supports('preload')) return 'preload'

    // fallback to 'prefetch' when 'preload' is not supported
    if (link.relList.supports('prefetch')) return 'prefetch'
  }

  return null
}

const rel = resolveRel()

if (rel) {
  fonts.forEach((fontUrl) => {
    const link = document.createElement('link')

    link.rel = rel
    link.as = 'font'
    link.href = fontUrl

    document.head.append(link)

    if (__DEV__) console.log(rel, fontUrl)
  })
}
