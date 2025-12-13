'use client'

import type { ChangeEvent } from 'react'

import { useSearchStore } from '../model/store'
import FilterFieldWrapper from './FilterFieldWrapper'
import { INPUT_BASE_CLASSES } from '../lib/constants'

export default function ApplicationNumberFilter() {
  const applicationNumber = useSearchStore((state) => state.applicationNumber)
  const setApplicationNumber = useSearchStore((state) => state.setApplicationNumber)

  const hasValue = (applicationNumber ?? '').trim().length > 0

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setApplicationNumber(event.target.value)
  }

  function handleClear() {
    setApplicationNumber('')
  }

  return (
    <FilterFieldWrapper
      label="출원번호"
      hasValue={hasValue}
      onClear={handleClear}
      clearAriaLabel="출원번호 필터 삭제"
    >
      <input
        value={applicationNumber}
        onChange={handleChange}
        className={INPUT_BASE_CLASSES}
        placeholder="정확한 출원번호를 입력"
      />
    </FilterFieldWrapper>
  )
}

