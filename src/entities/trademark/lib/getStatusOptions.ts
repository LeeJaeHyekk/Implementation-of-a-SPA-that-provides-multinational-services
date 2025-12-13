import { RegisterStatus, TrademarkCountry } from '../model/types'
import { COUNTRY_STATUS_MAP, STATUS_LABELS } from '../model/constants'

export interface StatusOption {
  value: RegisterStatus | 'all'
  label: string
}

/**
 * 국가에 따라 사용 가능한 상태 옵션을 동적으로 반환합니다.
 * 새로운 국가를 추가할 때는 constants.ts의 COUNTRY_STATUS_MAP만 수정하면 됩니다.
 *
 * @param country - 국가 코드 (KR, US 등)
 * @returns 해당 국가에서 사용 가능한 상태 옵션 배열
 */
export function getStatusOptionsForCountry(country: TrademarkCountry): StatusOption[] {
  const availableStatuses = COUNTRY_STATUS_MAP[country] ?? []
  
  // '전체' 옵션을 맨 앞에 추가
  const options: StatusOption[] = [
    { value: 'all', label: '전체' },
  ]
  
  // 해당 국가에서 사용 가능한 상태들을 옵션으로 추가
  for (const status of availableStatuses) {
    const label = STATUS_LABELS[status]
    if (label) {
      options.push({ value: status, label })
    }
  }
  
  return options
}

