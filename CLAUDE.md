# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tattoo inquiry/booking website for MAX VK TATTOOS. Single-page React app (React 19) built with Vite, deployed to Netlify. Uses a Netlify Function + Gmail API (OAuth2) to send form submissions including compressed image attachments.

## Commands

- `nvm use` — use project Node version (22 LTS, defined in `.nvmrc`)
- `npm run dev` — Vite dev server at localhost:5173 (frontend only, no serverless functions)
- `netlify dev` — full local dev (Vite + serverless functions at localhost:8888, loads `.env.local`)
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview production build locally
- `npm test` — run tests in watch mode (Vitest)
- `npm run test:run` — run tests once and exit
- `npm run check` — run the test suite once, then build production output

## Environment Variables

Gmail OAuth2 credentials are set as Netlify environment variables (not in the client bundle):

| Variable | Description |
|---|---|
| `GMAIL_CLIENT_ID` | OAuth2 client ID from Google Cloud Console |
| `GMAIL_CLIENT_SECRET` | OAuth2 client secret |
| `GMAIL_REFRESH_TOKEN` | Long-lived refresh token from OAuth Playground |
| `ARTIST_EMAIL` | Gmail address to send from/to (required) |

For local development with `netlify dev`, add these to `.env.local` at the project root (never committed). See `.env.example` for the template.

## Local Development

Use `netlify dev` to test the full flow locally (frontend + serverless function). It proxies function calls and loads env vars from `.env.local`.

Use `npm run dev` for frontend-only development (form submissions will fail without the function backend).

## Architecture

Single-page app with no routing. All components render in `src/main.jsx` via `createRoot`. The `site-wrapper` div provides the global dark background and contains the animated starfield and all page sections.

### Components

- **Navbar** (`components/navbar.jsx`) — fixed glass-effect nav with Home/Gallery/FAQ/Contact links, animated hamburger menu on mobile, smooth scrolling, and improved keyboard/mobile-menu behavior
- **Intro** (`components/intro.jsx`) — full-viewport hero with floating logo animation, gradient title, "Book Now" and "View Work" CTAs
- **Gallery** (`components/gallery.jsx`) — responsive CSS grid (3 cols desktop, 2 cols mobile) for tattoo work showcase with hover overlays. Currently uses gradient placeholders — replace with real images. Includes Instagram CTA link
- **About** (`components/about.jsx`) — FAQ accordion with accessible button-based toggles and artwork sidebar on desktop (hidden on mobile via CSS)
- **Contact** (`components/contact.jsx`) — booking form with controlled inputs, client-side WebP image compression (canvas-based, max 6 files), inline error states, and Gmail API integration via Netlify Function
- **BackToTop** (`components/back-top.jsx`) — gradient scroll-to-top button
- **Preloader** (`components/preloader.jsx`) — dark background loading spinner
- **Stars** (`components/Stars.jsx`) — animated starfield background generated in React with colored stars (#faeb0b yellow, #f41dcf pink, #1990fe blue)

### Services

- **EmailService** (`services/EmailService.js`) — sends inquiry JSON to `/api/inquiry` via fetch
- **imageCompressor** (`services/imageCompressor.js`) — canvas-based WebP image compression (iterative quality/scale reduction), deduplicates by filename, and enforces 6-file limit. Images are compressed at submit time and sent as base64 data URLs.

### Netlify Function

- **inquiry** (`netlify/functions/inquiry.ts`) — receives form JSON, builds MIME email with attachments using nodemailer's MailComposer, sends via Gmail API with OAuth2. Email is sent from/to the artist's Gmail with `replyTo` set to the client's email.

## Design System

### Color Palette (CSS Custom Properties in `style.css`)

| Token | Value | Usage |
|---|---|---|
| `--neon-pink` | `#f41dcf` | Primary accent, buttons, focus states, FAQ toggle |
| `--neon-yellow` | `#faeb0b` | Hero gradient, star colors |
| `--neon-blue` | `#1990fe` | Links, secondary accent, star colors |
| `--neon-cyan` | `#00C0FF` | Gallery gradients |
| `--bg-dark` | `#090A0F` | Page background, preloader |
| `--bg-lighter` | `#1B2735` | Radial gradient lighter end |
| `--glass-bg` | `rgba(255,255,255,0.04)` | Glass card backgrounds |
| `--glass-border` | `rgba(255,255,255,0.08)` | Glass card borders, input borders |
| `--text-primary` | `#ffffff` | Headings, primary text |
| `--text-secondary` | `rgba(255,255,255,0.7)` | Body text, descriptions |
| `--text-muted` | `rgba(255,255,255,0.4)` | Placeholders, disabled text |
| `--gradient-primary` | `linear-gradient(135deg, #f41dcf, #1990fe)` | Buttons, section titles, success icon |
| `--gradient-rainbow` | `linear-gradient(90deg, #00C0FF, #FFCF00, #FC4F4F, #00C0FF)` | Button hover animation |

### Typography

- **Font:** Space Grotesk (loaded via Google Fonts in `index.html`)
- **Weights:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Section titles:** gradient text using `-webkit-background-clip: text`
- **Hero title:** 3.5rem desktop / 2.2rem tablet / 1.8rem mobile

### Core UI Patterns

- **Glass cards** (`.glass-card`): `backdrop-filter: blur(16px)` with subtle border. Used for FAQ items, contact form, info cards
- **Neon buttons** (`.btn-neon`): rounded pill shape, uppercase, letter-spacing. Two variants:
  - `.btn-neon-primary` — gradient background with glow shadow, rainbow animation on hover
  - `.btn-neon-outline` — transparent with border, neon-pink on hover
- **Dark inputs** (`.input-dark`): dark translucent background, neon-pink focus ring
- **Section layout**: `.section-padding` for vertical spacing, `.section-header` with `.section-title` + `.section-subtitle` for consistent section headings
- **Responsive utility**: `.hidden-mobile` hides elements below 768px

### Design Principles

- **Dark theme throughout** — no white cards or light backgrounds. Everything floats on the dark starfield
- **Glassmorphism** — translucent cards with blur for depth
- **Neon accents** — matches the artist's colorful, trippy tattoo style
- **Mobile-first responsive** — CSS media queries handle layout
- **Animations should be subtle** — floating logo, hover transforms, accordion transitions. No jarring movements

### CSS Organization (`src/style.css`)

Ordered by: Custom Properties → Base → Site Wrapper → Glass Card → Section Common → Utility → Navbar → Hero → Buttons → Gallery → FAQ → Contact → Back to Top → Preloader → Responsive

### Key Files

- `src/style.css` — all custom styles with CSS custom properties
- `src/components/Stars.jsx` — starfield animation layer
- `index.html` — Google Fonts link for Space Grotesk
- `netlify/functions/inquiry.ts` — Gmail API serverless function
- `scripts/gmail-oauth-setup.mjs` — one-time OAuth token retrieval
- CSS load order in `main.jsx`: `style.css`
- Static assets (logos) in `src/img/`
