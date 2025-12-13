import { TrademarkCountry } from '@/entities/trademark/model'

export const TRADEMARK_COUNTRIES: TrademarkCountry[] = ['KR', 'US']

export const TRADEMARK_DATASETS: Record<TrademarkCountry, string[]> = {
  KR: ['trademarks_kr_sample.json', 'trademarks_kr_trademarks.json'],
  US: ['trademarks_us_sample.json', 'trademarks_us_trademarks.json'],
}

/**
 * 검색 관련 상수
 */
export const SEARCH_CONSTANTS = {
  /** 검증 설정 */
  VALIDATION_CONFIG: {
    minLength: 1,
    maxLength: 100,
    maxRepeatedCharacters: 3,
  },
  /** Debounce 지연 시간 (ms) */
  DEBOUNCE_DELAY: 300,
  /** 페이지당 항목 수 */
  PAGE_SIZE: 10,
  /** 대량 데이터 필터링 임계값 */
  LARGE_DATA_THRESHOLD: 1000,
  /** 청크 크기 */
  CHUNK_SIZE: 1000,
} as const

