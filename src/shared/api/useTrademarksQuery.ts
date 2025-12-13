'use client'

import { useQuery } from '@tanstack/react-query'

import { NormalizedTrademark, TrademarkCountry } from '@/entities/trademark/model'

import { fetchKRTrademarks } from './fetchKRTrademarks'
import { fetchUSTrademarks } from './fetchUSTrademarks'

interface UseTrademarksQueryParams {
  country: TrademarkCountry
}

export function useTrademarksQuery({ country }: UseTrademarksQueryParams) {
  return useQuery<NormalizedTrademark[], Error>({
    queryKey: ['trademarks', country],
    queryFn: async () => {
      // 타입 안전성을 위한 추가 체크
      if (country === 'KR') {
        return await fetchKRTrademarks()
      }
      if (country === 'US') {
        return await fetchUSTrademarks()
      }
      // 예상치 못한 country 값인 경우 에러
      throw new Error(`Unsupported country: ${country}`)
    },
    staleTime: 1000 * 60 * 5,
  })
}

