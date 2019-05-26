var LIMIT = 10
var anchors = document.getElementsByTagName('a')

// turn node list into array
var anchorsArray = [].slice.call(anchors)

// filter inner links, remove duplicates, slice first items
var links = anchorsArray
  .filter(function(anchor) {
    var belongsToSite = anchor.host === document.location.host
    var isSkipNavigation = anchor.classList.contains('skip--navigation')
    var isRSSFeed = /feed.xml/.test(anchor.href)

    return belongsToSite && !isSkipNavigation & !isRSSFeed
  })
  .reduce(function(acc, anchor) {
    if (acc.indexOf(anchor.href) === -1) acc.push(anchor.href)
    return acc
  }, [])
  .slice(0, LIMIT)

// append link elements
links.map(function(url) {
  var link = document.createElement('link')
  link.href = url
  link.rel = 'prefetch'

  if (__DEV__ === true) {
    console.log('prefetching ' + url, link)
  }

  document.head.appendChild(link)
})
