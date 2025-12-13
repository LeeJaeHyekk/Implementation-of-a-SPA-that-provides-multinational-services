import { parseKR } from './parseKR'
import { parseUS } from './parseUS'
import { KRTrademarkRaw, USTrademarkRaw } from '../model/countryTypes'
import { NormalizedTrademark } from '../model/types'

type NormalizeArgs =
  | {
      country: 'KR'
      items: KRTrademarkRaw[]
    }
  | {
      country: 'US'
      items: USTrademarkRaw[]
    }

export function normalizeTrademarks({ country, items }: NormalizeArgs): NormalizedTrademark[] {
  if (!items?.length) return []

  globalThis.console?.log?.('[Normalize]', {
    country,
    inputCount: items.length,
  })

  const result: NormalizedTrademark[] = []

  if (country === 'KR') {
    const krItems = items as KRTrademarkRaw[]
    for (const item of krItems) {
      try {
        result.push(parseKR(item))
      } catch (error) {
        globalThis.console?.warn?.('[Normalize] Failed to parse KR item', { item, error })
        // 개별 항목 파싱 실패 시 해당 항목만 제외하고 계속 진행
        continue
      }
    }
    return result
  }

  if (country === 'US') {
    const usItems = items as USTrademarkRaw[]
    for (const item of usItems) {
      try {
        result.push(parseUS(item))
      } catch (error) {
        globalThis.console?.warn?.('[Normalize] Failed to parse US item', { item, error })
        // 개별 항목 파싱 실패 시 해당 항목만 제외하고 계속 진행
        continue
      }
    }
    return result
  }

  // 예상치 못한 country 값
  globalThis.console?.error?.('[Normalize] Unsupported country', { country })
  return []
}

