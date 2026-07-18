import { apiPost } from '../api/client'
import { API_ROUTES } from '../api/config'
import { saveAuthSession } from '../storage/authStorage'
import type {
  AuthSession,
  GoogleAuthRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../types/auth'

function toAuthSession(response: LoginResponse): AuthSession {
  return {
    userId: response.userId,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    accessToken: response.accessToken,
    tokenType: response.tokenType,
    expiresIn: response.expiresIn,
    savedAt: Date.now(),
  }
}

export async function login(credentials: LoginRequest): Promise<AuthSession> {
  const response = await apiPost<LoginResponse>(API_ROUTES.auth.login, credentials)
  const session = toAuthSession(response)
  saveAuthSession(session)
  return session
}

export async function register(data: RegisterRequest): Promise<AuthSession> {
  const response = await apiPost<LoginResponse>(API_ROUTES.auth.register, data)
  const session = toAuthSession(response)
  saveAuthSession(session)
  return session
}

export async function loginWithGoogle(idToken: string): Promise<AuthSession> {
  const body: GoogleAuthRequest = { idToken }
  const response = await apiPost<LoginResponse>(API_ROUTES.auth.google, body)
  const session = toAuthSession(response)
  saveAuthSession(session)
  return session
}
