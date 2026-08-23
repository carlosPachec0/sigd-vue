import type { AxiosRequestConfig } from 'axios'
import { httpClient } from './httpClient'

export interface ApiEnvelope<T> {
  message: string
  data: T
  status: number
  errors: string[]
}

export abstract class BaseHttpService {
  protected readonly client = httpClient

  protected get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiEnvelope<T>> {
    return this.client.get<ApiEnvelope<T>>(url, config).then((response) => response.data)
  }

  protected post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<ApiEnvelope<T>> {
    return this.client.post<ApiEnvelope<T>>(url, body, config).then((response) => response.data)
  }

  protected put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<ApiEnvelope<T>> {
    return this.client.put<ApiEnvelope<T>>(url, body, config).then((response) => response.data)
  }

  protected patch<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<ApiEnvelope<T>> {
    return this.client.patch<ApiEnvelope<T>>(url, body, config).then((response) => response.data)
  }

  protected delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiEnvelope<T>> {
    return this.client.delete<ApiEnvelope<T>>(url, config).then((response) => response.data)
  }
}
