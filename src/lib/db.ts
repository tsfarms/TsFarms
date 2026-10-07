import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

export interface Variety {
  id:           string
  item_id:      string
  category:     string
  variety_name: string
  description:  string
  price:        number
  unit:         string
  is_available: boolean
  min_order:    number
  qty_step:     number
  updated_at:   string
}

export interface Product {
  id: string
  name: string
  category: string
  description: string | null
  stock_status: string
  is_active: boolean
  image_url: string | null
}

export interface OrderItem {
  productName: string
  category: string
  qty: number
  unit: string
  price: null
}

export interface OrderInsert {
  customer_name: string
  customer_phone: string
  delivery_address: string
  items: OrderItem[]
  total_amount: number
  source: string
}

export interface EnquiryInsert {
  name: string
  phone: string
  interest: string
  message: string
}

export interface Order {
  id: string
  customer_name: string | null
  customer_phone: string | null
  delivery_address: string | null
  items: OrderItem[]
  total_amount: number
  status: string
  source: string | null
  created_at: string
}

export interface Enquiry {
  id: string
  name: string | null
  phone: string | null
  interest: string | null
  message: string | null
  customer_name: string | null
  product_interest: string | null
  status: string
  created_at: string
}

function toIso(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate().toISOString()
  }
  if (typeof value === 'string') return value
  return ''
}

function isAvailable(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase()
    return text === 'yes' || text === 'true' || text === '1'
  }
  return false
}

function mapVariety(snap: QueryDocumentSnapshot<DocumentData>): Variety {
  const data = snap.data()
  return {
    id: snap.id,
    item_id: data.item_id ?? snap.id,
    category: data.category,
    variety_name: data.variety_name ?? '',
    description: data.description ?? '',
    price: Number(data.price ?? 0),
    unit: data.unit ?? 'kg',
    is_available: isAvailable(data.is_available),
    min_order: Number(data.min_order ?? 1),
    qty_step: Number(data.qty_step ?? data.increasing ?? 1),
    updated_at: typeof data.updated_at === 'string' ? data.updated_at : toIso(data.updated_at),
  }
}

function mapProduct(snap: QueryDocumentSnapshot<DocumentData>): Product {
  const data = snap.data()
  return {
    id: snap.id,
    name: data.name ?? '',
    category: data.category ?? '',
    description: data.description ?? null,
    stock_status: data.stock_status ?? 'in_stock',
    is_active: Boolean(data.is_active),
    image_url: data.image_url ?? null,
  }
}

function mapOrder(snap: QueryDocumentSnapshot<DocumentData>): Order {
  const data = snap.data()
  return {
    id: snap.id,
    customer_name: data.customer_name ?? null,
    customer_phone: data.customer_phone ?? data.phone ?? null,
    delivery_address: data.delivery_address ?? null,
    items: Array.isArray(data.items) ? data.items : [],
    total_amount: Number(data.total_amount ?? 0),
    status: data.status ?? 'pending',
    source: data.source ?? null,
    created_at: toIso(data.created_at),
  }
}

function mapEnquiry(snap: QueryDocumentSnapshot<DocumentData>): Enquiry {
  const data = snap.data()
  const name = data.customer_name ?? data.name ?? null
  const interest = data.product_interest ?? data.interest ?? null
  return {
    id: snap.id,
    name,
    phone: data.phone ?? null,
    interest,
    message: data.message ?? null,
    customer_name: name,
    product_interest: interest,
    status: data.status ?? 'new',
    created_at: toIso(data.created_at),
  }
}

function groupByCategory(varieties: Variety[]): Record<string, Variety[]> {
  return varieties.reduce<Record<string, Variety[]>>((grouped, variety) => {
    const key = variety.category
    grouped[key] = [...(grouped[key] ?? []), variety]
    return grouped
  }, {})
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'config'))
    return snap.exists() ? (snap.data() as Record<string, string>) : {}
  } catch (err) {
    console.error('getSettings failed', err)
    return {}
  }
}

export async function saveSettings(data: Record<string, string>): Promise<void> {
  await setDoc(doc(db, 'settings', 'config'), data, { merge: true })
}

export async function getLastSyncTime(): Promise<string | null> {
  const settings = await getSettings()
  return settings.last_sync_at || null
}

export async function getVarietiesByCategory(
  category: Variety['category'],
): Promise<Variety[]> {
  const snap = await getDocs(query(
    collection(db, 'varieties'),
    where('category', '==', category),
    where('is_available', '==', true),
    orderBy('variety_name'),
  ))
  return snap.docs.map(mapVariety)
}

