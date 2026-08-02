# Compiler Configuration

## Strict mode: always on

`strict: true` is non-negotiable for any project this skill applies to — it's a compiler flag, not a style preference, and disabling it (or any of the flags it bundles) to make legacy code compile is treated as a code smell to isolate, not a reason to relax config project-wide.

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

`strict: true` bundles the following; enable them explicitly too when a project needs to turn them on incrementally rather than all at once (e.g. migrating a JS codebase):

| Flag | Effect |
|---|---|
| `noImplicitAny` | Untyped parameters/variables are a compile error, not silently `any` |
| `strictNullChecks` | `null`/`undefined` are not assignable to other types unless explicitly unioned in |
| `strictFunctionTypes` | Function parameter types are checked contravariantly (safer function assignment) |
| `strictBindCallApply` | `.bind()`/`.call()`/`.apply()` are type-checked against the function signature |
| `strictPropertyInitialization` | Class properties must be initialized in the constructor or explicitly marked possibly-undefined |
| `noImplicitThis` | `this` must have a clear type in every context |
| `alwaysStrict` | Emits `"use strict"`, parses in strict mode |

## Module resolution note

`moduleResolution: "node"` + `module: "commonjs"` above is the classic Node/CommonJS baseline. For a Vite-based frontend project, use `moduleResolution: "bundler"` instead — the two configs are not interchangeable; pick the one matching the actual build tool, not the one that's already in the snippet.