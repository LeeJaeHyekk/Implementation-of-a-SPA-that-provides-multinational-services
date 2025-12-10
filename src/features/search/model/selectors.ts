import { useSearchStore } from './store'

export function useSearchFilters() {
  return useSearchStore((state) => ({
    keyword: state.keyword,
    status: state.status,
    dateRange: state.dateRange,
  }))
}

export function useKeyword() {
  return useSearchStore((state) => state.keyword)
}

export function useStatus() {
  return useSearchStore((state) => state.status)
}

export function useDateRange() {
  return useSearchStore((state) => state.dateRange)
}
