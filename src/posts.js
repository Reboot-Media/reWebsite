// Answer posts for roofing company owners (K go 2026-10-14, thread "Texas SEO
// and AI search plan"). Plain JS so scripts/prerender.mjs and src/seo.js can
// read it in Node. One real question from our calls per post, answered in the
// first lines so search and AI answers can quote it. Rules: no client names,
// no ad platform names, no prices, no guarantee, no put-downs.

export const BLOG_PATH = '/blog';

export const POSTS = [
  {
    slug: 'roofing-jobs-after-storm-season',
    title: 'How to get roofing jobs after storm season ends',
    description:
      'Storm work dries up fast. Here is how roofing companies keep the calendar full in the quiet months: steady local ads, fast follow-up, and homeowners who book themselves.',
    date: '2026-10-14',
    answer:
      'After storm season, roofing jobs come from homeowners who need a roof for reasons other than hail: age, leaks, a sale, an insurance letter. They don’t knock on your door, they search. The companies that stay busy are the ones those homeowners find first and can book with in a minute.',
    sections: [
      {
        h: 'Why work dries up when the storms stop',
        p: [
          'After a big storm, demand finds you. Homeowners call, neighbors refer, and canvassing works because every street has damage.',
          'When the storms stop, that demand doesn’t vanish. It spreads out. Instead of 200 homeowners on one street, you have a few in every neighborhood with a 20-year-old roof, a leak over the kitchen, or a home inspection that flagged the roof. Each one is quietly looking for a roofer.',
        ],
      },
      {
        h: '1. Show up where those homeowners search',
        p: [
          'A homeowner with a leak types “roof repair near me” or “roof replacement” plus their city. If your company isn’t on that page, the job goes to whoever is.',
          'Ads in your company’s name, aimed only at the areas you serve, put you there every day, not just after a storm. Keep them running in the quiet months. That’s when fewer roofers are paying attention and the homeowners who do search are ready to move.',
        ],
      },
      {
        h: '2. Let homeowners book themselves',
        p: [
          'Many homeowners won’t call. They’ll fill out a short form or pick a time, often at night. If the only option is “call us,” you lose them to the company that lets them book.',
          'A few questions before they book also tells you what the job is: replacement or repair, the age of the roof, whether insurance is involved. You show up prepared, and you skip the ones that aren’t a fit.',
        ],
      },
      {
        h: '3. Call back fast',
        p: [
          'A homeowner who just asked for an inspection is often asking two or three companies at once. The first roofer to call back usually gets the appointment. Minutes matter more than the pitch.',
        ],
      },
      {
        h: '4. Count signed jobs, not leads',
        p: [
          'In slow months it’s easy to judge marketing by how many calls came in. The number that pays you is signed jobs. Track how many inspections turn into contracts and what each signed job cost you to get. Then put more behind whatever produces signed jobs, and cut what only produces calls.',
        ],
      },
      {
        h: '5. Start before the slow months, not during them',
        p: [
          'Ads, booking and follow-up take a few weeks to settle in. If you start when the phone has already gone quiet, you feel the gap. Start while you’re still busy, and the calendar is already filling when the storm work ends.',
        ],
      },
    ],
    faqs: [
      { q: 'Does marketing still work in the off season?', a: 'Yes. Fewer homeowners search than after a storm, but they still need roofs for age, leaks and sales, and fewer roofers compete for them.' },
      { q: 'Should I stop canvassing after storm season?', a: 'Canvassing works best right after a storm, when every street has damage. In the quiet months, homeowners who search for a roofer are a better use of your time.' },
    ],
  },
  {
    slug: 'shared-vs-exclusive-roofing-leads',
    title: 'Shared roofing leads vs your own: what you actually get',
    description:
      'A shared roofing lead goes to several roofers at once, so the first to call wins and the rest compete on price. Here is how shared leads, exclusive leads and your own booked homeowners compare.',
    date: '2026-10-14',
    answer:
      'A shared roofing lead is sold to several roofers at once, so you race to call first and then compete on price. An exclusive lead goes only to you. The strongest version is a homeowner who found your company, answered a few questions and booked onto your calendar, because they already chose you.',
    sections: [
      {
        h: 'Shared leads',
        p: [
          'A homeowner fills out a form on a lead site. That one request is sold to several roofing companies. Everyone calls at once.',
          'The homeowner usually doesn’t know your company name. They asked for “a roofer,” not you. So the first one to reach them gets a shot, and the rest are compared on price. You pay for the lead whether or not you ever talk to them.',
        ],
      },
      {
        h: 'Exclusive leads',
        p: [
          'An exclusive lead is sold to one roofer only. You don’t race other roofers for it, which helps. But the homeowner still asked for “a roofer,” not your company, and you usually don’t own where the lead came from. If you stop buying, the flow stops.',
        ],
      },
      {
        h: 'Homeowners who book with you',
        p: [
          'The third option is to run your own ads in your company’s name, on an ad account you own. A homeowner sees your company, answers a few questions about their roof, and picks a time on your calendar.',
          'That homeowner has already chosen you. You know the job before you show up. And the ad history stays with your company, so you build on it every month instead of renting someone else’s list.',
        ],
      },
      {
        h: 'How they compare',
        list: [
          ['Who else gets the homeowner?', 'Shared: several roofers. Exclusive: no one. Booked with you: no one.'],
          ['Does the homeowner know your name?', 'Shared and exclusive: usually not. Booked with you: yes, they picked you.'],
          ['Who owns the source?', 'Shared and exclusive: the lead company. Booked with you: you do.'],
          ['What you compete on', 'Shared: speed and price. Exclusive: speed. Booked with you: showing up and doing good work.'],
        ],
      },
      {
        h: 'Questions to ask any lead or marketing company',
        list: [
          ['How many other roofers get this homeowner?', ''],
          ['Whose name does the homeowner see?', ''],
          ['Who owns the ad account and the history if I leave?', ''],
          ['Do you report signed jobs, or just leads and clicks?', ''],
        ],
      },
    ],
    faqs: [
      { q: 'Are shared roofing leads worth it?', a: 'They can fill gaps, but you compete with several roofers for each one, so expect to win only some and to compete on price.' },
      { q: 'What is an exclusive roofing lead?', a: 'A homeowner request sold to one roofer only. Better than shared, but the homeowner still asked for a roofer, not your company.' },
    ],
  },
];

export const postPath = (slug) => `${BLOG_PATH}/${slug}`;
export const POST_PATHS = POSTS.map((p) => postPath(p.slug));
