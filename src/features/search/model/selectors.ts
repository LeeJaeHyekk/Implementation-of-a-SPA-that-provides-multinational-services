'use client'

import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from './store'

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
