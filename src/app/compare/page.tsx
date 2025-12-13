'use client'

import { useMemo, useEffect } from 'react'
import { useComparisonStore } from '@/features/comparison/model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import { NormalizedTrademark } from '@/entities/trademark/model'
import { isTrademarkArray } from '@/entities/trademark/lib/type-guards'
import { isValidTrademarkId, isTrademarkIdArray } from '@/features/comparison/model/guards'
import ComparisonTable from '@/features/comparison/ui/ComparisonTable'
import BackButton from '@/shared/ui/BackButton'
import EmptyState from '@/shared/ui/EmptyState'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import ErrorState from '@/shared/ui/ErrorState'
import NavigateButton from '@/shared/ui/NavigateButton'
import { LAYOUT_CLASSES } from '@/shared/config/css-classes'
import { safeExecute } from '@/shared/utils/error-handler'

export default function ComparisonPage() {
  const items = useComparisonStore((state) => state.items)
  const clear = useComparisonStore((state) => state.clear)

  const { data: krData, isLoading: isLoadingKr, isError: isErrorKr } = useTrademarksQuery({ country: 'KR' })
  const { data: usData, isLoading: isLoadingUs, isError: isErrorUs } = useTrademarksQuery({ country: 'US' })

  // 페이지 제목 동적 업데이트
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const itemCount = Array.isArray(items) ? items.length : 0
      document.title = `상표 비교 (${itemCount}개) | 다국가 상표 검색`
    }
  }, [items])

  // 비교 항목 데이터 조회
  const comparisonItems = useMemo(() => {
    try {
      // 상태 검증: items가 유효한 배열인지 확인
      if (!Array.isArray(items) || !isTrademarkIdArray(items)) {
        globalThis.console?.warn?.('[ComparisonPage] Invalid items array', { items })
        return []
      }

      const merged: NormalizedTrademark[] = []
      
      // 타입 가드로 데이터 검증
      if (krData && isTrademarkArray(krData)) {
        merged.push(...krData)
      }
      if (usData && isTrademarkArray(usData)) {
        merged.push(...usData)
      }
      
      // 유효한 ID만 필터링하고 데이터 조회
      return items
        .filter((id) => isValidTrademarkId(id))
        .map((id) => merged.find((item) => item.id === id))
        .filter((item): item is NormalizedTrademark => item !== undefined)
    } catch (error) {
      globalThis.console?.error?.('[ComparisonPage] Error processing comparison items', error)
      return []
    }
  }, [items, krData, usData])

  // 데이터를 찾을 수 없는 항목 수 계산
  const missingItemsCount = useMemo(() => {
    if (!Array.isArray(items)) return 0
    return items.length - comparisonItems.length
  }, [items, comparisonItems])

  const isLoading = isLoadingKr || isLoadingUs
  const isError = isErrorKr || isErrorUs

  return (
    <div className={LAYOUT_CLASSES.container}>
      <div className={LAYOUT_CLASSES.pageHeader}>
        <p className={LAYOUT_CLASSES.pageSubtitle}>상표 비교</p>
        <h1 className={LAYOUT_CLASSES.pageTitle}>
          {Array.isArray(items) && items.length > 0 ? `${items.length}개 상표 비교` : '상표 비교'}
        </h1>
      </div>

      {isError ? (
        <ErrorState
          message="데이터를 불러오는 중 오류가 발생했습니다."
          action={<NavigateButton to="search" className="mt-3" />}
        />
      ) : isLoading ? (
        <LoadingSpinner size="lg" color="indigo" text="데이터를 불러오는 중..." fullScreen />
      ) : !Array.isArray(items) || items.length === 0 ? (
        <EmptyState
          message="비교할 상표가 없습니다."
          action={<BackButton />}
        />
      ) : comparisonItems.length === 0 ? (
        <EmptyState
          message={`저장된 비교 항목(${items.length}개)을 찾을 수 없습니다. 데이터가 로드되지 않았거나 삭제되었을 수 있습니다.`}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  safeExecute(
                    () => clear(),
                    undefined,
                    { action: 'clearComparison' },
                  )
                }}
                className="glass-button rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:text-red-400"
              >
                전체 제거
              </button>
              <BackButton />
            </div>
          }
        />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {missingItemsCount > 0 && (
            <div className="glass-card rounded-xl border border-yellow-500/30 bg-yellow-950/20 p-3 sm:rounded-2xl sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-200">
                ⚠️ 저장된 항목 중 {missingItemsCount}개를 찾을 수 없습니다. 데이터가 로드되지 않았거나 삭제되었을 수 있습니다.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs sm:text-sm text-slate-400">
              여러 국가의 상표를 한눈에 비교하세요
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  safeExecute(
                    () => clear(),
                    undefined,
                    { action: 'clearComparison' },
                  )
                }}
                className="glass-button rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-200 transition hover:text-red-400"
              >
                전체 제거
              </button>
              <BackButton />
            </div>
          </div>

          <ComparisonTable items={comparisonItems} />
        </div>
      )}
    </div>
  )
}

