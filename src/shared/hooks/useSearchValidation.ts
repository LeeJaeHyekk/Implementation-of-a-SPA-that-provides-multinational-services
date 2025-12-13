/**
 * 검색어 검증 및 정제 로직을 모듈화한 커스텀 훅
 * SearchBar와 SearchBarWithFilters에서 중복되던 로직을 통합
 */

import { useCallback, useState } from 'react'
import { validateKeyword, handleSearchError, logSearchError } from '@/features/search/lib'
import { useSanitizer } from './useSanitizer'
import { SEARCH_CONSTANTS } from '@/shared/config/constants'

interface UseSearchValidationOptions {
  onSuccess?: (sanitized: string) => void
  onError?: (errorMessage: string) => void
  requireKeyword?: boolean
}

interface UseSearchValidationReturn {
  isProcessing: boolean
  errorMessage: string | null
  validateAndSanitize: (inputValue: string) => Promise<string | null>
  clearError: () => void
}

export function useSearchValidation(
  options: UseSearchValidationOptions = {},
): UseSearchValidationReturn {
  const { onSuccess, onError, requireKeyword = false } = options
  const sanitizer = useSanitizer()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateAndSanitize = useCallback(
    async (inputValue: string): Promise<string | null> => {
      setIsProcessing(true)
      setErrorMessage(null)

      try {
        // 입력값 검증
        if (inputValue === null || inputValue === undefined) {
          const message = requireKeyword ? '검색어를 입력해 주세요' : null
          setErrorMessage(message)
          onError?.(message || '')
          setIsProcessing(false)
          return null
        }

        if (typeof inputValue !== 'string') {
          const error = handleSearchError(
            new Error('입력값이 문자열이 아닙니다.'),
            { inputValue, type: typeof inputValue },
          )
          logSearchError(error)
          const message = '유효하지 않은 입력입니다.'
          setErrorMessage(message)
          onError?.(message)
          setIsProcessing(false)
          return null
        }

        // trim 처리
        let trimmed: string
        try {
          trimmed = inputValue.trim()
        } catch (error) {
          const searchError = handleSearchError(error, { inputValue, step: 'trim_check' })
          logSearchError(searchError)
          const message = requireKeyword ? '검색어를 입력해 주세요' : null
          setErrorMessage(message)
          onError?.(message || '')
          setIsProcessing(false)
          return null
        }

        const hasKeyword = trimmed.length > 0

        // 필터가 없으면 검색어 필수, 필터가 있으면 검색어 선택적
        if (requireKeyword && !hasKeyword) {
          const message = '검색어를 입력해 주세요'
          setErrorMessage(message)
          onError?.(message)
          setIsProcessing(false)
          return null
        }

        // 검색어가 입력된 경우에만 검증 및 정제 수행
        if (hasKeyword) {
          // 검증 수행
          let validation
          try {
            validation = validateKeyword(trimmed, SEARCH_CONSTANTS.VALIDATION_CONFIG)
          } catch (error) {
            const searchError = handleSearchError(error, {
              inputValue: trimmed,
              step: 'validation',
            })
            logSearchError(searchError)
            const message = '검색어 검증 중 오류가 발생했습니다.'
            setErrorMessage(message)
            onError?.(message)
            setIsProcessing(false)
            return null
          }

          if (!validation.isValid) {
            const message = validation.errorMessage ?? '유효하지 않은 검색어입니다.'
            setErrorMessage(message)
            onError?.(message)
            setIsProcessing(false)
            return null
          }

          // 정제 수행
          let sanitized: string | null
          try {
            sanitized = sanitizer.sanitize(trimmed)
          } catch (error) {
            const searchError = handleSearchError(error, {
              inputValue: trimmed,
              step: 'sanitization',
            })
            logSearchError(searchError)
            const message = '검색어 정제 중 오류가 발생했습니다.'
            setErrorMessage(message)
            onError?.(message)
            setIsProcessing(false)
            return null
          }

          if (!sanitized) {
            const message = '검색어에 허용되지 않는 문자가 포함되어 있습니다.'
            setErrorMessage(message)
            onError?.(message)
            setIsProcessing(false)
            return null
          }

          // 성공
          setErrorMessage(null)
          onSuccess?.(sanitized)
          setIsProcessing(false)
          return sanitized
        } else {
          // 검색어가 없으면 빈 문자열로 처리
          setErrorMessage(null)
          onSuccess?.('')
          setIsProcessing(false)
          return ''
        }
      } catch (error) {
        const searchError = handleSearchError(error, {
          inputValue,
          function: 'validateAndSanitize',
        })
        logSearchError(searchError)
        const message = '검색어 처리 중 예상치 못한 오류가 발생했습니다.'
        setErrorMessage(message)
        onError?.(message)
        setIsProcessing(false)
        return null
      }
    },
    [sanitizer, onSuccess, onError, requireKeyword],
  )

  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  return {
    isProcessing,
    errorMessage,
    validateAndSanitize,
    clearError,
  }
}

