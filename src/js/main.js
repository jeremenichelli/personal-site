import {
  COLOR_SCHEME_CHECKBOX_CLASSNAME,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants'

const checkbox = document.getElementsByClassName(COLOR_SCHEME_CHECKBOX_CLASSNAME)[0]

// set initial state to checkbox
const currentColorScheme = localStorage.getItem(COLOR_SCHEME_KEY)
const isDarkScheme = currentColorScheme === COLOR_SCHEME_DARK_VALUE
checkbox.checked = isDarkScheme
checkbox.setAttribute('aria-checked', isDarkScheme)

// handle clicks on color scheme label
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
