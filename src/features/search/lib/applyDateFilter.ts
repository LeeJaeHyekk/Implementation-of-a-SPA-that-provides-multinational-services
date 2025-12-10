import { filterByDateRange } from '@/entities/trademark/lib'
import { NormalizedTrademark, TrademarkFilters } from '@/entities/trademark/model'

export function applyDateFilter(
  items: NormalizedTrademark[],
  dateRange?: TrademarkFilters['dateRange'],
) {
  return filterByDateRange(items, dateRange)
}
