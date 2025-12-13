/**
 * 등록 상태 타입 가드
 */

import { RegisterStatus } from '../../model/types'

/**
 * RegisterStatus 또는 'all'인지 확인
 */
export function isRegisterStatusOrAll(value: unknown): value is RegisterStatus | 'all' {
  if (typeof value !== 'string') return false
  
  const validStatuses: readonly (RegisterStatus | 'all')[] = [
    'registered',
    'rejected',
    'pending',
    'expired',
    'live',
    'dead',
    'unknown',
    'all',
  ] as const
  
  // 타입 단언 없이 안전하게 체크
  return validStatuses.some((status) => status === value)
}

/**
 * RegisterStatus인지 확인
 */
export function isRegisterStatus(value: unknown): value is RegisterStatus {
  if (typeof value !== 'string') return false
  
  const validStatuses: readonly RegisterStatus[] = [
    'registered',
    'rejected',
    'pending',
    'expired',
    'live',
    'dead',
    'unknown',
  ] as const
  
  // 타입 단언 없이 안전하게 체크
  return validStatuses.some((status) => status === value)
}

