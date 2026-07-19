import type { ResumePreviewData } from '../../../types/resumePreview'
import { useProfilePhoto } from '../useProfilePhoto'

export type ContactItem = {
  type: string
  label: string
}

export function buildContactItems(personalInfo: ResumePreviewData['personalInfo']): ContactItem[] {
  return [
    personalInfo.email && { type: 'email', label: personalInfo.email },
    personalInfo.phone && { type: 'phone', label: personalInfo.phone },
    personalInfo.address && { type: 'address', label: personalInfo.address },
    personalInfo.linkedin && { type: 'linkedin', label: personalInfo.linkedin },
    personalInfo.github && { type: 'github', label: personalInfo.github },
  ].filter(Boolean) as ContactItem[]
}

export function useResumeTemplateData(data: ResumePreviewData) {
  const { personalInfo, coreCompetencies, technicalSkills, professionalHistory, featuredProjects } =
    data

  const photoSrc = useProfilePhoto(personalInfo.photo)
  const contactItems = buildContactItems(personalInfo)

  const visibleHistory = (professionalHistory ?? []).filter(
    (job) => job.company.trim() || job.role.trim()
  )

  const visibleProjects = (featuredProjects ?? []).filter((project) => project.name.trim())

  return {
    personalInfo,
    coreCompetencies,
    technicalSkills,
    professionalHistory: visibleHistory,
    featuredProjects: visibleProjects,
    photoSrc,
    contactItems,
  }
}

export function SkillTags({
  skills,
  className,
}: {
  skills: string[]
  className?: string
}) {
  if (skills.length === 0) {
    return null
  }

  return (
    <div className={className ?? 'skill-tags'}>
      {skills.map((skill) => (
        <span key={skill} className="skill-tag">
          {skill}
        </span>
      ))}
    </div>
  )
}

const LINK_PATTERN = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi
const TRAILING_PUNCTUATION_PATTERN = /[),.;!?]+$/

export function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(LINK_PATTERN)

  return (
    <>
      {parts.map((part, index) => {
        if (!part.match(/^https?:\/\/|^www\./i)) {
          return part
        }

        const trailingPunctuation = part.match(TRAILING_PUNCTUATION_PATTERN)?.[0] ?? ''
        const linkText = trailingPunctuation
          ? part.slice(0, -trailingPunctuation.length)
          : part
        const href = linkText.startsWith('www.') ? `https://${linkText}` : linkText

        return (
          <span key={`${linkText}-${index}`}>
            <a
              className="resume-link"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {linkText}
            </a>
            {trailingPunctuation}
          </span>
        )
      })}
    </>
  )
}
