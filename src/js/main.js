import {
  COLOR_SCHEME_BUTTON_CLASSNAME,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants';

// Check stored color scheme value
const isDarkSchemeApplied = document.documentElement.classList.contains(
  COLOR_SCHEME_DARK_CLASSNAME
);

const colorSchemeButton = document.getElementsByClassName(
  COLOR_SCHEME_BUTTON_CLASSNAME
)[0];

// Make button accessible for screen readers and set press state
colorSchemeButton.setAttribute('tabindex', '0');
colorSchemeButton.setAttribute(
  'aria-pressed',
  isDarkSchemeApplied ? 'true' : 'false'
);

// Toggle color scheme on button click event
colorSchemeButton.addEventListener('click', function () {
  const shouldChangeToDarkScheme = !document.documentElement.classList.contains(
    COLOR_SCHEME_DARK_CLASSNAME
  );

  // Update root element class name
  document.documentElement.classList.toggle(
    COLOR_SCHEME_DARK_CLASSNAME,
    shouldChangeToDarkScheme
  );

  // Set pressed attribute for button accessibility
  colorSchemeButton.setAttribute(
    'aria-pressed',
    shouldChangeToDarkScheme ? 'true' : 'false'
  );

  // Update cached state in web storage
  localStorage.setItem(
    COLOR_SCHEME_KEY,
    shouldChangeToDarkScheme
      ? COLOR_SCHEME_DARK_VALUE
      : COLOR_SCHEME_LIGHT_VALUE
  );
});

window.addEventListener('storage', function (event) {
  if (event.key === COLOR_SCHEME_KEY) {
    // Check if new value from different environment is dark scheme
    const shouldChangeToDarkScheme = event.newValue === COLOR_SCHEME_DARK_VALUE;

    // Update root element class name
    document.documentElement.classList.toggle(
      COLOR_SCHEME_DARK_CLASSNAME,
      shouldChangeToDarkScheme
    );
  }
});
