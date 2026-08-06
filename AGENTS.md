# AGENTS.md — SIGD Frontend

## What Is This

SIGD (Sistema Integral de Gestión Deportiva) is the **frontend** for a sports academy management platform. It's a Vue 3 SPA that talks to a Laravel REST API backend. Academy owners use it to manage academies, students, attendance, payments, and offers.

This is a **university project** (Proyecto de Aplicación, Semestre 3, UNIR).

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Vue 3 (Composition API, `<script setup lang="ts">`) |
| Language | TypeScript (strict) |
| Build | Vite |
| State | Pinia (Composition API style stores) |
| Routing | Vue Router 5 (HTML5 history mode) |
| HTTP | Axios (centralized instance with interceptors) |
| Testing | Vitest + happy-dom + @vue/test-utils |

## Architecture

### Module Structure

Every domain entity follows the same **vertical slice** pattern:

```
src/{module}/
├── types/         # TypeScript DTOs (response and request interfaces)
├── services/      # API service class extending BaseHttpService
├── stores/        # Pinia store with reactive state + CRUD actions
├── components/    # Vue form/presentational components (if needed)
└── views/         # Full page views (if needed)
```

Active modules: `academies`, `students`, `offers`, `payments`, `assistance`, `authentication`, `profile`.

### Key Files

| File | Role |
|------|------|
| `src/shared/api/httpClient.ts` | Singleton Axios instance. Injects Bearer token from `localStorage`. Auto-redirects to `/login` on 401. |
| `src/shared/api/base-http-service.ts` | Abstract base class all API services extend. Provides typed `get/post/put/patch/delete`. |
| `src/shared/api/http-error.ts` | `HttpError` class wrapping Axios errors. Provides `displayMessage`, `errors[]`, `hasResponse`. |
| `src/shared/layouts/AppLayout.vue` | Shell layout for authenticated pages (sticky header, nav, mobile menu, logout). |
| `src/shared/styles/tokens.css` | Design system: CSS custom properties for colors, typography, spacing, shadows. |
| `src/shared/components/` | Reusable UI: `BaseAlert`, `BaseButton`, `BaseCard`, `BaseInput`, `BaseSpinner`. |
| `src/router/index.ts` | Route definitions with `requiresAuth` / `guestOnly` meta. Navigation guards using `localStorage`. |
| `src/main.ts` | App bootstrap — mounts Vue with Pinia and Router. |
| `src/App.vue` | Root component — restores session, wraps authenticated routes in `AppLayout`. |

### Data Flow

```
View → Pinia Store → Service → BaseHttpService → Axios → Laravel API
                    ↕
              HttpError handling (normalize → store.error → component)
```

- Components emit events or call store actions directly.
- Stores manage `isLoading`, `error`, and domain data state.
- Services are thin wrappers — they call `BaseHttpService` methods and return typed data.
- The Axios interceptor attaches `Authorization: Bearer <token>` to every request.
- On 401 (except login), the interceptor clears the token and redirects to `/login`.

### Authentication

- Tokens stored in `localStorage` under key `sigd_token`.
- `router.beforeEach` guard: redirects unauthenticated users away from `requiresAuth` routes, and authenticated users away from `guestOnly` routes.
- `App.vue` calls `authStore.restoreSession()` on mount.
- Email verification status is tracked; unverified users see a warning banner.

### Backend API

The backend is a Laravel app using Sanctum token auth at `http://localhost:8000`. Full API reference is in `how-interact-with-backend.md`. Base path: `/api/v1/`.

Entity relationships:
```
User (1) → (N) Academy
Academy (1) → (N) Student
Academy (1) → (N) Offer
Student (1) → (N) Assistance
Student (1) → (N) Payment
```

## Conventions

- **Language**: All code in TypeScript. Components use `<script setup lang="ts">`.
- **State**: Pinia stores use the Composition API function syntax (`defineStore('name', () => { ... })`).
- **Props/Emits**: Defined as separate `.types.ts` files (e.g., `LoginForm.types.ts`), not inline.
- **Error handling**: Services and stores use `HttpError` / `normalizeError`. UI reads `error.displayMessage` and `error.errors`.
- **Styling**: Scoped CSS in SFCs. Design tokens from `tokens.css` via CSS custom properties. BEM-ish naming.
- **No CSS framework** — all styles are hand-written using the design token system.
- **Path aliases**: `@/` maps to `src/`.

## Testing

```bash
npm test           # runs vitest in watch mode
```

Tests live alongside source files as `*.test.ts`. Test files use `@vue/test-utils` `mount()` for component tests and plain assertions for store/service logic. Environment: happy-dom.

## Environment

- `VITE_API_URL` — backend base URL (e.g., `http://localhost:8000`)
- `.env` file in project root (gitignored)
