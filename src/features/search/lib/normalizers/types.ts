/**
 * 검색어 정규화 타입 정의
 */

export interface Normalizer {
  /**
   * 검색어를 정규화된 형태로 변환
   * - 띄어쓰기 정규화
   * - 대소문자 정규화
   */
  normalize(input: string): string
}

export interface NormalizerConfig {
  /**
   * 대소문자 변환 여부
   */
  caseSensitive?: boolean
  /**
   * 공백 정규화 여부
   */
  normalizeWhitespace?: boolean
}

