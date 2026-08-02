# Async/Await Patterns

## Always wrap `await` in error handling — see `references/error-handling.md` for the full treatment; this section covers structuring the async flow itself.

```ts
// Bad: no error handling, no typed return
async function fetchData() {
  const response = await fetch('/api/data')
  return response.json()
}

// Good
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json() as T
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw error // re-throw — let the caller decide how to handle it
  }
}
```

## Parallelize independent awaits with `Promise.all`

Sequential `await`s that don't depend on each other's results waste latency for no benefit:

```ts
async function fetchMultipleData<T>(urls: string[]): Promise<T[]> {
  try {
    const promises = urls.map(url => fetchData<T>(url))
    return await Promise.all(promises)
  } catch (error) {
    console.error('One or more requests failed:', error)
    throw error
  }
}
```

## Flatten nested async/await instead of pyramiding

```ts
// Bad: nested conditionals around await — the "callback hell" shape persists even with async/await
async function processUser(userId: string) {
  const user = await getUser(userId)
  if (user) {
    const orders = await getOrders(user.id)
    if (orders.length > 0) {
      const latestOrder = orders[0]
      const items = await getOrderItems(latestOrder.id)
      return { user, latestOrder, items }
    }
  }
  return null
}

// Better: early returns flatten the nesting
async function processUser(userId: string) {
  const user = await getUser(userId)
  if (!user) return null

  const orders = await getOrders(user.id)
  if (orders.length === 0) return { user, latestOrder: null, items: [] }

  const latestOrder = orders[0]
  const items = await getOrderItems(latestOrder.id)
  return { user, latestOrder, items }
}

// Best: parallelize the two calls that don't depend on each other
async function processUser(userId: string) {
  const [user, orders] = await Promise.all([
    getUser(userId),
    getOrders(userId)
  ])

  if (!user) return null
  if (orders.length === 0) return { user, latestOrder: null, items: [] }

  const latestOrder = orders[0]
  const items = await getOrderItems(latestOrder.id)
  return { user, latestOrder, items }
}
```

`getUser(userId)` and `getOrders(userId)` in the "Best" version both only need `userId`, not each other's result — that's the signal they belong in `Promise.all`, not in sequence. If the second call needed the first call's result (as `getOrderItems(latestOrder.id)` does), it cannot be parallelized and stays sequential.