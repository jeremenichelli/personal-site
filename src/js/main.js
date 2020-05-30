import {
  COLOR_SCHEME_TOGGLE_CLASSNAME,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants'

// handle dark scheme state toggling
const toggle = document.getElementsByClassName(COLOR_SCHEME_TOGGLE_CLASSNAME)[0]

toggle.addEventListener('click', () => {
  try {
    const currentColorScheme = localStorage.getItem(COLOR_SCHEME_KEY)
    const shouldChangeToDarkScheme =
      currentColorScheme === COLOR_SCHEME_LIGHT_VALUE

    document.documentElement.classList.toggle(
      COLOR_SCHEME_DARK_CLASSNAME,
      shouldChangeToDarkScheme
    )

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
