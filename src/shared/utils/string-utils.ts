/**
 * 문자열 처리 공통 유틸리티
 * 중복되는 문자열 처리 로직 통합
 */

/**
 * 안전한 trim 처리
 */
export function safeTrim(value?: string | null): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value !== 'string') {
    return ''
  }
  try {
    return value.trim()
  } catch {
    return value
  }
}

/**
 * 값을 안전하게 문자열로 변환
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
 * 안전한 toLowerCase 처리
 */
export function safeToLowerCase(value: string): string {
  try {
    return value.toLowerCase()
  } catch {
    return value
  }
}

/**
 * 안전한 replace 처리
 */
export function safeReplace(value: string, pattern: string | RegExp, replacement: string): string {
  try {
    return value.replace(pattern, replacement)
  } catch {
    return value
  }
}

/**
 * 문자열 배열을 쉼표로 구분하여 반환
 * 빈 배열이거나 null인 경우 '-' 반환
 */
export function joinArrayOrDash(values: string[] | null | undefined): string {
  if (!values || values.length === 0) return '-'
  return values.join(', ')
}
