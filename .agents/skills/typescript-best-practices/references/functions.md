# Functions and Methods

## Explicit parameter and return types on anything callable from outside the module

```ts
// Bad
function process(user, notify) {
  notify(user.name)
}

// Good
function processUser(
  user: User,
  notify: (message: string) => void
): void {
  notify(`Processing user: ${user.name}`)
}
```

- Default parameters instead of `if (x === undefined) x = ...` conditionals inside the body:

```ts
function createUser(
  name: string,
  role: UserRole = 'viewer',
  isActive: boolean = true
): User {
  return { name, role, isActive }
}
```

- Rest parameters for variable-length argument lists instead of accepting an array and documenting "pass all args here":

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, num) => total + num, 0)
}
```

## One responsibility per function

A function that validates, transforms, persists, and notifies in one body is untestable as a unit and hard to reuse partially. Split by responsibility even when it means more functions:

```ts
// Bad: validation + transformation + side effect + notification, all in one function
function processUserData(userData: any) {
  if (!userData || !userData.name) throw new Error('Invalid user data')

  const processedData = {
    ...userData,
    name: userData.name.trim(),
    createdAt: new Date()
  }

  saveToDatabase(processedData)
  sendNotification(processedData.email, 'Profile updated')

  return processedData
}

// Better: each function does one thing and is independently testable
function validateUserData(data: unknown): UserData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid user data')
  }
  return data as UserData
}

function transformUserData(userData: UserData): ProcessedUserData {
  return {
    ...userData,
    name: userData.name.trim(),
    createdAt: new Date()
  }
}
```

Persistence (`saveToDatabase`) and notification (`sendNotification`) belong in their own functions too, called by an orchestrating function — not inlined into the transform step.