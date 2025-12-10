'use client'

import CountrySwitcher from '@/features/country-switcher/ui/CountrySwitcher'
import DateRangeFilter from '@/features/search/ui/DateRangeFilter'
import SearchBar from '@/features/search/ui/SearchBar'
import StatusFilter from '@/features/search/ui/StatusFilter'
import SearchResultsPanel from './SearchResultsPanel'

export default function TrademarkSearchLayout() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="space-y-2">
        <p className="text-sm text-indigo-300">다국가 상표 검색</p>
        <h1 className="text-3xl font-bold text-slate-50">KR / US 상표 데이터 브라우징</h1>
        <p className="text-sm text-slate-300">
          로컬 JSON을 API처럼 불러와 국가별 상표 데이터를 조회하고 필터링합니다.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <CountrySwitcher />
        <SearchBar />
        <StatusFilter />
        <DateRangeFilter />
      </div>

      <SearchResultsPanel />
    </div>
  )
}
