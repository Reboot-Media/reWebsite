// Drives the real pre-qual form in a browser; asserts exactly one lead is forwarded.
import { test, expect } from '@playwright/test'

const LEAD = { name: 'Pat Verify', email: 'pat.verify@example.com', digits: '5552345678', phone: '(555) 234-5678' }
const ANSWERS = ['Yes', '$1M–$3M', 'No', 'Running now', '$5K–$7K', 'Right away']
const by = (calls, part) => calls.filter((c) => c.url.includes(part))

// Abort everything not on 127.0.0.1; return the list of aborted hosts.
async function blockExternal(page) {
  const aborted = []
  await page.route('**/*', (route) => {
    const { hostname } = new URL(route.request().url())
    if (hostname === '127.0.0.1') return route.continue()
    aborted.push(hostname)
    return route.abort()
  })
  const completed = []
  page.on('requestfinished', (r) => { const h = new URL(r.url()).hostname; if (h !== '127.0.0.1') completed.push(h) })
  return { aborted, completed }
}

async function answerQuestions(form) {
  for (const answer of ANSWERS) {
    // A click auto-advances after a short delay; the next getByLabel waits for the next screen.
    await form.getByLabel(answer, { exact: true }).click()
  }
}

async function fillContact(form) {
  await form.getByLabel('First and last name').fill(LEAD.name)
  await form.getByLabel('Company name').fill('Verify Roofing')
  await form.getByLabel('Email').fill(LEAD.email)
  await form.getByLabel('Mobile phone').pressSequentially(LEAD.digits)
  await form.getByLabel('What city do you operate in?').fill('Denver')
  await expect(form.getByLabel('Mobile phone')).toHaveValue(LEAD.phone)
}

function assertForwards({ browserPosts, calls }) {
  expect(browserPosts, 'one browser POST /api/lead').toBe(1)
  const [crm, ghl, meta] = [by(calls, '/__fake/crm'), by(calls, '/__fake/ghl'), by(calls, 'graph.facebook.com')]
  expect([crm.length, ghl.length, meta.length], 'one CRM, one GHL, one Meta call').toEqual([1, 1, 1])
  expect(calls.length, 'no other outbound calls').toBe(3)
  for (const c of [crm[0], ghl[0]]) {
    expect(c.body.fullName).toBe(LEAD.name)
    expect(c.body.email).toBe(LEAD.email)
    expect(c.body.phone).toBe(LEAD.phone)
  }
}

test('pre-qual submit forwards exactly one lead', async ({ page, request }) => {
  await request.post('/__reset')
  const net = await blockExternal(page)
  await page.goto('/')
  const section = page.locator('[data-section="book_call"]')
  await section.scrollIntoViewIfNeeded()
  const form = section.locator('#prequal-form')
  await answerQuestions(form)
  await fillContact(form)
  await form.getByRole('button', { name: 'Pick a time' }).click()
  await expect(form.getByRole('heading', { name: /pick a time that works/ })).toBeVisible()
  assertForwards(await (await request.get('/__captured')).json())
  expect(net.completed, 'no external request completed').toEqual([])
  console.log(`verify: external hosts aborted: ${[...new Set(net.aborted)].join(', ') || 'none'}`)
})
