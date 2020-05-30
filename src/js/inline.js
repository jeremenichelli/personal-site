import {
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_DARK_CLASSNAME
} from './_constants'

// handle initial dark scheme state
const currentColorScheme = localStorage.getItem(COLOR_SCHEME_KEY)
const shouldApplyDarkScheme = currentColorScheme === COLOR_SCHEME_DARK_VALUE

document.documentElement.classList.toggle(
  COLOR_SCHEME_DARK_CLASSNAME,
  shouldApplyDarkScheme
)

// remove no js class
document.documentElement.classList.remove('no-js')
