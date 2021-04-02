import {
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants';

// Remove 'no-js' class from root element
document.documentElement.classList.remove('no-js');

// Handle initial dark scheme state
const storedColorScheme = localStorage.getItem(COLOR_SCHEME_KEY);
const shouldApplyDarkScheme = storedColorScheme === COLOR_SCHEME_DARK_VALUE;

if (storedColorScheme === COLOR_SCHEME_DARK_VALUE) {
  document.documentElement.classList.add(COLOR_SCHEME_DARK_CLASSNAME);
}

// Save color scheme state in web storage
localStorage.setItem(
  COLOR_SCHEME_KEY,
  shouldApplyDarkScheme ? COLOR_SCHEME_DARK_VALUE : COLOR_SCHEME_LIGHT_VALUE
);
