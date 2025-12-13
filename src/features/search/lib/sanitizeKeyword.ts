/**
 * 검색어 정제 통합 API
 * 
 * 이 파일은 하위 호환성을 위한 래퍼입니다.
 * 새로운 코드는 개별 모듈을 직접 사용하는 것을 권장합니다.
 * 
 * @deprecated 새로운 코드에서는 개별 모듈을 사용하세요:
 * - sanitizers: 검색어 정제
 * - normalizers: 검색어 정규화
 * - matchers: 검색어 매칭
 * - profanity: 욕설 필터링
 */

import { createMultiLanguageSanitizer } from './sanitizers'
import { createMultiLanguageNormalizer } from './normalizers'
import { createKeywordMatcher } from './matchers'
import type { LanguageCode } from './profanity/types'

/**
 * 검색어를 정제하여 비교 가능한 형태로 변환
 * - 띄어쓰기 정규화 (연속된 공백을 하나로, 앞뒤 공백 제거)
 * - 대소문자 정규화 (소문자로 변환)
 * 
 * @deprecated createMultiLanguageNormalizer().normalize() 사용을 권장합니다.
 */
export function normalizeKeyword(keyword: string): string {
  const normalizer = createMultiLanguageNormalizer()
  return normalizer.normalize(keyword)
}

/**
 * 검색어 입력값을 검증하고 정제
 * @param input 원본 입력값
 * @param language 언어 코드 (기본값: 다국어)
 * @returns 정제된 검색어 또는 null (유효하지 않은 경우)
 * 
 * @deprecated createMultiLanguageSanitizer().sanitize() 사용을 권장합니다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function sanitizeKeyword(input: string, _language?: LanguageCode | 'multi'): string | null {
  const sanitizer = createMultiLanguageSanitizer()
  return sanitizer.sanitize(input)
}

/**
 * 두 검색어가 정규화된 상태에서 일치하는지 확인
 * 띄어쓰기와 대소문자 차이는 무시
 * 
 * @deprecated createKeywordMatcher().matches() 사용을 권장합니다.
 */
export function isKeywordMatch(searchKeyword: string, targetKeyword: string): boolean {
  const matcher = createKeywordMatcher()
  return matcher.matches(searchKeyword, targetKeyword)
}
