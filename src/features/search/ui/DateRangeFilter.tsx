'use client'

import { useSearchStore } from '../model/store'

export default function DateRangeFilter() {
  const dateRange = useSearchStore((state) => state.dateRange)
  const setDateRange = useSearchStore((state) => state.setDateRange)

  function handleChange(key: 'from' | 'to', value: string) {
    setDateRange({
      ...dateRange,
      [key]: value || undefined,
    })
  }

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">출원일 범위</label>
      <div className="mt-1 grid grid-cols-2 gap-3">
        <input
          type="date"
          value={dateRange?.from ?? ''}
          onChange={(event) => handleChange('from', event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
        />
        <input
          type="date"
          value={dateRange?.to ?? ''}
          onChange={(event) => handleChange('to', event.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
        />
      </div>
    </div>
  )
}
