'use client'

import { useQuery } from '@tanstack/react-query'

import { NormalizedTrademark, TrademarkCountry } from '@/entities/trademark/model'

import { fetchKRTrademarks } from './fetchKRTrademarks'
import { fetchUSTrademarks } from './fetchUSTrademarks'

interface UseTrademarksQueryParams {
  country: TrademarkCountry
}

export function useTrademarksQuery({ country }: UseTrademarksQueryParams) {
  return useQuery<NormalizedTrademark[]>({
    queryKey: ['trademarks', country],
    queryFn: country === 'KR' ? fetchKRTrademarks : fetchUSTrademarks,
    staleTime: 1000 * 60 * 5,
  })
}

