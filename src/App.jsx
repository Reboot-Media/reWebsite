import { useEffect } from 'react';
import PreQualForm from './roofers/PreQualForm.jsx';
import { captureAttribution } from './roofers/tracking.js';

const FOUNDER_VIDEO_URL = '';
const LINKEDIN_URL = 'https://www.linkedin.com/company/rebootmedia-io/';
const CTA_LABEL = 'Book my strategy call';

const PHASES = [
  { name: 'Evaluate', text: "We audit your company. We keep what works and remove what doesn't." },
  { name: 'Reboot', text: 'We install your pre-qual form, your marketing system and your storm tracker.' },
  {
    name: 'Compound',
    text: 'The system learns which calls become inspections and which become closed jobs. So the same spend can bring more jobs over time.',
  },
];

const AFTER_BOOKING = [
  'You pick a time on the calendar.',
  'On the strategy call, we look at how homeowners reach you today.',
  'We walk through the three phases for your company.',
  'We set the numbers with you.',
  "If it's not a fit, we say so.",
];

const FOR_LIST = [
  'Residential roofing companies.',
  'Owners who answer the phone and show up to the inspection.',
  'Companies that want more qualified inspections, not just more calls.',
  'Owners who want to work with one person on their account.',
];

const NOT_FOR_LIST = [
  'Commercial-only roofing companies.',
  'Anyone who wants results without being involved.',
  "Companies that won't answer the phone or show up.",
];

const FAQS = [
  {
    q: 'What does Reboot install?',
    a: 'Three things: your pre-qual form, your marketing system and your storm tracker. All three are live in 2 business days.',
  },
  {
    q: 'What is the pre-qual form?',
    a: 'The homeowner says what they need: an insurance claim, storm damage, or planning ahead. Then they book the inspection. You see their answers before you go.',
  },
  { q: 'What do I have to do?', a: 'Answer the phone and show up to the inspection.' },
  {
    q: 'What happens on the strategy call?',
    a: 'We look at how homeowners reach you today, walk through the three phases for your company, and set the numbers with you.',
  },
  { q: 'Who works on my account?', a: 'Kendall Reid, the founder, works every account personally.' },
  {
    q: 'What does it cost?',
    a: 'It depends on your service area and what you want to take on. We set the numbers with you on the strategy call.',
  },
  {
    q: "I've worked with an agency before. How is this different?",
    a: "You deal with Kendall directly. Phase one is an audit of what you have. We keep what works and remove what doesn't.",
  },
];

const EXAMPLE_ROWS = [
  ['Homeowner', 'Example Homeowner'],
  ['Needs', 'Storm damage'],
  ['Inspection', 'Thursday morning'],
  ['Their note', '"Shingles came off the back slope after the wind."'],
];


const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const h2Class = 'text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-roof-ink [text-wrap:balance] md:text-[40px] lg:text-[44px]';
const bodyClass = 'text-[17px] leading-[1.65] text-roof-ink md:text-[18px]';
const mutedClass = 'text-[17px] leading-[1.65] text-roof-muted md:text-[18px]';
const wrap = 'mx-auto max-w-[1120px] px-5 md:px-8';
const sec = 'py-[72px] lg:py-28';
const card = 'rounded-[20px] border border-roof-border-subtle bg-roof-surface';
const connectorV = 'absolute left-[19px] top-11 bottom-1 w-0.5 bg-accent-border';
const circle = 'absolute left-0 top-0 z-[1] flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-roof-surface text-lg font-bold text-accent';

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

function CTA({ children = CTA_LABEL, secondary = false, small = false, className = '' }) {
  const look = secondary
    ? 'border border-accent bg-white text-accent-dark hover:bg-accent-bg'
    : 'bg-accent text-white hover:bg-accent-dark';
  const size = small ? 'h-12 rounded-xl px-3.5 text-[15px] md:px-5 md:text-base' : 'h-14 rounded-[14px] px-7 text-[17px]';
  return (
    <a href="#prequal-form" className={`${btnBase} ${size} ${look} ${className}`}>
      {children}
    </a>
  );
}

function TextLink({ href, children, small = false, className = '' }) {
  const size = small ? 'text-[15px] font-medium' : 'text-[17px] font-medium';
  return (
    <a
      href={href}
      className={`inline-flex min-h-[48px] items-center ${size} text-accent-dark underline underline-offset-4 hover:text-accent ${focusRing} ${className}`}
    >
      {children}
    </a>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-roof-border-subtle bg-white/80 backdrop-blur-md">
      <div className={`${wrap} flex min-h-[72px] items-center justify-between gap-2`}>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Logo />
          <span className="text-base font-bold tracking-tight text-roof-ink">Reboot Media</span>
        </span>
        <div className="flex items-center gap-6 md:gap-7">
          <TextLink href="#after-you-book" small className="hidden sm:inline-flex">
            Already booked? See what happens next
          </TextLink>
          <CTA small>{CTA_LABEL}</CTA>
        </div>
      </div>
    </header>
  );
}

