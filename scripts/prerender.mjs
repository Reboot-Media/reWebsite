// Runs after `vite build` (see package.json). Writes one static HTML file per
// route with its own title, description, canonical, robots and page markup, so
// search engines and AI crawlers that don't run JavaScript can read every page.
// Cloudflare Pages serves dist/visibility-check.html at /visibility-check.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { ROUTES, SITE_URL } from '../src/seo.js'

const { render, FAQS } = await import('../dist-ssr/entry-server.js')
const template = readFileSync('dist/index.html', 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const ORG = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Reboot Media',
  legalName: 'Reboot Media LLC',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: 'hello@rebootmedia.us',
  // City only: the Google profile hides the street address (service-area company).
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  description:
    'Reboot Media builds and runs ads for roofing companies so homeowners who need a roofer book straight onto their calendar. One roofer per service area.',
  alternateName: 'Reboot Media LLC',
  slogan: 'Consistent, signed roofing jobs. Every month.',
  knowsAbout: ['Roofing company marketing', 'Lead generation for roofers', 'Roofing appointments'],
  areaServed: { '@type': 'Country', name: 'United States' },
  founder: { '@type': 'Person', name: 'Kendall Reid', jobTitle: 'Founder' },
  sameAs: ['https://www.linkedin.com/company/rebootmedia-io/', 'https://share.google/I1BgD0sDjlCaVh4Lh'],
}

function schemaFor(path) {
  if (path === '/') {
    return [
      { '@context': 'https://schema.org', ...ORG },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Reboot Media', url: SITE_URL, publisher: { '@id': ORG['@id'] } },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ]
  }
  if (path === '/visibility-check') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Free Visibility Check for Roofing Companies',
        serviceType: 'Local search visibility report',
        description: ROUTES[path].description,
        provider: { '@id': ORG['@id'] },
        audience: { '@type': 'BusinessAudience', audienceType: 'Roofing companies' },
        url: `${SITE_URL}${path}`,
      },
    ]
  }
  return []
}

for (const [path, meta] of Object.entries(ROUTES)) {
  const url = `${SITE_URL}${path}`
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.index ? '' : '<meta name="robots" content="noindex" />',
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    ...schemaFor(path).map(jsonLd),
  ].filter(Boolean).join('\n    ')

  const html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace(/<meta property="og:(title|description|url)"[^>]*>\s*/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/, '')
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)

  writeFileSync(path === '/' ? 'dist/index.html' : `dist${path}.html`, html)
  console.log(`prerendered ${path}`)
}

rmSync('dist-ssr', { recursive: true, force: true })
