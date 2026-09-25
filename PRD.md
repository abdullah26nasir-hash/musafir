# Musafir - Product Requirements Document

**Owner:** Abdullah Mansuri (7 day challenge)
**Status:** Live preview, Phase 1 complete. Function-first phase; branding pass is LAST.
**Preview:** https://musafir-x7k2q9.pages.dev (unguessable, noindexed, unlisted - do not share publicly)
**Repo:** github.com/abdullah26nasir-hash/musafir, branch `rebuild` (main untouched)
**Last updated:** 24 Sep 2026

## 1. Vision

Safety-first travel companion. Most travel apps treat safety as a footer link. Musafir inverts it: the FCDO live travel advisory is the spine of the product, and every planning feature wraps around it. If the Foreign Office says don't go, Musafir says so plainly, first, before any itinerary, any currency conversion, any excitement.

Product principles:
1. Safety verdict before planning, always.
2. Live data over cached data - advisories change, stale safety info is worse than none.
3. Plain language - advisory legalese gets translated into what it means for the trip.
4. Fast and light - works on a phone on airport wifi.

## 2. Research

**FCDO advisory feed.** The Foreign, Commonwealth & Development Office publishes per-country travel advice. The parser is the most load-bearing code in the app: it must handle partial, ambiguous and tiered wording ("advise against all travel" vs "all but essential travel" vs regional carve-outs within a country). Testing caught a false CLEAR once - a country showing safe when the advisory said otherwise. Parser correctness is treated as a safety feature, not a nicety.

**FX data.** Frankfurter (frankfurter.app) dropped SAR support - discovered in testing. Moved to open.er-api.com/v6/latest/GBP: keyless, CORS-open, includes SAR and the full Gulf currency set that matters for the target user.

**Design bar.** The Design Method Digest doc is the reference standard for the eventual branding pass. Adopted now: accordion motion patterns, integration standards. Rejected for now: heavy WebGL showcase components - wrong weight class for a safety tool on airport wifi.

**Competitive shape.** Gov.uk travel advice pages are comprehensive but dense; generic trip planners ignore safety status entirely. The gap Musafir occupies: advisory-led planning in one flow.

## 3. Features

### Phase 1 - Shipped (current preview)
- [x] Landing page: 3-step how-it-works section, edge-case strip (what happens when advisories change mid-plan)
- [x] Live FCDO advisory fetch + parser with tier handling (all-travel / all-but-essential / regional)
- [x] Trip planning flow wrapping the advisory verdict
- [x] Chat-first planner: scripted 6-question conversational flow (city, travellers, month, nights, budget, city order) producing the same plan as the form, with two-way switching
- [x] Landing redesign: chat-led hero, spinning star, gold glow, dual CTA
- [x] Official updates panel on Safety: curated links to alharamain.gov.sa, prh.gov.sa, nusuk.sa, GOV.UK FCDO with "last checked" date, no real-time claims
- [x] WCAG 2.1 AA contrast fixed (gold/caution darkened to 4.5:1), all touch targets >= 44px, hash back/forward navigation
- [x] Currency conversion (open.er-api.com, GBP base, SAR + full currency set)
- [x] PostHog analytics - EU host, lazy-loaded chunk, public project key only (no secrets client-side), app chunk ~60KB gzip
- [x] Security headers: CSP (incl. eu-assets.i.posthog.com in connect-src), X-Frame-Options DENY, X-Content-Type-Options nosniff, noindex
- [x] Every-button interaction crawl clean on mobile + desktop, zero console errors
- [x] Pen test passed before the preview link shipped

### Phase 2 - Next: persistence
- [ ] Save trips (destination set, dates, notes) and return to them
- [ ] Trip share links (read-only view for travel companions)
- [ ] Recent destinations / history

### Phase 3 - Accounts + alerts
- [ ] Sign-in (only if Phase 2 proves persistence value)
- [ ] Advisory change alerts: notify when a saved destination's FCDO status changes
- [ ] Pre-trip checklist generated from advisory content (insurance requirements, entry rules)

### Phase 4 - Branding (LAST, per standing sequencing)
- [ ] Full design pass against the Design Method Digest bar
- [ ] Name, identity, motion system

## 4. Data & schemas

**Today: stateless.** FCDO data is fetched live; nothing is stored; there is no database. This is deliberate - a safety tool with no persistence has no stale-data risk and no privacy surface.

