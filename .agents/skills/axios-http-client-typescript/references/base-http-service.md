# base-http-service.ts

Target path: `src/shared/api/base-http-service.ts`

Abstract class exposing `protected get/post/put/patch/delete`, each
returning `response.data` already typed. Every resource service extends
this instead of re-wrapping `httpClient` from scratch — this is the single
point of DRY, not an extra architectural layer.

```ts
import type { AxiosRequestConfig } from 'axios'
import { httpClient } from './httpClient'

/**
 * Base class for every resource-specific service. It owns no reactive
 * state on purpose — services are plain data-access classes. Reactive
 * state (isLoading, error) belongs to the Pinia store that calls the
 * service, not to the service itself. This keeps the abstraction to a
 * single layer: httpClient (transport) -> service (typed endpoints).
 */
export abstract class BaseHttpService {
  protected readonly client = httpClient

  protected get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T>(url, config).then((response) => response.data)
  }

  protected post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T>(url, body, config).then((response) => response.data)
  }

  protected put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T>(url, body, config).then((response) => response.data)
  }

  protected patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch<T>(url, body, config).then((response) => response.data)
  }

  protected delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete<T>(url, config).then((response) => response.data)
  }
}
```