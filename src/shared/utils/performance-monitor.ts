/**
 * 성능 모니터링 유틸리티
 * 대량 데이터 처리 시 성능 측정 및 최적화 가이드 제공
 */

interface PerformanceMetrics {
  operation: string
  duration: number
  itemCount: number
  itemsPerSecond: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private readonly maxMetrics = 100

  /**
   * 성능 측정 시작
   */
  startMeasure(operation: string): () => void {
    const startTime = performance.now()
    const startItemCount = 0

    return (itemCount = 0) => {
      const endTime = performance.now()
      const duration = endTime - startTime
      const itemsPerSecond = itemCount > 0 && duration > 0 ? (itemCount / duration) * 1000 : 0

      this.record({
        operation,
        duration,
        itemCount,
        itemsPerSecond,
        timestamp: Date.now(),
      })
    }
  }

  /**
   * 성능 메트릭 기록
   */
  private record(metric: PerformanceMetrics): void {
    this.metrics.push(metric)

    // 최대 개수 제한
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // 개발 환경에서만 로깅
    if (typeof globalThis !== 'undefined' && globalThis.console && process.env.NODE_ENV === 'development') {
      globalThis.console.log(`[Performance] ${metric.operation}:`, {
        duration: `${metric.duration.toFixed(2)}ms`,
        items: metric.itemCount,
        throughput: `${metric.itemsPerSecond.toFixed(0)} items/sec`,
      })
    }
  }

  /**
   * 성능 통계 조회
   */
  getStats(operation?: string): PerformanceMetrics[] {
    if (operation) {
      return this.metrics.filter((m) => m.operation === operation)
    }
    return [...this.metrics]
  }

  /**
   * 성능 메트릭 초기화
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * 평균 성능 조회
   */
  getAverageStats(operation: string): {
    avgDuration: number
    avgItemsPerSecond: number
    count: number
  } | null {
    const operationMetrics = this.metrics.filter((m) => m.operation === operation)
    if (operationMetrics.length === 0) {
      return null
    }

    const totalDuration = operationMetrics.reduce((sum, m) => sum + m.duration, 0)
    const totalItemsPerSecond = operationMetrics.reduce((sum, m) => sum + m.itemsPerSecond, 0)

    return {
      avgDuration: totalDuration / operationMetrics.length,
      avgItemsPerSecond: totalItemsPerSecond / operationMetrics.length,
      count: operationMetrics.length,
    }
  }
}

// 싱글톤 인스턴스
let monitorInstance: PerformanceMonitor | null = null

/**
 * 성능 모니터 인스턴스 가져오기
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor()
  }
  return monitorInstance
}

/**
 * 성능 측정 헬퍼 함수
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>,
  itemCount?: number,
): Promise<T> {
  const monitor = getPerformanceMonitor()
  const endMeasure = monitor.startMeasure(operation)

  try {
    const result = await fn()
    endMeasure(itemCount)
    return result
  } catch (error) {
    endMeasure(itemCount)
    throw error
  }
}

