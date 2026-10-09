import { useEffect } from 'react';
import { BOOK_LINK, Footer, Icon, Logo, SocialLinks, VISIBILITY_LINK, card, col, h2Class, mutedClass, sec, wrap } from './App.jsx';
import { captureAttribution, initAnalytics, trackEvent } from './roofers/tracking.js';

// Nationwide and Texas pages for "roofing marketing agency" and "roofing
// marketing company Texas" searches. Copy approved by K 2026-10-09 (draft:
// /mnt/project-files/seo/location-pages-draft.md). The Texas quotes are from
// our own cold calls, shown without names.

export const NATIONWIDE_PATH = '/roofing-marketing-agency';
export const TEXAS_PATH = '/texas-roofing-marketing';
const COMPARE_PATH = '/roofing-marketing-companies';

export const LOCATION_PAGES = {
  [NATIONWIDE_PATH]: {
    event: 'nationwide_view',
    eyebrow: 'Roofing companies across the U.S.',
    h1: 'A roofing marketing agency built around signed jobs',
    intro: [
      'Most roofing company owners don’t need more clicks or more “leads.” They need homeowners who actually want a roofer, booked onto the calendar, so the crew stays busy every month and not just after a storm.',
      'That’s the only thing we do. We work with roofing companies only, anywhere in the U.S.',
    ],
    sections: [
      {
        title: 'How it works',
        steps: [
          ['Audit.', 'We look at how your company shows up today, keep what’s working and cut what isn’t.'],
          ['Reboot.', 'We build and run ads in your company’s name, on an account you own. Homeowners in your area answer a few questions, then book straight onto your calendar.'],
          ['Compound.', 'Every week you see which appointments turned into signed jobs, and we put more behind what’s working.'],
        ],
      },
      {
        title: 'What’s different',
        checks: [
          ['One roofer per service area.', 'We don’t work with your competitors in the same area.'],
          ['Not shared leads.', 'Every homeowner who books is booking with you, not five roofers at once.'],
          ['You own the ad account.', 'The history and results stay with your company.'],
          ['We report signed jobs.', 'Not just clicks or calls.'],
          ['90 days to start, then month to month.', ''],
        ],
      },
      {
        title: 'Who it’s for',
        text: 'Residential roofing companies that answer the phone, show up to inspections, and want a steady month. We also work with companies scaling into new markets and with commercial roofers who want more bid requests.',
      },
      {
        title: 'Where we work',
        text: 'We’re based in Austin, Texas and work with roofing companies across the United States.',
        link: { href: TEXAS_PATH, label: 'Roofing marketing in Texas' },
      },
    ],
    links: [
      { href: VISIBILITY_LINK.href, label: 'Get a free Visibility Check' },
      { href: COMPARE_PATH, label: 'How roofing marketing companies compare' },
    ],
    faqs: [
      { q: 'Do you only work with roofers?', a: 'Yes. Roofing companies only.' },
      { q: 'Do you work with my competitors?', a: 'No. One roofer per service area.' },
      { q: 'Who owns the ad account?', a: 'You do.' },
      { q: 'Am I locked into a long contract?', a: 'No. We start with 90 days, then it’s month to month.' },
      { q: 'What does it cost?', a: 'It depends on your area and goals. We go over it on the call.' },
    ],
  },
  [TEXAS_PATH]: {
    event: 'texas_view',
    eyebrow: 'Based in Austin, Texas',
    h1: 'Roofing marketing for Texas roofing companies',
    intro: [
      'We’re based in Austin, so Texas is home. Hail and wind seasons here bring a rush of calls, then quiet months where crews sit. Our job is to keep the calendar full in between.',
    ],
    sections: [
      {
        title: 'What Texas roofers tell us',
        text: 'These are lines from our own calls with Texas roofing companies:',
        quotes: [
          'We’re getting contacted by multiple agencies on a daily basis.',
          'Roofing is hard here. It’s all cash deals now in East Texas, very little insurance claim.',
          'I’d rather be doing more roofing.',
        ],
        after: 'So we skip the pitch and show you, before any call, where your company shows up today and who homeowners find first.',
      },
      {
        title: 'How it works in Texas',
        text: 'Same system as everywhere: ads in your company’s name, homeowners in your service area answer a few questions and book onto your calendar, and every week you see which appointments turned into signed jobs. One roofer per service area, so if your area is open, it’s yours.',
        link: { href: NATIONWIDE_PATH, label: 'How our roofing marketing works' },
      },
      {
        title: 'Areas we cover in Texas',
        text: 'Austin, Round Rock, Georgetown, San Marcos, San Antonio, New Braunfels, Dallas, Fort Worth, Plano, Frisco, Houston, The Woodlands, Katy, Sugar Land, Waco, Killeen, College Station, and the rest of the state.',
      },
    ],
    links: [{ href: VISIBILITY_LINK.href, label: 'Get a free Visibility Check for your Texas city' }],
    faqs: [
      { q: 'Are you actually in Texas?', a: 'Yes, we’re based in Austin.' },
      { q: 'Is my area taken?', a: 'Tell us your service area when you book and we’ll check before the call.' },
      { q: 'Do you only do storm work?', a: 'No. The point is steady months, not only storm months.' },
    ],
  },
};

