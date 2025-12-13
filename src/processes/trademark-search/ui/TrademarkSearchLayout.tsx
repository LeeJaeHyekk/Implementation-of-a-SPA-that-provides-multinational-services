'use client'

import { useSearchStore } from '@/features/search/model/store'
import { useHasActiveFilters } from '@/features/search/model/selectors'
import SearchBarWithFilters from './SearchBarWithFilters'
import SearchResultsPanel from './SearchResultsPanel'
import ComparisonPanel from '@/features/comparison/ui/ComparisonPanel'

export default function TrademarkSearchLayout() {
  const hasSearched = useSearchStore((state) => state.hasSearched)
  const hasActiveFilters = useHasActiveFilters()

  // 검색 결과 표시 조건: 검색어가 입력되었거나 필터가 활성화된 경우
  const shouldShowResults = hasSearched || hasActiveFilters
  
  // 제목 표시 조건: 검색 결과가 표시되지 않은 경우에만 표시
  const shouldShowTitle = !shouldShowResults

  return (
    <div className="flex min-h-screen flex-col">
      {/* 검색바 영역 - 검색 실행 시 최상단 고정 */}
      <div
        className={`transition-all ${
          shouldShowResults
            ? 'glass-header sticky top-0 z-20 py-2 sm:py-4'
            : 'flex min-h-screen flex-col items-center justify-center'
        }`}
      >
        {shouldShowTitle ? (
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-6 sm:gap-8 sm:py-8 md:gap-12 md:py-12">
            {/* 제목 영역 - 검색 실행 전에만 표시 */}
            <div className="w-full text-center">
              <h1 className="text-2xl font-bold text-slate-50 drop-shadow-md sm:text-3xl md:text-4xl lg:text-5xl">
                다국가 상표 검색
              </h1>
              <p className="mt-1.5 sm:mt-2 text-xs text-slate-400 drop-shadow-sm sm:text-sm md:text-base lg:text-base">
                KR / US 상표 데이터를 통합 검색하고 필터링합니다
              </p>
            </div>

            {/* 검색 영역 */}
            <div className="w-full">
              <SearchBarWithFilters />
            </div>
          </div>
        ) : (
          <div className="w-full px-3 sm:px-4">
            <SearchBarWithFilters />
          </div>
        )}
      </div>

      {/* 검색 결과 영역 - 검색어 입력 또는 필터 활성화 시 표시 */}
      {shouldShowResults && (
        <div id="search-results" className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
          <SearchResultsPanel />
        </div>
      )}

      {/* 비교 패널 - 플로팅 */}
      <ComparisonPanel />
    </div>
  )
}
