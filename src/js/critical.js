import store from 'store-css'

// add store.css logs on dev mode
if (__DEV__ === true) {
  store.verbose()
}

// load font face styles
store.css(
  'https://fonts.googleapis.com/css?family=Fira+Sans:400,400i,700,700i',
  {
    storage: 'session',
    crossOrigin: 'anonymous'
  }
)

// remove no js class
document.documentElement.classList.remove('no-js')

const scripts = []

// enqueue scripts for font loading only if necessary
const FONTS_CACHED = JSON.parse(sessionStorage.getItem('fonts-cached'))

// queue promise polyfill only when needed
if (!FONTS_CACHED && !('Promise' in window)) {
  scripts.push('//cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js')
}

// resolve fonts cached or queue font bundle
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

// append all scripts when dom parsing is finished
window.addEventListener('DOMContentLoaded', () => {
  scripts.map((src) => {
    const scriptElement = document.createElement('script')
    scriptElement.src = src
    scriptElement.async = false
    document.body.appendChild(scriptElement)
  })
})
