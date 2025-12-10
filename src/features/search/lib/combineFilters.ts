import { filterTrademarks } from '@/entities/trademark/lib'
import { NormalizedTrademark, TrademarkFilters } from '@/entities/trademark/model'

export function combineFilters(items: NormalizedTrademark[], filters: TrademarkFilters) {
  return filterTrademarks(items, filters)
}
