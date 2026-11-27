import { useEffect, useState } from 'react';
import { formatPhone, isCity, isEmail, isFullName, isPhone } from './roofers/validate.js';
import { captureAttribution, getAttribution, initAnalytics, newEventId, postLead, trackEvent } from './roofers/tracking.js';

// Link-in-bio page for the Instagram "Field Notes" series (Reboot Partners
// company brand: navy / warm white / stone / brass). A roofer answers a few
// questions and the full checklist opens on the page right away. The request
// goes to /api/lead tagged FieldNotes so the owner can follow up by hand. It is
// never a qualified lead, so no ad conversion fires.

export const FIELD_NOTES_PATH = '/field-notes';

const C = {
  navy: '#14213D',
  navySoft: '#24324F',
  paper: '#F7F4EE',
  stone: '#E7E1D6',
  stoneDark: '#6B655A',
  brass: '#B08D57',
  brassDark: '#8A6D40',
};

const CREW_OPTIONS = ['1 crew', '2 to 3 crews', '4 or more crews'];
const PAIN_OPTIONS = [
  'Calls and leads I can\'t get back to fast',
  'Estimates nobody follows up on',
  'Scheduling and confirming inspections',
  'I don\'t really know my numbers',
  'The slow months',
];

const CHECKLIST = [
  {
    group: 'Leads',
    items: [
      'Every new lead gets a text back within minutes, nights and weekends too.',
      'Missed calls get a text back automatically: "Sorry I missed you, I\'m up on a roof. What\'s going on with yours?"',
    ],
  },
  {
    group: 'Repairs',
    items: [
      'Your website and business profile say you take leak and repair calls all winter.',
      'Your marketing keeps running in the slow months, pointed at repairs and insurance work.',
    ],
  },
  {
    group: 'Estimates',
    items: [
      'Pull every estimate from the fall that didn\'t sign. Every one gets a follow-up before spring.',
      'Follow up on a schedule: a text on day 2, a call on day 5, and on day 10, "Should I close this out or keep it open?"',
    ],
  },
  {
    group: 'Calendar',
    items: ['Every inspection gets a confirmation text the day before: "Reply YES and we\'ll see you then."'],
  },
  {
    group: 'Numbers',
    items: ['Every Monday, look at four numbers: calls, inspections, signed jobs, and average job. Compare them to the same week last year.'],
  },
];

const TEXTS = [
  ['New lead', '"Hey [name], this is [you] with [company]. Got your request. What time tomorrow works to come take a look?"'],
  ['Missed call', '"Sorry I missed you, I\'m up on a roof. What\'s going on with yours?"'],
  ['Day before', '"Hey [name], confirming tomorrow at [time]. Reply YES and we\'ll see you then."'],
];

const initialFields = { fullName: '', company: '', city: '', email: '', phone: '', crews: '', pain: '', referral_code: '' };

function validate(f) {
  const e = {};
  if (!isFullName(f.fullName)) e.fullName = 'Enter your first and last name.';
  if (!f.company.trim()) e.company = 'Enter your company name.';
  if (!isCity(f.city)) e.city = 'Enter the city you work in.';
  if (!isEmail(f.email)) e.email = 'Enter a valid email.';
  if (f.phone.trim() && !isPhone(f.phone)) e.phone = 'Enter a 10-digit mobile number, or leave it blank.';
  if (!f.crews) e.crews = 'Pick one.';
  if (!f.pain) e.pain = 'Pick one.';
  return e;
}

const focus = 'outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2';

function Field({ id, label, type = 'text', value, onChange, error, autoComplete, optional }) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-2 block text-[15px] font-semibold" style={{ color: C.navy }}>
        {label}
        {optional && <span className="font-normal" style={{ color: C.stoneDark }}> (optional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`min-h-[48px] w-full rounded-xl border bg-white px-4 py-3 text-[17px] ${focus}`}
        style={{ borderColor: error ? '#C0392B' : C.stone, color: C.navy }}
      />
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-[#C0392B]">{error}</p>}
    </div>
  );
}

