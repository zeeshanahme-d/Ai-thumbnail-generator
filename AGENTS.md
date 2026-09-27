# AGENTS.md

Guidance for Codex when working in this repository.

## Project

AI Thumbnail Generator ("Thumblify") — a web app where a user describes a thumbnail,
picks a style, aspect ratio, color scheme, and optional reference image, and the app
generates a YouTube/social thumbnail using **Gemini AI** (`gemini-3.1-flash-lite-image`).

Two workspaces, each with its own `package.json`:

- `client/` — React 19 + TypeScript + Vite frontend
- `server/` — Express 5 + Mongoose 9 API

There is no root `package.json` — do not add project scripts at the root.

## Commands

```bash
# client
cd client && npm run dev      # Vite dev server (port 5173)
cd client && npm run build    # vite build (does NOT type-check)
cd client && npm run lint     # eslint 9: typescript-eslint + react-hooks on all .ts/.tsx

# type-check the client (typescript is only a transitive dep, so call it directly)
cd client && node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json

# server
cd server && npm run dev      # tsx watch server.ts (port 8000)
```

**`vite build` does not type-check** — always run the `tsc --noEmit` command above
before claiming a change is clean.

**Do not run `npm run build` in `server/`.** It is bare `tsc`, and because
`tsconfig.json` sets `rootDir: "./src"` while `include` also lists `server.ts`
(error `TS6059`), it emits a stray `server.js` + `.map` into the server root.
To type-check the server, use a temporary config instead:

```bash
cd server && cat > tsconfig.check.json <<'EOF'
{ "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noImplicitAny": false, "noEmit": true } }
EOF
npx tsc -p tsconfig.check.json; rm -f tsconfig.check.json
```

## Client architecture

```
client/src/
├─ App.tsx           # QueryClientProvider → SessionProvider → AppRoutes
├─ types.ts          # ALL shared interfaces/types live here
├─ components/       # reusable components (shared across pages/sections)
│  ├─ image-generate-components/  # PromptCard, StylePicker, AspectRatioPicker, etc.
│  └─ modals/        # ConfirmDialog
├─ sections/         # large composed marketing sections (HeroSection, PricingSection, …)
├─ core/             # shared API layer: _models.ts, _requests.ts, hooks/ (React Query)
│  ├─ auth/          # session, login/signup, OTP and verification hooks
│  └─ thumbnails/    # list, generate, like, publish, delete and restore hooks
├─ pages/
│  ├─ auth/          # login/signup/forgot/otp/reset + core/_schemas.ts (form schemas)
│  ├─ dashboard/     # generate / gallery / recreate / recycle-bin / settings
│  │  └─ components/ # DashboardPage (shared placeholder template)
│  ├─ community/     # public community gallery
│  ├─ profile/       # user profile page
│  ├─ thumbnail-preview/  # individual thumbnail detail page
│  ├─ yt-preview/    # YouTube preview mockup page
│  └─ layouts/       # DashboardLayout, MainLayout, DashboardHeader, DashboardSidebar
├─ routes/           # routes.tsx, GuestRoute, ProtectedRoute
├─ store/            # Zustand stores (useSessionStore, useTheme)
├─ lib/              # axios instance, queryClient, imageValidation, thumbnail helpers
└─ data/             # static/mock arrays typed against types.ts
```

Stack: React 19, react-router-dom v7, **@tanstack/react-query** (server state),
**@tanstack/react-form + zod** (forms), Zustand v5 (session + theme), axios,
`motion` (from `motion/react`), lucide-react, Tailwind CSS v4 via `@tailwindcss/vite`,
`react-hot-toast` (notifications), `dayjs` (date formatting).

### Routing

`routes.tsx` has three groups:

- **Guest-only** (`GuestRoute`) — `/login`, `/signup`, `/forgot-password`,
  `/verify-otp`, `/reset-password`. Signed-in users bounce to `/dashboard/generate`.
- **Dashboard** (`ProtectedRoute` → `DashboardLayout` sidebar) — `/dashboard/*`
  (`generate`, `recreate`, `community`, `gallery`, `settings`, `recycle-bin`).
  `/dashboard` redirects to `/dashboard/generate`.
- **Marketing** (`MainLayout` = Navbar + Footer) — `/`, `/community`,
  `/profile`, `/thumbnail/:id` are public.

Auth pages and `/youtube-style-preview` render outside `MainLayout` (no navbar/footer).

