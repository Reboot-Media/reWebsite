import { useEffect } from 'react';
import PreQualForm from './roofers/PreQualForm.jsx';
import { captureAttribution } from './roofers/tracking.js';

const FOUNDER_VIDEO_URL = 'https://www.youtube-nocookie.com/embed/7A6Etcubfpw?rel=0';
const LINKEDIN_URL = 'https://www.linkedin.com/company/rebootmedia-io/';
const CTA_LABEL = 'Book a Strategy Call';

const PHASES = [
  { name: 'Evaluate', text: "We look at what you're doing now and keep what works." },
  { name: 'Reboot', text: "We set everything up. You're live in 2 business days." },
  { name: 'Compound', text: 'It learns which calls turn into jobs, so it gets better over time.' },
];

const FAQS = [
  { q: 'What do I have to do?', a: 'Answer the phone and show up to the inspection.' },
  {
    q: 'What happens on the strategy call?',
    a: "We look at how you get customers today and show you how this would work for your company. If it's not a fit, we'll tell you.",
  },
  { q: 'What does it cost?', a: "The strategy call is free. Pricing depends on your company, and we'll go over it on the call." },
  {
    q: 'Is there a contract?',
    a: 'Yes, 90 days. Your ad budget is paid straight to the ad platform, not to us. You keep your ad account and every homeowner who came in, even if you leave.',
  },
  {
    q: 'How is this different from an agency?',
    a: "We build the system ourselves, with computer science degrees and 10 years in marketing behind it. We start by keeping what already works.",
  },
];

const SAMPLE_BOOKING = {
  name: 'Mike Henderson',
  initials: 'MH',
  place: 'Ridgeview Dr, Plano, TX',
  phone: '(972) 555-0148',
};

const EXAMPLE_ROWS = [
  ['Needs', 'Storm damage'],
  ['Inspection', 'Thursday, 9:00 AM'],
  ['Roof age', 'About 12 years'],
  ['Insurance', 'Not filed yet'],
  ['Their note', '"Shingles came off the back slope after the wind."'],
];

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const h2Class = 'text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-roof-ink [text-wrap:balance] md:text-[40px] lg:text-[44px]';
const bodyClass = 'text-[17px] leading-[1.65] text-roof-ink md:text-[18px]';
const mutedClass = 'text-[17px] leading-[1.65] text-roof-muted md:text-[18px]';
const wrap = 'mx-auto max-w-[1120px] px-5 md:px-8';
const sec = 'py-20 lg:py-32';
const card = 'rounded-[20px] bg-roof-surface ring-1 ring-roof-border-subtle';

function Logo({ className = 'h-7 w-7' }) {
  return <img src="/logo.png" alt="" className={className} />;
}

function IconLinkedIn({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function Icon({ d, className = 'h-6 w-6', children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  );
}

const btnBase = `inline-flex items-center justify-center font-semibold transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none ${focusRing}`;

function CTA({ children = CTA_LABEL, small = false, className = '' }) {
  const look = 'bg-accent text-white hover:bg-accent-dark';
  const size = small ? 'h-12 rounded-xl px-3.5 text-[15px] md:px-5 md:text-base' : 'h-14 rounded-[14px] px-7 text-[17px]';
  return (
    <a href="#prequal-form" className={`${btnBase} ${size} ${look} ${className}`}>
      {children}
    </a>
  );
}

const col = 'max-w-[640px]';

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-roof-border-subtle bg-white/80 backdrop-blur-md">
      <div className={`${wrap} flex min-h-[72px] items-center justify-between gap-2`}>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Logo />
          <span className="text-base font-bold tracking-tight text-roof-ink">Reboot Media</span>
        </span>
        <CTA small>{CTA_LABEL}</CTA>
      </div>
    </header>
  );
}

