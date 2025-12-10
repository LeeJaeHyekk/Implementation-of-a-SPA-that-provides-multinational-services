'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import TrademarkCard from '@/entities/trademark/ui/TrademarkCard'
import { useFavoritesStore } from '@/features/favorites/model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'

export default function FavoritesPage() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const { data: krData, isLoading: isLoadingKr } = useTrademarksQuery({ country: 'KR' })
  const { data: usData, isLoading: isLoadingUs } = useTrademarksQuery({ country: 'US' })
  const router = useRouter()

  const items = useMemo(() => {
    const merged = [...(krData ?? []), ...(usData ?? [])]
    return merged.filter((item) => favorites.includes(item.id))
  }, [favorites, krData, usData])

  const isLoading = isLoadingKr || isLoadingUs

  function handleSelect(id: string) {
    router.push(`/trademark/${id}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4">
        <p className="text-sm text-indigo-300">즐겨찾기</p>
        <h1 className="text-3xl font-bold text-slate-50">저장된 상표 {favorites.length}건</h1>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-300">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          즐겨찾기한 상표가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <TrademarkCard key={item.id} trademark={item} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
