'use client'

import { type ReactNode } from 'react'
import ClearButton from '@/shared/ui/ClearButton'

interface FilterFieldWrapperProps {
  label: string
  hasValue: boolean
  onClear: () => void
  clearAriaLabel: string
  children: ReactNode
}

/**
 * 필터 필드의 공통 레이아웃을 제공하는 래퍼 컴포넌트
 * 라벨과 Clear 버튼을 포함한 일관된 구조를 제공합니다.
 */
export default function FilterFieldWrapper({
  label,
  hasValue,
  onClear,
  clearAriaLabel,
  children,
}: FilterFieldWrapperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow-sm md:text-base">{label}</label>
        {hasValue && <ClearButton onClick={onClear} ariaLabel={clearAriaLabel} />}
      </div>
      <div className="mt-1">{children}</div>
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