### Auth / session flow

- **`store/useSessionStore.ts`** (`useSession`) is the single source of truth:
  `user`, `isAuthenticated`, `isRestoring`. It persists user data to one localStorage
  key (`tg_session`). Tokens are stored in **httpOnly cookies**, not in the store.
  `clearSession()` also clears the React Query cache (`lib/queryClient.ts`), so the next
  user never sees the previous user's data.
- **`components/SessionProvider.tsx`** calls `POST /auth/verify` once on every page
  load and blocks rendering until it settles, so guards never act on stale state. Only a
  `401` clears the session; a network or server error keeps the stored one.
- **`lib/axios.ts`** interceptor: on `401` + `error: "TOKEN_EXPIRED"` or
  `"TOKEN_MISSING"`, calls `/auth/refresh` and replays the original request. Requests
  that fail together share one in-flight refresh. On refresh failure, clears the session
  and logs the user out. On `401` + `"TOKEN_REVOKED"` (password changed or reset
  elsewhere) it clears the session without trying to refresh.
- **`core/auth/`** — `_models.ts` (types), `_requests.ts` (API calls), `hooks/` (React
  Query hooks: `useLogin`, `useSignup`, `useMe`, `useRefreshToken`, `useVerifySession`,
  `useLogout`). The auth forms' zod schemas stay in `pages/auth/core/_schemas.ts`.

### Dashboard pages

| Page | Route | Status |
|---|---|---|
| Generate | `/dashboard/generate` | ✅ Fully wired — PromptCard → API → shows generated thumbnails |
| Gallery | `/dashboard/gallery` | ✅ Filters, sort, pagination, delete, publish |
| Community | `/dashboard/community` | ✅ Same Community component as marketing `/community` |
| Recreate | `/dashboard/recreate` | ❌ Placeholder stub — `DashboardPage` template only |
| Settings | `/dashboard/settings` | 🔲 EditProfile wired; Billing shows the real balance and refill date, Upgrade disabled until payments exist; Invoices is a UI shell |
| Recycle Bin | `/dashboard/recycle-bin` | ✅ Restore + permanent delete with ConfirmDialog, Restore all, Empty bin, Load More; items purged after 30 days |

`/youtube-style-preview` is the YouTube preview: a thumbnail passed in router state
(`YtPreviewState`) placed in the middle of sample videos in home, search and mobile mockups,
light or dark. Opened directly it shows a sample. It has a `BackButton` (shared in
`components/`) instead of the navbar.

## Client conventions

1. **Never create a component that already exists.** Before adding one, check
   `components/` (and the relevant `pages/*/components/`). If an existing component
   is close, **extend it with a prop** rather than writing a second one. Duplicates
   like `PromptInput` vs `PromptCard` have already had to be merged once.
2. **Components** — PascalCase filename, **default export**. Shared components in
   `components/`; page-specific ones in `pages/<page>/components/`. A component in
   `components/` must never import from `pages/` (backwards dependency) — if it needs
   something page-local, move that dependency up to `components/` too.
3. **Types** — every shared interface goes in the single root `src/types.ts`; import
   with `import type { X } from "../types"`. Props interfaces are `XxxProps`; data
   models are `IXxx` or the bare model name (`Thumbnail`).
4. **Data** — static/mock arrays in `src/data/*.ts`, typed against `types.ts`. Lucide
   icons are stored as *component references* (`icon: Palette`), never JSX, so the
   file stays `.ts`.
5. **Styling** — inline Tailwind utilities using the **theme tokens** from
   `globals.css` `@theme`, never raw hex:
   - surfaces: `bg-background`, `bg-background-surface`, `bg-background-surface-2`,
     `bg-background-card`
   - text: `text-text-primary`, `text-text-secondary`, `text-text-muted`,
     `text-text-on-primary`
   - brand/state: `bg-primary`, `hover:bg-primary-hover`, `text-primary`,
     `border-border`, `text-success`, `text-warning`

   Tailwind v4 syntax: gradients are `bg-linear-to-b` (not `bg-gradient-to-b`), and
   the important suffix is `text-base!`.
