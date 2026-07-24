# AGENTS.md

Guidance for Codex when working in this repository.

## Project

AI Thumbnail Generator ("ThumbnailGo") — a web app where a user describes a thumbnail,
picks a style, aspect ratio and optional reference image, and the app generates a
YouTube/social thumbnail.

Two workspaces, each with its own `package.json`:

- `client/` — React 19 + TypeScript + Vite frontend
- `server/` — Express 5 + Mongoose API

The root `package.json` is incidental (a stray `@types/bcrypt` dep) — do not add
project scripts there.

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
├─ sections/         # large composed marketing sections (HeroSection, PricingSection, …)
├─ pages/            # route screens, one folder per page
│  ├─ auth/          # login/signup/forgot/otp/reset + core/ (API layer)
│  └─ dashboard/     # generate / recreate / profile / settings
├─ routes/           # routes.tsx, MainLayout, DashboardLayout, guards
├─ store/            # Zustand stores (useSessionStore)
├─ lib/              # axios instance, imageValidation
└─ data/             # static/mock arrays typed against types.ts
```

Stack: React 19, react-router-dom v7, **@tanstack/react-query** (server state),
**@tanstack/react-form + zod** (forms), Zustand v5 (session), axios,
`motion` (from `motion/react`), lucide-react, Tailwind CSS v4 via `@tailwindcss/vite`.

### Routing

`routes.tsx` has three groups:

- **Guest-only** (`GuestRoute`) — `/login`, `/signup`, `/forgot-password`,
  `/verify-otp`, `/reset-password`. Signed-in users bounce to `/dashboard/generate`.
- **Dashboard** (`ProtectedRoute` → `DashboardLayout` sidebar) — `/dashboard/*`
  (`generate`, `recreate`, `community`, `profile`, `settings`). `/dashboard`
  redirects to `/dashboard/generate`.
- **Marketing** (`MainLayout` = Navbar + Footer) — `/`, `/community`, `/generate`,
  `/preview` are public; `/my-generation` is protected.

Auth pages render outside `MainLayout` (no navbar/footer).

### Auth / session flow

- **`store/useSessionStore.ts`** (`useSession`) is the single source of truth:
  `user`, `accessToken`, `isAuthenticated`, `isRestoring`. It persists **both**
  user and token to one localStorage key (`tg_session`).
- **`components/SessionProvider.tsx`** calls `POST /auth/verify` once on every page
  load and blocks rendering until it settles, so guards never act on stale state.
- **`lib/axios.ts`** attaches the bearer token and, on `401` + `error: "TOKEN_EXPIRED"`,
  calls `/auth/refresh` once and replays the original request.
- **`pages/auth/core/`** — `_models.ts` (types), `_requests.ts` (API calls),
  `_schemas.ts` (zod), `hooks/` (React Query hooks: `useLogin`, `useSignup`,
  `useMe`, `useRefreshToken`, `useVerifySession`, `useLogout`).

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
- **`PromptCard.tsx`** — the prompt textarea card. Clicking the card focuses the
  textarea; controlled (`value`+`onChange`) or uncontrolled; `showTools` toggles the
  style/format/reference popovers. Used by both `HeroSection` and the dashboard.
- **`PopoverPanel.tsx`** — native-popover shell (title + Done). Wrap any picker in it.
- **`StylePicker` / `AspectRatioPicker` / `ReferenceImageUpload`** — controlled
  (`value`/`onChange`) pickers used inside `PromptCard`.
- **`Input.tsx`** (icon + input), **`Alert.tsx`** (error | success | warning | info),
  **`Wrapper.tsx`** (max-w-7xl container), **`MobileNav.tsx`**, **`Select.tsx`**,
  **`ThumbnailScroller.tsx`**, **`SectionTitle.tsx`**.

`lib/imageValidation.ts` owns image rules (extensions, MIME, 5 MB max) and returns a
user-facing message; reuse it for any upload.

## Server architecture

```
server/
├─ server.ts                 # dotenv + connect mongo + app.listen(process.env.PORT)
└─ src/
   ├─ app.ts                 # express app; cors({ origin: CLIENT_URL, credentials: true })
   ├─ routes/                # auth.routes.ts, user.routes.ts
   ├─ controllers/           # handleXxx named exports
   ├─ middlewares/           # auth (JWT), multer, validate (zod)
   ├─ models/                # user.model.ts, refreshToken.model.ts
   ├─ validations/           # zod schemas, passed to validate(schema)
   ├─ helper/                # halper-functions.ts (bcrypt), token-helpers.ts (JWT)
   ├─ utils/                 # apiResponse.ts, cloudniary.ts
   └─ types/express.d.ts     # augments Request.user
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
`REFRESH_INVALID`, `REFRESH_MISSING`.

### Auth endpoints (`/auth`, public unless noted)

`POST /login`, `POST /signup`, `POST /refresh`, `POST /verify`, `POST /logout`,
`GET /me` (behind `authenticationToken`).

- Access token 15 min, refresh token 30 days (`helper/token-helpers.ts`). Secrets are
  read **inside** the functions — `dotenv.config()` runs *after* the module graph is
  imported, so top-level `process.env` reads are `undefined`.
- Refresh tokens are persisted in `refreshToken.model.ts` with a TTL index and can be
  revoked (logout deletes them).
- `/verify` is deliberately **not** behind `authenticationToken`: it must inspect an
  already-expired access token and fall back to the refresh cookie.

Env: `PORT`, `SECRET`, `REFRESH_SECRET` (falls back to `SECRET`), `CLIENT_URL`,
`CLIENT_ID`. Client: `VITE_API_BASE_URL` (defaults to `http://localhost:8000`).

## Current state / gotchas

- Thumbnail generation is **not implemented** — no server endpoint; the dashboard
  grid and gallery read from `client/src/data/thumbnail.ts`. Likes/views are derived
  deterministically in `data/community.ts` (`getEngagement`), not real data.
- Google sign-in renders but is **not wired** (no `/auth/google` endpoint).
- The Dark Mode button in `DashboardLayout` toggles a `dark` class, but no dark theme
  tokens exist yet, so nothing changes visually.
- `Recreate` is a placeholder page.
- Legacy pages still exist and overlap the dashboard: `pages/generate/Generate.tsx`
  and `pages/my-generation/` (still dark-themed, still using the dark `ThumbnailCard`).
- `components/modals/confirmation-modal` imports `antd` and `react-icons`, which are
  **not installed** — it fails type-check. Pre-existing; leave it unless asked.
- `PROJECT_ANALYSIS.md` is an outdated prose walkthrough of the client.
