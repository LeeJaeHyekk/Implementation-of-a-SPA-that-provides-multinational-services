'use client'

import { useFavoritesStore } from '../model/store'

interface FavoriteButtonProps {
  trademarkId: string
}

export default function FavoriteButton({ trademarkId }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(trademarkId))
  const toggle = useFavoritesStore((state) => state.toggle)

  return (
    <button
      type="button"
      onClick={() => toggle(trademarkId)}
      className={`glass-button flex items-center justify-center rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 transition ${
        isFavorite
          ? 'glass-button-primary text-indigo-200'
          : 'text-slate-200 hover:text-indigo-200'
      }`}
      aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${isFavorite ? 'fill-current' : 'fill-none'}`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  )
}
