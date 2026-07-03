import { useId, useState, type ReactNode } from 'react'
import './CollapsibleSection.css'

type CollapsibleSectionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <section
      className={`collapsible-section${isOpen ? ' collapsible-section--open' : ''}`}
    >
      <button
        type="button"
        className="collapsible-section__summary"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="collapsible-section__title">{title}</span>
        <span className="collapsible-section__chevron" aria-hidden="true" />
      </button>
      <div id={contentId} className="collapsible-section__content">
        <div className="collapsible-section__body">{children}</div>
      </div>
    </section>
  )
}
