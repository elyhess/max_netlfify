# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tattoo inquiry/booking form for MAX VK TATTOOS. Single-page React app (React 19) built with Vite, deployed to Netlify. Uses EmailJS to send form submissions including compressed image attachments.

## Commands

- `nvm use` — use project Node version (22 LTS, defined in `.nvmrc`)
- `npm run dev` — dev server at localhost:5173
- `npm run build` — production build (outputs to `dist/`)
- `npm run preview` — preview production build locally
- `npm test` — run tests in watch mode (Vitest)
- `npm run test:run` — run tests once and exit

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

## Architecture

Single-page app with no routing. All components render directly in `src/main.jsx` via `createRoot`:

- **Navbar** (`components/navbar.jsx`) — smooth scrolling for `.js-scroll` anchor links
- **Intro** (`components/intro.jsx`) — hero section with logo and CTA buttons
- **About** (`components/about.jsx`) — FAQ section with hardcoded Q&A data
- **Contact** (`components/contact.jsx`) — booking form with image upload, compression (via compressorjs, max 500KB total), and EmailJS integration
- **BackToTop** (`components/back-top.jsx`) — scroll-to-top button with scroll position detection
- **Preloader** (`components/preloader.jsx`) — loading spinner until page load
- **EmailService** (`services/EmailService.js`) — wrapper around `@emailjs/browser` with mock mode support

Key patterns:
- `react-responsive` (`useMediaQuery`) is used throughout for mobile/portrait layout switching
- CSS load order defined in `main.jsx` (bootstrap → style.css)
- `components/stars.scss` provides the animated starfield background
- Static assets (logos) in `src/img/`
