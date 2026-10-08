import { useEffect } from 'react';
import { Footer, Icon, Logo, bodyClass, card, col, h2Class, mutedClass, sec, wrap } from './App.jsx';
import { captureAttribution, initAnalytics, trackEvent } from './roofers/tracking.js';

// Paste the Loom share link here (or set VITE_PRECALL_LOOM_URL in Cloudflare).
// Share links (loom.com/share/ID) are converted to the embed URL automatically.
const PRECALL_LOOM_URL =
  import.meta.env.VITE_PRECALL_LOOM_URL || 'https://www.loom.com/share/e0f206d73084443cb645fb6cd66fb463';

function loomEmbed(url) {
  // Browsers only allow autoplay when the video starts muted.
  const embed = url.replace('loom.com/share/', 'loom.com/embed/');
  return `${embed}${embed.includes('?') ? '&' : '?'}autoplay=1&muted=1`;
}

const STEPS = [
  { title: 'Accept the calendar invite', text: 'It just landed in your email. Accepting it holds your time.' },
  { title: 'Reply WATCHED to our text', text: "Once you've seen the video, reply WATCHED to the text we sent you, so we know you're ready." },
];

const ON_THE_CALL = [
  'A deep dive on your company and where your best jobs come from today.',
  "An audit of your online presence and how you're bringing in revenue right now.",
  'Your goals: the jobs you want more of and the areas you want to cover.',
  'A plan built for your company, based on those goals and where you want to take it.',
  "Whether you qualify. If you do, we'll show you how we'd reboot your company. If you don't, we'll tell you straight.",
];

const BRING = [
  'Roughly how many jobs you sign in a month',
  "What you spend on marketing now, and what's working",
  'The service area you want to grow in',
  'Anyone else who makes the call with you',
];

const PHASES = [
  { name: 'We learn your company', text: "We keep what's working, cut what's costing you money, and build the plan around the jobs and area you want." },
  { name: 'We install the system', text: 'Homeowners already looking for roof help find you, and every one is pre-qualified before they book.' },
  { name: 'It gets better every month', text: 'Every week you see which appointments turned into signed jobs. The system learns from that and keeps improving.' },
];

function LoomVideo() {
  return (
    <div className="aspect-video overflow-hidden rounded-[20px] bg-accent-bg shadow-lift ring-8 ring-white">
      {PRECALL_LOOM_URL ? (
        <iframe
          src={loomEmbed(PRECALL_LOOM_URL)}
          title="Before your call"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-center text-[17px] text-roof-muted">
          Your walkthrough video is on its way.
        </div>
      )}
    </div>
  );
}

function Check() {
  return <Icon d="M20 6 9 17l-5-5" className="mt-[5px] h-5 w-5 shrink-0 text-accent" />;
}

export default function BeforeCall() {
  useEffect(() => {
    document.title = 'Before your call | Reboot Media';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    captureAttribution();
    initAnalytics();
    trackEvent('precall_page_view');
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
        <section data-section="precall_video" className="bg-[linear-gradient(180deg,theme(colors.accent.bg)_0%,white_62%)] pb-14 pt-10 md:pb-20 md:pt-20">
          <div className={`${wrap} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16`}>
            <div>
              <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">You're booked</p>
              <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">
                Watch this before your call.
              </h1>
              <p className="mt-5 max-w-[34rem] text-[18px] leading-[1.65] text-roof-muted md:text-[19px]">
                A short walkthrough of how we work, so we can spend the call on your company instead of explaining ours.
              </p>
            </div>
            <LoomVideo />
          </div>
        </section>

        <section data-section="precall_steps" className={`bg-roof-surface ${sec} lg:py-20`}>
          <div className={wrap}>
            <h2 className={h2Class}>Two quick things</h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className={`${card} p-6 md:p-7`}>
                  <span className="mb-3 block text-lg font-bold text-accent">{i + 1}</span>
                  <h3 className="mb-2 text-[20px] font-bold leading-[1.2] text-roof-ink">{s.title}</h3>
                  <p className={mutedClass}>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section data-section="precall_agenda" className={`bg-roof-surface pb-14 md:pb-20`}>
          <div className={`${wrap} grid gap-10 md:grid-cols-2 md:gap-12`}>
            <div>
              <h2 className={`mb-6 ${h2Class}`}>What we'll cover</h2>
              <ul className="space-y-4">
                {ON_THE_CALL.map((t) => (
                  <li key={t} className={`flex gap-3 ${bodyClass}`}>
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={`mb-6 ${h2Class}`}>Have these handy</h2>
              <ul className="space-y-4">
                {BRING.map((t) => (
                  <li key={t} className={`flex gap-3 ${bodyClass}`}>
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section data-section="precall_how" className={`bg-[linear-gradient(0deg,theme(colors.accent.bg)_0%,white_70%)] ${sec} lg:py-20`}>
          <div className={wrap}>
            <div className={col}>
              <h2 className={h2Class}>How we work</h2>
            </div>
            <ol className="mt-8 grid gap-8 md:mt-10 md:grid-cols-3 md:gap-10">
              {PHASES.map((p, i) => (
                <li key={p.name}>
                  <span className="mb-3 block text-lg font-bold text-accent">{i + 1}</span>
                  <h3 className="mb-2.5 text-[20px] font-bold leading-[1.2] text-roof-ink">{p.name}</h3>
                  <p className={mutedClass}>{p.text}</p>
                </li>
              ))}
            </ol>
            <p className={`mt-12 ${mutedClass}`}>Need to reschedule? Use the link in your calendar invite.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
