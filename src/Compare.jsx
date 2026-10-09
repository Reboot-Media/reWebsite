import { useEffect } from 'react';
import { BOOK_LINK, Footer, Logo, SocialLinks, VISIBILITY_LINK, card, col, h2Class, mutedClass, sec, wrap } from './App.jsx';
import { captureAttribution, initAnalytics, trackEvent } from './roofers/tracking.js';

// Comparison page for "best roofing marketing companies" searches. Every other
// company's line comes from its own website (read 2026-10-08); see
// /mnt/project-files/seo/comparison-page-draft.md. Keep it factual and neutral:
// no put-downs, no prices, no client names. Not linked from the homepage (K).

export const COMPARE_PATH = '/roofing-marketing-companies';

const QUESTIONS = [
  ['Do you work with my competitors?', 'Some companies take one roofer per area. Ask so you know where you stand.'],
  ['Who owns the ad account?', 'If it’s yours, the history and the results stay with you if you ever leave.'],
  ['Do you report signed jobs, or clicks?', 'Clicks are easy to grow. Signed jobs are the number that pays you.'],
  ['Are these shared leads?', 'Shared leads go to several roofers at once, and you end up competing on price.'],
  ['What are the contract terms?', 'Ask what happens after the first term and what it takes to stop.'],
];

export const COMPANIES = [
  {
    name: 'Reboot Media',
    meta: 'Austin, Texas · roofing companies only',
    text: 'We build and run ads in your company’s name, and you own the ad account. Homeowners in your area who need a roofer answer a few questions, then book straight onto your calendar, so you know the job before you get there. One roofer per service area. Every week you see which appointments turned into signed jobs. We start with 90 days, then go month to month.',
    fit: 'you answer the phone, show up to inspections, and want a steady month instead of waiting on storms.',
  },
  {
    name: 'Hook Agency',
    meta: 'Roofing and home service contractors',
    text: 'Offers SEO, paid ads, custom websites and content for roofing companies. Its roofing page makes the case for “exclusive leads that you own” by owning your marketing and turning your website into a lead source.',
    fit: 'you want a long-term website and search program.',
  },
  {
    name: 'CI Web Group',
    meta: 'Since 2006 · home services and trades, with a roofing program',
    text: 'Describes itself as an “AI-first roofing marketing company for storm-responsive websites, local SEO, AI-search visibility, inspections, and replacement demand.” States no long-term contracts (month to month) and that you own your site, domain and data.',
    fit: 'storm response and your website are the priority.',
  },
  {
    name: 'Roofing Webmasters',
    meta: 'Roofing companies only',
    text: 'A roofing SEO company that says it works “exclusively with roofing companies” and focuses on showing up in search and AI answers. After the website build it moves to a month-to-month fee.',
    fit: 'you want organic search to be your main source of calls.',
  },
  {
    name: 'Blue Corona',
    meta: 'Contractors across the U.S., including roofing',
    text: 'Markets itself as a roofer marketing agency “that drives leads, booked jobs, and grows your revenue.” States no long-term contracts and that you own 100% of the website it builds.',
    fit: 'you run several home services and want one agency for all of them.',
  },
  {
    name: 'WebFX',
    meta: 'Large agency serving many industries',
    text: 'Its roofing page focuses on booking “more repair and replacement jobs,” and its page title cites “$73M+ in revenue” driven for roofing clients (the company’s own figure).',
    fit: 'you’re a larger or multi-location company that wants a big full-service team.',
  },
  {
    name: 'Thrive Internet Marketing Agency',
    meta: 'Since 2005 · many industries, offices in 25 cities',
    text: 'Offers roofing SEO, paid ads, social media and Nextdoor advertising.',
    fit: 'you want a broad channel mix from an established firm.',
  },
  {
    name: 'Profit Roofing Systems',
    meta: 'Roofing contractors',
    text: 'Focuses on helping roofers “dominate their local market” with a complete marketing package, and says it backs its lead generation system with a guarantee (terms agreed at the start, per its site).',
    fit: 'you want a guarantee structure spelled out up front.',
  },
];

const linkClass = 'font-semibold text-accent-dark underline underline-offset-4 hover:text-accent';

export default function Compare() {
  useEffect(() => {
    document.title = 'Roofing Marketing Companies Compared (2026) | Reboot Media';
    captureAttribution();
    initAnalytics();
    trackEvent('compare_view');
  }, []);

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
              <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">
                Roofing Marketing Companies Compared (2026)
              </h1>
              <p className={`mt-5 italic ${mutedClass}`}>
                Written by Reboot Media. We put ourselves first, so read it that way. Every other entry is based on what each company says on its own website as of October 2026.
              </p>
              <p className={`mt-5 ${mutedClass}`}>
                Most roofing company owners we talk to say the same thing: “I get a lot of these calls.” Here’s how the main companies differ, and what to ask before you sign with any of them.
              </p>

              <h2 className={`mt-14 ${h2Class}`}>What to ask any roofing marketing company</h2>
              <ol className="mt-6 space-y-4">
                {QUESTIONS.map(([q, a], i) => (
                  <li key={q} className="flex gap-3 text-[17px] leading-[1.6] md:text-[18px]">
                    <span className="w-6 shrink-0 font-bold text-accent">{i + 1}.</span>
                    <span>
                      <strong>{q}</strong> {a}
                    </span>
                  </li>
                ))}
              </ol>

              <h2 className={`mt-14 ${h2Class}`}>The companies</h2>
            </div>
            <ol className="mt-8 grid max-w-[760px] gap-5">
              {COMPANIES.map((c, i) => (
                <li key={c.name} className={`${card} p-6 md:p-8`}>
                  <h3 className="text-[22px] font-bold text-roof-ink">
                    {i + 1}. {c.name}
                  </h3>
                  <p className="mt-1 text-[15px] text-roof-muted">{c.meta}</p>
                  <p className="mt-4 text-[17px] leading-[1.65] md:text-[18px]">{c.text}</p>
                  <p className="mt-3 text-[17px] leading-[1.65] md:text-[18px]">
                    <em>Good fit if:</em> {c.fit}
                  </p>
                </li>
              ))}
            </ol>

            <div className={`mt-14 ${col}`}>
              <h2 className={h2Class}>Our take</h2>
              <p className={`mt-5 ${mutedClass}`}>
                Each of these is built for a different roofer. If you want your own website and search rankings to carry your company long term, an SEO-first company makes sense. If you want pre-qualified appointments booked onto your calendar, ads in your name, an account you own, and nobody else in your area getting the same homeowners, that’s what we do.
              </p>
              <p className={`mt-5 ${mutedClass}`}>
                <a href={BOOK_LINK.href} className={linkClass}>Book a strategy call</a> or{' '}
                <a href={VISIBILITY_LINK.href} className={linkClass}>get a free Visibility Check</a> to see where your company shows up today.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer links={[BOOK_LINK, VISIBILITY_LINK]} />
    </div>
  );
}
