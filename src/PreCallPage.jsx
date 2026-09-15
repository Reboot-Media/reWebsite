const ADC_RESULT = {
  spend: 'About $6K',
  inspections: '10+',
  sold: 'About $123K',
  timeline: 'Under 60 days',
  pending: 'About $40K pending insurance — not included above',
}

const STORM_ACTIONS = [
  { label: 'Storm confirmed', detail: 'Verified event data', icon: 'check' },
  { label: 'ZIP codes updated', detail: 'Targeting follows impact', icon: 'pin' },
  { label: 'Bids adjusted', detail: 'Demand informs bids', icon: 'sliders' },
  { label: 'Budget shifted', detail: 'Spend moves where needed', icon: 'bolt' },
  { label: 'Roofer notified', detail: 'You know what changed', icon: 'bell' },
]

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="Reboot Media">
      <img src="/logo.svg" alt="" className="h-7 w-7" />
      <span className="text-[15px] font-bold tracking-tight text-roof-ink">Reboot Media</span>
    </div>
  )
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path d="m5 10.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-8 w-8">
      <path d="M9 7.7v8.6a1 1 0 0 0 1.55.83l6.45-4.3a1 1 0 0 0 0-1.66l-6.45-4.3A1 1 0 0 0 9 7.7Z" fill="currentColor" />
    </svg>
  )
}

function VideoPanel() {
  const loomUrl = import.meta.env.VITE_PRECALL_LOOM_EMBED_URL?.trim()

  if (loomUrl) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-brand-950 shadow-[0_18px_50px_-24px_rgba(19,10,36,0.65)] ring-1 ring-brand-950/10">
        <iframe
          src={loomUrl}
          title="Reboot Media pre-call overview"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-950 shadow-[0_18px_50px_-24px_rgba(19,10,36,0.65)] ring-1 ring-brand-950/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(124,58,237,0.32),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_45%)]" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-accent shadow-lg shadow-black/20">
          <PlayIcon />
        </span>
        <p className="mt-4 text-base font-semibold text-white sm:text-lg">Your pre-call video goes here</p>
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-roof-ink-muted sm:text-sm">
          A quick overview before we talk.
        </p>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="pt-10 sm:pt-14">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-muted/60 bg-accent-bg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Your call is booked
      </div>
      <h1 className="max-w-3xl text-[2rem] font-extrabold leading-[1.1] tracking-[-0.035em] text-roof-ink sm:text-5xl">
        A quick note before we talk.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-roof-muted sm:text-lg">
        Watch this quick overview so we can use our time on your market, your goals, and whether the system fits your roofing company.
      </p>
      <div className="mt-7 sm:mt-9">
        <VideoPanel />
      </div>
    </section>
  )
}

function CaseStudy() {
  return (
    <section className="mt-10 sm:mt-14" aria-labelledby="case-study-heading">
      <div className="overflow-hidden rounded-3xl bg-brand-950 text-white shadow-[0_28px_80px_-42px_rgba(19,10,36,0.8)] ring-1 ring-brand-950/10">
        <div className="relative px-5 py-8 text-center sm:px-10 sm:py-11">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.34),transparent_48%)]" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-muted">ADC Roofing · Dallas, Texas</p>
            <h2 id="case-study-heading" className="mx-auto mt-4 max-w-2xl text-balance text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              A real roofing campaign. A result you can verify.
            </h2>

            <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white/[0.07] px-5 py-7 ring-1 ring-white/10 sm:px-8 sm:py-9">
              <p className="text-sm font-semibold text-roof-ink-muted">Revenue sold from the campaign</p>
              <p className="mt-2 text-5xl font-extrabold tracking-[-0.05em] text-white sm:text-7xl">{ADC_RESULT.sold}</p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-accent-muted">{ADC_RESULT.timeline}</p>
            </div>

            <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 divide-x divide-white/10 rounded-2xl bg-white/[0.045] ring-1 ring-white/10">
              <div className="px-4 py-5 sm:px-6">
                <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{ADC_RESULT.spend}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-roof-ink-muted">Google ad spend</p>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{ADC_RESULT.inspections}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-roof-ink-muted">Inspections</p>
              </div>
            </div>

            <div className="mx-auto mt-6 flex max-w-lg items-start justify-center gap-2 text-left">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-green-300" />
              <p className="text-sm font-medium leading-relaxed text-roof-ink-muted">{ADC_RESULT.pending}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

