# Vue Router

Views (route-level components, conventionally under `views/`) are rendered exclusively through `<RouterView />` — never conditionally swapped with `v-if` on a manually tracked "current page" ref. That manual pattern is the anti-pattern Vue Router exists to replace; if the project has more than one screen, Vue Router owns navigation, not hand-rolled state.

## Installation

```bash
npm install vue-router
```

- `npm install vue-router` currently resolves to the **v5** line (5.x). Vue Router 5 is a transition release: it merges `unplugin-vue-router` (file-based routing) into the core package and introduces **no breaking changes** over v4 — code written against v4's API in this reference runs unmodified on v5. Pin the version in production (`vue-router@^5.0.0` or exact) rather than relying on floating `latest`.
- Vue Router 6 (not yet released) is planned to be ESM-only and to drop deprecated APIs, which is expected to include the legacy `next` callback guard signature. Writing guards with the `(to, from) => returnValue` form (below) instead of `next` avoids rework when that lands.
- New projects: `npm create vue@latest` offers to scaffold Vue Router into a Vite-based project automatically — prefer this for a fresh project over wiring the router by hand.
- Peer requirement: Vue Router 4/5 targets Vue 3 (this skill's baseline); there is no separate install step for Vue itself beyond what this skill already assumes.

## Setup

```ts
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app')
```

- `createWebHistory()` for a real SPA (matches this skill's default of a decoupled Vue 3 SPA on static hosting under `history` mode) — not `createWebHashHistory()` unless the hosting genuinely can't rewrite all paths to `index.html`, and not `createMemoryHistory()` outside SSR/testing.
- Route components are always lazy-loaded (`() => import('../views/X.vue')`) for code splitting — a static `import X from '../views/X.vue'` at the top of the routes file defeats the point of route-based chunking. See `references/tooling.md` for the matching Vite config, if any is needed (usually none — Vite handles this automatically).
- `App.vue` needs exactly one `<RouterView />` in the base case; named/nested views are the exception, not the default (see Nested/Named Routes in the official guide if the layout genuinely requires more than one outlet).

## Composables: `useRouter()` / `useRoute()`

Inside `<script setup lang="ts">`, there is no `this.$router`/`this.$route` — use the composables instead. Both are fully typed by `vue-router` without extra annotation.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const postId = computed(() => route.params.id)

function goBack() {
  router.push({ name: 'home' })
}
</script>
```

- `useRoute()` returns the reactive current route — read from it, don't mutate it.
- `useRouter()` returns the router instance — use it for `push`/`replace`/`back`, never mutate `route` directly to navigate.
- Prefer named routes (`router.push({ name: 'about' })`) over hardcoded path strings (`router.push('/about')`) — renaming a path in the route table then only requires one edit.

## Navigation guards

Guard signature is `(to, from) => ...`; return a value instead of calling a `next()` callback — the `next` third argument is legacy (still supported, but don't write new guards with it: `next` called more than once in one pass is a common source of hangs). Return `false` to cancel, a route location to redirect, or nothing/`true`/`undefined` to proceed.

```ts
// router/index.ts
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !auth.isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

In-component guards use the Composition API forms, not the Options API `beforeRouteEnter`/`beforeRouteUpdate`/`beforeRouteLeave` methods:

```ts
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    return window.confirm('Discard unsaved changes?')
  }
})
```

There is no Composition API equivalent of `beforeRouteEnter` — that guard fires before the component exists, so it belongs at the route-config level (`beforeEnter` on the route) or in a global `beforeEach`/`beforeResolve`, not inside the component itself.

## Typed route meta

Extend `RouteMeta` via module augmentation, in its own `.d.ts` file — consistent with this skill's standalone-declaration rule (interfaces/classes never inline, and this is a global ambient augmentation, so it does not live inside `router/index.ts`):

```ts
// router/route-meta.d.ts
import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth: boolean
    isAdmin?: boolean
  }
}
```

```ts
{ path: '/admin', component: () => import('../views/AdminView.vue'), meta: { requiresAuth: true, isAdmin: true } }
```

With this augmentation, `to.meta.requiresAuth` in a guard is typed as `boolean`, not `unknown` — no `as` casts needed at the call site.

## What NOT to do

- Don't render views with `v-if`/manual state instead of `<RouterView />` + route config.
- Don't statically `import` route components at the top of the routes file — always lazy `() => import(...)`.
- Don't write new guards using the `next` callback style; return a value instead.
- Don't use Options API `beforeRouteEnter`/`beforeRouteUpdate`/`beforeRouteLeave` in a `<script setup>` file — use `onBeforeRouteUpdate`/`onBeforeRouteLeave`.
- Don't inline the `declare module 'vue-router'` meta augmentation inside a component or inside `router/index.ts` — it's ambient, global, and belongs in its own `.d.ts` file.
- Don't hardcode path strings for `push`/`replace`/`RouterLink :to` when the route is named — use the name.