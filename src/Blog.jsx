import { useEffect } from 'react';
import { BOOK_LINK, Footer, Logo, SocialLinks, VISIBILITY_LINK, card, col, h2Class, mutedClass, sec, wrap } from './App.jsx';
import { captureAttribution, initAnalytics, trackEvent } from './roofers/tracking.js';
import { BLOG_PATH, POSTS, postPath } from './posts.js';

export { BLOG_PATH, POSTS, POST_PATHS } from './posts.js';

const linkClass = 'font-semibold text-accent-dark underline underline-offset-4 hover:text-accent';
const bodyText = 'text-[17px] leading-[1.65] md:text-[18px]';
const formatDate = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function Shell({ children }) {
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
            <div className="max-w-[760px]">{children}</div>
          </div>
        </article>
      </main>
      <Footer links={[BOOK_LINK, VISIBILITY_LINK, { href: BLOG_PATH, label: 'Answers for Roofers' }]} />
    </div>
  );
}

function BlogIndex() {
  return (
    <Shell>
      <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">For roofing company owners</p>
      <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">Answers for roofing company owners</h1>
      <p className={`mt-5 ${mutedClass}`}>Straight answers to the questions roofers ask us about getting more signed jobs.</p>
      <div className="mt-10 grid gap-5">
        {POSTS.map((p) => (
          <a key={p.slug} href={postPath(p.slug)} className={`${card} block p-6 transition-colors hover:bg-white md:p-8`}>
            <h2 className="text-[21px] font-bold leading-[1.3] md:text-[23px]">{p.title}</h2>
            <p className={`mt-3 ${mutedClass}`}>{p.description}</p>
          </a>
        ))}
      </div>
    </Shell>
  );
}

function PostPage({ post }) {
  const others = POSTS.filter((p) => p.slug !== post.slug);
  return (
    <Shell>
      <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">
        <a href={BLOG_PATH} className="hover:underline">Answers for roofers</a>
      </p>
      <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">{post.title}</h1>
      <p className="mt-4 text-[15px] text-roof-muted">
        By Kendall Reid, Reboot Media · <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <p className={`mt-8 ${card} p-6 font-semibold md:p-8 ${bodyText}`}>{post.answer}</p>

      {post.sections.map((s) => (
        <section key={s.h} className="mt-12">
          <h2 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[32px]">{s.h}</h2>
          {s.p && s.p.map((t) => <p key={t} className={`mt-4 ${bodyText}`}>{t}</p>)}
          {s.list && (
            <ul className="mt-5 grid gap-3">
              {s.list.map(([b, t]) => (
                <li key={b} className={bodyText}>
                  <strong>{b}</strong> {t}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="mt-14">
        <h2 className={h2Class}>Common questions</h2>
        <dl className="mt-6 grid gap-5">
          {post.faqs.map((f) => (
            <div key={f.q}>
              <dt className="text-[19px] font-bold">{f.q}</dt>
              <dd className={`mt-1 ${mutedClass}`}>{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={`mt-14 ${col}`}>
        <h2 className={h2Class}>Want this running for your company?</h2>
        <p className={`mt-5 ${mutedClass}`}>
          We build and run ads in your company’s name so homeowners book onto your calendar. One roofer per service area.{' '}
          <a href={BOOK_LINK.href} className={linkClass}>Book a strategy call</a> or{' '}
          <a href={VISIBILITY_LINK.href} className={linkClass}>get a free Visibility Check</a>.
        </p>
        <p className={`mt-6 ${mutedClass}`}>
          {others.map((p) => (
            <span key={p.slug}>
              Next: <a href={postPath(p.slug)} className={linkClass}>{p.title}</a> ·{' '}
            </span>
          ))}
          <a href="/texas-roofing-marketing" className={linkClass}>Roofing marketing in Texas</a>
        </p>
      </div>
    </Shell>
  );
}

export default function Blog({ path = window.location.pathname }) {
  const clean = path.replace(/\/+$/, '');
  const post = POSTS.find((p) => postPath(p.slug) === clean);

  useEffect(() => {
    captureAttribution();
    initAnalytics();
    trackEvent(post ? 'blog_post_view' : 'blog_index_view');
  }, [post]);

  return post ? <PostPage post={post} /> : <BlogIndex />;
}
