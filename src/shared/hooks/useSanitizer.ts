'use client'

import { useMemo } from 'react'
import {
  createKoreanSanitizer,
  createEnglishSanitizer,
  createMultiLanguageSanitizer,
} from '@/features/search/lib'
import { useCountryStore } from '@/features/country-switcher/model/store'
import { SEARCH_CONSTANTS } from '@/shared/config/constants'

/**
 * 국가별 Sanitizer 생성 훅
 * SearchBar와 SearchBarWithFilters에서 중복되던 로직을 통합
 */
export function useSanitizer() {
  const country = useCountryStore((state) => state.country)

  return useMemo(
    () =>
      country === 'KR'
        ? createKoreanSanitizer({ validation: SEARCH_CONSTANTS.VALIDATION_CONFIG })
        : country === 'US'
          ? createEnglishSanitizer({ validation: SEARCH_CONSTANTS.VALIDATION_CONFIG })
          : createMultiLanguageSanitizer({ validation: SEARCH_CONSTANTS.VALIDATION_CONFIG }),
    [country],
  )
}

