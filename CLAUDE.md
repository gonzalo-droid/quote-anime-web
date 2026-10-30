# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (use to verify no type errors before finishing)
npm run lint     # ESLint check
```

## Architecture

Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion. Single-page marketing site with one additional route.

**Data flow:** All static content lives in `src/lib/constants.ts` (hero screens, FAQ, nav links, URLs). Components import from there — no API calls, no state management library.

**Animations:** All Framer Motion usage is in client components (`"use client"`). Motion is deliberately minimal: the hero entrance and phone rotation, plus the FAQ accordion (`AnimatePresence`). `AppShowcase` and `Download` are static server components, so don't add per-section scroll reveals. The hero phone cycles through `HERO_SCREENS` every 4.5s via `setInterval` (paused on hover/focus, off with reduced motion).

**Styling:** Light by default with an optional dark theme (`ThemeToggle` in the header adds `.dark` to `<html>` and saves `theme` in localStorage; an inline script in `layout.tsx` applies it before first paint). Custom Tailwind colors (`canvas`, `accent`, `textPrimary`, `textSecondary`, `heart`, `surface`) resolve to CSS variables defined per theme in `globals.css`, so never hardcode hex colors in components. Restart the dev server after editing `tailwind.config.ts`. Two font variables (`--font-playfair`, `--font-inter`) set in `layout.tsx` and consumed via `font-playfair` / `font-inter` Tailwind classes.

**Routes:**
- `/` — landing with Hero → AppShowcase (share, notifications, widget) → FAQ → Download → Footer
- `/privacy-policy` — static legal page with its own header (no shared nav component)

## Key constraints

- Two themes: light (default; `#F7F4FF` canvas, `#6D4AE0` accent) and dark (`#0C0C1E` canvas, `#A78BFA` accent). Both must stay readable (accent is darker in light for contrast).
- Play Store URL: `https://play.google.com/store/apps/details?id=com.gondroid.quoteanime`
- App Store URL: `https://apps.apple.com/pe/app/quoteanime-frases-de-anime/id6762100338?l=en-GB`
- `metadataBase` is set to `https://animequote.app` in `layout.tsx` for OG image resolution — this is the actual registered/connected domain (Vercel project domains are `animequote.app` / `www.animequote.app`).