function FounderVideo() {
  if (!FOUNDER_VIDEO_URL) return null;
  return (
    <figure className="mx-auto mt-12 max-w-[880px]">
      <div className="aspect-video overflow-hidden rounded-[20px] border border-roof-border-subtle bg-accent-bg shadow-[0_30px_80px_-30px_rgba(91,33,182,0.35)] ring-8 ring-white">
        <iframe
          src={FOUNDER_VIDEO_URL}
          title="Kendall explains the three phases"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <figcaption className="mt-3.5 text-[15px] text-roof-muted">Kendall explains the three phases.</figcaption>
    </figure>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,theme(colors.accent.bg)_0%,white_62%)] pb-[72px] pt-16 md:pb-24 md:pt-24">
      <div aria-hidden="true" className="hero-dots pointer-events-none absolute inset-0" />
      <div className={`${wrap} relative text-center`}>
        <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">For residential roofing companies</p>
        <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[52px] lg:text-[60px] lg:leading-[1.04]">
          <span className="block text-roof-ink">Add more qualified roof inspections.</span>{' '}
          <span className="block text-accent-dark">Know what each homeowner needs before you go.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[640px] text-[18px] leading-[1.65] text-roof-muted md:text-[19px]">
          Reboot installs the system that turns homeowners who need a roof into booked inspections. Live in 2 business days.
        </p>
        <p className="mx-auto mt-3 max-w-[640px] text-[18px] font-medium leading-[1.65] text-roof-ink md:text-[19px]">
          All you have to do is answer the phone and show up to the inspection.
        </p>
        <div className="mt-8">
          <CTA className="w-full sm:w-auto" />
          <p className="mt-3 text-[15px] text-roof-muted">Answer a few questions, then pick a time.</p>
          <TextLink href="#after-you-book" className="sm:hidden">
            Already booked? See what happens next
          </TextLink>
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
        <h2 className={h2Class}>Three phases. Live in 2 business days.</h2>
        <ol className="mt-10 grid md:grid-cols-3 md:gap-10">
          {PHASES.map((p, i) => (
            <li key={p.name} className="relative pb-10 pl-[60px] last:pb-0 md:px-0 md:pb-0 md:pt-14">
              <span aria-hidden="true" className={circle}>{`0${i + 1}`}</span>
              {i < PHASES.length - 1 && (
                <span aria-hidden="true" className={`${connectorV} md:bottom-auto md:left-[52px] md:right-[-28px] md:top-[19px] md:h-0.5 md:w-auto`} />
              )}
              <h3 className="mb-2.5 text-[22px] font-bold leading-[1.2] text-roof-ink">{p.name}</h3>
              <p className={mutedClass}>{p.text}</p>
            </li>
          ))}
        </ol>
        <p className={`mb-5 mt-10 font-semibold ${bodyClass}`}>Kendall works each account personally.</p>
        <CTA className="w-full sm:w-auto" />
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
    <div className={`${card} border-l-4 border-l-accent p-7 shadow-md`}>
      <span className="mb-5 inline-block rounded-full bg-accent-bg px-2.5 py-1 text-[11px] font-bold uppercase leading-[1.4] tracking-[0.12em] text-accent-dark">
        Example
      </span>
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
      <p className="mt-5 text-sm text-roof-muted">Sample for illustration. Not a real homeowner.</p>
    </div>
  );
}

