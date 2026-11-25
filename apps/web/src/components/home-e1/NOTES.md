# Home E.1: notes for the Lazy Eye sub-site

Shelved on 2026-11-24. It did not work as the YVML home page, and the idea is kept for the Lazy Eye sub-site. Nothing here is
deleted; the page still runs at `/home/e1`. This file is what to read first when it is picked up.

## What it is

A scroll-driven site of full-screen cards. Bold minimal type on a solid saturated colour, a roughed duotone photograph on the
right with a halftone over it, one fixed label (the "eyebrow") that stays put while the cards change, a headroom bar, and a
full-screen halftone card for the current exhibition.

## Where everything is

In the app (`apps/web`):

| What | Where |
| --- | --- |
| The page | `src/components/home-e1/HomeE1.tsx`, route `src/pages/home/e1.tsx` |
| The scroll timeline (every scene and step placed on one timeline, in screens) | `home-e1/timeline.ts` |
| Scenes: the slide-in, the fade of the card underneath, the title then button chain | `home-e1/Scene.tsx` |
| The fixed label and its colour morph | `home-e1/Eyebrow.tsx` |
| The headroom bar | `home-e1/Bar.tsx` (the older, non-Framer version is `src/hooks/useHeadroom.ts`, still used by home C) |
| The Lazy Eye halftone scene | `home-e1/LazyEye.tsx` |
| A photograph made a duotone in a canvas | `home-e1/DuotoneImage.tsx` |
| Styles | `home-e1/HomeE1.module.css`, shared pieces in `src/components/home/` |
| The exhibition image | `public/images/lazy-eye/kento-saisho.webp` |
| Fonts (Allo, Instrument Serif) | `public/fonts/` |
| Config | `next.config.ts` (`images.remotePatterns` for `cdn.sanity.io`), `package.json` (`framer-motion` 14.14.0) |

In the mocks branch (`mocks/`), the static prototypes this grew out of, with no framework:

- `mocks/src/yvml/gen.py` builds `home-e` (full-bleed cards) and `home-e1` (saturated duotone). `yvml.css` and `yvml.js` hold the CSS-only
  sticky stack and the first Lazy Eye canvas. This was the version that looked best in a screenshot.
- `mocks/dist/assets/img/kento-saisho.webp` is the exhibition image.
- `mocks/dist/index.html` links the home-a to home-e1 prototypes by hand; `make.py` does not generate those links.

## The design, as the user specified it

- Bold, minimal text with saturated colour. Each card is a label, a title and one button. No boxes, chips, hint copy or extra metadata.
- Solid colour on the left. The photograph sits on the right. Between them is a smooth gradient with no hard edge (it is an eased mask, not two
  stops).
- The photograph is a roughed-up, high-contrast duotone, slightly halftoned. Pairs (shadow, highlight): blue/yellow `#0a24d6/#ffe45c`,
  crimson/pink `#a30f2d/#ffb3c7`, forest/lime `#00563a/#d9ff66`, violet/peach `#4a0fc2/#ffc08a`, teal/blush `#00585f/#ffd1c4`. Neighbouring cards never share a pair.
- Every card is 100dvh and full width. The next card slides over the previous one, and the one underneath fades fully to its base colour, its
  text sooner than its photograph (photograph gone by 62% covered, text by 29%).
- One eyebrow, fixed in place, that does not move. Its colour morphs between cards. It loads after the rest of its card, including the photograph.
- A headroom bar, as Headroom.js does it: gone when scrolling down, back when scrolling up, wordmark and Menu only. It takes the colour of
  the card behind it.
- Lazy Eye, in this order as you scroll: the halftone alone, then "Lazy Eye Gallery", then "Kento Saisho" as the dots become the
  object, then the dates, then the object fades out. The name sits over the dots with no block behind it. The dots are cleared in a band only
  behind the artist's name and dates. The text is white with a difference blend. Exhibition: Kento Saisho, October 1 – November 15, 2026.
- Never use the cast glass pulley wheel photograph (`w04`).
- No hero statement text unless the user asks for one. No slideshow. No progress indicator on the hero video.

## How the Framer Motion version works

One scroll value drives everything, so nothing reads the scroll on its own.

