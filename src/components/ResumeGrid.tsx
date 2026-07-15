import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../router'

type AddResumeCardProps = {
  label?: string
}

export function AddResumeCard({ label = 'New resume' }: AddResumeCardProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="resume-card resume-card--add"
      onClick={() => navigate(ROUTES.resumeCreate)}
      aria-label="Add new resume"
    >
      <div className="resume-card__page resume-card__page--add">
        <span className="resume-card__plus" aria-hidden="true">
          +
        </span>
      </div>
      <p className="resume-card__name">{label}</p>
    </button>
  )
}

function ResumePreviewCard({
  resumeName,
  onClick,
}: {
  resumeName: string
  onClick: () => void
}) {
  return (
    <button type="button" className="resume-card" onClick={onClick}>
      <div className="resume-card__page" aria-hidden="true">
        <div className="resume-card__page-header" />
        <div className="resume-card__page-body">
          <div className="resume-card__page-line resume-card__page-line--medium" />
          <div className="resume-card__page-line" />
          <div className="resume-card__page-line resume-card__page-line--short" />
          <div className="resume-card__page-line" />
          <div className="resume-card__page-line resume-card__page-line--medium" />
        </div>
      </div>
      <p className="resume-card__name">{resumeName}</p>
    </button>
  )
}

type ResumeGridProps = {
  resumes: Array<{ resumeId: number; resumeName: string }>
  onSelect: (resumeId: number) => void
}

export function ResumeGrid({ resumes, onSelect }: ResumeGridProps) {
  return (
    <div className="resumes-grid">
      {resumes.map((resume) => (
        <ResumePreviewCard
          key={resume.resumeId}
          resumeName={resume.resumeName}
          onClick={() => onSelect(resume.resumeId)}
        />
      ))}
      <AddResumeCard />
    </div>
  )
}
