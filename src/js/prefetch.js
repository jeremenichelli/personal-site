import Hunt from 'huntjs'

// turn node list into array
const anchorsArray = [].slice.call(document.getElementsByTagName('a'))

// filter inner links, remove duplicates, slice first items
const anchors = anchorsArray
  // filter internal links, skip navigation and feed links
  .filter((anchor) => {
    const belongsToSite = anchor.host === document.location.host
    const isSkipNavigation = anchor.href === '#main'
    const isRSSFeed = /feed.xml/.test(anchor.href)

    return belongsToSite && !isSkipNavigation & !isRSSFeed
  })
  // eliminate duplicates
  .reduce((acc, anchor) => {
    const alreadyListed = acc.find((a) => a.href === anchor.href)
    if (!alreadyListed) acc.push(anchor)
    return acc
  }, [])

// observe anchors as they eneter the viewport and prefetch
new Hunt(anchors, {
  enter: (anchor) => {
    const link = document.createElement('link')
    link.href = anchor.href
    link.rel = 'prefetch'

    if (__DEV__) console.log('prefetching ' + anchor.href, link)
    document.head.appendChild(link)
  }
})
