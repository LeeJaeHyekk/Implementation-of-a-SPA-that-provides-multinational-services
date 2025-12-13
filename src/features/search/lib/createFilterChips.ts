import type { TrademarkFilters } from '@/entities/trademark/model'
import { formatDateToDot } from '@/shared/utils/date-utils'

export interface FilterChip {
  id: string
  label: string
  onRemove: () => void
}

interface CreateFilterChipsOptions {
  filters: TrademarkFilters
  onRemoveKeyword: () => void
  onRemoveApplicationNumber: () => void
  onRemoveStatus: () => void
  onRemoveDateRange: () => void
}

/**
 * 필터 칩 생성 유틸리티 함수
 * SearchResultsPanel에서 중복되던 로직을 통합
 */
export function createFilterChips({
  filters,
  onRemoveKeyword,
  onRemoveApplicationNumber,
  onRemoveStatus,
  onRemoveDateRange,
}: CreateFilterChipsOptions): FilterChip[] {
  const chips: FilterChip[] = []

  if (filters.keyword) {
    chips.push({
      id: 'keyword',
      label: `상표명: ${filters.keyword}`,
      onRemove: onRemoveKeyword,
    })
  }

  if (filters.applicationNumber) {
    chips.push({
      id: 'applicationNumber',
      label: `출원번호: ${filters.applicationNumber}`,
      onRemove: onRemoveApplicationNumber,
    })
  }

  if (filters.status && filters.status !== 'all') {
    chips.push({
      id: 'status',
      label: `상태: ${filters.status}`,
      onRemove: onRemoveStatus,
    })
  }

  if (filters.dateRange?.from || filters.dateRange?.to) {
    const fromLabel = filters.dateRange?.from
      ? formatDateToDot(filters.dateRange.from)
      : '전체'
    const toLabel = filters.dateRange?.to
      ? formatDateToDot(filters.dateRange.to)
      : '전체'
    chips.push({
      id: 'dateRange',
      label: `출원일: ${fromLabel} ~ ${toLabel}`,
      onRemove: onRemoveDateRange,
    })
  }

  return chips
}

