'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import TrademarkCard from '@/entities/trademark/ui/TrademarkCard'
import { useCountryStore } from '@/features/country-switcher/model/store'
import { useSearchFilters } from '@/features/search/model/selectors'
import { combineFilters, combineFiltersAsync } from '@/features/search/lib'
import { useFavoritesStore } from '@/features/favorites/model/store'
import { useSortingStore } from '@/features/sorting/model/store'
import { sortTrademarks } from '@/features/sorting/lib/sortTrademarks'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import { NormalizedTrademark } from '@/entities/trademark/model'
import ResultSummary from '@/features/search/ui/ResultSummary'
import SortSelector from '@/features/sorting/ui/SortSelector'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { navigateToTrademarkDetail } from '@/shared/utils/navigation'
import { GRID_CLASSES } from '@/shared/config/css-classes'
import { SEARCH_CONSTANTS } from '@/shared/config/constants'
import { usePagination } from '@/shared/hooks'
import FilterChips from '@/features/search/ui/FilterChips'
import { safeExecute } from '@/shared/utils/error-handler'

export default function SearchResultsPanel() {
  const country = useCountryStore((state) => state.country)
  const filters = useSearchFilters()
  const sort = useSortingStore((state) => state.sort)
  const favorites = useFavoritesStore((state) => state.favorites)
  const { data, isLoading, isError, isFetching } = useTrademarksQuery({ country })
  const router = useRouter()

  // 데이터는 이미 fetch 단계에서 전처리됨
  const trademarks = useMemo(() => data ?? [], [data])

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const effectiveFilters = filters

  // 대량 데이터 처리 최적화
  const [filtered, setFiltered] = useState<NormalizedTrademark[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  useEffect(() => {
    if (!trademarks || trademarks.length === 0) {
      setFiltered([])
      return
    }

    // 대량 데이터는 비동기 최적화 필터링 사용
    if (trademarks.length > SEARCH_CONSTANTS.LARGE_DATA_THRESHOLD) {
      setIsFiltering(true)
      combineFiltersAsync(trademarks, effectiveFilters, {
        useOptimized: true,
        chunkSize: SEARCH_CONSTANTS.CHUNK_SIZE,
        onProgress: (processed, total) => {
          // 진행률 로깅 (선택적)
          if (processed % 5000 === 0 || processed === total) {
            globalThis.console?.log?.('[FilterProgress]', {
              processed,
              total,
              percentage: ((processed / total) * 100).toFixed(1) + '%',
            })
          }
        },
      })
        .then((filtered) => {
          setFiltered(sortTrademarks(filtered, sort))
          setIsFiltering(false)
        })
        .catch((error) => {
          globalThis.console?.error?.('[FilterError]', error)
          // 에러 발생 시 일반 필터링으로 폴백
          setFiltered(sortTrademarks(combineFilters(trademarks, effectiveFilters), sort))
          setIsFiltering(false)
        })
    } else {
      // 소량 데이터는 동기 처리
      const byFilter = combineFilters(trademarks, effectiveFilters)
      setFiltered(sortTrademarks(byFilter, sort))
    }
  }, [trademarks, effectiveFilters, sort])

  // 페이지네이션 훅 사용
  const {
    currentPage,
    totalPages,
    pagedItems: paged,
    goToNextPage,
    goToPrevPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination(filtered, {
    totalItems: filtered.length,
    pageSize: SEARCH_CONSTANTS.PAGE_SIZE,
  })

  const selectedTrademark = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? null,
    [filtered, selectedId],
  )

  function handleSelect(id: string) {
    safeExecute(
      () => {
        if (!id || typeof id !== 'string' || id.trim().length === 0) {
          globalThis.console?.warn?.('[SearchResultsPanel] Invalid ID for selection', { id })
          return
        }
        navigateToTrademarkDetail(router, id)
      },
      undefined,
      { id, action: 'selectTrademark' },
    )
  }

  if (isError) {
    return (
      <div className="glass-card rounded-lg border-red-500/40 bg-red-950/30 px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm font-medium text-red-200 backdrop-blur-md">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    )
  }

  const totalCount = trademarks.length
  const filteredCount = filtered.length

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ResultSummary country={country} total={totalCount} filtered={filteredCount} isLoading={isLoading} />
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:w-auto">
          <div className="w-full sm:w-56 md:w-60">
            <SortSelector />
          </div>
        </div>
      </div>

      <FilterChips />

      {isLoading ? (
        <LoadingSpinner size="lg" color="indigo" text="데이터를 불러오는 중..." fullScreen />
      ) : isFetching || isFiltering ? (
        <div className="glass-card rounded-xl px-3 py-4 sm:rounded-2xl sm:px-4 sm:py-6">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <LoadingSpinner size="md" color="indigo" />
            <span className="text-xs sm:text-sm text-slate-300">
              {isFiltering ? '대량 데이터 필터링 중...' : '데이터를 갱신하는 중...'}
            </span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="glass-card rounded-xl px-3 py-4 text-xs sm:rounded-2xl sm:px-4 sm:py-6 sm:text-sm font-medium text-slate-300">
          조건에 맞는 상표가 없습니다.
        </p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className={GRID_CLASSES.cardGrid}>
            {paged.map((item) => (
              <TrademarkCard key={item.id} trademark={item} onSelect={handleSelect} />
            ))}
          </div>

          <div className="glass-card flex flex-col gap-3 rounded-2xl px-3 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3 sm:text-sm font-medium text-slate-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  safeExecute(
                    () => goToPrevPage(),
                    undefined,
                    { action: 'goToPrevPage', currentPage },
                  )
                }}
                disabled={!hasPrevPage}
                className="glass-button rounded-lg px-2.5 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm font-medium text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() => {
                  safeExecute(
                    () => goToNextPage(),
                    undefined,
                    { action: 'goToNextPage', currentPage },
                  )
                }}
                disabled={!hasNextPage}
                className="glass-button rounded-lg px-2.5 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm font-medium text-slate-200 transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none"
              >
                다음
              </button>
              <span className="glass-badge rounded-lg px-2 py-0.5 text-xs font-medium text-slate-300 sm:px-3 sm:py-1">
                {currentPage} / {totalPages}페이지
              </span>
            </div>
            <span className="text-xs text-slate-400 sm:text-sm">
              페이지당 {SEARCH_CONSTANTS.PAGE_SIZE}개 · 총 {filteredCount}건
            </span>
          </div>
        </div>
      )}

      {favorites.length > 0 ? (
        <p className="text-xs text-slate-500 sm:text-sm">즐겨찾기: {favorites.length}건 저장됨</p>
      ) : null}

      {selectedTrademark ? (
        <DetailModal
          trademark={selectedTrademark}
          onClose={() => setSelectedId(null)}
          onBack={() => setSelectedId(null)}
        />
      ) : null}
    </section>
  )
}

