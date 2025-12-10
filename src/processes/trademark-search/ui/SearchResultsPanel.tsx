'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import TrademarkCard from '@/entities/trademark/ui/TrademarkCard'
import { useCountryStore } from '@/features/country-switcher/model/store'
import { useSearchFilters } from '@/features/search/model/selectors'
import { combineFilters } from '@/features/search/lib/combineFilters'
import { useFavoritesStore } from '@/features/favorites/model/store'
import { useSortingStore } from '@/features/sorting/model/store'
import { sortTrademarks } from '@/features/sorting/lib/sortTrademarks'
import { useTrademarksQuery } from '@/shared/api/useTrademarksQuery'
import ResultSummary from '@/features/search/ui/ResultSummary'
import SortSelector from '@/features/sorting/ui/SortSelector'

export default function SearchResultsPanel() {
  const country = useCountryStore((state) => state.country)
  const filters = useSearchFilters()
  const sort = useSortingStore((state) => state.sort)
  const favorites = useFavoritesStore((state) => state.favorites)
  const { data, isLoading, error } = useTrademarksQuery({ country })
  const router = useRouter()

  const filtered = useMemo(() => {
    if (!data) return []
    const byFilter = combineFilters(data, filters)
    return sortTrademarks(byFilter, sort)
  }, [data, filters, sort])

  function handleSelect(id: string) {
    router.push(`/trademark/${id}`)
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-500/50 bg-red-950/50 px-4 py-3 text-sm text-red-100">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    )
  }

  const totalCount = data?.length ?? 0
  const filteredCount = filtered.length

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <ResultSummary country={country} total={totalCount} filtered={filteredCount} isLoading={isLoading} />
        <div className="md:w-60">
          <SortSelector />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-300">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          조건에 맞는 상표가 없습니다.
        </p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <TrademarkCard key={item.id} trademark={item} onSelect={handleSelect} />
          ))}
        </div>
      )}

      {favorites.length > 0 ? (
        <p className="text-xs text-slate-500">즐겨찾기: {favorites.length}건 저장됨</p>
      ) : null}
    </section>
  )
}
