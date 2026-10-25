# AGENTS.md

Guidance for Codex when working in this repository.

## Project

AI Thumbnail Generator ("Eyecatch AI") — a web app where a user describes a thumbnail,
picks a platform format, category, style, color scheme, and an optional reference image, and the app
generates a thumbnail for YouTube, TikTok, Instagram, Facebook, X, Twitch or Vimeo using **Gemini AI** (`gemini-3.1-flash-lite-image`).

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
cd server && npm run dev       # tsx watch server.ts (port 8000)
cd server && npx tsc --noEmit  # type-check
cd server && npm run build     # tsc into dist/ (gitignored)
cd server && npm start         # node dist/server.js, so build first
```

**`vite build` does not type-check** — always run the `tsc --noEmit` command above
before claiming a change is clean.

**Deploying the server**: `npm ci && npm run build && npm prune --omit=dev`, then
`npm start`. `tsx` and `typescript` are devDependencies, so build before pruning.

## Client architecture

```
client/src/
├─ App.tsx           # QueryClientProvider → SessionProvider → AppRoutes
├─ types.ts          # ALL shared interfaces/types live here
├─ components/       # reusable components (shared across pages/sections)
│  ├─ image-generate-components/  # PromptCard, StylePicker, FormatPicker, CategoryPicker, etc.
│  └─ modals/        # ConfirmDialog
├─ sections/         # homepage sections (HeroSection, CapabilitiesSection, ProcessSection, …)
│  └─ components/    # homepage-only parts: hero/, capabilities/ (bento demos), process/ (walkthrough)
├─ core/             # shared API layer: _models.ts, _requests.ts, hooks/ (React Query)
│  ├─ auth/          # session, login/signup, OTP and verification hooks
│  ├─ thumbnails/    # list, generate, like, publish, delete and restore hooks
│  └─ billing/       # checkout (Paddle overlay) and billing-portal hooks
├─ pages/
│  ├─ auth/          # login/signup/forgot/otp/reset + core/_schemas.ts (form schemas)
│  ├─ dashboard/     # generate / gallery / recreate / recycle-bin / settings
│  │  └─ settings/components/  # SettingsSection + the plan, invoices, profile, password, delete blocks
│  ├─ community/     # public community gallery
│  ├─ profile/       # user profile page
│  ├─ thumbnail-preview/  # individual thumbnail detail page
│  ├─ yt-preview/    # YouTube preview mockup page
│  └─ layouts/       # DashboardLayout, MainLayout, DashboardHeader, DashboardSidebar
├─ routes/           # routes.tsx, GuestRoute, ProtectedRoute
├─ store/            # Zustand stores (useSessionStore, useTheme)
├─ lib/              # axios, queryClient, imageValidation, thumbnail helpers, motion tokens,
│                    # gsap (lazy-only), smoothScroll, buttonClasses, small hooks (useMediaQuery, …)
├─ styles/           # variables.css (every token, light + dark), backdrops.css (grid + grain)
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
  (`generate`, `community`, `gallery`, `settings`, `recycle-bin`).
  `/dashboard` redirects to `/dashboard/generate`.
- **Marketing** (`MainLayout` = Navbar + Footer) — `/`, `/community`,
  `/profile`, `/thumbnail/:id`, `/pricing`, `/privacy-policy`, `/terms` and
  `/refund-policy` are public. The three legal routes share `pages/legal/LegalPage`, whose
  text lives in `data/legal.ts`. `MainLayout` scrolls new pages to the top.

