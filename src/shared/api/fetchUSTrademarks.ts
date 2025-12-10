import { normalizeTrademarks } from '@/entities/trademark/lib'
import { USTrademarkRaw } from '@/entities/trademark/model'

import { loadLocalJson } from './loadLocalJson'

const US_DATA_LOADERS = [
  () => import('@/data/trademarks_us_sample.json'),
  () => import('@/data/trademarks_us_trademarks.json'),
]

export async function fetchUSTrademarks() {
  const data = await loadLocalJson<USTrademarkRaw[]>({
    loaders: US_DATA_LOADERS,
    errorMessage: '미국 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
  })

  return normalizeTrademarks({ country: 'US', items: data })
}

