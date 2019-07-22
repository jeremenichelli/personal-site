import store from 'store-css'

// load web font stylesheet
if (__DEV__) store.verbose()

store.css(
  'https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700,700i',
  {
    storage: 'session',
    crossOrigin: 'anonymous'
  }
)

// check dark mode initial state
try {
  const storedDarkMode = JSON.parse(localStorage.getItem('dark-mode'))
  document.documentElement.classList.toggle('dark', storedDarkMode)
} catch (error) {
  if (__DEV__) console.error(error)
}

// remove no js class
document.documentElement.classList.remove('no-js')

const scripts = []

// check if fonts have been already loaded
const FONTS_CACHED = JSON.parse(sessionStorage.getItem('fonts-cached'))

if (!FONTS_CACHED && !('Promise' in self)) {
  scripts.push('//cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js')
}

if (FONTS_CACHED) {
  document.documentElement.classList.add('fonts-loaded')
} else {
  scripts.push('/assets/js/font.js')
}

// enqueue scripts for prefetching only if supported
const link = document.createElement('link')
const supportsPrefetch =
  link.relList && link.relList.supports && link.relList.supports('prefetch')

if (supportsPrefetch) {
  scripts.push('/assets/js/prefetch.js')
}

self.addEventListener('DOMContentLoaded', () => {
  // load sources from scripts array
  scripts.forEach((src) => {
    const scriptEl = document.createElement('script')
    scriptEl.src = src
    scriptEl.async = false
    document.body.append(scriptEl)
  })

  // attach listener to dark toggle
  const toggle = document.querySelector('.dark--toggle')
  toggle.addEventListener('click', () => {
    try {
      const storedDarkMode = JSON.parse(localStorage.getItem('dark-mode'))
      localStorage.setItem('dark-mode', !storedDarkMode)
      document.documentElement.classList.toggle('dark', !storedDarkMode)
    } catch (error) {
      if (__DEV__) console.error(error)
    }
  })
})
