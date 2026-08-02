---
name: testing-vitest
description: Use this skill when writing or reviewing Unit tests or Component tests for a Vue 3 + TypeScript codebase with Vitest. Triggers on requests to test composables (plain functions, or ones using lifecycle hooks / provide-inject), test Single-File Components (props, emits, slots, rendered DOM, user interaction), configure Vitest for a Vite-based Vue project, or write .test.ts / .spec.ts files. Also applies to TDD workflows and to deciding whether a piece of logic belongs in a unit test or a component test. Does NOT cover End-to-End (E2E) testing (Playwright/Cypress) — that is out of scope for this skill.
metadata:
  author: sigd
  version: "1.0"
---

# Vue 3 Testing with Vitest (Unit + Component)

## Scope

This skill covers exactly 2 of the 3 testing types defined by the Vue team:

1. **Unit testing** — isolated functions, classes, and composables. See `references/composables.md`.
2. **Component testing** — mounting, rendering, and interacting with a Vue SFC. See `references/components.md`.

E2E testing is explicitly out of scope. If the task requires E2E (multi-page flows, real network requests against a built app), say so and stop — do not improvise E2E guidance from this skill.

## Setup baseline

Assume a Vite-based Vue 3 + TypeScript project (SIGD frontend conventions: `src/modules/<slice>/`, `src/shared/`).

### 1. Install

```bash
npm install -D vitest @vue/test-utils happy-dom
```

- `vitest` — the test runner.
- `@vue/test-utils` — only needed for Component testing (see `references/components.md`), but safe to install upfront.
- `happy-dom` — lightweight DOM simulator for Node. `jsdom` is a valid alternative (more spec-accurate, slower); pick one, don't install both.

### 2. Configure

If the project already has a `vite.config.ts` (it does, since SIGD is Vite-based), add a `test` block to it rather than creating a separate file — this keeps a single source of Vite config and avoids drift between build and test settings:

```ts
// vite.config.ts
import { defineConfig } from 'vitest/config' // note: from 'vitest/config', not 'vite'

export default defineConfig({
  // ...existing plugins, resolve.alias, etc.
  test: {
    globals: true, // enables describe/it/expect without importing them
    environment: 'happy-dom',
  },
})
```

If there's a reason to keep test config isolated from build config, use a standalone `vitest.config.ts` instead — Vitest reads it in preference to `vite.config.ts` when both exist.

### 3. TypeScript globals (if `globals: true`)

```json
// tsconfig.json (or tsconfig.app.json, wherever "types" lives)
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Without this, `describe`/`it`/`expect` will be flagged as undefined by the TS language server even though they work at runtime.

### 4. Script and run

```json
// package.json
{
  "scripts": {
    "test": "vitest"
  }
}
```

```bash
npm test          # watch mode by default
npx vitest run     # single run, e.g. for CI
```

### File placement

Test files live next to the source file: `useSomething.ts` → `useSomething.test.ts`. Component: `SomeComponent.vue` → `SomeComponent.test.ts`.

## Decision rule: Unit vs Component

Before writing a test, classify the target, then load the matching reference file:

- **Plain function / composable with no DOM, no template** → Unit test. Read `references/composables.md`.
- **`.vue` SFC, or a composable you want to verify through its rendered effect** → Component test. Read `references/components.md`.
- **A component's internal method or private state** → Do not test directly. Either extract it into a standalone function and unit test that, or drop down to asserting the rendered DOM/emitted events (Component test). Testing private implementation details makes tests brittle against refactors.

## Checklist before finishing a test file

1. Composable is Independent or Dependent? → chose the right strategy (direct call / `withSetup` / `useInjectedSetup`) — see `references/composables.md`.
2. Component test only asserts props/emits/slots/rendered DOM — no `wrapper.vm.*` internals — see `references/components.md`.
3. External I/O (HTTP, storage) is mocked; child components are not.
4. Any `app` created via `withSetup`/`useInjectedSetup` is unmounted.
5. If the task actually needs multi-page or network-against-build behavior, stop and say this is E2E, out of scope.