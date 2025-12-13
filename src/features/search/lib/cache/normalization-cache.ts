/**
 * 검색어 정규화 결과 캐싱
 * 같은 검색어에 대한 반복적인 정규화를 방지하여 성능 향상
 */

interface CacheEntry {
  normalized: string
  timestamp: number
}

class NormalizationCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly maxSize: number
  private readonly ttl: number // Time to live in milliseconds

  constructor(maxSize = 1000, ttl = 1000 * 60 * 5) {
    // 기본값: 최대 1000개 항목, 5분 TTL
    this.maxSize = maxSize
    this.ttl = ttl
  }

  /**
   * 정규화된 검색어 가져오기
   */
  get(key: string): string | null {
    const entry = this.cache.get(key)
    if (!entry) {
      return null
    }

    // TTL 체크
    const now = Date.now()
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.normalized
  }

  /**
   * 정규화된 검색어 저장
   */
  set(key: string, normalized: string): void {
    // 캐시 크기 제한
    if (this.cache.size >= this.maxSize) {
      // 가장 오래된 항목 제거 (LRU 방식)
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      normalized,
      timestamp: Date.now(),
    })
  }

  /**
   * 캐시 초기화
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 만료된 항목 정리
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 캐시 통계
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    }
  }
}

// 싱글톤 인스턴스
let cacheInstance: NormalizationCache | null = null

/**
 * 정규화 캐시 인스턴스 가져오기
 */
export function getNormalizationCache(): NormalizationCache {
  if (!cacheInstance) {
    cacheInstance = new NormalizationCache()
    // 주기적으로 만료된 항목 정리 (5분마다)
    if (typeof globalThis !== 'undefined') {
      setInterval(() => {
        cacheInstance?.cleanup()
      }, 1000 * 60 * 5)
    }
  }
  return cacheInstance
}

/**
 * 정규화된 검색어 가져오기 (캐시 사용)
 */
export function getCachedNormalized(key: string, normalizer: (key: string) => string): string {
  const cache = getNormalizationCache()
  const cached = cache.get(key)
  if (cached !== null) {
    return cached
  }

  const normalized = normalizer(key)
  cache.set(key, normalized)
  return normalized
}

