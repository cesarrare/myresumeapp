import { useEffect, useState } from 'react'
import type { ProfessionalHistoryForm } from '../types/resumeForm'
import './ProfessionalHistoryModal.css'

type ProfessionalHistoryModalProps = {
  isOpen: boolean
  initialValue: ProfessionalHistoryForm
  title?: string
  onClose: () => void
  onSave: (value: ProfessionalHistoryForm) => void
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

export function ProfessionalHistoryModal({
  isOpen,
  initialValue,
  title = 'Edit position',
  onClose,
  onSave,
}: ProfessionalHistoryModalProps) {
  const [draft, setDraft] = useState<ProfessionalHistoryForm>(initialValue)

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
      company: draft.company.trim(),
      role: draft.role.trim(),
      period: draft.period.trim(),
      location: draft.location.trim(),
      achievements: draft.achievements.map((achievement) => achievement.trim()).filter(Boolean),
    })
  }

  return (
    <div
      className="professional-history-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="professional-history-modal-title"
      onClick={onClose}
    >
      <div
        className="professional-history-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="professional-history-modal__header">
          <h2 id="professional-history-modal-title" className="professional-history-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="professional-history-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="professional-history-modal__body">
          <div className="professional-history-modal__grid">
            <div className="professional-history-modal__field">
              <label htmlFor="professionalHistoryCompany">Company</label>
              <input
                id="professionalHistoryCompany"
                value={draft.company}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, company: event.target.value }))
                }
              />
            </div>
            <div className="professional-history-modal__field">
              <label htmlFor="professionalHistoryRole">Role</label>
              <input
                id="professionalHistoryRole"
                value={draft.role}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, role: event.target.value }))
                }
              />
            </div>
            <div className="professional-history-modal__field">
              <label htmlFor="professionalHistoryPeriod">Period</label>
              <input
                id="professionalHistoryPeriod"
                value={draft.period}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, period: event.target.value }))
                }
              />
            </div>
            <div className="professional-history-modal__field">
              <label htmlFor="professionalHistoryLocation">Location</label>
              <input
                id="professionalHistoryLocation"
                value={draft.location}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, location: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="professional-history-modal__achievements">
            <div className="professional-history-modal__achievements-header">
              <p className="professional-history-modal__achievements-label">Achievements</p>
              <button
                type="button"
                className="professional-history-modal__add-btn"
                aria-label="Add achievement"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    achievements: [...current.achievements, ''],
                  }))
                }
              >
                +
              </button>
            </div>
            {draft.achievements.map((achievement, achievementIndex) => (
              <div
                key={`achievement-${achievementIndex}`}
                className="professional-history-modal__achievement-row"
              >
                <textarea
                  value={achievement}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      achievements: current.achievements.map((item, index) =>
                        index === achievementIndex ? event.target.value : item
                      ),
                    }))
                  }
                  placeholder="Describe an achievement"
                />
                <button
                  type="button"
                  className="professional-history-modal__delete-btn"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      achievements: current.achievements.filter(
                        (_, index) => index !== achievementIndex
                      ),
                    }))
                  }
                  aria-label={`Remove achievement ${achievementIndex + 1}`}
                  title="Remove achievement"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="professional-history-modal__footer">
          <button type="button" className="professional-history-modal__btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="professional-history-modal__btn professional-history-modal__btn--primary"
            onClick={handleSave}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  )
}
