import { useEffect } from 'react';
import { BOOK_LINK, Footer, Logo, VISIBILITY_LINK, card, col, h2Class, mutedClass, sec, wrap } from './App.jsx';
import { captureAttribution, initAnalytics, trackEvent } from './roofers/tracking.js';

// The objections roofers raise on our calls, phrased the way they ask them
// (/mnt/project-files/seo/roofer-language-mining.md), with straight answers.
// Keep answers true to the offer: no price, no guarantee, no client names.

export const QUESTIONS_PATH = '/roofing-marketing-questions';

export const OBJECTIONS = [
  {
    q: 'I get calls from marketing companies every day. What makes you different?',
    a: 'We only work with roofing companies, and only one per service area. We run ads in your company’s name on an ad account you own. Homeowners answer a few questions before they book, so you know the job before you get there. Every week you see which appointments turned into signed jobs.',
  },
  {
    q: 'Are these shared leads?',
    a: 'No. Every homeowner who books is booking with you. Shared leads go to several roofers at once, so the first one to call wins and everyone else fights on price.',
  },
  {
    q: 'Is this lead gen, telemarketing, or are you selling ads?',
    a: 'We build and run ads in your company’s name. There’s no call center and we don’t resell homeowners. Homeowners who need a roofer answer a few questions and book straight onto your calendar.',
  },
  {
    q: 'I don’t pay for leads.',
    a: 'You wouldn’t be buying leads from us. The ads run in your name, the account is yours, and the homeowners who book are yours. We build and run the system that gets them onto your calendar.',
  },
  {
    q: 'How much does it cost?',
    a: 'It depends on your area and how many signed jobs you want each month. On the call we work it out from your own numbers, like your average job size and how many inspections you close.',
  },
  {
    q: 'I’ve tried this before and got the same result every time.',
    a: 'Fair. Ask any company what it reports. Clicks and calls are easy to grow. We report signed jobs every week, and the ad account is yours, so you can check every number yourself.',
  },
  {
    q: 'What if I show up and the homeowner isn’t there?',
    a: 'We install this into your online presence. Homeowners answer a few questions about their roof, then pick their own time to meet you. All you have to do is call or text to confirm the appointment. By the time you show up, they’ve already chosen you, and you’ve seen their answers.',
  },
  {
    q: 'I want replacements, not repairs.',
    a: 'Tell us on the call. We build a tailor-made plan for your company around your goals: the work you want, how we’ll get it, and what it takes to hit that goal. You pick the jobs, we make it work.',
  },
  {
    q: 'Work dries up after storm season. Does this help?',
    a: 'That’s the point of it. Storms bring a rush, then crews sit. Ads in your area keep homeowners booking in the quiet months too.',
  },
  {
    q: 'Do you work with my competitors?',
    a: 'No. One roofer per service area. If your area is open, it’s yours.',
  },
  {
    q: 'Who owns the ad account?',
    a: 'You do. The history and the results stay with your company.',
  },
  {
    q: 'Am I locked into a long contract?',
    a: 'No. We start with 90 days, then it’s month to month.',
  },
];

const linkClass = 'font-semibold text-accent-dark underline underline-offset-4 hover:text-accent';

export default function Questions() {
  useEffect(() => {
    captureAttribution();
    initAnalytics();
    trackEvent('questions_view');
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-roof-surface font-sans text-[17px] text-roof-ink antialiased">
      <header className="border-b border-roof-border-subtle bg-white">
        <div className={`${wrap} flex min-h-[72px] items-center gap-2`}>
          <a href="/" className="flex items-center gap-2 whitespace-nowrap">
            <Logo />
            <span className="text-base font-bold tracking-tight text-roof-ink">Reboot Media</span>
          </a>
        </div>
      </header>
      <main>
        <article className={`bg-white ${sec} pt-10 md:pt-20`}>
          <div className={wrap}>
            <div className="max-w-[760px]">
              <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">For roofing company owners</p>
              <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">
                What roofers ask before hiring a marketing company
              </h1>
              <p className={`mt-5 ${mutedClass}`}>
                These are the questions roofing company owners ask us on calls, in their words. Here are our straight answers.
              </p>

              <div className="mt-10 grid gap-5">
                {OBJECTIONS.map((o) => (
                  <section key={o.q} className={`${card} p-6 md:p-8`}>
                    <h2 className="text-[21px] font-bold leading-[1.3] md:text-[23px]">{o.q}</h2>
                    <p className="mt-3 text-[17px] leading-[1.65] md:text-[18px]">{o.a}</p>
                  </section>
                ))}
              </div>

              <div className={`mt-14 ${col}`}>
                <h2 className={h2Class}>Still have a question?</h2>
                <p className={`mt-5 ${mutedClass}`}>
                  <a href={BOOK_LINK.href} className={linkClass}>Book a strategy call</a> or{' '}
                  <a href={VISIBILITY_LINK.href} className={linkClass}>get a free Visibility Check</a> to see where your company shows up today.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer links={[BOOK_LINK, VISIBILITY_LINK, { href: '/roofing-marketing-agency', label: 'Roofing Marketing Agency' }]} />
    </div>
  );
}
