# Code Organization

## Standalone declarations

Every `interface` and `class` lives in its own file — this skill's baseline rule, not a suggestion. Group related standalone files under a feature folder rather than one shared `types.ts` dumping ground once a module has more than one or two declarations.

```
user/
  user.model.ts       # export interface User { ... }
  user.service.ts      # export class UserService { ... }
  index.ts              # barrel: export * from './user.model'; export * from './user.service'
```

```ts
// user/user.model.ts
export interface User {
  id: string
  name: string
  email: string
}
```

```ts
// user/user.service.ts
import type { User } from './user.model'

export class UserService {
  private users: User[] = []

  addUser(user: User) {
    this.users.push(user)
  }

  getUser(id: string): User | undefined {
    return this.users.find(user => user.id === id)
  }
}
```

```ts
// user/index.ts
export * from './user.model'
export * from './user.service'
```

## File naming

Dot-suffix, lowercase, by role — not PascalCase, not snake_case, not bare camelCase:

```
user.service.ts        # service classes
user.model.ts           # type/interface definitions
user.controller.ts      # controllers
user.component.ts       # components
user.utils.ts            # utility functions
user.test.ts              # tests
```

```
UserService.ts     # wrong — PascalCase filename
user_service.ts     # wrong — snake_case
userService.ts       # wrong — bare camelCase
```

Framework-specific file conventions (e.g. PascalCase filenames tied to a component's exported identifier) are scoped to that framework's own file types and don't override this default for plain `.ts` modules.

## General principles

- Document exported types and interfaces (a one-line doc comment on non-obvious fields, not exhaustive prose).
- Prefer composition over inheritance for types — intersect/compose smaller interfaces rather than building deep `extends` chains.
- Keep `tsconfig.json` strict and current — see `references/compiler-config.md`.
- Refactor toward more specific types as a codebase matures; a type that started as `Record<string, unknown>` because the shape wasn't known yet should be tightened once it is.