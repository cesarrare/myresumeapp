import type { ResumePreviewData } from '../../../types/resumePreview'
import { getInitials, renderContactIcon } from '../utils'
import { LinkifiedText, SkillTags, useResumeTemplateData } from './templateHelpers'
import './ExecutiveTemplate.css'

type ExecutiveTemplateProps = {
  data: ResumePreviewData
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
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
      <header className="resume__banner">
        <div className="resume__banner-content">
          {photoSrc ? (
            <img className="resume__photo" src={photoSrc} alt={personalInfo.name} />
          ) : (
            <div className="resume__photo resume__photo--initials" aria-hidden="true">
              {getInitials(personalInfo.name || '?')}
            </div>
          )}
          <div>
            <h1 className="resume__name">{personalInfo.name || 'Your Name'}</h1>
            {personalInfo.title ? <p className="resume__title">{personalInfo.title}</p> : null}
          </div>
        </div>
      </header>

      <div className="resume__body">
        <aside className="resume__aside">
          {contactItems.length > 0 ? (
            <section className="aside-section">
              <h2 className="aside-section__title">Contact</h2>
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
            <section className="aside-section">
              <h2 className="aside-section__title">Leadership</h2>
              <ul className="bullet-list">
                {coreCompetencies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {technicalSkills && technicalSkills.length > 0 ? (
            <section className="aside-section">
              <h2 className="aside-section__title">Expertise</h2>

              <SkillTags
                skills={technicalSkills.map(s => s.skillName)}
                className="skill-tags"
              />
            </section>
          ) : null}
          </aside>

        <main className="resume__main">
          {personalInfo.summary ? (
            <section className="main-section">
              <h2 className="main-section__title">Executive Summary</h2>
              <p className="main-section__text">{personalInfo.summary}</p>
            </section>
          ) : null}

          {professionalHistory.length > 0 ? (
            <section className="main-section">
              <h2 className="main-section__title">Career History</h2>
              {professionalHistory.map((job, index) => (
                <article key={`${job.company}-${job.role}-${index}`} className="career-item">
                  <div className="career-item__header">
                    <div>
                      <h3 className="career-item__role">{job.role}</h3>
                      <p className="career-item__company">{job.company}</p>
                    </div>
                    <div className="career-item__meta">
                      {job.period ? <span>{job.period}</span> : null}
                      {job.location ? <span>{job.location}</span> : null}
                    </div>
                  </div>
                  {job.achievements && job.achievements.length > 0 ? (
                    <ul className="career-item__achievements">
                      {job.achievements.map((achievement, achievementIndex) => (
                        <li key={`${achievement}-${achievementIndex}`}>{achievement}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </section>
          ) : null}

          {featuredProjects.length > 0 ? (
            <section className="main-section">
              <h2 className="main-section__title">Key Initiatives</h2>
              <div className="initiatives">
                {featuredProjects.map((project, index) => (
                  <article key={`${project.name}-${index}`} className="initiative-card">
                    <h3 className="initiative-card__name">{project.name}</h3>
                    {project.description ? (
                      <p className="initiative-card__description">
                        <LinkifiedText text={project.description} />
                      </p>
                    ) : null}
                    {project.technologies && project.technologies.length > 0 ? (
                      <SkillTags skills={project.technologies} className="skill-tags skill-tags--gold" />
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </article>
  )
}
