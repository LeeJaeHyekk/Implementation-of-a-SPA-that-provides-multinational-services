/**
 * 검색어 매칭 구현
 */

import { createSearchError, handleSearchError, logSearchError } from '../errors'
import { createMultiLanguageNormalizer } from '../normalizers'
import type { KeywordMatcher, MatcherConfig } from './types'

/**
 * 기본 매칭 구현
 */
class DefaultKeywordMatcher implements KeywordMatcher {
  private ignoreWhitespace: boolean
  private allowPartialMatch: boolean
  private normalizer = createMultiLanguageNormalizer()

  constructor(config: MatcherConfig = {}) {
    this.ignoreWhitespace = config.ignoreWhitespace ?? true
    this.allowPartialMatch = config.allowPartialMatch ?? true
    // ignoreCase는 항상 true로 사용 (normalizer에서 처리)
  }

  matches(searchKeyword: string, targetKeyword: string): boolean {
    try {
      // 입력값 검증
      if (!searchKeyword || !targetKeyword) {
        return false
      }

      if (typeof searchKeyword !== 'string' || typeof targetKeyword !== 'string') {
        throw createSearchError(
          'MATCHING_ERROR',
          '검색어 또는 대상 키워드가 문자열이 아닙니다.',
          null,
          {
            searchKeywordType: typeof searchKeyword,
            targetKeywordType: typeof targetKeyword,
          },
        )
      }

      // 정규화 (에러 발생 시 false 반환)
      let normalizedSearch: string
      let normalizedTarget: string

      try {
        normalizedSearch = this.normalizer.normalize(searchKeyword)
        normalizedTarget = this.normalizer.normalize(targetKeyword)
      } catch (error) {
        const searchError = handleSearchError(error, {
          searchKeyword,
          targetKeyword,
          step: 'normalization',
        })
        logSearchError(searchError)
        return false
      }

      // 정규화 결과 검증
      if (!normalizedSearch || !normalizedTarget) {
        return false
      }

      // 완전 일치 확인
      if (normalizedSearch === normalizedTarget) {
        return true
      }

      // 공백을 제거한 상태에서도 일치하는지 확인
      if (this.ignoreWhitespace) {
        try {
          const searchWithoutSpaces = normalizedSearch.replace(/\s+/g, '')
          const targetWithoutSpaces = normalizedTarget.replace(/\s+/g, '')

          // 공백 제거 후 완전 일치 확인
          if (searchWithoutSpaces === targetWithoutSpaces) {
            return true
          }

          // 부분 일치 확인 (공백 제거 후)
          if (this.allowPartialMatch && targetWithoutSpaces.includes(searchWithoutSpaces)) {
            return true
          }
        } catch (error) {
          const searchError = handleSearchError(error, {
            searchKeyword,
            targetKeyword,
            step: 'whitespace_removal',
          })
          logSearchError(searchError)
          // 에러 발생 시 기본 부분 일치 확인으로 폴백
        }
      }

      // 부분 일치 확인 (정규화된 상태에서)
      if (this.allowPartialMatch) {
        try {
          if (normalizedTarget.includes(normalizedSearch)) {
            return true
          }
        } catch (error) {
          const searchError = handleSearchError(error, {
            searchKeyword,
            targetKeyword,
            step: 'partial_match',
          })
          logSearchError(searchError)
        }
      }

      return false
    } catch (error) {
      const searchError = handleSearchError(error, {
        searchKeyword,
        targetKeyword,
        matcher: 'DefaultKeywordMatcher',
      })
      logSearchError(searchError)
      return false
    }
  }
}

/**
 * 검색어 매칭 팩토리 함수
 */
export function createKeywordMatcher(config?: MatcherConfig): KeywordMatcher {
  return new DefaultKeywordMatcher(config)
}

