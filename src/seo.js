// What search engines and AI crawlers see for each route. The build writes
// these into each page's static HTML (scripts/prerender.mjs), so crawlers that
// don't run JavaScript still get the title, description, canonical and content.
export const SITE_URL = 'https://rebootmedia.us';

const DEFAULT_DESCRIPTION =
  'We build and run your ads so homeowners who need a roofer book onto your calendar. You show up and sign the job.';

export const ROUTES = {
  '/': {
    title: 'Reboot Media | More signed jobs for roofing companies',
    description: DEFAULT_DESCRIPTION,
    index: true,
  },
  '/visibility-check': {
    title: 'Free Visibility Check for Roofing Companies | Reboot Media',
    description:
      'See which roofers homeowners in your city find first, where your company shows up, and the 3 fixes that would get you more calls. Free, within one business day.',
    index: true,
  },
  // Post-booking page and cold email pages: not for search.
  '/before-your-call': { title: 'Before your call | Reboot Media', description: DEFAULT_DESCRIPTION, index: false },
  '/grow': { title: 'Reboot Media | More signed jobs for roofing companies', description: DEFAULT_DESCRIPTION, index: false },
  '/scale': { title: 'Reboot Media | Signed jobs in every market you grow into', description: DEFAULT_DESCRIPTION, index: false },
  '/commercial': { title: 'Reboot Media | More commercial roofing bids', description: DEFAULT_DESCRIPTION, index: false },
};

export const routeFor = (path) => ROUTES[path.replace(/\/+$/, '') || '/'] || ROUTES['/'];
