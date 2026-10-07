import mangoImage from '@/assets/mango/alphonsa.png'
import honeyImage from '@/assets/honey/honey.jpg'
import jackfruitImage from '@/assets/jackfruit/palur.jpg'
import type { ShopProduct } from '@/content/site'
import type { Variety } from './db'
import { imagesForVariety, varietyPlaceholder } from './varietyImages'

const categoryLabels: Record<string, string> = {
  mango: 'Mangoes',
  honey: 'Honey',
  jackfruit: 'Jackfruit',
}

const categoryImages: Record<string, string> = {
  mango: mangoImage,
  mangoes: mangoImage,
  honey: honeyImage,
  jackfruit: jackfruitImage,
}

export function categoryId(category: string): string {
  return category.trim().toLowerCase()
}

export function categoryLabel(category: string): string {
  const id = categoryId(category)
  return categoryLabels[id] ?? category.trim()
}

export function displayUnit(unit: string): string {
  const trimmed = unit.trim()
  return trimmed.toLowerCase() === 'kg' ? 'KG' : trimmed
}

export function varietyToShopProduct(variety: Variety): ShopProduct | null {
  if (!variety.is_available || !variety.variety_name.trim()) return null
  const category = categoryId(variety.category || 'Other')
  const minQty = Number(variety.min_order)
  const qtyStep = Number(variety.qty_step)
  const images = imagesForVariety(variety.variety_name, variety.item_id)
  return {
    id: variety.item_id || variety.id,
    name: variety.variety_name.trim(),
    category,
    tagline: variety.description?.trim() || categoryLabel(variety.category),
    unitLabel: `Per ${displayUnit(variety.unit || 'kg')}`,
    unit: displayUnit(variety.unit || 'kg'),
    minQty: Number.isFinite(minQty) && minQty > 0 ? minQty : 1,
    qtyStep: Number.isFinite(qtyStep) && qtyStep > 0 ? qtyStep : 1,
    price: Number(variety.price) || 0,
    image: images[0] ?? categoryImages[category] ?? varietyPlaceholder,
    stockStatus: 'in_stock',
  }
}
