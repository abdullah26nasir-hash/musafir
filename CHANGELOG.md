# Changelog

## 24 Sep 2026 - Live travel updates
- Safety now has a "Live travel updates" feed: latest official updates for Musafir destinations, pulled server-side and normalised into one list.
- Sources v1: GOV.UK FCDO travel-advice updates (filtered to Saudi Arabia, Turkey, UAE, Morocco, Egypt, Jordan, Qatar, Pakistan, Malaysia, Indonesia), NATS (UK airspace), Eurocontrol (European airspace). All free, official, machine-readable.
- New /api/updates Pages Function: fetches feeds at the edge, 15-min cache, per-source failure isolation, 8s timeouts.
- Parked: @HaramainInfo + airline/airport X accounts - X's API has no free read tier; needs a paid plan decision.
