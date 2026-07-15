import { useEffect, useRef, useState } from 'react'
import './TechnicalSkillCategoryRow.css'

type TechnicalSkillCategoryRowProps = {
  label?: string
  category?: string
  skills?: string[]
  primaryTitle?: string
  secondaryText?: string
  menuAriaLabel?: string
  onEdit: () => void
  onDelete: () => void
}

function BurgerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

export function TechnicalSkillCategoryRow({
  label,
  category,
  skills,
  primaryTitle,
  secondaryText,
  menuAriaLabel = 'Options',
  onEdit,
  onDelete,
}: TechnicalSkillCategoryRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const visibleSkills = skills?.map((skill) => skill.trim()).filter(Boolean) ?? []

  useEffect(() => {
    if (!menuOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current?.contains(event.target as Node)) {
        return
      }

      setMenuOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [menuOpen])

  return (
    <div className="skill-category-row">
      <div className="skill-category-row__content">
        {category !== undefined ? (
          <div className="skill-category-row__skill-line">
            <span className="skill-category-row__title">
              {category.trim() || 'Untitled category'} :
            </span>
            {visibleSkills.length > 0 ? (
              <div className="skill-category-row__tags">
                {visibleSkills.map((skill, skillIndex) => (
                  <span key={`${skill}-${skillIndex}`} className="skill-category-row__tag">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <span className="skill-category-row__empty">No skills added</span>
            )}
          </div>
        ) : primaryTitle !== undefined ? (
          <>
            <p className="skill-category-row__title">
              {primaryTitle.trim() || 'Untitled company'}
            </p>
            <p className="skill-category-row__subtitle">{secondaryText}</p>
          </>
        ) : (
          <p className="skill-category-row__text">{label}</p>
        )}
      </div>
      <div className="skill-category-row__menu" ref={menuRef}>
        <button
          type="button"
          className="skill-category-row__menu-btn"
          aria-label={menuAriaLabel}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <BurgerIcon />
        </button>
        {menuOpen ? (
          <div className="skill-category-row__dropdown" role="menu">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false)
                onEdit()
              }}
            >
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              className="skill-category-row__dropdown-item--danger"
              onClick={() => {
                setMenuOpen(false)
                onDelete()
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
