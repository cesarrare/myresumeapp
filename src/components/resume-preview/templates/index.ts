import type { ComponentType } from 'react'
import type { ResumePreviewData, ResumeTemplateId } from '../../../types/resumePreview'
import { normalizeTemplateName } from '../../../types/resumePreview'
import { ClassicTemplate } from './ClassicTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { ModernTemplate } from './ModernTemplate'

export type ResumeTemplateComponent = ComponentType<{
  data: ResumePreviewData
}>

const templateRegistry: Record<ResumeTemplateId, ResumeTemplateComponent> = {
  MODERN: ModernTemplate,
  CLASSIC: ClassicTemplate,
  MINIMAL: MinimalTemplate,
  EXECUTIVE: ExecutiveTemplate,
}

export function getResumeTemplate(templateName?: string): ResumeTemplateComponent {
  const normalized = normalizeTemplateName(templateName)
  return templateRegistry[normalized]
}

export function getTemplateWrapperClass(templateName?: string): string {
  return `${normalizeTemplateName(templateName).toLowerCase()}-template`
}

export { ClassicTemplate, ExecutiveTemplate, MinimalTemplate, ModernTemplate }
