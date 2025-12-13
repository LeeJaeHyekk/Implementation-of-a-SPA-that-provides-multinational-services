'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useComparisonStore } from '../model/store'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import { NormalizedTrademark } from '@/entities/trademark/model'
import { isTrademarkArray } from '@/entities/trademark/lib/type-guards'
import { isValidTrademarkId } from '../model/guards'
import { navigateToComparison } from '@/shared/utils/navigation'
import { safeExecute } from '@/shared/utils/error-handler'

export default function ComparisonPanel() {
  const items = useComparisonStore((state) => state.items)
  const remove = useComparisonStore((state) => state.remove)
  const clear = useComparisonStore((state) => state.clear)
  const router = useRouter()

  // 모든 국가 데이터 로드
  const { data: krData, isError: isErrorKr } = useTrademarksQuery({ country: 'KR' })
  const { data: usData, isError: isErrorUs } = useTrademarksQuery({ country: 'US' })

  // 비교 항목 데이터 조회
  const comparisonItems = useMemo(() => {
    try {
      // 타입 가드로 데이터 검증
      const allData: NormalizedTrademark[] = []
      
      if (krData && isTrademarkArray(krData)) {
        allData.push(...krData)
      }
      
      if (usData && isTrademarkArray(usData)) {
        allData.push(...usData)
      }

      // 유효한 ID만 필터링하고 데이터 조회
      return items
        .filter((id) => isValidTrademarkId(id))
        .map((id) => allData.find((item) => item.id === id))
        .filter((item): item is NormalizedTrademark => item !== undefined)
    } catch (error) {
      globalThis.console?.error?.('[ComparisonPanel] Error processing comparison items', error)
      return []
    }
  }, [items, krData, usData])

  // 상태 검증: items가 배열이고 유효한지 확인
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  // 데이터 로딩 에러가 있고 비교 항목을 찾을 수 없는 경우
  const hasDataError = (isErrorKr || isErrorUs) && comparisonItems.length === 0 && items.length > 0

  // 안전한 clear 함수
  const handleClear = () => {
    safeExecute(
      () => clear(),
      undefined,
      { action: 'clearComparisonPanel' },
    )
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-4 sm:w-96">
      <div className="glass-card rounded-xl border border-indigo-500/30 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md sm:rounded-2xl sm:p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-slate-100">
            비교 중 ({items.length}/5)
          </h3>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-slate-200 transition"
            aria-label="전체 제거"
          >
            전체 제거
          </button>
        </div>

        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
          {hasDataError ? (
            <p className="text-xs text-red-400 text-center py-2">
              데이터를 불러올 수 없습니다. 다시 시도해주세요.
            </p>
          ) : comparisonItems.length > 0 ? (
            comparisonItems.map((item) => {
              // 안전한 제거 함수
              const handleRemove = () => {
                safeExecute(
                  () => {
                    if (isValidTrademarkId(item.id)) {
                      remove(item.id)
                    }
                  },
                  undefined,
                  { itemId: item.id, action: 'remove' },
                )
              }

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-800/50 p-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">{item.country}</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                      {item.productName || '이름 없음'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-slate-400 hover:text-red-400 transition flex-shrink-0"
                    aria-label="제거"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              비교 항목을 찾을 수 없습니다. ({items.length}개 ID 저장됨)
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            safeExecute(
              () => navigateToComparison(router),
              undefined,
              { action: 'navigateToComparison' },
            )
          }}
          disabled={hasDataError || comparisonItems.length === 0}
          className={`glass-button glass-button-primary w-full rounded-lg px-4 py-2 text-sm font-medium text-indigo-200 transition ${
            hasDataError || comparisonItems.length === 0
              ? 'cursor-not-allowed opacity-50'
              : ''
          }`}
        >
          비교하기 ({comparisonItems.length > 0 ? comparisonItems.length : items.length}개)
        </button>
      </div>
    </div>
  )
}

