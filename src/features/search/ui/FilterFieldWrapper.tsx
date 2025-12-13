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
        <label className="text-sm font-medium text-slate-200 drop-shadow-sm">{label}</label>
        {hasValue && <ClearButton onClick={onClear} ariaLabel={clearAriaLabel} />}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  )
}