Auth pages and `/youtube-style-preview` render outside `MainLayout` (no navbar/footer).
The auth pages share `pages/auth/AuthLayout`: the form on the left and, from `lg` up,
`AuthShowcase` (sample thumbnails and the homepage's headline) on the right.

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
| Community | `/dashboard/community` | ✅ Same Community component as `/community`, which passes `variant="public"` for its own header |
| Recreate | `/dashboard/recreate` | ⏸ Commented out (page, route, sidebar and footer links) until it is built; the URL shows NotFound |
| Settings | `/dashboard/settings` | 🔲 Profile, password and account deletion wired; Plan and credits shows the real balance, refill and renewal dates, Upgrade → `/pricing`, Manage plan → Paddle portal; Invoices only points to Paddle's receipts and the portal (no in-app list) |
| Recycle Bin | `/dashboard/recycle-bin` | ✅ Restore + permanent delete with ConfirmDialog, Restore all, Empty bin, Load More; items purged after 30 days |

Every dashboard page renders inside `DashboardPage` (`components/`): mono label, `h1`,
description, optional `actions` on the right (counts, page buttons) and the body. The settings
blocks share the page-local `SettingsSection` (heading, description, card; `danger` for the
delete block).

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

   **One look everywhere.** `styles/variables.css` defines every token at `:root` (paper,
   light) and `[data-theme="dark"]` (ink), so public pages, auth pages, the dashboard and the
   YouTube preview all share it: brand red `#d7303d` (white button text passes AA), Geist
   (400/500) as the font, Geist Mono for `font-mono`, and `font-semibold`/`font-bold` mapped
   to 500 in `@theme`. Besides the tokens above there are `border-border-strong`,
   `shadow-card`, `py-(--section-y)` (public section rhythm) and the `.backdrop-grid` /
   `.backdrop-grain` backgrounds (`styles/backdrops.css`). `@theme` resolves
   `--color-x: var(--y)` at `:root`, so redefining a variable on a wrapper class does **not**
   re-theme the utilities inside it; change looks in `variables.css`.

   **Page language** (public, auth and dashboard): public pages open with `PageHeader` (mono
   label, display heading, intro, grid backdrop), dashboard pages with `DashboardPage`;
   `SectionTitle` with `align="split"` / `"start"` for public sections; cards with
   `border-border` + `shadow-card`; mono labels (`Eyebrow`) and tabular numbers for facts;
   sentence-case labels and buttons; red only for the page's main action, destructive
   actions, focus rings and status dots (selected chips and open tool buttons use neutral
   ink, e.g. `variant="inverse"`). No glow blobs, gradient text, sparkle icons or
   icon-in-a-square card grids, and no copy that claims something the product doesn't do.
6. **Animation** — `motion` is used **only on the homepage** (`sections/` and the
   components only they render) **and the `/pricing` page**. Every other page, the
   navbar, the footer and shared components like `ThumbnailCard` have no motion animation;
   don't add any there. Loading states use Tailwind's `animate-spin` / `animate-pulse`.
   - **Tokens** live in `lib/motion.ts`; reuse them instead of new timings: `EASE_OUT`
     (`cubic-bezier(0.22, 1, 0.36, 1)`, also `ease-out-expo` in CSS), `DURATION`
     (small 0.5s, enter 0.7s, line 0.8s, exit 0.25s), `STAGGER` (60ms), `DISTANCE` (16px),
     `VIEWPORT`, and the `fadeUp` / `crossFade` variants. Hover and press stay in CSS at
     150–250ms. Springs only for physical interactions (press, the billing toggle pill).
   - Scroll-in entrances go through `Reveal` (fade up 16px). Headings that reveal line by
     line use `MaskedLines` (`SectionTitle` with `align="start" | "split"` does it for you).
   - **GSAP** (with ScrollTrigger) is only for scroll-scrubbed scenes, at most two per page;
     today that's the homepage walkthrough (`sections/components/process/ProcessTimeline`).
     Only lazy-loaded modules may import `lib/gsap.ts`, so GSAP never reaches the main
     bundle. Pin with CSS `position: sticky` and let GSAP scrub. Never animate one element
     with both motion and GSAP.
   - **Smooth scroll**: Lenis runs only on the homepage, lazy-loaded (`pages/home/components/
     SmoothScroll`) on GSAP's ticker where `RICH_MOTION_QUERY` matches (wide screen, fine
     pointer, motion allowed). In-page anchors go through `scrollToHash` (`lib/smoothScroll.ts`),
     which works with or without Lenis and honours `scroll-mt-*`.
   - **Reduced motion**: the homepage and `/pricing` sit in `MotionConfig reducedMotion="user"`; GSAP code
     uses `gsap.matchMedia()`; auto-playing demos (`useAutoCycle`, `useTypewriter`) stand
     still. With reduced motion, or before GSAP loads, content shows in its final state;
     nothing may stay invisible waiting for JS.
   - Do **not** put `transform` in a CSS `transition-*` when motion or GSAP animates it —
     scope the CSS transition to `transition-[background-color,border-color,box-shadow]`.
