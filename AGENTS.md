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
cd client && npm run lint     # eslint 9, flat config

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
├─ pages/
│  ├─ auth/          # login/signup/forgot/otp/reset + core/ (API layer + hooks)
│  ├─ dashboard/     # generate / gallery / recreate / recycle-bin / settings
│  │  ├─ components/ # DashboardPage (shared placeholder template)
│  │  └─ core/       # _models.ts, _requests.ts, hooks/ (React Query hooks)
│  ├─ community/     # public community gallery
│  ├─ profile/       # user profile page
│  ├─ thumbnail-preview/  # individual thumbnail detail page
│  ├─ yt-preview/    # YouTube preview mockup page
│  └─ layouts/       # DashboardLayout, MainLayout, DashboardHeader, DashboardSidebar
├─ routes/           # routes.tsx, GuestRoute, ProtectedRoute
├─ store/            # Zustand stores (useSessionStore, useTheme)
├─ lib/              # axios instance, imageValidation, thumbnail helpers
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
- **Marketing** (`MainLayout` = Navbar + Footer) — `/`, `/community`, `/preview`,
  `/profile`, `/thumbnail/:id` are public.

Auth pages render outside `MainLayout` (no navbar/footer).

### Auth / session flow

- **`store/useSessionStore.ts`** (`useSession`) is the single source of truth:
  `user`, `isAuthenticated`, `isRestoring`. It persists user data to one localStorage
  key (`tg_session`). Tokens are stored in **httpOnly cookies**, not in the store.
- **`components/SessionProvider.tsx`** calls `POST /auth/verify` once on every page
  load and blocks rendering until it settles, so guards never act on stale state.
- **`lib/axios.ts`** interceptor: on `401` + `error: "TOKEN_EXPIRED"` or
  `"TOKEN_MISSING"`, calls `/auth/refresh` once and replays the original request.
  On refresh failure, clears the session and logs the user out.
- **`pages/auth/core/`** — `_models.ts` (types), `_requests.ts` (API calls),
  `_schemas.ts` (zod), `hooks/` (React Query hooks: `useLogin`, `useSignup`,
  `useMe`, `useRefreshToken`, `useVerifySession`, `useLogout`).

### Dashboard pages

| Page | Route | Status |
|---|---|---|
| Generate | `/dashboard/generate` | ✅ Fully wired — PromptCard → API → shows generated thumbnails |
| Gallery | `/dashboard/gallery` | ✅ Filters, sort, pagination, delete, publish |
| Community | `/dashboard/community` | ✅ Same Community component as marketing `/community` |
| Recreate | `/dashboard/recreate` | ❌ Placeholder stub — `DashboardPage` template only |
| Settings | `/dashboard/settings` | 🔲 UI built (EditProfile, Billing, Invoices) — billing not wired |
| Recycle Bin | `/dashboard/recycle-bin` | ✅ Restore + permanent delete with ConfirmDialog |

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
6. **Animation** — `motion` with the recurring entrance pattern:
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
  Used by both `HeroSection` and the dashboard generate page.
- **`PopoverPanel.tsx`** — native-popover shell (title + Done). Wrap any picker in it.
- **`StylePicker` / `AspectRatioPicker` / `ColorSchemePicker` / `ReferenceImageUpload`**
  — controlled (`value`/`onChange`) pickers used inside `PromptCard`.
- **`ThumbnailCard.tsx`** — the unified card for displaying thumbnails. Supports
  `showDelete`, `showLike`, `showPublish`, `showRecycleBinActions` props. Used across
  generate, gallery, community, profile, and recycle-bin pages.
- **`ConfirmDialog`** (`components/modals/confirmation-dialog/`) — modal dialog for
  delete confirmations. Props: `open`, `onClose`, `onConfirm`, `title`, `description`,
  `confirmLabel`, `variant` (danger | default), `loading`.
- **`Input.tsx`** (icon + input), **`Alert.tsx`** (error | success | warning | info),
  **`Wrapper.tsx`** (max-w-7xl container), **`MobileNav.tsx`**, **`Select.tsx`**,
  **`ThumbnailScroller.tsx`**, **`SectionTitle.tsx`**, **`Skeleton.tsx`**,
  **`ThumbnailCardSkeleton.tsx`**, **`TabSwitcher.tsx`**, **`DebounceSearch.tsx`**.

`lib/imageValidation.ts` owns image rules (extensions, MIME, 5 MB max) and returns a
user-facing message; reuse it for any upload.

## Server architecture

