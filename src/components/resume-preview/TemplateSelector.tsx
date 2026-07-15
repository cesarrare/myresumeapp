import { RESUME_TEMPLATE_OPTIONS } from '../../types/resumeTemplates'
import { normalizeTemplateName } from '../../types/resumePreview'
import './TemplateSelector.css'

type TemplateSelectorProps = {
  value: string
  onChange: (templateId: string) => void
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const selected = normalizeTemplateName(value)

  return (
    <div className="template-selector">
      <label htmlFor="resume-template-select" className="template-selector__label">
        Template
      </label>
      <select
        id="resume-template-select"
        className="template-selector__select"
        value={selected}
        onChange={(event) => onChange(event.target.value)}
      >
        {RESUME_TEMPLATE_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