function KnowBeforeYouGo() {
  return (
    <section className={`bg-roof-paper ${sec}`}>
      <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-[72px]`}>
        <div>
          <h2 className={`mb-5 ${h2Class}`}>You know before you go.</h2>
          <p className={`mb-7 max-w-[640px] ${mutedClass}`}>
            Before a homeowner books, they answer a short form. They tell us what they need: an insurance claim, storm damage, or planning ahead for a replacement. Then they book the inspection. You see their answers before the visit, so you arrive ready for the right conversation.
          </p>
          <CTA className="w-full sm:w-auto" />
        </div>
        <ExampleCard />
      </div>
    </section>
  );
}

function AfterYouBook() {
  return (
    <section id="after-you-book" className={`scroll-mt-24 bg-roof-surface ${sec}`}>
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className={`mb-8 ${h2Class}`}>What happens after you book</h2>
        <ol>
          {AFTER_BOOKING.map((item, i) => (
            <li key={item} className="relative pb-8 pl-[60px]">
              <span aria-hidden="true" className={circle}>{i + 1}</span>
              {i < AFTER_BOOKING.length - 1 && <span aria-hidden="true" className={connectorV} />}
              <p className={`pt-1.5 ${bodyClass}`}>{item}</p>
            </li>
          ))}
        </ol>
        <p className={`mt-2 font-semibold ${bodyClass}`}>Already booked? You're all set.</p>
        <CTA secondary className="mt-5 w-full sm:w-auto">Not booked yet? {CTA_LABEL}</CTA>
      </div>
    </section>
  );
}

function CheckList({ title, items, kind }) {
  const isFor = kind === 'check';
  return (
    <div className={`${card} p-8 shadow-sm`}>
      <h3 className="mb-5 flex items-center gap-3 text-[22px] font-bold leading-[1.2] text-roof-ink">
        <span className={isFor ? 'text-accent' : 'text-roof-muted'}>
          {isFor ? <Icon d="M5 13l4 4L19 7" /> : <Icon d="M6 6l12 12M18 6L6 18" />}
        </span>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-muted" />
            <span className={bodyClass}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WhoItsFor() {
  return (
    <section className={`bg-roof-paper ${sec}`}>
      <div className={wrap}>
        <h2 className={`mb-10 ${h2Class}`}>Who this is for</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <CheckList title="For" items={FOR_LIST} kind="check" />
          <CheckList title="Not for" items={NOT_FOR_LIST} kind="cross" />
        </div>
      </div>
    </section>
  );
}

function OneRoofer() {
  return (
    <section className={`border-y border-accent-border bg-accent-bg ${sec}`}>
      <div className={`${wrap} text-center`}>
        <div aria-hidden="true" className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-accent-dark shadow-sm">
          <Icon className="h-[26px] w-[26px]">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </Icon>
        </div>
        <h2 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] text-roof-ink [text-wrap:balance] md:text-[40px] lg:text-[48px]">
          One roofer per service area.
        </h2>
        <p className={`mx-auto mt-5 max-w-[640px] ${mutedClass}`}>
          We work with one roofing company in each service area. We won't set you up next to another Reboot roofer. Tell us your area when you book and we'll confirm it on your call.
        </p>
      </div>
    </section>
  );
}

function Founder() {
  return (
    <section className={`bg-roof-surface ${sec}`}>
      <div className="mx-auto max-w-[640px] px-5 text-center md:px-8">
        <div aria-hidden="true" className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-bg text-xl font-bold text-accent-dark">
          KR
        </div>
        <h2 className={`mb-5 ${h2Class}`}>Work with Kendall directly.</h2>
        <p className={`mb-4 ${mutedClass}`}>
          I'm Kendall. I run Reboot Media and I work each account personally. You deal with me directly.
        </p>
        <p className={bodyClass}>
          Email:{' '}
          <a href="mailto:hello@rebootmedia.us" className={`font-medium text-accent-dark underline underline-offset-4 hover:text-accent ${focusRing}`}>
            hello@rebootmedia.us
          </a>
        </p>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className={`bg-roof-paper ${sec}`}>
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className={`mb-8 ${h2Class}`}>Questions</h2>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-roof-border-subtle bg-roof-surface px-6 py-5">
              <summary className={`flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold leading-snug text-roof-ink [&::-webkit-details-marker]:hidden ${focusRing}`}>
                {f.q}
                <Icon className="h-5 w-5 shrink-0 text-roof-muted transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none" d="M6 9l6 6 6-6" />
              </summary>
              <p className={`mt-2 ${mutedClass}`}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section className={`bg-roof-surface ${sec}`}>
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <h2 className={`mb-4 text-center ${h2Class}`}>Book your strategy call</h2>
        <p className={`mb-2 text-center ${mutedClass}`}>Answer a few questions about your company. Then pick a time.</p>
        <div className="mb-6 text-center">
          <TextLink href="#after-you-book">Already booked? See what happens next</TextLink>
        </div>
        <div className="mx-auto max-w-[560px] rounded-3xl border border-roof-border-subtle bg-roof-surface p-6 shadow-md md:p-8 [&_#prequal-form]:scroll-mt-24">
          <PreQualForm />
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
        <AfterYouBook />
        <WhoItsFor />
        <OneRoofer />
        <Founder />
        <Faq />
        <FormSection />
      </main>
      <Footer />
    </div>
  );
}