**Phase 2 schema (Cloudflare D1, when persistence ships):**

    trips(id TEXT PRIMARY KEY, owner_key TEXT, title TEXT, created_at TEXT, updated_at TEXT)
    trip_destinations(trip_id TEXT, country_code TEXT, advisory_tier TEXT, added_at TEXT)
    trip_notes(trip_id TEXT, body TEXT, created_at TEXT)

owner_key is an anonymous browser-held key (same pattern as Rally's member_key) until Phase 3 accounts exist. advisory_tier is snapshotted at save time for change-detection in Phase 3; the live verdict always comes from the live feed.

## 5. Platform & database decision

**Decision (24 Sep 2026):** Hosting on Cloudflare Pages; future database on **Cloudflare D1**.

Evaluated: D1 vs Supabase vs Neon vs AWS (full comparison done 24 Sep, live pricing sources). D1 wins for this portfolio shape: no inactivity pause (Supabase free pauses after 1 idle week, caps at 2 projects), no metering surprises (Neon burns CU-hours then pay-as-you-go), no DevOps tax or bill-on-overrun (AWS). D1 free: 10 databases, 500MB each, 5M rows read + 100k written per day account-wide, hard stops not bills. Growth path if an app pops: Workers Paid at $5/month flat covers the whole account. Escape hatch if Postgres semantics are ever genuinely needed: Neon free tier behind Cloudflare Hyperdrive.

## 6. Security & privacy

- No accounts today = no personal data held
- No secrets client-side; PostHog public key only (designed to be public)
- Preview URLs: unguessable slug, noindex header, unlisted
- Pen test before any link ships (standing rule, all apps)
- Never commit .env or keys; secrets scan runs on every push

## 7. Testing protocol (standing)

1. Every-button crawl: every interactive element exercised on mobile AND desktop breakpoints, zero console errors allowed
2. Visual verification on real breakpoints - screenshots inspected, not assumed
3. Advisory parser regression cases: false-CLEAR is a sev-1 bug class
4. Pen test: headers, injection surface, secret leakage
5. Only then does the preview link move

## 8. Analytics

PostHog (EU cloud), project 283655. Lazy-loaded so analytics never blocks the safety verdict. Events: page views, advisory lookups, trip flow steps.

## 9. Decisions log

- 24 Sep: FX provider switched Frankfurter -> open.er-api.com (SAR support)
- 24 Sep: PostHog EU; lazy chunk keeps app chunk ~60KB gzip
- 24 Sep: Rebuild on `rebuild` branch; main stays clean
- 24 Sep: Design guides are reference, not mandate (motion + standards adopted, WebGL showcase rejected)
- 24 Sep: D1 selected for future persistence (see section 5)
- 24 Sep: Sequencing fixed - function + full testing first across all apps, branding deep-dive LAST
- 25 Sep: Chat is scripted, not model-backed (ships free; a real model can come later behind a key)
- 25 Sep: Haramain updates = curated official link-out panel, not a scraped feed (official RSS stale; X API paid; SPA terms ban scraping)
- 25 Sep: Plan nav opens chat as the default planning entry; form remains first-class

## 10. Open questions

- Phase 3 accounts: email-link sign-in vs anonymous-only with device keys? Decide when Phase 2 usage data exists.
- Advisory alerts delivery channel (email vs push) - needs accounts decision first.

---

## How this app is built (agentic workflow)

Practices folded in from spec-driven development research (GitHub Spec Kit, Sept 2025; Kiro; SDD guides):

1. **Spec before code.** Every feature starts as a short written spec in this PRD: Goal, Requirements, Constraints, Acceptance criteria. Nothing gets built from a vague prompt.
2. **Living document.** This PRD is the source of truth. When intent changes, the spec changes first, then the code. The repo copy (PRD.md) is synced on every ship.
3. **Small, reviewable tasks.** Work is broken into chunks that can be tested in isolation, then reviewed against the spec's acceptance criteria - not against vibes.
4. **Verification gates.** Every build passes an every-button interaction crawl (mobile + desktop), zero-console-error check, and a pen test before any preview link ships. Preview links are unguessable, noindexed, unlisted.
5. **Sequencing.** Function and full testing first; branding deep-dive last.
6. **Free tiers only.** Anything that could bill gets flagged before use; platforms chosen for hard quota stops, not billing alerts.
