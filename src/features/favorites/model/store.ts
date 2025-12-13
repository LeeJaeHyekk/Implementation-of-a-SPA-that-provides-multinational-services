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
function getStorage(): Storage {
  if (typeof window === 'undefined') {
    // SSR 환경에서는 메모리 스토리지 반환 (실제 저장은 안 됨)
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage
  }

  // localStorage 접근 시도 (사파리 시크릿 모드 등에서 실패할 수 있음)
  try {
    if (window.localStorage) {
      // localStorage 사용 가능 여부 테스트
      const testKey = '__localStorage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      return window.localStorage
    }
  } catch (error) {
    globalThis.console?.warn?.('[FavoritesStore] localStorage not available, using memory storage', error)
  }

  // localStorage 사용 불가능한 경우 메모리 스토리지 반환
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage
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
