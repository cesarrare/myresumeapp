export function getInitials(name: string): string {
  if (!name.trim()) {
    return '?'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function getPhotoCandidates(photo?: string): string[] {
  return [...new Set([photo?.trim(), 'resume.png', 'photo.png'].filter(Boolean) as string[])]
}

export function resolvePhotoSrc(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return new URL(path, window.location.origin).href
}

export function tryLoadImage(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function resolveProfilePhoto(photo?: string): Promise<string | null> {
  const trimmed = photo?.trim()
  if (!trimmed) {
    return null
  }

  if (trimmed.startsWith('data:')) {
    const loaded = await tryLoadImage(trimmed)
    return loaded
  }

  for (const candidate of getPhotoCandidates(trimmed)) {
    const loaded = await tryLoadImage(resolvePhotoSrc(candidate))
    if (loaded) {
      return loaded
    }
  }

  return null
}

export function renderContactIcon(type: string): string {
  const icons: Record<string, string> = {
    email: '✉',
    phone: '☎',
    address: '⌂',
    linkedin: 'in',
    github: '{ }',
  }

  return icons[type] ?? '•'
}
