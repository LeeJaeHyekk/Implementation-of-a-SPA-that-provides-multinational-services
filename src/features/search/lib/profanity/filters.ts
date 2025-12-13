/**
 * 언어별 욕설 필터 구현
 */

import type { LanguageCode, ProfanityFilter, ProfanityFilterConfig } from './types'

/**
 * 한국어 욕설 패턴
 */
const KOREAN_PROFANITY_PATTERNS: RegExp[] = [
  /씨발/gi,
  /시발/gi,
  /개새끼/gi,
  /병신/gi,
  /좆/gi,
  /지랄/gi,
  /미친/gi,
  /빠구리/gi,
  /등신/gi,
  /멍청이/gi,
  /바보/gi,
]

/**
 * 영어 욕설 패턴
 */
const ENGLISH_PROFANITY_PATTERNS: RegExp[] = [
  /fuck/gi,
  /shit/gi,
  /damn/gi,
  /bitch/gi,
  /asshole/gi,
  /bastard/gi,
  /crap/gi,
  /piss/gi,
]

/**
 * 욕설 필터 구현
 */
class ProfanityFilterImpl implements ProfanityFilter {
  private patterns: RegExp[]

  constructor(config: ProfanityFilterConfig) {
    this.patterns = config.patterns
  }

  containsProfanity(input: string): boolean {
    return this.patterns.some((pattern) => pattern.test(input))
  }
}

/**
 * 언어별 욕설 필터 팩토리
 */
export function createProfanityFilter(language: LanguageCode): ProfanityFilter {
  const configs: Record<LanguageCode, ProfanityFilterConfig> = {
    ko: {
      language: 'ko',
      patterns: KOREAN_PROFANITY_PATTERNS,
    },
    en: {
      language: 'en',
      patterns: ENGLISH_PROFANITY_PATTERNS,
    },
  }

  const config = configs[language]
  return new ProfanityFilterImpl(config)
}

/**
 * 다국어 욕설 필터 (한국어 + 영어)
 */
export function createMultiLanguageProfanityFilter(): ProfanityFilter {
  const allPatterns = [...KOREAN_PROFANITY_PATTERNS, ...ENGLISH_PROFANITY_PATTERNS]
  return new ProfanityFilterImpl({
    language: 'ko',
    patterns: allPatterns,
  })
}

