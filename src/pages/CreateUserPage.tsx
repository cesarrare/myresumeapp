import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useTheme } from '../context/theme'
import { useRedirectIfAuthenticated } from '../hooks'
import { ROUTES } from '../router'
import { register } from '../services/authService'
import './LoginPage.css'

export function CreateUserPage() {
  const navigate = useNavigate()
  const { themeMode, toggleTheme } = useTheme()
  useRedirectIfAuthenticated()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      })

      navigate(ROUTES.resumes, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('This email is already registered.')
        } else {
          setError(err.message || 'Unable to create account. Please try again.')
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

      <section className="login-card" aria-labelledby="create-user-title">
        <header className="login-card__header">
          <p className="login-card__eyebrow">MyResume</p>
          <h1 id="create-user-title" className="login-card__title">
            Create account
          </h1>
          <p className="login-card__subtitle">
            Sign up to start building your resumes.
          </p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Cesar"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Ramirez"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
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
              autoComplete="new-password"
              placeholder="Create a password"
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
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="login-footer">
          Already have an account?{' '}
          <Link to={ROUTES.login}>Sign in</Link>
        </p>
      </section>
    </div>
  )
}
