import type { ResumePreviewData } from '../../../types/resumePreview'
import { getInitials } from '../utils'
import { SkillTags, useResumeTemplateData } from './templateHelpers'
import './MinimalTemplate.css'

type MinimalTemplateProps = {
  data: ResumePreviewData
}

export function MinimalTemplate({ data }: MinimalTemplateProps) {
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
        <div>
          <h1 className="resume__name">{personalInfo.name || 'Your Name'}</h1>
          {personalInfo.title ? <p className="resume__title">{personalInfo.title}</p> : null}
        </div>
        {photoSrc ? (
          <img className="resume__photo" src={photoSrc} alt={personalInfo.name} />
        ) : personalInfo.name ? (
          <div className="resume__photo resume__photo--initials" aria-hidden="true">
            {getInitials(personalInfo.name)}
          </div>
        ) : null}
      </header>

      {contactItems.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Contact</h2>
          <ul className="contact-list">
            {contactItems.map((item) => (
              <li key={`${item.type}-${item.label}`}>{item.label}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {personalInfo.summary ? (
        <section className="resume__section">
          <h2 className="resume__section-title">About</h2>
          <p className="resume__summary">{personalInfo.summary}</p>
        </section>
      ) : null}

      {professionalHistory.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Experience</h2>
          {professionalHistory.map((job, index) => (
            <article key={`${job.company}-${job.role}-${index}`} className="entry">
              <div className="entry__head">
                <h3 className="entry__title">
                  {job.role}
                  {job.company ? `, ${job.company}` : ''}
                </h3>
                {job.period ? <span className="entry__meta">{job.period}</span> : null}
              </div>
              {job.location ? <p className="entry__location">{job.location}</p> : null}
              {job.achievements && job.achievements.length > 0 ? (
                <ul className="entry__list">
                  {job.achievements.map((achievement, achievementIndex) => (
                    <li key={`${achievement}-${achievementIndex}`}>{achievement}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {technicalSkills && technicalSkills.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Skills</h2>

          <div className="skills-grid">
            {technicalSkills.map((skill) => (
              <div key={skill.skillName} className="skills-grid__item">
                <h3 className="skills-grid__category">
                  {skill.skillName}
                </h3>

                <SkillTags
                  skills={[skill.skillName]}
                  className="skill-tags"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {coreCompetencies && coreCompetencies.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Competencies</h2>
          <SkillTags skills={coreCompetencies} className="skill-tags" />
        </section>
      ) : null}

      {featuredProjects.length > 0 ? (
        <section className="resume__section">
          <h2 className="resume__section-title">Projects</h2>
          {featuredProjects.map((project, index) => (
            <article key={`${project.name}-${index}`} className="entry">
              <h3 className="entry__title">{project.name}</h3>
              {project.description ? (
                <p className="entry__description">{project.description}</p>
              ) : null}
              {project.technologies && project.technologies.length > 0 ? (
                <SkillTags skills={project.technologies} className="skill-tags" />
              ) : null}
            </article>
          ))}
        </section>
      ) : null}
    </article>
  )
}
