import { Component, useState, useRef, useEffect, lazy, Suspense } from 'react'
import { formatPhone, isCity, isEmail, isFullName, isPhone } from './validate.js'
import { newEventId, trackLead, trackStep, postLead, getAttribution } from './tracking'
import { CALENDLY_URL } from './calendlyUrl.js'
import { navigate } from '../navigate.js'

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

// How long a tapped answer stays highlighted before the next question slides in.
const AUTO_ADVANCE_MS = 320

// The quiz shows ONE question per screen. `steps` groups the questions into
// sections: the section label sits above the progress bar, and finishing a
// section fires the same PrequalStep1Complete / PrequalStep2Complete events
// the old three-screen form did, so funnel reports keep working. Segment
// pages (src/segments.js) swap in their own set through `segment.quiz`; the
// contact-details screen comes last and is the same everywhere. Question
// types: radio, checkbox (stored as one comma-separated string), text.
// `optional` skips validation; `showIf` hides a question until another
// answer matches.
export const DEFAULT_QUIZ = {
  stepLabels: ['Your business', 'Your marketing'],
  steps: [
    [
      { name: 'decisionMaker', type: 'radio', legend: 'Are you the owner / decision-maker?', options: ['Yes', 'I share the decision', 'No'] },
      { name: 'annualRevenue', type: 'radio', legend: "What's your company's annual revenue?", options: ['Under $500K', '$500K–$1M', '$1M–$3M', '$3M–$5M', '$5M+'] },
      { name: 'hasWebsite', type: 'radio', legend: 'Do you have a website?', options: ['Yes', 'No'] },
      { name: 'websiteUrl', type: 'text', label: 'Website address (optional)', optional: true, autoComplete: 'url', showIf: (f) => f.hasWebsite === 'Yes' },
    ],
    [
      { name: 'googleAdsStatus', type: 'radio', legend: 'Are you running paid ads right now?', options: ['Running now', 'Ran before, stopped', 'Never have'] },
      { name: 'adSpend', type: 'radio', legend: 'What can you put toward ad spend each month?', hint: 'your money, paid straight to the ads, not to us', options: ['Under $3K', '$3K–$5K', '$5K–$7K', '$7K+'] },
      { name: 'startTimeline', type: 'radio', legend: 'If we determine this is a right fit, when are you looking to get started?', options: ['Right away', 'Within 30 days', 'In 1–3 months', 'Just exploring'] },
    ],
  ],
  drivingFactorLabel: 'What made you start looking for help now? (optional)',
  // adSpend answers that add the LowBudget / Tier2 tags.
  lowBudget: 'Under $3K',
  tier2: '$7K+',
}

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
  // Segment-page questions (see SEGMENTS[*].quiz in src/segments.js).
  crewCount: '',
  growthPlan: '',
  targetMarkets: '',
  commercialShare: '',
  bidSources: '',
  bidCapacity: '',
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

