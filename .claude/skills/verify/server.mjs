// Local verify server: static dist + the REAL /api/lead handler with every
// outbound fetch stubbed (nothing leaves the machine, Meta included).
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const PORT = Number(process.env.VERIFY_PORT || 5196)
const DIST = resolve(process.env.VERIFY_DIST || 'dist')
const ROOT = resolve(import.meta.dirname, '../../..')

let calls = []
let browserPosts = 0
const pending = []

// Must be replaced BEFORE lead.js is imported. Never calls the original fetch.
globalThis.fetch = async (url, init = {}) => {
  let body = init.body
  try { body = JSON.parse(body) } catch { /* keep raw */ }
  calls.push({ url: String(url), body })
  return new Response('{"ok":true}', { status: 200, headers: { 'Content-Type': 'application/json' } })
}
const { onRequestPost } = await import(pathToFileURL(join(ROOT, 'functions/api/lead.js')))

const env = {
  CRM_FORM_SECRET: 'dummy',
  CRM_FORM_URL: `http://127.0.0.1:${PORT}/__fake/crm`,
  GHL_WEBHOOK_URL: `http://127.0.0.1:${PORT}/__fake/ghl`,
  META_CAPI_TOKEN: 'dummy',
}
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' }

const readBody = (req) => new Promise((ok) => { const c = []; req.on('data', (d) => c.push(d)); req.on('end', () => ok(Buffer.concat(c))) })

async function handleLead(req, res) {
  browserPosts++
  const request = new Request(`http://127.0.0.1:${PORT}/api/lead`, { method: 'POST', headers: req.headers, body: await readBody(req) })
  const out = await onRequestPost({ request, env, waitUntil: (p) => pending.push(p) })
  res.writeHead(out.status, { 'Content-Type': 'application/json' })
  res.end(await out.text())
}

async function handleCaptured(res) {
  await Promise.all(pending.splice(0))
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ browserPosts, calls }))
}

async function readFileOr(path) {
  try { return await readFile(path) } catch { return null }
}

async function serveStatic(url, res) {
  const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  let path = join(DIST, rel)
  if (!path.startsWith(DIST)) path = join(DIST, 'index.html')
  const data = (await readFileOr(path)) ?? (await readFileOr(`${path}.html`))
  const file = data ?? (await readFileOr(join(DIST, 'index.html')))
  const type = data ? MIME[extname(path)] ?? 'application/octet-stream' : 'text/html'
  res.writeHead(file ? 200 : 404, { 'Content-Type': type })
  res.end(file ?? 'not found')
}

async function route(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  const key = `${req.method} ${url.pathname}`
  if (key === 'POST /api/lead') return handleLead(req, res)
  if (key === 'GET /__captured') return handleCaptured(res)
  if (key === 'POST /__reset') { pending.length = 0; calls = []; browserPosts = 0; res.writeHead(204); return res.end() }
  if (url.pathname.startsWith('/__fake/')) { res.writeHead(200); return res.end('{}') }
  return serveStatic(url, res)
}

http.createServer((req, res) => route(req, res).catch((e) => { res.writeHead(500); res.end(String(e)) }))
  .listen(PORT, '127.0.0.1', () => console.log(`verify server on http://127.0.0.1:${PORT}`))
