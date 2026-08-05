# academy.store.ts (example)

Target path: `src/modules/{domain}/stores/{resource}.store.ts`

Reference Pinia store: owns `isLoading`/`error`, calls the service, re-throws
unhandled cases. A component only ever calls `academyStore.load()` and
reads `academyStore.academies` / `.isLoading` / `.error` — it never imports
the service or knows an endpoint exists.

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { academyService } from '../services/academy.service'
import { HttpError, normalizeError } from '@/shared/api/http-error'
import type { AcademyDto, CreateAcademyDto } from '../types/academy.dto'

export const useAcademyStore = defineStore('academy', () => {
  const academies = ref<AcademyDto[]>([])
  const isLoading = ref(false)
  const error = ref<HttpError | null>(null)

  async function load(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      academies.value = await academyService.getAll()
    } catch (err) {
      const httpError = err instanceof HttpError ? err : normalizeError(err)
      // The store only handles the cases it knows how to resolve.
      // Everything else is re-thrown for the UI layer to decide.
      if (httpError.status === 404) {
        academies.value = []
        return
      }
      error.value = httpError
      throw httpError
    } finally {
      isLoading.value = false
    }
  }

  async function create(payload: CreateAcademyDto): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const created = await academyService.create(payload)
      academies.value.push(created)
    } catch (err) {
      error.value = err instanceof HttpError ? err : normalizeError(err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return { academies, isLoading, error, load, create }
})
```