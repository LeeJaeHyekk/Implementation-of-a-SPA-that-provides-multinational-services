/**
 * 상표 데이터 정규화 공통 유틸리티
 * parseKR, parseUS에서 중복되는 정규화 로직 통합
 */

/**
 * 배열을 안전하게 정규화
 * null/undefined를 빈 배열로, null 항목을 필터링
 */
export function normalizeList(value?: Array<string | null> | null): string[] {
  if (!value || !Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

/**
 * 문자열을 안전하게 정규화
 * null/undefined를 null로, 빈 문자열을 null로
 */
export function normalizeString(value?: string | null): string | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * 필수 문자열을 안전하게 정규화
 * null/undefined/빈 문자열을 '미상'으로
 */
export function normalizeRequiredString(value?: string | null): string {
  if (value === null || value === undefined) return '미상'
  if (typeof value !== 'string') return '미상'
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : '미상'
}

