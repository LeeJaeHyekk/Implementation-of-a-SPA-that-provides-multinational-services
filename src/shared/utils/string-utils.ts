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
    // value는 이미 string 타입이므로 안전하게 변환
    return typeof value === 'string' ? value : ''
  }
}

/**
 * 안전한 문자열 변환
 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (typeof value === 'symbol') {
    return value.toString()
  }
  if (typeof value === 'function') {
    return value.toString()
  }
  try {
    // 객체나 배열의 경우 JSON.stringify 시도
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    // 위의 모든 타입을 체크했으므로 여기 도달할 수 없지만 타입 안정성을 위해
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
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

