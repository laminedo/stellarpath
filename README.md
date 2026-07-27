# StellarPath ✦

An immersive 3D numerology & astrology web app — React 18 + TypeScript + Three.js (React Three Fiber), fully client-side, deployed on GitHub Pages.

**Live:** https://laminedo.github.io/stellarpath/

## Features

- 🌌 3D cosmic UI: particle starfield with shooting stars, rotating zodiac wheel, pulsing energy orb, compatibility constellation, floating number tower
- 🔢 Numerology engine: Life Path, Expression, Soul Urge, Personality, Birthday, personal year/month/day cycles, daily lucky numbers
- ♈ Western astrology: sun / moon / rising signs with degrees, elements, modalities
- 🐉 Chinese zodiac: animal, element, yin/yang, stem-branch
- 📈 Biorhythms & 7-day energy forecast with charts
- 💞 Compatibility scoring across western, numerology, and chinese systems
- 📱 PWA: installable, works offline (service worker, cache-first)
- 🔒 Privacy-first: all data stays in localStorage — nothing leaves the browser

> For entertainment and self-reflection purposes only. Not scientifically validated.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · React Three Fiber + Drei · Framer Motion · Recharts · React Router (HashRouter) · Lucide icons

## Develop

```bash
npm install
npm run dev
```

## Build & deploy

```bash
npm run build
```

Deployment to GitHub Pages runs automatically via GitHub Actions on every push to `main`.
**One-time setup:** move `ci/deploy.yml` to `.github/workflows/deploy.yml`, then enable **Settings → Pages → Source: GitHub Actions**.
