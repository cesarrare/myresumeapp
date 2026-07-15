import { useEffect, useState } from 'react'
import { resolveProfilePhoto } from './utils'

export function useProfilePhoto(photo?: string) {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadPhoto() {
      const resolved = await resolveProfilePhoto(photo)
      if (!cancelled) {
        setPhotoSrc(resolved)
      }
    }

    void loadPhoto()

    return () => {
      cancelled = true
    }
  }, [photo])

  return photoSrc
}
