import { DEFAULT_REGISTER_STATUS, US_STATUS_MAP } from '../model/constants'
import { USTrademarkRaw } from '../model/countryTypes'
import { NormalizedTrademark, RegisterStatus } from '../model/types'

function normalizeStatus(status?: string): RegisterStatus {
  if (!status) return DEFAULT_REGISTER_STATUS
  const upper = status.trim().toUpperCase()
  return US_STATUS_MAP[upper] ?? DEFAULT_REGISTER_STATUS
}

function normalizeList(value?: Array<string | null> | null): string[] {
  if (!value) return []
  return value.filter((item): item is string => Boolean(item))
}

function normalizeString(value?: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function normalizeRequiredString(value?: string | null): string {
  if (!value) return '미상'
  const trimmed = value.trim()
  return trimmed.length ? trimmed : '미상'
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

