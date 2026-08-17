# SIGD - Sistema Integral de Gestión Deportiva

Frontend application for managing sports academies, built with Vue 3, TypeScript, and Vite. Communicates with a Laravel REST API backend using token-based authentication (Sanctum).

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript**
- **Vite** (bundler/dev server)
- **Pinia** (state management)
- **Vue Router** (client-side routing with auth guards)
- **Axios** (HTTP client with interceptors)
- **Vitest** + happy-dom (unit testing)

## Features

- **Authentication** — login, signup, forgot/reset password, email verification, logout
- **Profile management** — view/edit name and email, change password
- **Academy management** — CRUD for academies with discipline and fee structure
- **Student management** — CRUD for students with personal data (gender, DOB, height, weight)
- **Attendance tracking** — record and list student attendance by date
- **Payments** — CRUD for student payment records
- **Responsive design** — mobile-first layout with collapsible navigation
- **Centralized HTTP layer** — Axios instance with auth token injection, 401 auto-redirect, and typed error handling

## Project Structure

```
src/
├── academies/          # Academy CRUD (service, store, types)
├── assistance/         # Attendance records (service, store, types)
├── authentication/     # Login, signup, forgot/reset password, email verification
│   ├── components/     # Form components
│   ├── views/          # Page views
│   ├── stores/         # Auth store (Pinia)
│   └── types/          # DTOs
├── dashboard/          # Dashboard view
├── offers/             # Academy offers CRUD (service, store, types)
├── payments/           # Payment records CRUD (service, store, types)
├── profile/            # Profile view, forms, service, store, types
├── router/             # Vue Router config with auth guards
├── shared/
│   ├── api/            # HTTP client, BaseHttpService, HttpError
│   ├── components/     # Reusable UI (BaseAlert, BaseButton, BaseCard, BaseInput, BaseSpinner)
│   ├── layouts/        # AppLayout (header, nav, mobile menu)
│   └── styles/         # Design tokens (CSS custom properties)
└── students/           # Student CRUD (service, store, types)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or compatible package manager
- Backend API running (see `how-interact-with-backend.md`)

### Setup

```bash
npm install
```

### Environment

Create a `.env` file with the backend URL:

```
VITE_API_URL=http://localhost:8000
```

### Commands

```bash
npm run dev        # Start dev server
npm run build      # Type-check and build for production
npm run preview    # Preview production build
npm test           # Run unit tests
```

## Testing

Tests are located in the `src/tests/` directory, organized by feature:

```
src/tests/
├── authentication/
│   ├── components/
│   │   ├── LoginForm.test.ts
│   │   └── SignupForm.test.ts
│   └── stores/
│       └── auth.store.test.ts
└── shared/
    └── api/
        └── http-error.test.ts
```

Run all tests:

```bash
npm test
```

Run tests for a specific module:

```bash
npm test -- src/tests/authentication
```

Run a specific test file:

```bash
npm test -- src/tests/authentication/stores/auth.store.test.ts
```

Tests use Vitest with happy-dom for DOM simulation and `@vue/test-utils` for component mounting.

## Architecture

Each domain module (academies, students, offers, payments, assistance) follows the same pattern:

- **Types** — TypeScript DTOs matching the API contract
- **Service** — extends `BaseHttpService` with typed CRUD methods
- **Store** — Pinia store with loading/error state management

The `BaseHttpService` wraps Axios and provides typed `get`, `post`, `put`, `patch`, and `delete` methods. An Axios interceptor attaches the Bearer token from `localStorage` and handles 401 responses by clearing the token and redirecting to login.

## Backend API

The backend is a Laravel application using Sanctum for token auth. See `how-interact-with-backend.md` for the full API reference including endpoints, request/response formats, database schema, and entity relationships.
