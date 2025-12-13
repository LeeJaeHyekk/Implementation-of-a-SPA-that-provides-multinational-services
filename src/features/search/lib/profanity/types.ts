/**
 * 욕설 필터 타입 정의
 */

export type LanguageCode = 'ko' | 'en'

export interface ProfanityFilter {
  /**
   * 입력값에 욕설이 포함되어 있는지 확인
   */
  containsProfanity(input: string): boolean
}

export interface ProfanityFilterConfig {
  /**
   * 언어 코드
   */
  language: LanguageCode
  /**
   * 욕설 패턴 목록 (정규식)
   */
  patterns: RegExp[]
}

