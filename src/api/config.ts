export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://myresumeapi.k8s.sftcloud.com.mx',
  timeoutMs: 15_000,
} as const

export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  resumes: '/api/resumes',
  users: '/api/users',
  health: '/health',
} as const
