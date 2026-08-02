# Pinia

Current stable major: Pinia 3.x. Official state-management library for Vue — use it for state genuinely shared across the app (auth/session, cart, multi-step form state) or preserved across page/route changes, not for state local to a single component (see "When NOT to use a store" below).

## Installation

```bash
npm install pinia
```

```ts
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

`app.use(pinia)` must run before `app.mount(...)`, same ordering as any other Vue plugin.

## Setup Stores — the Composition API form (default for this skill)

`defineStore()` accepts either an Options object (`state`/`getters`/`actions`, mirrors the Options API) or a Setup function (mirrors `<script setup>`). This skill always uses the Setup Store form, for the same reason it uses `<script setup>` over the Options API: consistency with the rest of the codebase, and full type inference without extra annotation.

```ts
// stores/user.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const isLoggedIn = computed(() => name.value !== '')

  function login(newName: string) {
    name.value = newName
  }

  return { name, isLoggedIn, login }
})
```

Mapping from Setup Store to Option Store concepts — useful for reading Pinia's own docs or older code, not something to hand-translate in new code:

| Setup Store | Option Store equivalent |
|---|---|
| `ref()` / `reactive()` | `state` |
| `computed()` | `getters` |
| `function()` | `actions` |

Rules:
- **Return every piece of state** (every `ref`/`reactive`) from the setup function. Pinia only tracks state it receives back — an unreturned `ref` is invisible to devtools, SSR, and plugins, and there is no supported way to have "private" store state. If a value genuinely shouldn't be mutated from outside, return it via a `computed` or a getter function, not by omitting it.
- Return refs/computed/functions, same discipline as a composable — never return a raw `reactive()` object.
- The store `id` (first argument to `defineStore('user', ...)`) must be unique across the app; colocate the ID string with the store definition, don't compute it dynamically. Naming convention for the returned composable: `use<Name>Store` (`useUserStore`, `useCartStore`) — this is what Pinia's own docs assume and what its devtools integration expects.
- **One store per file.** This both lets the bundler code-split per store and gives the store its own clean home for its own standalone types, consistent with this skill's standalone-declaration rule.

## Accessing app-provided values (Router, Route, DI-provided values) from a store

A Setup Store runs in an app-level scope, not a component scope, but it can still read anything `provide`d at the app level, via `inject()` — same API as in a component:

```ts
// stores/search-filters.ts
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'

export const useSearchFiltersStore = defineStore('search-filters', () => {
  const route = useRoute()
  const appProvided = inject('appProvided') // requires app.provide('appProvided', ...) in main.ts

  // ...

  return {
    // don't return `route` or `appProvided` themselves — see below
  }
})
```

Do not return `route` (or any app-provided/injected value) from the store. It doesn't belong to the store's own state, and components can already reach it directly with `useRoute()` / `inject(...)` — returning it from the store just creates a second, redundant access path that can drift out of sync with expectations about where routing state lives.

## Using a store in a component

```vue
<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
</script>

<template>
  <button @click="store.increment">{{ store.doubleCount }}</button>
</template>
```

The store instance is `reactive`-wrapped: no `.value` needed when reading it in the template or via `store.x` in script, but for that same reason **it cannot be destructured** without breaking reactivity — identical constraint to `reactive()` objects generally (see `references/reactivity-composables.md`).

```ts
const store = useCounterStore()

// Bad: breaks reactivity — name/doubleCount are frozen at this instant, never update
const { name, doubleCount } = store

// Good: read through the store instance directly
store.name
store.doubleCount
```

## Destructuring with `storeToRefs`

When a component genuinely needs to destructure (e.g. to pass into a composable, or for template brevity without repeating `store.` everywhere), use `storeToRefs()` — it produces a `ref` for every reactive state/getter property while leaving actions as plain functions:

```ts
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()

// name and doubleCount stay reactive as refs
const { name, doubleCount } = storeToRefs(store)

// actions are not reactive state — destructure them directly from the store, not through storeToRefs
const { increment } = store
```

## When NOT to use a store

State that's local to one component/page (e.g. whether a dropdown is open) belongs in that component's own `ref`, not in a store. Reaching for a store by default, for everything, is the same anti-pattern as global variables — it defeats the locality that makes a component's behavior easy to reason about. If logic is shared but doesn't need to be global *state*, a plain composable is usually the better fit than a store.

## What NOT to do

- Don't use the Options Store form (`{ state, getters, actions }`) in a codebase standardized on `<script setup>` — it's supported but inconsistent with the rest of this skill's conventions.
- Don't omit a `ref`/`reactive` from a Setup Store's return object to "hide" it — it silently breaks SSR, devtools, and plugins instead of actually staying private.
- Don't destructure a store instance directly (`const { x } = store`) — use `storeToRefs(store)` for state/getters, and destructure actions separately.
- Don't return `route`, injected app-level values, or anything not owned by the store itself from the store's setup function.
- Don't put two stores in one file, or reuse a store `id` across two different `defineStore()` calls.