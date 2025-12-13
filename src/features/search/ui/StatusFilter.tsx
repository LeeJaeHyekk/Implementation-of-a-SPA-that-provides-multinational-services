'use client'

import { useEffect, useMemo, type ChangeEvent } from 'react'

import { getStatusOptionsForCountry } from '@/entities/trademark/lib'
import { isRegisterStatusOrAll } from '@/entities/trademark/lib/type-guards/status-guards'
import { useCountryStore } from '@/features/country-switcher/model/store'

import { useSearchStore } from '../model/store'
import FilterFieldWrapper from './FilterFieldWrapper'
import { SELECT_BASE_CLASSES } from '../lib/constants'

export default function StatusFilter() {
  const country = useCountryStore((state) => state.country)
  const status = useSearchStore((state) => state.status)
  const setStatus = useSearchStore((state) => state.setStatus)

  // 현재 국가에 맞는 상태 옵션을 동적으로 가져옴
  const statusOptions = useMemo(() => {
    return getStatusOptionsForCountry(country)
  }, [country])

  // 국가가 변경되면 현재 선택된 상태가 유효한지 확인하고, 유효하지 않으면 'all'로 리셋
  useEffect(() => {
    const isValidStatus = statusOptions.some((option) => option.value === status)
    if (!isValidStatus && status !== 'all') {
      setStatus('all')
    }
  }, [country, status, statusOptions, setStatus])

  const hasValue = status !== 'all'

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    if (isRegisterStatusOrAll(value)) {
      setStatus(value)
    } else {
      // 유효하지 않은 값인 경우 'all'로 설정
      setStatus('all')
    }
  }

  function handleClear() {
    setStatus('all')
  }

  return (
    <FilterFieldWrapper
      label="등록 상태"
      hasValue={hasValue}
      onClear={handleClear}
      clearAriaLabel="등록 상태 필터 삭제"
    >
      <select value={status ?? 'all'} onChange={handleChange} className={SELECT_BASE_CLASSES}>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FilterFieldWrapper>
  )
}
