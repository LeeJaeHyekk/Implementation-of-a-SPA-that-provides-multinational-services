'use client'

import { create } from 'zustand'

export type SortOption = 'recent' | 'oldest' | 'product'

interface SortingState {
  sort: SortOption
  setSort: (sort: SortOption) => void
}

export const useSortingStore = create<SortingState>((set) => ({
  sort: 'recent',
  setSort: (sort) => set({ sort }),
}))
