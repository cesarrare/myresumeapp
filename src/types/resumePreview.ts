import type {
  FeaturedProject,
  PersonalInfo,
  ProfessionalHistory,
  TechnicalSkill,
} from './resume'

export type ResumePreviewData = {
  personalInfo: PersonalInfo
  coreCompetencies?: string[]
  technicalSkills?: TechnicalSkill[]
  professionalHistory?: ProfessionalHistory[]
  featuredProjects?: FeaturedProject[]
}

export type ResumeTemplateId = 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'EXECUTIVE'

export const DEFAULT_TEMPLATE: ResumeTemplateId = 'MODERN'

export function normalizeTemplateName(templateName?: string): ResumeTemplateId {
  const normalized = (templateName ?? DEFAULT_TEMPLATE).trim().toUpperCase()

  switch (normalized) {
    case 'MODERN':
    case 'CLASSIC':
    case 'MINIMAL':
    case 'EXECUTIVE':
      return normalized
    default:
      return DEFAULT_TEMPLATE
  }
}
