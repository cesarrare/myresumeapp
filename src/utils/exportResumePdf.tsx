import { createRoot } from 'react-dom/client'
import { ResumePreview } from '../components/resume-preview'
import type { ResumePreviewData } from '../types/resumePreview'

type ExportResumePdfOptions = {
  data: ResumePreviewData
  templateName?: string
  filename: string
}

function sanitizeDocumentTitle(filename: string): string {
  const normalized = filename.trim().replace(/\.pdf$/i, '')
  const withoutReservedCharacters = Array.from(normalized)
    .map((character) => {
      const codePoint = character.codePointAt(0) ?? 0
      const isControlCharacter = codePoint <= 31
      const isReservedFilenameCharacter = /[<>:"/\\|?*]/.test(character)

      return isControlCharacter || isReservedFilenameCharacter ? '-' : character
    })
    .join('')

  return withoutReservedCharacters
    .replace(/\s+/g, ' ')
    .trim() || 'resume'
}

function collectCurrentDocumentStyles(): string {
  return Array.from(document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>(
    'link[rel="stylesheet"], style'
  ))
    .map((node) => node.outerHTML)
    .join('\n')
}

function waitForPrintAssets(printDocument: Document): Promise<void> {
  const images = Array.from(printDocument.images)
  const imagePromises = images.map((image) => {
    if (image.complete) {
      return Promise.resolve()
    }

    return new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })
  })

  return Promise.race([
    Promise.all(imagePromises).then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 1200)),
  ])
}

export async function exportResumePdf({
  data,
  templateName,
  filename,
}: ExportResumePdfOptions): Promise<void> {
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    throw new Error('Allow pop-ups to export the resume as PDF.')
  }

  const title = sanitizeDocumentTitle(filename)
  const styles = collectCurrentDocumentStyles()

  printWindow.document.open()
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}.pdf</title>
        ${styles}
        <style>
          body {
            margin: 0;
            background: #ffffff;
          }

          #resume-pdf-root {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 0;
            background: #ffffff;
          }

          #resume-pdf-root .resume-preview {
            width: 920px;
            max-width: 100%;
          }

          #resume-pdf-root .resume {
            box-shadow: none;
            border-radius: 0;
          }

          @page {
            size: A4;
            margin: 0;
          }

          @media print {
            html,
            body,
            #resume-pdf-root {
              width: 100%;
              min-height: 100%;
              background: #ffffff;
            }

            #resume-pdf-root .resume-preview {
              width: 100%;
            }

            #resume-pdf-root .resume {
              max-width: none;
              width: 100%;
              min-height: 100vh;
              box-shadow: none !important;
              border-radius: 0 !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div id="resume-pdf-root"></div>
      </body>
    </html>
  `)
  printWindow.document.close()

  const rootNode = printWindow.document.getElementById('resume-pdf-root')
  if (!rootNode) {
    printWindow.close()
    throw new Error('Unable to prepare the PDF export.')
  }

  createRoot(rootNode).render(
    <ResumePreview data={data} templateName={templateName} />
  )

  await new Promise((resolve) => window.setTimeout(resolve, 300))
  await waitForPrintAssets(printWindow.document)

  printWindow.focus()
  printWindow.print()
}
