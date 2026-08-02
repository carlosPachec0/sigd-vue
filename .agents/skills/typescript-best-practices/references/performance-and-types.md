# Performance and Type Complexity

## Type-only imports/exports

Separate value imports from type-only imports so the type-only ones can be elided at compile time — smaller output, and clearer at a glance which imports exist only for the type checker.

```ts
// Bad: ambiguous whether User is a runtime value or a type
import { User, fetchUser } from './api'

// Good
import type { User } from './api'
import { fetchUser } from './api'

// Re-exports follow the same split
export type { User }
export { fetchUser }
```

Enable `"isolatedModules": true` in `tsconfig.json` so the compiler enforces that type-only exports are unambiguous — required by some bundlers (esbuild, swc) that transpile files independently without full type information.

## Avoid deep recursive mapped types when a built-in utility type covers the case

Hand-rolled recursive types compile slower and are harder to read than the equivalent built-in:

```ts
// Avoid for routine cases: recursive mapped type
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Prefer: model the nesting explicitly with named interfaces (see code-organization.md),
// then use the built-in Partial<T> at whichever level actually needs it
interface UserProfile {
  name: string
  email: string
}

interface UserPreferences {
  notifications: boolean
}

interface User {
  id: string
  profile: UserProfile
  preferences?: UserPreferences
}

const updateProfile = (updates: Partial<UserProfile>) => {
  /* ... */
}
```

A generic recursive utility like `DeepPartial<T>` is justified only when the codebase genuinely needs arbitrary-depth partial updates across many unrelated shapes — not as a default reach for "an object with optional nested fields."

## `as const` for literal types

Without a `const` assertion, array/object literals widen to their general type (`string[]`, `number`), which loses the specific values at the type level:

```ts
const colors = ['red', 'green', 'blue']
// Type: string[]

const colors = ['red', 'green', 'blue'] as const
// Type: readonly ["red", "green", "blue"]

type Color = typeof colors[number] // "red" | "green" | "blue"
```

```ts
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  features: ['auth', 'notifications'],
} as const
// Every property becomes readonly and literal-typed instead of widened
```

Use `as const` whenever a literal array/object is meant to be a fixed set of values (config, enum-like string unions, lookup tables) — it's how you get a precise union type out of a plain array without writing the union by hand and keeping it in sync.