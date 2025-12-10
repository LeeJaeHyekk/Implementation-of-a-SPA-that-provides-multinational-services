import { filterByKeyword } from '@/entities/trademark/lib'
import { NormalizedTrademark } from '@/entities/trademark/model'

export function applyKeywordFilter(items: NormalizedTrademark[], keyword?: string) {
  return filterByKeyword(items, keyword)
}
