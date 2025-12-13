/**
 * 검색어 검증 구현
 */

import { createSearchError, handleSearchError, logSearchError } from '../errors'
import type { ValidationResult, ValidatorConfig } from './types'

/**
 * 기본 검증 설정
 */
const DEFAULT_CONFIG: Required<ValidatorConfig> = {
  minLength: 1,
  maxLength: 100,
  maxRepeatedCharacters: 3,
}

/**
 * 검색어 길이 검증
 */
function validateLength(input: string, min: number, max: number): ValidationResult | null {
  if (input.length < min) {
    return {
      isValid: false,
      errorCode: 'TOO_SHORT',
      errorMessage: `검색어는 최소 ${min}자 이상 입력해주세요.`,
    }
  }

  if (input.length > max) {
    return {
      isValid: false,
      errorCode: 'TOO_LONG',
      errorMessage: `검색어는 최대 ${max}자까지 입력 가능합니다.`,
    }
  }

  return null
}

/**
 * 연속된 동일 문자 검증
 */
function validateRepeatedCharacters(
  input: string,
  maxRepeated: number,
): ValidationResult | null {
  try {
    // 입력값 검증
    if (typeof input !== 'string') {
      throw createSearchError('VALIDATION_ERROR', '입력값이 문자열이 아닙니다.', null, {
        input,
        type: typeof input,
      })
    }

    if (typeof maxRepeated !== 'number' || maxRepeated < 0) {
      throw createSearchError('VALIDATION_ERROR', 'maxRepeated는 0 이상의 숫자여야 합니다.', null, {
        maxRepeated,
      })
    }

    // 정규식 생성 (에러 처리)
    let pattern: RegExp
    try {
      pattern = new RegExp(`(.)\\1{${maxRepeated},}`, 'g')
    } catch (error) {
      const searchError = handleSearchError(error, {
        input,
        maxRepeated,
        step: 'regex_creation',
      })
      logSearchError(searchError)
      // 정규식 생성 실패 시 검증 통과 (안전한 폴백)
      return null
    }

    // 정규식 테스트 (에러 처리)
    try {
      if (pattern.test(input)) {
        return {
          isValid: false,
          errorCode: 'REPEATED_CHARACTERS',
          errorMessage: '연속된 동일 문자는 허용되지 않습니다.',
        }
      }
    } catch (error) {
      const searchError = handleSearchError(error, {
        input,
        maxRepeated,
        step: 'regex_test',
      })
      logSearchError(searchError)
      // 정규식 테스트 실패 시 검증 통과 (안전한 폴백)
      return null
    }

    return null
  } catch (error) {
    const searchError = handleSearchError(error, {
      input,
      maxRepeated,
      function: 'validateRepeatedCharacters',
    })
    logSearchError(searchError)
    // 에러 발생 시 검증 통과 (안전한 폴백)
    return null
  }
}

/**
 * 검색어 검증 함수
 */
export function validateKeyword(input: string, config?: ValidatorConfig): ValidationResult {
  try {
    // 기본값 병합 (에러 처리)
    let finalConfig: Required<ValidatorConfig>
    try {
      finalConfig = {
        ...DEFAULT_CONFIG,
        ...config,
      }

      // 설정값 검증
      if (
        typeof finalConfig.minLength !== 'number' ||
        finalConfig.minLength < 0 ||
        typeof finalConfig.maxLength !== 'number' ||
        finalConfig.maxLength < finalConfig.minLength
      ) {
        throw createSearchError('VALIDATION_ERROR', '유효하지 않은 검증 설정입니다.', null, {
          config: finalConfig,
        })
      }
    } catch (error) {
      const searchError = handleSearchError(error, { input, config, step: 'config_merge' })
      logSearchError(searchError)
      // 설정 에러 시 기본 설정 사용
      finalConfig = DEFAULT_CONFIG
    }

    // null/undefined 체크
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        errorCode: 'INVALID_INPUT',
        errorMessage: '유효하지 않은 입력입니다.',
      }
    }

    // trim 처리 (에러 처리)
    let trimmed: string
    try {
      trimmed = input.trim()
    } catch (error) {
      const searchError = handleSearchError(error, { input, step: 'trim' })
      logSearchError(searchError)
      // trim 실패 시 원본 사용
      trimmed = input
    }

    // 빈 문자열 체크
    if (trimmed.length === 0) {
      return {
        isValid: false,
        errorCode: 'EMPTY_AFTER_SANITIZATION',
        errorMessage: '검색어를 입력해주세요.',
      }
    }

    // 길이 검증
    try {
      const lengthResult = validateLength(trimmed, finalConfig.minLength, finalConfig.maxLength)
      if (lengthResult) {
        return lengthResult
      }
    } catch (error) {
      const searchError = handleSearchError(error, {
        input: trimmed,
        config: finalConfig,
        step: 'length_validation',
      })
      logSearchError(searchError)
      // 길이 검증 실패 시 검증 통과 (안전한 폴백)
    }

    // 연속된 동일 문자 검증
    try {
      const repeatedResult = validateRepeatedCharacters(trimmed, finalConfig.maxRepeatedCharacters)
      if (repeatedResult) {
        return repeatedResult
      }
    } catch (error) {
      const searchError = handleSearchError(error, {
        input: trimmed,
        config: finalConfig,
        step: 'repeated_characters_validation',
      })
      logSearchError(searchError)
      // 연속 문자 검증 실패 시 검증 통과 (안전한 폴백)
    }

    return {
      isValid: true,
    }
  } catch (error) {
    const searchError = handleSearchError(error, { input, config, function: 'validateKeyword' })
    logSearchError(searchError)
    // 예상치 못한 에러 발생 시 검증 실패로 처리
    return {
      isValid: false,
      errorCode: 'INVALID_INPUT',
      errorMessage: '검색어 검증 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 정규화 후 빈 문자열인지 확인
 */
export function isEmptyAfterNormalization(normalized: string): boolean {
  return !normalized || normalized.trim().length === 0
}

