/**
 * 객체 타입 가드 유틸리티
 * 반복되는 객체 검증 로직을 모듈화
 */

import { isRecord } from '@/shared/utils/type-guards'

/**
 * 객체 타입 가드 팩토리 함수
 * @param validator 객체 속성을 검증하는 함수
 * @returns 객체 타입 가드 함수
 */
export function createObjectTypeGuard<T>(
  validator: (obj: Record<string, unknown>) => boolean,
): (data: unknown) => data is T {
  return (data: unknown): data is T => {
    if (!isRecord(data)) {
      return false
    }
    return validator(data)
  }
}

