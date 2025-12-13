/**
 * 날짜 처리 공통 유틸리티
 * 중복되는 날짜 파싱 로직 통합
 */

/**
 * 날짜 문자열을 타임스탬프로 변환
 */
export function parseDateToTimestamp(value?: string | null): number | null {
  if (!value) return null

  try {
    // YYYYMMDD 형식 처리
    const compact = value.replace(/-/g, '').trim()
    if (/^\d{8}$/.test(compact)) {
      const normalized = `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`
      const timestamp = Date.parse(normalized)
      return Number.isNaN(timestamp) ? null : timestamp
    }

    // 일반 날짜 형식 처리
    const timestamp = Date.parse(value)
    return Number.isNaN(timestamp) ? null : timestamp
  } catch {
    return null
  }
}

/**
 * 날짜 범위 체크
 */
export function isDateInRange(
  value: number | null,
  from?: string | null,
  to?: string | null,
): boolean {
  if (!from && !to) return true
  if (!value) return false

  const fromTs = from ? parseDateToTimestamp(from) ?? Number.NEGATIVE_INFINITY : Number.NEGATIVE_INFINITY
  const toTs = to ? parseDateToTimestamp(to) ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY

  return value >= fromTs && value <= toTs
}

/**
 * 년도 추출
 */
export function extractYear(timestamp: number | null): number | null {
  if (!timestamp) return null
  try {
    return new Date(timestamp).getFullYear()
  } catch {
    return null
  }
}

