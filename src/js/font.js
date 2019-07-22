import FontFaceObserver from 'fontfaceobserver'

const w400r = new FontFaceObserver('Fira Sans', { weight: 400 }).load()
const w400i = new FontFaceObserver('Fira Sans', {
  weight: 400,
  style: 'italic'
}).load()
const w700r = new FontFaceObserver('Fira Sans', { weight: 700 }).load()
const w700i = new FontFaceObserver('Fira Sans', {
  weight: 700,
  style: 'italic'
}).load()

// wait for all fonts to load
Promise.all([w400r, w400i, w700r, w700i])
  .then(() => {
    // add fonts loaded class
    document.documentElement.classList.add('fonts-loaded')

    // put mark on web storage
    sessionStorage.setItem('fonts-cached', true)
  })
  .catch((error) => {
    if (__DEV__ === true) {
      console.error(error)
    }
    // add fallback font class
    document.documentElement.classList.add('fonts-failed')
  })
