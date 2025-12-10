'use client'

import { TrademarkFilters } from '@/entities/trademark/model'
import { parseFiltersFromQuery } from '@/features/search/model/validators'
import { useSearchStore } from '@/features/search/model/store'

export function syncFiltersWithQuery(params: Record<string, string | string[] | undefined>) {
  const filters = parseFiltersFromQuery(params)
  const setters = useSearchStore.getState()

  if (typeof filters.keyword === 'string') {
    setters.setKeyword(filters.keyword)
  }

  if (filters.status) {
    setters.setStatus(filters.status)
  }

  if (filters.dateRange) {
    setters.setDateRange(filters.dateRange)
  }
}

export function buildQueryFromFilters(filters: TrademarkFilters) {
  const query = new URLSearchParams()
  if (filters.keyword) query.set('keyword', filters.keyword)
  if (filters.applicationNumber) query.set('applicationNumber', filters.applicationNumber)
  if (filters.status) query.set('status', filters.status)
  if (filters.dateRange?.from) query.set('from', filters.dateRange.from)
  if (filters.dateRange?.to) query.set('to', filters.dateRange.to)
  return query.toString()
}
