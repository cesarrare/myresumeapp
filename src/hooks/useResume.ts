import { useEffect, useState } from 'react'
import { getResumeById } from '../services'
import type { Resume } from '../types'

type UseResumeState = {
  resume: Resume | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useResume(resumeId = 1): UseResumeState {
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResume = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getResumeById(resumeId)
      setResume(data)
    } catch (err) {
      setResume(null)
      setError(err instanceof Error ? err.message : 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchResume()
  }, [resumeId])

  return {
    resume,
    loading,
    error,
    refetch: fetchResume,
  }
}
