/**
 * 상표 ID에서 국가 정보 추출
 */

import { TrademarkCountry } from '../model/types'

/**
 * 상표 ID에서 국가 코드 추출
 * @param id - 상표 ID (예: 'KR-4019950043843', 'US-86642534')
 * @returns 국가 코드 ('KR' | 'US')
 * @throws Error - id가 빈 문자열이거나 유효하지 않은 형식인 경우
 */
export function resolveCountry(id: string): TrademarkCountry {
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error(`Invalid trademark ID: id must be a non-empty string, got ${JSON.stringify(id)}`)
  }

  const trimmed = id.trim()
  if (trimmed.startsWith('US-')) return 'US'
  if (trimmed.startsWith('KR-')) return 'KR'

  // 기본값으로 KR 반환 (하위 호환성)
  // 경고 로그 출력
  globalThis.console?.warn?.('[resolveCountry] Unexpected ID format, defaulting to KR', { id: trimmed })
  return 'KR'
}

