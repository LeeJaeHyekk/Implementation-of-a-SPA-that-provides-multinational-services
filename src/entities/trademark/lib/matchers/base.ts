/**
 * 상표 매칭 기본 유틸리티
 * 공통 매칭 로직 모듈화
 */

import { validateArray, validateObject, safeExecute } from '@/shared/utils/error-handler'
import type { NormalizedTrademark } from '../../model/types'
import type { PreprocessedTrademark } from '../preprocessing'

/**
 * 상표 객체 검증
 */
export function validateTrademark(trademark: unknown): trademark is NormalizedTrademark {
  return validateObject<NormalizedTrademark>(trademark) && 'id' in trademark && 'productName' in trademark
}

/**
 * 안전한 매칭 함수 실행
 */
export function safeMatch(
  trademark: NormalizedTrademark | PreprocessedTrademark,
  matcher: (trademark: NormalizedTrademark | PreprocessedTrademark) => boolean,
  fallback = false,
): boolean {
  if (!validateTrademark(trademark)) {
    return fallback
  }

  return safeExecute(() => matcher(trademark), fallback, { trademark })
}

/**
 * 배열 안전 매칭 필터링
 */
export function safeMatchFilter<T extends NormalizedTrademark | PreprocessedTrademark>(
  items: T[],
  matcher: (item: T) => boolean,
): T[] {
  if (!validateArray<T>(items)) {
    return []
  }

  const result: T[] = []
  for (const item of items) {
    if (safeMatch(item, matcher, false)) {
      result.push(item)
    }
  }
  return result
}