7. **Icons** — lucide-react, usually `size={14}`–`size={20}`.
8. **Popovers** — use the **native HTML Popover API** (`popover="auto"` +
   `popoverTarget`), never a custom outside-click listener. Light-dismiss and Esc
   come for free. Positioning lives in `globals.css`.

## Key shared components

Check these before writing anything new:

- **`Button.tsx`** — the only button primitive. `variant` (primary | secondary |
  outline | ghost | inverse), `size` (xs | sm | md | lg | icon | iconSm | iconLg),
  `rounded` (full | lg), `fullWidth`. Covers icon buttons and chips; extend it rather than
  hand-rolling a `<button>` with utility classes. A `<Link>` that looks like a button uses
  `buttonClasses()` from `lib/buttonClasses.ts`, the same classes Button renders.
  Icon sizes with an `aria-label` show it as a `Tooltip` automatically; don't add `title`.
- **`PromptCard.tsx`** (`components/image-generate-components/`) — the prompt textarea
  card. Clicking the card focuses the textarea; controlled (`value`+`onChange`) or
  uncontrolled; includes style/category/format/color-scheme pickers, the reference-image upload (`ReferenceImageUpload`) and the
  text-on-image switch (on by default).
  While empty it offers niche templates (`PROMPT_TEMPLATES` in `data/generator.ts`);
  signed-in users also get an **Improve** button (`POST /thumbnail/improve-prompt`).
  Used by both `HeroSection` (through `HeroPrompt`, with `showTools={false}` and a
  placeholder that types out the templates, so it passes `ariaLabel`) and the dashboard
  generate page.
- **`PopoverPanel.tsx`** — native-popover shell (title + Done). Wrap any picker in it.
- **`Tooltip.tsx`** — hover / keyboard-focus label in a manual popover (top layer, so nothing
  clips it). Wrap something yourself only when the label differs from the aria-label or the
  button can be disabled (disabled buttons get no hover); icon Buttons inside skip their own.
- **`SectionTitle.tsx`** — label + heading + description. `as="h1"` for a page title;
  `animate={false}` everywhere except the homepage and `/pricing`. `align`: `center`
  (pill, default), `start` (left, mono eyebrow) or `split` (heading left, description
  right); `start`/`split` take `text2` as an array of lines (masked reveal when animated).
  `children` render under the description (an action, a date).
- **`PageHeader.tsx`** — the top of a public page: `SectionTitle` (`as="h1"`, split) over the
  fading grid and grain. `animate` only on `/pricing`, where motion is allowed.
- **`DashboardPage.tsx`** — the shell of every dashboard page: `eyebrow`, `title` (the
  `h1`), `description`, optional `actions` and the body (a "Coming soon" box without one).
- **`Reveal.tsx`** — the standard scroll-in entrance (`delay` for staggering).
  **`AnimatedValue.tsx`** slides a changing value such as a price. **`MaskedLines.tsx`**
  reveals a heading line by line; **`Eyebrow.tsx`** is the small mono label (`dot` for
  the red status dot).
