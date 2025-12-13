'use client'

import { TrademarkCountry } from '@/entities/trademark/model'
import { isTrademarkCountry } from '@/entities/trademark/lib/type-guards/country-guards'

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
      <label className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow-sm md:text-base">국가</label>
      <select
        value={country}
        onChange={(event) => {
          const value = event.target.value
          if (isTrademarkCountry(value)) {
            setCountry(value)
          }
        }}
        className="glass-select h-[42px] mt-1 w-full rounded-lg px-3 text-xs sm:text-sm text-slate-100 md:px-4 md:text-base"
      >
        {COUNTRY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* 에러 메시지 영역 - 항상 렌더링하여 레이아웃 시프트 방지 (상표명 검색과 동일한 높이) */}
      <div className="mt-1 min-h-[1.25rem]">
        <p
          className="text-xs font-medium drop-shadow-sm transition-opacity sm:text-sm text-transparent opacity-0 pointer-events-none"
          role="alert"
          aria-live="polite"
        >
          {'\u00A0'}
        </p>
      </div>
    </div>
  )
}
