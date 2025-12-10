'use client'

import { create } from 'zustand'

import { TrademarkCountry } from '@/entities/trademark/model'

interface CountryState {
  country: TrademarkCountry
  setCountry: (country: TrademarkCountry) => void
}

export const useCountryStore = create<CountryState>((set) => ({
  country: 'KR',
  setCountry: (country) => set({ country }),
}))
