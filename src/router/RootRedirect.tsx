import { Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { isAuthSessionValid } from '../storage/authStorage'

export function RootRedirect() {
  return (
    <Navigate
      to={isAuthSessionValid() ? ROUTES.resumes : ROUTES.login}
      replace
    />
  )
}
