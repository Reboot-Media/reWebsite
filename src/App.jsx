import { useEffect } from 'react';
import HeroVideo from './HeroVideo.jsx';
import PreQualForm from './roofers/PreQualForm.jsx';
import { captureAttribution, initAnalytics, trackEvent } from './roofers/tracking.js';
import { segmentForPath } from './segments.js';

const LINKEDIN_URL = 'https://www.linkedin.com/company/rebootmedia-io/';
const INSTAGRAM_URL = 'https://www.instagram.com/rebootmedia_';
const CTA_LABEL = 'Book a Strategy Call';
export const VISIBILITY_CHECK_PATH = '/visibility-check';

const PHASES = [
  { name: 'Audit', text: "We do a full audit of your online presence to find what's working and what's not. We keep what's working and remove what's not." },
  { name: 'Reboot', text: "We set up your ads and install a storm tracker that watches your area for you. You're live in 2 business days." },
  { name: 'Compound', text: 'The system learns which calls turn into booked jobs, so results compound every month.' },
];

export const FAQS = [
  {
    q: 'Is this a lead-sharing or lead-gen service?',
    a: "Fair question. Most of what's out there is shared leads. Not this. In the Reboot phase we set up ads in your company's name, so every homeowner who calls is calling you, and nobody else gets them.",
  },
  {
    q: "We've tried ads before and the ROI wasn't there. Why would this be different?",
    a: "You're right, most ad setups don't pay. They chase clicks, not signed jobs. That's why we start with the Audit: we find what was wasting money and cut it before anything new goes live. Then in Compound, the system learns which calls turn into signed jobs and puts more behind them.",
  },
  {
    q: 'Do you work with my competitors?',
    a: "Smart to ask, because plenty of agencies do. We don't. We work with one roofer per service area. In the Audit you pick that area and the work you want more of, and the ads stay pointed there.",
  },
  {
    q: 'Who owns the ad account?',
    a: "You do. The ads run in your company's name on an account you own, so the history and the results stay with you.",
  },
  {
    q: 'Am I locked into a long contract?',
    a: "No. We start with 90 days so the system has time to set up and prove itself. After that it's month to month.",
  },
  {
    q: 'What does it cost?',
    a: "Makes sense to want the number first. It depends on your area and your goals, and that's what the Audit sorts out. We go over pricing on the call, once we know what you need.",
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
  ['Roof age', '~12 years'],
  ['Insurance', 'Not filed yet'],
  ['Their note', '"Shingles came off the back slope after the wind."'],
];

export const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
export const h2Class = 'text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-roof-ink [text-wrap:balance] md:text-[40px] lg:text-[44px]';
export const bodyClass = 'text-[17px] leading-[1.65] text-roof-ink md:text-[18px]';
export const mutedClass = 'text-[17px] leading-[1.65] text-roof-muted md:text-[18px]';
export const wrap = 'mx-auto max-w-[1120px] px-5 md:px-8';
export const sec = 'py-14 md:py-20 lg:py-32';
export const card = 'rounded-[20px] bg-roof-surface ring-1 ring-roof-border-subtle';

export function Logo({ className = 'h-7 w-7' }) {
  return <img src="/logo.png" alt="Reboot Media logo" className={className} />;
}

function IconLinkedIn({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconInstagram({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SOCIALS = [
  { network: 'instagram', href: INSTAGRAM_URL, label: 'Reboot Media on Instagram', Icon: IconInstagram },
  { network: 'linkedin', href: LINKEDIN_URL, label: 'Reboot Media on LinkedIn', Icon: IconLinkedIn },
];

// Proof of life for cold visitors: our socials, visible at the top of every page.
export function SocialLinks({ location, className = '' }) {
  return (
    <span className={`flex shrink-0 items-center ${className}`}>
      {SOCIALS.map(({ network, href, label, Icon: SocialIcon }) => (
        <a
          key={network}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          onClick={() => trackEvent('social_click', { network, location })}
          className={`inline-flex h-10 w-8 items-center justify-center rounded-lg text-roof-muted transition-colors hover:text-accent sm:w-10 ${focusRing}`}
        >
          <SocialIcon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
        </a>
      ))}
    </span>
  );
}

export function Icon({ d, className = 'h-6 w-6', children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d ? <path d={d} /> : children}
    </svg>
  );
}

export const btnBase = `inline-flex items-center justify-center font-semibold transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none ${focusRing}`;

function CTA({ children = CTA_LABEL, small = false, className = '', location = 'body' }) {
  const look = 'bg-accent text-white hover:bg-accent-dark';
  const size = small ? 'h-12 rounded-xl px-3.5 text-[15px] md:px-5 md:text-base' : 'h-14 rounded-[14px] px-7 text-[17px]';
  return (
    <a href="#prequal-form" onClick={() => trackEvent('cta_click', { location })} className={`${btnBase} ${size} ${look} ${className}`}>
      {children}
    </a>
  );
}

export const col = 'max-w-[640px]';

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-roof-border-subtle bg-white/80 backdrop-blur-md">
      <div className={`${wrap} flex min-h-[72px] items-center justify-between gap-2 sm:gap-3`}>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Logo />
          <span className="text-base font-bold tracking-tight text-roof-ink">Reboot Media</span>
        </span>
        <SocialLinks location="header" className="ml-auto hidden sm:flex" />
        <CTA small location="header" className="whitespace-nowrap">
          <span className="sm:hidden">Book a Call</span>
          <span className="hidden sm:inline">{CTA_LABEL}</span>
        </CTA>
      </div>
    </header>
  );
}

function FounderVideo({ video }) {
  return (
    <figure className="w-full">
      <HeroVideo {...video} />
      {/* On phones the header stays clean, so the socials live under the video. */}
      <figcaption className="mt-2 flex justify-center sm:hidden">
        <SocialLinks location="hero" />
      </figcaption>
    </figure>
  );
}

export function VisibilityCheckLink({ className = '', location }) {
  return (
    <a
      href={VISIBILITY_CHECK_PATH}
      onClick={() => trackEvent('visibility_check_click', { location })}
      className={`inline-flex min-h-[44px] items-center text-[17px] font-semibold text-accent-dark underline underline-offset-4 hover:text-accent ${focusRing} ${className}`}
    >
      Not ready for a call? Get a free Visibility Check
    </a>
  );
}

function Hero({ segment }) {
  return (
    <section data-section="hero" className="relative overflow-hidden bg-[linear-gradient(180deg,theme(colors.accent.bg)_0%,white_62%)] pb-14 pt-10 md:pb-24 md:pt-24">
      <div className={`${wrap} relative grid gap-10 md:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16`}>
        <div>
          <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">{segment?.eyebrow || 'For residential roofing companies'}</p>
          <h1 className="text-[36px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[52px] lg:text-[56px] lg:leading-[1.04]">
            <span className="text-roof-ink">{segment?.headline || 'Consistent, signed roofing jobs. Every month.'}</span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-[18px] leading-[1.65] text-roof-muted md:text-[19px]">
            {segment?.subline || 'We build and run your ads, so homeowners in your area who need a roofer book straight onto your calendar.'}
          </p>
          <div className="mt-8">
            <CTA className="w-full sm:w-auto" location="hero" />
            <p className="mt-3 text-[17px] text-roof-muted">A few questions, then pick a time.</p>
            {(!segment || segment.sameAsHome) && <VisibilityCheckLink className="mt-4" location="hero" />}
          </div>
        </div>
        <FounderVideo video={segment?.video} />
      </div>
    </section>
  );
}

function Phases() {
  return (
    <section data-section="how_it_works" className={`bg-roof-surface ${sec}`}>
      <div className={wrap}>
        <h2 className={h2Class}>How it works</h2>
        <ol className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3 md:gap-10">
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

function ExampleCard({ segment }) {
  const booking = segment?.booking || SAMPLE_BOOKING;
  const rows = segment?.rows || EXAMPLE_ROWS;
  return (
    <div className={`${card} p-5 shadow-card md:p-7`}>
      <div className="mb-6 flex items-center gap-3.5 border-b border-roof-border-subtle pb-5">
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-bg text-[15px] font-bold text-accent-dark">
          {booking.initials}
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-bold leading-[1.3] text-roof-ink">{booking.name}</p>
          <p className="text-[15px] leading-[1.4] text-roof-muted">
            <span className="block">{booking.place}</span>
            <span className="block">{booking.phone}</span>
          </p>
        </div>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="mb-4">
            <dt className="text-xs font-semibold uppercase leading-[1.4] tracking-[0.08em] text-roof-muted">{k}</dt>
            <dd className="mt-0.5 text-[17px] font-semibold leading-[1.45] text-roof-ink">
              <ExampleValue label={k} value={v} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function KnowBeforeYouGo({ segment }) {
  return (
    <section data-section="know_before_you_go" className={`bg-roof-paper ${sec}`}>
      <div className={`${wrap} grid gap-10 md:gap-12 lg:grid-cols-2 lg:items-center lg:gap-[72px]`}>
        <div>
          <h2 className={`mb-5 ${h2Class}`}>{segment?.knowTitle || "Know who you're meeting before you go."}</h2>
          <p className={`${col} ${mutedClass}`}>
            {segment?.knowText || 'Homeowners answer a few questions before they book. You see what they need ahead of time.'}
          </p>
        </div>
        <ExampleCard segment={segment} />
      </div>
    </section>
  );
}

function WhoItsFor({ segment }) {
  return (
    <section data-section="who_its_for" className={`bg-roof-surface ${sec} pb-0`}>
      <div className={`${wrap}`}>
        <div className={col}>
          <h2 className={`mb-5 ${h2Class}`}>Is this a fit?</h2>
          <p className={mutedClass}>
            {segment?.fit || "It's for residential roofing companies that answer the phone and show up to the inspection. We work with one roofer per service area."}
          </p>
        </div>
      </div>
    </section>
  );
}

const CREDENTIALS = [
  'Marketing',
  'Construction',
  'Engineering',
];

function Team() {
  return (
    <section data-section="team" className={`bg-roof-surface ${sec}`}>
      <div className={`${wrap} grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16`}>
        <div aria-hidden="true" className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,theme(colors.accent.DEFAULT),theme(colors.accent.dark))] shadow-lift lg:h-28 lg:w-28">
          <img src="/logo.png" alt="Reboot Media logo" className="h-12 w-12 brightness-0 invert lg:h-14 lg:w-14" />
        </div>
        <div className={col}>
          <h2 className={`mb-5 ${h2Class}`}>Who we are</h2>
          <p className={`mb-5 ${mutedClass}`}>
            Reboot Media was founded by ex-Oracle AI engineer Kendall Reid. Based in Austin, Texas.
          </p>
          <p className={`mb-3 ${bodyClass}`}>Over 10 years of combined experience in:</p>
          <ul className="mb-6 space-y-3">
            {CREDENTIALS.map((c) => (
              <li key={c} className={`flex gap-3 ${bodyClass}`}>
                <Icon d="M20 6 9 17l-5-5" className="mt-[5px] h-5 w-5 shrink-0 text-accent" />
                {c}
              </li>
            ))}
          </ul>
          <p className={`mb-5 font-semibold ${bodyClass}`}>Built by people who write the code and know the trade.</p>
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

function Faq({ segment }) {
  return (
    <section data-section="faq" id="after-you-book" className={`scroll-mt-24 bg-roof-paper ${sec}`}>
      <div className={wrap}>
        <h2 className={`mb-8 md:mb-10 ${h2Class}`}>Questions</h2>
        <div className="grid items-start gap-3 md:grid-cols-2 md:gap-4">
          {(segment?.faqs || FAQS).map((f) => (
            <details
              key={f.q}
              onToggle={(e) => e.currentTarget.open && trackEvent('faq_open', { question: f.q })}
              className="group rounded-2xl bg-roof-surface px-5 py-4 ring-1 ring-roof-border-subtle open:shadow-card md:px-6 md:py-5"
            >
              <summary className={`flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold leading-snug text-roof-ink hover:text-accent-dark md:text-[18px] [&::-webkit-details-marker]:hidden ${focusRing}`}>
                {f.q}
                <Icon className="h-5 w-5 shrink-0 text-roof-muted transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none" d="M6 9l6 6 6-6" />
              </summary>
              <p className={`mt-2 ${mutedClass}`}>{f.a}</p>
            </details>
          ))}
        </div>
        {(!segment || segment.sameAsHome) && <VisibilityCheckLink className="mt-8" location="faq" />}
      </div>
    </section>
  );
}

function FormSection({ segment }) {
  return (
    <section data-section="book_call" className={`bg-[linear-gradient(0deg,theme(colors.accent.bg)_0%,white_70%)] ${sec}`}>
      <div className={wrap}>
        <div className={col}>
          <h2 className={`mb-4 ${h2Class}`}>Book your strategy call</h2>
          <p className={`mb-10 ${mutedClass}`}>A few questions, then pick a time.</p>
          <div className="w-full rounded-3xl bg-roof-surface p-6 shadow-lift ring-1 ring-roof-border-subtle md:p-8 [&_#prequal-form]:scroll-mt-24">
            <PreQualForm segment={segment} />
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer routes to the pages a roofer can act on, so every page links to them.
export const BOOK_LINK = { href: '/#prequal-form', label: 'Book a Strategy Call' };
export const VISIBILITY_LINK = { href: VISIBILITY_CHECK_PATH, label: 'Free Visibility Check' };
// Linked from /visibility-check, not the homepage (K 2026-10-09).
export const COMPARE_LINK = { href: '/roofing-marketing-companies', label: 'Roofing Marketing Companies Compared' };
export const FOOTER_LINKS = [
  BOOK_LINK,
  VISIBILITY_LINK,
  { href: '/roofing-marketing-agency', label: 'Roofing Marketing Agency' },
  { href: '/texas-roofing-marketing', label: 'Roofing Marketing in Texas' },
];

export function Footer({ links = [] }) {
  return (
    <footer className="border-t border-roof-border-subtle bg-roof-surface">
      {links.length > 0 && (
        <nav aria-label="Footer" className={`${wrap} flex flex-wrap gap-x-6 border-b border-roof-border-subtle py-4 text-[15px]`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`inline-flex min-h-[48px] items-center font-semibold text-roof-ink hover:text-accent-dark hover:underline ${focusRing}`}>
              {l.label}
            </a>
          ))}
        </nav>
      )}
      <div className={`${wrap} flex flex-col gap-2 py-10 text-[15px] text-roof-muted sm:flex-row sm:items-center sm:justify-between`}>
        <p>Reboot Media LLC · Austin, Texas</p>
        <a href="mailto:hello@rebootmedia.us" className={`inline-flex min-h-[48px] items-center hover:text-roof-ink hover:underline ${focusRing}`}>
          hello@rebootmedia.us
        </a>
        <div className="flex items-center gap-2">
          <a href="/privacy.html" className={`inline-flex min-h-[48px] items-center px-2 hover:text-roof-ink hover:underline ${focusRing}`}>
            Privacy
          </a>
          <SocialLinks location="footer" />
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}

export default function App({ path = window.location.pathname }) {
  const segment = segmentForPath(path.replace(/\/+$/, ''));

  useEffect(() => {
    if (segment) {
      // Cold email pages are for people we emailed, not for search.
      const robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'noindex';
      document.head.appendChild(robots);
    }
    captureAttribution();
    initAnalytics();
  }, [segment]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-roof-surface font-sans text-[17px] text-roof-ink antialiased">
      <Header />
      <main>
        <Hero segment={segment} />
        <Phases />
        <KnowBeforeYouGo segment={segment} />
        <WhoItsFor segment={segment} />
        <Team />
        <Faq segment={segment} />
        <FormSection segment={segment} />
      </main>
      <Footer links={!segment || segment.sameAsHome ? FOOTER_LINKS : [BOOK_LINK]} />
    </div>
  );
}
