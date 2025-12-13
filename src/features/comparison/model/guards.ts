/**
 * 비교 기능 타입 가드 및 상태 검증
 */

import { validateArray, validateObject } from '@/shared/utils/error-handler'
import { createArrayTypeGuard } from '@/entities/trademark/lib/type-guards/array-guards'

/**
 * 유효한 상표 ID인지 검증
 * @param id - 검증할 ID
 * @returns 유효한 ID인지 여부
 */
export function isValidTrademarkId(id: unknown): id is string {
  return typeof id === 'string' && id.trim().length > 0 && (id.startsWith('KR-') || id.startsWith('US-'))
}

/**
 * 상표 ID 배열 검증
 */
export const isTrademarkIdArray = createArrayTypeGuard(isValidTrademarkId)

/**
 * 비교 상태 객체 검증
 */
export function isValidComparisonState(state: unknown): state is {
  items: string[]
  maxItems?: number
} {
  if (!validateObject(state)) {
    return false
  }

  const obj = state as Record<string, unknown>

  // items 필드 검증
  if (!('items' in obj)) {
    return false
  }

  const items = obj['items']
  if (!Array.isArray(items)) {
    return false
  }

  // 모든 items가 유효한 ID인지 확인
  if (!isTrademarkIdArray(items)) {
    return false
  }

  // maxItems가 있는 경우 검증
  const maxItems = obj['maxItems']
  if (maxItems !== undefined) {
    if (typeof maxItems !== 'number' || maxItems < 1 || !Number.isInteger(maxItems)) {
      return false
    }
  }

  return true
}

/**
 * 비교 항목 개수 검증
 * @param items - 비교 항목 배열
 * @param maxItems - 최대 항목 수
 * @returns 유효한 개수인지 여부
 */
export function isValidComparisonCount(items: string[], maxItems: number): boolean {
  if (!validateArray(items)) {
    return false
  }

  if (typeof maxItems !== 'number' || maxItems < 1 || !Number.isInteger(maxItems)) {
    return false
  }

  return items.length <= maxItems
}

/**
 * 비교 항목 추가 가능 여부 검증
 * @param items - 현재 비교 항목 배열
 * @param maxItems - 최대 항목 수
 * @param newId - 추가할 ID
 * @returns 추가 가능한지 여부
 */
export function canAddToComparison(items: string[], maxItems: number, newId: string): boolean {
  if (!isValidComparisonCount(items, maxItems)) {
    return false
  }

  if (!isValidTrademarkId(newId)) {
    return false
  }

  if (items.length >= maxItems) {
    return false
  }

  if (items.includes(newId)) {
    return false
  }

  return true
}

