# Eyecatch AI: server

The Express API for [Eyecatch AI](https://eyecatch.zeeshanahmed.dev): auth, thumbnail generation with Google Gemini, credits and Paddle billing. The client lives in [`../client`](../client).

**Live:** https://eyecatch.zeeshanahmed.dev (API: `https://api.eyecatch.zeeshanahmed.dev`)

## Stack

Node.js · Express 5 · TypeScript (ESM) · MongoDB with Mongoose 9 · Zod · JWT in httpOnly cookies · Google Gemini (`@google/genai`) · Cloudinary · Paddle Billing · Nodemailer · helmet

## Getting started

```bash
cp .env.example .env     # fill in the values
npm install
npm run dev              # http://localhost:8000, restarts on change
```

`SECRET`, `REFRESH_SECRET` and `MONGO_DB_URL` are required, and the server won't start without them. `.env.example` explains every variable.

| Group | Variables |
|---|---|
| Core | `PORT`, `NODE_ENV`, `CLIENT_URL`, `TRUST_PROXY` |
| Auth | `SECRET`, `REFRESH_SECRET` (must differ) |
| Database | `MONGO_DB_URL` |
| AI | `GEMINI_API_KEY` |
| Images | `CLOUDINARY_URL`, `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Email | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_TLS_PORT` |
| Billing | `PADDLE_ENV`, `PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_PRICE_*`, `PADDLE_PRODUCT_*` |

## Scripts

```bash
npm run dev          # tsx watch
npm run build        # compile to dist/
npm start            # run dist/server.js (build first)
npx tsc --noEmit     # type-check

# self-checks, no database needed
npx tsx src/utils/billing.check.ts
npx tsx src/utils/thumbnail-prompt.check.ts --print   # also prints a sample prompt
npx tsx src/schemas/media.check.ts
```

## API

| Route | |
|---|---|
| `/auth` | signup, login, logout, session refresh and verify, email verification, forgot/reset/change password |
| `/users` | public profiles, username check, profile update, account deletion |
| `/upload/avatar` | avatar upload |
| `/thumbnail` | generate, improve prompt, my thumbnails, community, detail, share page, like, publish, recycle bin (delete, restore, empty) |
| `/billing` | checkout, credit packs, customer portal, Paddle webhook |
| `/health` | health check |

Every response has the same shape (`utils/apiResponse.ts`), and errors include a machine-readable code such as `INSUFFICIENT_CREDITS` or `TOKEN_EXPIRED`.

## How generation works

1. A due monthly refill is applied, then 5 credits are reserved in one atomic update.
2. The prompt is built from the title, the user's prompt, the style and color presets, an optional reference image and the text-on-image setting (`utils/thumbnail-prompt.ts`).
3. Gemini is called with a 60-second timeout and up to 3 attempts. The image is streamed to Cloudinary.
4. If it fails, the record is deleted and the credits are refunded. A scheduled job cleans up generations cut off by a crash.

## Structure

```
server.ts            env checks, MongoDB connection, scheduled jobs, listen
src/
├─ app.ts            middleware, CORS and origin check, routes, error handler
├─ config/           Gemini, Cloudinary, Paddle clients
├─ constants/        enums, credit costs, style presets, limits
├─ controllers/      auth, user, thumbnail, upload, billing
├─ middlewares/      auth, rate limits, upload (multer), validation
├─ models/           user, refresh token, thumbnail, like
├─ schemas/          shared image subdocument (only url reaches the client)
├─ validations/      Zod request schemas
└─ utils/            credits, billing webhooks, Gemini, email, scheduled jobs, logging
```

## Deploying

```bash
npm ci && npm run build && npm prune --omit=dev
npm start
```

- **Production env:** set `NODE_ENV=production` and `CLIENT_URL` to the site's origin.
- **Proxy:** set `TRUST_PROXY=1` behind a reverse proxy. The proxy must accept bodies over 5 MB and wait longer than a generation; for Nginx, `client_max_body_size 6m` and `proxy_read_timeout 300s`.
- **Cookies:** auth cookies are `SameSite=Strict`, so the site and the API must share a registrable domain.
