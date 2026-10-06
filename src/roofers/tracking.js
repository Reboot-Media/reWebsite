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
 * Fire the Meta "Lead" standard event for a qualified pre-qual pass, and
 * the matching GA4 generate_lead event.
 */
export function trackLead(eventId) {
  trackEvent('generate_lead', { form: 'roofer_prequal' })
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('track', 'Lead', { content_name: 'roofer_prequal' }, { eventID: eventId })
  } catch (err) {
    console.error('[tracking] trackLead failed', err)
  }
}

/**
 * Fire a Meta custom event marking a funnel step (PrequalStart, etc.),
 * mirrored to GA4 as form_step.
 */
export function trackStep(name) {
  trackEvent('form_step', { step: name })
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  try {
    window.fbq('trackCustom', name)
  } catch (err) {
    console.error('[tracking] trackStep failed', err)
  }
}

/**
 * Fire the Meta "Schedule" standard event when a Calendly booking
 * completes, and the matching GA4 book_call event.
 */
export function trackSchedule(eventId) {
  trackEvent('book_call')
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

// ---------------------------------------------------------------------------
// Site analytics: Google Analytics 4, Microsoft Clarity, LinkedIn Insight Tag,
// and (optional, dormant) Google Ads remarketing.
//
// Every id below is public (not a secret). Each tracker stays off until its id
// is set, either as the default below or as a Cloudflare Pages build variable
// (Settings > Variables, then redeploy):
//   VITE_GA_MEASUREMENT_ID   GA4 property, "G-..."
//   VITE_CLARITY_PROJECT_ID  Clarity project id (recordings + heatmaps)
//   VITE_LINKEDIN_PARTNER_ID LinkedIn Insight Tag partner id (numbers only)
//   VITE_LINKEDIN_LEAD_CONVERSION / VITE_LINKEDIN_BOOK_CONVERSION
//                            LinkedIn conversion ids for a qualified lead and a
//                            booked call (optional)
//   VITE_GOOGLE_ADS_ID       Google Ads tag, "AW-..." (only if Google Ads runs)
//   VITE_ADS_LEAD_LABEL / VITE_ADS_BOOK_LABEL
//                            Google Ads conversion labels (optional)
//
// initAnalytics() loads whichever trackers have ids and reports, on top of
// GA's own page views and outbound clicks:
//   - scroll_depth at 25/50/75/90% of the page
//   - section_view the first time each [data-section] is half on screen
// trackEvent() sends the same named event to GA and Clarity, and fires the
// LinkedIn / Google Ads conversion mapped to it, if any.
// ---------------------------------------------------------------------------

const env = import.meta.env || {}

export const TRACKING_IDS = {
  ga: env.VITE_GA_MEASUREMENT_ID || 'G-D01K6EHJDP',
  clarity: env.VITE_CLARITY_PROJECT_ID || 'ytmlltjoht',
  linkedin: env.VITE_LINKEDIN_PARTNER_ID || '',
  googleAds: env.VITE_GOOGLE_ADS_ID || '',
}

const LINKEDIN_CONVERSIONS = {
  generate_lead: env.VITE_LINKEDIN_LEAD_CONVERSION || '',
  book_call: env.VITE_LINKEDIN_BOOK_CONVERSION || '',
}

const ADS_CONVERSIONS = {
  generate_lead: env.VITE_ADS_LEAD_LABEL || '',
  book_call: env.VITE_ADS_BOOK_LABEL || '',
}

let analyticsStarted = false

function loadScript(src) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

/**
 * Send a named event to every tracker that is on. Never throws; silent
 * when nothing is configured.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params)
      const label = ADS_CONVERSIONS[name]
      if (TRACKING_IDS.googleAds && label) {
        window.gtag('event', 'conversion', { send_to: `${TRACKING_IDS.googleAds}/${label}` })
      }
    }
    if (typeof window.clarity === 'function') {
      window.clarity('event', name)
    }
    const conversionId = LINKEDIN_CONVERSIONS[name]
    if (conversionId && typeof window.lintrk === 'function') {
      window.lintrk('track', { conversion_id: Number(conversionId) })
    }
  } catch (err) {
    console.error('[tracking] trackEvent failed', err)
  }
}

function startGoogleTag() {
  const tagId = TRACKING_IDS.ga || TRACKING_IDS.googleAds
  if (!tagId) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  if (TRACKING_IDS.ga) window.gtag('config', TRACKING_IDS.ga)
  if (TRACKING_IDS.googleAds) window.gtag('config', TRACKING_IDS.googleAds)
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${tagId}`)
}

function startClarity() {
  if (!TRACKING_IDS.clarity) return
  window.clarity =
    window.clarity ||
    function clarity() {
      ;(window.clarity.q = window.clarity.q || []).push(arguments)
    }
  loadScript(`https://www.clarity.ms/tag/${TRACKING_IDS.clarity}`)
}

function startLinkedIn() {
  if (!TRACKING_IDS.linkedin) return
  window._linkedin_partner_id = TRACKING_IDS.linkedin
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
  window._linkedin_data_partner_ids.push(TRACKING_IDS.linkedin)
  if (!window.lintrk) {
    window.lintrk = function lintrk(a, b) {
      window.lintrk.q.push([a, b])
    }
    window.lintrk.q = []
  }
  loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js')
}

function watchScrollDepth() {
  const marks = [25, 50, 75, 90]
  const sent = new Set()
  const onScroll = () => {
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    if (max <= 0) return
    const pct = (window.scrollY / max) * 100
    for (const m of marks) {
      if (pct >= m && !sent.has(m)) {
        sent.add(m)
        trackEvent('scroll_depth', { percent: m })
      }
    }
    if (sent.size === marks.length) window.removeEventListener('scroll', onScroll)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
}

function watchSections() {
  if (typeof IntersectionObserver === 'undefined') return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        trackEvent('section_view', { section: entry.target.dataset.section })
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.5 },
  )
  document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el))
}

/**
 * Load every configured tracker and start the page-level watchers. Safe to
 * call more than once (StrictMode runs effects twice in dev).
 */
export function initAnalytics() {
  if (analyticsStarted || typeof window === 'undefined') return
  if (!Object.values(TRACKING_IDS).some(Boolean)) return
  analyticsStarted = true
  for (const start of [startGoogleTag, startClarity, startLinkedIn]) {
    try {
      start()
    } catch (err) {
      console.error('[tracking] tracker failed to start', err)
    }
  }
  watchScrollDepth()
  watchSections()
}