6. **Animation** — `motion` is used **only on the homepage sections** (`sections/` and
   the components only they render). Every other page, the navbar, the footer and shared
   components like `ThumbnailCard` have no motion animation; don't add any there. Loading
   states use Tailwind's `animate-spin` / `animate-pulse`. On the homepage the entrance pattern is
   `initial={{ y: 50, opacity: 0 }}` → `whileInView={{ y: 0, opacity: 1 }}`,
   `viewport={{ once: true }}`, spring (`stiffness: 240–320, damping: 70, mass: 1`),
   staggered by `delay: index * 0.1`. Do **not** put `transform` in a CSS
   `transition-*` when motion also animates it — scope the CSS transition to
   `transition-[background-color,border-color,box-shadow]`.
7. **Icons** — lucide-react, usually `size={14}`–`size={20}`.
8. **Popovers** — use the **native HTML Popover API** (`popover="auto"` +
   `popoverTarget`), never a custom outside-click listener. Light-dismiss and Esc
   come for free. Positioning lives in `globals.css`.

## Key shared components

Check these before writing anything new:

- **`Button.tsx`** — the only button primitive. `variant` (primary | secondary |
  outline | ghost), `size` (xs | sm | md | icon), `rounded` (full | lg),
  `fullWidth`. Covers icon buttons and chips; extend it rather than hand-rolling a
  `<button>` with utility classes.
- **`PromptCard.tsx`** (`components/image-generate-components/`) — the prompt textarea
  card. Clicking the card focuses the textarea; controlled (`value`+`onChange`) or
  uncontrolled; includes style/aspect-ratio/color-scheme/reference-image pickers.
  While empty it offers niche templates (`PROMPT_TEMPLATES` in `data/generator.ts`);
  signed-in users also get an **Improve** button (`POST /thumbnail/improve-prompt`).
  Used by both `HeroSection` and the dashboard generate page.
- **`PopoverPanel.tsx`** — native-popover shell (title + Done). Wrap any picker in it.
- **`StylePicker` / `AspectRatioPicker` / `ColorSchemePicker` / `ReferenceImageUpload`**
  — controlled (`value`/`onChange`) pickers used inside `PromptCard`.
- **`ThumbnailCard.tsx`** — the unified card for displaying thumbnails. Supports
  `showDelete`, `showLike`, `showPublish`, `showRecycleBinActions` props. Used across
  generate, gallery, community, profile, and recycle-bin pages.
- **`ConfirmDialog`** (`components/modals/confirmation-dialog/`) — modal dialog for
  delete confirmations. Props: `open`, `onClose`, `onConfirm`, `title`, `description`,
  `confirmLabel`, `variant` (danger | default), `loading`, `confirmDisabled`, and
  `children` for extra content such as a password input.
- **`PageLoader.tsx`** — centered spinner. `fullScreen` for loads before any layout shows.
  Used by `SessionProvider` and as the `Suspense` fallback for lazy pages.
- **`Input.tsx`** (icon + input), **`Alert.tsx`** (error | success | warning | info),
  **`Wrapper.tsx`** (max-w-7xl container), **`MobileNav.tsx`**, **`Select.tsx`**,
  **`ThumbnailScroller.tsx`**, **`SectionTitle.tsx`**, **`Skeleton.tsx`**,
  **`ThumbnailCardSkeleton.tsx`**, **`TabSwitcher.tsx`**, **`DebounceSearch.tsx`**.

`lib/imageValidation.ts` owns image rules (extensions, MIME, 5 MB max) and returns a
user-facing message; reuse it for any upload. `lib/passwordValidation.ts` owns the
password rule and mirrors `server/src/validations/password.validation.ts`;
`lib/userValidation.ts` owns the full-name and username rules (including reserved names)
and mirrors `server/src/validations/user-fields.validation.ts`. `lib/credits.ts` holds the
generation cost and remaining-credit helper. `POST /thumbnail` returns the new balance,
which `useGenerateThumbnail` merges into the session with `updateUser`;
`useSyncSessionUser` refreshes the session user after email verification.

- Pages other than the homepage are lazy-loaded in `routes.tsx`; each layout wraps its
  `<Outlet />` in `Suspense`.
- Paged lists (community, gallery, profile, recycle bin) use `useInfiniteThumbnails` from
  `core/thumbnails/hooks/`. The like hook updates both plain and infinite caches.
- Grids render `getThumbnailCardImageUrl` (resized Cloudinary URL); detail views and
  downloads keep `getThumbnailImageUrl`. `handleDownloadFile` fetches the image as a blob,
  because browsers ignore the `download` attribute for Cloudinary's domain.

## Server architecture

