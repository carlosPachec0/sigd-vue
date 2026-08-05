---
name: axios-http-client-typescript
description: Design and implement a centralized HTTP client with Axios and TypeScript for Vue 3 + Pinia projects, using a per-resource service layer so components and stores never call axios or raw endpoint strings directly. Use whenever the user mentions HTTP requests, REST API consumption, "axios", data fetching, HTTP client, interceptors, network error handling, or when creating/refactoring services, composables, or stores that talk to a backend.
license: MIT
compatibility: Vue 3.4+, TypeScript 5+, Pinia 2+, axios ^1.7
metadata:
  author: carlos
  version: "2.0"
---

# Centralized HTTP Client with Axios and TypeScript

## Setup

Install axios in the target project before generating any file below:

```bash
npm install axios
```

axios ships its own TypeScript type definitions — no `@types/axios` package is needed or should be installed.

## Architecture

```
component
    │  (never imports axios, httpClient, or a raw endpoint string)
    ▼
Pinia store            ← owns isLoading / error reactive state
    │  (knows nothing about URLs or HTTP verbs)
    ▼
{resource}.service.ts   ← knows the endpoint, the verb, and the DTO types
    │
    ▼
BaseHttpService         ← src/shared/api/base-http-service.ts
    │
    ▼
httpClient (AxiosInstance) ← src/shared/api/httpClient.ts
    │
    ▼
axios
```

Hard rules:
- `import axios from 'axios'` may only appear in `src/shared/api/httpClient.ts`.
- No component, composable, or store ever calls `httpClient` or a URL string directly. Every endpoint is wrapped by a service class.
- Reactive state (`isLoading`, `error`) lives in the store, not in the service. The service is a stateless data-access class — adding a second reactive layer on top of Pinia (e.g. a generic `useHttpClient` composable) is redundant and was deliberately dropped from this design.

This skill is agnostic of the auth scheme (cookie/CSRF, Bearer, etc.). If the consuming project needs cookie-based auth, that interceptor is added in the project itself, not here.

## File layout (Screaming Architecture)

Directory names reflect business domains (`academies`, `students`, `payments`), not technical layers. Each module owns its full vertical slice:

```
src/
├── shared/
│   └── api/
│       ├── httpClient.ts        # single Axios instance + error-normalizing interceptors
│       ├── http-error.ts        # HttpError class + normalizeError()
│       └── base-http-service.ts # abstract class with typed get/post/put/patch/delete
└── modules/
    └── {domain}/
        ├── services/{resource}.service.ts   # extends BaseHttpService, declares endpoints
        ├── stores/{resource}.store.ts       # Pinia store, owns isLoading/error
        └── types/{resource}.dto.ts          # request/response DTOs
```

## Components to generate

Each file below is documented as a `references/*.md` reference, not a bare `.ts` file. The code lives inside a fenced code block in the markdown, so this skill folder never looks like a compilable TS project to an editor — no stray "Cannot find module" noise from missing `node_modules` or path aliases that only exist in the target project. Read the reference, then write the real `.ts` file at the target path:

1. **`references/http-error.md` → `src/shared/api/http-error.ts`**
   `HttpError` class + `normalizeError()`. Uses `axios.isAxiosError()` for type narrowing (axios's recommended approach over `instanceof AxiosError`, which can misbehave across bundles).

2. **`references/http-client.md` → `src/shared/api/httpClient.ts`**
   Single `axios.create()` instance with a mandatory `timeout` (a stalled request without one blocks the UI indefinitely) and request/response interceptors that normalize every error to `HttpError` before it propagates.

3. **`references/base-http-service.md` → `src/shared/api/base-http-service.ts`**
   Abstract class exposing `protected get/post/put/patch/delete`, each returning `response.data` already typed. Every resource service extends this instead of re-wrapping `httpClient` from scratch — this is the single point of DRY, not an extra architectural layer.

4. **`references/academy-service.md` → `src/modules/{domain}/services/{resource}.service.ts`**
   Reference service implementation. Duplicate per resource, renaming `Academy`/`academy` to the actual resource.

5. **`references/academy-store.md` → `src/modules/{domain}/stores/{resource}.store.ts`**
   Reference Pinia store: owns `isLoading`/`error`, calls the service, re-throws unhandled cases.

6. **`references/academy-dto.md` → `src/modules/{domain}/types/{resource}.dto.ts`**
   Reference DTO shapes (`{Resource}Dto`, `Create{Resource}Dto`, `Update{Resource}Dto`).

Six references total map to the target project — three shared (1–3) plus three per-domain (4–6), duplicated once per resource.

## Defining a new service

```ts
// src/modules/academies/services/academy.service.ts
import { BaseHttpService } from '@/shared/api/base-http-service'
import type { AcademyDto, CreateAcademyDto } from '../types/academy.dto'

class AcademyService extends BaseHttpService {
  private readonly resource = '/academies'

  getAll(): Promise<AcademyDto[]> {
    return this.get<AcademyDto[]>(this.resource)
  }

  create(payload: CreateAcademyDto): Promise<AcademyDto> {
    return this.post<AcademyDto, CreateAcademyDto>(this.resource, payload)
  }
}

export const academyService = new AcademyService() // exported as a singleton
```

Rules for services:
- One class per resource, named `{Resource}Service`, exported as a lowercase singleton instance (`academyService`), never the class itself.
- Every public method returns a fully typed `Promise<T>` — no method returns `Promise<any>` or an untyped `AxiosResponse`.
- The service is the only place that knows the endpoint path. If the path changes, only this file changes.

## Consuming a service from a Pinia store

```ts
// src/modules/academies/stores/academy.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { academyService } from '../services/academy.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { AcademyDto } from '../types/academy.dto'

export const useAcademyStore = defineStore('academy', () => {
  const academies = ref<AcademyDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function fetchAll(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      academies.value = await academyService.getAll()
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      if (httpError.status === 404) {
        academies.value = []
        return
      }
      error.value = httpError
      throw httpError // re-throw anything the store doesn't know how to resolve
    } finally {
      isLoading.value = false
    }
  }

  return { academies, isLoading, error, fetchAll }
})
```

A component only ever calls `academyStore.fetchAll()` and reads `academyStore.academies` / `.isLoading` / `.error`. It never imports the service or knows an endpoint exists.

## Request cancellation (optional)

For debounced search or fast filter changes, pass `AbortController` via `config.signal` at the service call site instead of letting stale responses overwrite state:

```ts
let controller: AbortController | null = null

search(query: string): Promise<ResultDto[]> {
  controller?.abort()
  controller = new AbortController()
  return this.get<ResultDto[]>('/search', { params: { q: query }, signal: controller.signal })
}
```

An abort produces an `HttpError` with `code === 'ERR_CANCELED'`. The caller must ignore it explicitly rather than treating it as a real failure.

## Testing

Unit tests mock the `httpClient` module (`src/shared/api/httpClient.ts`), never global `axios`. This keeps the mock aligned with the same interface the rest of the code consumes, and services/stores don't need to know about axios internals.

## Review checklist (non-negotiable)

- [ ] `import axios` exists only in `src/shared/api/httpClient.ts`.
- [ ] No component, composable, or store references an endpoint string or `httpClient` directly — only a `{resource}.service.ts`.
- [ ] Every service method has an explicit generic return type, zero implicit `any`.
- [ ] `timeout` is configured on the base Axios instance.
- [ ] Every error crossing the network layer is an `HttpError` instance.
- [ ] No empty `catch` block; unhandled cases are always re-thrown.