export async function getAllVarieties(): Promise<Variety[]> {
  const snap = await getDocs(query(
    collection(db, 'varieties'),
    orderBy('category'),
    orderBy('variety_name'),
  ))
  return snap.docs.map(mapVariety)
}

export async function getVarietiesGrouped(): Promise<Record<string, Variety[]>> {
  return groupByCategory(await getAllVarieties())
}

export async function updateVariety(id: string, data: Partial<Variety>): Promise<void> {
  const { id: _id, ...rest } = data
  void _id
  await updateDoc(doc(db, 'varieties', id), {
    ...rest,
    updated_at: new Date().toISOString(),
  })
}

export function subscribeToVarietiesByCategory(
  category: string,
  callback: (varieties: Variety[]) => void,
): () => void {
  const varietiesQuery = query(
    collection(db, 'varieties'),
    where('category', '==', category),
    where('is_available', '==', true),
    orderBy('variety_name'),
  )
  return onSnapshot(varietiesQuery, (snap) => {
    callback(snap.docs.map(mapVariety))
  })
}

export function subscribeToAllVarieties(
  callback: (grouped: Record<string, Variety[]>) => void,
): () => void {
  const varietiesQuery = query(
    collection(db, 'varieties'),
    orderBy('category'),
    orderBy('variety_name'),
  )
  return onSnapshot(
    varietiesQuery,
    (snap) => {
      callback(groupByCategory(snap.docs.map(mapVariety)))
    },
    (err) => {
      console.error('subscribeToAllVarieties failed', err)
      callback({})
    },
  )
}

export async function createOrder(order: OrderInsert): Promise<string> {
  const ref = doc(collection(db, 'orders'))
  await setDoc(ref, {
    ...order,
    status: 'pending',
    created_at: serverTimestamp(),
  })
  return ref.id
}

export async function getOrders(statusFilter?: string): Promise<Order[]> {
  const ordersQuery = statusFilter
    ? query(
        collection(db, 'orders'),
        where('status', '==', statusFilter),
        orderBy('created_at', 'desc'),
        limit(100),
      )
    : query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(100))
  const snap = await getDocs(ordersQuery)
  return snap.docs.map(mapOrder)
}

export async function updateOrderStatus(
  id: string,
  status: string,
  extra?: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db, 'orders', id), {
    status,
    ...extra,
    updated_at: serverTimestamp(),
  })
}

export async function createEnquiry(enquiry: EnquiryInsert): Promise<void> {
  await addDoc(collection(db, 'enquiries'), {
    ...enquiry,
    status: 'new',
    created_at: serverTimestamp(),
  })
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const snap = await getDocs(query(
    collection(db, 'enquiries'),
    orderBy('created_at', 'desc'),
    limit(100),
  ))
  return snap.docs.map(mapEnquiry)
}

export async function updateEnquiryStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(db, 'enquiries', id), { status })
}

export async function getDashboardCounts(): Promise<{
  totalOrders: number
  pendingOrders: number
  totalEnquiries: number
  todayEnquiries: number
  activeProducts: number
  totalVarieties: number
}> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalOrdersSnap,
    pendingOrdersSnap,
    totalEnquiriesSnap,
    todayEnquiriesSnap,
    activeProductsSnap,
    totalVarietiesSnap,
  ] = await Promise.all([
    getCountFromServer(collection(db, 'orders')),
    getCountFromServer(query(collection(db, 'orders'), where('status', '==', 'pending'))),
    getCountFromServer(collection(db, 'enquiries')),
    getCountFromServer(query(collection(db, 'enquiries'), where('created_at', '>=', today))),
    getCountFromServer(query(collection(db, 'products'), where('is_active', '==', true))),
    getCountFromServer(collection(db, 'varieties')),
  ])

  return {
    totalOrders: totalOrdersSnap.data().count,
    pendingOrders: pendingOrdersSnap.data().count,
    totalEnquiries: totalEnquiriesSnap.data().count,
    todayEnquiries: todayEnquiriesSnap.data().count,
    activeProducts: activeProductsSnap.data().count,
    totalVarieties: totalVarietiesSnap.data().count,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, 'products'), orderBy('name')))
  return snap.docs.map(mapProduct)
}

export async function addProduct(data: Omit<Product, 'id'>): Promise<void> {
  await addDoc(collection(db, 'products'), data)
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const { id: _id, ...rest } = data
  void _id
  await updateDoc(doc(db, 'products', id), rest)
}
