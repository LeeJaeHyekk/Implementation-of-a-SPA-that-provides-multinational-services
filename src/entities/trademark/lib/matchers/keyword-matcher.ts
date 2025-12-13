/**
 * 키워드 매칭 로직
 */

import { getCachedNormalized, createKeywordMatcher, createMultiLanguageNormalizer } from '@/features/search/lib'
import { safeMatch } from './base'
import type { NormalizedTrademark } from '../../model/types'
import type { PreprocessedTrademark } from '../preprocessing'

const keywordMatcher = createKeywordMatcher()
const normalizer = createMultiLanguageNormalizer()

/**
 * 키워드 매칭
 */
export function matchKeyword(
  trademark: NormalizedTrademark | PreprocessedTrademark,
  keyword?: string,
): boolean {
  if (!keyword) return true

  // 전처리된 데이터가 있으면 인덱스 사용
  const preprocessed = trademark as PreprocessedTrademark
  if (preprocessed._searchIndex) {
    const normalizedKeyword = getCachedNormalized(keyword, (k) => k.toLowerCase().trim())
    return preprocessed._searchIndex.some((index) => index.includes(normalizedKeyword))
  }

  // 전처리되지 않은 경우 정규화 후 매칭
  const normalizedKeyword = getCachedNormalized(keyword, (k) => normalizer.normalize(k))

  const productNameMatch = trademark.productName
    ? keywordMatcher.matches(normalizedKeyword, trademark.productName)
    : false

  const productNameEngMatch = trademark.productNameEng
    ? keywordMatcher.matches(normalizedKeyword, trademark.productNameEng)
    : false

  return productNameMatch || productNameEngMatch
}

