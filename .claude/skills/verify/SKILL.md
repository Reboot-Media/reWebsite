---
name: verify
description: Build the Reboot site and drive pre-qual form submit -> one lead forwarded end to end; run before every commit.
---
# verify

**Proves:** the built site's `book_call` pre-qual form, completed in Chromium, sends exactly one `POST /api/lead`, and the real `functions/api/lead.js` forwards one CRM, one GHL and one Meta call carrying the exact name, email and phone. Also checks the API-level cases (hashes, spam flag) and that no non-127.0.0.1 request completes.

**Run:** `.claude/skills/verify/verify.sh` (about 8s). Exit 0 pass, 1 flow broken, 2 could not boot (build or server).

**Reading a failure:** `verify: FLOW BROKEN` means an assertion failed; the message above it names it (for example `one browser POST /api/lead` Expected 1, Received 2 = double submit). Playwright traces/screenshots land in a temp dir that is deleted on exit; rerun `npx playwright test -c .claude/skills/verify/playwright.config.mjs` with `VERIFY_BASE` and `VERIFY_OUT` set against a running `server.mjs` to keep them.

**Needs:** node, `@playwright/test` with chromium cached (`npx playwright install chromium`), free port 5196 (`VERIFY_PORT`). No `.env*` is read; all outbound hosts are stubbed or aborted.

**Not covered:** prerender. `scripts/prerender.mjs` hardcodes `dist/`, so verify does a plain client build into a temp dir and skips it.
