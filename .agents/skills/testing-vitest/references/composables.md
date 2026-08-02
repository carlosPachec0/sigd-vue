# Unit testing composables

Composables split into two categories. Identify which one before choosing a test strategy.

## 1. Independent composables

Use only Reactivity APIs (`ref`, `computed`, `watch`, `reactive`). No lifecycle hooks, no `provide`/`inject`. Test by invoking directly.

```ts
// useSum.ts
import { computed, type Ref, type ComputedRef } from 'vue'

export function useSum(a: Ref<number>, b: Ref<number>): ComputedRef<number> {
  return computed(() => a.value + b.value)
}
```

```ts
// useSum.test.ts
import { ref } from 'vue'
import { describe, it, expect } from 'vitest'
import { useSum } from './useSum'

describe('useSum', () => {
  it('adds two reactive numbers', () => {
    const a = ref(2)
    const b = ref(3)
    expect(useSum(a, b).value).toBe(5)
  })
})
```

## 2. Dependent composables

Use `onMounted`/other lifecycle hooks, or `provide`/`inject`. Calling them outside a component's `setup()` will silently no-op the lifecycle hook (test passes on the initial state but never triggers the mounted logic) or throw on a missing injection. They need a host component context.

**Case A — relies on lifecycle hooks only:** use a `withSetup` helper that mounts a throwaway app and captures the composable's return value.

```ts
// test/withSetup.ts
import { createApp, type App } from 'vue'

export function withSetup<T>(composable: () => T): [T, App] {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })
  app.mount(document.createElement('div'))
  return [result, app]
}
```

```ts
// useLocalStorage.test.ts
import { withSetup } from '../test/withSetup'
import { useLocalStorage } from './useLocalStorage'

it('loads a pre-existing value from localStorage on mount', () => {
  localStorage.setItem('key', JSON.stringify('stored'))
  const [{ value }] = withSetup(() => useLocalStorage('key', 'default'))
  expect(value.value).toBe('stored')
})
```

**Case B — relies on `provide`/`inject`:** `withSetup` is not enough because there is no ancestor providing the value. Wrap the composable in a child component and mount a parent that provides the dependency.

```ts
// test/useInjectedSetup.ts
import { createApp, defineComponent, h, type InjectionKey } from 'vue'

interface InjectionConfig {
  key: InjectionKey<unknown> | string
  value: unknown
}

export function useInjectedSetup<T>(
  setup: () => T,
  injections: InjectionConfig[] = [],
): T & { unmount: () => void } {
  let result!: T

  const Child = defineComponent({
    setup() {
      result = setup()
      return () => h('div')
    },
  })

  const Parent = defineComponent({
    setup() {
      return () => h(Child)
    },
  })

  const el = document.createElement('div')
  const app = createApp(Parent)
  injections.forEach(({ key, value }) =>
    app.provide(key as InjectionKey<unknown>, value),
  )
  app.mount(el)

  return { ...result, unmount: () => app.unmount() }
}
```

> `app.provide(key, value)` registers the value at the application level, which is visible to every descendant component — equivalent to a root-level `provide()` for testing purposes, and simpler than wiring it inside the parent's `setup()`.
>
> This exact implementation was compiled with `tsc --strict` against `vue`'s type definitions to confirm it type-checks; do not loosen the `InjectionKey<unknown>` cast to `any` without a reason.

```ts
// useMessage.test.ts
import { describe, it, expect } from 'vitest'
import { useInjectedSetup } from '../test/useInjectedSetup'
import { MessageKey, useMessage } from './useMessage'

describe('useMessage', () => {
  it('reads the injected message', () => {
    const wrapper = useInjectedSetup(() => useMessage(), [
      { key: MessageKey, value: 'hello world' },
    ])
    expect(wrapper.message).toBe('hello world')
    wrapper.unmount()
  })

  it('throws when the injection is missing', () => {
    expect(() => useInjectedSetup(() => useMessage())).toThrow()
  })
})
```

Always call `unmount()` after a test that used these helpers, to avoid leaking app instances across tests.