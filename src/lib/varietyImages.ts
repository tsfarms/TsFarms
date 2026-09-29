// Drop variety photos in src/assets/varieties.
// Name them after the variety, then a number: himampasanth1.jpg, himampasanth2.png.
// "Himampasanth", "himam pasanth" and "himampasanth" all match those files.
// The same rule is used for honey and jackfruit.

const bundled = import.meta.glob('../assets/varieties/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

export const varietyPlaceholder = '/variety-placeholder.svg'

export function varietySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '')
}

function imageIndex(fileBase: string, slug: string): number | null {
  if (fileBase === slug) return 0
  if (!fileBase.startsWith(slug)) return null
  const rest = fileBase.slice(slug.length)
  if (!/^\d+$/.test(rest)) return null
  return Number(rest)
}

export function imagesForVariety(...names: string[]): string[] {
  const slugs = names.map(varietySlug).filter(Boolean)
  const found: { index: number; url: string }[] = []

  for (const [path, url] of Object.entries(bundled)) {
    const file = path.split('/').pop() ?? ''
    const base = varietySlug(file.replace(/\.[^.]+$/, ''))
    for (const slug of slugs) {
      const index = imageIndex(base, slug)
      if (index === null) continue
      found.push({ index, url })
      break
    }
  }

  found.sort((a, b) => a.index - b.index)
  return found.map((item) => item.url)
}
