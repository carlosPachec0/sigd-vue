# Reactivity, Composables, Provide/Inject, Watchers

## Reactivity: `ref` vs `reactive`

- Default to `ref()` for primitives and for any value that may be reassigned wholesale (arrays, objects you replace, not just mutate).
- `reactive()` only for object state that is mutated in place and never reassigned as a whole — reassigning a `reactive()` binding breaks reactivity.
- Never destructure a `reactive()` object directly; use `toRefs()` first if destructuring is required.
- Type inference from `ref(initialValue)` is usually sufficient; annotate explicitly only when the initial value doesn't convey the full union: `ref<string | null>(null)`.

## Template refs (Vue 3.5)

Prefer `useTemplateRef` over the bare `ref` + matching template `ref="name"` pattern for clearer typing and decoupling from variable naming:

```ts
import { useTemplateRef } from 'vue'

const inputRef = useTemplateRef<HTMLInputElement>('input')
```

```html
<input ref="input" />
```

## Composables

A composable is a plain `.ts` function, prefixed `use`, that composes reactive state and returns typed refs. See `assets/composable.template.ts` for a copy-ready scaffold.

```ts
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubled, increment }
}
```

Rules:
- Return an object of refs/computed/functions, never a `reactive()` wrapper.
- Accept `Ref<T> | T` for parameters that may be passed reactively from the caller (`unref()` internally) only when that flexibility is an explicit requirement — otherwise keep the signature plain and let the caller pass `.value`.
- Side effects (event listeners, timers) get cleanup in `onScopeDispose` or `onUnmounted` so the composable is safe to use outside a component (e.g. in another composable) as well as inside one.

## provide / inject

Type the injection key to avoid `unknown` at the call site:

```ts
// keys.ts
import type { InjectionKey, Ref } from 'vue'

export const CounterKey: InjectionKey<Ref<number>> = Symbol('counter')
```

```ts
// provider
provide(CounterKey, ref(0))

// consumer
const counter = inject(CounterKey) // Ref<number> | undefined
```

Always handle the `undefined` branch (throw with a descriptive message, or supply a default) rather than asserting with `!`.

## Watchers

- `watch(source, cb)` for explicit, named sources — prefer this over `watchEffect` when the dependency list should be obvious to a reader.
- **Vue 3.5+**: `deep: 1` for shallow-plus-one array/object watching without a full deep traversal, when only top-level mutations matter.
- Clean up manually-created effects inside the watcher with `onWatcherCleanup()` (3.5+) instead of a separate `onUnmounted` for watcher-scoped cleanup.