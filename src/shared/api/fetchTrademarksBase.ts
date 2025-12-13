/**
 * 상표 데이터 페칭 공통 로직
 * fetchKRTrademarks와 fetchUSTrademarks의 중복 제거
 */

import { normalizeTrademarks, preprocessTrademarks } from '@/entities/trademark/lib'
import { NormalizedTrademark, TrademarkCountry } from '@/entities/trademark/model'
import type { KRTrademarkRaw, USTrademarkRaw } from '@/entities/trademark/model/countryTypes'
import { loadLocalJson } from './loadLocalJson'

interface FetchTrademarksOptions {
  country: TrademarkCountry
  loaders: Array<() => Promise<{ default: unknown }>>
  errorMessage: string
  typeGuard: (data: unknown) => data is KRTrademarkRaw[] | USTrademarkRaw[]
  typeGuardError: string
}

/**
 * 상표 데이터 페칭 공통 함수
 */
export async function fetchTrademarksBase({
  country,
  loaders,
  errorMessage,
  typeGuard,
  typeGuardError,
}: FetchTrademarksOptions): Promise<NormalizedTrademark[]> {
  const rawData = await loadLocalJson<unknown>({
    loaders,
    errorMessage,
  })

  // 타입 가드로 런타임 검증
  if (!typeGuard(rawData)) {
    throw new Error(typeGuardError)
  }

  // 타입 가드를 통과했으므로 타입이 이미 좁혀짐
  const data = rawData

  let normalized: NormalizedTrademark[]
  try {
    if (country === 'KR') {
      normalized = normalizeTrademarks({ country: 'KR', items: data as KRTrademarkRaw[] })
    } else {
      normalized = normalizeTrademarks({ country: 'US', items: data as USTrademarkRaw[] })
    }
  } catch (error) {
    globalThis.console?.error?.(`[${country}Fetch] Failed to normalize`, error)
    throw new Error(`${country === 'KR' ? '국내' : '미국'} 상표 데이터 정규화 중 오류가 발생했습니다.`)
  }

  // 검색 성능 향상을 위한 전처리
  let preprocessed: NormalizedTrademark[]
  try {
    preprocessed = preprocessTrademarks(normalized)
  } catch (error) {
    globalThis.console?.error?.(`[${country}Fetch] Failed to preprocess`, error)
    // 전처리 실패 시 정규화된 데이터 반환 (폴백)
    return normalized
  }

  if (country === 'KR') {
    globalThis.console?.log?.('[KRFetchDebug]', {
      rawCount: Array.isArray(data) ? data.length : 0,
      normalizedCount: normalized.length,
      preprocessedCount: preprocessed.length,
    })
  }

  return preprocessed
}

