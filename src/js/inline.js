import { css } from 'store-css'

const url = 'https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700'
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

const scripts = ['/assets/js/main.js']

let FONTS_CACHED = false

try {
  // check if fonts have been already loaded
  FONTS_CACHED = JSON.parse(sessionStorage.getItem('fonts-cached'))
} catch (error) {
  if (__DEV__) console.error(error)
}

if (FONTS_CACHED) {
  document.documentElement.classList.add('fonts-loaded')
} else {
  scripts.push('/assets/js/font.js')
}

// load scripts when DOM is ready
self.addEventListener('DOMContentLoaded', () => {
  scripts.forEach((src) => {
    const scriptEl = document.createElement('script')
    scriptEl.src = src
    document.body.append(scriptEl)
  })
})
