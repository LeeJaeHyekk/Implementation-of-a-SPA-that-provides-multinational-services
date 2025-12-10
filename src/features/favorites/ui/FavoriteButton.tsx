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
      className="rounded-md border border-slate-700 px-3 py-1 text-xs font-medium text-slate-100 transition hover:border-indigo-400 hover:text-indigo-300"
    >
      {isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
    </button>
  )
}
