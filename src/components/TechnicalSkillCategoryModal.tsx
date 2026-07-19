import { useEffect, useState } from 'react'
import type { TechnicalSkillForm, SkillCategoryDraft } from '../types/resumeForm'
import './TechnicalSkillCategoryModal.css'


type TechnicalSkillCategoryModalProps = {
  isOpen: boolean
  initialValue: SkillCategoryDraft
  title?: string
  onClose: () => void
  onSave: (value: SkillCategoryDraft) => void
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

export function TechnicalSkillCategoryModal({
  isOpen,
  initialValue,
  title = 'Edit skill category',
  onClose,
  onSave,
}: TechnicalSkillCategoryModalProps) {
  const [draft, setDraft] = useState<SkillCategoryDraft>(initialValue)

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
    const category = draft.category.trim()

    onSave({
      category,
      skills: draft.skills
        .map((skill) => ({
          category,
          skillName: skill.skillName.trim(),
          yearsOfExperience: skill.yearsOfExperience,
        }))
        .filter((skill) => skill.skillName.length > 0),
    })
  }

  function updateSkill(
    index: number,
    field: keyof TechnicalSkillForm,
    value: string | number
  ) {
    setDraft((current) => ({
      ...current,
      skills: current.skills.map((skill, i) =>
        i === index
          ? {
              ...skill,
              [field]: value,
            }
          : skill
      ),
    }))
  }

  function addSkill() {
    setDraft((current) => ({
      ...current,
      skills: [
        ...current.skills,
        {
          category: current.category,
          skillName: '',
          yearsOfExperience: 0,
        },
      ],
    }))
  }

  function removeSkill(index: number) {
    setDraft((current) => ({
      ...current,
      skills: current.skills.filter((_, i) => i !== index),
    }))
  }

  return (
    <div
      className="skill-category-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-category-modal-title"
      onClick={onClose}
    >
      <div
        className="skill-category-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="skill-category-modal__header">
          <h2
            id="skill-category-modal-title"
            className="skill-category-modal__title"
          >
            {title}
          </h2>

          <button
            type="button"
            className="skill-category-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="skill-category-modal__body">
          <div className="skill-category-modal__field">
            <label htmlFor="skillCategoryName">Category name</label>

            <input
              id="skillCategoryName"
              value={draft.category}
              placeholder="Languages"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
            />
          </div>

          <div className="skill-category-modal__skills">
            <p className="skill-category-modal__skills-label">Skills</p>

            {draft.skills.map((skill, index) => (
              <div
                key={index}
                className="skill-category-modal__skill-row"
              >
                <input
                  value={skill.skillName}
                  placeholder="Java"
                  onChange={(event) =>
                    updateSkill(index, 'skillName', event.target.value)
                  }
                />

                <input
                  type="number"
                  min={0}
                  value={skill.yearsOfExperience}
                  placeholder="Years"
                  onChange={(event) =>
                    updateSkill(
                      index,
                      'yearsOfExperience',
                      Number(event.target.value)
                    )
                  }
                />

                <button
                  type="button"
                  className="skill-category-modal__delete-btn"
                  onClick={() => removeSkill(index)}
                  aria-label={`Remove ${skill.skillName.trim() || `skill ${index + 1}`}`}
                  title="Remove skill"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}

            <button
              type="button"
              className="skill-category-modal__add-btn"
              onClick={addSkill}
            >
              <span aria-hidden="true">+</span>
              Add skill
            </button>
          </div>
        </div>

        <footer className="skill-category-modal__footer">
          <button
            type="button"
            className="skill-category-modal__btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="skill-category-modal__btn skill-category-modal__btn--primary"
            onClick={handleSave}
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  )
}