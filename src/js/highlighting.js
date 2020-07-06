import Prism from 'prismjs'
import { css } from 'store-css'

// load highlight theme without render blocking
const url = '/assets/css/highlighting.css'
css({ url })

// highlight code elements
Prism.highlightAll()
