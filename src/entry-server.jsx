import { renderToString } from 'react-dom/server'
import { pageFor } from './pages.js'

// Build-time only (scripts/prerender.mjs): the page's markup for one path.
export function render(path) {
  const Page = pageFor(path)
  return renderToString(<Page path={path} />)
}

export { FAQS } from './App.jsx'
export { COMPANIES } from './Compare.jsx'
