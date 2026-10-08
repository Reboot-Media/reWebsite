export const NAVIGATE_EVENT = 'app:navigate'

// Switch pages without reloading. The browser never requests the new path
// from the server, so a stale cached redirect for it (the old /before-your-call
// 308 to the homepage) can't send the visitor back to the homepage.
export function navigate(path) {
  window.history.pushState({}, '', path)
  window.scrollTo(0, 0)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}
