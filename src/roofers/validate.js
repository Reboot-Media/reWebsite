// Field format rules for the pre-qual form. Self-check: `node src/roofers/validate.check.mjs`.

const NAME_PART = "\\p{L}[\\p{L}'’.-]*"
const FULL_NAME_RE = new RegExp(`^${NAME_PART}(\\s+${NAME_PART})+$`, 'u')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/
const CITY_RE = /^\p{L}[\p{L}\s.'’-]*\p{L}\.?$/u
const WEBSITE_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i

/** 10-digit US number (an optional leading 1 is dropped), or '' if it isn't one. */
export function usDigits(phone) {
  let d = String(phone ?? '').replace(/\D/g, '')
  if (d.length === 11 && d[0] === '1') d = d.slice(1)
  // Area code and exchange can't start with 0 or 1 (NANP).
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d) ? d : ''
}

/** Format as the user types: 5551234567 → (555) 123-4567. */
export function formatPhone(raw) {
  let d = String(raw ?? '').replace(/\D/g, '')
  if (d.length === 11 && d[0] === '1') d = d.slice(1)
  d = d.slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export const isFullName = (v) => FULL_NAME_RE.test(String(v ?? '').trim())
export const isEmail = (v) => EMAIL_RE.test(String(v ?? '').trim())
export const isPhone = (v) => usDigits(v) !== ''
export const isCity = (v) => CITY_RE.test(String(v ?? '').trim())
export const isWebsite = (v) => WEBSITE_RE.test(String(v ?? '').trim())
