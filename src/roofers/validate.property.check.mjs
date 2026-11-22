// Property checks for the pre-qual form rules. Run: node src/roofers/validate.property.check.mjs
import assert from 'node:assert/strict'
import fc from 'fast-check'
import { usDigits, formatPhone, isPhone, isEmail, stateCode } from './validate.js'

const run = (arb, fn) => fc.assert(fc.property(arb, fn), { numRuns: 500 })

const digits = (n) => fc.string({ unit: fc.constantFrom(...'0123456789'), minLength: n, maxLength: n })
const nonDigit = fc.constantFrom('', ' ', '-', '.', '(', ')', '+', 'x', '\t')
// Valid NANP number: area and exchange codes start 2-9.
const validTen = fc.tuple(fc.integer({ min: 2, max: 9 }), digits(2), fc.integer({ min: 2, max: 9 }), digits(6)).map((p) => p.join(''))
// Same digits with arbitrary non-digit separators between them.
const withSeparators = (d) => fc.array(nonDigit, { minLength: d.length + 1, maxLength: d.length + 1 })
  .map((seps) => [...d].reduce((s, ch, i) => s + seps[i] + ch, '') + seps[d.length])
const validPhoneText = fc.tuple(validTen, fc.boolean()).chain(([d, one]) => withSeparators((one ? '1' : '') + d).map((t) => ({ d, t })))

// usDigits: formatting variants (and a leading 1) of a valid number give the same 10 digits.
run(validPhoneText, ({ d, t }) => assert.equal(usDigits(t), d))
// usDigits: the answer is always '' or a valid 10-digit NANP number, never a wrong or partial one.
run(fc.string(), (s) => assert.match(usDigits(s), /^([2-9]\d{2}[2-9]\d{6})?$/))
run(fc.string({ unit: 'binary' }), (s) => assert.match(usDigits(s), /^([2-9]\d{2}[2-9]\d{6})?$/))

// usDigits: NANP rule on bare 10 digits: area code and exchange must start 2-9, nothing else is rejected.
run(digits(10), (d) => assert.equal(usDigits(d), d[0] >= '2' && d[3] >= '2' ? d : ''))

// isPhone is exactly "usDigits found a number".
run(fc.string(), (s) => assert.equal(isPhone(s), usDigits(s) !== ''))

// formatPhone: every accepted number formats to (AAA) BBB-CCCC carrying the same digits.
run(validPhoneText, ({ d, t }) => {
  assert.ok(isPhone(t))
  const f = formatPhone(t)
  assert.match(f, /^\(\d{3}\) \d{3}-\d{4}$/)
  assert.equal(usDigits(f), d)
  assert.equal(f, `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`)
})
// formatPhone: idempotent for any typed input, and its output is only digits and ()- space.
run(fc.string(), (s) => {
  const f = formatPhone(s)
  assert.equal(formatPhone(f), f)
  assert.match(f, /^[\d() -]*$/)
})
// formatPhone: typing a number one digit at a time keeps the digits, and the shape changes at 4 and 7 digits.
run(validTen, (d) => {
  const shape = (n) => (n < 4 ? d.slice(0, n) : n < 7 ? `(${d.slice(0, 3)}) ${d.slice(3, n)}` : `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, n)}`)
  for (let n = 0; n <= 10; n++) assert.equal(formatPhone(d.slice(0, n)), shape(n))
})
// formatPhone: never more than 10 digits, however much is pasted.
run(fc.string(), (s) => assert.ok(formatPhone(s).replace(/\D/g, '').length <= 10))
run(digits(12), (s) => assert.equal(formatPhone(s).replace(/\D/g, ''), s.slice(0, 10)))

// isEmail: built-up addresses are accepted, with or without surrounding whitespace.
const part = fc.string({ unit: fc.constantFrom(...'abcxyz019._+-'), minLength: 1, maxLength: 8 })
const tld = fc.string({ unit: fc.constantFrom(...'abcXYZ'), minLength: 2, maxLength: 6 })
const email = fc.tuple(part, part, tld).map(([l, d, t]) => `${l}@${d}.${t}`)
run(fc.tuple(email, fc.constantFrom('', ' ', '\t', '\n')), ([e, ws]) => assert.ok(isEmail(ws + e + ws)))
// isEmail: no '@', two '@', or internal whitespace is always rejected.
run(fc.string().filter((s) => !s.includes('@')), (s) => assert.ok(!isEmail(s)))
// isEmail: a one-letter TLD, empty local part, or empty domain label is rejected.
run(fc.tuple(part, part, fc.constantFrom(...'abc')), ([l, d, t]) => assert.ok(!isEmail(`${l}@${d}.${t}`)))
run(fc.tuple(part, tld), ([d, t]) => assert.ok(!isEmail(`@${d}.${t}`)))
run(fc.tuple(part, tld), ([l, t]) => assert.ok(!isEmail(`${l}@.${t}`)))
run(fc.tuple(part, part, part), ([a, b, c]) => assert.ok(!isEmail(`${a}@${b}@${c}.com`)))
run(fc.tuple(email, fc.nat(), fc.constantFrom(' ', '\t')), ([e, i, ws]) => {
  const at = i % (e.length - 1) + 1 // internal position, never leading
  assert.ok(!isEmail(e.slice(0, at) + ws + e.slice(at)))
})

// stateCode: every code in any case/padding resolves to itself; every name in any case/spacing resolves to its code.
const CODES = 'AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY'.split(' ')
const NAMES = { NH: 'new hampshire', NJ: 'new jersey', NM: 'new mexico', NY: 'new york', NC: 'north carolina', ND: 'north dakota', RI: 'rhode island', SC: 'south carolina', SD: 'south dakota', WV: 'west virginia', DC: 'district of columbia', TX: 'texas', OH: 'ohio' }
const recase = (s) => fc.array(fc.boolean(), { minLength: s.length, maxLength: s.length }).map((b) => [...s].map((c, i) => (b[i] ? c.toUpperCase() : c.toLowerCase())).join(''))
const pad = fc.constantFrom('', ' ', '  ', '\t')
run(fc.constantFrom(...CODES).chain((c) => fc.tuple(fc.constant(c), recase(c), pad, fc.constantFrom('', '.'))), ([c, v, p, dot]) => assert.equal(stateCode(p + v + dot + p), c))
run(fc.constantFrom(...Object.keys(NAMES)).chain((c) => fc.tuple(fc.constant(c), recase(NAMES[c]), fc.constantFrom(' ', '  ', '\t'), pad)), ([c, v, gap, p]) => assert.equal(stateCode(p + v.replace(/ /g, gap) + p), c))
// stateCode: the output is always '' or a known code, and re-resolving a code is a no-op.
run(fc.string(), (s) => {
  const c = stateCode(s)
  assert.ok(c === '' || CODES.includes(c), c)
  assert.equal(stateCode(c), c)
})

console.log('validate properties: ok')
