# Musafir - Design System (v1)
Concept: the safety-first Umrah companion. The kiswa's black cloth and gold band, the Green Dome, desert light. Calm authority: this app tells you true things about your safety.

## Palette (named, 6 + status)
- kiswa  #0D140F  primary surface (the cloth)
- ink    #152019  raised surface
- gold   #C7A24B  signature accent (embroidered band) - actions, key data
- dome   #1B6B54  deep green secondary (Green Dome) - safe/affirming surfaces
- sand   #F5F0E4  primary text on dark / light sections
- mist   #948C77  secondary text, hairlines
- status: clear #3FA96C / caution #D9A03F / warning #C24E38 - NEVER color alone; always icon + label

## Type
- Display: Clash Display (600/700) - headlines, big numerals
- Body/UI: Manrope (400-800) - everything else, controls in sentence case
- Arabic: Amiri - bismillah and city names in Arabic, used sparingly, gold
- Numerals: tabular for times/prices

## Signature element
The Status Arc: a thin gold arc across the top of key screens carrying the live
safety state of the journey (advisory, heat, crowds) as labelled nodes.
Secondary motif: the 8-point khatam star - loader, bullets, faint watermark.

## Rules
- Radius: cards 20px, chips full. gap-* not space-*. Hairline borders mist/20.
- Shadows: layered neutral presets (see digest); lg only on hero/modal.
- Motion: press scale(.97) 160ms ease-out; transitions <300ms; ease-out
  cubic-bezier(0.23,1,0.32,1); reduced-motion -> cross-fade only.
- Copy: plain words, sentence case, controls say what they do ("Save plan").
  Reverent content, modern craft. No filler, no invented proof.
- Every live datum shows its source + age ("FCDO, updated 20 Sep"). Stale data
  says so. Fallbacks are bundled and labelled.
- a11y floor: AA contrast, 44px targets, visible focus, icon+text for status.
