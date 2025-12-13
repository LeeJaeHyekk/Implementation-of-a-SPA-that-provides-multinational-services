/**
 * 상표 매칭 기본 유틸리티
 * 공통 매칭 로직 모듈화
 */

import { validateArray, safeExecute } from '@/shared/utils/error-handler'
import type { NormalizedTrademark } from '../../model/types'
import type { PreprocessedTrademark } from '../preprocessing'
import { validateTrademark } from '../type-guards'

// 타입 가드는 type-guards 모듈로 이동
export { validateTrademark, isPreprocessedTrademark, isTrademarkArray, isPreprocessedTrademarkArray } from '../type-guards'

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
    // matcher를 직접 호출 (타입 안전성 보장)
    try {
      if (matcher(item)) {
        result.push(item)
      }
    } catch {
      // 에러 발생 시 해당 항목 제외
      continue
    }
  }
  return result
}

