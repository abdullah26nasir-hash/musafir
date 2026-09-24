# Design research notes (Mobbin pass 1, 24 Sep 2026)
Session: Mobbin Team plan, config-c. Searched Nusuk (absent), Muslim Pro (absent),
browsed Travel & Transportation latest, studied Flighty (241 screens) - the best
live-status travel UI in the library.

## Patterns to adopt (report before rebuild, per digest)
1. Plain-fact status rows ("Major Issues" pattern): icon + bold category + one
   human sentence ("Flights are taking off 1h 37m late on average"). Our safety
   board already follows this; extend the same voice to package/trip states.
2. Stat triads with dot+label (SFO card: ON TIME 100% / AVG DELAY 0m / CANCELED 0%):
   candidate for a trip-view "journey readiness" strip (docs done %, permits, alerts).
3. Oversized numeric context rail (8 HOURS / DAY 1) beside timeline items:
   upgrade for the day-by-day itinerary in Trip view.
4. Bottom sheets for detail (airport card opens sheet), minimal 4-tab bar:
   relevant when we go native-shell; web app keeps top nav for now.
5. Status is always color + word, never color alone (matches our a11y floor).

## Anti-patterns confirmed to avoid
- Generic travel-app stock imagery heroes (every mediocre travel app).
- Illegible mini-mockups; invented ratings. Nothing fake: every number sourced.
