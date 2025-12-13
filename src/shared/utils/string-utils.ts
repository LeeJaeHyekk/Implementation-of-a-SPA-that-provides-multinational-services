/**
 * 문자열 처리 공통 유틸리티
 * 중복되는 문자열 처리 로직 통합
 */

/**
 * 안전한 trim 처리
 */
export function safeTrim(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') {
    return ''
  }
  try {
    return value.trim()
  } catch {
    return String(value)
  }
}

/**
 * 안전한 문자열 변환
 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  try {
    return String(value)
  } catch {
    return ''
  }
}

/**
 * 안전한 toLowerCase
 */
export function safeToLowerCase(value: string): string {
  try {
    return value.toLowerCase()
  } catch {
    return value
  }
}

/**
 * 안전한 replace
 */
export function safeReplace(value: string, pattern: RegExp | string, replacement: string): string {
  try {
    return value.replace(pattern, replacement)
  } catch {
    return value
  }
}

