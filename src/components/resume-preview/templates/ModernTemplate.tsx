import type { ResumePreviewData } from '../../../types/resumePreview'
import type { TechnicalSkillForm } from '../../../types/resumeForm'
import { getInitials, renderContactIcon } from '../utils'
import { useProfilePhoto } from '../useProfilePhoto'
import { LinkifiedText } from './templateHelpers'

import './ModernTemplate.css'

type ModernTemplateProps = {
  data: ResumePreviewData
}

function SkillTags({
  skills,
  variant,
}: {
  skills: string[]
  variant?: 'main'
}) {
  if (skills.length === 0) {
    return null
  }

  return (
    <div className={`skill-tags${variant === 'main' ? ' skill-tags--main' : ''}`}>
      {skills.map((skill) => (
        <span key={skill} className="skill-tag">
          {skill}
        </span>
      ))}
    </div>
  )
}

function TechnicalSkills({
  technicalSkills,
}: {
  technicalSkills?: TechnicalSkillForm[]
}) {
  if (!technicalSkills || technicalSkills.length === 0) {
    return null
  }

  const grouped = technicalSkills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }

      acc[skill.category].push(skill)

      return acc
    },
    {} as Record<string, TechnicalSkillForm[]>
  )

  return (
    <>
      {Object.entries(grouped).map(([category, skills]) => (
        <div key={category} className="skill-group">
          <h4 className="skill-group__title">{category}</h4>

          <div className="skill-tags">
            {skills.map((skill) => (
              <span
                key={`${skill.category}-${skill.skillName}`}
                className="skill-tag"
              >
                {skill.skillName}
                {skill.yearsOfExperience > 0 &&
                  ` (${skill.yearsOfExperience} yrs)`}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, coreCompetencies, technicalSkills, professionalHistory, featuredProjects } =
    data

  const photoSrc = useProfilePhoto(personalInfo.photo)

  const contactItems = [
    personalInfo.email && { type: 'email', label: personalInfo.email },
    personalInfo.phone && { type: 'phone', label: personalInfo.phone },
    personalInfo.address && { type: 'address', label: personalInfo.address },
    personalInfo.linkedin && { type: 'linkedin', label: personalInfo.linkedin },
    personalInfo.github && { type: 'github', label: personalInfo.github },
  ].filter(Boolean) as Array<{ type: string; label: string }>

  const visibleHistory = (professionalHistory ?? []).filter(
    (job) => job.company.trim() || job.role.trim()
  )

  const visibleProjects = (featuredProjects ?? []).filter((project) => project.name.trim())

  return (
    <article className="resume">
      <aside className="resume__sidebar">
        <div className="resume__photo-wrap">
          {photoSrc ? (
            <img
              className="resume__photo"
              src={photoSrc}
              alt={personalInfo.name}
            />
          ) : (
            <div className="resume__photo resume__photo--initials" aria-hidden="true">
              {getInitials(personalInfo.name)}
            </div>
          )}
        </div>

        {contactItems.length > 0 ? (
          <section className="sidebar-section">
            <h3 className="sidebar-section__title">Contact</h3>
            <ul className="contact-list">
              {contactItems.map((item) => (
                <li key={`${item.type}-${item.label}`}>
                  <span className="contact-list__icon">{renderContactIcon(item.type)}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {coreCompetencies && coreCompetencies.length > 0 ? (
          <section className="sidebar-section">
            <h3 className="sidebar-section__title">Core Competencies</h3>
            <ul className="competency-list">
              {coreCompetencies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {technicalSkills && technicalSkills.length > 0 ? (
          <section className="sidebar-section">
            <h3 className="sidebar-section__title">Technical Skills</h3>
            <TechnicalSkills technicalSkills={technicalSkills} />
          </section>
        ) : null}
      </aside>

      <div className="resume__main">
        <header className="resume__header">
          <h1 className="resume__name">{personalInfo.name}</h1>
          {personalInfo.title ? (
            <p className="resume__title">{personalInfo.title}</p>
          ) : null}
          {personalInfo.summary ? (
            <p className="resume__summary">{personalInfo.summary}</p>
          ) : null}
        </header>

        {visibleHistory.length > 0 ? (
          <section className="main-section">
            <h2 className="main-section__title">Professional Experience</h2>
            <div className="timeline">
              {visibleHistory.map((job, index) => (
                <article key={`${job.company}-${job.role}-${index}`} className="timeline-item">
                  <div className="timeline-item__header">
                    <span className="timeline-item__role">{job.role}</span>
                    <span className="timeline-item__company">@ {job.company}</span>
                  </div>
                  {(job.period || job.location) && (
                    <div className="timeline-item__meta">
                      {job.period ? <span>📅 {job.period}</span> : null}
                      {job.location ? <span>📍 {job.location}</span> : null}
                    </div>
                  )}
                  {job.achievements && job.achievements.length > 0 ? (
                    <ul className="achievement-list">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li key={`${achievement}-${achievementIndex}`}>{achievement}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {visibleProjects.length > 0 ? (
          <section className="main-section">
            <h2 className="main-section__title">Featured Projects</h2>
            <div className="projects-grid">
              {visibleProjects.map((project, index) => (
                <article key={`${project.name}-${index}`} className="project-card">
                  <h3 className="project-card__name">{project.name}</h3>
                  {project.description ? (
                    <p className="project-card__description">
                      <LinkifiedText text={project.description} />
                    </p>
                  ) : null}
                  {project.technologies && project.technologies.length > 0 ? (
                    <SkillTags skills={project.technologies} variant="main" />
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  )
}
