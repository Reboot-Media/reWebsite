import { useEffect, useState } from 'react';
import { BOOK_LINK, COMPARE_LINK, Footer, Icon, Logo, btnBase, card, col, h2Class, mutedClass, sec, wrap } from './App.jsx';
import { Arrow, TextField } from './roofers/PreQualForm.jsx';
import { formatPhone, isCity, isEmail, isFullName, isPhone, isWebsite } from './roofers/validate.js';
import { captureAttribution, getAttribution, initAnalytics, newEventId, postLead, trackEvent } from './roofers/tracking.js';

// Free lead magnet for roofers not ready to book a call. The request lands in
// GHL tagged VisibilityCheck; Jev drafts the check and a person approves it
// before it goes out. It is never a qualified lead, so no Meta conversion fires.

const YOU_GET = [
  'The 3 roofers a homeowner in your city sees first when they search for one.',
  "Where you show up, and where you don't.",
  'Your reviews next to your top 3 competitors.',
  'The 3 fixes that would get you more calls, in order.',
];

const initialFields = { fullName: '', company: '', city: '', phone: '', email: '', websiteUrl: '', referral_code: '' };

function validate(f) {
  const e = {};
  if (!isFullName(f.fullName)) e.fullName = 'Enter your first and last name.';
  if (!f.company.trim()) e.company = 'Enter your company name.';
  if (!isCity(f.city)) e.city = 'Enter the city you work in.';
  if (!isPhone(f.phone)) e.phone = 'Enter a 10-digit mobile number.';
  if (!isEmail(f.email)) e.email = 'Enter a valid email.';
  if (!isWebsite(f.websiteUrl)) e.websiteUrl = 'Enter your website, like yourcompany.com.';
  return e;
}

export default function VisibilityCheck() {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Free Visibility Check for Roofing Companies | Reboot Media';
    captureAttribution();
    initAnalytics();
    trackEvent('visibility_check_view');
  }, []);

  const update = (name, value) => {
    setFields((f) => ({ ...f, [name]: name === 'phone' ? formatPhone(value) : value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate(fields);
    setErrors(e);
    if (Object.keys(e).length) return;
    const spam = fields.referral_code.trim().length > 0;
    postLead({
      ...fields,
      event_id: newEventId(),
      event_name: 'Lead',
      stage: 'visibility_check',
      tags: spam ? ['VisibilityCheck', 'SpamSuspect'] : ['VisibilityCheck'],
      qualified: false,
      spam,
      page: 'visibility-check',
      attribution: getAttribution(),
    });
    if (!spam) trackEvent('visibility_check_submit');
    setSent(true);
  };

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
        <section data-section="visibility_check" className={`bg-[linear-gradient(180deg,theme(colors.accent.bg)_0%,white_62%)] ${sec} pt-10 md:pt-20`}>
          <div className={`${wrap} grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16`}>
            <div>
              <p className="mb-5 text-[13px] font-semibold uppercase leading-[1.4] tracking-[0.14em] text-accent">Free Visibility Check</p>
              <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.035em] [text-wrap:balance] md:text-[48px]">
                See who homeowners call when they search for a roofer in your city.
              </h1>
              <p className={`mt-5 ${col} ${mutedClass}`}>
                We look at your market the way a homeowner does and send you what we find within one business day. Free, no call needed.
              </p>
              <h2 className="mb-4 mt-10 text-[20px] font-bold text-roof-ink">What you get</h2>
              <ul className="space-y-4">
                {YOU_GET.map((t) => (
                  <li key={t} className="flex gap-3 text-[17px] leading-[1.6] md:text-[18px]">
                    <Icon d="M20 6 9 17l-5-5" className="mt-[5px] h-5 w-5 shrink-0 text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className={`mt-8 ${mutedClass}`}>
                Rather talk it through with us now?{' '}
                <a href="/#prequal-form" className="font-semibold text-accent-dark underline underline-offset-4 hover:text-accent">
                  Book a strategy call
                </a>
                .
              </p>
            </div>

            <div className={`${card} h-fit p-6 shadow-lift md:p-8`}>
              {sent ? (
                <div role="status">
                  <h2 className={h2Class}>You're on the list.</h2>
                  <p className={`mt-4 ${mutedClass}`}>
                    Your Visibility Check lands by text and email within one business day.
                  </p>
                  <p className={`mt-6 ${mutedClass}`}>
                    Want to talk sooner?{' '}
                    <a href="/#prequal-form" className="font-semibold text-accent-dark underline underline-offset-4 hover:text-accent">
                      Book a strategy call
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h2 className="mb-6 text-[22px] font-bold text-roof-ink">Where should we send it?</h2>
                  <TextField id="vc-fullName" label="First and last name" value={fields.fullName} onChange={(v) => update('fullName', v)} error={errors.fullName} autoComplete="name" />
                  <TextField id="vc-company" label="Company name" value={fields.company} onChange={(v) => update('company', v)} error={errors.company} autoComplete="organization" />
                  <TextField id="vc-city" label="What city do you work in?" value={fields.city} onChange={(v) => update('city', v)} error={errors.city} autoComplete="address-level2" />
                  <TextField id="vc-phone" label="Mobile phone" type="tel" value={fields.phone} onChange={(v) => update('phone', v)} error={errors.phone} autoComplete="tel" />
                  <TextField id="vc-email" label="Email" type="email" value={fields.email} onChange={(v) => update('email', v)} error={errors.email} autoComplete="email" />
                  <TextField id="vc-websiteUrl" label="Website" value={fields.websiteUrl} onChange={(v) => update('websiteUrl', v)} error={errors.websiteUrl} autoComplete="url" />
                  <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                    <label htmlFor="vc-referral_code">Referral code</label>
                    <input id="vc-referral_code" name="referral_code" tabIndex={-1} autoComplete="off" value={fields.referral_code} onChange={(e) => update('referral_code', e.target.value)} />
                  </div>
                  <button type="submit" className={`group ${btnBase} h-14 w-full gap-2 whitespace-nowrap rounded-[14px] bg-accent px-5 text-[17px] text-white hover:bg-accent-dark`}>
                    Send my free check
                    <Arrow />
                  </button>
                  <p className="mt-3 text-sm text-roof-muted">We'll text and email it to you. No spam.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer links={[BOOK_LINK, COMPARE_LINK]} />
    </div>
  );
}
