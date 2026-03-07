# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tattoo inquiry/booking form for MAX VK TATTOOS. Single-page React app (React 16) built with Create React App, deployed to Netlify. Uses EmailJS to send form submissions including compressed image attachments.

## Commands

- `nvm use v12.22.12` — required Node version before running anything
- `npm start` — dev server at localhost:3000
- `npm run build` — production build
- `npm test` — run tests in watch mode (Jest via react-scripts)
- `npm test -- --watchAll=false` — run tests once and exit

## Environment Variables

Requires `.env` at project root with EmailJS credentials:
```
REACT_APP_EJS_SERVICE=
REACT_APP_EJS_TEMPLATE=
REACT_APP_EJS_PK=
```

## Email Mock Mode

In development (`npm start`), email submissions are mocked by default via `REACT_APP_MOCK_EMAIL=true` in `.env.development`. No real EmailJS calls are made.

Mock submissions are saved to `localStorage` and logged to the browser console with a `[MOCK EMAIL]` prefix. To inspect past submissions in DevTools:
```js
JSON.parse(localStorage.getItem("mock_email_submissions"))
```

Production builds (`npm run build`) use `.env.production` with `REACT_APP_MOCK_EMAIL=false`, which sends real emails via EmailJS.

## Architecture

Single-page app with no routing. All components render directly in `src/index.js` via `ReactDOM.render`:

- **Navbar** (`components/navbar.jsx`) — class component using jQuery for scroll spy and smooth scrolling
- **Intro** (`components/intro.jsx`) — hero section with logo and CTA buttons
- **About** (`components/about.jsx`) — FAQ section with hardcoded Q&A data
- **Contact** (`components/contact.jsx`) — main booking form with image upload, compression (via compressorjs, max 500KB total), and EmailJS integration
- **EmailService** (`services/EmailService.js`) — thin wrapper around `emailjs-com.sendForm()`

Key patterns:
- `react-responsive` (`useMediaQuery`) is used throughout for mobile/portrait layout switching
- CSS load order matters — defined explicitly in `index.js` (normalize → animate → bootstrap → font-awesome → style.css)
- `components/stars.scss` provides the animated starfield background
- Static assets (fonts, icons) are vendored in `src/img/`
