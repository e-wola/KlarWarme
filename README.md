# KlarWärme Haustechnik — audited 17-page HTML preview (revision 2)

This project is a **static, interconnected HTML/CSS/JavaScript site**, not a WordPress theme. Its 17-page scope follows the previously approved sitemap. It includes the user-supplied KlarWärme identity and the six-color palette. This is a **preview build; not legally or operationally production-ready**.

## Opening the preview

Extract the ZIP, then open **`index.html`**. The menu, filters, local draft forms, five-step heat-pump check, funding checklist and calendar reminders run without a server. For a closer approximation of a hosted website, run `python -m http.server 8080` from the website folder and browse `http://localhost:8080`.

All pages are linked from navigation or footer. Supported service areas: Sanitärinstallation, Badsanierung, Heizungsmodernisierung, Wärmepumpen, Klima & Lüftung, Wartung & Reparatur. Other pages: homepage, services overview, projects/visual examples, about, service area, guide, interactive heat-pump check, service request, contact, imprint and privacy notice.

## Implemented design and usability fixes

- The actual approved branding is used; a responsive optimized PNG derivative improves logo delivery. The original remains in `assets/images/klarwaerme-logo.png` and source references remain in `brand-reference/`.
- The homepage service tiles now follow a more editorial, asymmetric layout on wide screens; typography, focus visibility, touch-target sizing, mobile imagery crops and CTA readability have been revised.
- Mobile navigation uses a separate accessible services toggle: **Leistungen** itself remains a link. Escape closes the menu and restores focus. Keyboard and screen-reader state is exposed via ARIA.
- User-input forms validate required fields locally, restrict file attachments to up to three JPG/PNG/WebP/PDF files of up to 5 MB each, provide visible status and never pretend to send data in preview mode. A configured HTTPS endpoint remains mandatory for actual submissions.
- Heat-pump check offers a cautious, non-diagnostic result and keyboard-operable controls. The funding tool creates a checklist; it does **not** decide grant eligibility. A maintenance reminder produces an ICS calendar event, **not a booking**.
- Reduced-motion preferences are respected. Small native IntersectionObserver entrance reveals run without Google fonts, analytics or third-party animation libraries, improving offline reliability and reducing third-party requests. If self-hosted GSAP is desired later, add it after browser/consent/performance testing.
- Images have declared dimensions, lazy loading when appropriate, and the primary hero gets high priority. AI-generated illustrative photos are labelled as such; they are **not completed KlarWärme projects or real employees**.
- This preview is intentionally **blocked from search indexing** (`noindex` meta + staging `robots.txt`) pending confirmation of client identity, legal pages and canonical production domain.

## Live integrations needed

- `assets/js/config.js` has `formEndpoint`, `contactEmail` and `phone`, all blank by default. The endpoint must use HTTPS and accept multipart/form-data. **No emails are sent and no leads are stored by default.**
- No booking/calendar API or genuine confirmed slots have been added; the contact form merely records a preferred non-binding appointment date/time.
- Insert verified business address and contact details; legal pages are *drafts* and require professional review.
- Replace or supplement illustrative project images with genuine approved references. Do not invent ratings, qualifications, workmanship guarantees or business history.
- Absolute canonical links, search indexability, production sitemap and verified location structured data must be configured only when a valid domain and legal business details are available.

## Technical tests included

- `python tests/qa-static.py` — static link/asset/metadata/schema/HTML form/JS syntax checks.
- `node tests/qa-behavior.js` — small DOM-mock tests of navigation, filters, form demo mode, heat check, funding checklist, file filtering and ICS reminder.

See **`QA-REPORT.md`** for the actual executed checks, blockers and measured asset sizes. **These tests do not replace real Chrome/Safari/Firefox or assistive-technology audits.** The browser available to this execution environment rejected all navigation, including data: URLs, with `ERR_BLOCKED_BY_ADMINISTRATOR`.

## Launch checklist

Read **`PUBLISHING_CHECKLIST.md`**. This preview's robots policy is **not** meant for a live site; the publishing team must replace it, remove `noindex` *only after approval*, and generate a domain-specific `sitemap.xml` and canonical URLs. A sample XML template is retained with a `.template` extension for reference only. This preview intentionally omits a live sitemap URL.
