/**
 * 검색 기능 통합 모듈
 * 
 * 모든 검색 관련 유틸리티를 한 곳에서 export
 */

// 핵심 모듈
export * from './sanitizers'
export * from './normalizers'
export * from './matchers'
export * from './validators'
export * from './errors'

// 필터링 모듈
export * from './profanity'

// 캐시 모듈
export * from './cache/normalization-cache'

// 필터 결합
export * from './combineFilters'

// 하위 호환성을 위한 레거시 API (@deprecated)
export { normalizeKeyword, sanitizeKeyword, isKeywordMatch } from './sanitizeKeyword'

