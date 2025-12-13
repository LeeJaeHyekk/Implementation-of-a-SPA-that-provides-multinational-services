/**
 * 타입 가드 모듈 통합 export
 */

// 배열 타입 가드 유틸리티
export { createArrayTypeGuard } from './array-guards'

// 객체 타입 가드 유틸리티
export { createObjectTypeGuard } from './object-guards'
export * from './status-guards'
export * from './country-guards'

// 상표 관련 타입 가드
export {
  validateTrademark,
  isPreprocessedTrademark,
  isTrademarkArray,
  isPreprocessedTrademarkArray,
} from './trademark-guards'

// 원본 데이터 타입 가드
export {
  isKRTrademarkRaw,
  isUSTrademarkRaw,
  isKRTrademarkRawArray,
  isUSTrademarkRawArray,
} from './raw-guards'

