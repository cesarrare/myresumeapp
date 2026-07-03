export type {
  FeaturedProject,
  PersonalInfo,
  ProfessionalHistory,
  Resume,
} from './resume'
export type { AuthSession, LoginRequest, LoginResponse, RegisterRequest } from './auth'
export type { ResumeSummary } from './resumeSummary'
export type {
  FeaturedProjectForm,
  ProfessionalHistoryForm,
  ResumeFormState,
  ResumeSaveRequest,
  ResumeUpdateRequest,
  TechnicalSkillForm,
  SkillCategoryDraft
} from './resumeForm'
export type { ResumePreviewData, ResumeTemplateId } from './resumePreview'
export { DEFAULT_TEMPLATE, normalizeTemplateName } from './resumePreview'
export { RESUME_TEMPLATE_OPTIONS } from './resumeTemplates'
export {
  createEmptyResumeForm,
  formStateToPreviewData,
  formStateToSaveRequest,
  formStateToUpdateRequest,
  resumeToFormState,
} from './resumeForm'
