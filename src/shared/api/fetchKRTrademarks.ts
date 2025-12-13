import { isKRTrademarkRawArray } from '@/entities/trademark/model'
import { fetchTrademarksBase } from './fetchTrademarksBase'
import krSample from '../../data/trademarks_kr_sample.json' with { type: 'json' }
import krFull from '../../data/trademarks_kr_trademarks.json' with { type: 'json' }

const KR_DATA_LOADERS = [
  () => Promise.resolve({ default: krSample }),
  () => Promise.resolve({ default: krFull }),
] satisfies ReadonlyArray<() => Promise<{ default: unknown }>>

export async function fetchKRTrademarks() {
  return fetchTrademarksBase({
    country: 'KR',
    loaders: KR_DATA_LOADERS,
    errorMessage: '국내 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
    typeGuard: isKRTrademarkRawArray,
    typeGuardError: '국내 상표 데이터 형식이 올바르지 않습니다.',
  })
}

