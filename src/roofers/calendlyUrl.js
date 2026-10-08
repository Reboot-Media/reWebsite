// Shared by CalendlyEmbed (lazy chunk) and the form's fallback link, so the
// fallback works even when the CalendlyEmbed chunk fails to load.
const DEFAULT_CALENDLY_URL = 'https://calendly.com/hello-rebootmedia/strategycall'

export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || DEFAULT_CALENDLY_URL
