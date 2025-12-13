'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getSafeStorage } from '@/shared/utils/storage'

interface FavoritesState {
  favorites: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  isFavorite: (id: string) => boolean
  clear: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (id) => {
        try {
          if (!id || typeof id !== 'string' || id.trim().length === 0) {
            globalThis.console?.warn?.('[FavoritesStore] Invalid ID for toggle', { id })
            return
          }
          set((state) => {
            const exists = state.favorites.includes(id)
            if (exists) {
              return { favorites: state.favorites.filter((value) => value !== id) }
            }
            return { favorites: [...state.favorites, id] }
          })
        } catch (error) {
          globalThis.console?.error?.('[FavoritesStore] Error toggling favorite', { error, id })
        }
      },
      remove: (id) => {
        try {
          if (!id || typeof id !== 'string' || id.trim().length === 0) {
            globalThis.console?.warn?.('[FavoritesStore] Invalid ID for removal', { id })
            return
          }
          set((state) => ({ favorites: state.favorites.filter((value) => value !== id) }))
        } catch (error) {
          globalThis.console?.error?.('[FavoritesStore] Error removing favorite', { error, id })
        }
      },
      isFavorite: (id) => {
        try {
          if (!id || typeof id !== 'string' || id.trim().length === 0) {
            return false
          }
          return get().favorites.includes(id)
        } catch (error) {
          globalThis.console?.error?.('[FavoritesStore] Error checking favorite', { error, id })
          return false
        }
      },
      clear: () => {
        try {
          set({ favorites: [] })
        } catch (error) {
          globalThis.console?.error?.('[FavoritesStore] Error clearing favorites', { error })
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => getSafeStorage()),
      // 부분적으로 저장할 필드 지정 (favorites만 저장)
      partialize: (state) => ({ favorites: state.favorites }),
      // localStorage에서 복원 시 검증
      onRehydrateStorage: () => (state) => {
        if (state && state.favorites) {
          try {
            // favorites가 배열인지 확인
            if (!Array.isArray(state.favorites)) {
              globalThis.console?.warn?.('[FavoritesStore] Invalid favorites array, resetting', {
                favorites: state.favorites,
              })
              state.favorites = []
              return
            }

            // 유효한 ID만 필터링 (문자열이고 비어있지 않은 것만)
            const validFavorites = state.favorites.filter((id) => {
              const isValid = typeof id === 'string' && id.trim().length > 0
              if (!isValid) {
                globalThis.console?.warn?.('[FavoritesStore] Invalid ID in storage, removing', { id })
              }
              return isValid
            })

            // 중복 제거
            state.favorites = Array.from(new Set(validFavorites))
          } catch (error) {
            globalThis.console?.error?.('[FavoritesStore] Error rehydrating favorites', { error })
            state.favorites = []
          }
        }
      },
    },
  ),
)
