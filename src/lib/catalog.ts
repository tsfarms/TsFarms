import mangoImage from '@/assets/varieties/alphonsa1.jpg'
import honeyImage from '@/assets/varieties/honey1.jpg'
import jackfruitImage from '@/assets/varieties/palur1.jpg'
import type { ShopProduct } from '@/content/site'
import type { Variety } from './db'
import { varietyPlaceholder } from './varietyImages'

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
  return {
    id: variety.item_id || variety.id,
    name: variety.variety_name.trim(),
    category,
    tagline: variety.description?.trim() || categoryLabel(variety.category),
    unitLabel: `Per ${displayUnit(variety.unit || 'kg')}`,
    unit: displayUnit(variety.unit || 'kg'),
    minQty: Number.isFinite(minQty) && minQty > 0 ? minQty : 1,
    price: Number(variety.price) || 0,
    image: categoryImages[category] ?? varietyPlaceholder,
    stockStatus: 'in_stock',
  }
}
