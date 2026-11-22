#!/usr/bin/env bash
# Verify skill: isolated build + API-level lead-flow check.
# Exit 0 pass, 1 flow broken, 2 could not boot.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
PORT="${VERIFY_PORT:-5196}"
TMP="$(mktemp -d)"
SERVER_PID=""
cleanup() { [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null; rm -rf "$TMP"; }
trap cleanup EXIT
cd "$ROOT" || exit 2

# 1. Build: empty envDir (no .env* loads), temp outDir, only a dummy VITE_ var.
# Plain client build: scripts/prerender.mjs hardcodes dist/ so it is skipped.
for v in $(env | grep -o '^VITE_[A-Za-z0-9_]*'); do unset "$v"; done
export VITE_CALENDLY_URL=https://calendly.invalid/verify
mkdir "$TMP/env"
TMP="$TMP" node --input-type=module -e '
  import { build } from "vite"
  await build({ envDir: process.env.TMP + "/env", logLevel: "warn",
    build: { outDir: process.env.TMP + "/dist", emptyOutDir: true } })
' >"$TMP/build.log" 2>&1 || { tail -20 "$TMP/build.log"; echo "verify: build failed"; exit 2; }

# 2. Boot the server.
VERIFY_PORT="$PORT" VERIFY_DIST="$TMP/dist" node .claude/skills/verify/server.mjs >"$TMP/server.log" 2>&1 &
SERVER_PID=$!; disown "$SERVER_PID"
for _ in $(seq 50); do
  curl -sf "http://127.0.0.1:$PORT/" >/dev/null 2>&1 && break
  kill -0 "$SERVER_PID" 2>/dev/null || { cat "$TMP/server.log"; echo "verify: server died"; exit 2; }
  sleep 0.2
done
curl -sf "http://127.0.0.1:$PORT/" >/dev/null 2>&1 || { echo "verify: server not reachable"; exit 2; }

# 3. API-level assertions against the real lead.js handler.
VERIFY_PORT="$PORT" node --input-type=module - "$ROOT" <<'JS' || { echo "verify: FLOW BROKEN"; exit 1; }
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { pathToFileURL } from 'node:url'
const { normalizeEmail, normalizePhone } = await import(pathToFileURL(`${process.argv[2]}/functions/api/lead.js`))
const base = `http://127.0.0.1:${process.env.VERIFY_PORT}`
const sha = (s) => createHash('sha256').update(s).digest('hex')
const lead = { event_id: 'verify-1', event_name: 'Lead', qualified: true, name: 'Pat Verify', email: ' Pat.Verify@Example.com ', phone: '(555) 123-4567' }

const post = (payload) => fetch(`${base}/api/lead`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
const captured = async () => (await fetch(`${base}/__captured`)).json()
const reset = () => fetch(`${base}/__reset`, { method: 'POST' })
const by = (calls, part) => calls.filter((c) => c.url.includes(part))

await reset()
assert.equal((await post(lead)).status, 200, 'qualified lead POST status')
let { browserPosts, calls } = await captured()
assert.equal(browserPosts, 1, 'browser POST count')
const [crm, ghl, meta] = [by(calls, '/__fake/crm'), by(calls, '/__fake/ghl'), by(calls, 'graph.facebook.com')]
assert.deepEqual([crm.length, ghl.length, meta.length], [1, 1, 1], 'one CRM, one GHL, one Meta call')
assert.equal(calls.length, 3, 'no other outbound calls')
for (const c of [crm[0], ghl[0]]) {
  assert.equal(c.body.name, lead.name); assert.equal(c.body.email, lead.email); assert.equal(c.body.phone, lead.phone)
}
const ud = meta[0].body.data[0].user_data
assert.equal(ud.em[0], sha(normalizeEmail(lead.email)), 'Meta email hash')
assert.equal(ud.ph[0], sha(normalizePhone(lead.phone)), 'Meta phone hash')

await reset()
assert.equal((await post({ ...lead, event_id: 'verify-2', spam: true })).status, 200, 'spam POST status')
;({ calls } = await captured())
assert.equal(by(calls, '/__fake/crm').length, 1, 'spam reaches CRM')
assert.equal(by(calls, 'graph.facebook.com').length, 0, 'spam makes no Meta call')
console.log('verify: API assertions passed')
JS

VERIFY_BASE="http://127.0.0.1:$PORT" VERIFY_OUT="$TMP/pw" npx playwright test -c .claude/skills/verify/playwright.config.mjs || { echo "verify: FLOW BROKEN"; exit 1; }

echo "verify: PASS"
exit 0
