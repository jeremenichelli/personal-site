import {
  COLOR_SCHEME_BUTTON_CLASSNAME,
  COLOR_SCHEME_DARK_VALUE,
  COLOR_SCHEME_KEY,
  COLOR_SCHEME_DARK_CLASSNAME,
  COLOR_SCHEME_LIGHT_VALUE
} from './_constants'

// Check stored color scheme value
const isDarkSchemeApplied = document.documentElement.classList.contains(
  COLOR_SCHEME_DARK_CLASSNAME
)

const colorSchemeButton = document.getElementsByClassName(
  COLOR_SCHEME_BUTTON_CLASSNAME
)[0]

// Make button accessible for screen readers and set press state
colorSchemeButton.setAttribute('tabindex', '0')
colorSchemeButton.setAttribute(
  'aria-pressed',
  isDarkSchemeApplied ? 'true' : 'false'
)

// Toggle color scheme on button click event
colorSchemeButton.addEventListener('click', function () {
  const shouldChangeToDarkScheme = !document.documentElement.classList.contains(
    COLOR_SCHEME_DARK_CLASSNAME
  )

  // Update root element class name
  document.documentElement.classList.toggle(
    COLOR_SCHEME_DARK_CLASSNAME,
    shouldChangeToDarkScheme
  )

  // Set pressed attribute for button accessibility
  colorSchemeButton.setAttribute(
    'aria-pressed',
    shouldChangeToDarkScheme ? 'true' : 'false'
  )

  // Update cached state in web storage
  localStorage.setItem(
    COLOR_SCHEME_KEY,
    shouldChangeToDarkScheme
      ? COLOR_SCHEME_DARK_VALUE
      : COLOR_SCHEME_LIGHT_VALUE
  )
})

// Preload all font files in case they are not used immediately
if ('fonts' in document) {
  const inter400 = new FontFace(
    'Inter',
    'url(/assets/fonts/Inter-Regular-subset.woff2)',
    { weight: 400 }
  )
  const inter700 = new FontFace(
    'Inter',
    'url(/assets/fonts/Inter-Bold-subset.woff2)',
    { weight: 700 }
  )
  const inter400italic = new FontFace(
    'Inter',
    'url(/assets/fonts/Inter-Italic-subset.woff2)',
    { weight: 400, style: 'italic' }
  )
  const inter800 = new FontFace(
    'Inter',
    'url(/assets/fonts/Inter-ExtraBold-subset.woff2)',
    { weight: 800 }
  )

  Promise.all([
    inter400.load(),
    inter400italic.load(),
    inter700.load(),
    inter800.load()
  ])
    .then((fonts) => {
      if (__DEV__) {
        fonts.forEach((font) => {
          console.log(
            `FontFace loaded: ${font.family} ${font.weight} ${font.style}`,
            font
          )
        })
      }
    })
    .catch((error) => {
      console.error(`Error while loading font files: ${error.message}`)
    })
}
