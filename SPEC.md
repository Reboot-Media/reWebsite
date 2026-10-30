# Connect privacy preparation

## Goal
Prepare truthful public privacy disclosures and Google OAuth review materials for Reboot Connect, without publishing or modifying account access.

## Baseline and scope
- Base: website `origin/main` e05b9f5, including merged terms PR #50.
- `public/privacy.html`: preserve the October 5 published policy text; add a separate Connect section and update effective date.
- `docs/google-oauth-review.md`: exact current scopes, justifications, real-flow demo checklist and known approval dependencies.
- `SPEC.md`: this local change contract.

## Constraints
No changes to Connect code, secrets, deployed resources, other checkout work, pricing, or terms. No commits/push/deploy. The live policy differs from source only by Cloudflare email obfuscation; preserve original semantic content. Describe actual 15-minute application token limit and activity-driven cleanup, not guaranteed physical deletion. Distinguish OAuth revocation from permissions already granted. No certification of legal compliance or Google approval.

## Verify
`npm run build`; compare dist/privacy.html and public/privacy.html; `git diff --check`; bounded static checks that pre-existing policy paragraphs remain and required links/scopes are present; local preview HTTP200 and desktop/360px layout inspection with no horizontal overflow.

## Done when
The local policy and review document match current app behavior, build and layout checks pass, and outstanding approvals/human-account tests are clearly identified.
