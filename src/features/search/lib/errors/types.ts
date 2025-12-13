/**
 * 검색 기능 에러 타입 정의
 */

export type SearchErrorCode =
  | 'VALIDATION_ERROR'
  | 'SANITIZATION_ERROR'
  | 'NORMALIZATION_ERROR'
  | 'MATCHING_ERROR'
  | 'FILTERING_ERROR'
  | 'INPUT_ERROR'
  | 'UNKNOWN_ERROR'

export interface SearchError {
  code: SearchErrorCode
  message: string
  originalError?: unknown
  context?: Record<string, unknown>
}

export class SearchErrorException extends Error {
  public readonly code: SearchErrorCode
  public readonly context?: Record<string, unknown>
  public readonly originalError?: unknown

  constructor(code: SearchErrorCode, message: string, originalError?: unknown, context?: Record<string, unknown>) {
    super(message)
    this.name = 'SearchErrorException'
    this.code = code
    this.originalError = originalError
    this.context = context

    // Error 객체의 스택 트레이스 유지
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SearchErrorException)
    }
  }

  toJSON(): SearchError {
    return {
      code: this.code,
      message: this.message,
      originalError: this.originalError,
      context: this.context,
    }
  }
}

/**
 * 안전한 에러 생성 헬퍼
 */
export function createSearchError(
  code: SearchErrorCode,
  message: string,
  originalError?: unknown,
  context?: Record<string, unknown>,
): SearchErrorException {
  return new SearchErrorException(code, message, originalError, context)
}

/**
 * 에러를 안전하게 처리하고 로깅
 */
export function handleSearchError(error: unknown, context?: Record<string, unknown>): SearchErrorException {
  if (error instanceof SearchErrorException) {
    return error
  }

  if (error instanceof Error) {
    return createSearchError('UNKNOWN_ERROR', error.message, error, context)
  }

  const errorMessage = typeof error === 'string' ? error : '알 수 없는 오류가 발생했습니다.'
  return createSearchError('UNKNOWN_ERROR', errorMessage, error, context)
}

/**
 * 에러 로깅 (개발 환경에서만)
 */
export function logSearchError(error: SearchErrorException): void {
  if (typeof globalThis !== 'undefined' && globalThis.console) {
    globalThis.console.error('[SearchError]', {
      code: error.code,
      message: error.message,
      context: error.context,
      originalError: error.originalError,
      stack: error.stack,
    })
  }
}