function Choice({ name, legend, options, value, onChange, error }) {
  return (
    <fieldset className="mb-5">
      <legend className="mb-2 block text-[15px] font-semibold" style={{ color: C.navy }}>{legend}</legend>
      <div className="grid gap-2">
        {options.map((o) => {
          const on = value === o;
          return (
            <label
              key={o}
              className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 text-[16px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#B08D57]"
              style={{ borderColor: on ? C.navy : C.stone, background: on ? '#EEF0F4' : 'white', color: C.navy }}
            >
              <input type="radio" name={name} value={o} checked={on} onChange={() => onChange(o)} className="h-4 w-4 accent-[#14213D]" />
              {o}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-[#C0392B]">{error}</p>}
    </fieldset>
  );
}

function Wordmark() {
  return (
    <a href="/" className="flex items-baseline gap-2" style={{ color: C.navy }}>
      <span className="text-[18px] font-extrabold tracking-[0.18em]">REBOOT</span>
      <span className="text-[13px] font-medium uppercase tracking-[0.14em]" style={{ color: C.brassDark }}>Partners</span>
    </a>
  );
}

function Checklist() {
  return (
    <div>
      <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.brassDark }}>Field Notes 01</p>
      <h2 className="mt-2 text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] md:text-[34px]" style={{ color: C.navy }}>
        The winter pipeline checklist
      </h2>
      <p className="mt-3 text-[17px] leading-[1.6]" style={{ color: C.stoneDark }}>
        Go down the list. Anything you can't check off is the first thing to fix before January.
      </p>
      <div className="mt-8 space-y-7">
        {CHECKLIST.map((g) => (
          <section key={g.group}>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-[0.14em]" style={{ color: C.navySoft }}>{g.group}</h3>
            <ul className="space-y-3">
              {g.items.map((t) => (
                <li key={t} className="flex gap-3 text-[17px] leading-[1.55]" style={{ color: C.navy }}>
                  <span aria-hidden="true" className="mt-[3px] h-5 w-5 shrink-0 rounded border-2" style={{ borderColor: C.brass }} />
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-10 rounded-2xl p-6" style={{ background: C.paper, border: `1px solid ${C.stone}` }}>
        <h3 className="text-[18px] font-bold" style={{ color: C.navy }}>3 texts you can copy today</h3>
        <dl className="mt-4 space-y-4">
          {TEXTS.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.brassDark }}>{k}</dt>
              <dd className="mt-1 text-[17px] leading-[1.55]" style={{ color: C.navy }}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className={`mt-8 h-12 rounded-xl bg-[#14213D] px-5 text-[16px] font-semibold text-white hover:bg-[#24324F] print:hidden ${focus}`}
      >
        Print or save as PDF
      </button>
      <p className="mt-6 text-[16px] leading-[1.6]" style={{ color: C.stoneDark }}>
        You focus on roofing. We handle everything else. Questions about any of this? DM us on Instagram and Kendall will answer personally.
      </p>
    </div>
  );
}

export default function FieldNotes() {
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Field Notes: The Winter Pipeline Checklist | Reboot Partners';
    captureAttribution();
    initAnalytics();
    trackEvent('field_notes_view');
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
      stage: 'field_notes',
      tags: spam ? ['FieldNotes', 'FieldNotes01', 'SpamSuspect'] : ['FieldNotes', 'FieldNotes01'],
      qualified: false,
      spam,
      page: 'field-notes',
      attribution: getAttribution(),
    });
    if (!spam) trackEvent('field_notes_submit');
    setSent(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden font-sans text-[17px] antialiased" style={{ background: C.paper, color: C.navy }}>
      <header className="print:hidden" style={{ borderBottom: `1px solid ${C.stone}` }}>
        <div className="mx-auto flex min-h-[68px] max-w-[1040px] items-center px-4 md:px-8">
          <Wordmark />
        </div>
      </header>
      <main className="mx-auto max-w-[1040px] px-4 py-10 md:px-8 md:py-16">
        {sent ? (
          <div role="status" className="mx-auto max-w-[680px] rounded-[20px] bg-white p-6 md:p-10" style={{ border: `1px solid ${C.stone}` }}>
            <Checklist />
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-14">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: C.brassDark }}>Field Notes 01 · Dry land</p>
              <h1 className="mt-4 text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] md:text-[50px]">
                The winter pipeline checklist
              </h1>
              <p className="mt-5 max-w-[34ch] text-[18px] leading-[1.6]" style={{ color: C.stoneDark }}>
                Slow months aren't a weather problem. They're a pipeline problem. This is the list we run so a roofing company stays busy through winter.
              </p>
              <h2 className="mt-10 text-[18px] font-bold">What's inside</h2>
              <ul className="mt-4 space-y-3">
                {['8 checks across leads, repairs, estimates, calendar and numbers', '3 texts you can copy and send today', 'A printable version for your office'].map((t) => (
                  <li key={t} className="flex gap-3 text-[17px] leading-[1.55]">
                    <span aria-hidden="true" className="mt-[9px] h-2 w-2 shrink-0 rounded-full" style={{ background: C.brass }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <form onSubmit={submit} noValidate className="h-fit rounded-[20px] bg-white p-6 md:p-8" style={{ border: `1px solid ${C.stone}` }}>
              <h2 className="mb-6 text-[22px] font-bold">Get the checklist</h2>
              <Field id="fn-fullName" label="First and last name" value={fields.fullName} onChange={(v) => update('fullName', v)} error={errors.fullName} autoComplete="name" />
              <Field id="fn-company" label="Company name" value={fields.company} onChange={(v) => update('company', v)} error={errors.company} autoComplete="organization" />
              <Field id="fn-city" label="What city do you work in?" value={fields.city} onChange={(v) => update('city', v)} error={errors.city} autoComplete="address-level2" />
              <Field id="fn-email" label="Email" type="email" value={fields.email} onChange={(v) => update('email', v)} error={errors.email} autoComplete="email" />
              <Field id="fn-phone" label="Mobile phone" type="tel" value={fields.phone} onChange={(v) => update('phone', v)} error={errors.phone} autoComplete="tel" optional />
              <Choice name="crews" legend="How many crews do you run?" options={CREW_OPTIONS} value={fields.crews} onChange={(v) => update('crews', v)} error={errors.crews} />
              <Choice name="pain" legend="What slows your office down most?" options={PAIN_OPTIONS} value={fields.pain} onChange={(v) => update('pain', v)} error={errors.pain} />
              <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                <label htmlFor="fn-referral_code">Referral code</label>
                <input id="fn-referral_code" name="referral_code" tabIndex={-1} autoComplete="off" value={fields.referral_code} onChange={(e) => update('referral_code', e.target.value)} />
              </div>
              <button type="submit" className={`h-14 w-full rounded-[14px] bg-[#14213D] text-[17px] font-semibold text-white transition-colors hover:bg-[#24324F] ${focus}`}>
                Show me the checklist
              </button>
              <p className="mt-3 text-sm" style={{ color: C.stoneDark }}>It opens right here. No spam, no sales calls you didn't ask for.</p>
            </form>
          </div>
        )}
      </main>
      <footer className="print:hidden" style={{ borderTop: `1px solid ${C.stone}` }}>
        <div className="mx-auto max-w-[1040px] px-4 py-8 text-sm md:px-8" style={{ color: C.stoneDark }}>
          © {new Date().getFullYear()} Reboot Partners · <a href="/privacy.html" className="underline underline-offset-4">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
