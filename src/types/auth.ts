<<<<<<< Updated upstream
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginResponse {
  userId: number
  firstName: string
  lastName: string
  email: string
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface AuthSession {
  userId: number
  email: string
  firstName: string
  lastName: string
  accessToken: string
  tokenType: string
  expiresIn: number
  savedAt?: number
}
=======
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface GoogleAuthRequest {
  idToken: string
}

export interface LoginResponse {
  userId: number
  firstName: string
  lastName: string
  email: string
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface AuthSession {
  userId: number
  email: string
  firstName: string
  lastName: string
  accessToken: string
  tokenType: string
  expiresIn: number
  savedAt?: number
}
>>>>>>> Stashed changes
