import type { ShopProduct } from '@/content/site'
import { varietyToShopProduct } from './catalog'
import type { Variety } from './db'

const SHEET_ID = '1wbAJh2APS5Uy30sgS2wWUffLNcmDkWJwWAsd-z0Tc5w'

type Cell = { v?: string | number | boolean | null } | null

interface SheetPayload {
  status: string
  table: {
    cols: { label: string }[]
    rows: { c: Cell[] | null }[]
  }
}

function cellText(cell: Cell | undefined): string {
  if (!cell || cell.v == null) return ''
  return String(cell.v).trim()
}

function isAvailable(value: string): boolean {
  const text = value.trim().toLowerCase().replace(/[\s-]+/g, '_')
  return text === 'yes' || text === 'true' || text === '1' || text === 'available'
}

function headerIndex(labels: string[], names: string[]): number {
  return labels.findIndex((label) => names.includes(label.trim().toLowerCase()))
}

export function productsFromSheet(payload: SheetPayload): ShopProduct[] {
  const labels = payload.table.cols.map((col) => col.label ?? '')
  const itemCol = headerIndex(labels, ['item_id'])
  const categoryCol = headerIndex(labels, ['category'])
  const nameCol = headerIndex(labels, ['variety_name', 'variety', 'name'])
  const descriptionCol = headerIndex(labels, ['description'])
  const priceCol = headerIndex(labels, ['price'])
  const unitCol = headerIndex(labels, ['unit'])
  const availableCol = headerIndex(labels, ['is_available', 'available'])
  const minCol = headerIndex(labels, ['min_order', 'minimum_order', 'minium_order'])

  if (itemCol < 0 || categoryCol < 0 || nameCol < 0 || priceCol < 0) return []

  return payload.table.rows.flatMap((row) => {
    const cells = row.c ?? []
    const varietyName = cellText(cells[nameCol])
    const category = cellText(cells[categoryCol])
    const price = Number(cellText(cells[priceCol]))
    if (!varietyName || !category || !Number.isFinite(price)) return []
    const availableText = availableCol >= 0 ? cellText(cells[availableCol]) : 'Available'
    if (!isAvailable(availableText)) return []
    const minOrder = minCol >= 0 ? Number(cellText(cells[minCol])) : 1
    const variety: Variety = {
      id: cellText(cells[itemCol]) || varietyName,
      item_id: cellText(cells[itemCol]) || varietyName,
      category,
      variety_name: varietyName,
      description: descriptionCol >= 0 ? cellText(cells[descriptionCol]) : '',
      price,
      unit: unitCol >= 0 && cellText(cells[unitCol]) ? cellText(cells[unitCol]) : 'kg',
      is_available: true,
      min_order: Number.isFinite(minOrder) && minOrder > 0 ? minOrder : 1,
      updated_at: '',
    }
    const product = varietyToShopProduct(variety)
    return product ? [product] : []
  })
}

export function loadSheetProducts(): Promise<ShopProduct[]> {
  return new Promise((resolve, reject) => {
    const callbackName = `tsSheet_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
    const scope = window as unknown as Record<string, ((payload: SheetPayload) => void) | undefined>
    let script: HTMLScriptElement | null = null

    const cleanup = () => {
      window.clearTimeout(timeout)
      delete scope[callbackName]
      script?.remove()
    }

    const timeout = window.setTimeout(() => {
      cleanup()
      reject(new Error('The product sheet took too long to load'))
    }, 12000)

    scope[callbackName] = (payload) => {
      cleanup()
      if (payload.status !== 'ok') {
        reject(new Error('The product sheet could not be read'))
        return
      }
      resolve(productsFromSheet(payload))
    }

    script = document.createElement('script')
    const tqx = `out:json;responseHandler:${callbackName}`
    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=${encodeURIComponent(tqx)}&t=${Date.now()}`
    script.async = true
    script.onerror = () => {
      cleanup()
      reject(new Error('The product sheet could not be loaded'))
    }
    document.head.appendChild(script)
  })
}
