import FontFaceObserver from 'fontfaceobserver/fontfaceobserver'

const w400r = new FontFaceObserver('Fira Sans', { weight: 400 }).load()
const w400i = new FontFaceObserver('Fira Sans', {
  weight: 400,
  style: 'italic'
}).load()
const w800r = new FontFaceObserver('Fira Sans', { weight: 800 }).load()

// wait for all fonts to load
Promise.all([w400r, w400i, w800r])
  .then(() => {
    // add fonts loaded class
    document.documentElement.classList.add('fonts-loaded')

    // put mark on web storage
    sessionStorage.setItem('fonts-cached', true)
  })
  .catch((error) => {
    if (__DEV__) console.error(error)
    // add fallback font class
    document.documentElement.classList.add('fonts-failed')
  })
