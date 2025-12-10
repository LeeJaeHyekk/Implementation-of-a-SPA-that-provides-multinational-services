'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
    },
  ),
)
