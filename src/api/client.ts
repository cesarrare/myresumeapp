import { API_CONFIG } from './config'
import { getAccessToken } from '../storage/authStorage'

export class ApiError extends Error {
  status: number
  statusText: string

  constructor(status: number, statusText: string, message?: string) {
    super(message ?? `API error: ${status} ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** Attach Bearer token. Never use for /api/auth/* endpoints. */
  authenticated?: boolean
}

function buildUrl(path: string): string {
  const base = API_CONFIG.baseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

function buildAuthHeaders(): Record<string, string> {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, authenticated = false, ...rest } = options

  const controller = new AbortController()
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    API_CONFIG.timeoutMs
  )

  try {
    const response = await fetch(buildUrl(path), {
      ...rest,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(authenticated ? buildAuthHeaders() : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      let message: string | undefined

      try {
        const errorBody = (await response.json()) as {
          message?: string
          error?: string
        }
        message = errorBody.message ?? errorBody.error
      } catch {
        message = undefined
      }

      throw new ApiError(response.status, response.statusText, message)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return (await response.json()) as T
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function apiGet<T>(
  path: string,
  options: Omit<RequestOptions, 'body'> = {}
): Promise<T> {
  return apiRequest<T>(path, { method: 'GET', ...options })
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options: Omit<RequestOptions, 'body'> = {}
): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body, ...options })
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  options: Omit<RequestOptions, 'body'> = {}
): Promise<T> {
  return apiRequest<T>(path, { method: 'PUT', body, ...options })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'DELETE' })
}
