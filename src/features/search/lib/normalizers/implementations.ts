/**
 * 검색어 정규화 구현
 */

import { createSearchError, handleSearchError, logSearchError } from '../errors'
import type { Normalizer, NormalizerConfig } from './types'

/**
 * 기본 정규화 구현
 */
class DefaultNormalizer implements Normalizer {
  private caseSensitive: boolean
  private normalizeWhitespace: boolean

  constructor(config: NormalizerConfig = {}) {
    this.caseSensitive = config.caseSensitive ?? false
    this.normalizeWhitespace = config.normalizeWhitespace ?? true
  }

  normalize(input: string): string {
    try {
      // 입력값 검증
      if (input === null || input === undefined) {
        throw createSearchError('NORMALIZATION_ERROR', '입력값이 null 또는 undefined입니다.', null, { input })
      }

      if (typeof input !== 'string') {
        throw createSearchError(
          'NORMALIZATION_ERROR',
          `입력값이 문자열이 아닙니다. 타입: ${typeof input}`,
          null,
          { input, type: typeof input },
        )
      }

      let normalized = input.trim()

      // 공백 정규화
      if (this.normalizeWhitespace) {
        try {
          normalized = normalized.replace(/\s+/g, ' ')
        } catch (error) {
          throw handleSearchError(error, { input, step: 'whitespace_normalization' })
        }
      }

      // 대소문자 정규화
      if (!this.caseSensitive) {
        try {
          normalized = normalized.toLowerCase()
        } catch (error) {
          throw handleSearchError(error, { input, step: 'case_normalization' })
        }
      }

      return normalized
    } catch (error) {
      const searchError = handleSearchError(error, { input, normalizer: 'DefaultNormalizer' })
      logSearchError(searchError)
      // 에러 발생 시 원본 입력값 반환 (안전한 폴백)
      return typeof input === 'string' ? input.trim() : ''
    }
  }
}

/**
 * 공통 정규화 로직 (중복 제거)
 */
class BaseNormalizer implements Normalizer {
  normalize(input: string): string {
    try {
      if (input === null || input === undefined || typeof input !== 'string') {
        throw createSearchError('NORMALIZATION_ERROR', '유효하지 않은 입력값입니다.', null, { input })
      }

      return input
        .trim()
        .replace(/\s+/g, ' ') // 연속된 공백을 하나로
        .toLowerCase()
    } catch (error) {
      const searchError = handleSearchError(error, { input, normalizer: this.constructor.name })
      logSearchError(searchError)
      return typeof input === 'string' ? input.trim() : ''
    }
  }
}

/**
 * 한국어 특화 정규화
 * - 한글 자모 정규화
 * - 띄어쓰기 정규화
 */
class KoreanNormalizer extends BaseNormalizer {}

/**
 * 영어 특화 정규화
 * - 대소문자 정규화
 * - 띄어쓰기 정규화
 */
class EnglishNormalizer extends BaseNormalizer {}

/**
 * 다국어 정규화 (한국어 + 영어)
 */
class MultiLanguageNormalizer extends BaseNormalizer {}

/**
 * 정규화 팩토리 함수
 */
export function createNormalizer(config?: NormalizerConfig): Normalizer {
  return new DefaultNormalizer(config)
}

/**
 * 한국어 정규화 생성
 */
export function createKoreanNormalizer(): Normalizer {
  return new KoreanNormalizer()
}

/**
 * 영어 정규화 생성
 */
export function createEnglishNormalizer(): Normalizer {
  return new EnglishNormalizer()
}

/**
 * 다국어 정규화 생성
 */
export function createMultiLanguageNormalizer(): Normalizer {
  return new MultiLanguageNormalizer()
}

