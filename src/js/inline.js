import {
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants'

// handle initial dark scheme state
const currentColorScheme = localStorage.getItem(COLOR_SCHEME_KEY)
const shouldApplyDarkScheme = currentColorScheme === COLOR_SCHEME_DARK_VALUE

if (currentColorScheme === COLOR_SCHEME_DARK_VALUE) {
  document.documentElement.classList.add(COLOR_SCHEME_DARK_CLASSNAME)
}

localStorage.setItem(
  COLOR_SCHEME_KEY,
  shouldApplyDarkScheme ? COLOR_SCHEME_DARK_VALUE : COLOR_SCHEME_LIGHT_VALUE
)

// remove no js class
document.documentElement.classList.remove('no-js')
