'use client'

import { create } from 'zustand'

import { TrademarkFilters } from '@/entities/trademark/model'

interface DateRange {
  from?: string
  to?: string
}

interface SearchState extends TrademarkFilters {
  setKeyword: (keyword: string) => void
  setApplicationNumber: (applicationNumber: string) => void
  setStatus: (status: TrademarkFilters['status']) => void
  setDateRange: (range: DateRange) => void
  reset: () => void
}

const initialState: TrademarkFilters = {
  keyword: '',
  applicationNumber: '',
  status: 'all',
  dateRange: {
    from: undefined,
    to: undefined,
  },
}

export const useSearchStore = create<SearchState>((set) => ({
  ...initialState,
  setKeyword: (keyword) => set({ keyword }),
  setApplicationNumber: (applicationNumber) => set({ applicationNumber }),
  setStatus: (status) => set({ status }),
  setDateRange: (dateRange) => set({ dateRange }),
  reset: () => set(initialState),
}))
