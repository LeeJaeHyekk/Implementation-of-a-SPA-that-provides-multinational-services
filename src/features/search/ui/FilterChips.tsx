'use client'

import { useMemo } from 'react'
import { useSearchStore } from '../model/store'
import { useSearchFilters } from '../model/selectors'
import { createFilterChips } from '../lib/createFilterChips'
import ClearButton from '@/shared/ui/ClearButton'

/**
 * 필터 칩 컴포넌트
 * 활성 필터를 배지 형태로 표시하고 개별 제거 가능
 */
export default function FilterChips() {
  const filters = useSearchFilters()
  const setKeyword = useSearchStore((state) => state.setKeyword)
  const setApplicationNumber = useSearchStore((state) => state.setApplicationNumber)
  const setStatus = useSearchStore((state) => state.setStatus)
  const setDateRange = useSearchStore((state) => state.setDateRange)

  const chips = useMemo(
    () =>
      createFilterChips({
        filters,
        onRemoveKeyword: () => setKeyword(''),
        onRemoveApplicationNumber: () => setApplicationNumber(''),
        onRemoveStatus: () => setStatus('all'),
        onRemoveDateRange: () => setDateRange({ from: undefined, to: undefined }),
      }),
    [filters, setKeyword, setApplicationNumber, setStatus, setDateRange],
  )

  if (chips.length === 0) {
    return (
      <div className="glass-card rounded-xl p-3 sm:rounded-2xl sm:p-4">
        <p className="text-xs sm:text-sm text-slate-400">
          필터가 적용되지 않았습니다. 검색어, 출원번호, 상태, 날짜를 설정하세요.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-3 sm:rounded-2xl sm:p-4">
      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs text-indigo-100">
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="glass-badge flex items-center gap-1 sm:gap-1.5 rounded-lg px-2 py-0.5 sm:px-3 sm:py-1"
          >
            <span className="text-xs">{chip.label}</span>
            <ClearButton
              onClick={chip.onRemove}
              ariaLabel={`${chip.label} 필터 제거`}
              className="ml-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
            />
          </span>
        ))}
      </div>
    </div>
  )
}

