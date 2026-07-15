import { useEffect } from 'react'
import type { ResumePreviewData } from '../../types/resumePreview'
import { ResumePreview } from './ResumePreview'
import './ResumePreviewModal.css'

type ResumePreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  data: ResumePreviewData
  templateName?: string
  title?: string
}

export function ResumePreviewModal({
  isOpen,
  onClose,
  data,
  templateName,
  title = 'Resume preview',
}: ResumePreviewModalProps) {
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

  return (
    <div
      className="resume-preview-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-preview-modal-title"
      onClick={onClose}
    >
      <div
        className="resume-preview-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="resume-preview-modal__header">
          <h2 id="resume-preview-modal-title" className="resume-preview-modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="resume-preview-modal__close"
            onClick={onClose}
            aria-label="Close preview"
          >
            ×
          </button>
        </header>

        <div className="resume-preview-modal__body">
          <ResumePreview
            data={data}
            templateName={templateName}
            className="resume-preview--modal"
          />
        </div>
      </div>
    </div>
  )
}
