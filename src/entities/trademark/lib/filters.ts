import { NormalizedTrademark, RegisterStatus, TrademarkFilters } from '../model/types'

function includesKeyword(value: string | undefined, keyword: string) {
  if (!value) return false
  return value.toLowerCase().includes(keyword.toLowerCase())
}

function isKeywordMatch(trademark: NormalizedTrademark, keyword?: string) {
  if (!keyword) return true
  return (
    includesKeyword(trademark.productName, keyword) ||
    includesKeyword(trademark.productNameEng, keyword) ||
    includesKeyword(trademark.applicationNumber, keyword)
  )
}

function isStatusMatch(trademark: NormalizedTrademark, status?: RegisterStatus | 'all') {
  if (!status || status === 'all') return true
  return trademark.registerStatus === status
}

function toTimestamp(value?: string | null) {
  if (!value) return null
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : timestamp
}

function isDateInRange(value?: string | null, from?: string, to?: string) {
  if (!from && !to) return true
  const timestamp = toTimestamp(value)
  if (!timestamp) return false
  const fromTs = toTimestamp(from) ?? Number.NEGATIVE_INFINITY
  const toTs = toTimestamp(to) ?? Number.POSITIVE_INFINITY
  return timestamp >= fromTs && timestamp <= toTs
}

export function filterByKeyword(items: NormalizedTrademark[], keyword?: string) {
  if (!keyword) return items
  return items.filter((item) => isKeywordMatch(item, keyword))
}

export function filterByStatus(items: NormalizedTrademark[], status?: RegisterStatus | 'all') {
  if (!status || status === 'all') return items
  return items.filter((item) => isStatusMatch(item, status))
}

export function filterByDateRange(
  items: NormalizedTrademark[],
  dateRange?: TrademarkFilters['dateRange'],
) {
  if (!dateRange) return items
  const { from, to } = dateRange
  if (!from && !to) return items
  return items.filter((item) => isDateInRange(item.applicationDate, from, to))
}

export function filterTrademarks(items: NormalizedTrademark[], filters: TrademarkFilters) {
  const afterKeyword = filterByKeyword(items, filters.keyword)
  const afterStatus = filterByStatus(afterKeyword, filters.status)
  return filterByDateRange(afterStatus, filters.dateRange)
}