```
server/
├─ server.ts                 # dotenv + connect mongo + app.listen(process.env.PORT)
└─ src/
   ├─ app.ts                 # express app; cors({ origin: CLIENT_URL, credentials: true })
   ├─ config/                # genai.ts (Gemini), cloudinary.ts, hf.ts (HuggingFace — unused)
   ├─ constants/             # enums.ts (all enums), constants.ts (style prompts, credit costs, sort)
   ├─ routes/                # auth, user, thumbnail, thumbnail-public, uploads-files
   ├─ controllers/           # auth, user, thumbnail, upload-files
   ├─ middlewares/            # auth (JWT), multer (image upload), validate (zod)
   ├─ models/                # user, refreshToken, thumbnail, likeDislike
   ├─ schemas/               # media.schema.ts (reusable Mongoose subdocument)
   ├─ validations/           # zod schemas for auth + thumbnail endpoints
   ├─ helper/                # halper-functions.ts (bcrypt), token-helpers.ts (JWT)
   ├─ utils/                 # apiResponse.ts, cloudniary.ts, email.ts, pagination.ts, helpers.ts
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
`REFRESH_INVALID`, `REFRESH_MISSING`, `INSUFFICIENT_CREDITS`, `GENERATION_FAILED`.

### Auth endpoints (`/auth`, public unless noted)

`POST /login`, `POST /signup`, `POST /refresh`, `POST /verify`, `POST /logout`,
`GET /me` (behind `authenticationToken`), `POST /forgot-password`, `POST /verify-otp`,
`POST /reset-password`.

- Access token 15 min, refresh token 30 days (`helper/token-helpers.ts`). Secrets are
  read **inside** the functions — `dotenv.config()` runs *after* the module graph is
  imported, so top-level `process.env` reads are `undefined`.
- Refresh tokens are persisted in `refreshToken.model.ts` with a TTL index and can be
  revoked (logout deletes them).
- `/verify` is deliberately **not** behind `authenticationToken`: it must inspect an
  already-expired access token and fall back to the refresh cookie.
- Tokens are set as **httpOnly cookies** (not returned in the body to the client).

### Thumbnail endpoints (`/thumbnail`)

**Public** (via `thumbnail-public.routes.ts`, no auth):
- `GET /thumbnail/community` — paginated community thumbnails

**Protected** (via `thumbnail.routes.ts`, behind `authenticationToken`):
- `POST /thumbnail` — generate thumbnail (multipart form with optional `referenceImage`)
- `GET /thumbnail` — user's own thumbnails (paginated, filterable)
- `GET /thumbnail/community` — community thumbnails (with like status for current user)
- `GET /thumbnail/recycle-bin` — soft-deleted thumbnails
- `PATCH /thumbnail/:id/publish` — toggle publish/unpublish
- `POST /thumbnail/:id/like` — toggle like/unlike
- `DELETE /thumbnail/:id` — soft delete (move to recycle bin)
- `PATCH /thumbnail/:id/restore` — restore from recycle bin
- `DELETE /thumbnail/:id/permanent` — permanently delete (also removes from Cloudinary)

### User endpoints

- `GET /users` — list all users (protected by parent middleware, **no pagination — security concern**)
- `PATCH /users/profile` — update profile (fullName, username, bio, website)
- `POST /upload/avatar` — upload avatar image (replaces old one on Cloudinary)

### AI Generation flow

1. Client sends `POST /thumbnail` with `title`, `prompt`, `style`, `aspect_ratio`,
   `color_scheme`, `text_overlay`, and optional `referenceImage` file
2. Server checks credits (`CREDIT_COST.GENERATE_COST = 5`)
3. Creates a thumbnail document with `isGenerating: true`
4. Builds a detailed prompt from style presets (`constants/constants.ts`), color scheme
   descriptions, text overlay rules, reference image instructions
5. Calls `genai().models.generateContent()` with `gemini-3.1-flash-lite-image` model
6. Saves resulting image to local temp file → uploads to Cloudinary → updates thumbnail
   document with `isGenerating: false` and the Cloudinary URL
7. Deducts credits from user

### Credits system

- Free users get 20 total credits
- Generate costs 5 credits, Recreate costs 10 (not yet implemented)
- `user.totalcredits` vs `user.creditsUsed` — checked before generation
- **Credits never reset** — no cron job or subscription webhook resets them

Env: `PORT`, `SECRET`, `REFRESH_SECRET` (falls back to `SECRET`), `CLIENT_URL`,
`CLIENT_ID`, `GEMINI_API_KEY`, `CLOUDINARY_URL`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `CLOUDINARY_NAME`, `SMTP_HOST`, `SMTP_USER`,
`SMTP_PASSWORD`, `SMTP_TLS_PORT`.
Client: `VITE_API_BASE_URL` (defaults to `http://localhost:8000`).

## Current state / gotchas

### Working features
- Full email auth (signup, login, forgot/reset password with OTP email)
- Thumbnail generation via Gemini AI with style/color/aspect-ratio presets
- Dashboard: Generate, Gallery, Community, Recycle Bin (all wired to real API)
- Like/unlike, publish/unpublish, soft delete/restore/permanent delete
- Profile editing + avatar upload via Cloudinary
- Dark mode via `data-theme` attribute + CSS variables in `globals.css`
- Settings page with EditProfile section (BillingSection/InvoicesSection are UI shells)

### Not implemented / placeholder
- **Payment/subscription** — pricing page exists, user model has plan fields, but no
  payment integration (Stripe/LemonSqueezy). Credits never reset.
- **Google OAuth** — login button renders but no `/auth/google` endpoint exists.
- **Recreate** — placeholder page only; no upload-and-remix flow.
- **Email verification** — `isVerified` field exists but never gets set; no verify-email endpoint.
- **Follow system** — `followersCount`/`followingCount` fields exist but no endpoints or model.
- **View counting** — `viewsCount` field exists but is never incremented.
- **Public profiles** — `/profile` shows current user only (hardcoded data in places);
  no `/profile/:username` route for viewing others.

### Known bugs
- `Profile.tsx` has hardcoded name "Ahtisham khan" instead of reading from session.
- `hf.ts` error message says "GEMINI_API_KEY is missing" (copy-paste bug).
- `likeDislik.modal.ts` — filename should be `.model.ts`; `unique: true` is set at
  schema level instead of as a compound index on `{ userId, thumbnailId }`.
- `lib/axios.ts` interceptor has an operator precedence bug: missing parentheses around
  the OR condition so `TOKEN_MISSING` triggers refresh without checking status code.
- `halper-functions.ts` and `cloudniary.ts` are misspelled filenames.
- `.env.example` is incomplete (missing SMTP, REFRESH_SECRET, MONGO_URI vars).
- `GET /users/` returns all users without pagination — potential security/perf issue.
- `express-rate-limit` is installed but not applied to any route.
- Community "Load More" increments page instead of accumulating — replaces results.
