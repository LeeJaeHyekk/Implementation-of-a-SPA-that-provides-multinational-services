import { KR_STATUS_MAP, DEFAULT_REGISTER_STATUS } from '../model/constants'
import { KRTrademarkRaw } from '../model/countryTypes'
import { NormalizedTrademark, RegisterStatus } from '../model/types'
import { normalizeList, normalizeString } from './normalizers'

function normalizeStatus(status?: string): RegisterStatus {
  if (!status || typeof status !== 'string') return DEFAULT_REGISTER_STATUS
  const trimmed = status.trim()
  if (trimmed.length === 0) return DEFAULT_REGISTER_STATUS
  return KR_STATUS_MAP[trimmed] ?? DEFAULT_REGISTER_STATUS
}

interface ResolvedNames {
  productName: string
  productNameEng?: string
}

function resolveNames(productName?: string | null, productNameEng?: string | null): ResolvedNames {
  const kr = normalizeString(productName)
  const en = normalizeString(productNameEng)

  // 한국 데이터이므로 항상 '미상' 사용
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

