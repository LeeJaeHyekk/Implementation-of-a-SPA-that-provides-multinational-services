import { normalizeTrademarks, preprocessTrademarks } from '@/entities/trademark/lib'
import { USTrademarkRaw } from '@/entities/trademark/model'

import { loadLocalJson } from './loadLocalJson'
import usSample from '../../data/trademarks_us_sample.json' with { type: 'json' }
import usFull from '../../data/trademarks_us_trademarks.json' with { type: 'json' }

const US_DATA_LOADERS = [
  () => Promise.resolve({ default: usSample as USTrademarkRaw[] }),
  () => Promise.resolve({ default: usFull as USTrademarkRaw[] }),
] satisfies ReadonlyArray<() => Promise<{ default: USTrademarkRaw[] }>>

export async function fetchUSTrademarks() {
  const data = await loadLocalJson<USTrademarkRaw[]>({
    loaders: US_DATA_LOADERS,
    errorMessage: '미국 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
  })

  const normalized = normalizeTrademarks({ country: 'US', items: data })
  
  // 검색 성능 향상을 위한 전처리
  const preprocessed = preprocessTrademarks(normalized)
  
  return preprocessed
}

