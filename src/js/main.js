/*
 * Comment out prefetching routes to not alter Netlify Analytics
const link = document.createElement('link')
const supportsPrefetch =
  link.relList && link.relList.supports && link.relList.supports('prefetch')

let saveData = false
let is2G = false

if (navigator.connection) {
  saveData = navigator.connection.saveData === true
  is2G = /2g/.test(navigator.connection.effectiveType)
}

const supportsIntersectionObserver = 'IntersectionObserver' in window

// debug prefetching conditions
// console.log({ saveData, is2G, supportsIntersectionObserver, supportsPrefetch })

if (supportsIntersectionObserver && supportsPrefetch && !saveData && !is2G) {
  const anchorsArray = [].slice.call(document.getElementsByTagName('a'))
  const anchors = anchorsArray
    // filter internal links, skip navigation and feed links
    .filter((anchor) => {
      const belongsToSite = anchor.host === document.location.host
      const isSkipNavigation = anchor.classList.contains('skip--navigation')
      const isHeading = anchor.classList.contains('heading--anchor')
      const isRSSFeed = /feed.xml/.test(anchor.href)
      return belongsToSite && !isSkipNavigation && !isRSSFeed && !isHeading
    })
    // eliminate duplicates
    .reduce((acc, anchor) => {
      const alreadyListed = acc.find((a) => a.href === anchor.href)
      if (!alreadyListed) acc.push(anchor)
      return acc
    }, [])

  const observer = new IntersectionObserver(onChange)

  anchors.forEach((anchor) => {
    observer.observe(anchor)
  })

  function onChange(changes) {
    changes.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        const anchor = entry.target
        const link = document.createElement('link')
        link.href = anchor.href
        link.rel = 'prefetch'

        if (__DEV__) console.log('prefetching ' + anchor.href, link)
        document.head.appendChild(link)
        observer.unobserve(entry.target)
      }
    })
  }
}
*/

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
