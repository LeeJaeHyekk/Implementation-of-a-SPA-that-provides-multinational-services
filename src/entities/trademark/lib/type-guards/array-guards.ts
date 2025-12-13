/**
 * 배열 타입 가드 유틸리티
 * 반복되는 배열 검증 로직을 모듈화
 */

/**
 * 배열 타입 가드 팩토리 함수
 * @param itemGuard 개별 항목을 검증하는 타입 가드 함수
 * @returns 배열 타입 가드 함수
 */
export function createArrayTypeGuard<T>(
  itemGuard: (item: unknown) => item is T,
): (items: unknown) => items is T[] {
  return (items: unknown): items is T[] => {
    if (!Array.isArray(items)) {
      return false
    }
    return items.every((item) => itemGuard(item))
  }
}

