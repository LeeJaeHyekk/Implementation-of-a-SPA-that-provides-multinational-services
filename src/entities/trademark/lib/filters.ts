import { handleSearchError, logSearchError } from '@/features/search/lib'
import { validateArray, validateObject, safeFilter } from '@/shared/utils/error-handler'
import { matchKeyword, matchApplicationNumber, matchStatus, matchDateRange } from './matchers'

import { NormalizedTrademark, RegisterStatus, TrademarkFilters } from '../model/types'

// 매칭 로직은 matchers 모듈로 이동됨

/**
 * 키워드 필터링 (모듈화)
 */
export function filterByKeyword(items: NormalizedTrademark[], keyword?: string): NormalizedTrademark[] {
  if (!validateArray<NormalizedTrademark>(items)) {
    const error = handleSearchError(
      new Error('items는 배열이어야 합니다.'),
      { items, keyword, type: typeof items },
    )
    logSearchError(error)
    return []
  }

  if (!keyword) return items

  const result = safeFilter(items, (item) => matchKeyword(item, keyword), { keyword, function: 'filterByKeyword' })

  return result
}

/**
 * 출원번호 필터링 (모듈화)
 */
export function filterByApplicationNumber(
  items: NormalizedTrademark[],
  applicationNumber?: string,
): NormalizedTrademark[] {
  if (!validateArray<NormalizedTrademark>(items)) {
    const error = handleSearchError(
      new Error('items는 배열이어야 합니다.'),
      { items, applicationNumber, type: typeof items },
    )
    logSearchError(error)
    return []
  }

  if (!applicationNumber) return items

  const result = safeFilter(
    items,
    (item) => matchApplicationNumber(item, applicationNumber),
    { applicationNumber, function: 'filterByApplicationNumber' },
  )

  return result
}

/**
 * 상태 필터링 (모듈화)
 */
export function filterByStatus(
  items: NormalizedTrademark[],
  status?: RegisterStatus | 'all',
): NormalizedTrademark[] {
  if (!validateArray<NormalizedTrademark>(items)) {
    const error = handleSearchError(
      new Error('items는 배열이어야 합니다.'),
      { items, status, type: typeof items },
    )
    logSearchError(error)
    return []
  }

  if (!status || status === 'all') return items

  const result = safeFilter(items, (item) => matchStatus(item, status), { status, function: 'filterByStatus' })

  return result
}

/**
 * 날짜 범위 필터링 (모듈화)
 */
export function filterByDateRange(
  items: NormalizedTrademark[],
  dateRange?: TrademarkFilters['dateRange'],
): NormalizedTrademark[] {
  if (!validateArray<NormalizedTrademark>(items)) {
    const error = handleSearchError(
      new Error('items는 배열이어야 합니다.'),
      { items, dateRange, type: typeof items },
    )
    logSearchError(error)
    return []
  }

  if (!dateRange) return items

  if (!validateObject(dateRange)) {
    const error = handleSearchError(
      new Error('dateRange는 객체여야 합니다.'),
      { items, dateRange, type: typeof dateRange },
    )
    logSearchError(error)
    return items
  }

  const { from, to } = dateRange
  if (!from && !to) return items

  const result = safeFilter(
    items,
    (item) => matchDateRange(item, from, to),
    { dateRange, function: 'filterByDateRange' },
  )

  return result
}

/**
 * 필터링 파이프라인 (최적화된 순서)
 * 빠르게 걸러낼 수 있는 필터를 먼저 적용하여 성능 향상
 * 순서: 출원번호 (정확 일치) > 상태 (간단한 비교) > 키워드 (복잡한 검색) > 날짜 범위 (파싱 필요)
 */
export function filterTrademarks(
  items: NormalizedTrademark[],
  filters: TrademarkFilters,
): NormalizedTrademark[] {
  // 입력값 검증
  if (!validateArray<NormalizedTrademark>(items)) {
    const error = handleSearchError(
      new Error('items는 배열이어야 합니다.'),
      { items, filters, type: typeof items },
    )
    logSearchError(error)
    return []
  }

  if (!validateObject<TrademarkFilters>(filters)) {
    const error = handleSearchError(
      new Error('filters는 객체여야 합니다.'),
      { items, filters, type: typeof filters },
    )
    logSearchError(error)
    return items
  }

  // 필터링 파이프라인 (최적화된 순서)
  // 각 단계에서 에러 발생 시 이전 단계 결과 사용 (안전한 폴백)
  const pipeline = [
    () => filterByApplicationNumber(items, filters.applicationNumber),
    (prev: NormalizedTrademark[]) => filterByStatus(prev, filters.status),
    (prev: NormalizedTrademark[]) => filterByKeyword(prev, filters.keyword),
    (prev: NormalizedTrademark[]) => filterByDateRange(prev, filters.dateRange),
  ]

  let result = items
  for (let i = 0; i < pipeline.length; i++) {
    const step = pipeline[i]
    if (!step) continue
    try {
      result = step(result)
    } catch (error) {
      const searchError = handleSearchError(error, {
        items: result,
        filters,
        step: `filter_step_${i}`,
      })
      logSearchError(searchError)
      // 에러 발생 시 이전 결과 유지
    }
  }

  return result
}
