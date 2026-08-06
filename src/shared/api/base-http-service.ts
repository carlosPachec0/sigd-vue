import type { AxiosRequestConfig } from 'axios'
import { httpClient } from './httpClient'

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
