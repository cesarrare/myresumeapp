import type { ResumePreviewData } from '../../types/resumePreview'
import { getResumeTemplate, getTemplateWrapperClass } from './templates'
import { ResumePreviewAutoScale } from './ResumePreviewAutoScale'
import './ResumePreview.css'

type ResumePreviewProps = {
  data: ResumePreviewData
  templateName?: string
  className?: string
  autoScale?: boolean
}

export function ResumePreview({
  data,
  templateName,
  className,
  autoScale = false,
}: ResumePreviewProps) {
  const Template = getResumeTemplate(templateName)
  const wrapperClass = getTemplateWrapperClass(templateName)

  const preview = (
    <div className={`resume-preview ${className ?? ''}`.trim()}>
      <div className={wrapperClass}>
        <Template data={data} />
      </div>
    </div>
  )

  if (autoScale) {
    return (
      <ResumePreviewAutoScale
        watchKey={JSON.stringify({ data, templateName: wrapperClass })}
      >
        {preview}
      </ResumePreviewAutoScale>
    )
  }

  return preview
}
