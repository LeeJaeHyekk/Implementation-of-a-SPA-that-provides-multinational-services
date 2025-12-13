/**
 * 공통 에러 처리 유틸리티
 * 반복되는 에러 처리 패턴을 모듈화
 */

import { handleSearchError, logSearchError } from '@/features/search/lib'

/**
 * 안전한 함수 실행 래퍼
 * 에러 발생 시 안전한 기본값 반환
 */
export function safeExecute<T>(
  fn: () => T,
  fallback: T,
  context?: Record<string, unknown>,
): T {
  try {
    return fn()
  } catch (error) {
    const searchError = handleSearchError(error, context)
    logSearchError(searchError)
    return fallback
  }
}

/**
 * 비동기 안전 함수 실행 래퍼
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: Record<string, unknown>,
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    const searchError = handleSearchError(error, context)
    logSearchError(searchError)
    return fallback
  }
}

/**
 * 배열 안전 필터링
 * 각 항목 처리 중 에러 발생 시 해당 항목 제외
 */
export function safeFilter<T>(
  items: T[],
  predicate: (item: T) => boolean,
  context?: Record<string, unknown>,
): T[] {
  const result: T[] = []
  for (const item of items) {
    try {
      if (predicate(item)) {
        result.push(item)
      }
    } catch (error) {
      const searchError = handleSearchError(error, { ...context, item })
      logSearchError(searchError)
      // 에러 발생 시 해당 항목 제외
      continue
    }
  }
  return result
}

/**
 * 입력값 검증 헬퍼
 */
export function validateInput<T>(
  value: T,
  validator: (value: T) => boolean,
  errorMessage: string,
): boolean {
  try {
    return validator(value)
  } catch {
    return false
  }
}

/**
 * 배열 타입 검증
 */
export function validateArray<T>(items: unknown): items is T[] {
  return Array.isArray(items)
}

/**
 * 객체 타입 검증
 */
export function validateObject<T>(obj: unknown): obj is T {
  return obj !== null && typeof obj === 'object'
}

