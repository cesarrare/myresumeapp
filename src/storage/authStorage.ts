import type { AuthSession } from '../types/auth'

const STORAGE_KEY = 'myresume.auth'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    return JSON.parse(atob(padded)) as Record<string, unknown>
  } catch {
    return null
  }
}

function getTokenExpirationMs(token: string): number | null {
  const decoded = decodeJwtPayload(token)
  const exp = decoded?.exp

  if (typeof exp === 'number') {
    return exp * 1000
  }

  return null
}

function getSessionExpirationMs(session: AuthSession): number | null {
  const tokenExpirationMs = getTokenExpirationMs(session.accessToken)
  if (tokenExpirationMs) {
    return tokenExpirationMs
  }

  if (session.savedAt && session.expiresIn) {
    return session.savedAt + session.expiresIn * 1000
  }

  return null
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function isAuthSessionValid(
  session: AuthSession | null = getAuthSession()
): boolean {
  if (!session?.accessToken) {
    return false
  }

  const expiresAtMs = getSessionExpirationMs(session)
  if (!expiresAtMs) {
    return true
  }

  return expiresAtMs > Date.now()
}

export function getValidAuthSession(): AuthSession | null {
  const session = getAuthSession()

  if (!isAuthSessionValid(session)) {
    if (session) {
      clearAuthSession()
    }
    return null
  }

  return session
}

export function getAccessToken(): string | null {
  return getAuthSession()?.accessToken ?? null
}

export function clearAuthSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
