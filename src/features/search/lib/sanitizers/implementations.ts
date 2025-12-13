/**
 * 검색어 정제 구현
 */

import { createSearchError, handleSearchError, logSearchError } from '../errors'
import { createMultiLanguageProfanityFilter, createProfanityFilter } from '../profanity'
import type { LanguageCode } from '../profanity/types'
import { createMultiLanguageNormalizer, createNormalizer } from '../normalizers'
import type { Normalizer } from '../normalizers/types'
import type { ProfanityFilter } from '../profanity/types'
import { validateKeyword } from '../validators'
import type { Sanitizer, SanitizerConfig } from './types'
import { removeSpecialCharacters } from './character-filters'

/**
 * 검색어 정제 구현
 */
class KeywordSanitizer implements Sanitizer {
  private normalizer: Normalizer
  private profanityFilter: ProfanityFilter
  private allowSpecialCharacters: boolean
  private validationConfig?: SanitizerConfig['validation']

  constructor(config: SanitizerConfig = {}) {
    const language = config.language ?? 'multi'

    // 정규화 설정
    this.normalizer = config.customNormalizer ?? this.createNormalizerForLanguage(language)

    // 욕설 필터 설정
    this.profanityFilter =
      config.customProfanityFilter ??
      (language === 'multi'
        ? createMultiLanguageProfanityFilter()
        : createProfanityFilter(language as LanguageCode))

    this.allowSpecialCharacters = config.allowSpecialCharacters ?? false
    this.validationConfig = config.validation
  }

  private createNormalizerForLanguage(language: LanguageCode | 'multi'): Normalizer {
    if (language === 'multi') {
      return createMultiLanguageNormalizer()
    }
    return createNormalizer()
  }

  sanitize(input: string): string | null {
    try {
      // 입력값 검증
      if (!input || typeof input !== 'string') {
        return null
      }

      // trim 처리 (에러 처리)
      let trimmed: string
      try {
        trimmed = input.trim()
      } catch (error) {
        const searchError = handleSearchError(error, { input, step: 'trim' })
        logSearchError(searchError)
        return null
      }

      if (trimmed.length === 0) {
        return null
      }

      // 검증 설정이 있으면 검증 수행
      if (this.validationConfig) {
        try {
          const validation = validateKeyword(trimmed, this.validationConfig)
          if (!validation.isValid) {
            return null
          }
        } catch (error) {
          const searchError = handleSearchError(error, {
            input: trimmed,
            step: 'validation',
          })
          logSearchError(searchError)
          // 검증 실패 시 null 반환
          return null
        }
      }

      // 욕설 필터링 (에러 처리)
      try {
        if (this.profanityFilter.containsProfanity(trimmed)) {
          return null
        }
      } catch (error) {
        const searchError = handleSearchError(error, {
          input: trimmed,
          step: 'profanity_filter',
        })
        logSearchError(searchError)
        // 욕설 필터링 실패 시 null 반환 (안전한 폴백)
        return null
      }

      // 특수 문자 제거 (에러 처리)
      let cleaned: string
      try {
        cleaned = removeSpecialCharacters(trimmed, {
          allowSpecialCharacters: this.allowSpecialCharacters,
        })
      } catch (error) {
        const searchError = handleSearchError(error, {
          input: trimmed,
          step: 'character_removal',
        })
        logSearchError(searchError)
        // 특수 문자 제거 실패 시 원본 사용
        cleaned = trimmed
      }

      if (cleaned.length === 0) {
        return null
      }

      // 정규화 (에러 처리)
      let normalized: string
      try {
        normalized = this.normalizer.normalize(cleaned)
      } catch (error) {
        const searchError = handleSearchError(error, {
          input: cleaned,
          step: 'normalization',
        })
        logSearchError(searchError)
        // 정규화 실패 시 원본 사용
        normalized = cleaned
      }

      // 정규화 후 빈 문자열 체크
      if (!normalized || normalized.trim().length === 0) {
        return null
      }

      // 정규화 후 길이 재검증 (정규화 과정에서 길이가 변경될 수 있음)
      if (this.validationConfig) {
        try {
          const postNormalizationValidation = validateKeyword(normalized, this.validationConfig)
          if (!postNormalizationValidation.isValid) {
            return null
          }
        } catch (error) {
          const searchError = handleSearchError(error, {
            input: normalized,
            step: 'post_normalization_validation',
          })
          logSearchError(searchError)
          // 재검증 실패 시 null 반환
          return null
        }
      }

      return normalized
    } catch (error) {
      const searchError = handleSearchError(error, {
        input,
        sanitizer: 'KeywordSanitizer',
        function: 'sanitize',
      })
      logSearchError(searchError)
      // 예상치 못한 에러 발생 시 null 반환
      return null
    }
  }
}

/**
 * 검색어 정제 팩토리 함수
 */
export function createSanitizer(config?: SanitizerConfig): Sanitizer {
  return new KeywordSanitizer(config)
}

/**
 * 한국어 검색어 정제 생성
 */
export function createKoreanSanitizer(config?: SanitizerConfig): Sanitizer {
  return new KeywordSanitizer({ ...config, language: 'ko' })
}

/**
 * 영어 검색어 정제 생성
 */
export function createEnglishSanitizer(config?: SanitizerConfig): Sanitizer {
  return new KeywordSanitizer({ ...config, language: 'en' })
}

/**
 * 다국어 검색어 정제 생성 (기본값)
 */
export function createMultiLanguageSanitizer(config?: SanitizerConfig): Sanitizer {
  return new KeywordSanitizer({ ...config, language: 'multi' })
}

