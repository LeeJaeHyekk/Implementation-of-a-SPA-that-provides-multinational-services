import { TrademarkCountry } from '@/entities/trademark/model'

export const TRADEMARK_COUNTRIES: TrademarkCountry[] = ['KR', 'US']

export const TRADEMARK_DATASETS: Record<TrademarkCountry, string[]> = {
  KR: ['trademarks_kr_sample.json', 'trademarks_kr_trademarks.json'],
  US: ['trademarks_us_sample.json', 'trademarks_us_trademarks.json'],
}