```
server/
├─ server.ts                 # dotenv + connect mongo + startScheduledJobs() + app.listen(PORT)
└─ src/
   ├─ app.ts                 # express app; cors({ origin: CLIENT_URL, credentials: true })
   ├─ config/                # genai.ts (Gemini), cloudinary.ts, hf.ts (HuggingFace — unused)
   ├─ constants/             # enums.ts (all enums), constants.ts (style prompts, credit costs, sort)
   ├─ routes/                # auth, user, thumbnail, thumbnail-public, uploads-files
   ├─ controllers/           # auth, user, thumbnail, upload-files
   ├─ middlewares/            # auth (JWT), multer (image upload), validate (zod)
   ├─ models/                # user, refreshToken, thumbnail, likeDislike, thumbnailView
   ├─ schemas/               # media.schema.ts (reusable Mongoose subdocument)
   ├─ validations/           # zod schemas for auth + thumbnail endpoints
   ├─ helper/                # halper-functions.ts (bcrypt), token-helpers.ts (JWT)
   ├─ utils/                 # apiResponse, cloudniary, credits, delete-thumbnails, email, gemini,
   │                         # pagination, scheduled-jobs, helpers
   ├─ db/                    # connection.ts (Mongoose connect)
   └─ types/express.d.ts     # augments Request.user, Request.validated
```

ESM (`"type": "module"`) — **relative imports must carry the `.js` extension**
(`import app from "./src/app.js"`), even though the files are `.ts`.

### Responses

Every response goes through `utils/apiResponse.ts`:

```ts
ApiResponse.success(res, 200, "Login successful.", { accessToken, user });
ApiResponse.error(res, 401, "Invalid email or password.", "Unauthorized");
```

The 4th `error` argument doubles as a **machine-readable code** the client branches
on: `TOKEN_EXPIRED`, `TOKEN_INVALID`, `TOKEN_MISSING`, `REFRESH_EXPIRED`,
`REFRESH_INVALID`, `REFRESH_MISSING`, `TOKEN_REVOKED`, `EMAIL_NOT_VERIFIED`,
`DISPOSABLE_EMAIL`, `RATE_LIMITED`, `VALIDATION_FAILED`, `INSUFFICIENT_CREDITS`,
`GENERATION_FAILED`, `CONTENT_BLOCKED`, `GENERATION_BUSY`, `GENERATION_TIMEOUT`.
Validation errors carry the first message at the top level and per-field messages in
`error.fields`.

**`mongoose.set("sanitizeFilter", true)`** is on (`db/connection.ts`): any operator object
in a query filter is wrapped in `$eq`, so request values can never act as operators. When
you write an operator on purpose (`$regex`, `$ne`, `$gt`, `$expr`, …), wrap it:
`deletedAt: mongoose.trusted({ $ne: null })`. Without it the query breaks or throws.

### Auth endpoints (`/auth`, public unless noted)

`POST /login`, `POST /signup`, `POST /refresh`, `POST /verify`, `POST /logout`,
`GET /me` (behind `authenticationToken`), `POST /forgot-password`, `POST /verify-otp`,
`POST /reset-password`, `POST /verify-email`, `POST /resend-verification`,
`POST /change-password` (behind `authenticationToken`).

- **Sessions are revocable instantly.** Every token carries `tv` = `user.tokenVersion`, and
  `authenticationToken` looks the user up on each request. `revokeAllSessions()` (password
  change and reset) bumps the version and deletes all refresh tokens. Tokens without `tv`
  count as version 0.
- **Rate limits** live in `middlewares/rate-limit.middleware.ts` (in-memory store, per IP,
  per email, or per user) and are mounted per route before `validate`. Behind a proxy,
  `TRUST_PROXY` must be set or every client shares one IP.
- **Emailed codes** (reset and verification) go through `issueOtp` / `consumeOtp` in
  `auth.controller.ts`: hashed, 10-minute expiry, and 5 attempts counted atomically.
- Token cookies must be strings: cookie-parser turns `j:{...}` cookies into objects.

- Access token 15 min, refresh token 30 days (`helper/token-helpers.ts`). Secrets are
  read **inside** the functions — `dotenv.config()` runs *after* the module graph is
  imported, so top-level `process.env` reads are `undefined`.
- Refresh tokens are stored as SHA-256 hashes (`hashToken`) in `refreshToken.model.ts` with
  a TTL index. Every refresh (and `/verify` fallback) rotates the token within its login
  `family`; a used token replayed after `REFRESH_REUSE_GRACE_MS` (30 s) revokes the whole
  family. Parallel refreshes inside the window get an access token only. Logout deletes the family.
