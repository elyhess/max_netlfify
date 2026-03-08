# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tattoo inquiry/booking website for MAX VK TATTOOS. Single-page React app (React 19) built with Vite, deployed to Netlify. Uses EmailJS to send form submissions including compressed image attachments.

## Commands

- `nvm use` — use project Node version (22 LTS, defined in `.nvmrc`)
- `npm run dev` — dev server at localhost:5173
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview production build locally
- `npm test` — run tests in watch mode (Vitest)
- `npm run test:run` — run tests once and exit
- `npm run check` — run the test suite once, then build production output

## Environment Variables

Requires `.env` at project root with EmailJS credentials (uses `VITE_` prefix):
```
VITE_EJS_SERVICE=
VITE_EJS_TEMPLATE=
VITE_EJS_PK=
```

## Email Mock Mode

In development (`npm run dev`), email submissions are mocked by default via `VITE_MOCK_EMAIL=true` in `.env.development`. No real EmailJS calls are made.

Mock submissions are saved to `localStorage` and logged to the browser console with a `[MOCK EMAIL]` prefix. To inspect past submissions in DevTools:
```js
JSON.parse(localStorage.getItem("mock_email_submissions"))
```

Production builds (`npm run build`) use `.env.production` with `VITE_MOCK_EMAIL=false`, which sends real emails via EmailJS.

## Netlify Staging Deploy

Use a separate Netlify site for staging so production is never touched.

- **Production site:** `maxvktattoos` (`https://maxvktattoos.com`)
- **Staging site:** `maxvktattoos-staging` (`https://maxvktattoos-staging.netlify.app`)
- **Staging site ID:** `e5fd3895-00e9-47a2-b766-bec99cda4b42`
- **Staging alias URL:** `https://staging--maxvktattoos-staging.netlify.app`

### Deploy staging

Preferred shortcuts (after `nvm use`):

```bash
npm run staging:deploy
npm run staging:status
npm run staging:disable
npm run staging:enable
```

These scripts are defined in `package.json` and always target the staging site ID (`e5fd3895-00e9-47a2-b766-bec99cda4b42`).
They now route through `scripts/netlify-staging.mjs`, so the staging site ID only lives in one place and can be overridden with `NETLIFY_STAGING_SITE_ID` if needed.

Manual equivalent:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use
npx netlify deploy \
  --site e5fd3895-00e9-47a2-b766-bec99cda4b42 \
  --build \
  --alias staging \
  --context deploy-preview \
  --message "staging deploy"
```

Use `netlify deploy` (no `--prod`) so this stays non-production.
The repo may still be linked locally to the production site in `.netlify/state.json`; the staging helper script always passes `--site` explicitly so staging commands cannot accidentally deploy to production.

### Email behavior in staging

Staging must never call EmailJS. `src/services/EmailService.js` enforces mock mode when hostname matches staging patterns (for example `staging--maxvktattoos-staging.netlify.app`), even if env vars are misconfigured.
`netlify.toml` also sets `VITE_MOCK_EMAIL=true` for `deploy-preview` context, which matches the staging deploy command and prevents real EmailJS calls during the build itself.

### Disable staging

Yes, staging can be disabled.

1. **Temporary disable (recommended):** stop creating new staging deploys and stop sharing the staging alias URL.
2. **Hard disable (CLI):** run `npm run staging:disable`.
3. **Hard disable (UI):** deactivate the `maxvktattoos-staging` site in Netlify UI (`Site configuration` -> `General` -> `Danger zone`) so the URL no longer serves the app.
4. **Re-enable later:** run `npm run staging:enable` and then `npm run staging:deploy`.

## Architecture

Single-page app with no routing. All components render in `src/main.jsx` via `createRoot`. The `site-wrapper` div provides the global dark background and contains the animated starfield and all page sections.

### Components

- **Navbar** (`components/navbar.jsx`) — fixed glass-effect nav with Home/Gallery/FAQ/Contact links, animated hamburger menu on mobile, smooth scrolling, and improved keyboard/mobile-menu behavior
- **Intro** (`components/intro.jsx`) — full-viewport hero with floating logo animation, gradient title, "Book Now" and "View Work" CTAs
- **Gallery** (`components/gallery.jsx`) — responsive CSS grid (3 cols desktop, 2 cols mobile) for tattoo work showcase with hover overlays. Currently uses gradient placeholders — replace with real images. Includes Instagram CTA link
- **About** (`components/about.jsx`) — FAQ accordion with accessible button-based toggles and artwork sidebar on desktop (hidden on mobile via CSS)
- **Contact** (`components/contact.jsx`) — booking form with controlled inputs, image upload/compression (via compressorjs, max 6 files), inline error states, and EmailJS integration
- **BackToTop** (`components/back-top.jsx`) — gradient scroll-to-top button
- **Preloader** (`components/preloader.jsx`) — dark background loading spinner
- **Stars** (`components/Stars.jsx`) — animated starfield background generated in React with colored stars (#faeb0b yellow, #f41dcf pink, #1990fe blue)

### Services

- **EmailService** (`services/EmailService.js`) — wrapper around `@emailjs/browser` with mock mode support
- **imageCompressor** (`services/imageCompressor.js`) — compresses uploaded images (quality 0.2, maxWidth 600), deduplicates by filename, and enforces 6-file limit

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
- `scripts/netlify-staging.mjs` — single source of truth for staging Netlify commands
- CSS load order in `main.jsx`: `style.css`
- Static assets (logos) in `src/img/`
