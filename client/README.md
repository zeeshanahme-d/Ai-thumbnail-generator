# Eyecatch AI: client

The React app for [Eyecatch AI](https://eyecatch.zeeshanahmed.dev), an AI YouTube thumbnail generator. It talks to the Express API in [`../server`](../server).

**Live:** https://eyecatch.zeeshanahmed.dev

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · TanStack Query (server state) · TanStack Form + Zod (forms) · Zustand (session and theme) · React Router 7 · axios · Motion and GSAP (homepage and pricing only) · Paddle.js (checkout)

## Getting started

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5173
```

The API must be running too (`../server`, port 8000 by default).

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | API base URL. Defaults to `http://localhost:8000`. |
| `VITE_SITE_URL` | The site's public origin, used in the social preview tags in `index.html`. |
| `VITE_PADDLE_CLIENT_TOKEN` | Paddle client-side token (`test_…` in the sandbox). |
| `VITE_PADDLE_ENV` | `production` for live payments; anything else uses the sandbox. |

In production, set these in the hosting provider's settings (Vercel → Project → Environment Variables).

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build into dist/
npm run lint       # ESLint
npm run preview    # serve the production build

# type-check (vite build does not)
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json
```

## Structure

```
src/
├─ components/   shared components (Button, PromptCard, ThumbnailCard, ConfirmDialog, …)
├─ sections/     homepage sections
├─ pages/        auth, dashboard (generate, gallery, recycle bin, settings), community,
│                profile, thumbnail detail, YouTube preview, pricing, legal
├─ core/         API calls and React Query hooks (auth, thumbnails, billing)
├─ routes/       routes, plus guards for guest-only and signed-in pages
├─ store/        Zustand stores (session, theme)
├─ lib/          axios with token refresh, helpers, validation rules, motion tokens
├─ data/         static content (templates, pricing, FAQ, legal text)
├─ styles/       design tokens for light and dark
└─ types.ts      shared types
```

## Notes

- **Session:** tokens are httpOnly cookies set by the API. On a 401, axios refreshes the session once and retries the request.
- **Lazy loading:** every page except the homepage is lazy-loaded.
- **Payments:** run in Paddle test mode. A notice with the test card opens before every checkout, and bought credits are shown but can't be spent.
- **Deploy:** on Vercel. `vercel.json` handles the client-side routes and adds security headers.
