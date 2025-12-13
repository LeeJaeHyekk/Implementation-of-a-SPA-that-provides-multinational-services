import { normalizeTrademarks, preprocessTrademarks } from '@/entities/trademark/lib'
import { isKRTrademarkRawArray } from '@/entities/trademark/model'

import { loadLocalJson } from './loadLocalJson'
import krSample from '../../data/trademarks_kr_sample.json' with { type: 'json' }
import krFull from '../../data/trademarks_kr_trademarks.json' with { type: 'json' }

const KR_DATA_LOADERS = [
  () => Promise.resolve({ default: krSample }),
  () => Promise.resolve({ default: krFull }),
] satisfies ReadonlyArray<() => Promise<{ default: unknown }>>

export async function fetchKRTrademarks() {
  const rawData = await loadLocalJson<unknown>({
    loaders: KR_DATA_LOADERS,
    errorMessage: '국내 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
  })

  // 타입 가드로 런타임 검증
  if (!isKRTrademarkRawArray(rawData)) {
    throw new Error('국내 상표 데이터 형식이 올바르지 않습니다.')
  }

  // 타입 가드를 통과했으므로 타입이 이미 좁혀짐
  const data = rawData

  const normalized = normalizeTrademarks({ country: 'KR', items: data })
  
  // 검색 성능 향상을 위한 전처리
  const preprocessed = preprocessTrademarks(normalized)
  
  globalThis.console?.log?.('[KRFetchDebug]', {
    rawCount: Array.isArray(data) ? data.length : 0,
    normalizedCount: normalized.length,
    preprocessedCount: preprocessed.length,
  })
  return preprocessed
}

