---
name: typescript-best-practices
description: Write, review, or refactor TypeScript code — type declarations, function signatures, error handling, async/await, module structure, and tsconfig — with strict-mode, type-safe conventions. Framework-agnostic; applies to any .ts file regardless of runtime (Node, browser, or as the TypeScript layer under a framework project). Trigger whenever the user writes or edits .ts files, asks about interfaces vs type aliases, generics, strict mode, avoiding any, custom error classes, or async error handling in TypeScript. Not for framework-specific integration points (e.g. a framework's own error-boundary or global error-handler APIs) — those belong to the framework's own conventions, not here.
compatibility: TypeScript >=5.0. Assumes tsconfig strict mode (see references/compiler-config.md). No runtime/framework dependency.
metadata:
  author: sigd
  version: "1.0"
---

# TypeScript Best Practices

Framework-agnostic TypeScript conventions: strict typing, error handling, async patterns, module organization. Applies to any TypeScript codebase, standalone or underneath a framework.

## Non-negotiable defaults

- `strict: true` in every `tsconfig.json`, no exceptions carved out project-wide to accommodate legacy code — isolate the legacy code instead.
- No `any`. Unknown-at-compile-time values are `unknown`, narrowed before use.
- Every `interface` and `class` declaration lives in its own file — never inline alongside the code that consumes it, never bundled with unrelated declarations in a shared file.
- `catch` variables are treated as `unknown` (TS ≥4.0 default) — always narrow (`instanceof Error`, a type guard, or `asserts`) before accessing a property.
- Let TypeScript infer types it can already infer (locals, simple returns); keep explicit return types on exported/public function signatures as the contract.
- Type-only imports/exports (`import type { X }`) kept separate from value imports.

## Where to look

| Topic | File |
|---|---|
| Strict mode, tsconfig flags | `references/compiler-config.md` |
| Type inference, `interface` vs `type`, avoiding `any`, narrowing, null/undefined | `references/types-and-inference.md` |
| Module/file organization, standalone declarations, naming | `references/code-organization.md` |
| Function design, parameters, single-responsibility | `references/functions.md` |
| Async/await structuring, `Promise.all`, flattening nested awaits | `references/async-patterns.md` |
| Error handling: custom error classes, type guards, async errors | `references/error-handling.md` |
| Type-level testing (`@ts-expect-error`, `tsd`) — runtime test strategy (DI, mocking) is out of scope, tracked in a separate testing skill | `references/testing.md` |
| Type-only imports, avoiding excessive type complexity, `as const` | `references/performance-and-types.md` |

Copy-ready scaffolds:

| Scaffold | File |
|---|---|
| Strict `tsconfig.json` | `assets/tsconfig.strict.json` |
| Custom error class | `assets/custom-error.template.ts` |

## What NOT to do

- Don't use `any` to silence a type error — fix the type, or use `unknown` + narrowing if the type is genuinely not known yet.
- Don't annotate a type TypeScript already infers correctly (redundant local/return annotations).
- Don't declare an `interface`/`class` inline in the file that uses it.
- Don't access a property on a caught error without narrowing its type first.
- Don't leave a `catch` block empty or a promise rejection unhandled.
- Don't reach for a deep recursive mapped type when a built-in utility type (`Partial`, `Readonly`, `Pick`, etc.) already covers the case.