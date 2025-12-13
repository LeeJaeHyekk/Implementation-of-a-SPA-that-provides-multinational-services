'use client'

import { type ChangeEvent, type KeyboardEvent } from 'react'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import { INPUT_BASE_CLASSES } from '@/features/search/lib/constants'
import { SEARCH_CONSTANTS } from '@/shared/config/constants'

interface SearchInputProps {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  errorMessage?: string | null
  isProcessing?: boolean
  label?: string
  placeholder?: string
  maxLength?: number
  ariaLabel?: string
  className?: string
  inputClassName?: string
}

export default function SearchInput({
  value,
  onChange,
  onKeyDown,
  errorMessage,
  isProcessing = false,
  label = '상표명 검색',
  placeholder = '상품명 또는 영문명을 입력 (최소 1자, 최대 100자)',
  maxLength = SEARCH_CONSTANTS.VALIDATION_CONFIG.maxLength + 10,
  ariaLabel = '상표명 검색 입력',
  className = '',
  inputClassName = '',
}: SearchInputProps) {
  return (
    <div className={`w-full ${className}`}>
      <label className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow-sm md:text-base">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={`${INPUT_BASE_CLASSES} pr-8 sm:pr-10 ${inputClassName} ${
            errorMessage ? 'glass-input-error' : ''
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-label={ariaLabel}
        />
        {isProcessing && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-3 md:right-4">
            <LoadingSpinner size="sm" color="indigo" />
          </div>
        )}
      </div>
      <ErrorMessage message={errorMessage ?? null} />
    </div>
  )
}