import { formatDateToDot, formatDateArray } from '@/shared/utils/date-utils'
import { getTrademarkStatusLabel } from '@/entities/trademark/lib/getStatusLabel'

interface DetailModalProps {
  trademark: NormalizedTrademark
  onClose: () => void
  onBack: () => void
}

function DetailModal({ trademark, onClose, onBack }: DetailModalProps) {
  // trademark 유효성 검증
  if (!trademark || typeof trademark !== 'object' || !trademark.id) {
    globalThis.console?.warn?.('[DetailModal] Invalid trademark prop', { trademark })
    return null
  }

  // Escape 키로 모달 닫기
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      try {
        if (event.key === 'Escape') {
          onClose()
        }
      } catch (error) {
        globalThis.console?.error?.('[DetailModal] Error handling keydown', { error })
      }
    }

    try {
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        try {
          window.removeEventListener('keydown', handleKeyDown)
        } catch (error) {
          globalThis.console?.error?.('[DetailModal] Error removing keydown listener', { error })
        }
      }
    } catch (error) {
      globalThis.console?.error?.('[DetailModal] Error adding keydown listener', { error })
      return () => {}
    }
  }, [onClose])

  const isKR = trademark.country === 'KR'
  const statusLabel = getTrademarkStatusLabel(trademark)
  const fields: Array<[string, string | string[] | null | undefined]> = isKR
    ? [
        ['출원번호', trademark.applicationNumber],
        ['출원일', trademark.applicationDate],
        ['등록 상태', statusLabel],
        ['공고번호', trademark.publicationNumber],
        ['공고일', trademark.publicationDate],
        ['등록번호', trademark.registrationNumber],
        ['등록일', trademark.registrationDate],
        ['등록 공고 번호', trademark.registrationPubNumber],
        ['등록 공고일', trademark.registrationPubDate],
        ['국제출원번호', trademark.internationalRegNumbers],
        ['국제출원일', trademark.internationalRegDate],
        ['우선권 번호', trademark.priorityClaimNumList],
        ['우선권 일자', trademark.priorityClaimDateList],
        ['상품 주 분류 코드', trademark.productMainCodes],
        ['상품 유사군 코드', trademark.productSubCodes],
        ['비엔나 코드', trademark.viennaCodeList],
      ]
    : [
        ['출원번호', trademark.applicationNumber],
        ['출원일', trademark.applicationDate],
        ['등록 상태', statusLabel],
        ['공고일', trademark.publicationDate],
        ['등록번호', trademark.registrationNumber],
        ['등록일', trademark.registrationDate],
        ['국제출원번호', trademark.internationalRegNumbers],
        ['국제출원일', trademark.internationalRegDate],
        ['우선권 번호', trademark.priorityClaimNumList],
        ['우선권 일자', trademark.priorityClaimDateList],
        ['Nice 분류 코드', trademark.productMainCodes],
        ['US 코드', trademark.usClassCodes],
        ['비엔나 코드', trademark.viennaCodeList],
      ]

  const renderField = (label: string, value: string | string[] | null | undefined) => {
    const display = Array.isArray(value)
      ? formatDateArray(value, trademark.country)
      : formatDateToDot(value ?? null, trademark.country)

    return (
      <div
        key={label}
        className="glass-card flex flex-col gap-0.5 sm:gap-1 rounded-lg px-2.5 py-1.5 sm:rounded-xl sm:px-3 sm:py-2"
      >
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-xs sm:text-sm font-medium text-slate-50 break-words">
          {display === '-' || display === 'Unknown' ? (trademark.country === 'US' ? 'Unknown' : '-') : display}
        </p>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900/80 p-4 shadow-2xl shadow-indigo-900/30 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/80">{trademark.country}</p>
            <h2 id="modal-title" className="text-lg sm:text-2xl font-semibold text-slate-50 break-words">{trademark.productName}</h2>
            {trademark.productNameEng ? (
              <p className="text-xs sm:text-sm text-slate-300 break-words">{trademark.productNameEng}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 sm:flex-shrink-0">
            <span className="glass-badge rounded-lg px-2 py-0.5 text-xs font-semibold text-indigo-200 sm:px-3 sm:py-1">
              {statusLabel}
            </span>
            <button
              type="button"
              onClick={() => {
                safeExecute(
                  () => onClose(),
                  undefined,
                  { action: 'closeModal' },
                )
              }}
              className="glass-button rounded-lg px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:text-indigo-200 sm:px-3 sm:py-1"
              aria-label="모달 닫기"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 sm:gap-3 md:grid-cols-3">{fields.map(([label, value]) => renderField(label, value))}</div>

        <div className="mt-4 flex justify-end gap-2 sm:mt-6">
          <button
            type="button"
            onClick={() => {
              safeExecute(
                () => onBack(),
                undefined,
                { action: 'backModal' },
              )
            }}
            className="glass-button glass-button-primary rounded-lg px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium text-indigo-200 transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
