# Independent audit — KlarWärme Haustechnik, revision 2

**Assessment:** improved source-quality static preview, **not production-ready**. No measured browser rendering, live form delivery, accessibility audit with assistive technology, or Core Web Vitals telemetry is available.

## Issues identified and corrected directly

1. **Mobile service-navigation trap:** previously clicking `Leistungen` on mobile expanded a dropdown instead of navigating to the services overview. The overview is now a real link with a separate expandable button. ARIA relationships and Escape/focus handling have been added.
2. **Unusually small typography / weak tap targets:** increased content, form, link and filter sizes across the design; enlarged the minimum hit areas; improved 320px-specific wrapping and added a mobile-specific hero-image crop.
3. **Uniform tile grid / generic composition:** revised homepage service tiles to a varied editorial composition, made headings and copy more readable, and reduced purposeless effects.
4. **Opaque trust cues:** made illustrative AI imagery visibly identifiable on page and in project gallery; no fake employees, projects, reviews, phone numbers or verified street address were added.
5. **Missing preview SEO safeguards:** removed unsafe staging indexing (`index,follow`) and a placeholder-domain live sitemap declaration; preview now includes `noindex,nofollow,noarchive` plus a staging `robots.txt` crawl block. Production release requires real canonical URLs and domain-specific sitemap.
6. **Forms and file handling:** `method=post`, safer HTTPS endpoint validation, readable local non-submitted summary, submission loading/error handling, file type/count/size limits, and accessible feedback. Backend delivery is still unconnected.
7. **Interactive tool accessibility:** step labels and focus on progression/results, explicit input errors, aria state on filter buttons, and readable funding output. Heat-pump results remain intentionally non-diagnostic.
8. **ICS calendar correctness:** standard UTC `DTSTAMP`, local floating reminder start/end times, future-date guard, text escaping, delayed object URL cleanup. Not a real appointment booking.
9. **Runtime third-party exposure:** removed remote GSAP scripts and replaced motion with small native IntersectionObserver reveals, preserving reduced-motion behaviour and offline capability.
10. **Resource/CLS improvements:** local hero preload and `fetchpriority=high`; images now include intrinsic width/height, lazy loading except primary image, and an optimized approved brand PNG.
11. **Content quality:** added question-and-answer sections on all six major service pages and the knowledge hub without invented promises or customer stories.

## Tests actually executed

- **Static QA:** 17 HTML pages; 711 anchor links counted across the pages; zero missing referenced local files; all 17 pages have one H1, unique document titles, meta descriptions, `lang=de`, skip links, working DOM IDs, parseable Organization structured data, and preview indexing controls. The script checks local references, not external links or search-engine indexing outcomes.
- **Local HTTP smoke test:** after starting `python -m http.server 8766`, all 17 HTML pages and 5 representative CSS/JS/image assets returned **HTTP 200 (22/22)**. This tests the HTTP server and file paths, not page rendering.
- **Syntax:** `node --check` passed for `assets/js/config.js`, `main.js`, and `tools.js`. CSS stylesheet parsed with `tinycss2` and reported zero top-level syntax errors.
- **JavaScript DOM-mock behaviour tests:** five checks passed: (1) heat-pump check progression/result/restart; (2) mobile navigation, keyboard closing and gallery filtering; (3) client-side form draft without false send confirmation; (4) ICS calendar text and funding checklist; (5) file-type filtering. These tests use simulated DOM elements, not a real browser.
- **Static resource measurement:** total local PNG/WebP image files approximately **1.13 MB** excluding retained brand source references. Optimized logo PNG **150,898 bytes**, down from original **357,541 bytes** (approx. 58% reduction). Combined CSS **41,654 bytes** and local JavaScript **16,974 bytes**, uncompressed. No remote scripts are requested by HTML.
- **Known browser limitation:** Chromium/Playwright rejected attempted `http://127.0.0.1`, `http://localhost`, `file://` and `data:` navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. As a result **no valid screen-size render verification** or real-browser interaction report is claimed.

## Responsive / runtime matrix

| Target | Source CSS reviewed | Actual browser rendering tested | Notes |
|---|---|---|---|
| 320px | Yes; dedicated breakpoint | **No** | Needs visual browser QA |
| 375px | Yes | **No** | Needs visual browser QA |
| 390px | Yes | **No** | Needs visual browser QA |
| 768px | Yes | **No** | Needs visual browser QA |
| 1024px | Yes; compact navigation under 1050px | **No** | Needs visual browser QA |
| 1440px | Yes | **No** | Needs visual browser QA |

**Performance:** no Lighthouse score or mobile LCP, INP or CLS measurements are claimed. Those metrics require browser/device testing and real-user measurement on a hosting origin. Targets remain LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile of field data.

## Outstanding production blockers

- Verified business identity, address, phone, email, authorized representative and other applicable DDG impressum details absent. The provided Musterstraße 12 address is not independently verified.
- Legal privacy and imprint draft requires client/legal approval and adaptation to real data processing, hosting and third parties.
- No contact form delivery, email, secure file upload infrastructure, CRM, security/spam protection, or appointment scheduling backend is configured. Existing site provides local-only form preparation and reminders.
- Real staff/project proof and customer consented photos unavailable; gallery remains illustrative.
- Domain, HTTPS hosting, canonical URLs, sitemap, indexing, Google Search Console and real service area business signals unconfirmed.
- Browser visual/keyboard/accessibility/axe QA and Lighthouse mobile performance testing not executed in this environment.
- Independently verify KfW/BAFA promotion eligibility and any current thresholds before publishing.

**Release recommendation:** retain as a professionally improved **staging preview**; complete the above blockers and real-browser QA before declaring production-ready.
