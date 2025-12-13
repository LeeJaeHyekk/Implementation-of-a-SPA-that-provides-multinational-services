'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import { useCountryStore } from '@/features/country-switcher/model/store'
import {
  createKoreanSanitizer,
  createEnglishSanitizer,
  createMultiLanguageSanitizer,
  validateKeyword,
  handleSearchError,
  logSearchError,
} from '@/features/search/lib'
import { useSearchStore } from '@/features/search/model/store'
import { useHasActiveFilters } from '@/features/search/model/selectors'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import FilterSection from './FilterSection'

// 검증 설정
const VALIDATION_CONFIG = {
  minLength: 1,
  maxLength: 100,
  maxRepeatedCharacters: 3,
}

export default function SearchBarWithFilters() {
  const country = useCountryStore((state) => state.country)
  const keyword = useSearchStore((state) => state.keyword)
  const setKeyword = useSearchStore((state) => state.setKeyword)
  const setHasSearched = useSearchStore((state) => state.setHasSearched)
  const hasActiveFilters = useHasActiveFilters()
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [rawInput, setRawInput] = useState(keyword ?? '')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // 국가별로 적절한 정제기 선택
  const sanitizer = useMemo(
    () =>
      country === 'KR'
        ? createKoreanSanitizer({ validation: VALIDATION_CONFIG })
        : country === 'US'
          ? createEnglishSanitizer({ validation: VALIDATION_CONFIG })
          : createMultiLanguageSanitizer({ validation: VALIDATION_CONFIG }),
    [country],
  )

  // 검색 실행
  const handleSearch = useCallback(
    (inputValue: string) => {
      setIsProcessing(true)
      setErrorMessage(null)

      try {
        const trimmedInput = inputValue.trim()
        const hasKeyword = trimmedInput.length > 0

        // 필터가 없으면 검색어 필수, 필터가 있으면 검색어 선택적
        if (!hasActiveFilters && !hasKeyword) {
          setErrorMessage('검색어를 입력해 주세요')
          setIsProcessing(false)
          return
        }

        // 검색어가 입력된 경우에만 검증 및 정제 수행
        if (hasKeyword) {
          // 검증 수행
          const validation = validateKeyword(trimmedInput, VALIDATION_CONFIG)
          if (!validation.isValid) {
            setErrorMessage(validation.errorMessage ?? '유효하지 않은 검색어입니다.')
            setIsProcessing(false)
            return
          }

          // 정제 수행
          const sanitized = sanitizer.sanitize(trimmedInput)
          if (!sanitized) {
            setErrorMessage('검색어에 허용되지 않는 문자가 포함되어 있습니다.')
            setIsProcessing(false)
            return
          }

          // 검색어 설정
          setKeyword(sanitized)
        } else {
          // 검색어가 없으면 빈 문자열로 설정
          setKeyword('')
        }

        // 검색어가 입력되었을 때만 hasSearched를 true로 설정 (위치 고정을 위해)
        if (hasKeyword) {
          setHasSearched(true)
        }

        setErrorMessage(null)

        // 검색 실행 후 결과 영역으로 스크롤
        setTimeout(() => {
          const resultsElement = document.getElementById('search-results')
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      } catch (error) {
        const searchError = handleSearchError(error, {
          inputValue,
          function: 'handleSearch',
        })
        logSearchError(searchError)
        setErrorMessage('검색어 처리 중 예상치 못한 오류가 발생했습니다.')
      } finally {
        setIsProcessing(false)
      }
    },
    [sanitizer, setKeyword, setHasSearched, hasActiveFilters],
  )

  // 폼 제출 핸들러
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleSearch(rawInput ?? '')
  }

  // 입력값 변경 핸들러 (검증만 수행, 검색은 실행하지 않음)
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const inputValue = event.target.value
    setRawInput(inputValue)
    setErrorMessage(null)
  }

  // keyword가 외부에서 변경된 경우 rawInput 동기화
  useEffect(() => {
    if (keyword !== rawInput) {
      setRawInput(keyword ?? '')
      setErrorMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  // 필터 변경 시 자동 적용 (debounce 적용)
  useEffect(() => {
    // 필터가 활성화되어 있고, 검색 결과가 표시되어야 하는 경우
    if (hasActiveFilters) {
      // 필터 변경 후 약간의 지연을 두고 스크롤 (사용자 입력 완료 대기)
      const timer = setTimeout(() => {
        const resultsElement = document.getElementById('search-results')
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)

      return () => {
        clearTimeout(timer)
      }
    }
    // 필터가 없을 때는 명시적으로 undefined 반환
    return undefined
  }, [hasActiveFilters])

  const hasSearched = useSearchStore((state) => state.hasSearched)

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`mx-auto flex flex-col gap-4 transition-all ${
          hasSearched ? 'max-w-6xl px-4 pt-6' : 'w-full max-w-4xl px-4'
        }`}
      >
        {/* 검색 영역 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* 검색 입력란 */}
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-200 drop-shadow-sm md:text-base">
              상표명 검색
            </label>
            <div className="relative mt-1">
              <input
                value={rawInput ?? ''}
                onChange={handleChange}
                className={`glass-input h-[42px] w-full rounded-lg px-3 pr-10 text-sm text-slate-100 md:px-4 md:text-base ${
                  errorMessage ? 'glass-input-error' : ''
                }`}
                placeholder="상품명 또는 영문명을 입력 (최소 1자, 최대 100자)"
                maxLength={VALIDATION_CONFIG.maxLength + 10}
              />
              {isProcessing && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 md:right-4">
                  <LoadingSpinner size="sm" color="indigo" />
                </div>
              )}
            </div>
            {errorMessage && (
              <p className="mt-1 text-xs font-medium text-red-300 drop-shadow-sm md:text-sm" role="alert">
                {errorMessage}
              </p>
            )}
          </div>

          {/* 필터 아이콘 버튼 */}
          <div className="md:w-auto">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`glass-button h-[42px] w-full rounded-lg px-4 text-sm font-medium transition md:w-auto md:px-6 ${
                isFilterOpen
                  ? 'glass-button-primary text-indigo-200'
                  : 'text-slate-200 hover:text-indigo-200'
              }`}
              aria-label="필터 열기/닫기"
              aria-expanded={isFilterOpen}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="hidden sm:inline">필터</span>
              </span>
            </button>
          </div>

          {/* 검색 버튼 */}
          <div className="md:w-auto">
            <button
              type="submit"
              disabled={isProcessing}
              className="glass-button glass-button-primary h-[42px] w-full rounded-lg px-6 text-sm font-medium text-indigo-200 transition disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:transform-none md:w-auto md:px-8 md:text-base"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" color="indigo" />
                  <span className="hidden sm:inline">검색 중...</span>
                  <span className="sm:hidden">검색 중</span>
                </span>
              ) : (
                '검색'
              )}
            </button>
          </div>
        </div>

        {/* 필터 섹션 */}
        <FilterSection isOpen={isFilterOpen} />
      </div>
    </form>
  )
}

