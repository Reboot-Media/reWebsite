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
  {
    q: 'What does it cost?',
    a: 'It depends on your service area and what you want to take on. We set the numbers with you on the strategy call.',
  },
  {
    q: "I've worked with an agency before. How is this different?",
    a: "We're software engineers who know roofing, not a general agency. Phase one is an audit of what you have. We keep what works and remove what doesn't.",
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
const card = 'rounded-[20px] bg-roof-surface ring-1 ring-roof-border-subtle';
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
    ? 'bg-white text-roof-ink ring-1 ring-inset ring-roof-border-strong hover:bg-roof-paper'
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
    <figure className="w-full">
      <div className="aspect-video overflow-hidden rounded-[20px] bg-accent-bg shadow-lift ring-8 ring-white">
        <iframe
          src={FOUNDER_VIDEO_URL}
          title="How the three phases work"
          loading="lazy"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <figcaption className="mt-3.5 text-[15px] text-roof-muted">How the three phases work.</figcaption>
    </figure>
  );
}

function InspectionMock() {
  const label = 'text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.08em] text-roof-muted';
  const value = 'mt-0.5 text-[17px] font-semibold leading-[1.45] text-roof-ink';
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[360px] select-none lg:mr-0">
      <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(closest-side,rgba(124,58,237,0.16),transparent)]" />
      <div className="absolute inset-x-6 -bottom-4 h-full rounded-[20px] bg-white p-4 shadow-card ring-1 ring-roof-border-subtle">
        <div className="h-2 w-2/3 rounded-full bg-roof-border-subtle" />
        <div className="mt-2 h-2 w-1/3 rounded-full bg-roof-border-subtle" />
      </div>
      <div className="relative rounded-[28px] bg-white p-3 shadow-lift ring-1 ring-roof-border-subtle">
        <div className="rounded-[16px] bg-roof-paper p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <span className="text-[15px] font-semibold text-roof-ink">Reboot</span>
            <span className="ml-auto text-[15px] text-roof-muted">now</span>
          </div>
          <div className="mt-3 rounded-xl bg-white p-4 shadow-card ring-1 ring-roof-border-subtle">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
              <span className="text-[17px] font-semibold text-roof-ink">New inspection booked</span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <div className={label}>Needs</div>
                <div className={value}>
                  <span className="inline-block rounded-full bg-accent-bg px-3 py-0.5 text-accent-dark">Storm damage</span>
                </div>
              </div>
              <div>
                <div className={label}>Insurance claim</div>
                <div className={value}>Started</div>
              </div>
              <div>
                <div className={label}>Inspection</div>
                <div className={value}>Thursday morning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const hasVideo = Boolean(FOUNDER_VIDEO_URL);
  const cols = hasVideo ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]' : 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]';
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,theme(colors.accent.bg)_0%,white_62%)] pb-[72px] pt-12 md:pb-24 md:pt-24">
      <div aria-hidden="true" className="hero-dots pointer-events-none absolute inset-0" />
      <div className={`${wrap} relative grid gap-12 lg:items-center lg:gap-16 ${cols}`}>
        <div>
        <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">For residential roofing companies</p>
        <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[52px] lg:text-[56px] lg:leading-[1.04]">
          <span className="block text-roof-ink">Add more qualified roof inspections.</span>{' '}
          <span className="block text-accent-dark">Know what each homeowner needs before you go.</span>
        </h1>
        <p className="mt-5 max-w-[34rem] text-[18px] leading-[1.65] text-roof-muted md:text-[19px]">
          Reboot installs the system that turns homeowners who need a roof into booked inspections. Live in 2 business days.
        </p>
        <p className="mt-3 max-w-[34rem] text-[18px] font-medium leading-[1.65] text-roof-ink md:text-[19px]">
          All you have to do is answer the phone and show up to the inspection.
        </p>
        <div className="mt-8">
          <CTA className="w-full sm:w-auto" />
          <p className="mt-3 text-[17px] text-roof-muted">Answer a few questions, then pick a time.</p>
          <TextLink href="#after-you-book" className="sm:hidden">
            Already booked? See what happens next
          </TextLink>
        </div>
        </div>
        {hasVideo ? <FounderVideo /> : <InspectionMock />}
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
        <div className="mt-12 flex flex-col gap-5 border-t border-roof-border-subtle pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className={`font-semibold ${bodyClass}`}>Built by a team with 10 years of combined experience.</p>
          <CTA className="w-full sm:w-auto" />
        </div>
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
    <div className={`${card} p-7 shadow-lift`}>
      <span className="mb-5 inline-block rounded-full bg-accent-bg px-2.5 py-1 text-xs font-bold uppercase leading-[1.4] tracking-[0.12em] text-accent-dark">
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
      <p className="mt-5 text-[15px] text-roof-muted">Sample for illustration. Not a real homeowner.</p>
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
      <div className={`${wrap} grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16`}>
        <h2 className={`${h2Class} lg:sticky lg:top-28 lg:self-start`}>What happens after you book</h2>
        <div>
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
      </div>
    </section>
  );
}

