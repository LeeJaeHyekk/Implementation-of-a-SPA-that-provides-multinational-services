'use client'

import { useSortingStore } from '../model/store'

const OPTIONS = [
  { value: 'recent', label: '최근 출원순' },
  { value: 'oldest', label: '오래된 출원순' },
  { value: 'product', label: '상품명 가나다순' },
]

export default function SortSelector() {
  const sort = useSortingStore((state) => state.sort)
  const setSort = useSortingStore((state) => state.setSort)

  return (
    <div className="w-full">
      <label className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow-sm">정렬</label>
      <select
        value={sort}
        onChange={(event) => setSort(event.target.value as typeof sort)}
        className="glass-select mt-1 h-[42px] w-full rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
