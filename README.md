# New Wings Solutions — Cinema Renovation Website (v3)

A bold, magazine-editorial Next.js website for **New Wings Solutions**. Combines rich colorful sections (crimson, navy, mustard) with elegant light sections, oversized editorial typography, and creative SVG animations throughout.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8) ![TS](https://img.shields.io/badge/TypeScript-5-3178c6) ![Motion](https://img.shields.io/badge/Framer_Motion-11-ff0080)

---

## ✨ What's new in v3

- 🎭 **Hero bento collage** — creative tile grid representing all services (screens, projection, audio, seating, interiors, 3D systems, lamps). No more R3F — much lighter, looks crafted instead of generic.
- 🎨 **Bold colored sections**: Brands (crimson red), Products (dark navy), Stats (mustard yellow) — rich, elite, magazine-style
- 📰 **Magazine editorial typography** — huge Fraunces serif headlines with italic accents, oversized numbers, dramatic whitespace
- 🌊 **2+ SVG animations per section** — film reels, sound waves, flowing curves, starfields, projector beams, seat grids, concentric rings, curtain folds, floating tickets
- ⚡ **R3F removed** — site is now 146kB First Load JS (was 145kB with R3F that wasn't rendering well)
- 🌗 **Theme toggle** still works (System / Light / Dark)
- 👁️ **Viewport animations** throughout via `<Reveal>` / `<RevealGroup>` helpers

---

## 🎨 Section color map

| Section | Background | Vibe |
|---|---|---|
| Hero | Light surface | Bento collage of services |
| **Brands** | **Crimson red** `#E0142B` | Powering world's cinemas |
| **Products** | **Dark navy** `#0D2861` | Premium product gallery |
| **Stats** | **Mustard yellow** `#E8A800` | Bold numbers, editorial |
| Process | Light surface | Timeline with colorful nodes |
| Showcase | Soft gray | Bento project gallery |
| Services | Light surface | Magazine-grid services |
| Testimonials | Soft gray | Quote cards |
| FAQ | Light surface | Accordion |
| Contact | Soft gray | Form + contact methods |

---

## 🚀 Run

```bash
npm install
npm run dev
# build: npm run build && npm run start
```

---

## 🎨 SVG Decorations Library

`src/components/ui/Decorations.tsx` exports 12 reusable animated SVG decorations:

1. **FilmReel** — rotating cinema reel
2. **ProjectorBeam** — animated light cone
3. **SoundWave** — animated audio bars
4. **FilmStrip** — perforated film strip
5. **CurtainFolds** — theatre curtain pattern
6. **SeatGrid** — repeating seat rows
7. **FlowingCurves** — animated organic waves
8. **Starfield** — twinkling stars
9. **ConcentricRings** — radiating circles
10. **SpotlightBeams** — dual cone spotlights
11. **ScreenFrames** — nested cinema screens
12. **TicketsFloating** — flying cinema tickets

Mix and match per section.

---

## 📝 Content

Edit **`src/lib/data.ts`** — everything lives there.

---

## 🌐 Deploy

**Vercel** (best): push to GitHub → import → done.

**Hostinger**: needs Node.js plan. Build locally, upload `.next/`, `public/`, `package.json`, `next.config.mjs`. `npm ci --production && npm run start`. Nginx reverse proxy to port 3000.
