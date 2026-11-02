// Checks that lead posts carry the CRM snippet's click IDs and still send without it. Run: node scripts/check-lead-attribution.mjs
import assert from 'node:assert'
const sent = []
globalThis.window = globalThis
globalThis.document = { cookie: '', referrer: '' }
globalThis.fetch = (u, o) => { sent.push(JSON.parse(o.body)); return Promise.resolve() }
const { postLead } = await import(new URL("../src/roofers/tracking.js", import.meta.url).href)
window.rbAttribution = () => ({ gclid: 'test-reboot-1', utm_source: 'google', tags: ['x'] })
postLead({ event_id: 'a', tags: ['Nurture'] })
assert.equal(sent[0].gclid, 'test-reboot-1'); assert.deepEqual(sent[0].tags, ['Nurture'])
delete window.rbAttribution; postLead({ event_id: 'b' }); assert.equal(sent[1].event_id, 'b')
window.rbAttribution = () => { throw new Error('boom') }; postLead({ event_id: 'c' }); assert.equal(sent[2].event_id, 'c')
console.log('ok', JSON.stringify(sent))
