'use client'

import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from './store'
import type { TrademarkFilters } from '@/entities/trademark/model'

export function useSearchFilters() {
  return useSearchStore(
    useShallow((state) => ({
      keyword: state.keyword,
      applicationNumber: state.applicationNumber,
      status: state.status,
      dateRange: state.dateRange,
    })),
  )
}

export function useKeyword() {
  return useSearchStore((state) => state.keyword)
}

export function useApplicationNumber() {
  return useSearchStore((state) => state.applicationNumber)
}

export function useStatus() {
  return useSearchStore((state) => state.status)
}

export function useDateRange() {
  return useSearchStore((state) => state.dateRange)
}

/**
 * 활성 필터가 있는지 확인하는 selector
 * 여러 컴포넌트에서 중복 사용되던 로직을 통합했습니다.
 */
export function useHasActiveFilters(): boolean {
  return useSearchStore(
    useShallow((state) => {
      const hasApplicationNumber = (state.applicationNumber ?? '').trim().length > 0
      const hasStatus = state.status !== 'all'
      const hasDateRange = Boolean(state.dateRange?.from || state.dateRange?.to)
      return hasApplicationNumber || hasStatus || hasDateRange
    }),
  )
}

/**
 * 필터 객체를 받아 활성 필터가 있는지 확인하는 순수 함수
 */
export function hasActiveFilters(filters: TrademarkFilters): boolean {
  const hasApplicationNumber = (filters.applicationNumber ?? '').trim().length > 0
  const hasStatus = filters.status !== 'all'
  const hasDateRange = Boolean(filters.dateRange?.from || filters.dateRange?.to)
  return hasApplicationNumber || hasStatus || hasDateRange
}
