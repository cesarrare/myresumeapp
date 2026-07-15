import type {
  FeaturedProject,
  PersonalInfo,
  ProfessionalHistory,
  Resume,
} from './resume'
import { derivePhotoFileName } from '../utils/photoUpload'
import { normalizeTemplateName } from './resumePreview'

export type ResumeSaveRequest = {
  userId: number
  resumeName: string
  templateName?: string
  personalInfo?: PersonalInfo
  coreCompetencies?: string[]
  technicalSkills?: TechnicalSkillForm[]
  professionalHistory?: ProfessionalHistory[]
  featuredProjects?: FeaturedProject[]
}

export type ResumeUpdateRequest = ResumeSaveRequest & {
  resumeId: number
}


export type ProfessionalHistoryForm = {
  company: string
  role: string
  period: string
  location: string
  achievements: string[]
}

export type FeaturedProjectForm = {
  name: string
  description: string
  technologies: string[]
}

export type ResumeFormState = {
  resumeName: string
  templateName: string
  personalInfo: PersonalInfo
  technicalSkills: TechnicalSkillForm[]
  professionalHistory: ProfessionalHistoryForm[]
  featuredProjects: FeaturedProjectForm[]
}

export type TechnicalSkillForm = {
  category: string
  skillName: string
  yearsOfExperience: number
}

export type SkillCategoryDraft = {
  category: string
  skills: TechnicalSkillForm[]
}

export function createEmptyResumeForm(sessionEmail = ''): ResumeFormState {
  return {
    resumeName: '',
    templateName: 'MODERN',
    personalInfo: {
      name: '',
      title: '',
      email: sessionEmail,
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      photo: '',
      summary: '',
    },
    technicalSkills: [],
    professionalHistory: [],
    featuredProjects: [],
  }
}

export function resumeToFormState(resume: Resume): ResumeFormState {
  const technicalSkills =
    resume.technicalSkills?.map((skill) => ({
      category: skill.category ?? '',
      skillName: skill.skillName ?? '',
      yearsOfExperience: skill.yearsOfExperience ?? 0,
    })) ?? []

  const professionalHistory = resume.professionalHistory?.length
    ? resume.professionalHistory.map((item) => ({
        company: item.company ?? '',
        role: item.role ?? '',
        period: item.period ?? '',
        location: item.location ?? '',
        achievements: item.achievements?.length ? item.achievements : [],
      }))
    : []

  const featuredProjects = resume.featuredProjects?.length
    ? resume.featuredProjects.map((item) => ({
        name: item.name ?? '',
        description: item.description ?? '',
        technologies: item.technologies?.length ? item.technologies : [],
      }))
    : []

  return {
    resumeName: resume.resumeName ?? '',
    templateName: normalizeTemplateName(resume.templateName),
    personalInfo: {
      name: resume.personalInfo?.name ?? '',
      title: resume.personalInfo?.title ?? '',
      email: resume.personalInfo?.email ?? '',
      phone: resume.personalInfo?.phone ?? '',
      address: resume.personalInfo?.address ?? '',
      linkedin: resume.personalInfo?.linkedin ?? '',
      github: resume.personalInfo?.github ?? '',
      photo: resume.personalInfo?.photo ?? '',
      photoFileName: derivePhotoFileName(resume.personalInfo?.photo),
      summary: resume.personalInfo?.summary ?? '',
    },
    technicalSkills,
    professionalHistory,
    featuredProjects,
  }
}

export function formStateToSaveRequest(
  form: ResumeFormState,
  userId: number
): ResumeSaveRequest {
  const technicalSkills = form.technicalSkills
    .map((skill) => ({
      category: skill.category.trim(),
      skillName: skill.skillName.trim(),
      yearsOfExperience: skill.yearsOfExperience,
    }))
    .filter(
      (skill) =>
        skill.category.length > 0 &&
        skill.skillName.length > 0
    )

  const professionalHistory = form.professionalHistory
    .map((item) => ({
      company: item.company.trim(),
      role: item.role.trim(),
      period: item.period.trim(),
      location: item.location.trim(),
      achievements: item.achievements.map((a) => a.trim()).filter(Boolean),
    }))
    .filter((item) => item.company || item.role)

  const featuredProjects = form.featuredProjects
    .map((item) => ({
      name: item.name.trim(),
      description: item.description.trim(),
      technologies: item.technologies.map((t) => t.trim()).filter(Boolean),
    }))
    .filter((item) => item.name)

  const personalInfo: PersonalInfo = {
    name: form.personalInfo.name.trim(),
    title: form.personalInfo.title?.trim(),
    email: form.personalInfo.email?.trim(),
    phone: form.personalInfo.phone?.trim(),
    address: form.personalInfo.address?.trim(),
    linkedin: form.personalInfo.linkedin?.trim(),
    github: form.personalInfo.github?.trim(),
    summary: form.personalInfo.summary?.trim(),
  }

  const pendingPhotoImage = form.personalInfo.photoImage
  if (pendingPhotoImage !== undefined) {
    if (pendingPhotoImage === '') {
      personalInfo.photo = ''
      personalInfo.photoImage = ''
    } else {
      personalInfo.photoImage = pendingPhotoImage
      personalInfo.photoMimeType = form.personalInfo.photoMimeType
    }
  } else {
    const photo = form.personalInfo.photo?.trim() ?? ''
    if (photo === '' || !photo.startsWith('data:')) {
      personalInfo.photo = photo
    }
  }

  return {
    userId,
    resumeName: form.resumeName.trim(),
    templateName: normalizeTemplateName(form.templateName),
    personalInfo,
    technicalSkills,
    professionalHistory,
    featuredProjects,
  }
}

export function formStateToUpdateRequest(
  form: ResumeFormState,
  userId: number,
  resumeId: number
): ResumeUpdateRequest {
  return {
    ...formStateToSaveRequest(form, userId),
    resumeId,
  }
}

export function formStateToPreviewData(form: ResumeFormState) {
  const technicalSkills = form.technicalSkills
    .map((skill) => ({
      category: skill.category.trim(),
      skillName: skill.skillName.trim(),
      yearsOfExperience: skill.yearsOfExperience,
    }))
    .filter(
      (skill) =>
        skill.category.length > 0 &&
        skill.skillName.length > 0
  )

  const professionalHistory = form.professionalHistory
    .map((item) => ({
      company: item.company,
      role: item.role,
      period: item.period || undefined,
      location: item.location || undefined,
      achievements: item.achievements.map((achievement) => achievement.trim()).filter(Boolean),
    }))
    .filter((item) => item.company.trim() || item.role.trim())

  const featuredProjects = form.featuredProjects
    .map((item) => ({
      name: item.name,
      description: item.description || undefined,
      technologies: item.technologies.map((technology) => technology.trim()).filter(Boolean),
    }))
    .filter((item) => item.name.trim())

  return {
    personalInfo: { ...form.personalInfo },
    technicalSkills:
      technicalSkills.length > 0
        ? technicalSkills
        : undefined,
    professionalHistory:
      professionalHistory.length > 0 ? professionalHistory : undefined,
    featuredProjects: featuredProjects.length > 0 ? featuredProjects : undefined,
  }
}
