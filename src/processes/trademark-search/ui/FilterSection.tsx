'use client'

import { useSearchStore } from '@/features/search/model/store'
import { useHasActiveFilters } from '@/features/search/model/selectors'
import CountrySwitcher from '@/features/country-switcher/ui/CountrySwitcher'
import ApplicationNumberFilter from '@/features/search/ui/ApplicationNumberFilter'
import StatusFilter from '@/features/search/ui/StatusFilter'
import DateRangeFilter from '@/features/search/ui/DateRangeFilter'
interface FilterSectionProps {
  isOpen: boolean
}

export default function FilterSection({ isOpen }: FilterSectionProps) {
  const resetFilters = useSearchStore((state) => state.resetFilters)
  const hasActiveFilters = useHasActiveFilters()

  if (!isOpen) return null

  function handleResetFilters() {
    resetFilters()
  }

  return (
    <div className="mt-4 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="glass-card rounded-xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 md:text-base">상세 필터</h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="glass-button flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:text-red-300 md:text-sm"
              aria-label="필터 초기화"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>필터 초기화</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CountrySwitcher />
          <ApplicationNumberFilter />
          <StatusFilter />
          <DateRangeFilter />
        </div>
      </div>
    </div>
  )
}

