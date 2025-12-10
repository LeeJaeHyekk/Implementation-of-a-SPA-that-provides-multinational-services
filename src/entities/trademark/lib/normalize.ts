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

  if (country === 'KR') {
    return items.map(parseKR)
  }

  return items.map(parseUS)
}

