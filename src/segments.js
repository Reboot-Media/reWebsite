// Cold email landing pages, one per segment. Each overrides only the copy
// that changes for that audience; everything else is the homepage.
// Slugs are what the prospect sees in the link, so they never use the
// internal segment names (e.g. "shark").
export const SEGMENTS = {
  growing: {
    key: 'growing',
    slug: 'grow',
    tag: 'email-growing',
    eyebrow: 'For growing roofing companies',
    headline: 'Consistent, signed roofing jobs. Every month.',
    subline:
      'Homeowners in your area who already want a roofer book straight onto your calendar. We build and run the ads. You show up and sign the job.',
  },
  shark: {
    key: 'shark',
    slug: 'scale',
    tag: 'email-shark',
    eyebrow: 'For roofing companies ready to scale',
    headline: 'Signed jobs in every market you want to grow into.',
    subline:
      'We run targeted ads for each market on your list, so homeowners there book straight onto your calendar while your crews expand.',
    fit: "It's for established roofing companies adding crews or new markets. We work with one roofer per service area, so no one else gets your markets.",
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
  },
};

export const segmentForPath = (path) =>
  Object.values(SEGMENTS).find((s) => path === `/${s.slug}`) || null;
