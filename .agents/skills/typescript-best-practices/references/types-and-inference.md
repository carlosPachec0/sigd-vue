# Types: Inference, Interfaces vs Type Aliases, and `any`

## Let inference do the work

Don't annotate a type TypeScript can already infer from the assignment — the annotation is redundant and is one more place to go stale if the value's shape changes.

```ts
// Bad: redundant annotation
const name: string = 'John'
function add(a: number, b: number): number {
  return a + b
}

// Good: inferred
const name = 'John'
function add(a: number, b: number) {
  return a + b
}
```

Exception: function **return types on public/exported APIs** should stay explicit even though TypeScript could infer them — the explicit signature is the contract, and an accidental change in the function body shouldn't silently change what callers see.

## Precise parameter types on anything public

Untyped parameters lose all safety at the call boundary — this is where `any`/implicit-any leaks are most damaging, because every caller inherits the hole.

```ts
// Bad
function processUser(user) {
  return user.name.toUpperCase()
}

// Good
interface User {
  id: number
  name: string
  email?: string
}

function processUser(user: User): string {
  return user.name.toUpperCase()
}
```

## `interface` vs `type`

Both declare shapes; the choice signals intent, and this skill's standalone-declaration convention (see `references/code-organization.md`) applies to both equally.

- **`interface`** — object shapes meant to be extended or implemented. Supports declaration merging and `extends`.

```ts
interface User {
  id: number
  name: string
}

interface AdminUser extends User {
  permissions: string[]
}
```

- **`type`** — unions, tuples, mapped types, and anything that isn't a plain extendable object shape.

```ts
type UserRole = 'admin' | 'editor' | 'viewer'
type UserId = number | string
type ReadonlyUser = Readonly<User>
type Point = [number, number]
```

If a shape genuinely needs both a union member and object fields, that's usually a sign it should be a discriminated union of interfaces, not a single sprawling type.

## Never `any` — reach for the right alternative instead

`any` isn't "a wide type," it's an opt-out of type checking for that value and everything derived from it. Ranked from worst to best:

```ts
// Worst: any — no error until runtime
function logValue(value: any) {
  console.log(value.toUpperCase())
}

// Better: generic, but still permissive
function logValue<T>(value: T) {
  console.log(String(value))
}

// Best when the type is actually known: be specific
function logString(value: string) {
  console.log(value.toUpperCase())
}

// When the type is genuinely unknown at compile time: unknown + narrowing
function logUnknown(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  } else {
    console.log(String(value))
  }
}
```

`unknown` is the correct type for "I don't know this yet" — it forces narrowing before use. `any` is never the correct type for that; it's the correct type for nothing in application code.

## Type guards for narrowing

Use a type predicate (`value is T`) instead of casting when narrowing a union:

```ts
function process(input: string | number) {
  return input.toUpperCase() // Error: toUpperCase doesn't exist on number
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(input: string | number) {
  if (isString(input)) {
    return input.toUpperCase() // narrowed to string
  }
  return input.toFixed(2) // narrowed to number
}
```

Built-in narrowing also applies: `typeof value === 'string'`, `value instanceof Date`, `'id' in user`.

## `null` and `undefined` are not optional to handle

```ts
// Bad: compiler error under strictNullChecks, and rightly so
function getLength(str: string | null) {
  return str.length
}

// Good
function getLength(str: string | null) {
  return str?.length ?? 0
}

interface UserProfile {
  profile?: { name?: string }
}

const name = user.profile?.name ?? 'Anonymous'
```

Prefer optional chaining (`?.`) + nullish coalescing (`??`) over manual `if (x === null)` guards when the fallback is simple — reserve the explicit `if` for when the `null`/`undefined` case needs distinct branching logic, not just a default value.