const linkClass = 'font-semibold text-accent-dark underline underline-offset-4 hover:text-accent';
const bodyText = 'text-[17px] leading-[1.65] md:text-[18px]';

export default function LocationPage({ path = window.location.pathname }) {
  const page = LOCATION_PAGES[path.replace(/\/+$/, '')];

  useEffect(() => {
    captureAttribution();
    initAnalytics();
    trackEvent(page.event);
  }, [page]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-roof-surface font-sans text-[17px] text-roof-ink antialiased">
      <header className="border-b border-roof-border-subtle bg-white">
        <div className={`${wrap} flex min-h-[72px] items-center gap-2`}>
          <a href="/" className="flex items-center gap-2 whitespace-nowrap">
            <Logo />
            <span className="text-base font-bold tracking-tight text-roof-ink">Reboot Media</span>
          </a>
          <SocialLinks location="header" className="ml-auto" />
        </div>
      </header>
      <main>
        <article className={`bg-white ${sec} pt-10 md:pt-20`}>
          <div className={wrap}>
            <div className="max-w-[760px]">
              <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">{page.eyebrow}</p>
              <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">{page.h1}</h1>
              {page.intro.map((t) => (
                <p key={t} className={`mt-5 ${mutedClass}`}>{t}</p>
              ))}
              <p className="mt-8">
                <a href={BOOK_LINK.href} className="inline-flex h-14 items-center justify-center rounded-[14px] bg-accent px-6 text-[17px] font-semibold text-white hover:bg-accent-dark">
                  {BOOK_LINK.label}
                </a>
              </p>

              {page.sections.map((s) => (
                <section key={s.title} className="mt-14">
                  <h2 className={h2Class}>{s.title}</h2>
                  {s.text && <p className={`mt-5 ${bodyText}`}>{s.text}</p>}
                  {s.steps && (
                    <ol className="mt-6 grid gap-4">
                      {s.steps.map(([b, t], i) => (
                        <li key={b} className={`${card} p-5 md:p-6 ${bodyText}`}>
                          <strong>{i + 1}. {b}</strong> {t}
                        </li>
                      ))}
                    </ol>
                  )}
                  {s.checks && (
                    <ul className="mt-6 space-y-4">
                      {s.checks.map(([b, t]) => (
                        <li key={b} className={`flex gap-3 ${bodyText}`}>
                          <Icon d="M20 6 9 17l-5-5" className="mt-[5px] h-5 w-5 shrink-0 text-accent" />
                          <span><strong>{b}</strong> {t}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.quotes && (
                    <div className="mt-6 grid gap-4">
                      {s.quotes.map((q) => (
                        <blockquote key={q} className={`border-l-4 border-accent pl-4 italic ${bodyText}`}>“{q}”</blockquote>
                      ))}
                    </div>
                  )}
                  {s.after && <p className={`mt-6 ${bodyText}`}>{s.after}</p>}
                  {s.link && (
                    <p className="mt-4">
                      <a href={s.link.href} className={linkClass}>{s.link.label}</a>
                    </p>
                  )}
                </section>
              ))}

              <section className="mt-14">
                <h2 className={h2Class}>Common questions</h2>
                <dl className="mt-6 grid gap-5">
                  {page.faqs.map((f) => (
                    <div key={f.q}>
                      <dt className="text-[19px] font-bold">{f.q}</dt>
                      <dd className={`mt-1 ${mutedClass}`}>{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <div className={`mt-14 ${col}`}>
                <p className={mutedClass}>
                  <a href={BOOK_LINK.href} className={linkClass}>Book a strategy call</a>
                  {page.links.map((l) => (
                    <span key={l.href}>
                      {' · '}
                      <a href={l.href} className={linkClass}>{l.label}</a>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer links={[BOOK_LINK, VISIBILITY_LINK]} />
    </div>
  );
}
