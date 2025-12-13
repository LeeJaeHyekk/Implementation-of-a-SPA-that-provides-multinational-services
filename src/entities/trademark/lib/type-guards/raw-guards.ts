/**
 * 원본 상표 데이터 타입 가드
 */

import { createArrayTypeGuard } from './array-guards'
import { createObjectTypeGuard } from './object-guards'
import type { KRTrademarkRaw, USTrademarkRaw } from '../../model/countryTypes'

/**
 * 한국 상표 원본 데이터 타입 가드
 */
export const isKRTrademarkRaw = createObjectTypeGuard<KRTrademarkRaw>(
  (obj: Record<string, unknown>) => {
    return (
      typeof obj['applicationNumber'] === 'string' &&
      (obj['productName'] === null || typeof obj['productName'] === 'string')
    )
  },
)

/**
 * 미국 상표 원본 데이터 타입 가드
 */
export const isUSTrademarkRaw = createObjectTypeGuard<USTrademarkRaw>(
  (obj: Record<string, unknown>) => {
    return (
      typeof obj['applicationNumber'] === 'string' &&
      (obj['productName'] === null || typeof obj['productName'] === 'string')
    )
  },
)

/**
 * 한국 상표 원본 데이터 배열 타입 가드
 */
export const isKRTrademarkRawArray = createArrayTypeGuard(isKRTrademarkRaw)

/**
 * 미국 상표 원본 데이터 배열 타입 가드
 */
export const isUSTrademarkRawArray = createArrayTypeGuard(isUSTrademarkRaw)

