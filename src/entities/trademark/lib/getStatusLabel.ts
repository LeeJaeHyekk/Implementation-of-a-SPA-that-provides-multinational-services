/**
 * 국가별 등록 상태 라벨 반환 유틸리티
 */

import { RegisterStatus, TrademarkCountry } from '../model/types'
import { STATUS_LABELS_KR, STATUS_LABELS_US } from '../model/constants'

/**
 * 국가에 따라 적절한 언어로 상태 라벨을 반환합니다.
 * @param status - 등록 상태
 * @param country - 국가 코드
 * @returns 국가별로 번역된 상태 라벨
 */
export function getStatusLabel(status: RegisterStatus, country: TrademarkCountry): string {
  const labels = country === 'KR' ? STATUS_LABELS_KR : STATUS_LABELS_US
  return labels[status] ?? status
}

/**
 * 상표 객체에서 국가별 상태 라벨을 반환합니다.
 * @param trademark - 상표 객체 (country와 registerStatus 포함)
 * @returns 국가별로 번역된 상태 라벨
 */
export function getTrademarkStatusLabel(trademark: {
  country: TrademarkCountry
  registerStatus: RegisterStatus
}): string {
  return getStatusLabel(trademark.registerStatus, trademark.country)
}

