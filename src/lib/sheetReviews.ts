import { testimonials as fallbackTestimonials } from '@/content/site'

const SHEET_ID = '1Pq5yckTaoCtQWgMPUvpAYv3-xHYtWcPr-1VkjLyhxmw'

type Cell = { v?: string | number | boolean | null } | null

interface SheetPayload {
  status: string
  table: {
    cols: { label: string }[]
    rows: { c: Cell[] | null }[]
  }
}

export type SheetReview = {
  quote: string
  name: string
  location: string
}

function cellText(cell: Cell | undefined): string {
  if (!cell || cell.v == null) return ''
  return String(cell.v).trim().replace(/^["“]|["”]$/g, '').trim()
}

function headerIndex(labels: string[], names: string[]): number {
  return labels.findIndex((label) => names.includes(label.trim().toLowerCase()))
}

export function reviewsFromSheet(payload: SheetPayload): SheetReview[] {
  const labels = payload.table.cols.map((col) => col.label ?? '')
  const messageCol = headerIndex(labels, ['message', 'quote', 'review', 'feedback'])
  const nameCol = headerIndex(labels, ['name'])
  const placeCol = headerIndex(labels, ['place', 'location', 'city'])

  if (messageCol < 0 || nameCol < 0) return []

  return payload.table.rows.flatMap((row) => {
    const cells = row.c ?? []
    const quote = cellText(cells[messageCol])
    const name = cellText(cells[nameCol])
    const location = placeCol >= 0 ? cellText(cells[placeCol]) : ''
    if (!quote || !name) return []
    return [{ quote, name, location }]
  })
}

export function loadSheetReviews(): Promise<SheetReview[]> {
  return new Promise((resolve, reject) => {
    const callbackName = `tsReviews_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
    const scope = window as unknown as Record<string, ((payload: SheetPayload) => void) | undefined>
    let script: HTMLScriptElement | null = null

    const cleanup = () => {
      window.clearTimeout(timeout)
      delete scope[callbackName]
      script?.remove()
    }

    const timeout = window.setTimeout(() => {
      cleanup()
      reject(new Error('The reviews sheet took too long to load'))
    }, 12000)

    scope[callbackName] = (payload) => {
      cleanup()
      if (payload.status !== 'ok') {
        reject(new Error('The reviews sheet could not be read'))
        return
      }
      resolve(reviewsFromSheet(payload))
    }

    script = document.createElement('script')
    const tqx = `out:json;responseHandler:${callbackName}`
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=${encodeURIComponent(tqx)}&t=${Date.now()}`
    script.async = true
    script.onerror = () => {
      cleanup()
      reject(new Error('The reviews sheet could not be loaded'))
    }
    document.head.appendChild(script)
  })
}

export function fallbackReviews(): SheetReview[] {
  return fallbackTestimonials.map((item) => ({
    quote: item.quote,
    name: item.name,
    location: item.location,
  }))
}
