# KlarWärme — Mandatory production release checklist

**This ZIP is a complete static website preview, NOT a live production website.**

1. Confirm legal business entity, representative(s), business contact email/phone, postal address, actual operating/service area, trade-registration details where required, applicable supervisory/chamber records and actual services. The supplied Musterstraße 12 address was user-provided as project context, not independently verified.
2. Replace legal draft `impressum.html` and `datenschutz.html` with lawyer-checked, implementation-specific content. Confirm the actual hosting provider and privacy data flows. DDG provider identification is mandatory for commercial sites.
3. Deploy HTTPS form backend with server-side field/file validation, spam protection, retention/deletion, correct consent information, secure delivery and anti-abuse controls. No endpoint is configured in the ZIP. The demo's success state is only a local copyable summary.
4. Confirm any booking availability and connect a real system if claiming online booking. Calendar ICS is an end-user reminder only.
5. Replace labelled AI-generated illustrations with real, consented staff/project photos where feasible; do not treat illustration gallery as verified case studies or add fictitious reviews or credentials.
6. Confirm production HTTPS domain, add absolute self-referencing canonical tags, valid OG URLs/images, live sitemap.xml with only indexable URLs, and correct final robots.txt. Remove `noindex,nofollow,noarchive` from approved pages only after all above completed.
7. Self-host or privacy-review any third-party services before adding analytics, embeds, external fonts, or online booking. This audited preview uses native animations and local assets.
8. Test 320/375/390/768/1024/1440 viewport sizes in an actual browser (unavailable in this execution environment); run Lighthouse/axe with deployed preview on normal devices. Fix visual/function defects before approval.
9. Review BFSG applicability with counsel if adding contractual online booking/e-commerce. Build for accessibility regardless.
10. Verify heat-pump/funding content against current KfW/BAFA official pages before publication; the interactive suitability score is not an engineering/eligibility ruling.

Release is blocked until confirmed items are signed off. Staging `robots.txt` blocks crawling and meta robots disallows indexing.
