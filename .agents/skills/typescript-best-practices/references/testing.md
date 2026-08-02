# Type-Level Testing

Runtime testing strategy (dependency injection, mocking, AAA structure, test doubles) is framework/language-agnostic and lives outside this skill. This file covers only what's TypeScript-specific: asserting that *types* behave as intended, independent of runtime test frameworks.

Beyond runtime tests, TypeScript's own type system can assert that types behave as intended:

```ts
// @ts-expect-error forces a compile error to exist at this line — the test fails
// if the error goes away (i.e. if the type stops rejecting invalid input)
// @ts-expect-error - id must not be negative if the domain type enforces it
const invalidUser: User = { id: -1, name: 'Test' }

// Conditional-type assertions for utility/generic types
type IsString<T> = T extends string ? true : false
type Test1 = IsString<string> // true
type Test2 = IsString<number> // false
```

For a dedicated type-testing library rather than ad hoc conditional types, `tsd` (`npm install --save-dev tsd`) provides `expectType<T>(value)` assertions that fail the build if inference doesn't match.

## Standalone-declaration rule still applies

Any named type under test (e.g. `User` in the example above) is declared in its own file per this skill's `references/code-organization.md` — a `.ts` file containing only `@ts-expect-error` assertions and `IsString`-style helper types still imports the types it's checking rather than redeclaring them locally.