import type { ResumePreviewData } from '../../../types/resumePreview'
import { getInitials } from '../utils'
import { SkillTags, useResumeTemplateData } from './templateHelpers'
import './ClassicTemplate.css'

type ClassicTemplateProps = {
  data: ResumePreviewData
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const {
    personalInfo,
    coreCompetencies,
    technicalSkills,
    professionalHistory,
    featuredProjects,
    photoSrc,
    contactItems,
  } = useResumeTemplateData(data)

  return (
    <article className="resume">
      <header className="resume__header">
        <div className="resume__header-main">
          <h1 className="resume__name">{personalInfo.name || 'Your Name'}</h1>
          {personalInfo.title ? <p className="resume__title">{personalInfo.title}</p> : null}
          {contactItems.length > 0 ? (
            <p className="resume__contact-line">
              {contactItems.map((item) => item.label).join('  ·  ')}
            </p>
          ) : null}
        </div>
        <div className="resume__photo-wrap">
          {photoSrc ? (
            <img className="resume__photo" src={photoSrc} alt={personalInfo.name} />
          ) : (
            <div className="resume__photo resume__photo--initials" aria-hidden="true">
              {getInitials(personalInfo.name || '?')}
            </div>
          )}
        </div>
      </header>

      {personalInfo.summary ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Summary</h2>
          <p className="resume__summary">{personalInfo.summary}</p>
        </section>
      ) : null}

      {professionalHistory.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Experience</h2>
          <div className="experience-list">
            {professionalHistory.map((job, index) => (
              <article key={`${job.company}-${job.role}-${index}`} className="experience-item">
                <div className="experience-item__top">
                  <h3 className="experience-item__role">{job.role}</h3>
                  <span className="experience-item__period">{job.period}</span>
                </div>
                <p className="experience-item__company">
                  {job.company}
                  {job.location ? ` — ${job.location}` : ''}
                </p>
                {job.achievements && job.achievements.length > 0 ? (
                  <ul className="experience-item__achievements">
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

      {coreCompetencies && coreCompetencies.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Core Competencies</h2>
          <p className="resume__inline-list">{coreCompetencies.join(' · ')}</p>
        </section>
      ) : null}

      {technicalSkills && technicalSkills.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Technical Skills</h2>

          <div className="skills-list">
            {technicalSkills.map((skill) => (
              <p key={skill.skillName} className="skills-list__row">
                <strong>{skill.skillName}</strong> — {skill.yearsOfExperience} years
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {featuredProjects.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Projects</h2>
          <div className="projects-list">
            {featuredProjects.map((project, index) => (
              <article key={`${project.name}-${index}`} className="project-item">
                <h3 className="project-item__name">{project.name}</h3>
                {project.description ? (
                  <p className="project-item__description">{project.description}</p>
                ) : null}
                {project.technologies && project.technologies.length > 0 ? (
                  <SkillTags skills={project.technologies} className="skill-tags skill-tags--inline" />
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