- **`PricingCard` / `BillingToggle`** — plan card and monthly/yearly switch (sliding pill),
  used by the homepage `PricingSection` and the `/pricing` page (`BillingToggle` takes a
  `className` for placement). Plans, the pay-as-you-go `CREDIT_PACK` settings, credit
  facts and the comparison table come from `data/pricing.ts`; features that aren't built
  yet carry `COMING_SOON`.
- **`ThumbnailScroller.tsx`** — the hero's pure-CSS marquee (`animate-marquee`) of the
  sample thumbnails (`sampleThumbnails` in `data/hero.ts`, 640px WebP copies).
- **`FaqAccordion.tsx`** — animated accordion, one answer open at a time; questions live
  in `data/faq.ts`.
- **`StylePicker` / `CategoryPicker` / `FormatPicker` / `ColorSchemePicker` / `ReferenceImageUpload` /
  `TextOverlayToggle`**
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
- **`ListError.tsx`** — "Couldn't load" message with Try again, for a list whose first load
  failed (`loadFailed` / `refetch` from `useInfiniteThumbnails`).
- **`Input.tsx`** (icon + input), **`Alert.tsx`** (error | success | warning | info),
  **`Wrapper.tsx`** (max-w-7xl container), **`MobileNav.tsx`**, **`Skeleton.tsx`**,
  **`ThumbnailCardSkeleton.tsx`**, **`TabSwitcher.tsx`**.

`lib/imageValidation.ts` owns image rules (extensions, MIME, 2 MB max, for avatars and reference images
alike) and returns a
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
   ├─ app.ts                 # express app; CORS + write-origin check from CLIENT_URL (getClientOrigins)
   ├─ config/                # genai.ts (Gemini), cloudinary.ts, paddle.ts
   ├─ constants/             # enums.ts (all enums), constants.ts (style prompts, credit costs, sort)
   ├─ routes/                # auth, user, thumbnail, thumbnail-public, uploads-files, billing
   ├─ controllers/           # auth, user, thumbnail, upload-files, billing
   ├─ middlewares/            # auth (JWT), multer (image upload), validate (zod)
   ├─ models/                # user, refreshToken, thumbnail, likeDislike
   ├─ schemas/               # media.schema.ts (reusable Mongoose subdocument)
   ├─ validations/           # zod schemas for auth, thumbnail and billing endpoints
   ├─ helper/                # halper-functions.ts (bcrypt), token-helpers.ts (JWT)
   ├─ utils/                 # apiResponse, billing, cloudniary, credits, delete-thumbnails, email, gemini,
   │                         # pagination, scheduled-jobs, helpers
   ├─ db/                    # connection.ts (Mongoose connect)
   └─ types/express.d.ts     # augments Request.user, Request.validated
