/**
 * 상표 관련 타입 가드
 */

import { validateObject } from '@/shared/utils/error-handler'
import type { NormalizedTrademark } from '../../model/types'
import type { PreprocessedTrademark } from '../preprocessing'
import { createArrayTypeGuard } from './array-guards'

/**
 * 상표 객체 검증
 */
export function validateTrademark(trademark: unknown): trademark is NormalizedTrademark {
  return validateObject<NormalizedTrademark>(trademark) && 'id' in trademark && 'productName' in trademark
}

/**
 * 전처리된 상표 데이터인지 확인
 * _searchIndex 또는 _applicationTimestamp 속성 존재 여부로 판단
 */
export function isPreprocessedTrademark(
  trademark: NormalizedTrademark | PreprocessedTrademark,
): trademark is PreprocessedTrademark {
  return '_searchIndex' in trademark || '_applicationTimestamp' in trademark
}

/**
 * 상표 배열 검증
 */
export const isTrademarkArray = createArrayTypeGuard(validateTrademark)

/**
 * 전처리된 상표 배열 검증
 */
export function isPreprocessedTrademarkArray(items: unknown): items is PreprocessedTrademark[] {
  if (!Array.isArray(items)) {
    return false
  }
  return items.every((item) => validateTrademark(item) && isPreprocessedTrademark(item))
}

