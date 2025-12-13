'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import TrademarkCard from '@/entities/trademark/ui/TrademarkCard'
import { NormalizedTrademark } from '@/entities/trademark/model'
import { isTrademarkArray } from '@/entities/trademark/lib/type-guards'
import { useFavoritesStore } from '@/features/favorites/model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import { navigateToTrademarkDetail } from '@/shared/utils/navigation'
import NavigateButton from '@/shared/ui/NavigateButton'
import ErrorState from '@/shared/ui/ErrorState'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { LAYOUT_CLASSES, GRID_CLASSES } from '@/shared/config/css-classes'

export default function FavoritesRoute() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const { data: krData, isLoading: isLoadingKr, isError: isErrorKr } = useTrademarksQuery({ country: 'KR' })
  const { data: usData, isLoading: isLoadingUs, isError: isErrorUs } = useTrademarksQuery({ country: 'US' })
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
  const isError = isErrorKr || isErrorUs

  function handleSelect(id: string) {
    navigateToTrademarkDetail(router, id)
  }

  return (
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.pageHeader}>
        <p className={LAYOUT_CLASSES.pageSubtitle}>즐겨찾기</p>
        <h1 className={LAYOUT_CLASSES.pageTitle}>저장된 상표 {favorites.length}건</h1>
      </div>

      {isError ? (
        <ErrorState
          message="데이터를 불러오는 중 오류가 발생했습니다."
          action={<NavigateButton to="search" className="mt-3" />}
        />
      ) : isLoading ? (
        <LoadingSpinner size="lg" color="indigo" text="데이터를 불러오는 중..." fullScreen />
      ) : items.length === 0 ? (
        <EmptyState message="즐겨찾기한 상표가 없습니다." />
      ) : (
        <div className={GRID_CLASSES.cardGrid}>
          {items.map((item) => (
            <TrademarkCard key={item.id} trademark={item} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