```

ESM (`"type": "module"`) — **relative imports must carry the `.js` extension**
(`import app from "./src/app.js"`), even though the files are `.ts`.

### Logging

Never call `console` directly: use `utils/logger.ts` (`logger.info("Checkout created", { userId })`).
In production it prints one JSON line per entry to stdout/stderr, which is all Vercel collects;
locally it prints readable lines. `LOG_LEVEL` sets the minimum (default `info` in production,
`debug` locally). Pass errors as a field (`{ error }`) so their stack is kept. Log ids, never
passwords, tokens, codes, cookies, emails or prompts. Requests are not logged one by one
(Vercel's request log has them); the error handler logs every 5xx with `x-vercel-id`.

### Responses

Every response goes through `utils/apiResponse.ts`:

```ts
ApiResponse.success(res, 200, "Login successful.", { accessToken, user });
ApiResponse.error(res, 401, "Invalid email or password.", "Unauthorized");
```

The 4th `error` argument doubles as a **machine-readable code** the client branches
on: `TOKEN_EXPIRED`, `TOKEN_INVALID`, `TOKEN_MISSING`, `REFRESH_EXPIRED`,
`REFRESH_INVALID`, `REFRESH_MISSING`, `TOKEN_REVOKED`, `EMAIL_NOT_VERIFIED`,
`DISPOSABLE_EMAIL`, `RATE_LIMITED`, `VALIDATION_FAILED`, `ORIGIN_NOT_ALLOWED`, `INSUFFICIENT_CREDITS`,
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
  `TRUST_PROXY` must be set or every client shares one IP. Public reads (`/auth/refresh`,
  `/auth/verify`, community, thumbnail detail, profiles) share `publicIpLimiter`.
- **Emailed codes** (reset and verification) go through `issueOtp` / `consumeOtp` in
  `auth.controller.ts`: hashed, 10-minute expiry, and 5 attempts counted atomically.
- Token cookies must be strings: cookie-parser turns `j:{...}` cookies into objects.

- Access token 15 min, refresh token 30 days (`helper/token-helpers.ts`). Secrets are
  read **inside** the functions — `dotenv.config()` runs *after* the module graph is
  imported, so top-level `process.env` reads are `undefined`.
- Each token carries `typ` (`access` / `refresh`) and has its own secret (`SECRET`,
  `REFRESH_SECRET`), so one kind never passes as the other. `server.ts` refuses to start
  unless `SECRET`, `REFRESH_SECRET` and `MONGO_DB_URL` are set and the two secrets differ.
- Refresh tokens are stored as SHA-256 hashes (`hashToken`) in `refreshToken.model.ts` with
  a TTL index. Every refresh (and `/verify` fallback) rotates the token within its login
  `family`; a used token replayed after `REFRESH_REUSE_GRACE_MS` (30 s) revokes the whole
  family. Parallel refreshes inside the window get an access token only. Logout deletes the family.
- `/verify` is deliberately **not** behind `authenticationToken`: it must inspect an
  already-expired access token and fall back to the refresh cookie.
- Every failed refresh or session restore clears both cookies (`rejectSession`), so a dead
  cookie can't keep sending public requests into a refresh that fails.
- Tokens are set as **httpOnly cookies** (not returned in the body to the client).

### Thumbnail endpoints (`/thumbnail`)

**Public** (via `thumbnail-public.routes.ts`, mounted first). `optionalAuthentication` lets guests
through but checks anyone with a session cookie, so signed-in users get `isLiked`. Community and
detail leave out `packCreditsUsed` and `model` (`PUBLIC_THUMBNAIL_PROJECTION`):
- `GET /thumbnail/community` — paginated community thumbnails. Search is a case-insensitive
  substring regex (a text index only matches whole words, which breaks search-as-you-type);
  `trending` sorts by `trendingScore`
- `GET /thumbnail/:id` — detail: published ones for anyone, any of their own for the owner.
  Non-id paths (`/recycle-bin`) skip to the protected router via `next("router")`
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

- `GET /users/check-username/:username` — username availability (behind auth; the caller's
  own username counts as available)
- `GET /users/:username/profile` — public profile, plus `likesCount` across the user's
  published thumbnails
- `PATCH /users/profile` — update profile (fullName, username, bio, website)
- `DELETE /users/account` — delete account; body must include the current `password`.
  The user's likes are taken off other thumbnails' counts, and likes on their thumbnails
  are deleted. A live Paddle subscription is cancelled immediately first; if that fails,
  nothing is deleted.
- `POST /upload/avatar` — upload avatar image (replaces old one on Cloudinary); 10 per hour
  per user (`avatarUploadLimiter`)

`uploadSingleImage` (avatar and reference image, 2 MB, `MAX_IMAGE_SIZE_MB`) keeps the file in memory
(`req.file.buffer`, never on disk) and checks its real bytes with `file-type`. `uploadFileOnCloudniary` streams a buffer to Cloudinary.
`schemas/media.schema.ts` (avatar and thumbnail image) sends only `url` to the client: the other
fields are `select: false` plus a `toJSON` transform. Read `publicId` with `+avatar.publicId` (or
name `thumbnail.publicId`), and select `avatar.url`, never the whole `avatar`, in an inclusive
select or populate, which would bring every field back. Check: `npx tsx src/schemas/media.check.ts`.
With `NODE_ENV=production` the error handler replaces 5xx messages with a generic one.

### Billing (Paddle)

Pro and Ultra are Paddle subscriptions (monthly or yearly). The catalog lives in Paddle;
each price carries `custom_data: { plan, billing, credits_per_month }` and each product
`{ plan }`, so the webhook never hardcodes Paddle IDs. The Free plan exists only in the app.

- `POST /billing/checkout` `{ plan, billing }` (auth, `billingLimiter`) — picks the price from
  `PADDLE_PRICE_<PLAN>_<BILLING>`, refuses unverified accounts and accounts with a live
  subscription (`ALREADY_SUBSCRIBED`), finds or creates the Paddle customer by email, and
  creates a transaction with `custom_data.userId`. The client opens Paddle.js overlay checkout
  with the returned `transactionId` (`lib/paddle.ts`, `core/billing/`).
- `POST /billing/credits` `{ credits }` (auth, `billingLimiter`) — one-time credit pack:
  25–2,500 in steps of 5 (`CREDIT_PACK` in `constants.ts`, mirrored in `data/pricing.ts`),
  verified accounts only. Quantity = credits / 5 of `PADDLE_PRICE_CREDITS` (USD 0.25 per unit,
  Paddle limits the quantity to 5–500 too). Subscribers can buy packs as well.
- `POST /billing/portal` (auth) — Paddle customer portal link: cancel, card, invoices.
- `POST /billing/webhook` (public, signed) — mounted in `app.ts` **before** `express.json`
  with `express.text`, because the signature covers the raw bytes. A missing or wrong
  `PADDLE_WEBHOOK_SECRET` (it must start with `pdl_ntfset_`) returns 500 before verifying, as
  does any error, so Paddle retries. Logic in `utils/billing.ts`:
  - `subscription.*` events own `plan`, `subscriptionStatus`, `subscriptionId`,
    `subscriptionRenewsAt` (null while a cancel is scheduled) and `paddleCustomerId`. An older
    event (`subscriptionUpdatedAt`) or one from a different subscription while the stored one
    is still live is ignored. If that other subscription is live too (two checkouts paid at
    once), it is cancelled at Paddle immediately; its first payment is refunded by hand.
    `canceled`/`paused` move the account to Free and refill the free credits (`SIGNUP_BONUS`).
  - `transaction.completed` owns the credits: a paid billing period sets `totalcredits` to
    `credits_per_month`, clears usage and records `subscriptionPeriodStart/End`, once per
    period. Payment-method-change transactions never refill. Renewal credits come from the
    payment, not `subscription.updated`, which Paddle sends before charging.
  - `transaction.completed` without a subscription is a credit pack (`grantCreditPack`):
    `credits_per_unit × quantity` from the paid transaction is added to `packCredits`, with the
    transaction id pushed to `creditPackTransactionIds` in the same write, so retries add nothing.
- Paid refills inside a period (`resetDueCredits`): yearly plans clear usage on each monthly
  anniversary of the period start (`nextPaidRefill`, capped at the period end); monthly plans
  wait for the next payment. Check: `npx tsx src/utils/billing.check.ts`.
- Not built: switching plans (needs `subscriptions.update`); refunds of pack purchases are
  not taken back out of `packCredits`.

### AI Generation flow

1. Client sends `POST /thumbnail` with `title`, `prompt`, `style`, `format` (`ThumbnailFormat`, default
   `youtube`; the server takes the aspect ratio from `THUMBNAIL_FORMATS`), `category` (default `General`),
   `color_scheme`, `text_overlay` (parsed with `z.stringbool()`, so `"false"` is false; on
   by default),
   and the optional `referenceImage` file, sent to the image model before the prompt. One image call
   per generation and a short prompt keep Gemini costs low
2. Server applies a due monthly refill, then reserves credits atomically
   (`CREDIT_COST.GENERATE_COST = 5`)
3. Creates a thumbnail document with `isGenerating: true`
4. Builds the prompt with `buildThumbnailPrompt` (`utils/thumbnail-prompt.ts`): short plain paragraphs
   for the title, the creator's brief (which wins over presets), the style and color presets
   (`constants/constants.ts`, descriptions, none asks for an expression), the reference image (used as the brief says; otherwise a thumbnail lends only its layout,
   lettering and colors, a person keeps their identity, a product or logo is featured) or casting rules, the category niche (left out for General), a natural expression (no default shocked face), the headline or no-text rule
   and the format's safe area (where its platform draws over the image). Check and print it: `npx tsx src/utils/thumbnail-prompt.check.ts --print`
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

- **Test mode (portfolio)**: `PAID_CREDITS_SPENDABLE = false` (`constants.ts`, mirrored in
  client `lib/credits.ts`). Payments run in the Paddle sandbox; plans and packs are recorded
  but only the free credits (`SIGNUP_BONUS`, 20) spend (`min(totalcredits, SIGNUP_BONUS) − creditsUsed`, pack never).
  Every verified account, whatever its plan, gets the free 30-day refill; paid periods record
  `subscriptionPeriodStart/End` only, and cancelling doesn't refill (no subscribe/cancel
  farming). Settings shows plan credits (`PLAN_MONTHLY_CREDITS`) and pack credits as locked;
  `TestCheckoutDialog` (test card, Cancel / Proceed) opens before every checkout. The rest
  of this section and Billing describe the `true` behaviour.
- New accounts start with 0 credits; verifying the email grants the `SIGNUP_BONUS` (20 credits)
  (`$max`, so an account is never topped up twice). Signup rejects
  disposable email domains (`isDisposableEmail` in `utils/helpers.ts`).
- Generate costs 5 credits, Recreate costs 10 (not yet implemented)
- `user.totalcredits` vs `user.creditsUsed` is the monthly allowance, which refills overwrite;
  `user.packCredits` is bought credits, which never expire and no refill touches. Balance =
  `getRemainingCredits` (allowance left + pack). `reserveCredits` charges atomically before
  calling Gemini, allowance first (`splitCharge` / `chargeExpressions`, one pipeline update),
  and returns how much came from the pack; the thumbnail stores it (`packCreditsUsed`) so a
  failed or stuck generation refunds each part to where it came from (never below 0)
- **Monthly refill** — only **verified** free accounts refill. When `creditsResetAt` passes
  (or is missing), the account goes back to `SIGNUP_BONUS` credits with 0 used and the date moves 30 days
  on (`CREDIT_RESET_INTERVAL_MS`). `resetDueCredits()` runs from `utils/scheduled-jobs.ts`
  every 10 minutes, for the one user before each generation, and on email verification. So
  verifying starts the cycle, and older accounts whose date passed while unverified refill
  at once. Unverified users are told to verify (dashboard alert, `EMAIL_NOT_VERIFIED` on
  generate).

Env: `PORT`, `SECRET`, `REFRESH_SECRET` (required, must differ from `SECRET`), `CLIENT_URL`
(the site origin, comma-separated for several, required in production; see Domains),
`NODE_ENV` (`production` turns on Secure cookies and hides 5xx details), `GEMINI_API_KEY`,
`CLOUDINARY_URL`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `CLOUDINARY_NAME`, `SMTP_HOST`, `SMTP_USER`,
`SMTP_PASSWORD`, `SMTP_TLS_PORT`, `MONGO_DB_URL`, `TRUST_PROXY` (number of reverse proxies,
unset when clients connect directly; production logs a warning when unset), `PADDLE_ENV` (`production` for live, else sandbox),
`PADDLE_API_KEY`, `PADDLE_WEBHOOK_SECRET`, `PADDLE_PRICE_{PRO,ULTRA}_{MONTHLY,YEARLY}`.
Client: `VITE_API_BASE_URL` (defaults to `http://localhost:8000`), `VITE_SITE_URL` (the
site's public origin, filled into the Open Graph tags in `index.html`; set it for production),
`VITE_PADDLE_CLIENT_TOKEN`, `VITE_PADDLE_ENV`. `client/.env.production` (gitignored, local only) holds the two
public production URLs; the client's host (Vercel) must set them itself.

