export type PersonalInfo = {
  name: string
  title?: string
  email?: string
  phone?: string
  address?: string
  linkedin?: string
  github?: string
  /** External URL or data URI returned by the API. */
  photo?: string
  /** Optional base64 image payload for save requests. */
  photoImage?: string
  /** Optional MIME type for photoImage. */
  photoMimeType?: string
  /** Display-only filename for the profile photo in the edit form. */
  photoFileName?: string
  summary?: string
}

export type ProfessionalHistory = {
  company: string
  role: string
  period?: string
  location?: string
  achievements?: string[]
}

export type FeaturedProject = {
  name: string
  description?: string
  technologies?: string[]
}

export type TechnicalSkill = {
  category: string
  skillName: string
  yearsOfExperience: number
}

export type Resume = {
  userId: number
  resumeId: number
  resumeName: string
  templateName?: string
  personalInfo: PersonalInfo | null
  coreCompetencies: string[] | null
  technicalSkills?: TechnicalSkill[]
  professionalHistory: ProfessionalHistory[] | null
  featuredProjects: FeaturedProject[] | null
}
