'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FavoritesState {
  favorites: string[]
  toggle: (id: string) => void
  remove: (id: string) => void
  isFavorite: (id: string) => boolean
  clear: () => void
}

/**
 * SSR 환경에서 안전한 localStorage 접근
 */
function getStorage() {
  if (typeof window === 'undefined') {
    // SSR 환경에서는 메모리 스토리지 반환 (실제 저장은 안 됨)
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return localStorage
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggle: (id) =>
        set((state) => {
          const exists = state.favorites.includes(id)
          if (exists) {
            return { favorites: state.favorites.filter((value) => value !== id) }
          }
          return { favorites: [...state.favorites, id] }
        }),
      remove: (id) => set((state) => ({ favorites: state.favorites.filter((value) => value !== id) })),
      isFavorite: (id) => get().favorites.includes(id),
      clear: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => getStorage()),
      // 부분적으로 저장할 필드 지정 (favorites만 저장)
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
)
