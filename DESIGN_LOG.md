# DESIGN LOG — Reboot Media pre-call page

## Locked decisions

- 2026-09-15 — Post-booking preparation page for roofing-company owners reached through cold calling. Scope: this page only.
- 2026-09-15 — Mobile-first responsive web, light default, no navigation, pricing, scarcity, or premature offer CTA. Scope: this page only.
- 2026-09-15 — Reboot purple token ramp is the interface palette; green is reserved for confirmed status. Scope: this page only.
- 2026-09-15 — Visual direction is minimal and light-first: white and soft neutral surfaces dominate; no dark or gradient section containers; purple is limited to hierarchy and status accents. Scope: this page only.
- 2026-09-15 — ADC Roofing keeps its supplied red-and-blue logo, is identified as Dallas, Texas, and anchors the proof section. Scope: this page.
- 2026-09-15 — Primary completion prompt is to reply `WATCHED` in the originating text conversation. Scope: this page.
- 2026-09-15 — Future paid/organic acquisition funnel is a separate design problem; research competitor funnels through Polar before defining its structure or conversion sequence. Scope: future funnel project.

## Deliberate exceptions

- 2026-09-15 — Reboot wordmark is intentionally not linked because this no-navigation preparation page is a focused post-booking flow. Scope: this page.

## Running scorecard

| Date | Artifact | A11y | Layout | Interaction | Type | Doc alignment | Floor | Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-09-15 | Pre-call page, palette and proof revision | A | A+ | A | A+ | A+ | A | None |
| 2026-09-15 | Minimal light-first revision | A | A+ | A | A+ | A+ | A | None |

### 2026-09-15 minimal revision delta

- Removed dark containers from the empty Loom state, ADC case study, and storm-response system.
- Removed the dark background behind the ADC logo; proof hierarchy now comes from type scale and spacing.
- Retained Reboot purple only for labels, icons, and key emphasis; retained green only for the explicit `Confirmed` status.
- Re-ran contrast checks for every changed light-surface pair; all pass WCAG AA and most pass AAA.
- Re-ran the production build and rendered the revised page in the browser. No blockers found.

### 2026-09-15 verification notes

- WCAG contrast script: all tested foreground/background pairs pass AA; most pass AAA.
- True mobile emulation: 390px viewport, 390px document width, no horizontal overflow, all headings remain within the 20px page margins.
- Source audit: one `h1`, descending `h2`/`h3` hierarchy, descriptive ADC logo alternative text, reduced-motion guard on the only animation, no misleading interactive control in the empty Loom state.
- Nielsen review: no heuristic scored 3 or below; the flow has one clear task and uses plain language.
- Build: `npm run build` passes; `git diff --check` passes.
- Not verified: Axe and Lighthouse were unavailable in the local project.
