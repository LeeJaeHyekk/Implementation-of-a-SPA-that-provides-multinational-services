'use client'

import { useSearchStore } from '../model/store'
import FilterFieldWrapper from './FilterFieldWrapper'
import { INPUT_BASE_CLASSES } from '../lib/constants'

export default function DateRangeFilter() {
  const dateRange = useSearchStore((state) => state.dateRange)
  const setDateRange = useSearchStore((state) => state.setDateRange)

  const hasValue = Boolean(dateRange?.from || dateRange?.to)

  function handleChange(key: 'from' | 'to', value: string) {
    setDateRange({
      ...dateRange,
      [key]: value || undefined,
    })
  }

  function handleClear() {
    setDateRange({ from: undefined, to: undefined })
  }

  return (
    <FilterFieldWrapper
      label="출원일 범위"
      hasValue={hasValue}
      onClear={handleClear}
      clearAriaLabel="출원일 범위 필터 삭제"
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <input
          type="date"
          value={dateRange?.from ?? ''}
          onChange={(event) => handleChange('from', event.target.value)}
          className={INPUT_BASE_CLASSES}
        />
        <input
          type="date"
          value={dateRange?.to ?? ''}
          onChange={(event) => handleChange('to', event.target.value)}
          className={INPUT_BASE_CLASSES}
        />
      </div>
    </FilterFieldWrapper>
  )
}
