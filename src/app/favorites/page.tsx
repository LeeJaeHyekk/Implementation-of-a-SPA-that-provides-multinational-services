'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import TrademarkCard from '@/entities/trademark/ui/TrademarkCard'
import { NormalizedTrademark } from '@/entities/trademark/model'
import { isTrademarkArray } from '@/entities/trademark/lib/type-guards'
import { useFavoritesStore } from '@/features/favorites/model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'

export default function FavoritesRoute() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const { data: krData, isLoading: isLoadingKr } = useTrademarksQuery({ country: 'KR' })
  const { data: usData, isLoading: isLoadingUs } = useTrademarksQuery({ country: 'US' })
  const router = useRouter()

  const items = useMemo(() => {
    const merged: NormalizedTrademark[] = []
    
    // 타입 가드로 안전하게 필터링
    if (krData && isTrademarkArray(krData)) {
      merged.push(...krData)
    }
    if (usData && isTrademarkArray(usData)) {
      merged.push(...usData)
    }
    
    return merged.filter((item) => favorites.includes(item.id))
  }, [favorites, krData, usData])

  const isLoading = isLoadingKr || isLoadingUs

  function handleSelect(id: string) {
    router.push(`/trademark/${id}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4">
        <p className="text-sm font-medium text-indigo-300 drop-shadow-sm">즐겨찾기</p>
        <h1 className="text-3xl font-bold text-slate-50 drop-shadow-md">저장된 상표 {favorites.length}건</h1>
      </div>

      {isLoading ? (
        <p className="text-sm font-medium text-slate-300 drop-shadow-sm">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="glass-card rounded-lg px-4 py-3 text-sm font-medium text-slate-300">
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
