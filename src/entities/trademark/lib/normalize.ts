import { parseKR } from './parseKR'
import { parseUS } from './parseUS'
import { KRTrademarkRaw, USTrademarkRaw } from '../model/countryTypes'
import { TrademarkCountry, NormalizedTrademark } from '../model/types'

interface NormalizeArgs {
  country: TrademarkCountry
  items: KRTrademarkRaw[] | USTrademarkRaw[]
}

export function normalizeTrademarks({ country, items }: NormalizeArgs): NormalizedTrademark[] {
  if (!items?.length) return []

  if (country === 'KR') {
    return (items as KRTrademarkRaw[]).map(parseKR)
  }

  return (items as USTrademarkRaw[]).map(parseUS)
}