function RadioGroup({ legend, name, options, value, onChange, error, hint, onPick }) {
  const errorId = `${name}-error`
  const pointerRef = useRef(false)
  return (
    <fieldset
      className="mb-6"
      aria-describedby={error ? errorId : undefined}
      onPointerDown={() => (pointerRef.current = true)}
      onKeyDown={() => (pointerRef.current = false)}
    >
      <legend className="mb-4 block text-xl font-semibold leading-snug text-roof-ink text-balance">{legend}</legend>
      {hint && <p className="-mt-2 mb-4 text-sm text-roof-muted">{hint}</p>}
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
                // A tap or click on an answer moves to the next question
                // (re-tapping the answer already picked does too). Arrow keys
                // also fire click on radios but with no pointer down first,
                // so keyboard users stay put and move on with Enter.
                onClick={() => {
                  if (!pointerRef.current) return
                  pointerRef.current = false
                  onPick?.(opt)
                }}
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

function CheckboxGroup({ legend, name, options, value, onChange, error, hint }) {
  const errorId = `${name}-error`
  const selected = value ? value.split(', ') : []
  function toggle(opt) {
    const next = selected.includes(opt) ? selected.filter((o) => o !== opt) : [...selected, opt]
    // Keep the order the options are listed in, so the CRM value is stable.
    onChange(options.filter((o) => next.includes(o)).join(', '))
  }
  return (
    <fieldset className="mb-6" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-4 block text-xl font-semibold leading-snug text-roof-ink text-balance">{legend}</legend>
      {hint && <p className="-mt-2 mb-4 text-sm text-roof-muted">{hint}</p>}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const optId = `${name}-${opt.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
          const checked = selected.includes(opt)
          return (
            <label
              key={opt}
              htmlFor={optId}
              className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border bg-roof-surface px-4 py-3 text-[17px] text-roof-ink transition-colors ${
                checked ? 'border-accent ring-1 ring-accent' : 'border-roof-border-subtle'
              }`}
            >
              <input
                type="checkbox"
                id={optId}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => toggle(opt)}
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

function Question({ q, fields, errors, update, onPick }) {
  const common = { value: fields[q.name], onChange: (v) => update(q.name, v), error: errors[q.name], hint: q.hint }
  if (q.type === 'text') {
    return (
      <div className="[&_label]:mb-4 [&_label]:text-xl [&_label]:leading-snug [&_label]:text-balance">
        <TextField id={`pq-${q.name}`} label={q.label} autoComplete={q.autoComplete} {...common} />
      </div>
    )
  }
  if (q.type === 'checkbox') return <CheckboxGroup legend={q.legend} name={`pq-${q.name}`} options={q.options} {...common} />
  return <RadioGroup legend={q.legend} name={`pq-${q.name}`} options={q.options} onPick={onPick} {...common} />
}

// The questions a roofer will actually see, in order, given the answers so
// far (a `showIf` question appears only once its trigger answer is picked).
function visibleQuestions(quiz, fields) {
  return quiz.steps.flatMap((questions, section) =>
    questions.filter((q) => !q.showIf || q.showIf(fields)).map((q) => ({ q, section }))
  )
}

function ProgressBar({ label, current, total, done }) {
  // The bar fills as questions are answered, so it only reaches the end once
  // the form is sent.
  const pct = done ? 100 : Math.max(4, Math.round(((current - 1) / total) * 100))
  return (
    <div className="mb-7">
      <p className="mb-2 text-sm font-medium text-roof-ink">{label}</p>
      <div
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done ? total : current - 1}
        className="h-1.5 w-full overflow-hidden rounded-full bg-roof-border-subtle"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
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
  // `screen` indexes the visible questions; one past the last is the
  // contact-details screen.
  const [screen, setScreen] = useState(0)
  const [direction, setDirection] = useState(1)
  const [fields, setFields] = useState(initialFields)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [qualified, setQualified] = useState(false)
  const [booked, setBooked] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')
  const startedRef = useRef(false)
  const fieldsRef = useRef(fields)
  fieldsRef.current = fields
  const advanceTimer = useRef(null)
  const screenRef = useRef(null)
  const navigatedRef = useRef(false)

  function update(name, value) {
    if (!startedRef.current && name !== 'referral_code') {
      startedRef.current = true
      trackStep('PrequalStart')
    }
    setFields((f) => ({ ...f, [name]: value }))
  }

  const quiz = segment?.quiz || DEFAULT_QUIZ
  const questions = visibleQuestions(quiz, fields)
  const contactScreen = questions.length
  const totalScreens = questions.length + 1
  const current = questions[screen]

  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  // After moving between screens, put focus on the new screen's answer (the
  // picked one, or the first) so keyboard and screen-reader users land on
  // the question, and bring the form back into view if a tall screen left
  // its top above the fold. Skipped on first render so the page load
  // doesn't jump to the form.
  useEffect(() => {
    if (!navigatedRef.current) return
    const root = screenRef.current
    const target = root && (root.querySelector('input:checked') || root.querySelector('input, textarea'))
    target?.focus({ preventScroll: true })
    const form = document.getElementById('prequal-form')
    if (form && form.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      form.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
    }
  }, [screen, submitted])

  function validateQuestion(q, f) {
    if (q.optional || (q.showIf && !q.showIf(f))) return {}
    if (!f[q.name].trim()) return { [q.name]: q.type === 'checkbox' ? 'Select at least one.' : 'Select an option.' }
    return {}
  }

  // Contact details, last.
  function validateContact() {
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

  function goTo(next, dir) {
    clearTimeout(advanceTimer.current)
    navigatedRef.current = true
    setDirection(dir)
    setErrors({})
    setScreen(next)
  }

  // Validate the question on screen and move to the next one. Reads the
  // latest answers from a ref so a tap's auto-advance sees the answer it
  // just picked.
  function advance() {
    const f = fieldsRef.current
    const list = visibleQuestions(quiz, f)
    const item = list[screen]
    if (!item) return
    const e = validateQuestion(item.q, f)
    if (Object.keys(e).length > 0) {
      setErrors(e)
      setLiveMessage(e[item.q.name])
      return
    }
    const next = screen + 1
    // Finishing a section fires the same events the old sectioned form did.
    const nextSection = next < list.length ? list[next].section : quiz.steps.length
    if (nextSection !== item.section) trackStep(`PrequalStep${item.section + 1}Complete`)
    goTo(next, 1)
    setLiveMessage(next < list.length ? `Question ${next + 1} of ${list.length + 1}.` : `Last step: your info.`)
  }

  function pick() {
    clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(advance, AUTO_ADVANCE_MS)
  }

  function handleSubmitStep(e) {
    e.preventDefault()

    // Guard against a double-click firing two final submits (two Lead
    // events / two webhook POSTs).
    if (submitted) return

    if (screen < contactScreen) {
      advance()
      return
    }

    const stepErrors = validateContact()
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      setLiveMessage('There are errors in the form. Please review and correct the highlighted fields.')
      return
    }
    setErrors({})

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
    else if (fields.adSpend === quiz.tier2) tags = ['Qualified', 'Tier2']
    else if (fields.adSpend === quiz.lowBudget) tags = ['Qualified', 'LowBudget']
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
      // Segment quizzes ask for the website address without the yes/no
      // question, so fill in hasWebsite for the CRM field that maps it.
      hasWebsite: fields.hasWebsite || (fields.websiteUrl.trim() ? 'Yes' : ''),
      event_id: eventId,
      stage: 'complete',
      tags,
      qualified: isQualified,
      spam: trippedHoneypot,
      page: segment ? segment.slug : 'roofers',
      segment: segment ? segment.key : '',
      attribution: getAttribution(),
    })

    navigatedRef.current = true
    setQualified(isQualified)
    setSubmitted(true)
    setLiveMessage(
      isQualified
        ? "You're qualified — book your appointment."
        : "We might not be the right fit yet — here's how to get ready."
    )
  }

  function goBack() {
    if (screen > 0) {
      goTo(screen - 1, -1)
      setLiveMessage(`Question ${screen} of ${totalScreens}.`)
    }
  }

  const sectionLabel = submitted
    ? qualified ? 'Book your call' : 'Next steps'
    : current ? quiz.stepLabels[current.section] : 'Your info'
  const primaryBtn =
    'group inline-flex h-14 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] bg-accent px-5 text-[17px] font-semibold text-white hover:bg-accent-dark transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const backBtn =
    'h-14 shrink-0 basis-[34%] rounded-[14px] border border-roof-border-strong px-5 py-3 text-[17px] font-semibold text-roof-ink transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none hover:bg-roof-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
  const enter = direction > 0 ? 'animate-question-in' : 'animate-question-back'
  const skippable = current?.q.optional && !fields[current.q.name].trim()

  return (
    <div id="prequal-form" className="mx-auto w-full max-w-xl">
      <ProgressBar label={sectionLabel} current={screen + 1} total={totalScreens} done={submitted} />
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {!submitted && (
        <form onSubmit={handleSubmitStep} noValidate>
          {current && (
            <div key={current.q.name} ref={screenRef} className={`${enter} motion-reduce:animate-none`}>
              <Question q={current.q} fields={fields} errors={errors} update={update} onPick={pick} />
              <div className="flex gap-3">
                {screen > 0 && (
                  <button type="button" onClick={goBack} className={backBtn}>
                    Back
                  </button>
                )}
                <button type="submit" className={primaryBtn}>
                  {skippable ? 'Skip' : 'Continue'}
                  <Arrow />
                </button>
              </div>
            </div>
          )}

          {screen === contactScreen && (
            <div key="contact" ref={screenRef} className={`${enter} motion-reduce:animate-none`}>
              <h3 className="mb-5 text-xl font-semibold leading-snug text-roof-ink text-balance">
                Last step. Where should we send your call details?
              </h3>
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
                label={quiz.drivingFactorLabel}
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

      {submitted && (
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
                      setTimeout(() => navigate('/before-your-call'), 1200)
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
