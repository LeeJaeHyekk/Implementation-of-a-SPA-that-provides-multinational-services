/**
 * 상표 ID에서 국가 정보 추출
 */

import { TrademarkCountry } from '../model/types'

/**
 * 상표 ID에서 국가 코드 추출
 * @param id - 상표 ID (예: 'KR-4019950043843', 'US-86642534')
 * @returns 국가 코드 ('KR' | 'US')
 */
export function resolveCountry(id: string): TrademarkCountry {
  if (id.startsWith('US-')) return 'US'
  return 'KR'
}