function FounderVideo() {
  if (!FOUNDER_VIDEO_URL) return null;
  return (
    <figure className="w-full">
      <div className="aspect-video overflow-hidden rounded-[20px] bg-accent-bg shadow-lift ring-8 ring-white">
        <iframe
          src={FOUNDER_VIDEO_URL}
          title="How the three phases work"
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <figcaption className="mt-3.5 text-[15px] text-roof-muted">How the three phases work.</figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,theme(colors.accent.bg)_0%,white_62%)] pb-20 pt-12 md:pb-24 md:pt-24">
      <div className={`${wrap} relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16`}>
        <div>
          <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">For residential roofing companies</p>
          <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[52px] lg:text-[56px] lg:leading-[1.04]">
            <span className="text-roof-ink">Roof inspections, booked for you.</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-[18px] leading-[1.65] text-roof-muted md:text-[19px]">
            We set up the system that brings homeowners to your calendar. You answer the phone and show up.
          </p>
          <div className="mt-8">
            <CTA className="w-full sm:w-auto" />
            <p className="mt-3 text-[17px] text-roof-muted">A few questions, then pick a time.</p>
          </div>
        </div>
        <FounderVideo />
      </div>
    </section>
  );
}

function Phases() {
  return (
    <section className={`bg-roof-surface ${sec}`}>
      <div className={wrap}>
        <h2 className={h2Class}>How it works</h2>
        <ol className="mt-10 grid gap-10 md:grid-cols-3">
          {PHASES.map((p, i) => (
            <li key={p.name}>
              <span className="mb-3 block text-lg font-bold text-accent">{i + 1}</span>
              <h3 className="mb-2.5 text-[20px] font-bold leading-[1.2] text-roof-ink">{p.name}</h3>
              <p className={mutedClass}>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ExampleValue({ label, value }) {
  if (label === 'Needs') {
    return <span className="inline-block rounded-full bg-accent-bg px-3 py-0.5 text-base font-semibold text-accent-dark">{value}</span>;
  }
  if (label === 'Their note') {
    return <span className="block rounded-r-[10px] border-l-[3px] border-accent bg-roof-paper px-3.5 py-3 font-medium">{value}</span>;
  }
  return value;
}

function ExampleCard() {
  return (
    <div className={`${card} p-7 shadow-card`}>
      <div className="mb-6 flex items-center gap-3.5 border-b border-roof-border-subtle pb-5">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-bg text-[15px] font-bold text-accent-dark">
          {SAMPLE_BOOKING.initials}
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-bold leading-[1.3] text-roof-ink">{SAMPLE_BOOKING.name}</p>
          <p className="text-[15px] leading-[1.4] text-roof-muted">
            {SAMPLE_BOOKING.place} · {SAMPLE_BOOKING.phone}
          </p>
        </div>
      </div>
      <dl>
        {EXAMPLE_ROWS.map(([k, v]) => (
          <div key={k} className="mb-4">
            <dt className="text-xs font-semibold uppercase leading-[1.4] tracking-[0.08em] text-roof-muted">{k}</dt>
            <dd className="mt-0.5 text-[17px] font-semibold leading-[1.45] text-roof-ink">
              <ExampleValue label={k} value={v} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[13px] text-roof-muted">Sample booking</p>
    </div>
  );
}

function KnowBeforeYouGo() {
  return (
    <section className={`bg-roof-paper ${sec}`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-[72px]`}>
        <div>
          <h2 className={`mb-5 ${h2Class}`}>Know who you're meeting before you go.</h2>
          <p className={`${col} ${mutedClass}`}>
            Homeowners answer a few questions before they book. You see what they need ahead of time.
          </p>
        </div>
        <ExampleCard />
      </div>
    </section>
  );
}

function WhoItsFor() {
  return (
    <section className={`bg-roof-surface ${sec}`}>
      <div className={`${wrap}`}>
        <div className={col}>
          <h2 className={`mb-5 ${h2Class}`}>Is this a fit?</h2>
          <p className={mutedClass}>
            It's for residential roofing companies that answer the phone and show up to the inspection. We work with one roofer per service area.
          </p>
        </div>
      </div>
    </section>
  );
}

const CREDENTIALS = [
  "Master's and bachelor's degrees in computer science",
  '10 years in marketing',
  'Hands-on experience in home services and construction',
  'Working with Whitestone Roofing',
];

function Team() {
  return (
    <section className={`bg-roof-surface ${sec}`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16`}>
        <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,theme(colors.accent.DEFAULT),theme(colors.accent.dark))] shadow-lift lg:h-28 lg:w-28">
          <img src="/logo.png" alt="" className="h-12 w-12 brightness-0 invert lg:h-14 lg:w-14" />
        </div>
        <div className={col}>
          <h2 className={`mb-5 ${h2Class}`}>Who we are</h2>
          <p className={`mb-5 ${mutedClass}`}>
            Reboot Media was founded by Kendall Reid. We build the system ourselves, and we know the trade it's built for.
          </p>
          <ul className="mb-6 space-y-3">
            {CREDENTIALS.map((c) => (
              <li key={c} className={`flex gap-3 ${bodyClass}`}>
                <Icon d="M20 6 9 17l-5-5" className="mt-[5px] h-5 w-5 shrink-0 text-accent" />
                {c}
              </li>
            ))}
          </ul>
          <p className={bodyClass}>
            Email:{' '}
            <a href="mailto:hello@rebootmedia.us" className={`font-medium text-accent-dark underline underline-offset-4 hover:text-accent ${focusRing}`}>
              hello@rebootmedia.us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="after-you-book" className={`scroll-mt-24 bg-roof-paper ${sec}`}>
      <div className={wrap}>
        <div className={col}>
          <h2 className={`mb-10 ${h2Class}`}>Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-roof-surface px-6 py-5 ring-1 ring-roof-border-subtle open:shadow-card">
                <summary className={`flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold leading-snug text-roof-ink hover:text-accent-dark [&::-webkit-details-marker]:hidden ${focusRing}`}>
                  {f.q}
                  <Icon className="h-5 w-5 shrink-0 text-roof-muted transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none" d="M6 9l6 6 6-6" />
                </summary>
                <p className={`mt-2 ${mutedClass}`}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section className={`bg-[linear-gradient(0deg,theme(colors.accent.bg)_0%,white_70%)] ${sec}`}>
      <div className={wrap}>
        <div className={col}>
          <h2 className={`mb-4 ${h2Class}`}>Book your strategy call</h2>
          <p className={`mb-10 ${mutedClass}`}>A few questions, then pick a time.</p>
          <div className="w-full rounded-3xl bg-roof-surface p-6 shadow-lift ring-1 ring-roof-border-subtle md:p-8 [&_#prequal-form]:scroll-mt-24">
            <PreQualForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-roof-border-subtle bg-roof-surface">
      <div className={`${wrap} flex flex-col gap-2 py-10 text-[15px] text-roof-muted sm:flex-row sm:items-center sm:justify-between`}>
        <p>Reboot Media LLC</p>
        <a href="mailto:hello@rebootmedia.us" className={`inline-flex min-h-[48px] items-center hover:text-roof-ink hover:underline ${focusRing}`}>
          hello@rebootmedia.us
        </a>
        <div className="flex items-center gap-2">
          <a href="/privacy.html" className={`inline-flex min-h-[48px] items-center px-2 hover:text-roof-ink hover:underline ${focusRing}`}>
            Privacy
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reboot Media on LinkedIn"
            className={`inline-flex min-h-[48px] min-w-[48px] items-center justify-center hover:text-roof-ink ${focusRing}`}
          >
            <IconLinkedIn />
          </a>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-roof-surface font-sans text-[17px] text-roof-ink antialiased">
      <Header />
      <main>
        <Hero />
        <Phases />
        <KnowBeforeYouGo />
        <WhoItsFor />
        <Team />
        <Faq />
        <FormSection />
      </main>
      <Footer />
    </div>
  );
}
