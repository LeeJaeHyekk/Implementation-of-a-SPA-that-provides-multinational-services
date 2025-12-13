/**
 * 국가 타입 가드
 */

import { TrademarkCountry } from '../../model/types'

/**
 * TrademarkCountry인지 확인
 */
export function isTrademarkCountry(value: unknown): value is TrademarkCountry {
  return value === 'KR' || value === 'US'
}

