# Google OAuth review preparation

Prepared October 29, 2026. This is a local checklist, not evidence of approval or completed live provider tests.

## Identity and public URLs
- App: Reboot Connect, operated by Reboot Media LLC.
- Homepage: https://connect.rebootmedia.us
- Privacy: https://rebootmedia.us/privacy
- Terms: https://rebootmedia.us/terms
- Contact and intended manager/Editor recipient: hello@rebootmedia.us
- Ads manager: 973-747-4674.
- Google Cloud project: clients-1783379591095; project number 674178646571.
- OAuth callback: https://connect.rebootmedia.us/api/oauth/callback

Before submission, confirm these exact URLs in Google Auth Platform Branding and the callback in its web OAuth client. Verify domain ownership and that the public app homepage links to the policy. No account settings were changed for this preparation.

## Scopes and narrow justifications

| Exact scope | Current user-facing need | Why a smaller scope is insufficient |
|---|---|---|
| `https://www.googleapis.com/auth/adwords` | Discover accessible advertiser accounts, select one, link it to Reboot's manager, and read back the resulting link. | Google Ads linking requires Ads authorization; a sign-in identity scope does not authorize account discovery or manager-link operations. The onboarding app does not create or manage campaigns. |
| `https://www.googleapis.com/auth/business.manage` | List the user's Business Profile locations, invite the designated Reboot account as manager of the selected location, and check invitation/access status. | Identity-only authorization cannot list locations or create the selected manager invitation. No ownership transfer or automatic invitation to every location is requested. |
| `https://www.googleapis.com/auth/drive.file` | Create one client-owned folder through Connect, grant Reboot Editor access, and verify that permission. | A read-only scope cannot create or share the folder. Broad full-Drive access is unnecessary; this app uses the file-specific scope. |

The app requests scopes separately, in context, with online client access. It does not request offline client refresh-token access. The agency's separate Ads refresh credential is an operator credential and must never appear in the demo.

## Record an actual working review demonstration

Use a controlled business account you are authorized to manage, in a staging or hidden test flow for unverified scope review. Use genuine Google screens and genuine API results; do not fabricate success or edit out a failure to imply completion.

1. Show the public homepage, privacy link, application name, and browser address bar.
2. Open a fresh private invitation that includes the Google providers being reviewed. Do not reveal the full secret invitation fragment, the admin password, client secret, tokens, or other clients' records in the recording.
3. Start Google Ads, show account selection and the full consent flow with the requested permission. Include the unverified-app screen if Google shows it for the test account. Show the app's advertiser selection and explicit approval, then show the resulting link to manager 973-747-4674 and confirmation in Google Ads. A green configuration flag is not proof.
4. Repeat the actual authorization and selection/approval flow for Business Profile after project API access is approved. Show the chosen location and manager invitation/access status accurately; pending is not accepted access.
5. Repeat Drive authorization with only `drive.file`, explicitly approve folder creation/sharing, then show the new folder in the test account's Drive and its Editor permission for hello@rebootmedia.us. Do not show unrelated file contents.
6. Explain how clients revoke app authorization and separately remove granted platform permissions; show the policy's deletion contact.
7. Provide English narration or captions explaining each requested scope and its actual use. Keep the app identity and relevant browser URL visible. Show the OAuth client identity required by Google's review without displaying its secret.
8. Upload the demonstration to YouTube as unlisted and paste the link into Google Auth Platform's verification submission. Recheck the final requested scope list, justifications, branding, and policy URLs before submitting.

## Pending dependencies and evidence required

- Business Profile application was submitted under case `1-0131000042052`; last user-supplied quota evidence was 0 QPM. Google quoted 7–10 business days. Do not submit duplicate cases. Confirm nonzero quota on the same Cloud project before testing location discovery again.
- OAuth sensitive-scope verification has not been submitted, per the last user confirmation. The Google Ads Explorer access level is a separate approval and does not remove the unverified-app warning.
- Public policy changes must be reviewed and deployed before using their URL in a new verification submission. This local draft is not published.
- Read-only audit on October 29 confirmed live Connect commit `efc740378f078a2966ad601bb5532aa87558aabc` (`efc7403`) and all migrations `0001`–`0004` applied in the dedicated production database. Terms PR #50 is merged and the public `/terms` page is live. Remaining evidence: successful Ads link and Drive share readbacks on an authorized test account. The operator must complete Google login/consent; no such action was performed here. Audit evidence: `/private/tmp/reboot-google-readiness-2026-10-29.md`.
- Confirm privately that any credentials previously exposed in screenshots were revoked/replaced. Never paste replacements into chat or source control.
- The current app has no scheduled purge or fixed automatic deletion deadline for invitation/connection records. The policy states that limitation; choose and implement an operational retention schedule separately before making stronger promises.

## Official references
- https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification
- https://developers.google.com/terms/api-services-user-data-policy
- https://developers.google.com/workspace/drive/api/guides/api-specific-auth
- https://developers.google.com/my-business/content/prereqs

These materials describe the implemented onboarding behavior and support review preparation; they do not certify legal compliance or guarantee Google approval.
