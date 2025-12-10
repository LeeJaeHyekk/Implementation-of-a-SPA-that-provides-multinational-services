import { normalizeTrademarks } from '@/entities/trademark/lib'
import { KRTrademarkRaw } from '@/entities/trademark/model'

import { loadLocalJson } from './loadLocalJson'

const KR_DATA_LOADERS = [
  () => import('@/data/trademarks_kr_sample.json'),
  () => import('@/data/trademarks_kr_trademarks.json'),
]

export async function fetchKRTrademarks() {
  const data = await loadLocalJson<KRTrademarkRaw[]>({
    loaders: KR_DATA_LOADERS,
    errorMessage: '국내 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
  })

  return normalizeTrademarks({ country: 'KR', items: data })
}

