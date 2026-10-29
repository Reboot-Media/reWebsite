# Terms page specification

## Goal
Prepare a public `/terms` page for the website and Reboot Connect, matching the existing privacy page. This is a local review draft, not a published policy.

## Files
- `public/terms.html`: new accessible static page.
- `src/App.jsx`: add a Terms link alongside the existing Privacy link in the current footer.

## Constraints
Keep the existing privacy policy unchanged. Preserve unrelated untracked files. Describe only current selected-provider consent, third-party dependencies and revocation behavior. Separate site usage from signed marketing-service agreements; add no arbitration, indemnity, fee cap, payment or ownership-transfer terms. No commit, push or deployment.

## Verification
`npm run build`; verify `dist/terms.html` matches source and footer links render. Inspect desktop and 360px mobile screenshots locally, checking no horizontal overflow. Verify page links use `/privacy`, `/` and the actual Connect host.

## Done when
The local page builds, renders cleanly, is discoverable from the website footer, and privacy-policy gaps are reported separately without changing the policy.
