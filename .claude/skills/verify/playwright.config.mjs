import { defineConfig } from '@playwright/test'

// verify.sh boots the server; artifacts stay in its temp dir.
export default defineConfig({
  testDir: '.',
  testMatch: 'verify.flow.mjs',
  timeout: 60_000,
  workers: 1,
  reporter: 'line',
  outputDir: process.env.VERIFY_OUT,
  use: { baseURL: process.env.VERIFY_BASE, browserName: 'chromium' },
})
