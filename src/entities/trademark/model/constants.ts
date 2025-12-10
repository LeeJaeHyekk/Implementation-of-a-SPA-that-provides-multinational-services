import { RegisterStatus, TrademarkCountry } from './types'

export const DEFAULT_REGISTER_STATUS: RegisterStatus = 'unknown'

export const SUPPORTED_COUNTRIES: TrademarkCountry[] = ['KR', 'US']

export const KR_STATUS_MAP: Record<string, RegisterStatus> = {
  등록: 'registered',
  실효: 'expired',
  거절: 'rejected',
  출원: 'pending',
}

export const US_STATUS_MAP: Record<string, RegisterStatus> = {
  LIVE: 'live',
  DEAD: 'dead',
}

