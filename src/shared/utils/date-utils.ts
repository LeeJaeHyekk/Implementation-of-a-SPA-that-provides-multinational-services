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

/**
 * 날짜 문자열을 yyyy.mm.dd 형식으로 포맷
 * @param value - 날짜 문자열 (YYYYMMDD 또는 YYYY-MM-DD 형식)
 * @returns 포맷된 날짜 문자열 (yyyy.mm.dd) 또는 원본 값
 */
export function formatDateToDot(value?: string | null): string {
  if (!value) return '-'
  
  try {
    // 하이픈 제거
    const compact = value.replace(/-/g, '').trim()
    
    // YYYYMMDD 형식인지 확인
    if (/^\d{8}$/.test(compact)) {
      const year = compact.slice(0, 4)
      const month = compact.slice(4, 6)
      const day = compact.slice(6, 8)
      return `${year}.${month}.${day}`
    }
    
    // 이미 포맷된 형식인 경우 그대로 반환
    return value
  } catch {
    return value
  }
}

/**
 * 날짜 배열을 yyyy.mm.dd 형식으로 포맷하여 쉼표로 구분
 */
export function formatDateArray(values: string[]): string {
  if (!values || values.length === 0) return '-'
  return values.map(formatDateToDot).join(', ')
}