function CheckList({ title, items, kind }) {
  const isFor = kind === 'check';
  const surface = isFor ? 'shadow-card' : 'bg-transparent';
  return (
    <div className={`${card} p-8 ${surface}`}>
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
    <section className={`bg-roof-surface ${sec}`}>
      <div className={wrap}>
        <div className="relative overflow-hidden rounded-[32px] bg-accent-bg px-6 py-12 ring-1 ring-accent-border md:px-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-dots pointer-events-none absolute inset-0" />
          <div className="relative">
            <div aria-hidden="true" className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white text-accent-dark shadow-card">
              <Icon className="h-[26px] w-[26px]">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </Icon>
            </div>
            <h2 className={h2Class}>One roofer per service area.</h2>
          </div>
          <p className={`relative mt-5 max-w-[640px] lg:mt-0 ${mutedClass}`}>
            We work with one roofing company in each service area. We won't set you up next to another Reboot roofer. Tell us your area when you book and we'll confirm it on your call.
          </p>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className={`bg-roof-paper ${sec}`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16`}>
        <div aria-hidden="true" className="flex h-32 w-32 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,theme(colors.accent.DEFAULT),theme(colors.accent.dark))] shadow-lift lg:h-44 lg:w-44">
          <img src="/logo.png" alt="" className="h-16 w-16 brightness-0 invert lg:h-20 lg:w-20" />
        </div>
        <div className="max-w-[640px]">
        <h2 className={`mb-5 ${h2Class}`}>Software engineers who know roofing.</h2>
        <p className={`mb-4 ${mutedClass}`}>
          Our team brings 10 years of combined experience, including software engineering. We know how a roofing company runs, from storm season to the sales call. You talk to the people who build your system.
        </p>
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
    <section className={`bg-roof-surface ${sec}`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16`}>
        <h2 className={`${h2Class} lg:sticky lg:top-28 lg:self-start`}>Questions</h2>
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
    </section>
  );
}

function FormSection() {
  return (
    <section className={`bg-[linear-gradient(0deg,theme(colors.accent.bg)_0%,white_70%)] ${sec}`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-start lg:gap-16`}>
        <div>
          <h2 className={`mb-4 ${h2Class}`}>Book your strategy call</h2>
          <p className={`mb-2 ${mutedClass}`}>Answer a few questions about your company. Then pick a time.</p>
          <div>
            <TextLink href="#after-you-book">Already booked? See what happens next</TextLink>
          </div>
        </div>
        <div className="w-full rounded-3xl bg-roof-surface p-6 shadow-lift ring-1 ring-roof-border-subtle md:p-8 [&_#prequal-form]:scroll-mt-24">
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
        <Team />
        <Faq />
        <FormSection />
      </main>
      <Footer />
    </div>
  );
}
