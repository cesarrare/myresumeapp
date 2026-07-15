const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const MAX_BYTES = 2 * 1024 * 1024

export type ParsedPhotoFile = {
  photoImage: string
  photoMimeType: string
  photo: string
  photoFileName: string
}

export function readPhotoFile(file: File): Promise<ParsedPhotoFile> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return Promise.reject(
      new Error('Unsupported image type. Use JPEG, PNG, WebP, or GIF.')
    )
  }

  if (file.size > MAX_BYTES) {
    return Promise.reject(new Error('Image must be 2 MB or smaller.'))
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const match = result.match(/^data:([^;]+);base64,(.+)$/)

      if (!match) {
        reject(new Error('Unable to read the selected image.'))
        return
      }

      resolve({
        photoMimeType: match[1],
        photoImage: match[2],
        photo: result,
        photoFileName: file.name,
      })
    }

    reader.onerror = () => {
      reject(new Error('Unable to read the selected image.'))
    }

    reader.readAsDataURL(file)
  })
}

export function derivePhotoFileName(photo?: string): string | undefined {
  const trimmed = photo?.trim()
  if (!trimmed || trimmed.startsWith('data:')) {
    return undefined
  }

  try {
    const url = new URL(trimmed)
    const segment = url.pathname.split('/').filter(Boolean).pop()
    return segment ? decodeURIComponent(segment) : undefined
  } catch {
    const segment = trimmed.split('/').filter(Boolean).pop()
    return segment ? decodeURIComponent(segment) : undefined
  }
}
