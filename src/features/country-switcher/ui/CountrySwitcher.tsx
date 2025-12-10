'use client'

import { TrademarkCountry } from '@/entities/trademark/model'

import { useCountryStore } from '../model/store'

const COUNTRY_OPTIONS: Array<{ value: TrademarkCountry; label: string }> = [
  { value: 'KR', label: '대한민국' },
  { value: 'US', label: '미국' },
]

export default function CountrySwitcher() {
  const country = useCountryStore((state) => state.country)
  const setCountry = useCountryStore((state) => state.setCountry)

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">국가</label>
      <select
        value={country}
        onChange={(event) => setCountry(event.target.value as TrademarkCountry)}
        className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
      >
        {COUNTRY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
