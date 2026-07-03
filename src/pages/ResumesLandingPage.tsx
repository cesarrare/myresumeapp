import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResumeGrid } from '../components/ResumeGrid'
import { ApiError } from '../api/client'
import { useTheme } from '../context/theme'
import { ROUTES } from '../router'
import { getResumesByUserId } from '../services/resumeService'
import { clearAuthSession, getValidAuthSession } from '../storage/authStorage'
import type { ResumeSummary } from '../types'
import './ResumesLandingPage.css'

export function ResumesLandingPage() {
  const navigate = useNavigate()
  const { themeMode, toggleTheme } = useTheme()

  const [resumes, setResumes] = useState<ResumeSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadResumes() {
      const session = getValidAuthSession()

      if (!session) {
        if (!cancelled) {
          setIsLoading(false)
          navigate(ROUTES.login, { replace: true })
        }
        return
      }

      if (!cancelled) {
        setUserName(session.firstName || session.email)
      }

      try {
        const data = await getResumesByUserId(session.userId)
        if (!cancelled) {
          setResumes(data)
        }
      } catch (err) {
        if (cancelled) {
          return
        }

        if (err instanceof ApiError && err.status === 401) {
          clearAuthSession()
          navigate(ROUTES.login, { replace: true })
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your resumes.'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadResumes()

    return () => {
      cancelled = true
    }
  }, [navigate])

  function handleLogout() {
    clearAuthSession()
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div className="resumes-landing">
      <header className="resumes-landing__header">
        <div>
          <h1 className="resumes-landing__title">My Resumes</h1>
          <p className="resumes-landing__subtitle">
            {userName ? `Welcome back, ${userName}` : 'Your resume collection'}
          </p>
        </div>

        <div className="resumes-landing__toolbar">
          <button
            type="button"
            className="resumes-landing__button"
            onClick={toggleTheme}
          >
            {themeMode === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button
            type="button"
            className="resumes-landing__button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="resumes-landing__content">
        {isLoading ? (
          <div className="resumes-landing__state">Loading resumes...</div>
        ) : error ? (
          <div className="resumes-landing__state resumes-landing__state--error">
            {error}
          </div>
        ) : (
          <ResumeGrid
            resumes={resumes}
            onSelect={(resumeId) => navigate(ROUTES.resumeEdit(resumeId))}
          />
        )}
      </main>
    </div>
  )
}
