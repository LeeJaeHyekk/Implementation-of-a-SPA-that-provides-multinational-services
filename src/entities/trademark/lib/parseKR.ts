import { KR_STATUS_MAP, DEFAULT_REGISTER_STATUS } from '../model/constants'
import { KRTrademarkRaw } from '../model/countryTypes'
import { NormalizedTrademark, RegisterStatus } from '../model/types'

function normalizeStatus(status?: string): RegisterStatus {
  if (!status) return DEFAULT_REGISTER_STATUS
  const trimmed = status.trim()
  return KR_STATUS_MAP[trimmed] ?? DEFAULT_REGISTER_STATUS
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

function resolveNames(productName?: string | null, productNameEng?: string | null) {
  const kr = normalizeString(productName)
  const en = normalizeString(productNameEng)

  return {
    productName: kr ?? en ?? '미상',
    productNameEng: en ?? undefined,
  }
}

export function parseKR(raw: KRTrademarkRaw): NormalizedTrademark {
  const names = resolveNames(raw.productName, raw.productNameEng)

  return {
    id: `KR-${raw.applicationNumber}`,
    country: 'KR',
    productName: names.productName,
    productNameEng: names.productNameEng,
    applicationNumber: raw.applicationNumber,
    applicationDate: raw.applicationDate ?? null,
    registerStatus: normalizeStatus(raw.registerStatus),
    publicationNumber: normalizeString(raw.publicationNumber),
    publicationDate: normalizeString(raw.publicationDate),
    registrationNumber: normalizeList(raw.registrationNumber),
    registrationDate: normalizeList(raw.registrationDate),
    registrationPubNumber: normalizeString(raw.registrationPubNumber),
    registrationPubDate: normalizeString(raw.registrationPubDate),
    internationalRegNumbers: normalizeList(raw.internationalRegNumbers),
    internationalRegDate: normalizeString(raw.internationalRegDate),
    priorityClaimNumList: normalizeList(raw.priorityClaimNumList),
    priorityClaimDateList: normalizeList(raw.priorityClaimDateList),
    productMainCodes: normalizeList(raw.asignProductMainCodeList),
    productSubCodes: normalizeList(raw.asignProductSubCodeList),
    viennaCodeList: normalizeList(raw.viennaCodeList),
  }
}

