/**
 * 상태 매칭 로직
 */

import type { NormalizedTrademark, RegisterStatus } from '../../model/types'

/**
 * 상태 매칭
 */
export function matchStatus(trademark: NormalizedTrademark, status?: RegisterStatus | 'all'): boolean {
  if (!status || status === 'all') return true
  return trademark.registerStatus === status
}

