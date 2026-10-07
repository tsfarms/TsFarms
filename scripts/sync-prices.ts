import { readFileSync } from 'node:fs'
import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function loadCredential(): ServiceAccount {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) as ServiceAccount
  }
  return JSON.parse(readFileSync(new URL('../service-account.json', import.meta.url), 'utf8')) as ServiceAccount
}

initializeApp({ credential: cert(loadCredential()) })
const db = getFirestore()

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? '1wbAJh2APS5Uy30sgS2wWUffLNcmDkWJwWAsd-z0Tc5w'
const API_KEY  = process.env.GOOGLE_SHEETS_API_KEY
const RANGE    = 'Sheet1!A1:Z200'

interface SheetRow {
  item_id:      string
  category:     string
  variety_name: string
  description:  string
  price:        number
  unit:         string
  is_available: boolean
  min_order:    number
  qty_step:     number
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        cell += char
      }
      continue
    }
    if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') {
      cell += char
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((entry) => entry.some((value) => value.trim()))
}

function headerIndex(header: string[], names: string[]): number {
  return header.findIndex((name) => names.includes(name.trim().toLowerCase()))
}

function isAvailable(value: string | undefined): boolean {
  const text = value?.trim().toLowerCase().replace(/[\s-]+/g, '_') ?? ''
  return text === 'yes' || text === 'true' || text === '1' || text === 'available'
}

async function fetchGrid(): Promise<string[][]> {
  if (API_KEY) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    const res = await fetch(url)
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Sheets API ${res.status}: ${body}`)
    }
    const data = await res.json() as { values?: string[][] }
    return data.values ?? []
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Sheet export ${res.status}: ${body}`)
  }
  return parseCsv(await res.text())
}

async function fetchFromSheet(): Promise<SheetRow[]> {
  const rows = await fetchGrid()
  if (rows.length < 2) {
    throw new Error('Sheet is empty — aborting to protect existing data')
  }

  const header = rows[0].map((name) => name.trim().toLowerCase())
  const itemCol = headerIndex(header, ['item_id'])
  const categoryCol = headerIndex(header, ['category'])
  const nameCol = headerIndex(header, ['variety_name', 'variety', 'name'])
  const descriptionCol = headerIndex(header, ['description'])
  const priceCol = headerIndex(header, ['price'])
  const unitCol = headerIndex(header, ['unit'])
  const availableCol = headerIndex(header, ['is_available', 'available'])
  const minCol = headerIndex(header, ['min_order', 'minimum_order', 'minium_order'])
  const stepCol = headerIndex(header, ['increasing', 'increment', 'qty_step', 'step'])

  if (itemCol < 0 || categoryCol < 0 || nameCol < 0 || priceCol < 0) {
    throw new Error('Sheet header must include item_id, category, variety_name, and price')
  }

  const parsed: SheetRow[] = []

  for (const [i, row] of rows.slice(1).entries()) {
    const line = i + 2
    const itemId = row[itemCol]?.trim()
    const category = row[categoryCol]?.trim()
    const varietyName = row[nameCol]?.trim()
    const priceText = row[priceCol]?.trim()
    if (!itemId || !category || !varietyName || !priceText) {
      console.warn(`Row ${line}: missing field — skipped`)
      continue
    }
    const price = parseFloat(priceText)
    if (isNaN(price) || price < 0) {
      console.warn(`Row ${line}: bad price "${priceText}" — skipped`)
      continue
    }
    const minOrder = minCol >= 0 ? parseFloat(row[minCol]) : 1
    const qtyStep = stepCol >= 0 ? parseFloat(row[stepCol]) : 1
    parsed.push({
      item_id: itemId,
      category,
      variety_name: varietyName,
      description: descriptionCol >= 0 ? row[descriptionCol]?.trim() ?? '' : '',
      price,
      unit: unitCol >= 0 && row[unitCol]?.trim() ? row[unitCol].trim() : 'kg',
      is_available: availableCol >= 0 ? isAvailable(row[availableCol]) : true,
      min_order: Number.isFinite(minOrder) && minOrder > 0 ? minOrder : 1,
      qty_step: Number.isFinite(qtyStep) && qtyStep > 0 ? qtyStep : 1,
    })
  }

  if (parsed.length === 0) {
    throw new Error('No valid rows — aborting to protect existing data')
  }

  return parsed
}

async function syncToFirestore(rows: SheetRow[]): Promise<void> {
  const now        = new Date().toISOString()
  const BATCH_SIZE = 400
  let batch        = db.batch()
  let count        = 0

  for (const row of rows) {
    const ref = db.collection('varieties').doc(row.item_id)
    batch.set(ref, { ...row, updated_at: now }, { merge: true })
    count++
    if (count >= BATCH_SIZE) {
      await batch.commit()
      batch = db.batch()
      count = 0
    }
  }
  if (count > 0) await batch.commit()

  await db.collection('settings').doc('config').set(
    { last_sync_at: now },
    { merge: true }
  )

  console.log(`✓ Synced ${rows.length} rows`)
  console.log(`✓ last_sync_at: ${now}`)
}

async function main() {
  console.log('Sync started:', new Date().toISOString())
  try {
    const rows = await fetchFromSheet()
    console.log(`Fetched ${rows.length} valid rows`)
    await syncToFirestore(rows)
    console.log('Sync complete ✓')
    process.exit(0)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Sync FAILED:', message)
    process.exit(1)
  }
}

void main()
