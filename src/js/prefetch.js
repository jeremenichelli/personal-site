import Hunt from 'huntjs'

var anchorElements = document.getElementsByTagName('a')

// turn node list into array
var anchorsArray = [].slice.call(anchorElements)

// filter inner links, remove duplicates, slice first items
var anchors = anchorsArray
  // filter internal links, skip navigation and feed links
  .filter(function(anchor) {
    var belongsToSite = anchor.host === document.location.host
    var isSkipNavigation = anchor.classList.contains('skip--navigation')
    var isRSSFeed = /feed.xml/.test(anchor.href)

    return belongsToSite && !isSkipNavigation & !isRSSFeed
  })
  // eliminate duplicates
  .reduce(function(acc, anchor) {
    var alreadyListed = acc.find(function(a) {
      return a.href === anchor.href
    })
    if (!alreadyListed) acc.push(anchor)
    return acc
  }, [])

// observe anchors as they eneter the viewport and prefetch
new Hunt(anchors, {
  enter: function(anchor) {
    var link = document.createElement('link')
    link.href = anchor.href
    link.rel = 'prefetch'

    if (__DEV__ === true) {
      console.log('prefetching ' + anchor.href, link)
    }

    document.head.appendChild(link)
  }
})
