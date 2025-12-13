/**
 * 검색어 매칭 타입 정의
 */

export interface KeywordMatcher {
  /**
   * 두 검색어가 일치하는지 확인
   * 띄어쓰기와 대소문자 차이는 무시
   */
  matches(searchKeyword: string, targetKeyword: string): boolean
}

export interface MatcherConfig {
  /**
   * 공백 무시 여부
   */
  ignoreWhitespace?: boolean
  /**
   * 대소문자 무시 여부
   */
  ignoreCase?: boolean
  /**
   * 부분 일치 허용 여부 (기본값: true)
   * true인 경우 검색어가 대상 문자열에 포함되어 있으면 일치로 간주
   */
  allowPartialMatch?: boolean
}

