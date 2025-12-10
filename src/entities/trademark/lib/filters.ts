import { NormalizedTrademark, RegisterStatus, TrademarkFilters } from '../model/types'

function includesKeyword(value: string | null | undefined, keyword: string) {
  if (!value) return false
  return value.toLowerCase().includes(keyword.toLowerCase())
}

function isKeywordMatch(trademark: NormalizedTrademark, keyword?: string) {
  if (!keyword) return true
  return (
    includesKeyword(trademark.productName, keyword) ||
    includesKeyword(trademark.productNameEng, keyword)
  )
}

function isApplicationNumberMatch(trademark: NormalizedTrademark, applicationNumber?: string) {
  if (!applicationNumber) return true
  const target = applicationNumber.trim()
  if (!target) return true
  return trademark.applicationNumber.trim() === target
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
  const result = items.filter((item) => isKeywordMatch(item, keyword))
  globalThis.console?.log?.('[Filter] keyword', { keyword, before: items.length, after: result.length })
  return result
}

export function filterByApplicationNumber(items: NormalizedTrademark[], applicationNumber?: string) {
  if (!applicationNumber?.trim()) return items
  const result = items.filter((item) => isApplicationNumberMatch(item, applicationNumber))
  globalThis.console?.log?.('[Filter] applicationNumber', {
    applicationNumber,
    before: items.length,
    after: result.length,
  })
  return result
}

export function filterByStatus(items: NormalizedTrademark[], status?: RegisterStatus | 'all') {
  if (!status || status === 'all') return items
  const result = items.filter((item) => isStatusMatch(item, status))
  globalThis.console?.log?.('[Filter] status', { status, before: items.length, after: result.length })
  return result
}

export function filterByDateRange(
  items: NormalizedTrademark[],
  dateRange?: TrademarkFilters['dateRange'],
) {
  if (!dateRange) return items
  const { from, to } = dateRange
  if (!from && !to) return items
  const result = items.filter((item) => isDateInRange(item.applicationDate, from, to))
  globalThis.console?.log?.('[Filter] dateRange', {
    from,
    to,
    before: items.length,
    after: result.length,
  })
  return result
}

export function filterTrademarks(items: NormalizedTrademark[], filters: TrademarkFilters) {
  const afterApplicationNumber = filterByApplicationNumber(items, filters.applicationNumber)
  const afterKeyword = filterByKeyword(afterApplicationNumber, filters.keyword)
  const afterStatus = filterByStatus(afterKeyword, filters.status)
  globalThis.console?.log?.('[Filter] pipeline beforeDate', {
    applicationNumber: filters.applicationNumber,
    keyword: filters.keyword,
    status: filters.status,
    before: items.length,
    after: afterStatus.length,
  })
  return filterByDateRange(afterStatus, filters.dateRange)
}
