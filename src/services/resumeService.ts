import { API_ROUTES, apiGet, apiPost, apiPut } from '../api'
import type { Resume, ResumeSaveRequest, ResumeSummary, ResumeUpdateRequest } from '../types'

export async function getResumesByUserId(userId: number): Promise<ResumeSummary[]> {
  return apiGet<ResumeSummary[]>(`${API_ROUTES.resumes}/user/${userId}`, {
    authenticated: true,
  })
}

export async function getResumeById(resumeId: number): Promise<Resume> {
  return apiGet<Resume>(`${API_ROUTES.resumes}/${resumeId}`, {
    authenticated: true,
  })
}

export async function saveResume(payload: ResumeSaveRequest): Promise<Resume> {
  return apiPost<Resume>(API_ROUTES.resumes, payload, {
    authenticated: true,
  })
}

export async function updateResume(payload: ResumeUpdateRequest): Promise<Resume> {
  return apiPut<Resume>(API_ROUTES.resumes, payload, {
    authenticated: true,
  })
}

export async function getDefaultResume(): Promise<Resume> {
  return getResumeById(1)
}
