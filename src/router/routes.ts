export const ROUTES = {
  login: '/login',
  createUser: '/create-user',
  resumes: '/resumes',
  resumeCreate: '/resumes/new',
  resumeView: (resumeId: string | number = ':resumeId') =>
    `/resume/${resumeId}`,
  resumeEdit: (resumeId: string | number = ':resumeId') =>
    `/resume/${resumeId}/edit`,
  resumePreview: (resumeId: string | number = ':resumeId') =>
    `/resume/${resumeId}/preview`,
} as const

export const ROUTE_PATHS = {
  login: ROUTES.login,
  createUser: ROUTES.createUser,
  resumes: ROUTES.resumes,
  resumeCreate: ROUTES.resumeCreate,
  resumeView: '/resume/:resumeId',
  resumeEdit: '/resume/:resumeId/edit',
  resumePreview: '/resume/:resumeId/preview',
} as const
