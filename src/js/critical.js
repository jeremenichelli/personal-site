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

var scripts = []

// enqueue scripts for font loading only if necessary
var FONTS_CACHED = JSON.parse(sessionStorage.getItem('fonts-cached'))

if (FONTS_CACHED) {
  document.documentElement.classList.add('fonts-loaded')
} else {
  if (!('Promise' in window)) {
    scripts.push(
      '//cdnjs.cloudflare.com/ajax/libs/es6-promise/4.1.1/es6-promise.auto.min.js'
    )
  }

  scripts.push('/assets/js/font.js')
}

// enqueue scripts for prefetching only if supported
scripts.push('/assets/js/prefetch.js')

// append all scripts when dom parsing is finished
window.addEventListener('DOMContentLoaded', function() {
  scripts.map(function(src) {
    var scriptElement = document.createElement('script')
    scriptElement.src = src
    scriptElement.async = false
    document.body.appendChild(scriptElement)
  })
})
