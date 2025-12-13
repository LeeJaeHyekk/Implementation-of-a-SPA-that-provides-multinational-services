import { isUSTrademarkRawArray } from '@/entities/trademark/model'
import { fetchTrademarksBase } from './fetchTrademarksBase'
import usSample from '../../data/trademarks_us_sample.json' with { type: 'json' }
import usFull from '../../data/trademarks_us_trademarks.json' with { type: 'json' }

const US_DATA_LOADERS = [
  () => Promise.resolve({ default: usSample }),
  () => Promise.resolve({ default: usFull }),
] satisfies ReadonlyArray<() => Promise<{ default: unknown }>>

export async function fetchUSTrademarks() {
  return fetchTrademarksBase({
    country: 'US',
    loaders: US_DATA_LOADERS,
    errorMessage: '미국 상표 데이터 파일을 찾을 수 없습니다. src/data 경로를 확인하세요.',
    typeGuard: isUSTrademarkRawArray,
    typeGuardError: '미국 상표 데이터 형식이 올바르지 않습니다.',
  })
}

