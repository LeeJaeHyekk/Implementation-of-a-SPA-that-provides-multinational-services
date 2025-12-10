import { normalizeTrademarks } from '@/entities/trademark/lib'
import { KRTrademarkRaw } from '@/entities/trademark/model'

import { loadLocalJson } from './loadLocalJson'
import krSample from '../../data/trademarks_kr_sample.json' assert { type: 'json' }
import krFull from '../../data/trademarks_kr_trademarks.json' assert { type: 'json' }

const KR_DATA_LOADERS = [
  () => Promise.resolve({ default: krSample as KRTrademarkRaw[] }),
  () => Promise.resolve({ default: krFull as KRTrademarkRaw[] }),
] satisfies ReadonlyArray<() => Promise<{ default: KRTrademarkRaw[] }>>

export async function fetchKRTrademarks() {
  const data = await loadLocalJson<KRTrademarkRaw[]>({
    loaders: KR_DATA_LOADERS,
    errorMessage: '국내 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
  })

  const normalized = normalizeTrademarks({ country: 'KR', items: data })
  globalThis.console?.log?.('[KRFetchDebug]', {
    rawCount: Array.isArray(data) ? data.length : 0,
    normalizedCount: normalized.length,
  })
  return normalized
}

