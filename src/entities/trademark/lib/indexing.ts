/**
 * 상표 데이터 인덱싱 유틸리티
 * 대량 데이터 검색 성능 향상을 위한 인덱스 구조
 */

import type { NormalizedTrademark, RegisterStatus } from '../model/types'
import type { PreprocessedTrademark } from './preprocessing'
import { isPreprocessedTrademark } from './type-guards'

/**
 * 검색 인덱스 구조
 */
export interface TrademarkIndex {
  /**
   * 키워드별 상표 ID 맵 (빠른 검색용)
   */
  keywordIndex: Map<string, Set<string>>
  /**
   * 출원번호별 상표 ID 맵
   */
  applicationNumberIndex: Map<string, string>
  /**
   * 상태별 상표 ID 맵
   */
  statusIndex: Map<RegisterStatus, Set<string>>
  /**
   * 날짜 범위별 인덱스 (년도별)
   */
  dateIndex: Map<number, Set<string>>
  /**
   * 전체 상표 ID 세트
   */
  allIds: Set<string>
}

/**
 * 상표 데이터로부터 인덱스 생성
 */
export function buildTrademarkIndex(trademarks: (NormalizedTrademark | PreprocessedTrademark)[]): TrademarkIndex {
  const keywordIndex = new Map<string, Set<string>>()
  const applicationNumberIndex = new Map<string, string>()
  const statusIndex = new Map<RegisterStatus, Set<string>>()
  const dateIndex = new Map<number, Set<string>>()
  const allIds = new Set<string>()

  for (const trademark of trademarks) {
    const id = trademark.id
    allIds.add(id)

    // 키워드 인덱스 (전처리된 데이터 사용)
    if (isPreprocessedTrademark(trademark) && trademark._searchIndex) {
      for (const keyword of trademark._searchIndex) {
        if (!keywordIndex.has(keyword)) {
          keywordIndex.set(keyword, new Set())
        }
        keywordIndex.get(keyword)!.add(id)
      }
    } else {
      // 전처리되지 않은 경우 기본 인덱싱
      if (trademark.productName) {
        const normalized = trademark.productName.toLowerCase().trim()
        if (!keywordIndex.has(normalized)) {
          keywordIndex.set(normalized, new Set())
        }
        keywordIndex.get(normalized)!.add(id)
      }
    }

    // 출원번호 인덱스
    if (trademark.applicationNumber) {
      applicationNumberIndex.set(trademark.applicationNumber.trim(), id)
    }

    // 상태 인덱스
    if (!statusIndex.has(trademark.registerStatus)) {
      statusIndex.set(trademark.registerStatus, new Set())
    }
    statusIndex.get(trademark.registerStatus)!.add(id)

    // 날짜 인덱스 (년도별)
    if (isPreprocessedTrademark(trademark) && trademark._applicationTimestamp) {
      const year = new Date(trademark._applicationTimestamp).getFullYear()
      if (!dateIndex.has(year)) {
        dateIndex.set(year, new Set())
      }
      dateIndex.get(year)!.add(id)
    } else if (trademark.applicationDate) {
      // 전처리되지 않은 경우 날짜 파싱
      try {
        const timestamp = Date.parse(trademark.applicationDate)
        if (!Number.isNaN(timestamp)) {
          const year = new Date(timestamp).getFullYear()
          if (!dateIndex.has(year)) {
            dateIndex.set(year, new Set())
          }
          dateIndex.get(year)!.add(id)
        }
      } catch {
        // 날짜 파싱 실패 시 무시
      }
    }
  }

  return {
    keywordIndex,
    applicationNumberIndex,
    statusIndex,
    dateIndex,
    allIds,
  }
}

/**
 * 인덱스를 사용한 빠른 키워드 검색
 */
export function searchByKeywordIndex(
  index: TrademarkIndex,
  keyword: string,
  trademarks: Map<string, NormalizedTrademark | PreprocessedTrademark>,
): (NormalizedTrademark | PreprocessedTrademark)[] {
  if (!keyword || keyword.trim().length === 0) {
    return Array.from(trademarks.values())
  }

  const normalizedKeyword = keyword.toLowerCase().trim()
  const resultIds = new Set<string>()

  // 정확 일치 검색
  if (index.keywordIndex.has(normalizedKeyword)) {
    const ids = index.keywordIndex.get(normalizedKeyword)!
    ids.forEach((id) => resultIds.add(id))
  }

  // 부분 일치 검색 (인덱스의 모든 키워드에서 검색)
  for (const [indexKeyword, ids] of index.keywordIndex.entries()) {
    if (indexKeyword.includes(normalizedKeyword) || normalizedKeyword.includes(indexKeyword)) {
      ids.forEach((id) => resultIds.add(id))
    }
  }

  // ID로 상표 데이터 조회
  const results: (NormalizedTrademark | PreprocessedTrademark)[] = []
  for (const id of resultIds) {
    const trademark = trademarks.get(id)
    if (trademark) {
      results.push(trademark)
    }
  }

  return results
}

/**
 * 인덱스를 사용한 빠른 출원번호 검색
 */
export function searchByApplicationNumberIndex(
  index: TrademarkIndex,
  applicationNumber: string,
  trademarks: Map<string, NormalizedTrademark | PreprocessedTrademark>,
): (NormalizedTrademark | PreprocessedTrademark)[] {
  if (!applicationNumber || applicationNumber.trim().length === 0) {
    return Array.from(trademarks.values())
  }

  const normalized = applicationNumber.trim()
  const id = index.applicationNumberIndex.get(normalized)
  if (!id) {
    return []
  }

  const trademark = trademarks.get(id)
  return trademark ? [trademark] : []
}

/**
 * 인덱스를 사용한 빠른 상태 필터링
 */
export function filterByStatusIndex(
  index: TrademarkIndex,
  status: RegisterStatus | 'all',
  trademarks: Map<string, NormalizedTrademark | PreprocessedTrademark>,
): (NormalizedTrademark | PreprocessedTrademark)[] {
  if (!status || status === 'all') {
    return Array.from(trademarks.values())
  }

  const ids = index.statusIndex.get(status)
  if (!ids) {
    return []
  }

  const results: (NormalizedTrademark | PreprocessedTrademark)[] = []
  for (const id of ids) {
    const trademark = trademarks.get(id)
    if (trademark) {
      results.push(trademark)
    }
  }

  return results
}

