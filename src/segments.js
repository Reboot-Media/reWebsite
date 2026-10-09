// Pre-qual questions each segment shares with the homepage. Values stay the
// same so the CRM fields keep mapping.
const decisionMaker = { name: 'decisionMaker', type: 'radio', legend: 'Are you the owner / decision-maker?', options: ['Yes', 'I share the decision', 'No'] };
const biggerRevenue = { name: 'annualRevenue', type: 'radio', legend: "What's your company's annual revenue?", options: ['Under $1M', '$1M–$3M', '$3M–$5M', '$5M–$10M', '$10M+'] };
const adStatusOptions = ['Running now', 'Ran before, stopped', 'Never have'];
const websiteUrl = { name: 'websiteUrl', type: 'text', label: 'Company website (optional)', optional: true, autoComplete: 'url' };
const spendHint = 'your money, paid straight to the ads, not to us';
const startOptions = ['Right away', 'Within 30 days', 'In 1–3 months', 'Just exploring'];

// Cold email landing pages, one per segment. Each overrides only the copy
// that changes for that audience; everything else is the homepage.
// Slugs are what the prospect sees in the link, so they never use the
// internal segment names (e.g. "shark").
export const SEGMENTS = {
  // Same audience as the homepage (established enough to have a gatekeeper),
  // so /grow shows the homepage as-is and only adds the email tag.
  growing: {
    key: 'growing',
    slug: 'grow',
    tag: 'email-growing',
    sameAsHome: true,
  },
  shark: {
    key: 'shark',
    slug: 'scale',
    tag: 'email-shark',
    eyebrow: 'For roofing companies ready to scale',
    // Shark VSL replaces the homepage video on /scale.
    video: { src: '/media/vsl-shark.mp4', poster: '/media/vsl-shark-poster.jpg' },
    headline: 'Signed jobs in every market you want to grow into.',
    subline:
      'We run targeted ads for each market on your list, so homeowners there book straight onto your calendar while your crews expand.',
    fit: "It's for established roofing companies adding crews or new markets. We work with one roofer per service area, so no one else gets your markets.",
    // Objections from roofers who already run crews in more than one market,
    // and often already run ads. Same pattern as the homepage: agree, then
    // point to a phase (Audit / Reboot / Compound).
    faqs: [
      {
        q: 'We already run ads. Why change?',
        a: "If it's working, keep what works. Most multi-market setups run one budget across every area, so the strongest market eats it and the new ones starve. The Audit breaks it out by market and shows which ones turn into signed jobs, so you know what to keep before anything changes.",
      },
      {
        q: 'Can you run several markets at once?',
        a: "That's what this is built for. In the Reboot phase every market gets its own ads, budget and tracking, so you see signed jobs by market. When one is ready for another crew, you'll know, and in Compound we put more behind it.",
      },
      {
        q: 'Do you work with my competitors?',
        a: "Smart to ask, because plenty of agencies do. We don't. We work with one roofer per service area, and for you that's every market on your list. Tell us which ones on the form and we'll check they're open before the call.",
      },
      {
        q: 'What does it cost?',
        a: "Makes sense to want the number first. It depends on how many markets you want and how fast you want to grow into them, and that's what the Audit sorts out. We go over pricing on the call.",
      },
    ],
    // Sharks are already big and usually already running ads, so the
    // ranges start higher than the homepage's.
    // Sharks want to fill crews and open new metros: ask how big they are,
    // which markets are next, and what they can spend across all of them.
    quiz: {
      stepLabels: ['Your business', 'Your growth'],
      steps: [
        [
          decisionMaker,
          { name: 'annualRevenue', type: 'radio', legend: "What's your company's annual revenue?", options: ['Under $3M', '$3M–$5M', '$5M–$10M', '$10M–$25M', '$25M+'] },
          { name: 'crewCount', type: 'radio', legend: 'How many crews do you run today?', options: ['1–3', '4–6', '7–10', '11+'] },
          { name: 'googleAdsStatus', type: 'radio', legend: 'How are your ads doing right now?', options: ['Running and working', 'Running, not happy with results', 'Not running yet'] },
          websiteUrl,
        ],
        [
          { name: 'growthPlan', type: 'radio', legend: 'What do you want to do in the next 12 months?', options: ['More jobs in my current market', 'Open 1 new market', 'Open 2–3 new markets', 'Open 4 or more markets'] },
          { name: 'targetMarkets', type: 'text', label: 'Which cities or metros are next? (optional)', hint: "We'll check they're open before your call.", optional: true },
          { name: 'adSpend', type: 'radio', legend: 'What can you put toward ad spend each month, across all your markets?', hint: spendHint, options: ['Under $5K', '$5K–$10K', '$10K–$20K', '$20K+'] },
          { name: 'startTimeline', type: 'radio', legend: "If it's a fit, when do you want the next market running?", options: startOptions },
        ],
      ],
      drivingFactorLabel: "What's holding back the next market right now? (optional)",
      lowBudget: 'Under $5K',
      tier2: '$20K+',
    },
  },
  commercial: {
    key: 'commercial',
    slug: 'commercial',
    tag: 'email-commercial',
    eyebrow: 'For commercial roofing companies',
    headline: 'More bids in the door. Every month.',
    subline:
      'We run targeted ads to property managers, HOA boards, facility managers and general contractors in your area, so the people who send roofing work find you first.',
    knowTitle: 'Know the property before you walk it.',
    knowText: 'Decision-makers answer a few questions before they book. You see the property and the need ahead of time.',
    booking: { name: 'Dana Ortiz', initials: 'DO', place: 'Property manager, Plano, TX', phone: '(972) 555-0193' },
    rows: [
      ['Needs', 'Roof assessment'],
      ['Walkthrough', 'Tuesday, 10:00 AM'],
      ['Property', '42-unit apartment complex'],
      ['Timeline', 'Budgeting for next quarter'],
      ['Their note', '"Two of our buildings started leaking after the last storm."'],
    ],
    fit: "It's for commercial roofing companies that respond fast to bid requests and show up to the walkthrough. We work with one roofer per service area.",
    // Commercial roofers want more bid requests from the people who send
    // roofing work: ask who they want to hear from and how many bids they
    // can turn around.
    quiz: {
      stepLabels: ['Your business', 'Your bids'],
      steps: [
        [
          decisionMaker,
          biggerRevenue,
          { name: 'commercialShare', type: 'radio', legend: 'How much of your work is commercial today?', options: ['Under 25%', '25–50%', '50–75%', 'Over 75%'] },
          { name: 'googleAdsStatus', type: 'radio', legend: 'Are you running paid ads for commercial work right now?', options: adStatusOptions },
          websiteUrl,
        ],
        [
          { name: 'bidSources', type: 'checkbox', legend: 'Who do you want more bid requests from?', hint: 'Pick all that apply.', options: ['Property managers', 'HOA boards', 'Facility managers', 'General contractors'] },
          { name: 'bidCapacity', type: 'radio', legend: 'How many new bid requests could your team handle each month?', options: ['Up to 5', '6–15', '16–30', '30+'] },
          { name: 'adSpend', type: 'radio', legend: 'What can you put toward ad spend each month?', hint: spendHint, options: ['Under $3K', '$3K–$5K', '$5K–$10K', '$10K+'] },
          { name: 'startTimeline', type: 'radio', legend: "If it's a fit, when do you want bid requests coming in?", options: startOptions },
        ],
      ],
      drivingFactorLabel: "What's the hardest part of winning more commercial work right now? (optional)",
      lowBudget: 'Under $3K',
      tier2: '$10K+',
    },
  },
};

export const segmentForPath = (path) =>
  Object.values(SEGMENTS).find((s) => path === `/${s.slug}`) || null;
