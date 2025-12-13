'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { useCountryStore } from '@/features/country-switcher/model/store'
import {
  createKoreanSanitizer,
  createEnglishSanitizer,
  createMultiLanguageSanitizer,
  validateKeyword,
  handleSearchError,
  logSearchError,
} from '../lib'
import { useSearchStore } from '../model/store'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

// 검증 설정
const VALIDATION_CONFIG = {
  minLength: 1,
  maxLength: 100,
  maxRepeatedCharacters: 3,
}

// Debounce 지연 시간 (ms)
const DEBOUNCE_DELAY = 300

export default function SearchBar() {
  const country = useCountryStore((state) => state.country)
  const keyword = useSearchStore((state) => state.keyword)
  const setKeyword = useSearchStore((state) => state.setKeyword)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [rawInput, setRawInput] = useState(keyword)
  const [isProcessing, setIsProcessing] = useState(false)
  const debounceTimerRef = useRef<number | ReturnType<typeof globalThis.setTimeout> | null>(null)

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

  // 검색어 정제 및 검증
  const sanitizeAndValidate = useCallback(
    (inputValue: string) => {
      setIsProcessing(true)
      try {
        // 입력값 검증
        if (inputValue === null || inputValue === undefined) {
          setErrorMessage(null)
          setKeyword('')
          return
        }

        if (typeof inputValue !== 'string') {
          const error = handleSearchError(
            new Error('입력값이 문자열이 아닙니다.'),
            { inputValue, type: typeof inputValue },
          )
          logSearchError(error)
          setErrorMessage('유효하지 않은 입력입니다.')
          setKeyword('')
          return
        }

        // 빈 입력은 허용 (검색 초기화)
        try {
          if (inputValue.trim().length === 0) {
            setErrorMessage(null)
            setKeyword('')
            return
          }
        } catch (error) {
          const searchError = handleSearchError(error, { inputValue, step: 'trim_check' })
          logSearchError(searchError)
          // trim 실패 시 빈 문자열로 처리
          setErrorMessage(null)
          setKeyword('')
          return
        }

        // 검증 수행 (에러 처리)
        let validation
        try {
          validation = validateKeyword(inputValue, VALIDATION_CONFIG)
        } catch (error) {
          const searchError = handleSearchError(error, { inputValue, step: 'validation' })
          logSearchError(searchError)
          setErrorMessage('검색어 검증 중 오류가 발생했습니다.')
          setKeyword('')
          return
        }

        if (!validation.isValid) {
          setErrorMessage(validation.errorMessage ?? '유효하지 않은 검색어입니다.')
          setKeyword('')
          return
        }

        // 정제 수행 (에러 처리)
        let sanitized: string | null
        try {
          sanitized = sanitizer.sanitize(inputValue)
        } catch (error) {
          const searchError = handleSearchError(error, { inputValue, step: 'sanitization' })
          logSearchError(searchError)
          setErrorMessage('검색어 정제 중 오류가 발생했습니다.')
          setKeyword('')
          return
        }

        if (!sanitized) {
          setErrorMessage('검색어에 허용되지 않는 문자가 포함되어 있습니다.')
          setKeyword('')
          return
        }

        // 성공
        setErrorMessage(null)
        setKeyword(sanitized)
      } catch (error) {
        const searchError = handleSearchError(error, {
          inputValue,
          function: 'sanitizeAndValidate',
        })
        logSearchError(searchError)
        setErrorMessage('검색어 처리 중 예상치 못한 오류가 발생했습니다.')
        setKeyword('')
      } finally {
        setIsProcessing(false)
      }
    },
    [sanitizer, setKeyword],
  )

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    try {
      // 이벤트 객체 검증
      if (!event || !event.target) {
        const error = handleSearchError(new Error('유효하지 않은 이벤트 객체입니다.'), { event })
        logSearchError(error)
        return
      }

      const inputValue = event.target.value

      // 입력값 타입 검증
      if (typeof inputValue !== 'string') {
        const error = handleSearchError(
          new Error('입력값이 문자열이 아닙니다.'),
          { inputValue, type: typeof inputValue },
        )
        logSearchError(error)
        return
      }

      setRawInput(inputValue)

      // 기존 타이머 취소 (에러 처리)
      try {
        if (debounceTimerRef.current) {
          if (typeof globalThis !== 'undefined' && globalThis.clearTimeout) {
            globalThis.clearTimeout(debounceTimerRef.current)
          }
          debounceTimerRef.current = null
        }
      } catch (error) {
        const searchError = handleSearchError(error, { step: 'clear_timeout' })
        logSearchError(searchError)
        // 타이머 취소 실패해도 계속 진행
      }

      // Debounce 적용 (에러 처리)
      try {
        const setTimeoutFn =
          typeof globalThis !== 'undefined' && globalThis.setTimeout
            ? globalThis.setTimeout
            : typeof setTimeout !== 'undefined'
              ? setTimeout
              : (fn: () => void) => {
                  fn()
                  return 0
                }
        debounceTimerRef.current = setTimeoutFn(() => {
          try {
            sanitizeAndValidate(inputValue)
          } catch (error) {
            const searchError = handleSearchError(error, {
              inputValue,
              step: 'debounced_sanitize',
            })
            logSearchError(searchError)
            setErrorMessage('검색어 처리 중 오류가 발생했습니다.')
          }
        }, DEBOUNCE_DELAY)
      } catch (error) {
        const searchError = handleSearchError(error, { step: 'set_timeout' })
        logSearchError(searchError)
        // 타이머 설정 실패 시 즉시 실행
        sanitizeAndValidate(inputValue)
      }
    } catch (error) {
      const searchError = handleSearchError(error, { function: 'handleChange' })
      logSearchError(searchError)
      setErrorMessage('입력 처리 중 예상치 못한 오류가 발생했습니다.')
    }
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        if (typeof globalThis !== 'undefined' && globalThis.clearTimeout) {
          globalThis.clearTimeout(debounceTimerRef.current)
        }
      }
    }
  }, [])

  // keyword가 외부에서 변경된 경우 rawInput 동기화
  useEffect(() => {
    if (keyword !== rawInput) {
      setRawInput(keyword)
      setErrorMessage(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword])

  return (
    <div className="w-full">
      <label className="text-sm text-slate-300">상표명 검색</label>
      <div className="relative">
        <input
          value={rawInput}
          onChange={handleChange}
          className={`mt-1 w-full rounded-md border bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition-colors ${
            errorMessage
              ? 'border-red-500 focus:border-red-400'
              : 'border-slate-700 focus:border-indigo-400'
          }`}
          placeholder="상품명 또는 영문명을 입력 (최소 1자, 최대 100자)"
          maxLength={VALIDATION_CONFIG.maxLength + 10} // 약간의 여유를 두어 사용자가 입력할 수 있게 함
        />
        {isProcessing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <LoadingSpinner size="sm" color="indigo" />
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