- `/verify` is deliberately **not** behind `authenticationToken`: it must inspect an
  already-expired access token and fall back to the refresh cookie.
- Tokens are set as **httpOnly cookies** (not returned in the body to the client).

### Thumbnail endpoints (`/thumbnail`)

**Public** (via `thumbnail-public.routes.ts`, mounted first). `optionalAuthentication` lets guests
through but checks anyone with a session cookie, so signed-in users get `isLiked`:
- `GET /thumbnail/community` — paginated community thumbnails. Search is a case-insensitive
  substring regex (a text index only matches whole words, which breaks search-as-you-type);
  `trending` sorts by `trendingScore`
- `GET /thumbnail/:id` — detail: published ones for anyone, any of their own for the owner.
  Non-id paths (`/recycle-bin`) skip to the protected router via `next("router")`
- `POST /thumbnail/:id/view` — counts a view on a published thumbnail once per viewer, like
  likes: a `thumbnailView` record with a unique `{ thumbnailId, viewerKey }` index is upserted
  and `viewsCount` only goes up when it was inserted. `viewerKey` (`utils/viewer.ts`) is
  `user:<id>`, or `guest:<uuid>` from an httpOnly `visitorId` cookie set on a guest's first view.
  The owner's own views don't count; `viewLimiter` caps calls per IP. React StrictMode calls it
  twice in dev, which the dedupe absorbs. View records are deleted with the thumbnail
  (`deleteThumbnailsForever`) and with the viewer's account; the counts stay
- `GET /thumbnail/:id/share` — the shared link: HTML with Open Graph tags that redirects to
  `CLIENT_URL/thumbnail/:id` (`utils/share-page.ts`)

**Protected** (via `thumbnail.routes.ts`, behind `authenticationToken`):
- `POST /thumbnail` — generate thumbnail (multipart form with optional `referenceImage`)
- `POST /thumbnail/improve-prompt` — rewrite `{ prompt }` with `GEMINI_TEXT_MODEL`; free,
  10 per 10 minutes per user (`improvePromptLimiter`)
- `DELETE /thumbnail/recycle-bin` — empty the bin; `PATCH /thumbnail/recycle-bin/restore` —
  restore all. Both are registered before the `/:id` routes, which would match them.
- `GET /thumbnail` — user's own thumbnails (paginated, filterable)
- `GET /thumbnail/recycle-bin` — soft-deleted thumbnails
- `PATCH /thumbnail/:id/publish` — toggle publish/unpublish
- `POST /thumbnail/:id/like` — toggle like/unlike (published, non-deleted thumbnails only)
- `DELETE /thumbnail/:id` — soft delete (move to recycle bin and unpublish)
- `PATCH /thumbnail/:id/restore` — restore from recycle bin (stays unpublished)
- `DELETE /thumbnail/:id/permanent` — permanently delete (also removes the Cloudinary
  image and its like records)

### User endpoints

- `GET /users/check-username/:username` — username availability (behind auth)
- `GET /users/:username/profile` — public profile
- `PATCH /users/profile` — update profile (fullName, username, bio, website)
- `DELETE /users/account` — delete account; body must include the current `password`.
  The user's likes are taken off other thumbnails' counts, and likes on their thumbnails
  are deleted.
- `POST /upload/avatar` — upload avatar image (replaces old one on Cloudinary)

`uploadSingleImage` keeps the file in memory (`req.file.buffer`, never on disk) and checks
its real bytes with `file-type`. `uploadFileOnCloudniary` streams a buffer to Cloudinary.
With `NODE_ENV=production` the error handler replaces 5xx messages with a generic one.

### AI Generation flow

1. Client sends `POST /thumbnail` with `title`, `prompt`, `style`, `aspect_ratio`,
   `color_scheme`, `text_overlay` (parsed with `z.stringbool()`, so `"false"` is false),
   and optional `referenceImage` file
2. Server applies a due monthly refill, then reserves credits atomically
   (`CREDIT_COST.GENERATE_COST = 5`)
3. Creates a thumbnail document with `isGenerating: true`
4. Builds a detailed prompt from style presets (`constants/constants.ts`), color scheme
   descriptions, text overlay rules, reference image instructions
