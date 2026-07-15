import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useTheme } from '../context/theme'
import { useRedirectIfAuthenticated } from '../hooks'
import { ROUTES } from '../router'
import { login } from '../services/authService'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { themeMode, toggleTheme } = useTheme()
  useRedirectIfAuthenticated()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({
        email: email.trim(),
        password,
      })

      navigate(ROUTES.resumes, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError(err.message || 'Invalid email or password.')
        } else {
          setError(err.message || 'Unable to sign in. Please try again.')
        }
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__toolbar">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} theme`}
        >
          {themeMode === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>

      <section className="login-card" aria-labelledby="login-title">
        <header className="login-card__header">
          <p className="login-card__eyebrow">MyResume</p>
          <h1 id="login-title" className="login-card__title">
            Welcome back
          </h1>
          <p className="login-card__subtitle">
            Sign in to manage and preview your resumes.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {error ? <p className="login-error">{error}</p> : null}

          <button
            type="submit"
            className="login-button login-button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="login-divider">or</div>

          <button
            type="button"
            className="login-button login-button--google"
            disabled
            title="Google sign-in coming soon"
          >
            Continue with Google
          </button>
        </form>

        <p className="login-footer">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.createUser}>Create user</Link>
        </p>
      </section>
    </div>
  )
}