### Domains

Site `https://eyecatch.zeeshanahmed.dev` (Vercel), API `https://api.eyecatch.zeeshanahmed.dev`
(one Node process on an Oracle Ampere instance behind a reverse proxy, so `TRUST_PROXY=1`).
Whatever sits in front of Node must allow bodies over 2 MB (a reference image or an avatar) and wait longer than a generation (up to ~3 Gemini attempts of 60 s).
- `getClientOrigins()` (`utils/helpers.ts`) reads `CLIENT_URL`; outside production it adds
  `localhost:5173`/`5174`. Only those origins pass CORS, and any POST/PUT/PATCH/DELETE carrying
  another `Origin` is refused with `ORIGIN_NOT_ALLOWED` (CORS alone would still run a
  cross-site form post). Share links redirect to the first origin.
- Auth cookies are host-only and `SameSite=Strict`, so the site and the API must stay on one
  registrable domain (`zeeshanahmed.dev`); two `*.vercel.app` hosts would never get cookies.
- `client/vercel.json` sends `frame-ancestors none` / `X-Frame-Options`, `nosniff`, a referrer
  policy and a permissions policy on every page.

## Current state / gotchas

### Working features
- Full email auth (signup with email verification, login, forgot/reset/change password
  with OTP email, rate limits on auth routes)
