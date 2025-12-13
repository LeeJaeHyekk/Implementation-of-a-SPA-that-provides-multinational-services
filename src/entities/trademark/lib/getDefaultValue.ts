/**
 * 국가별 기본값 반환 유틸리티
 */

import { TrademarkCountry } from '../model/types'

/**
 * 국가에 따라 적절한 언어로 기본값을 반환합니다.
 * @param country - 국가 코드
 * @returns 국가별로 번역된 기본값
 */
export function getDefaultValue(country: TrademarkCountry): string {
  return country === 'KR' ? '미상' : 'Unknown'
}

/**
 * 상표 객체에서 국가별 기본값을 반환합니다.
 * @param trademark - 상표 객체 (country 포함)
 * @returns 국가별로 번역된 기본값
 */
export function getTrademarkDefaultValue(trademark: {
  country: TrademarkCountry
}): string {
  return getDefaultValue(trademark.country)
}