function StormIcon({ type }) {
  const paths = {
    check: <path d="m6 12 4 4 8-9" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    sliders: <><path d="M4 7h10M18 7h2M4 17h3M11 17h9" /><circle cx="16" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
    bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M10 19h4" /></>,
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  )
}

function StormSystem() {
  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="storm-heading">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Built for what happens next</p>
        <h2 id="storm-heading" className="mt-3 text-2xl font-bold tracking-tight text-roof-ink sm:text-3xl">
          When a storm is confirmed, the system adapts.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-roof-muted">
          Confirmed event data triggers deliberate changes across the campaign—without pretending anyone can predict the weather.
        </p>
      </div>

      <div className="mt-7 rounded-2xl border border-brand-800/15 bg-brand-950 p-4 shadow-[0_24px_70px_-36px_rgba(19,10,36,0.75)] sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-40 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-light" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-muted">System response</span>
          </div>
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-300">Confirmed</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-5">
          {STORM_ACTIONS.map((action, index) => (
            <div key={action.label} className="relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] p-3 sm:block sm:min-h-32 sm:p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent-muted">
                <StormIcon type={action.icon} />
              </span>
              <div className="min-w-0 sm:mt-3">
                <p className="text-sm font-semibold leading-tight text-white">{action.label}</p>
                <p className="mt-1 text-[11px] leading-snug text-roof-ink-muted">{action.detail}</p>
              </div>
              {index < STORM_ACTIONS.length - 1 && (
                <span className="absolute -bottom-2.5 left-[1.65rem] z-10 h-3 w-px bg-accent-light/40 sm:-right-[5px] sm:bottom-auto sm:left-auto sm:top-8 sm:h-px sm:w-2" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CallAgenda() {
  const steps = [
    {
      number: '01',
      title: 'Map your current situation',
      description: 'We’ll look at your market, capacity, current lead flow, and where the gaps actually are.',
    },
    {
      number: '02',
      title: 'Decide whether there’s a fit',
      description: 'If the system makes sense for your company, we’ll outline what the next step would look like. If it doesn’t, we’ll say so.',
    },
  ]

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="agenda-heading">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Our call has two parts</p>
      <h2 id="agenda-heading" className="mt-3 text-2xl font-bold tracking-tight text-roof-ink sm:text-3xl">A focused conversation. No presentation marathon.</h2>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {steps.map((step) => (
          <article key={step.number} className="rounded-2xl border border-roof-border-subtle bg-white p-5 sm:p-7">
            <span className="text-xs font-extrabold tracking-[0.15em] text-accent">{step.number}</span>
            <h3 className="mt-4 text-lg font-bold tracking-tight text-roof-ink">{step.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-roof-muted sm:text-[15px]">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Commitment() {
  return (
    <section className="my-16 overflow-hidden rounded-2xl bg-accent-bg ring-1 ring-accent-muted/50 sm:my-20" aria-labelledby="commitment-heading">
      <div className="px-5 py-8 text-center sm:px-10 sm:py-10">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/20">
          <CheckIcon className="h-5 w-5" />
        </span>
        <h2 id="commitment-heading" className="mt-4 text-xl font-bold tracking-tight text-roof-ink sm:text-2xl">One quick thing before the call.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-roof-muted sm:text-base">
          After you finish the video, reply <span className="font-bold text-roof-ink">WATCHED</span> in the same text conversation that sent you this link. That lets us know you’re ready.
        </p>
        <div className="mx-auto mt-5 inline-flex rounded-lg border border-accent-muted bg-white px-5 py-2.5 font-mono text-sm font-bold tracking-[0.18em] text-accent-dark shadow-sm">WATCHED</div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-roof-border-subtle py-7 text-center">
      <p className="text-xs text-roof-muted">Reboot Media LLC · Austin, Texas</p>
    </footer>
  )
}

export default function PreCallPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-roof-paper font-sans text-roof-ink antialiased">
      <div className="mx-auto max-w-4xl px-5 pt-7 sm:px-8 sm:pt-9">
        <BrandMark />
        <main>
          <Hero />
          <CaseStudy />
          <StormSystem />
          <CallAgenda />
          <Commitment />
        </main>
      </div>
      <Footer />
    </div>
  )
}
