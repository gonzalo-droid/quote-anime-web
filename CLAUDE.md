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

**Data flow:** All static content lives in `src/lib/constants.ts` (quotes, features, URLs). Components import from there — no API calls, no state management library.

**Animations:** All Framer Motion usage is in client components (`"use client"`). Page-level animations use `useInView` + `AnimatePresence`. The hero quote rotates every 4s via `setInterval`.

**Styling:** Dark-only (no theme toggle). Custom Tailwind colors (`bgDark`, `accent`, `textPrimary`, `textSecondary`, `heart`, `surface`) defined in `tailwind.config.ts`. Two font variables (`--font-playfair`, `--font-inter`) set in `layout.tsx` and consumed via `font-playfair` / `font-inter` Tailwind classes.

**Routes:**
- `/` — landing with Hero → Features → Screenshots → Download → Footer
- `/privacy-policy` — static legal page with its own header (no shared nav component)

## Key constraints

- Dark mode only — `#0C0C1E` background, `#A78BFA` accent. Never add a light mode toggle.
- Play Store URL: `https://play.google.com/store/apps/details?id=com.gondroid.quoteanime`
- App Store URL: `https://apps.apple.com/pe/app/quoteanime-frases-de-anime/id6762100338?l=en-GB`
- `metadataBase` is set to `https://quoteanime.app` in `layout.tsx` for OG image resolution.
