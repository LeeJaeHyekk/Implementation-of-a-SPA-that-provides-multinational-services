/**
 * 검색어 검증 타입 정의
 */

export interface ValidationResult {
  /**
   * 검증 통과 여부
   */
  isValid: boolean
  /**
   * 에러 메시지 (검증 실패 시)
   */
  errorMessage?: string
  /**
   * 에러 코드
   */
  errorCode?: ValidationErrorCode
}

export type ValidationErrorCode =
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'REPEATED_CHARACTERS'
  | 'EMPTY_AFTER_SANITIZATION'
  | 'INVALID_INPUT'

export interface ValidatorConfig {
  /**
   * 최소 길이 (기본값: 1)
   */
  minLength?: number
  /**
   * 최대 길이 (기본값: 100)
   */
  maxLength?: number
  /**
   * 연속된 동일 문자 허용 개수 (기본값: 3)
   */
  maxRepeatedCharacters?: number
}

