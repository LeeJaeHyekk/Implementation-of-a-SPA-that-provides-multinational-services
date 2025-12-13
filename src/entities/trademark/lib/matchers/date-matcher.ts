/**
 * 날짜 범위 매칭 로직
 */

import { isDateInRange, parseDateToTimestamp } from '@/shared/utils/date-utils'
import type { PreprocessedTrademark } from '../preprocessing'
import type { NormalizedTrademark } from '../../model/types'

/**
 * 날짜 범위 매칭
 */
export function matchDateRange(
  trademark: NormalizedTrademark | PreprocessedTrademark,
  from?: string | null,
  to?: string | null,
): boolean {
  if (!from && !to) return true

  // 전처리된 타임스탬프 사용
  const preprocessed = trademark as PreprocessedTrademark
  const timestamp = preprocessed._applicationTimestamp ?? parseDateToTimestamp(trademark.applicationDate)

  return isDateInRange(timestamp, from, to)
}

