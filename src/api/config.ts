export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  timeoutMs: 15_000,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
} as const

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    google: '/api/auth/google',
  },
  resumes: '/api/resumes',
  users: '/api/users',
  health: '/health',
} as const
