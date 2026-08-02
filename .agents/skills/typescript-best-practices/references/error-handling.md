# Error Handling

Framework-agnostic TypeScript error handling: `try`/`catch` narrowing, custom error classes, type guards, and async error propagation. Framework-specific integration points (e.g. a UI framework's own error-boundary hook or global error handler) are out of scope here and follow that framework's own conventions.

## `catch` variables are `unknown`, not `Error`

Since TypeScript 4.0, caught errors default to `unknown`. Never assume `Error` — narrow before accessing any property.

```ts
// Bad: compiles only with looser settings, and is wrong regardless — error could be anything thrown
try {
  /* ... */
} catch (error) {
  console.log(error.message) // Error: Property 'message' does not exist on type 'unknown'
}

// Good
try {
  /* ... */
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message)
  }
}
```

## Custom error classes — one per file, per this skill's standalone-declaration rule

Extend `Error`, set `name`, and restore the prototype chain (needed because extending built-ins is subject to ES5-target transpilation quirks — harmless to include even on modern targets).

```ts
// errors/validation-error.ts
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}
```

```ts
// errors/network-error.ts
export class NetworkError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}
```

Usage:

```ts
function validateUser(user: unknown) {
  const candidate = user as { name?: string; email?: string }
  if (!candidate.name) {
    throw new ValidationError('Name is required', 'name')
  }
  if (!candidate.email?.includes('@')) {
    throw new ValidationError('Invalid email format', 'email')
  }
}
```

See `assets/custom-error.template.ts` for a copy-ready starting point.

## Type guards for error narrowing

Prefer `instanceof` against a known custom error class; fall back to a structural type predicate only for errors whose class you don't control (e.g. from a third-party library that doesn't export its error class):

```ts
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

try {
  validateUser({})
} catch (error: unknown) {
  if (isValidationError(error)) {
    console.error(`Validation error in ${error.field}: ${error.message}`)
  } else if (isErrorWithMessage(error)) {
    console.error('An error occurred:', error.message)
  } else {
    console.error('An unknown error occurred')
  }
}
```

For a stricter assertion-style check, an `asserts` function narrows for the rest of the block instead of requiring an `if`:

```ts
function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error('Caught value is not an Error instance')
  }
}

try {
  /* ... */
} catch (error) {
  assertIsError(error)
  console.error(error.message) // narrowed to Error for the rest of the block
}
```

## Async error handling

Every `await` that can reject needs a `try/catch` around it, or a `.catch()` if using the Promise chain form — an `async` function with no error handling just turns a rejected promise into an uncaught one at the call site instead of at the `await`.

```ts
async function fetchUser(userId: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) {
      throw new NetworkError(response.status, `Failed to fetch user`)
    }
    return await response.json() as User
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch user:', error.message)
    }
    throw error // re-throw — this layer logs, the caller decides recovery
  }
}
```

Never leave a promise un-awaited and un-caught:

```ts
// Bad: unhandled rejection
fetchData().then(data => console.log(data))

// Good
fetchData()
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error))

// Or, when the rejection is intentionally fire-and-forget: be explicit about it
void fetchData().catch(console.error)
```

## Handle errors at the layer that has context to act on them

A data-access function throws a typed error; the UI/caller layer decides what to show the user. Don't collapse both into the same function — the data layer doesn't know what "showing an error" means, and the UI layer shouldn't know HTTP status codes.

```ts
// Data access layer: throws typed errors, no UI concerns
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new NetworkError(response.status, 'Failed to fetch user')
  }
  return response.json()
}

// Caller: decides how to present each case
async function loadUser() {
  try {
    const user = await getUser('123')
    setUser(user)
  } catch (error) {
    if (error instanceof NetworkError) {
      showError(error.status === 404 ? 'User not found' : 'Network error. Please try again later.')
    } else {
      showError('An unexpected error occurred')
    }
  }
}
```

## What NOT to do

- Don't leave a `catch` block empty — at minimum, log the error. A silent `catch { }` hides failures until they surface somewhere confusing.
- Don't access a property on a caught error without narrowing it first (`instanceof Error`, a type guard, or `assertIsError`).
- Don't declare a custom error class inline next to the code that throws it — it goes in its own file (`errors/x-error.ts`), same rule as any other class in this skill.
- Don't fire off a promise without either `await`ing it in a `try/catch` or attaching `.catch()` — including in fire-and-forget cases, where `void promise.catch(...)` makes the intent explicit instead of silently dropping rejections.