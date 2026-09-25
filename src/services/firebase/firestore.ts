import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './client';

function store() {
  if (!db) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* keys to .env.local.');
  return db;
}

export interface MangoVariety {
  id: string;
  name: string;
  description: string;
  is_available: boolean;
  image_url: string | null;
  tagline?: string | null;
  season?: string | null;
  unit?: string | null;
  taste_profile?: string[] | null;
  display_order?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string | null;
  stock_status: string;
  is_active: boolean;
  image_url: string | null;
}

export interface OrderItem {
  productName: string;
  category: string;
  qty: number;
  unit: string;
  price: null;
}

export interface OrderInsert {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  source: string;
}

export interface EnquiryInsert {
  name: string;
  phone: string;
  interest: string;
  message: string;
}

export interface Order {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  items: OrderItem[];
  total_amount: number;
  status: string;
  source: string | null;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string | null;
  phone: string | null;
  interest: string | null;
  message: string | null;
  customer_name: string | null;
  product_interest: string | null;
  status: string;
  created_at: string;
}

function toIso(value: unknown): string {
  if (value && typeof value === 'object' && 'toDate' in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return '';
}

function mapVariety(snap: QueryDocumentSnapshot<DocumentData>): MangoVariety {
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? '',
    description: data.description ?? '',
    is_available: Boolean(data.is_available),
    image_url: data.image_url ?? null,
    tagline: data.tagline ?? null,
    season: data.season ?? null,
    unit: data.unit ?? null,
    taste_profile: data.taste_profile ?? null,
    display_order: data.display_order ?? 0,
  };
}

function mapProduct(snap: QueryDocumentSnapshot<DocumentData>): Product {
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name ?? '',
    category: data.category ?? '',
    description: data.description ?? null,
    stock_status: data.stock_status ?? 'in_stock',
    is_active: Boolean(data.is_active),
    image_url: data.image_url ?? null,
  };
}

function mapOrder(snap: QueryDocumentSnapshot<DocumentData>): Order {
  const data = snap.data();
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
  };
}

function mapEnquiry(snap: QueryDocumentSnapshot<DocumentData>): Enquiry {
  const data = snap.data();
  const name = data.customer_name ?? data.name ?? null;
  const interest = data.product_interest ?? data.interest ?? null;
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
  };
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const snap = await getDoc(doc(store(), 'settings', 'config'));
    return snap.exists() ? (snap.data() as Record<string, string>) : {};
  } catch (err) {
    console.error('getSettings failed', err);
    return {};
  }
}

export async function saveSettings(data: Record<string, string>): Promise<void> {
  await setDoc(doc(store(), 'settings', 'config'), data, { merge: true });
}

export async function getMangoVarieties(): Promise<MangoVariety[]> {
  try {
    const q = query(
      collection(store(), 'mango_varieties'),
      where('is_available', '==', true),
      orderBy('name'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(mapVariety);
  } catch (err) {
    console.error('getMangoVarieties failed', err);
    throw err;
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const q = query(collection(store(), 'products'), where('is_active', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(mapProduct);
  } catch (err) {
    console.error('getProducts failed', err);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const snap = await getDocs(query(collection(store(), 'products'), orderBy('name')));
  return snap.docs.map(mapProduct);
}

export async function getAllMangoVarieties(): Promise<MangoVariety[]> {
  const snap = await getDocs(query(collection(store(), 'mango_varieties'), orderBy('name')));
  return snap.docs.map(mapVariety);
}

export async function createProduct(data: Omit<Product, 'id' | 'image_url'>): Promise<void> {
  await addDoc(collection(store(), 'products'), { ...data, image_url: null });
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const { id: _id, ...rest } = data;
  void _id;
  await updateDoc(doc(store(), 'products', id), rest);
}

export async function updateMangoVariety(id: string, data: Partial<MangoVariety>): Promise<void> {
  const { id: _id, ...rest } = data;
  void _id;
  await updateDoc(doc(store(), 'mango_varieties', id), rest);
}

export async function createOrder(order: OrderInsert): Promise<string> {
  try {
    const ref = doc(collection(store(), 'orders'));
    await setDoc(ref, {
      ...order,
      status: 'pending',
      created_at: serverTimestamp(),
    });
    return ref.id;
  } catch (err) {
    console.error('createOrder failed', err);
    throw err;
  }
}

export async function createEnquiry(enquiry: EnquiryInsert): Promise<void> {
  try {
    await addDoc(collection(store(), 'enquiries'), {
      ...enquiry,
      status: 'new',
      created_at: serverTimestamp(),
    });
  } catch (err) {
    console.error('createEnquiry failed', err);
    throw err;
  }
}

export async function getOrders(status?: string): Promise<Order[]> {
  const q = status
    ? query(
        collection(store(), 'orders'),
        where('status', '==', status),
        orderBy('created_at', 'desc'),
        limit(100),
      )
    : query(collection(store(), 'orders'), orderBy('created_at', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map(mapOrder);
}

export async function updateOrderStatus(
  id: string,
  status: string,
  extra?: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(store(), 'orders', id), {
    status,
    ...extra,
    updated_at: serverTimestamp(),
  });
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const q = query(collection(store(), 'enquiries'), orderBy('created_at', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map(mapEnquiry);
}

export async function updateEnquiryStatus(id: string, status: string): Promise<void> {
  await updateDoc(doc(store(), 'enquiries', id), { status });
}

export async function getDashboardCounts(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  totalEnquiries: number;
  todayEnquiries: number;
  activeProducts: number;
  totalVarieties: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrdersSnap,
    pendingOrdersSnap,
    totalEnquiriesSnap,
    todayEnquiriesSnap,
    activeProductsSnap,
    totalVarietiesSnap,
  ] = await Promise.all([
    getCountFromServer(collection(store(), 'orders')),
    getCountFromServer(query(collection(store(), 'orders'), where('status', '==', 'pending'))),
    getCountFromServer(collection(store(), 'enquiries')),
    getCountFromServer(query(collection(store(), 'enquiries'), where('created_at', '>=', today))),
    getCountFromServer(query(collection(store(), 'products'), where('is_active', '==', true))),
    getCountFromServer(collection(store(), 'mango_varieties')),
  ]);

  return {
    totalOrders: totalOrdersSnap.data().count,
    pendingOrders: pendingOrdersSnap.data().count,
    totalEnquiries: totalEnquiriesSnap.data().count,
    todayEnquiries: todayEnquiriesSnap.data().count,
    activeProducts: activeProductsSnap.data().count,
    totalVarieties: totalVarietiesSnap.data().count,
  };
}
