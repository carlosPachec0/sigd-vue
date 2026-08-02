# Lifecycle Hooks

All lifecycle hooks are imported functions, registered with `on<Hook>(callback)` inside `<script setup>` (or inside a composable that is itself called synchronously during `setup`). They are not typed manually — TypeScript infers the callback signature from `@vue/runtime-core`; the only place explicit typing is needed is on parameters the hook itself passes to the callback (e.g. `onErrorCaptured`).

## Registration rules

- Must be called **synchronously** during component `setup()` (i.e. directly in the top level of `<script setup>`, or synchronously inside a composable invoked from there). Calling one after an `await` or inside a `setTimeout`/event handler has no effect and fails silently — no compile-time error, so this is a common bug.
- Can be called **multiple times** with different callbacks; all registered callbacks run in registration order. Composables commonly rely on this to attach their own `onUnmounted` cleanup alongside the component's own.

```ts
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('mounted')
})

// A second, independent onMounted call is valid and additive
onMounted(() => {
  fetchInitialData()
})
```

## Standard hooks (mirrors Options API `created`/`mounted`/etc., minus `created`/`beforeCreate` — that logic is just top-level `<script setup>` code)

| Hook | Fires |
|---|---|
| `onBeforeMount` | Before the component is mounted to the DOM |
| `onMounted` | After the component and its children are mounted; DOM access (`useTemplateRef`, `document.querySelector` scoped to the component) is safe here |
| `onBeforeUpdate` | Before a reactive-state-triggered DOM update |
| `onUpdated` | After a reactive-state-triggered DOM update |
| `onBeforeUnmount` | Before a component instance is unmounted — last point to read DOM/refs |
| `onUnmounted` | After a component instance is unmounted — register teardown for listeners, timers, subscriptions here |

```ts
import { onMounted, onUnmounted, useTemplateRef } from 'vue'

const elRef = useTemplateRef<HTMLDivElement>('el')

function handleResize() {
  /* ... */
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

## Error handling

### Component-level: `onErrorCaptured`

Catches errors propagating up from descendant components. Type the parameters explicitly — `err` is `unknown` by design in strict TS, so narrow (`instanceof Error`, a type guard) before accessing any property:

```ts
import { onErrorCaptured } from 'vue'
import type { ComponentPublicInstance } from 'vue'

onErrorCaptured((err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  if (err instanceof Error) {
    logError(err.message, info)
  }
  return false // stop propagation; omit or return true to let it keep bubbling
})
```

### App-level: `app.config.errorHandler`

Vue does have a single global error handler, but it is app-instance configuration, not a lifecycle hook — it's set once in `main.ts` after `createApp()`, not inside a component:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err: unknown, instance, info: string) => {
  if (err instanceof Error) {
    console.error(`[global error] ${info}:`, err.message)
  }
  // send to an error-reporting service here
}

app.mount('#app')
```

- `app.config.errorHandler` is the last-resort catch-all: it only fires for an error that no closer `onErrorCaptured` intercepted (or that an `onErrorCaptured` deliberately re-threw / returned `true` from to let it keep bubbling).
- It does **not** catch errors thrown inside `onErrorCaptured` itself, inside native DOM event handlers (`@click="..."` handlers that throw are not routed through Vue's error handling at all — wrap those in their own `try/catch`), or inside `setTimeout`/`Promise` callbacks not awaited from within a tracked lifecycle.
- Use it for centralized logging/reporting (e.g. sending to an error tracker), not for user-facing recovery UI — recovery belongs closer to where the error happened, via `onErrorCaptured` returning `false` to stop propagation and rendering a fallback in that subtree.
- There is exactly one `errorHandler` per app instance; assigning it twice overwrites the first, it does not chain. If a project genuinely needs multiple concerns handled (logging + reporting + alerting), compose them into one function rather than assigning the property more than once.

## keep-alive hooks

Only relevant for components rendered inside `<KeepAlive>`. Do not register these on components that are never cached — they simply won't fire, but adding them unconditionally is dead code that misleads readers about the component's actual lifecycle.

```ts
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // re-fetch or resume side effects when returning to a cached view
})

onDeactivated(() => {
  // pause timers/subscriptions without full teardown
})
```

## SSR-only

`onServerPrefetch` registers an async callback awaited during server-side rendering before the initial render. Irrelevant in client-only SPAs (e.g. a Vite SPA consuming a separate API backend) — don't add it unless the project actually does SSR (Nuxt, `vite-ssr`, etc.).

```ts
import { onServerPrefetch } from 'vue'

onServerPrefetch(async () => {
  await store.fetchInitialData()
})
```

## Dev-only debug hooks

`onRenderTracked` / `onRenderTriggered` fire only in development builds and only help debug *why* a re-render happened (which reactive dependency was tracked/triggered). Use temporarily while debugging a re-render issue; never leave them in committed code.

## Composables encapsulating lifecycle logic

A composable may call lifecycle hooks internally — this is the standard pattern for reusable mount/unmount logic (event listeners, subscriptions, intervals). The composable must still be invoked synchronously from the consuming component's `setup`/`<script setup>` top level for the internal hook registration to work.

```ts
// composables/useEventListener.ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target: EventTarget, event: string, handler: EventListener) {
  onMounted(() => target.addEventListener(event, handler))
  onUnmounted(() => target.removeEventListener(event, handler))
}
```

## What NOT to do

- Don't register a lifecycle hook after an `await`, inside a `.then()`, or inside a conditional/event-handler callback — it silently does nothing.
- Don't use `onActivated`/`onDeactivated` on components that aren't under `<KeepAlive>`.
- Don't leave `onRenderTracked`/`onRenderTriggered` in code past the debugging session that needed them.
- Don't put teardown logic only in `onUnmounted` if the composable might also be used with `<KeepAlive>` — pair with `onDeactivated` when the component can be cached rather than destroyed.