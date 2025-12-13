/**
 * localStorage 공통 유틸리티
 * SSR 환경에서 안전한 localStorage 접근 패턴 통합
 */

/**
 * SSR 환경에서 안전한 localStorage 접근
 * @returns 사용 가능한 Storage 객체 (SSR 환경에서는 메모리 스토리지)
 */
export function getSafeStorage(): Storage {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    } as Storage
  }

  try {
    if (window.localStorage) {
      // localStorage 사용 가능 여부 테스트
      const testKey = '__storage_test__'
      window.localStorage.setItem(testKey, 'test')
      window.localStorage.removeItem(testKey)
      return window.localStorage
    }
  } catch (error) {
    globalThis.console?.warn?.('[Storage] localStorage not available, using memory storage', error)
  }

  // localStorage 사용 불가능한 경우 메모리 스토리지 반환
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  } as Storage
}

