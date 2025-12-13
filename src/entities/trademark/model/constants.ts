import { RegisterStatus, TrademarkCountry } from './types'

export const DEFAULT_REGISTER_STATUS: RegisterStatus = 'unknown'

export const SUPPORTED_COUNTRIES: TrademarkCountry[] = ['KR', 'US']

// 원본 데이터에서 파싱할 때 사용하는 매핑
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

// UI에서 표시할 상태 라벨 (국가별)
export const STATUS_LABELS_KR: Record<RegisterStatus, string> = {
  registered: '등록',
  rejected: '거절',
  pending: '출원',
  expired: '실효',
  live: 'LIVE', // 미국 전용이지만 폴백용
  dead: 'DEAD', // 미국 전용이지만 폴백용
  unknown: '알수없음',
}

export const STATUS_LABELS_US: Record<RegisterStatus, string> = {
  registered: 'Registered', // 한국 전용이지만 폴백용
  rejected: 'Rejected', // 한국 전용이지만 폴백용
  pending: 'Pending', // 한국 전용이지만 폴백용
  expired: 'Expired', // 한국 전용이지만 폴백용
  live: 'LIVE',
  dead: 'DEAD',
  unknown: 'Unknown',
}

// 하위 호환성을 위한 통합 라벨 (기본값: 한국어)
export const STATUS_LABELS: Record<RegisterStatus, string> = STATUS_LABELS_KR

// 국가별로 사용 가능한 상태 목록
export const COUNTRY_STATUS_MAP: Record<TrademarkCountry, RegisterStatus[]> = {
  KR: ['registered', 'pending', 'rejected', 'expired', 'unknown'],
  US: ['live', 'dead', 'unknown'],
}

