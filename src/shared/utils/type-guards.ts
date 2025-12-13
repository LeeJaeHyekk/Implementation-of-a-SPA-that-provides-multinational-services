/**
 * 공통 타입 가드 유틸리티
 * 타입 단언 대신 타입 가드를 사용하여 타입 안전성 확보
 */

/**
 * 문자열 또는 null인지 확인
 */
export function isStringOrNull(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

/**
 * 문자열 배열인지 확인
 */
export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/**
 * Record<string, unknown>인지 확인
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

