import { createBrowserRouter } from 'react-router-dom'
import {
  CreateUserPage,
  LoginPage,
  ResumeEditViewPage,
  ResumePreviewPage,
  ResumesLandingPage,
  ResumeViewPage,
} from '../pages'
import { ROUTE_PATHS } from './routes'
import { RootRedirect } from './RootRedirect'

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: ROUTE_PATHS.login,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.createUser,
    element: <CreateUserPage />,
  },
  {
    path: ROUTE_PATHS.resumes,
    element: <ResumesLandingPage />,
  },
  {
    path: ROUTE_PATHS.resumeCreate,
    element: <ResumeEditViewPage />,
  },
  {
    path: ROUTE_PATHS.resumeView,
    element: <ResumeViewPage />,
  },
  {
    path: ROUTE_PATHS.resumeEdit,
    element: <ResumeEditViewPage />,
  },
  {
    path: ROUTE_PATHS.resumePreview,
    element: <ResumePreviewPage />,
  },
])
