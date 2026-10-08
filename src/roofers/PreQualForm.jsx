import { Component, useState, useRef, lazy, Suspense } from 'react'
import { formatPhone, isCity, isEmail, isFullName, isPhone } from './validate.js'
import { newEventId, trackLead, trackStep, postLead, getAttribution } from './tracking'
import { CALENDLY_URL } from './calendlyUrl.js'

// Arrow that sits on the text baseline and slides right on hover.
export function Arrow() {
  return (
    <svg
      className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// react-calendly is only ever pulled in through this lazy boundary, and
// only once a prospect has qualified — protects LCP on initial paint.
const CalendlyEmbed = lazy(() => import('./CalendlyEmbed.jsx'))

const TOTAL_STEPS = 4
const QUESTION_STEPS = 3

const initialFields = {
  fullName: '',
  company: '',
  email: '',
  phone: '',
  decisionMaker: '',
  city: '',
  annualRevenue: '',
  hasWebsite: '',
  websiteUrl: '',
  googleAdsStatus: '',
  adSpend: '',
  startTimeline: '',
  drivingFactor: '',
  // Honeypot — offscreen, aria-hidden, unreachable by Tab. A filled value
  // marks the submit as likely bot traffic.
  //
  // Named `referral_code`, NOT `website`: password managers and browser
  // autofill routinely ignore autocomplete="off" and will happily fill a
  // field named "website" with a URL. That misfires the honeypot on real
  // people. No autofill heuristic targets "referral_code", while a naive
  // bot filling every input still trips it.
  //
  // A trip FLAGS, it does not block — see handleSubmitStep. Blocking made
  // a false positive invisible and unrecoverable.
  referral_code: '',
}

export function TextField({ id, label, type = 'text', value, onChange, error, hint, autoComplete }) {
  const errorId = `${id}-error`
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-roof-ink">
        {label}
      </label>
      {hint && <p className="mb-2 text-sm text-roof-ink">{hint}</p>}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-[48px] w-full rounded-xl border bg-roof-surface px-4 py-3 text-[17px] text-roof-ink outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          error ? 'border-danger' : 'border-roof-border-strong'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function TextAreaField({ id, label, value, onChange, error, hint }) {
  const errorId = `${id}-error`
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold text-roof-ink">
        {label}
      </label>
      {hint && <p className="mb-2 text-sm text-roof-ink">{hint}</p>}
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`w-full min-h-[96px] rounded-xl border bg-roof-surface px-4 py-3 text-[17px] text-roof-ink outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          error ? 'border-danger' : 'border-roof-border-strong'
        }`}
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

function RadioGroup({ legend, name, options, value, onChange, error, hint }) {
  const errorId = `${name}-error`
  return (
    <fieldset className="mb-6" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 block text-[15px] font-semibold text-roof-ink">{legend}</legend>
      {hint && <p className="mb-2 text-sm text-roof-ink">{hint}</p>}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const optId = `${name}-${opt.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
          const checked = value === opt
          return (
            <label
              key={opt}
              htmlFor={optId}
              className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border bg-roof-surface px-4 py-3 text-[17px] text-roof-ink transition-colors ${
                checked ? 'border-accent ring-1 ring-accent' : 'border-roof-border-subtle'
              }`}
            >
              <input
                type="radio"
                id={optId}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => onChange(opt)}
                aria-invalid={error ? 'true' : 'false'}
                className="h-5 w-5 shrink-0 accent-accent focus-visible:ring-2 focus-visible:ring-accent"
              />
              {opt}
            </label>
          )
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function ProgressIndicator({ step, finalLabel }) {
  const labels = ['Your business', 'Your marketing', 'Your info', finalLabel]
  return (
    <ol className="mb-8 flex items-center" aria-label="Form progress">
      {labels.map((label, i) => {
        const n = i + 1
        const isCurrent = n === step
        const isDone = n < step
        return (
          <li
            key={label}
            className="flex flex-1 items-center gap-2 last:flex-none"
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                isDone || isCurrent ? 'bg-accent text-white' : 'bg-roof-border-subtle text-roof-muted'
              }`}
            >
              {n}
            </span>
            <span
              className={`hidden text-sm sm:inline ${
                isCurrent ? 'font-medium text-roof-ink' : 'text-roof-muted'
              }`}
            >
              {label}
            </span>
            {n < TOTAL_STEPS && <span className="mx-2 h-px flex-1 bg-roof-border-subtle" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function NurtureMessage() {
  return (
    <div role="status" className="rounded-2xl border border-roof-border-subtle bg-roof-surface p-8">
      <p className="text-[17px] font-medium text-roof-ink">
        Thanks — we'd want the decision-maker in the room for this one.
      </p>
      <ul className="mt-4 list-inside list-disc space-y-2 text-[17px] text-roof-ink">
        <li>Loop in the owner, or whoever signs off on marketing spend.</li>
        <li>Come back together and we'll walk you both through it.</li>
      </ul>
    </div>
  )
}

function ConfirmationMessage() {
  return (
    <div role="status" className="rounded-2xl border border-roof-border-subtle bg-roof-surface p-8 text-center">
      <p className="text-[17px] font-medium text-roof-ink">
        You're booked. Taking you to a quick video before your call…
      </p>
    </div>
  )
}

// If the scheduler chunk fails to load (most often a tab opened before a
// deploy asking for a chunk file that no longer exists), React would unmount
// the whole page and leave a white screen. Catch it and link straight to the
// booking page instead.
class SchedulerBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('[prequal] scheduler failed to load', error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    const { name, email } = this.props
    const url = `${CALENDLY_URL}?${new URLSearchParams({ name, email })}`
    return (
      <div className="rounded-2xl border border-roof-border-subtle bg-roof-surface p-8 text-center">
        <p className="mb-5 text-[17px] text-roof-ink">The scheduler didn't load here. You can pick your time on our booking page.</p>
        <a
          href={url}
          className="inline-flex h-14 items-center justify-center rounded-[14px] bg-accent px-6 text-[17px] font-semibold text-white hover:bg-accent-dark"
        >
          Open the booking page
        </a>
      </div>
    )
  }
}

function CalendlyFallback() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-roof-border-subtle bg-roof-surface p-8 text-[17px] text-roof-muted">
      Loading your scheduler…
    </div>
  )
}

export default function PreQualForm({ segment = null }) {
  const [step, setStep] = useState(1)
  const [fields, setFields] = useState(initialFields)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [qualified, setQualified] = useState(false)
  const [booked, setBooked] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')
  const startedRef = useRef(false)

  function update(name, value) {
    if (!startedRef.current && name !== 'referral_code') {
      startedRef.current = true
      trackStep('PrequalStart')
    }
    setFields((f) => ({ ...f, [name]: value }))
  }

  // Screen 1: quick taps about the business. Easy questions come first so
  // the roofer is committed before we ask for contact details.
  function validateStep1() {
    const e = {}
    if (!fields.decisionMaker) e.decisionMaker = 'Select an option.'
    if (!fields.annualRevenue) e.annualRevenue = 'Select an option.'
    if (!fields.hasWebsite) e.hasWebsite = 'Select an option.'
    return e
  }

  // Screen 2: marketing and timing.
  function validateStep2() {
    const e = {}
    if (!fields.googleAdsStatus) e.googleAdsStatus = 'Select an option.'
    if (!fields.adSpend) e.adSpend = 'Select an option.'
    if (!fields.startTimeline) e.startTimeline = 'Select an option.'
    return e
  }

  // Screen 3: contact details, last.
  function validateStep3() {
    const e = {}
    if (!fields.fullName.trim()) e.fullName = 'Enter your first and last name.'
    else if (!isFullName(fields.fullName)) e.fullName = 'Enter your first and last name, letters only.'
    if (fields.company.trim().length < 2) e.company = 'Enter your company name.'
    if (!fields.email.trim()) e.email = 'Enter your email.'
    else if (!isEmail(fields.email)) e.email = 'Enter a valid email address.'
    if (!fields.phone.trim()) e.phone = 'Enter your mobile phone number.'
    else if (!isPhone(fields.phone)) e.phone = 'Enter a 10-digit US phone number, like (555) 234-5678.'
    if (!fields.city.trim()) e.city = 'Enter the city you operate in.'
    else if (!isCity(fields.city)) e.city = 'Enter a city name, letters only.'
    return e
  }

  const STEP_MESSAGES = {
    2: 'Step 2 of 3: Your marketing.',
    3: 'Step 3 of 3: Your info.',
  }

  function handleSubmitStep(e) {
    e.preventDefault()

    // Guard against a double-click firing two final submits (two Lead
    // events / two webhook POSTs).
    if (submitted) return

    const validators = { 1: validateStep1, 2: validateStep2, 3: validateStep3 }
    const stepErrors = validators[step]()
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      setLiveMessage('There are errors in the form. Please review and correct the highlighted fields.')
      return
    }
    setErrors({})

    if (step < QUESTION_STEPS) {
      trackStep(`PrequalStep${step}Complete`)
      setStep(step + 1)
      setLiveMessage(STEP_MESSAGES[step + 1])
      return
    }

    // Final submit: run qualify logic, fire tracking, POST lead.
    //
    // Authority is the only gate. Budget does NOT disqualify — a roofer who
    // picks "Under $3K" still books a call; the LowBudget tag is what tells
    // sales what they're walking into. Only someone who can't say yes at all
    // gets routed to nurture.
    const isQualified = fields.decisionMaker !== 'No'

    // Honeypot tripped. This FLAGS the submit, it does not block it: the
    // person proceeds as normal, the CRM row is tagged SpamSuspect, and the
    // Meta conversion is withheld. See initialFields for the honeypot name.
    const trippedHoneypot = fields.referral_code.trim().length > 0

    let tags
    if (!isQualified) tags = ['Nurture']
    else if (fields.adSpend === '$7K+') tags = ['Qualified', 'Tier2']
    else if (fields.adSpend === 'Under $3K') tags = ['Qualified', 'LowBudget']
    else tags = ['Qualified']
    if (segment) tags = [...tags, segment.tag]
    if (trippedHoneypot) tags = [...tags, 'SpamSuspect']

    const eventId = newEventId()
    if (!trippedHoneypot) trackStep('PrequalStep3Complete')

    // Flagged submits never fire the pixel — Meta's Lead signal stays clean.
    // The server applies the same rule to CAPI via the `spam` flag.
    if (isQualified && !trippedHoneypot) {
      trackLead(eventId)
    }

    postLead({
      ...fields,
      event_id: eventId,
      stage: 'complete',
      tags,
      qualified: isQualified,
      spam: trippedHoneypot,
      page: segment ? segment.slug : 'roofers',
      segment: segment ? segment.key : '',
      attribution: getAttribution(),
    })

    setQualified(isQualified)
    setSubmitted(true)
    setStep(TOTAL_STEPS)
    setLiveMessage(
      isQualified
        ? "You're qualified — book your appointment."
        : "We might not be the right fit yet — here's how to get ready."
    )
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1)
      setErrors({})
      setLiveMessage(`Step ${step - 1} of 3.`)
    }
  }

  const finalLabel = submitted && !qualified ? 'Next steps' : 'Book'
  const primaryBtn =
    'group inline-flex h-14 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-accent px-5 text-[17px] font-semibold text-white hover:bg-accent-dark transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const backBtn =
    'h-14 shrink-0 basis-[34%] rounded-[14px] border border-roof-border-strong px-5 py-3 text-[17px] font-semibold text-roof-ink transition-colors hover:bg-roof-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

  return (
    <div id="prequal-form" className="mx-auto w-full max-w-xl">
      <ProgressIndicator step={step} finalLabel={finalLabel} />
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {step <= QUESTION_STEPS && (
        <form onSubmit={handleSubmitStep} noValidate>
          {step === 1 && (
            <div>
              <RadioGroup
                legend="Are you the owner / decision-maker?"
                name="pq-decisionMaker"
                options={['Yes', 'I share the decision', 'No']}
                value={fields.decisionMaker}
                onChange={(v) => update('decisionMaker', v)}
                error={errors.decisionMaker}
              />
              <RadioGroup
                legend="What's your company's annual revenue?"
                name="pq-annualRevenue"
                options={['Under $500K', '$500K–$1M', '$1M–$3M', '$3M–$5M', '$5M+']}
                value={fields.annualRevenue}
                onChange={(v) => update('annualRevenue', v)}
                error={errors.annualRevenue}
              />
              <RadioGroup
                legend="Do you have a website?"
                name="pq-hasWebsite"
                options={['Yes', 'No']}
                value={fields.hasWebsite}
                onChange={(v) => update('hasWebsite', v)}
                error={errors.hasWebsite}
              />
              {fields.hasWebsite === 'Yes' && (
                <TextField
                  id="pq-websiteUrl"
                  label="Website address (optional)"
                  value={fields.websiteUrl}
                  onChange={(v) => update('websiteUrl', v)}
                  autoComplete="url"
                />
              )}
              <button type="submit" className={`${primaryBtn} w-full`}>
                Continue
                <Arrow />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <RadioGroup
                legend="Are you running paid ads right now?"
                name="pq-googleAdsStatus"
                options={['Running now', 'Ran before, stopped', 'Never have']}
                value={fields.googleAdsStatus}
                onChange={(v) => update('googleAdsStatus', v)}
                error={errors.googleAdsStatus}
              />
              <RadioGroup
                legend="What can you put toward ad spend each month?"
                hint="your money, paid straight to the ads, not to us"
                name="pq-adSpend"
                options={['Under $3K', '$3K–$5K', '$5K–$7K', '$7K+']}
                value={fields.adSpend}
                onChange={(v) => update('adSpend', v)}
                error={errors.adSpend}
              />
              <RadioGroup
                legend="If we determine this is a right fit, when are you looking to get started?"
                name="pq-startTimeline"
                options={['Right away', 'Within 30 days', 'In 1–3 months', 'Just exploring']}
                value={fields.startTimeline}
                onChange={(v) => update('startTimeline', v)}
                error={errors.startTimeline}
              />
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className={backBtn}>
                  Back
                </button>
                <button type="submit" className={primaryBtn}>
                  Continue
                <Arrow />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="grid gap-x-4 sm:grid-cols-2">
                <TextField
                  id="pq-fullName"
                  label="First and last name"
                  value={fields.fullName}
                  onChange={(v) => update('fullName', v)}
                  error={errors.fullName}
                  autoComplete="name"
                />
                <TextField
                  id="pq-company"
                  label="Company name"
                  value={fields.company}
                  onChange={(v) => update('company', v)}
                  error={errors.company}
                  autoComplete="organization"
                />
                <TextField
                  id="pq-email"
                  type="email"
                  label="Email"
                  value={fields.email}
                  onChange={(v) => update('email', v)}
                  error={errors.email}
                  autoComplete="email"
                />
                <TextField
                  id="pq-phone"
                  type="tel"
                  label="Mobile phone"
                  value={fields.phone}
                  onChange={(v) => update('phone', formatPhone(v))}
                  error={errors.phone}
                  autoComplete="tel"
                />
              </div>
              <TextField
                id="pq-city"
                label="What city do you operate in?"
                value={fields.city}
                onChange={(v) => update('city', v)}
                error={errors.city}
                autoComplete="address-level2"
              />
              <TextAreaField
                id="pq-drivingFactor"
                label="What made you start looking for help now? (optional)"
                value={fields.drivingFactor}
                onChange={(v) => update('drivingFactor', v)}
                error={errors.drivingFactor}
              />
              {/* Honeypot — offscreen and unreachable by keyboard/screen reader.
                  Real users never see it; a filled value flags (never blocks)
                  the submit. See initialFields for why it isn't named
                  "website" — that name attracts password-manager autofill. */}
              <div
                style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="referral_code"
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  value={fields.referral_code}
                  onChange={(e) => update('referral_code', e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className={backBtn}>
                  Back
                </button>
                <button type="submit" className={primaryBtn}>
                  Pick a time
                  <Arrow />
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {step === TOTAL_STEPS && submitted && (
        <div>
          {qualified ? (
            booked ? (
              <ConfirmationMessage />
            ) : (
              <div>
                <h3 className="mb-4 text-[17px] font-semibold text-roof-ink">
                  You're in — pick a time that works.
                </h3>
                <SchedulerBoundary name={fields.fullName} email={fields.email}>
                <Suspense fallback={<CalendlyFallback />}>
                  <CalendlyEmbed
                    name={fields.fullName}
                    email={fields.email}
                    phone={fields.phone}
                    company={fields.company}
                    onScheduled={() => {
                      setBooked(true)
                      // Short pause so the booking events finish sending, then
                      // take them to the pre-call page with the walkthrough video.
                      setTimeout(() => window.location.assign('/before-your-call'), 1200)
                    }}
                  />
                </Suspense>
                </SchedulerBoundary>
              </div>
            )
          ) : (
            <NurtureMessage />
          )}
        </div>
      )}
    </div>
  )
}
