import { filterTrademarks, filterTrademarksOptimized } from '@/entities/trademark/lib'
import { NormalizedTrademark, TrademarkFilters } from '@/entities/trademark/model'

/**
 * 필터 결합 함수
 * 대량 데이터(1000개 이상)일 경우 최적화된 필터링 사용
 */
export async function combineFiltersAsync(
  items: NormalizedTrademark[],
  filters: TrademarkFilters,
  options?: {
    useOptimized?: boolean
    chunkSize?: number
    onProgress?: (processed: number, total: number) => void
  },
): Promise<NormalizedTrademark[]> {
  const { useOptimized = items.length > 1000, chunkSize = 1000, onProgress } = options ?? {}

  if (useOptimized) {
    return await filterTrademarksOptimized(items, filters, { chunkSize, onProgress })
  }

  return filterTrademarks(items, filters)
}

/**
 * 동기 필터 결합 함수 (하위 호환성)
 */
export function combineFilters(items: NormalizedTrademark[], filters: TrademarkFilters) {
  // 소량 데이터는 동기 처리
  if (items.length <= 1000) {
    return filterTrademarks(items, filters)
  }

  // 대량 데이터는 경고 후 동기 처리 (비동기 버전 사용 권장)
  if (typeof globalThis !== 'undefined' && globalThis.console) {
    globalThis.console.warn(
      '[combineFilters] 대량 데이터 감지. combineFiltersAsync 사용을 권장합니다.',
      { itemCount: items.length },
    )
  }

  return filterTrademarks(items, filters)
}
