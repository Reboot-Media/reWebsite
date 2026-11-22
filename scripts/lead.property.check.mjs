// Property checks for the Meta CAPI hashing inputs in functions/api/lead.js.
// Lives in scripts/ (not functions/) so Cloudflare Pages doesn't deploy it as a route.
// Run: node scripts/lead.property.check.mjs
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fc from 'fast-check'
import { normalizeEmail, normalizePhone, sha256hex } from '../functions/api/lead.js'

const run = (arb, fn) => fc.assert(fc.asyncProperty(arb, fn), { numRuns: 300 })

const digits = (n) => fc.string({ unit: fc.constantFrom(...'0123456789'), minLength: n, maxLength: n })
const nonDigit = fc.constantFrom('', ' ', '-', '.', '(', ')', '+', 'x', '\t')
const withSeparators = (d) => fc.array(nonDigit, { minLength: d.length + 1, maxLength: d.length + 1 })
  .map((seps) => [...d].reduce((s, ch, i) => s + seps[i] + ch, '') + seps[d.length])
// One 10-digit number written two different ways, with or without a leading 1.
const twoWritings = fc.tuple(digits(10), fc.boolean(), fc.boolean())
  .chain(([d, a, b]) => fc.tuple(withSeparators((a ? '1' : '') + d), withSeparators((b ? '1' : '') + d)).map((t) => ({ d, t })))

// normalizePhone: formatting variants of one number agree, are 1+10 digits, and hash identically.
await run(twoWritings, async ({ d, t: [x, y] }) => {
  assert.equal(normalizePhone(x), `1${d}`)
  assert.equal(normalizePhone(x), normalizePhone(y))
  assert.equal(await sha256hex(normalizePhone(x)), await sha256hex(normalizePhone(y)))
})
// normalizePhone: idempotent, digits only, for any input.
await run(fc.string(), async (s) => {
  const n = normalizePhone(s)
  assert.equal(normalizePhone(n), n)
  assert.match(n, /^\d*$/)
})

// normalizeEmail: idempotent, trimmed, lowercase; case and padding variants agree and hash identically.
const recase = (s) => fc.array(fc.boolean(), { minLength: s.length, maxLength: s.length })
  .map((b) => [...s].map((c, i) => (b[i] ? c.toUpperCase() : c.toLowerCase())).join(''))
await run(fc.string(), async (s) => {
  const n = normalizeEmail(s)
  assert.equal(normalizeEmail(n), n)
  assert.equal(n, n.trim())
  assert.equal(n, n.toLowerCase())
})
const emailish = fc.string({ unit: fc.constantFrom(...'abcxyz019._+-@'), minLength: 1, maxLength: 20 })
await run(fc.tuple(emailish, fc.constantFrom('', ' ', '\t', '\n')).chain(([e, ws]) => recase(e).map((v) => ({ e, v: ws + v + ws }))), async ({ e, v }) => {
  assert.equal(normalizeEmail(v), normalizeEmail(e))
  assert.equal(await sha256hex(normalizeEmail(v)), await sha256hex(normalizeEmail(e)))
})

// sha256hex: matches node's SHA-256 for any text, is 64 lowercase hex chars, and treats null/undefined as ''.
await run(fc.oneof(fc.string(), fc.string({ unit: 'binary' }), fc.string({ unit: 'grapheme' })), async (s) => {
  const h = await sha256hex(s)
  assert.equal(h, createHash('sha256').update(s, 'utf8').digest('hex'))
  assert.match(h, /^[0-9a-f]{64}$/)
})
assert.equal(await sha256hex(null), await sha256hex(''))
assert.equal(await sha256hex(undefined), createHash('sha256').update('').digest('hex'))

console.log('lead properties: ok')