1. The track is `(length + 1)` screens tall, with one sticky 100dvh stage inside it. `useScroll({ target, offset: ['start start', 'end end'] })`
   gives progress, and `t = progress * length` is the timeline in screens.
2. `place()` in `timeline.ts` puts the scenes one after another. A scene slides in over `ENTER` (0.5) and rests for `HOLD` (0.9). The hero takes
   no time. Lazy Eye rests for its story (3 screens) plus 0.3.
3. A scene's own steps are windows after it settles (`CHAIN`): the title (from 0.15 before settling to 0.2 after), the button (0.1 to 0.3), the
   label (0.25 to 0.45). The label also waits for its photograph (`DuotoneImage` calls `onReady`).
4. `covered` is how far the next scene has slid over this one. The photograph and text fade from it.
5. The bar's colour and the label's colour are `useTransform` over the scenes' palettes. The bar changes when the next card is 60% up to it,
   because that is when the card behind the bar changes.
6. Lazy Eye's story progress is a spring of the scene's scroll. The dots, the names and the dates all read that one spring, in windows of 0 to 1:
   name in 0.08 to 0.2, out 0.28 to 0.36; artist in 0.38 to 0.5; the object forms 0.3 to 0.6; dates in 0.58 to 0.7; the object out 0.8 to 0.94.

## What went wrong, and what was learned

- **Live SVG filters make scrolling stutter.** The first duotone used `filter: url(#...)` with `feTurbulence` and `feDisplacementMap` on five full-size photographs
  that were also transformed and faded every frame. Chrome re-ran the filters on the main thread. Make the duotone once, in a canvas. Blend modes are cheap but
  cannot do an exact two-colour mapping (per-channel `lighten` washes out to lilac).
- **Sanity's image host does not send CORS headers**, so a canvas cannot read its pixels. Route images through Next (`/_next/image?url=...&w=1200`)
  with `images.remotePatterns` for `cdn.sanity.io`. The dev server must be restarted after that config change.
- **A sticky stack built from CSS plus scroll listeners** (the first attempt) had every card, the bar and the label reading the scroll on their own.
  Results: the bar took the next card's colour at 50% covered instead of when that card reached it, the label showed before its card's photograph, and
  the bar flickered on small direction changes. Fixes: choose the card behind a line near the bar; gate the label on photograph readiness; judge scroll
  direction over a distance (show after 18px up, hide after 36px down).
- **A timeline bug that looked like lag:** the hero had been given a rest, so every card started 0.55 screen late. Check the timeline value against scroll
  first (`t` at 540px of scroll should be 0.6) before blaming the animation.
- **Never reset a CSS transition on every tick.** Setting `transition: none` on the next scroll tick cancelled the label's fade mid-way and it snapped on.
- **The eyebrow's text must swap while it is invisible**, after the old label has finished leaving, or the new text flashes during the fade-out.
- **A crossfade of two difference-blended names turns grey.** Let one finish leaving before the next arrives.
- **The negative margin trick** (`.le + * { margin-top: -100vh }`) made the next card overlap the end of the pinned Lazy Eye scene in the CSS version. The Framer
  version does not need it.

## Still unresolved

- The user saw "stuck" scrolling and odd rectangles (a teal block over the Testimonial card, cards not spanning the width) in their own browser. None of it
  reproduced in headless Chrome here. The cause is not known. A compositing problem with sticky layers, masks and blend modes is the best guess.
- Not tested: phone layouts, dark mode, a real mouse wheel or trackpad, reduced motion on the Framer version, or the open Menu panel.
- The page is about 17 screens long. Pacing was never settled.
- Lazy Eye's dots were judged "too intense" once and softened. The right amount is a taste call.

## When it is picked up

1. Ask the user for a screen recording from their own browser and machine, and look at it before changing anything.
2. Run a trace in the Performance tab on a real device while scrolling, and look at paint and layer counts, not just frame time.
3. Decide what a Lazy Eye page needs to be before reusing this code. The home page needed a short route to workshops, events and donating; a gallery
   sub-site has different jobs and probably a different length.
4. The pieces most worth reusing: `DuotoneImage`, the halftone canvas in `LazyEye.tsx`, the eased fade masks, and the `timeline.ts` idea of placing every step in one place.
