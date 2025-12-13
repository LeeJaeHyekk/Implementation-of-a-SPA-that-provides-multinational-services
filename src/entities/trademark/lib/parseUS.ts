import { DEFAULT_REGISTER_STATUS, US_STATUS_MAP } from '../model/constants'
import { USTrademarkRaw } from '../model/countryTypes'
import { NormalizedTrademark, RegisterStatus } from '../model/types'
import { normalizeList, normalizeString, normalizeRequiredString } from './normalizers'

function normalizeStatus(status?: string): RegisterStatus {
  if (!status || typeof status !== 'string') return DEFAULT_REGISTER_STATUS
  const trimmed = status.trim()
  if (trimmed.length === 0) return DEFAULT_REGISTER_STATUS
  const upper = trimmed.toUpperCase()
  return US_STATUS_MAP[upper] ?? DEFAULT_REGISTER_STATUS
}

export function parseUS(raw: USTrademarkRaw): NormalizedTrademark {
  return {
    id: `US-${raw.applicationNumber}`,
    country: 'US',
    productName: normalizeRequiredString(raw.productName),
    applicationNumber: raw.applicationNumber,
    applicationDate: raw.applicationDate ?? null,
    registerStatus: normalizeStatus(raw.registerStatus),
    publicationDate: normalizeString(raw.publicationDate),
    registrationNumber: normalizeList(raw.registrationNumber),
    registrationDate: normalizeList(raw.registrationDate),
    internationalRegNumbers: normalizeList(raw.internationalRegNumbers),
    internationalRegDate: normalizeString(raw.internationalRegDate),
    priorityClaimNumList: normalizeList(raw.priorityClaimNumList),
    priorityClaimDateList: normalizeList(raw.priorityClaimDateList),
    productMainCodes: normalizeList(raw.asignProductMainCodeList),
    usClassCodes: normalizeList(raw.usClassCodeList),
    viennaCodeList: normalizeList(raw.viennaCodeList),
  }
}

