/**
 * 상표 데이터 전처리 유틸리티
 * 검색 성능 향상을 위한 데이터 전처리
 */

import { NormalizedTrademark } from '../model/types'
import { createMultiLanguageNormalizer } from '@/features/search/lib'

const normalizer = createMultiLanguageNormalizer()

/**
 * 검색에 최적화된 상표 데이터 인터페이스
 */
export interface PreprocessedTrademark extends NormalizedTrademark {
  /**
   * 정규화된 상품명 (검색용)
   */
  _normalizedProductName?: string
  /**
   * 정규화된 영문 상품명 (검색용)
   */
  _normalizedProductNameEng?: string
  /**
   * 검색어 인덱스 (빠른 검색을 위한 키워드 배열)
   */
  _searchIndex?: string[]
  /**
   * 날짜 타임스탬프 (빠른 날짜 비교용)
   */
  _applicationTimestamp?: number | null
}

/**
 * 상표 데이터를 검색에 최적화된 형태로 전처리
 */
export function preprocessTrademark(trademark: NormalizedTrademark): PreprocessedTrademark {
  const preprocessed: PreprocessedTrademark = {
    ...trademark,
  }

  // 상품명 정규화
  if (trademark.productName) {
    try {
      preprocessed._normalizedProductName = normalizer.normalize(trademark.productName)
    } catch {
      // 정규화 실패 시 원본 사용
      preprocessed._normalizedProductName = trademark.productName.toLowerCase()
    }
  }

  // 영문 상품명 정규화
  if (trademark.productNameEng) {
    try {
      preprocessed._normalizedProductNameEng = normalizer.normalize(trademark.productNameEng)
    } catch {
      // 정규화 실패 시 원본 사용
      preprocessed._normalizedProductNameEng = trademark.productNameEng.toLowerCase()
    }
  }

  // 검색 인덱스 생성 (빠른 검색을 위한 키워드 추출)
  const searchIndex: string[] = []
  if (preprocessed._normalizedProductName) {
    searchIndex.push(preprocessed._normalizedProductName)
    // 단어 단위로도 추가 (부분 검색 지원)
    const words = preprocessed._normalizedProductName.split(/\s+/).filter((w) => w.length > 0)
    searchIndex.push(...words)
  }
  if (preprocessed._normalizedProductNameEng) {
    searchIndex.push(preprocessed._normalizedProductNameEng)
    const words = preprocessed._normalizedProductNameEng.split(/\s+/).filter((w) => w.length > 0)
    searchIndex.push(...words)
  }
  preprocessed._searchIndex = searchIndex

  // 날짜 타임스탬프 변환
  if (trademark.applicationDate) {
    try {
      const dateStr = trademark.applicationDate.replace(/-/g, '')
      if (/^\d{8}$/.test(dateStr)) {
        const normalized = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
        const timestamp = Date.parse(normalized)
        preprocessed._applicationTimestamp = Number.isNaN(timestamp) ? null : timestamp
      } else {
        const timestamp = Date.parse(trademark.applicationDate)
        preprocessed._applicationTimestamp = Number.isNaN(timestamp) ? null : timestamp
      }
    } catch {
      preprocessed._applicationTimestamp = null
    }
  } else {
    preprocessed._applicationTimestamp = null
  }

  return preprocessed
}

/**
 * 상표 데이터 배열을 일괄 전처리
 */
export function preprocessTrademarks(trademarks: NormalizedTrademark[]): PreprocessedTrademark[] {
  return trademarks.map(preprocessTrademark)
}

