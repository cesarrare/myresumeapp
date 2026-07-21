import { useEffect, useState } from 'react'
import type { FeaturedProjectForm } from '../types/resumeForm'
import './FeaturedProjectModal.css'

type FeaturedProjectModalProps = {
  isOpen: boolean
  initialValue: FeaturedProjectForm
  title?: string
  onClose: () => void
  onSave: (value: FeaturedProjectForm) => void
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

export function FeaturedProjectModal({
  isOpen,
  initialValue,
  title = 'Edit project',
  onClose,
  onSave,
}: FeaturedProjectModalProps) {
  const [draft, setDraft] = useState<FeaturedProjectForm>(initialValue)

  useEffect(() => {
    if (isOpen) {
      setDraft(initialValue)
    }
  }, [initialValue, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  function handleSave() {
    onSave({
      name: draft.name.trim(),
      description: draft.description.trim(),
      technologies: draft.technologies.map((technology) => technology.trim()).filter(Boolean),
    })
  }

  return (
    <div
      className="featured-project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="featured-project-modal-title"
      onClick={onClose}
    >
      <div
        className="featured-project-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="featured-project-modal__header">
          <h2 id="featured-project-modal-title" className="featured-project-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="featured-project-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="featured-project-modal__body">
          <div className="featured-project-modal__field">
            <label htmlFor="featuredProjectName">Project name</label>
            <input
              id="featuredProjectName"
              value={draft.name}
              onChange={(event) =>
                setDraft((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>

          <div className="featured-project-modal__field">
            <label htmlFor="featuredProjectDescription">Description</label>
            <textarea
              id="featuredProjectDescription"
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>

          <div className="featured-project-modal__technologies">
            <p className="featured-project-modal__technologies-label">Technologies</p>
            {draft.technologies.map((technology, technologyIndex) => (
              <div
                key={`technology-${technologyIndex}`}
                className="featured-project-modal__technology-row"
              >
                <input
                  value={technology}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      technologies: current.technologies.map((item, index) =>
                        index === technologyIndex ? event.target.value : item
                      ),
                    }))
                  }
                  placeholder="React"
                />
                <button
                  type="button"
                  className="featured-project-modal__delete-btn"
                  aria-label={`Remove ${technology.trim() || `technology ${technologyIndex + 1}`}`}
                  title="Remove technology"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      technologies: current.technologies.filter(
                        (_, index) => index !== technologyIndex
                      ),
                    }))
                  }
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="featured-project-modal__add-btn"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  technologies: [...current.technologies, ''],
                }))
              }
            >
              <span aria-hidden="true">+</span>
              Add technology
            </button>
          </div>
        </div>

        <footer className="featured-project-modal__footer">
          <button type="button" className="featured-project-modal__btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="featured-project-modal__btn featured-project-modal__btn--primary"
            onClick={handleSave}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  )
}
