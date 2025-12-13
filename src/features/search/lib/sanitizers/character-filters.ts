/**
 * 특수 문자 필터링 유틸리티
 */

export interface CharacterFilterConfig {
  /**
   * 허용할 문자 패턴 (정규식)
   */
  allowedPattern?: RegExp
  /**
   * 특수 문자 허용 여부
   */
  allowSpecialCharacters?: boolean
}

/**
 * 기본 특수 문자 필터 (한글, 영문, 숫자, 공백만 허용)
 */
export function removeSpecialCharacters(input: string, config?: CharacterFilterConfig): string {
  if (config?.allowSpecialCharacters) {
    return input
  }

  // 한글, 영문, 숫자, 공백만 허용
  const allowedPattern = config?.allowedPattern ?? /[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/gi
  return input.replace(allowedPattern, '')
}

/**
 * 영어 전용 특수 문자 필터 (영문, 숫자, 공백만 허용)
 */
export function removeSpecialCharactersEnglish(input: string): string {
  return input.replace(/[^\w\s]/gi, '')
}

/**
 * 한국어 전용 특수 문자 필터 (한글, 영문, 숫자, 공백만 허용)
 */
export function removeSpecialCharactersKorean(input: string): string {
  return input.replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ]/gi, '')
}

