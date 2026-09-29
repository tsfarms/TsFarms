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

const SHEET_ID = process.env.GOOGLE_SHEET_ID!
const API_KEY  = process.env.GOOGLE_SHEETS_API_KEY!
const RANGE    = 'Sheet1!A2:H200'

interface SheetRow {
  item_id:      string
  category:     string
  variety_name: string
  description:  string
  price:        number
  unit:         string
  is_available: boolean
  min_order:    number
}

async function fetchFromSheet(): Promise<SheetRow[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
  const res  = await fetch(url)

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Sheets API ${res.status}: ${body}`)
  }

  const data = await res.json() as { values?: string[][] }
  const rows: string[][] = data.values ?? []

  if (rows.length === 0) {
    throw new Error('Sheet is empty — aborting to protect existing data')
  }

  const parsed: SheetRow[] = []

  for (const [i, row] of rows.entries()) {
    if (!row[0] || !row[1] || !row[2] || !row[4]) {
      console.warn(`Row ${i + 2}: missing field — skipped`)
      continue
    }
    const price = parseFloat(row[4])
    if (isNaN(price) || price < 0) {
      console.warn(`Row ${i + 2}: bad price "${row[4]}" — skipped`)
      continue
    }
    const category = row[1].trim()
    if (!['Mango', 'Jackfruit', 'Honey'].includes(category)) {
      console.warn(`Row ${i + 2}: unknown category "${category}" — skipped`)
      continue
    }
    parsed.push({
      item_id:      row[0].trim(),
      category,
      variety_name: row[2].trim(),
      description:  row[3]?.trim() ?? '',
      price,
      unit:         row[5]?.trim() ?? 'kg',
      is_available: row[6]?.trim().toLowerCase() === 'yes',
      min_order:    parseFloat(row[7]) || 1,
    })
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
