/**
 * 출원번호 매칭 로직
 */

import { safeString, safeTrim } from '@/shared/utils/string-utils'
import type { NormalizedTrademark } from '../../model/types'

/**
 * 출원번호 매칭
 */
export function matchApplicationNumber(
  trademark: NormalizedTrademark,
  applicationNumber?: string,
): boolean {
  if (!applicationNumber) return true
  if (!trademark.applicationNumber) return true

  const target = safeTrim(applicationNumber)
  if (!target) return true

  const trademarkNumber = safeTrim(safeString(trademark.applicationNumber))
  return trademarkNumber === target
}

