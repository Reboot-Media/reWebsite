// Tracking utilities for the /roofers ad-destination landing page.
//
// - captureAttribution() / getAttribution() capture and surface which
//   ad (UTM + fbclid + fbp/fbc) produced the lead.
// - trackLead() / trackSchedule() fire Meta standard events with a
//   client-generated event_id so the server-side Meta Conversions API
//   call made by functions/api/lead.js can dedupe against these
//   browser-side events (same event_id on both sides).
// - postLead() / postSchedule() forward the lead/booking payload to the
//   same-origin /api/lead endpoint (a Cloudflare Pages Function), which
//   fires the server-side CAPI event (Lead or Schedule, per event_name)
//   and forwards to the CRM (GoHighLevel) webhook — no webhook URL or token is ever exposed to
//   the browser.
//
// postLead() swallows all errors (in
// `vite dev` there is no Pages Functions runtime, so /api/lead 404s —
// that must stay silent) — it must never throw or block render.

const ATTRIBUTION_STORAGE_KEY = 'roofers_attribution'
const ATTRIBUTION_URL_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
]

function readCookie(name) {
  try {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : undefined
  } catch (err) {
    return undefined
  }
}

/**
 * Read utm_source/utm_medium/utm_campaign/utm_content/utm_term/fbclid off
 * the current URL and, if any are present, persist them to sessionStorage
 * (overwriting whatever was there). If none are present, leave any
 * previously-captured attribution untouched — this lets a mid-funnel
 * reload that drops the query string still get credit for the original
 * ad click. Best-effort only: storage failures (e.g. Safari private
 * mode) must never break the page.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return

  try {
    const params = new URLSearchParams(window.location.search)
    const captured = {}
    for (const key of ATTRIBUTION_URL_KEYS) {
      const value = params.get(key)
      if (value) captured[key] = value
    }

    if (Object.keys(captured).length > 0) {
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(captured))
    }
  } catch (err) {
    // Best-effort — never let attribution capture break the page.
    console.error('[tracking] captureAttribution failed', err)
  }
}

/**
 * Return the best-known attribution for this session: the captured
 * UTM/fbclid values, Meta's own click/browser identifiers (_fbc/_fbp
 * cookies), and basic landing-page context. Keys with no value are
 * omitted so the payload stays clean. Never throws.
 */
export function getAttribution() {
  const attribution = {}

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)
    if (stored) {
      Object.assign(attribution, JSON.parse(stored))
    }
  } catch (err) {
    console.error('[tracking] getAttribution read failed', err)
  }

  try {
    const fbp = readCookie('_fbp')
    if (fbp) attribution.fbp = fbp
    const fbc = readCookie('_fbc')
    if (fbc) attribution.fbc = fbc
  } catch (err) {
    console.error('[tracking] getAttribution cookie read failed', err)
  }

  try {
    if (typeof window !== 'undefined') {
      attribution.landing_page = window.location.pathname
    }
    if (typeof document !== 'undefined' && document.referrer) {
      attribution.referrer = document.referrer
    }
  } catch (err) {
    console.error('[tracking] getAttribution context read failed', err)
  }

  return attribution
}

/**
 * Generate a fresh event id. Call this ONCE per submit and reuse the
 * same value for both trackLead/trackSchedule and postLead so CAPI
 * dedupe (added later) lines up with the browser-side pixel event.
 */
export function newEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID.
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

/**
 * Fire the Meta "Lead" standard event for a qualified pre-qual pass.
 */
export function trackLead(eventId) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('track', 'Lead', { content_name: 'roofer_prequal' }, { eventID: eventId })
  } catch (err) {
    console.error('[tracking] trackLead failed', err)
  }
}

/**
 * Fire a Meta custom event marking a funnel step (PrequalStart, etc.).
 */
export function trackStep(name) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('trackCustom', name)
  } catch (err) {
    console.error('[tracking] trackStep failed', err)
  }
}

/**
 * Fire the Meta "Schedule" standard event when a Calendly booking completes.
 */
export function trackSchedule(eventId) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('track', 'Schedule', {}, { eventID: eventId })
  } catch (err) {
    console.error('[tracking] trackSchedule failed', err)
  }
}

/**
 * Shared fire-and-forget POST to the same-origin /api/lead endpoint (a
 * Cloudflare Pages Function — see functions/api/lead.js), which fires the
 * server-side Meta CAPI event and forwards to the CRM (GoHighLevel) webhook. Never throws, never
 * blocks the UI — a failure here (including the expected 404 under
 * `vite dev`, which has no Functions runtime) must not break the flow.
 */
function postToLeadEndpoint(payload, label) {
  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      console.error(`[tracking] ${label} network error`, err)
    })
  } catch (err) {
    console.error(`[tracking] ${label} failed`, err)
  }
}

/**
 * Fire-and-forget POST of the lead payload to /api/lead. See
 * postToLeadEndpoint() for the shared fire-and-forget semantics.
 */
export function postLead(payload) {
  postToLeadEndpoint(payload, 'postLead')
}

/**
 * Fire-and-forget POST of the Calendly booking payload to /api/lead
 * (event_name: 'Schedule'), so the server-side CAPI "Schedule" event and
 * CRM (GoHighLevel) webhook forward see it as a booking notification. Same fire-and-forget,
 * same-origin, keepalive semantics as postLead() — see
 * postToLeadEndpoint().
 */
export function postSchedule(payload) {
  postToLeadEndpoint(payload, 'postSchedule')
}