5. Calls `generateImage()` (`utils/gemini.ts`, which also has `generateText()`) with
   `GEMINI_IMAGE_MODEL`:
   60 s timeout per attempt, 429/503 retried with 1 s and 2 s backoff, safety blocks and
   other failures mapped through `GENERATION_FAILURES` in `constants/constants.ts`
6. Streams the image buffer to Cloudinary → updates the thumbnail document with
   `isGenerating: false` and the Cloudinary URL → responds `{ thumbnail, credits }`
7. On failure the `finally` block deletes the record and refunds. Only the side that
   deletes the record refunds, so a crash is cleaned up by the scheduled job instead:
   records still generating after `STUCK_GENERATION_MS` (10 min) are deleted and refunded.

### Credits system

- New accounts start with 0 credits; verifying the email grants the 20-credit bonus
  (`$max`, so older accounts that already have 20 are not topped up twice). Signup rejects
  disposable email domains (`isDisposableEmail` in `utils/helpers.ts`).
- Generate costs 5 credits, Recreate costs 10 (not yet implemented)
- `user.totalcredits` vs `user.creditsUsed` — `utils/credits.ts` reserves credits
  atomically before calling Gemini and refunds them if generation fails (never below 0)
- **Monthly refill** — only **verified** free accounts refill. When `creditsResetAt` passes
  (or is missing), the account goes back to 20 credits with 0 used and the date moves 30 days
  on (`CREDIT_RESET_INTERVAL_MS`). `resetDueCredits()` runs from `utils/scheduled-jobs.ts`
  every 10 minutes, for the one user before each generation, and on email verification. So
  verifying starts the cycle, and older accounts whose date passed while unverified refill
  at once. Unverified users are told to verify (dashboard alert, `EMAIL_NOT_VERIFIED` on
  generate).

Env: `PORT`, `SECRET`, `REFRESH_SECRET` (falls back to `SECRET`), `CLIENT_URL`,
`CLIENT_ID`, `GEMINI_API_KEY`, `CLOUDINARY_URL`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `CLOUDINARY_NAME`, `SMTP_HOST`, `SMTP_USER`,
`SMTP_PASSWORD`, `SMTP_TLS_PORT`, `MONGO_DB_URL`, `TRUST_PROXY` (number of reverse proxies,
unset when clients connect directly).
Client: `VITE_API_BASE_URL` (defaults to `http://localhost:8000`), `VITE_SITE_URL` (the
site's public origin, filled into the Open Graph tags in `index.html`; set it for production).

## Current state / gotchas

### Working features
- Full email auth (signup with email verification, login, forgot/reset/change password
  with OTP email, rate limits on auth routes)
- Thumbnail generation via Gemini AI with style/color/aspect-ratio presets
- Dashboard: Generate, Gallery, Community, Recycle Bin (all wired to real API)
- Like/unlike, publish/unpublish, soft delete/restore/permanent delete
- Profile editing + avatar upload via Cloudinary
- Dark mode via `data-theme` attribute + CSS variables in `globals.css`
- Settings page with EditProfile and Billing (balance and refill date); InvoicesSection is a UI shell
- Monthly free-credit refill, stuck-generation cleanup, the 30-day recycle-bin purge and the
  trending score (likes and views decayed by age, `TRENDING_*` in `constants.ts`)
  (`utils/scheduled-jobs.ts`); permanent deletes all go through `deleteThumbnailsForever`
- `/thumbnail/:id` fetches by id (`useThumbnail`, router state is only a placeholder), counts a
  view on open, and Share copies the server's `/share` link so previews show the image

### Not implemented / placeholder
- **Payment/subscription** — pricing page exists, user model has plan fields, but no
  payment integration (Stripe/LemonSqueezy). The Upgrade button is disabled.
- **Google OAuth** — no `/auth/google` endpoint; the Google button is hidden until it exists.
- **Recreate** — placeholder page only; no upload-and-remix flow.
- **Follow system** — `followersCount`/`followingCount` fields exist but no endpoints or model.

### Known bugs
- `hf.ts` error message says "GEMINI_API_KEY is missing" (copy-paste bug).
- `likeDislik.modal.ts` — filename should be `.model.ts`; `unique: true` is set at
  schema level instead of as a compound index on `{ userId, thumbnailId }`.
- `halper-functions.ts` and `cloudniary.ts` are misspelled filenames.
- `.env.example` is incomplete (missing SMTP, REFRESH_SECRET, MONGO_URI vars).
