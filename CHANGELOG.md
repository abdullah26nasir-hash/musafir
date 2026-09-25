# Changelog

## 25 Sep 2026 - Chat planner, landing redesign, official updates panel
- New chat-first planning flow: "Chat with Musafir" asks 6 questions (departure city, travellers, month, nights, budget, Makkah or Madinah first) with chip answers and a typing indicator, then builds the same plan the form produces. The old form stays one tap away in both directions ("Use the form instead" / "Chat instead").
- Landing page rebuilt around the chat: spinning 8-point star, gold glow, dual call-to-action, updated how-it-works, live safety + prayer-times hero cards kept.
- Safety gains an official updates panel: curated links to alharamain.gov.sa, prh.gov.sa, nusuk.sa and GOV.UK FCDO advice with a "last checked" date. No real-time claims; safety-critical info stays anchored to official sources.
- Plan nav now opens the chat; "Adjust plan" returns to the form.
- Accessibility: fixed gold/caution contrast to WCAG 2.1 AA (4.5:1) on light backgrounds, all touch targets >= 44px, hash-based back/forward navigation now works.


## 24 Sep 2026 - Live travel updates
- Safety now has a "Live travel updates" feed: latest official updates for Musafir destinations, pulled server-side and normalised into one list.
- Sources v1: GOV.UK FCDO travel-advice updates (filtered to Saudi Arabia, Turkey, UAE, Morocco, Egypt, Jordan, Qatar, Pakistan, Malaysia, Indonesia), NATS (UK airspace), Eurocontrol (European airspace). All free, official, machine-readable.
- New /api/updates Pages Function: fetches feeds at the edge, 15-min cache, per-source failure isolation, 8s timeouts.
- Parked: @HaramainInfo + airline/airport X accounts - X's API has no free read tier; needs a paid plan decision.
