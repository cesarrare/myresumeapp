import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../router'
import {
  clearAuthSession,
  getAuthSession,
  isAuthSessionValid,
} from '../storage/authStorage'

export function useRedirectIfAuthenticated() {
  const navigate = useNavigate()

  useEffect(() => {
    const session = getAuthSession()

    if (isAuthSessionValid(session)) {
      navigate(ROUTES.resumes, { replace: true })
      return
    }

    if (session) {
      clearAuthSession()
    }
  }, [navigate])
}