- Thumbnail generation via Gemini AI with platform format, category, style and color presets
- Dashboard: Generate, Gallery, Community, Recycle Bin (all wired to real API)
- Like/unlike, publish/unpublish, soft delete/restore/permanent delete
- Profile editing + avatar upload via Cloudinary
- Dark mode via `data-theme` attribute + CSS variables in `globals.css`; until the user picks
  a theme it follows the OS setting (`store/useTheme.ts`)
- Public, auth and dashboard pages share one look (tokens at `:root`, `PageHeader` /
  `DashboardPage`); homepage: live control demos, a scroll-scrubbed walkthrough
  (GSAP, lazy) and Lenis smooth scroll; no testimonials until real ones exist
- Settings page with profile, password, account deletion and Plan and credits (balance,
  refill date, renewal or end date, Upgrade → `/pricing`, Manage plan → Paddle portal);
  Invoices has no in-app list, it points to Paddle's receipts and the portal
- Paid Pro/Ultra plans through Paddle (see Billing above); `PricingCard` opens checkout
- Monthly free-credit refill, stuck-generation cleanup, the 30-day recycle-bin purge and the
  trending score (likes decayed by the age since first publish, `TRENDING_*` in
  `constants.ts`; `publishedAt` is kept through unpublishing so it can't be reset)
  (`utils/scheduled-jobs.ts`); permanent deletes all go through `deleteThumbnailsForever`
- `/thumbnail/:id` fetches by id (`useThumbnail`, router state is only a placeholder), and
  Share copies the server's `/share` link so previews show the image

### Not implemented / placeholder
- **Plan switching** — subscribers can cancel and re-subscribe, but not switch Pro ↔ Ultra
  in place.
- **Google OAuth** — no `/auth/google` endpoint; the Google button is hidden until it exists.
- **Recreate** — commented out for now (page, route, sidebar and footer links); no upload-and-remix flow.
- **Follow system** — `followersCount`/`followingCount` fields exist but no endpoints or model.

### Known bugs
- Rate-limit counters are in memory: a restart resets them, and running several processes
  (pm2 cluster mode) would give each its own count; that needs a shared store such as Redis.
- `likeDislik.modal.ts` — filename should be `.model.ts`.
- `halper-functions.ts` and `cloudniary.ts` are misspelled filenames.
