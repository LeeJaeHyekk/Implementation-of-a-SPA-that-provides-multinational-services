/**
 * 최적화된 필터링 함수
 * 인덱스 기반 빠른 검색 및 청크 단위 처리
 */

import type { NormalizedTrademark, TrademarkFilters } from '../model/types'
import type { PreprocessedTrademark } from './preprocessing'
import { buildTrademarkIndex, filterByStatusIndex, searchByApplicationNumberIndex, searchByKeywordIndex } from './indexing'
import { measurePerformance } from '@/shared/utils/performance-monitor'
import { filterInChunks } from '@/shared/utils/chunk-processor'
import { matchKeyword, matchApplicationNumber, matchStatus, matchDateRange } from './matchers'

/**
 * 인덱스 기반 최적화된 필터링
 * 대량 데이터 처리 시 성능 향상
 */
export async function filterTrademarksOptimized(
  items: (NormalizedTrademark | PreprocessedTrademark)[],
  filters: TrademarkFilters,
  options?: {
    useIndex?: boolean
    chunkSize?: number
    onProgress?: (processed: number, total: number) => void
  },
): Promise<(NormalizedTrademark | PreprocessedTrademark)[]> {
  return measurePerformance('filterTrademarksOptimized', async () => {
    const { useIndex = true, chunkSize = 1000, onProgress } = options ?? {}

    // 입력값 검증
    if (!Array.isArray(items) || items.length === 0) {
      return []
    }

    if (!filters || typeof filters !== 'object') {
      return items
    }

    // 인덱스 기반 필터링 (대량 데이터에 효과적)
    if (useIndex && items.length > 1000) {
      return await filterWithIndex(items, filters, chunkSize, onProgress)
    }

    // 일반 필터링 (소량 데이터)
    return await filterWithoutIndex(items, filters, chunkSize, onProgress)
  }, items.length)
}

/**
 * 인덱스 기반 필터링
 */
async function filterWithIndex(
  items: (NormalizedTrademark | PreprocessedTrademark)[],
  filters: TrademarkFilters,
  chunkSize: number,
  onProgress?: (processed: number, total: number) => void,
): Promise<(NormalizedTrademark | PreprocessedTrademark)[]> {
  // 인덱스 생성
  const index = buildTrademarkIndex(items)
  const itemsMap = new Map(items.map((item) => [item.id, item]))

  let result: (NormalizedTrademark | PreprocessedTrademark)[] = Array.from(items)

  // 1. 출원번호 필터 (인덱스 사용)
  if (filters.applicationNumber) {
    result = searchByApplicationNumberIndex(index, filters.applicationNumber, itemsMap)
    if (result.length === 0) {
      return []
    }
  }

  // 2. 상태 필터 (인덱스 사용)
  if (filters.status && filters.status !== 'all') {
    result = filterByStatusIndex(index, filters.status, itemsMap)
    if (result.length === 0) {
      return []
    }
  }

  // 3. 키워드 필터 (인덱스 사용)
  if (filters.keyword) {
    result = searchByKeywordIndex(index, filters.keyword, itemsMap)
    if (result.length === 0) {
      return []
    }
  }

  // 4. 날짜 범위 필터 (청크 단위 처리)
  if (filters.dateRange?.from || filters.dateRange?.to) {
    result = await filterInChunks(
      result,
      (item) => matchDateRange(item, filters.dateRange?.from, filters.dateRange?.to),
      chunkSize,
      onProgress,
    )
  }

  return result
}

/**
 * 일반 필터링 (인덱스 없이)
 */
async function filterWithoutIndex(
  items: (NormalizedTrademark | PreprocessedTrademark)[],
  filters: TrademarkFilters,
  chunkSize: number,
  onProgress?: (processed: number, total: number) => void,
): Promise<(NormalizedTrademark | PreprocessedTrademark)[]> {
  // 청크 단위로 필터링하여 메인 스레드 블로킹 방지
  return await filterInChunks(
    items,
    (item) => {
      // 출원번호 필터
      if (filters.applicationNumber && !matchApplicationNumber(item, filters.applicationNumber)) {
        return false
      }

      // 상태 필터
      if (filters.status && !matchStatus(item, filters.status)) {
        return false
      }

      // 키워드 필터
      if (filters.keyword && !matchKeyword(item, filters.keyword)) {
        return false
      }

      // 날짜 범위 필터
      if (filters.dateRange?.from || filters.dateRange?.to) {
        if (!matchDateRange(item, filters.dateRange.from, filters.dateRange.to)) {
          return false
        }
      }

      return true
    },
    chunkSize,
    onProgress,
  )
}

