'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getSafeStorage } from '@/shared/utils/storage'
import { isValidTrademarkId, canAddToComparison, isValidComparisonCount } from './guards'

interface ComparisonState {
  items: string[]
  maxItems: number
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  isInComparison: (id: string) => boolean
  canAdd: () => boolean
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 5,
      add: (id) => {
        try {
          const { items, maxItems } = get()
          
          // 타입 가드로 ID 검증
          if (!isValidTrademarkId(id)) {
            globalThis.console?.warn?.('[ComparisonStore] Invalid trademark ID', { id })
            return
          }

          // 추가 가능 여부 검증
          if (!canAddToComparison(items, maxItems, id)) {
            globalThis.console?.warn?.('[ComparisonStore] Cannot add to comparison', {
              id,
              currentCount: items.length,
              maxItems,
              alreadyIncluded: items.includes(id),
            })
            return
          }

          set({ items: [...items, id] })
        } catch (error) {
          globalThis.console?.error?.('[ComparisonStore] Error adding item', { error, id })
        }
      },
      remove: (id) => {
        try {
          // 타입 가드로 ID 검증
          if (!isValidTrademarkId(id)) {
            globalThis.console?.warn?.('[ComparisonStore] Invalid trademark ID for removal', { id })
            return
          }

          set((state) => ({
            items: state.items.filter((item) => item !== id),
          }))
        } catch (error) {
          globalThis.console?.error?.('[ComparisonStore] Error removing item', { error, id })
        }
      },
      clear: () => {
        try {
          set({ items: [] })
        } catch (error) {
          globalThis.console?.error?.('[ComparisonStore] Error clearing items', { error })
        }
      },
      isInComparison: (id) => {
        // 타입 가드로 ID 검증
        if (!isValidTrademarkId(id)) {
          return false
        }
        return get().items.includes(id)
      },
      canAdd: () => {
        const { items, maxItems } = get()
        return isValidComparisonCount(items, maxItems) && items.length < maxItems
      },
    }),
    {
      name: 'comparison-storage',
      storage: createJSONStorage(() => getSafeStorage()),
      partialize: (state) => ({ items: state.items }),
      // localStorage에서 복원 시 검증
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 복원된 상태 검증
          const { items, maxItems } = state
          
          // items가 배열인지 확인
          if (!Array.isArray(items)) {
            globalThis.console?.warn?.('[ComparisonStore] Invalid items array, resetting', { items })
            state.items = []
            return
          }

          // 유효한 ID만 필터링
          const validItems = items.filter((id) => {
            const isValid = isValidTrademarkId(id)
            if (!isValid) {
              globalThis.console?.warn?.('[ComparisonStore] Invalid ID in storage, removing', { id })
            }
            return isValid
          })

          // 중복 제거
          const uniqueItems = Array.from(new Set(validItems))

          // 최대 개수 제한
          if (uniqueItems.length > maxItems) {
            globalThis.console?.warn?.('[ComparisonStore] Items exceed maxItems, truncating', {
              count: uniqueItems.length,
              maxItems,
            })
            state.items = uniqueItems.slice(0, maxItems)
          } else {
            state.items = uniqueItems
          }
        }
      },
    },
  ),
)

