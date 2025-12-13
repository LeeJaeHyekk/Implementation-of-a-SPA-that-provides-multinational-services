/**
 * 상표 매칭 모듈 통합
 */

export * from './base'
export * from './keyword-matcher'
export * from './application-number-matcher'
export * from './status-matcher'
export * from './date-matcher'

// 타입 가드는 type-guards 모듈로 이동
export {
  validateTrademark,
  isPreprocessedTrademark,
  isTrademarkArray,
  isPreprocessedTrademarkArray,
} from '../type-guards'

