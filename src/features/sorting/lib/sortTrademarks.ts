import { NormalizedTrademark } from '@/entities/trademark/model'

import { SortOption } from '../model/store'

function toTimestamp(value?: string | null) {
  if (!value) return null
  const compact = value.trim()
  const normalized =
    /^\d{8}$/.test(compact) && !compact.includes('-')
      ? `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`
      : compact
  const timestamp = Date.parse(normalized)
  return Number.isNaN(timestamp) ? null : timestamp
}

export function sortTrademarks(items: NormalizedTrademark[], sort: SortOption) {
  const sorted = [...items]

  if (sort === 'product') {
    return sorted.sort((a, b) => a.productName.localeCompare(b.productName))
  }

  return sorted.sort((a, b) => {
    const aDate = toTimestamp(a.applicationDate)
    const bDate = toTimestamp(b.applicationDate)
    if (aDate === bDate) return 0
    if (aDate === null) return 1
    if (bDate === null) return -1
    return sort === 'recent' ? bDate - aDate : aDate - bDate
  })
}
