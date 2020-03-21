import { css } from 'store-css'

const url =
  'https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700&display=swap'
const storage = 'session'
const crossOrigin = 'anonymous'
const config = { url, storage, crossOrigin }

if (__DEV__) {
  config.logger = (error, message) => {
    if (error) console.error(message, error)
    else console.log(message)
  }
}

css(config)

try {
  // check dark mode initial state
  const storedDarkMode = JSON.parse(localStorage.getItem('dark-mode'))
  document.documentElement.classList.toggle('dark', storedDarkMode)
} catch (error) {
  if (__DEV__) console.error(error)
}

// remove no js class
document.documentElement.classList.remove('no-js')
