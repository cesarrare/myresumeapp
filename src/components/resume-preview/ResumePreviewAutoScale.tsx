import { useEffect, useRef, useState, type ReactNode } from 'react'
import './ResumePreviewAutoScale.css'

const RESUME_DOCUMENT_WIDTH = 920

type ResumePreviewAutoScaleProps = {
  children: ReactNode
  documentWidth?: number
  watchKey?: string
}

export function ResumePreviewAutoScale({
  children,
  documentWidth = RESUME_DOCUMENT_WIDTH,
  watchKey,
}: ResumePreviewAutoScaleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [scaledHeight, setScaledHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current

    if (!container || !content) {
      return
    }

    function updateScale() {
      const currentContainer = containerRef.current
      const currentContent = contentRef.current

      if (!currentContainer || !currentContent) {
        return
      }

      const availableWidth = currentContainer.clientWidth
      const nextScale = availableWidth > 0
        ? Math.min(1, availableWidth / documentWidth)
        : 1

      setScale(nextScale)
      setScaledHeight(currentContent.offsetHeight * nextScale)
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(container)
    observer.observe(content)

    return () => observer.disconnect()
  }, [documentWidth, children, watchKey])

  return (
    <div ref={containerRef} className="resume-preview-auto-scale">
      <div
        className="resume-preview-auto-scale__frame"
        style={{ height: scaledHeight > 0 ? `${scaledHeight}px` : undefined }}
      >
        <div
          ref={contentRef}
          className="resume-preview-auto-scale__content"
          style={{
            width: `${documentWidth}px`,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
