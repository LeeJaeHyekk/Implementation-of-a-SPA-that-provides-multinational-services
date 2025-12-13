/**
 * 검색어 정제 타입 정의
 */

import type { LanguageCode } from '../profanity/types'
import type { Normalizer } from '../normalizers/types'
import type { ProfanityFilter } from '../profanity/types'

import type { ValidatorConfig } from '../validators/types'

export interface SanitizerConfig {
  /**
   * 언어 코드 (기본값: 다국어)
   */
  language?: LanguageCode | 'multi'
  /**
   * 특수 문자 허용 여부
   */
  allowSpecialCharacters?: boolean
  /**
   * 커스텀 정규화 함수
   */
  customNormalizer?: Normalizer
  /**
   * 커스텀 욕설 필터
   */
  customProfanityFilter?: ProfanityFilter
  /**
   * 검증 설정
   */
  validation?: ValidatorConfig
}

export interface Sanitizer {
  /**
   * 검색어를 정제하여 반환
   * @param input 원본 입력값
   * @returns 정제된 검색어 또는 null (유효하지 않은 경우)
   */
  sanitize(input: string): string | null
}

